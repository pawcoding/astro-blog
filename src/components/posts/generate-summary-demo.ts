import { createSignal } from "solid-js";
import {
  getUserMessage,
  parseMarkdown,
  type ChatMessage,
  type SummaryChat,
} from "../../utils/generate-summary";

const DEMO_SUMMARIES: Record<SummarizerType, string> = {
  "key-points": `* Google Chrome has a built-in AI Summarizer API that allows users to summarize web pages locally without sending data to external AI providers. 🤖
* The API is accessible via a ✨ button in the browser's bottom-right corner, offering TLDR, key points, teaser, and headline summaries. 📰
* The API requires downloading a model (around 4GB) and is not yet perfectly stable across all devices. 💻
* The implementation involves a Chat Component for user interaction and Chat Management for state handling (availability, download progress, generation). 💬
* Future development aims for broader browser support, improved models, and expanded AI capabilities like interactive chat. 🚀`,
  teaser: `✨ Build an AI-powered local summarizer chat directly in your browser using Chrome's new Summarizer API! 🚀 This blog post dives into the implementation, covering chat components, state management, and real-time streaming. Discover how to create a seamless user experience for summarizing articles offline – no external AI providers needed! 🤖`,
  tldr: `Google Chrome now has a built-in AI Summarizer ✨! 🤖 It summarizes web pages *locally*, meaning it runs on your device without sending data to external AI providers.  You can access it via a button in the bottom-right corner. It offers different summary styles (TLDR, key points, teaser) and lets you customize the length. The API is still experimental and can be unstable, but it's a cool way to quickly get the gist of articles.  Developers can use the API to build AI features into their own websites.`,
  headline: "",
};

export function createSummaryChatDemo(): SummaryChat {
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

  async function generateSummary(type: SummarizerType): Promise<void> {
    setMessages((messages) => [
      ...messages,
      {
        id: crypto.randomUUID(),
        actor: "user",
        content: getUserMessage(type),
      },
    ]);
    setIsGenerating(true);

    await new Promise((resolve) => setTimeout(resolve, 2500));

    const summary = DEMO_SUMMARIES[type];
    const words = summary.split(" ");

    let content = "";
    let messageId = "";
    for (const chunk of words) {
      content += `${chunk} `;

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

      const wait = Math.random() * 100 + 50;
      await new Promise((resolve) => setTimeout(resolve, wait));
    }

    setIsGenerating(false);
  }

  return {
    messages,
    availability: () => "available",
    downloadProgress: () => 1,
    isGenerating,
    generateSummary,
  };
}
