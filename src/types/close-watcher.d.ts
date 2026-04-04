// Type declarations for the CloseWatcher API
// https://developer.mozilla.org/en-US/docs/Web/API/CloseWatcher

interface CloseWatcherOptions {
  signal?: AbortSignal;
}

declare class CloseWatcher extends EventTarget {
  constructor(options?: CloseWatcherOptions);

  /**
   * Acts as if a close request was sent targeting this watcher.
   * Fires a `cancel` event first (cancelable only when the page has
   * history-action activation). If not prevented, fires the `close` event
   * and deactivates the watcher.
   */
  requestClose(): void;

  /**
   * Immediately fires the `close` event and deactivates the watcher.
   * Bypasses the `cancel` event entirely.
   */
  close(): void;

  /**
   * Deactivates the watcher without firing any events.
   */
  destroy(): void;

  /** Fired when a close request targets this watcher. Cancelable when the page has history-action activation. */
  oncancel: ((this: CloseWatcher, ev: Event) => unknown) | null;

  /** Fired after a non-prevented `cancel` event, or immediately when `close()` is called. */
  onclose: ((this: CloseWatcher, ev: Event) => unknown) | null;

  addEventListener(
    type: "cancel",
    listener: (this: CloseWatcher, ev: Event) => unknown,
    options?: boolean | AddEventListenerOptions,
  ): void;
  addEventListener(
    type: "close",
    listener: (this: CloseWatcher, ev: Event) => unknown,
    options?: boolean | AddEventListenerOptions,
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;

  removeEventListener(
    type: "cancel",
    listener: (this: CloseWatcher, ev: Event) => unknown,
    options?: boolean | EventListenerOptions,
  ): void;
  removeEventListener(
    type: "close",
    listener: (this: CloseWatcher, ev: Event) => unknown,
    options?: boolean | EventListenerOptions,
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void;
}

declare var CloseWatcher:
  | {
      prototype: CloseWatcher;
      new (options?: CloseWatcherOptions): CloseWatcher;
    }
  | undefined;
