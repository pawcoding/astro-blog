import { createEffect } from "solid-js";
import { getUserMessage } from "../../utils/generate-summary";
import { createSummaryChatDemo } from "./generate-summary-demo";

/**
 * Component that displays a chat popup
 */
export default function ChatDemo() {
  const { messages, availability, isGenerating, generateSummary } =
    createSummaryChatDemo();

  // Always scroll to the bottom when messages are added or updated
  createEffect(() => {
    messages();
    isGenerating();

    const scrollContainer = document.querySelector(".demo-scroll-container");
    scrollContainer?.scrollTo({
      top: scrollContainer.scrollHeight,
      behavior: "smooth",
    });
  });

  const showSummaryButtons = () =>
    availability() !== "downloading" || availability() !== "unavailable";
  const showSkeleton = () =>
    isGenerating() && messages().at(-1)?.actor === "user";

  return (
    <div class="not-prose flex h-auto flex-col gap-4 overflow-hidden rounded-lg bg-white p-4 shadow-sm dark:border dark:border-neutral-700 dark:bg-neutral-800 dark:shadow-none">
      <section class="demo-scroll-container max-h-128 space-y-4 overflow-y-auto">
        {messages().map((message) => (
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
                  "markdown rounded-xl border border-neutral-200 bg-neutral-100 p-2 dark:border-neutral-600 dark:bg-neutral-700 " +
                  (message.actor === "user"
                    ? "rounded-tr-none"
                    : "rounded-tl-none")
                }
                innerHTML={message.content}
              />
            </div>
          </div>
        ))}

        {showSkeleton() && (
          <div role="status" class="w-full animate-pulse">
            <div class="mx-auto h-3 w-4/5 rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
            <span class="sr-only">Generating response...</span>
          </div>
        )}
      </section>

      {showSummaryButtons() && (
        <menu class="flex flex-wrap justify-center gap-2">
          {(
            ["tldr", "key-points", "teaser"] satisfies Array<SummarizerType>
          ).map((type) => (
            <button
              onClick={() => generateSummary(type)}
              class="cursor-pointer rounded-full bg-blue-500 px-3 py-1 text-white"
            >
              {getUserMessage(type)}
            </button>
          ))}
        </menu>
      )}
    </div>
  );
}
