import { HiSolidSparkles, HiSolidXMark } from "solid-icons/hi";
import { createEffect, createSignal, For, Index, Show } from "solid-js";
import { createSummaryChat, userMessages } from "../utils/generate-summary";

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
      <Show when={isOpen()}>
        <div
          class="flex h-auto w-96 flex-col gap-4 overflow-hidden rounded-lg bg-white p-4 shadow-sm transition-all transition-discrete duration-500 motion-reduce:duration-0 contrast-more:border-2! contrast-more:border-black dark:border dark:border-neutral-700 dark:bg-neutral-800 dark:shadow-none contrast-more:dark:border-white contrast-more:dark:bg-black starting:h-0"
          role="dialog"
          aria-label="Article summarizer chat"
        >
          <section
            class="scroll-container max-h-128 space-y-4 overflow-y-auto"
            role="log"
            aria-live="polite"
            aria-busy={isGenerating() ? "true" : "false"}
            aria-atomic="false"
          >
            <For each={messages()}>
              {(message) => (
                <div
                  class={
                    "flex items-start gap-2.5 " +
                    (message.actor === "user" ? "flex-row-reverse" : "")
                  }
                  role="article"
                  aria-label={`${message.actor === "user" ? "Your message" : "AI response"}`}
                >
                  <span
                    class="flex size-10 items-center justify-center rounded-full bg-blue-200 text-sm dark:bg-neutral-900 contrast-more:dark:bg-white"
                    aria-hidden="true"
                  >
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
              )}
            </For>

            <Show when={showSkeleton()}>
              <div role="status" class="w-full animate-pulse">
                <div class="mx-auto h-3 w-4/5 rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
                <span class="sr-only">Generating response...</span>
              </div>
            </Show>

            <Show when={availability() === "downloading"}>
              <div role="status" aria-live="polite">
                <p>Downloading model...</p>
                <div class="h-2.5 w-full rounded-full bg-neutral-200 dark:bg-neutral-700">
                  <div
                    class="h-2.5 rounded-full bg-blue-600"
                    style={`width: ${Math.floor(downloadProgress() * 100)}%`}
                    role="progressbar"
                    aria-valuenow={Math.floor(downloadProgress() * 100)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Model download progress"
                  ></div>
                </div>
              </div>
            </Show>
          </section>

          <Show when={showSummaryButtons()}>
            <menu
              class="flex flex-wrap justify-center gap-2"
              role="group"
              aria-label="Summary type options"
            >
              <Index
                each={
                  [
                    "tldr",
                    "key-points",
                    "teaser",
                  ] satisfies Array<SummarizerType>
                }
              >
                {(type) => (
                  <button
                    onClick={() => generateSummary(type())}
                    class="cursor-pointer rounded-full bg-blue-500 px-3 py-1 text-white"
                    disabled={isGenerating()}
                    aria-label={`Generate ${userMessages[type()]} summary`}
                  >
                    {userMessages[type()]}
                  </button>
                )}
              </Index>
            </menu>
          </Show>
        </div>
      </Show>

      <button
        class="cursor-pointer rounded-full bg-blue-500 p-3 text-white"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen() ? "Close summarizer" : "Open summarizer"}
        aria-expanded={isOpen()}
      >
        <Show
          when={isOpen()}
          fallback={<HiSolidSparkles size="2rem" aria-hidden="true" />}
        >
          <HiSolidXMark size="2rem" aria-hidden="true" />
        </Show>
        <span class="sr-only">
          {isOpen() ? "Close summarizer" : "Open summarizer"}
        </span>
      </button>
    </article>
  );
}
