import DOMPurify from "dompurify";
import { marked } from "marked";
import { HiSolidSparkles } from "solid-icons/hi";
import { createEffect, createMemo, createSignal } from "solid-js";

type ChatMessage = {
  id: string;
  actor: "ai" | "user";
  content: string;
};

export default function Chat() {
  if (!("Summarizer" in self)) {
    return null;
  }

  const [isOpen, setIsOpen] = createSignal(true);
  const [messages, setMessages] = createSignal<Array<ChatMessage>>([
    {
      id: crypto.randomUUID(),
      actor: "ai",
      content:
        "Hey there 👋!\n\nI'm an AI assistant 🤖 running **offline inside your browser** and have access to this post. I can help you summarize it for you.",
    },
  ]);

  // Always scroll to the bottom when messages are added or updated
  createEffect(() => {
    messages();

    const scrollContainer = document.querySelector(".scroll-container");
    scrollContainer?.scrollTo({
      top: scrollContainer.scrollHeight,
      behavior: "smooth",
    });
  });

  const parsedMessages = createMemo(() => {
    return messages().map((message) => ({
      ...message,
      content: DOMPurify.sanitize(
        marked(message.content, { async: false, gfm: true }),
      ),
    }));
  });

  function addMessage(actor: "ai" | "user", content: string): string {
    const id = crypto.randomUUID();
    setMessages([...messages(), { id, actor, content }]);
    return id;
  }

  function updateMessage(id: string, content: string): void {
    setMessages(
      messages().map((message) =>
        message.id === id ? { ...message, content } : message,
      ),
    );
  }

  async function generateSummary(
    type: "tldr" | "teaser" | "key-points",
  ): Promise<void> {
    addMessage(
      "user",
      type === "tldr"
        ? "Give me a TLDR"
        : type === "key-points"
          ? "Give me key points"
          : "What's the most interesting part?",
    );

    // @ts-expect-error - Summarizer is not typed (yet)
    const summarizer = await Summarizer.create({
      sharedContext:
        "This is a blog about different web development topics and little programming experiments",
      type,
      format: "markdown",
      length: type === "tldr" ? "long" : "medium",
    });

    const messageId = addMessage("ai", "Generating summary...");

    // @ts-expect-error - innerText is available so it's fine
    const postContent = document.querySelector(".post-container")?.innerText;
    const stream = summarizer.summarizeStreaming(postContent);
    let output = "";
    for await (const chunk of stream) {
      output += chunk;
      updateMessage(messageId, output);
    }
  }

  return (
    <article class="fixed right-4 bottom-4 flex flex-col items-end gap-4">
      {isOpen() && (
        <div class="flex w-96 flex-col gap-4 rounded-lg bg-white p-4 shadow-sm dark:border dark:border-neutral-700 dark:bg-neutral-800 dark:shadow-none">
          <section class="scroll-container max-h-128 space-y-4 overflow-y-auto">
            {parsedMessages().map((message) => (
              <div
                class={
                  "flex items-start gap-2.5 " +
                  (message.actor === "user" ? "flex-row-reverse" : "")
                }
              >
                <span class="flex size-10 items-center justify-center rounded-full bg-blue-200 text-sm dark:bg-neutral-900">
                  {message.actor === "ai" ? "🤖" : "👤"}
                </span>

                <div class="flex w-full flex-col gap-1">
                  <span class="text-sm font-semibold text-neutral-900 dark:text-white">
                    {message.actor === "user" ? "Me" : "Summarizer"}
                  </span>
                  <div
                    class={
                      "rounded-xl border border-neutral-200 bg-neutral-100 p-4 dark:border-neutral-600 dark:bg-neutral-700 " +
                      (message.actor === "user"
                        ? "rounded-tr-none"
                        : "rounded-tl-none")
                    }
                    innerHTML={message.content}
                  />
                </div>
              </div>
            ))}
          </section>

          <section class="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => generateSummary("tldr")}
              class="cursor-pointer rounded-full bg-blue-500 px-3 py-1 text-white"
            >
              Give me a TLDR
            </button>

            <button
              onClick={() => generateSummary("key-points")}
              class="cursor-pointer rounded-full bg-blue-500 px-3 py-1 text-white"
            >
              Give me some key points
            </button>

            <button
              onClick={() => generateSummary("teaser")}
              class="cursor-pointer rounded-full bg-blue-500 px-3 py-1 text-white"
            >
              What's the most interesting part?
            </button>
          </section>
        </div>
      )}

      <button
        class="cursor-pointer rounded-full bg-blue-500 p-3 text-white"
        onClick={() => setIsOpen(!isOpen())}
      >
        <HiSolidSparkles size="2rem" />
      </button>
    </article>
  );
}
