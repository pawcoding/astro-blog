import { HiSolidSparkles, HiSolidXMark } from "solid-icons/hi";
import { createEffect, createSignal } from "solid-js";
import { createSummaryChat, getUserMessage } from "../utils/generate-summary";

/**
 * Component that displays a chat popup
 */
export default function Chat() {
  if (!("Summarizer" in self)) {
    return null;
  }

  const [isOpen, setIsOpen] = createSignal(false);
  const {
    messages,
    availability,
    downloadProgress,
    isGenerating,
    generateSummary,
  } = createSummaryChat();

  // Always scroll to the bottom when messages are added or updated
  createEffect(() => {
    messages();
    isGenerating();

    const scrollContainer = document.querySelector(".scroll-container");
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
    <article class="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-4 print:hidden">
      {isOpen() && (
        <div class="flex h-auto w-96 flex-col gap-4 overflow-hidden rounded-lg bg-white p-4 shadow-sm transition-all transition-discrete duration-500 motion-reduce:duration-0 contrast-more:border-2! contrast-more:border-black dark:border dark:border-neutral-700 dark:bg-neutral-800 dark:shadow-none contrast-more:dark:border-white contrast-more:dark:bg-black starting:h-0">
          <section class="scroll-container max-h-128 space-y-4 overflow-y-auto">
            {messages().map((message) => (
              <div
                class={
                  "flex items-start gap-2.5 " +
                  (message.actor === "user" ? "flex-row-reverse" : "")
                }
              >
                <span class="flex size-10 items-center justify-center rounded-full bg-blue-200 text-sm dark:bg-neutral-900 contrast-more:dark:bg-white">
                  {message.actor === "ai" ? "🤖" : "👤"}
                </span>

                <div class="flex w-full flex-col gap-1">
                  <span class="text-sm font-semibold text-neutral-900 dark:text-white">
                    {message.actor === "user" ? "Me" : "Summarizer"}
                  </span>
                  <div
                    class={
                      "markdown rounded-xl border border-neutral-200 bg-neutral-100 p-2 contrast-more:border-2 contrast-more:border-black contrast-more:bg-white dark:border-neutral-600 dark:bg-neutral-700 contrast-more:dark:border-white contrast-more:dark:bg-black " +
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

            {availability() === "downloading" && (
              <div>
                <p>Downloading model...</p>
                <div class="h-2.5 w-full rounded-full bg-neutral-200 dark:bg-neutral-700">
                  <div
                    class="h-2.5 rounded-full bg-blue-600"
                    style={`width: ${Math.floor(downloadProgress() * 100)}%`}
                  ></div>
                </div>
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
      )}

      <button
        class="cursor-pointer rounded-full bg-blue-500 p-3 text-white"
        onClick={() => setIsOpen(!isOpen())}
      >
        {isOpen() ? (
          <HiSolidXMark size="2rem" />
        ) : (
          <HiSolidSparkles size="2rem" />
        )}
        <span class="sr-only">Toggle summarizer</span>
      </button>
    </article>
  );
}
