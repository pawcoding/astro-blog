import { createSignal } from "solid-js";
import "./color-wheel-demo.solid.css";

export default function ColorWheelDemo() {
  let tracked = false;
  const [wheel, setWheel] = createSignal(10);
  const [hue, setHue] = createSignal(5);

  function updateWheel(value: number) {
    if (!tracked) {
      window._paq?.push(["trackEvent", "Demo", "Color Wheel", "Interact"]);
      tracked = true;
    }

    setWheel(value);

    if (value < 120) {
      setHue((0.5 * value) % 360);
    } else if (value < 180) {
      setHue((value + 300) % 360);
    } else if (value < 240) {
      setHue((2 * value + 120) % 360);
    } else {
      setHue(value % 360);
    }
  }

  function updateHue(value: number) {
    if (!tracked) {
      window._paq?.push(["trackEvent", "Demo", "Color Wheel", "Interact"]);
      tracked = true;
    }

    setHue(value);

    if (value < 60) {
      setWheel((value * 2) % 360);
    } else if (value < 120) {
      setWheel((value + 60) % 360);
    } else if (value < 240) {
      setWheel((0.5 * value + 120) % 360);
    } else {
      setWheel(value % 360);
    }
  }

  return (
    <section class="flex flex-col gap-4 rounded-md border-neutral-200 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-black dark:shadow-none">
      <div class="wheel">
        <label class="text-lg font-semibold" for="wheel">
          Degree on color wheel: {Math.round(wheel())}°
        </label>
        <input
          style={{ "--wheel": hue() }}
          class="block"
          id="wheel"
          min={0}
          max={359}
          value={wheel()}
          onInput={(e) => updateWheel(e.currentTarget.valueAsNumber)}
          step={1}
          type="range"
        />
      </div>

      <div class="hue">
        <label class="text-lg font-semibold" for="hue">
          Hue on HSL: {Math.round(hue())}°
        </label>
        <input
          style={{ "--hue": hue() }}
          class="mb-2 block"
          id="hue"
          min={0}
          max={359}
          value={hue()}
          onInput={(e) => updateHue(e.currentTarget.valueAsNumber)}
          step={1}
          type="range"
        />
      </div>
    </section>
  );
}
