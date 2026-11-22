import type { Accessor, Setter } from "solid-js";
import { createMemo, createSignal } from "solid-js";

/**
 * Creates a linked signal that maintains a previous value and updates it using the provided function.
 *
 * Can be replaces once the project is updates to Solid.js 2.0, in which signals support computations natively.
 */
export function createLinkedSignal<T>(
  fn: (prev?: T) => T,
): [Accessor<T>, Setter<T>] {
  let prev: T | undefined;
  const pair = createMemo(() => {
    prev = fn(prev);
    return createSignal<T>(prev);
  });

  const get: Accessor<T> = () => pair()[0]();
  const set: Setter<T> = ((v: unknown) => {
    const next = (pair()[1] as (val: unknown) => T)(v);
    prev = next as T;
    return next;
  }) as Setter<T>;

  return [get, set];
}
