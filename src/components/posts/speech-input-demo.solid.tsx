import { HiOutlineMicrophone, HiOutlineStop } from "solid-icons/hi";
import { createSignal, onCleanup, Show } from "solid-js";
import { createLinkedSignal } from "../../utils/create-linked-signal";

/**
 * Represents the possible statuses of the speech input.
 */
type SpeechInputStatus = "idle" | "recording" | "transcribing";

/**
 * A demo component for handling speech input using the Web Speech API.
 */
export default function SpeechInputDemo() {
  /**
   * The current status of the speech input.
   */
  const [status, setStatus] = createSignal<SpeechInputStatus>("idle");

  /**
   * The current value of the user's message input.
   */
  const [lastUserMessage, setLastUserMessage] = createSignal<string>("");

  /**
   * The live transcript.
   */
  const [transcript, setTranscript] = createSignal<string>("");

  /**
   * The current value of the user's message input, including the live transcript if available.
   */
  const [userMessage, setUserMessage] = createLinkedSignal(() => {
    const userMessage = lastUserMessage();
    const currentTranscript = transcript();

    if (currentTranscript) {
      return [userMessage, currentTranscript]
        .map((part) => part.trim())
        .filter(Boolean)
        .join("\n");
    }

    return userMessage.trim();
  });

  /**
   * The constructor for the SpeechRecognition object, compatible with different browsers.
   */
  const Recognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  /**
   * The current error message, if any.
   */
  const [error, setError] = createSignal<string | undefined>(
    Recognition
      ? undefined
      : "Speech recognition is not supported by this browser.",
  );

  /**
   * The instance of the SpeechRecognition object, or null if not supported by the browser.
   */
  const recognition = Recognition ? new Recognition() : undefined;
  if (recognition) {
    recognition.continuous = true; // Keep recording until explicitly stopped
    recognition.lang = "en-US"; // Set the language for speech recognition to English
    recognition.interimResults = true; // Enable receiving interim results

    // Read status updates
    recognition.onspeechstart = () => {
      setStatus("transcribing");
    };
    recognition.onend = () => {
      setStatus("idle");
    };
    recognition.onerror = (event) => {
      if (event.error !== "no-speech" && event.error !== "aborted") {
        setError(event.message);
      }

      recognition.abort();
      setStatus("idle");
    };

    // Handle recognition results
    recognition.onresult = (event) => {
      const result = Array.from(
        event.results,
        (result) => result[0].transcript,
      ).join("");
      setTranscript(result);
    };
  }

  /**
   * Automatically abort speech recognition when the component is destroyed.
   */
  onCleanup(() => {
    recognition?.abort();
  });

  /**
   * Start the speech recognition recording.
   */
  function startRecording(): void {
    if (!recognition) {
      return;
    }

    setLastUserMessage(userMessage());
    setTranscript("");

    recognition.start();
    setStatus("recording");
    setError(undefined);
  }

  /**
   * Stop the speech recognition recording.
   */
  function stopRecording(): void {
    recognition?.stop();
  }

  return (
    <div>
      <div class="relative block">
        <textarea
          value={userMessage()}
          onInput={(event) => setUserMessage(event.target.value)}
          readonly={status() !== "idle"}
          class="block w-full resize-none rounded border-2 border-neutral-200 bg-white p-2 read-only:bg-neutral-50 dark:border-neutral-800 dark:bg-black dark:read-only:bg-neutral-950"
          placeholder={
            status() === "idle"
              ? "Use the microphone button to activate speech input for this field"
              : "Start speaking..."
          }
          rows={5}
        ></textarea>

        <button
          disabled={!Recognition}
          onClick={() =>
            status() === "idle" ? startRecording() : stopRecording()
          }
          class="group absolute right-2 bottom-2 flex size-10 cursor-pointer items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:bg-neutral-400 dark:disabled:bg-neutral-700"
          aria-pressed={status() !== "idle"}
          title={
            Recognition
              ? status() === "idle"
                ? "Start recording"
                : "Stop recording"
              : "Speech recognition not supported"
          }
        >
          <Show
            when={status() === "idle"}
            fallback={
              <HiOutlineStop
                size="1.5rem"
                aria-hidden="true"
                class="hidden group-aria-pressed:block"
              />
            }
          >
            <HiOutlineMicrophone
              size="1.5rem"
              aria-hidden="true"
              class="group-aria-pressed:hidden"
            />
          </Show>

          <span class="sr-only">
            {status() === "idle" ? "Start recording" : "Stop recording"}
          </span>
        </button>
      </div>

      <Show when={error()}>
        <div class="mt-2 text-sm text-red-600">{error()}</div>
      </Show>
    </div>
  );
}
