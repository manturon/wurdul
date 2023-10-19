import { render } from "preact";
import { useState } from "preact/hooks";
import { PhonemeKey, phonemes } from "./game/english";
import "./style/global.css";

function PhonemeBlock({ of }) {
  const { key, ipa } = phonemes[of];
  return (
    <div class="phoneme-block">
      <span>{ipa}</span>
    </div>
  );
}

function randomPhonemes(n: number) {
  const definitions = Object.keys(PhonemeKey) as (keyof typeof PhonemeKey)[];
  const indices = new Array(n);
  for (const [i] of indices.entries()) {
    indices[i] =
      PhonemeKey[definitions[Math.floor(Math.random() * definitions.length)]];
  }
  return indices as PhonemeKey[];
}

const dictionary: Record<string, string[]> = await fetch(
  new URL("./dictionary/all.json", import.meta.url),
).then((res) => (res.status === 200 ? res.json() : null));

function App() {
  const [input, setInput] = useState("");
  const [currentChoice, setCurrentChoice] = useState(0);

  let pronunciations = dictionary[input.toLowerCase()] ?? [];

  return (
    <div class="game">
      <div class="blocks">
        <div class="line">
          {randomPhonemes(5).map((p) => (
            <PhonemeBlock of={p} />
          ))}
        </div>
        <div class="line">
          {randomPhonemes(5).map((p) => (
            <PhonemeBlock of={p} />
          ))}
        </div>
        <div class="line">
          {randomPhonemes(5).map((p) => (
            <PhonemeBlock of={p} />
          ))}
        </div>
        <div class="line">
          {randomPhonemes(5).map((p) => (
            <PhonemeBlock of={p} />
          ))}
        </div>
        <div class="line">
          {randomPhonemes(5).map((p) => (
            <PhonemeBlock of={p} />
          ))}
        </div>
        <div class="line">
          {randomPhonemes(5).map((p) => (
            <PhonemeBlock of={p} />
          ))}
        </div>
        <hr />
        <div class="line">
          {Array.from(pronunciations[currentChoice] ?? "").map((p) => (
            <PhonemeBlock of={p} />
          ))}
        </div>
      </div>
      <div class="input">
        <input
          type="text"
          value={input}
          onKeyDown={(event) => {
            if (/^\d$/.test(event.key)) {
              const n = parseInt(event.key);
              if (Number.isFinite(n) && n > 0 && n <= pronunciations.length) {
                setCurrentChoice(n - 1);
              }
              event.preventDefault();
            }
          }}
          onInput={({ target }) => {
            if (!("value" in target) || typeof target.value !== "string") {
              return;
            }
            if (target.value === input) {
              return;
            }
            setInput(target.value);
            setCurrentChoice(0);
          }}
        />

        {pronunciations.length > 1 && (
          <div class="blocks">
            <ol>
              {pronunciations.map((pr, i) => (
                <li class={`choice ${i === currentChoice ? "chosen" : ""}`}>
                  <span>{pr}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}

const root = document.getElementById("app");
render(<App />, root);
