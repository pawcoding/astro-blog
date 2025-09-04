import DOMPurify from "dompurify";
import { marked } from "marked";
import { createSignal } from "solid-js";
import type {
  Availability,
  SummarizerInstance,
  SummaryType,
} from "../types/summarizer";

/**
 * Message to be displayed in the chat
 */
export type ChatMessage = {
  /**
   * Unique id of the message
   */
  id: string;
  /**
   * Actor that sent the message
   */
  actor: "ai" | "user";
  /**
   * Content of the message (already parsed and sanitized)
   */
  content: string;
};

export type SummaryChat = {
  messages: () => Array<ChatMessage>;
  availability: () => Availability | undefined;
  downloadProgress: () => number;
  isGenerating: () => boolean;
  generateSummary: (type: SummaryType) => Promise<void>;
};

export function createSummaryChat(): SummaryChat {
  const [availability, setAvailability] = createSignal<
    Availability | undefined
  >(undefined);
  const [downloadProgress, setDownloadProgress] = createSignal(0);
  const [isGenerating, setIsGenerating] = createSignal(false);
  const [messages, setMessages] = createSignal<Array<ChatMessage>>([
    {
      id: crypto.randomUUID(),
      actor: "ai",
      content: parseMarkdown(
        "Hey there 👋!\n\nI'm an AI assistant 🤖 running **offline inside your browser** and have access to this post. I can help you summarize it for you.",
      ),
    },
  ]);
  let abortController: AbortController | undefined;
  const summarizers = new Map<SummaryType, SummarizerInstance>();

  async function createSummarizer(
    type: SummaryType,
  ): Promise<SummarizerInstance | undefined> {
    if (summarizers.has(type)) {
      return summarizers.get(type);
    }

    try {
      const availability = await window.Summarizer.availability();
      setAvailability(availability);

      if (availability === "unavailable") {
        setMessages((messages) => [
          ...messages,
          {
            id: crypto.randomUUID(),
            actor: "ai",
            content: parseMarkdown(
              "Sorry, I'm not available right now 😢.\n\nPlease try again later.",
            ),
          },
        ]);
        return undefined;
      }

      const summarizer = await window.Summarizer.create({
        sharedContext:
          "This is a blog about different web development topics and little programming experiments.\nWhen creating a summary, make sure to include some emojis to make it more engaging.",
        type,
        format: "markdown",
        length: type === "tldr" ? "long" : "medium",
        monitor: (monitor) => {
          monitor.addEventListener("downloadprogress", (event) => {
            const progress = event.loaded / event.total;

            if (availability !== "available") {
              if (progress > 0) {
                setAvailability("downloading");
              } else if (progress === 1) {
                setAvailability("available");
              }
            }

            setDownloadProgress(progress);
          });
        },
      });

      if (summarizer) {
        summarizers.set(type, summarizer);
      }

      return summarizer;
    } catch (error) {
      console.error("Error creating Summarizer:", error);

      setMessages((messages) => [
        ...messages,
        {
          id: crypto.randomUUID(),
          actor: "ai",
          content: parseMarkdown(
            "Sorry, seems like I crashed 😵.\n\nPlease try again later.",
          ),
        },
      ]);

      return undefined;
    }
  }

  async function generateSummary(type: SummaryType): Promise<void> {
    if (abortController) {
      abortController.abort("New summary was requested");
    }

    setMessages((messages) => [
      ...messages,
      {
        id: crypto.randomUUID(),
        actor: "user",
        content: getUserMessage(type),
      },
    ]);
    setIsGenerating(true);

    const summarizer = await createSummarizer(type);
    if (!summarizer) {
      return;
    }

    try {
      // @ts-expect-error - innerText is available so it's fine
      const postContent = document.querySelector(".post-container")?.innerText;

      abortController = new AbortController();
      const stream = summarizer.summarizeStreaming(postContent, {
        signal: abortController.signal,
      });

      let content = "";
      let messageId = "";
      for await (const chunk of stream) {
        content += chunk;

        if (!messageId) {
          messageId = crypto.randomUUID();
          setMessages((messages) => [
            ...messages,
            {
              id: messageId,
              actor: "ai",
              content: parseMarkdown(content),
            },
          ]);
        } else {
          setMessages((messages) =>
            messages.map((message) =>
              message.id === messageId
                ? { ...message, content: parseMarkdown(content) }
                : message,
            ),
          );
        }
      }
    } catch (error) {
      console.error("Error generating summary:", error);

      setMessages((messages) => [
        ...messages,
        {
          id: crypto.randomUUID(),
          actor: "ai",
          content: parseMarkdown(
            "Sorry, seems like I crashed 😵.\n\nPlease try again later.",
          ),
        },
      ]);
    }

    abortController = undefined;
    setIsGenerating(false);
  }

  return {
    messages,
    availability,
    downloadProgress,
    isGenerating,
    generateSummary,
  };
}

export function getUserMessage(type: SummaryType): string {
  switch (type) {
    case "tldr":
      return "Give me a TLDR";
    case "key-points":
      return "Give me the key points";
    case "teaser":
      return "What's the most interesting part?";
    default:
      return "";
  }
}

export function parseMarkdown(markdown: string): string {
  const html = marked(markdown, { async: false, gfm: true });
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["p", "br", "strong", "em", "code", "pre", "ul", "ol", "li"],
  });
}
