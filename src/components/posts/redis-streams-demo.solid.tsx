import {
  createEffect,
  createMemo,
  createSignal,
  For,
  Index,
  onCleanup,
} from "solid-js";

type Entry = {
  id: number;
  processingStart?: number;
  completedAt?: number;
  failedAt?: number;
};

type Consumer = {
  id: string;
  idleSince?: number;
  entries: Array<Entry>;
  shutdown: boolean;
};

export default function RedisStreamsDemo() {
  const [stream, setStream] = createSignal<Array<Entry>>([]);
  const [consumers, setConsumers] = createSignal<Array<Consumer>>([]);
  const [autoSpawn, setAutoSpawn] = createSignal(false);

  const hasEntries = createMemo(() => {
    if (stream().length > 0) {
      return true;
    }

    if (consumers().length < 1) {
      return false;
    }

    return consumers().some((consumer) => consumer.entries.length > 0);
  });

  let timeout: ReturnType<typeof setTimeout> | undefined = undefined;
  let spawnInterval: number | undefined = undefined;
  onCleanup(() => {
    reset();
  });

  createEffect(() => {
    if (!autoSpawn()) {
      clearInterval(spawnInterval);
      spawnInterval = undefined;
      return;
    }

    // @ts-expect-error - I hate interval return types
    spawnInterval = setInterval(() => {
      if (Math.random() < 0.1) {
        addEntryToStream();
      }
    }, 200);
  });

  /**
   * Add a new entry to the stream and start processing
   */
  function addEntryToStream() {
    const entry: Entry = {
      id: Date.now(),
    };
    setStream((prev) => [...prev, entry]);

    process();
  }

  /**
   * Add a new consumer to the group and start processing
   */
  function addConsumer() {
    const consumer: Consumer = {
      id: crypto.randomUUID(),
      idleSince: Date.now(),
      entries: [],
      shutdown: false,
    };
    setConsumers((prev) => [...prev, consumer]);

    process();
  }

  /**
   * Shutdown the consumer with the given ID.
   * If the consumer has no entries it is removed directly.
   * Otherwise it is marked for shutdown and will be removed after processing
   */
  function shutdownConsumer(consumerId: string) {
    setConsumers((prev) =>
      prev
        .map((consumer) => {
          if (consumer.id !== consumerId) {
            return consumer;
          }

          if (consumer.entries.length > 0) {
            return { ...consumer, shutdown: true };
          }

          return undefined;
        })
        .filter((consumer) => !!consumer),
    );
  }

  /**
   * Reset the simulation
   */
  function reset() {
    setStream([]);
    setConsumers([]);
    setAutoSpawn(false);

    if (timeout) {
      clearTimeout(timeout);
      timeout = undefined;
    }

    if (spawnInterval) {
      clearInterval(spawnInterval);
      spawnInterval = undefined;
    }
  }

  /**
   * Process the stream by running a tick in the simulation
   */
  function process() {
    // Skip processing if there is already a new tick scheduled or if there are no consumers
    if (timeout || consumers().length < 1) {
      return;
    }

    const now = Date.now();
    // Create new references for consumers and stream
    let updatedConsumers = consumers().map((consumer) => ({
      ...consumer,
    }));
    const updatedStream = [...stream()];

    for (const consumer of updatedConsumers) {
      // Update entries of the consumer
      consumer.entries = consumer.entries
        // Delete completed entries after 8 seconds
        .filter(
          (entry) => !entry.completedAt || now < entry.completedAt + 8_000,
        )
        .map<Entry>((entry) => {
          const inProgress = !entry.completedAt && !entry.failedAt;

          // Randomly fail entries with a probability of 0.2% per tick
          if (inProgress && Math.random() < 0.002) {
            return { ...entry, failedAt: now };
          }

          // Complete entries after 5 seconds
          if (inProgress && now > entry.processingStart! + 5_000) {
            return { ...entry, completedAt: now };
          }

          return entry;
        });

      // Update the idle status of the consumer if it just finished processing all entries
      if (
        !consumer.idleSince &&
        !consumer.entries.some(
          (entry) => !entry.completedAt && !entry.failedAt,
        ) &&
        !consumer.shutdown
      ) {
        // Set idleSince to now + 1 second
        consumer.idleSince = now + 1_000;
      }
    }

    // Remove shutdown consumers without pending entries
    updatedConsumers = updatedConsumers.filter((consumer) => {
      const isShutDown = consumer.shutdown && consumer.entries.length < 1;
      return !isShutDown;
    });

    // Get all idle consumers sorted by longest idle time
    const idleConsumers = updatedConsumers
      .filter((consumer) => consumer.idleSince && now > consumer.idleSince)
      .toSorted((a, b) => a.idleSince! - b.idleSince!);

    // Create list of all failed entries sorted by oldest failure time
    const errorMap = new Map<Entry, Consumer>();
    const failedEntries = updatedConsumers
      .flatMap((consumer) => {
        // Check for entries that are failed at least 2 seconds ago
        const failedEntries = consumer.entries.filter(
          (entry) => entry.failedAt && now > entry.failedAt + 2000,
        );

        // Build a map of failed entries to their consumers for easier PEL removal
        for (const entry of failedEntries) {
          errorMap.set(entry, consumer);
        }

        return failedEntries;
      })
      .sort((a, b) => a.failedAt! - b.failedAt!);

    // Distribute failed and new entries to idle consumers
    for (const consumer of idleConsumers) {
      // Recover failed entries
      if (failedEntries.length > 0) {
        const entry = failedEntries.shift()!;

        // Remove failed entry from consumer
        const failedConsumer = errorMap.get(entry)!;
        failedConsumer.entries = failedConsumer.entries.filter(
          (e) => e.id !== entry.id,
        );

        // Assign failed entry to new consumer
        consumer.entries.unshift({
          ...entry,
          failedAt: undefined,
          processingStart: now,
        });
        consumer.idleSince = undefined;
        continue;
      }

      // Assign new entries to idle consumers
      if (updatedStream.length > 0) {
        const entry = updatedStream.shift()!;
        consumer.entries.unshift({
          ...entry,
          processingStart: now,
        });
        consumer.idleSince = undefined;
      }
    }

    // Update simulation state for rendering
    setConsumers(updatedConsumers);
    setStream(updatedStream);

    // When the simulation still has entries, schedule the next frame
    if (hasEntries()) {
      timeout = setTimeout(() => {
        clearTimeout(timeout);
        timeout = undefined;
        requestAnimationFrame(() => process());
      }, 50);
    }
  }

  return (
    <div class="contrast-more:dark:border-white; flex flex-col gap-4 rounded-md border-neutral-200 bg-white p-4 shadow-sm contrast-more:border-2 contrast-more:border-black dark:border-neutral-800 dark:shadow-none">
      <section class="grid h-100 grid-cols-3 gap-4 max-xs:grid-cols-1 max-xs:grid-rows-[auto_1fr]">
        <div class="flex h-full flex-wrap content-start gap-2 overflow-y-auto rounded-2xl border-2 border-blue-700 bg-blue-200 p-2 max-xs:h-18">
          <For each={stream()}>
            {() => (
              <span class="block size-12 shrink-0 rounded-full border-2 border-purple-700 bg-purple-300"></span>
            )}
          </For>
        </div>

        <div class="flex h-full flex-col gap-2 overflow-y-auto rounded-2xl border-2 border-orange-700 bg-orange-200 p-2 xs:col-span-2">
          <Index each={consumers()}>
            {(consumer) => (
              <div
                class="flex h-16 w-full shrink-0 items-center gap-2 rounded-xl border-2 border-yellow-600 bg-yellow-200 p-2"
                classList={{ "bg-gray-200/50!": consumer().shutdown }}
              >
                <div class="flex grow gap-2 overflow-x-auto">
                  <For each={consumer().entries}>
                    {(entry) => (
                      <span
                        class="block size-12 shrink-0 rounded-full border-2 border-purple-700 bg-purple-300"
                        classList={{
                          "border-red-700 bg-red-200": !!entry.failedAt,
                          "border-green-700! bg-green-200!":
                            !!entry.completedAt,
                        }}
                      ></span>
                    )}
                  </For>
                </div>

                <button
                  class="size-12 rounded-lg bg-yellow-300/50 text-3xl font-bold text-yellow-600 not-disabled:cursor-pointer not-disabled:hover:bg-yellow-300"
                  disabled={consumer().shutdown}
                  onMouseDown={() => shutdownConsumer(consumer().id)}
                  title="Shutdown consumer"
                >
                  &times;
                </button>
              </div>
            )}
          </Index>
        </div>
      </section>

      <section class="flex flex-wrap justify-center gap-2">
        <button
          class="cursor-pointer rounded-lg border-2 border-purple-700 bg-purple-300 px-2 py-1 text-purple-700"
          onClick={() => addEntryToStream()}
        >
          + Entry
        </button>

        <button
          class="cursor-pointer rounded-lg border-2 border-purple-700 bg-purple-300 px-2 py-1 text-purple-700"
          onClick={() => setAutoSpawn((prev) => !prev)}
        >
          {autoSpawn() ? "Stop Auto Spawn" : "Start Auto Spawn"}
        </button>

        <button
          class="cursor-pointer rounded-lg border-2 border-yellow-600 bg-yellow-200 px-2 py-1 text-yellow-600"
          onClick={() => addConsumer()}
        >
          + Consumer
        </button>

        <button
          class="cursor-pointer rounded-lg border-2 border-red-600 bg-red-200 px-2 py-1 text-red-600"
          onClick={() => reset()}
        >
          Reset
        </button>
      </section>
    </div>
  );
}
