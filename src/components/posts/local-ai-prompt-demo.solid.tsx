import { Show, createSignal, type JSX } from "solid-js";

declare global {
  interface Window {
    ai: {
      createTextSession: () => Promise<ChromeAISession>;
    };
  }
}

type ChromeAISession = {
  promptStreaming: (prompt: string) => ReadableStream<string>;
};

export default function LocalAiPromptDemo(props: { children?: JSX.Element }) {
  const isAvailable = !!window.ai;

  const [prompt, setPrompt] = createSignal("");
  const [response, setResponse] = createSignal("");
  const [error, setError] = createSignal("");
  const [generating, setGenerating] = createSignal(false);
  let session: ChromeAISession | undefined = undefined;

  async function run() {
    if (generating()) return;
    setGenerating(true);
    setError("");

    try {
      if (!session) {
        session = await window.ai.createTextSession();
      }

      setResponse("");
      const start = Date.now();
      console.info("Generating response...");

      const stream = session.promptStreaming(
        prompt() + "\n\nResponse in 3 to 5 sentences.",
      );
      // @ts-ignore - This actually works so I don't know why it's complaining
      for await (const chunk of stream) {
        setResponse(chunk);
      }

      console.info("Generated response in", Date.now() - start, "ms");
    } catch (e: any) {
      setError(e.message || e);
      console.error(e);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <section class="flex flex-col gap-4 p-4 bg-white border-neutral-200 dark:border-neutral-800 shadow-sm dark:shadow-none rounded-md dark:bg-black">
      <Show
        when={isAvailable}
        fallback={
          <>
            <span class="text-sm italic mb-2">
              This demo is only available when you activated the AI with the
              instructions in the last chapter. Depending on your browser or
              device it may not be available at all.
              <br />
              <br />
              Currently the demo is not available so here is a screenshot
              instead:
            </span>

            {props.children}
          </>
        }
      >
        <div class="flex gap-2">
          <input
            type="search"
            disabled={generating()}
            value={prompt()}
            onInput={(e) => setPrompt(e.currentTarget.value)}
            class="grow bg-neutral-100 rounded px-3 py-1 dark:bg-neutral-600"
            placeholder="Enter your prompt here..."
            onKeyDown={(e) => {
              e.key === "Enter" && run();
            }}
          />
          <button
            disabled={generating()}
            onClick={() => run()}
            class="bg-neutral-200 rounded px-3 py-1 dark:bg-neutral-700"
          >
            Run
          </button>
        </div>

        <Show when={response() || generating()}>
          <div class="text-neutral-600 dark:text-neutral-300">
            <span class="block font-semibold text-lg">Response:</span>
            <Show when={response()}>
              <span>{response()}</span>
            </Show>
            <Show when={generating()}>
              <span>...</span>
            </Show>
          </div>
        </Show>

        <Show when={error()}>
          <div class="text-red-500 dark:text-red-400">
            <span class="block font-semibold text-lg">
              There was an error when generating the response. Please try again
              or write me a message. Maybe the API changed in the meantime.
            </span>
            <span class="text-sm italic">"{error()}"</span>
          </div>
        </Show>
      </Show>
    </section>
  );
}
