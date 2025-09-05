declare global {
  interface Window {
    Summarizer: Summarizer;
  }
}

export type Availability =
  | "available"
  | "unavailable"
  | "downloadable"
  | "downloading";

export type SummaryType = "headline" | "key-points" | "teaser" | "tldr";

export interface SummarizerOptions {
  format: "markdown";
  length: "short" | "medium" | "long";
  monitor: (monitor: {
    addEventListener: (
      event: "downloadprogress",
      callback: (event: { loaded: number; total: number }) => void,
    ) => void;
  }) => void;
  sharedContext: string;
  type: SummaryType;
}

export interface SummarizerInstance {
  summarizeStreaming: (
    input: string,
    options: { signal: AbortSignal },
  ) => ReadableStream<string>;
}

export interface Summarizer {
  availability: () => Promise<Availability>;
  create: (options: SummarizerOptions) => Promise<SummarizerInstance>;
}
