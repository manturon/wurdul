import { useState } from "react";
import { PhonemeKey, phonemes } from "./game/english";

function PhonemeBlock({ of }: { of: PhonemeKey }) {
  const { key, ipa } = phonemes[of]!;
  return (
    <div className="phoneme-block">
      <span>{ipa}</span>
    </div>
  );
}

function randomPhonemes(n: number) {
  const definitions = Object.keys(PhonemeKey) as (keyof typeof PhonemeKey)[];
  const indices = new Array(n);
  for (const [i] of indices.entries()) {
    indices[i] =
      PhonemeKey[definitions[Math.floor(Math.random() * definitions.length)]!];
  }
  return indices as PhonemeKey[];
}

const dictionary: Record<string, string[]> = await fetch(
  new URL("./dictionary/all.json", import.meta.url),
).then((res) => (res.status === 200 ? res.json() : null));

function lookup(key: string) {
  const result = dictionary[key]?.concat() ?? []; // copy
  const normalized = normalizeTextForLookup(key);
  if (normalized !== key) {
    // append results for normalized key
    const resultNormalized = dictionary[normalized];
    if (resultNormalized) {
      result.push(...resultNormalized);
    }
  }
  // remove duplicated
  return Array.from(new Set(result));
}

function normalizeTextForLookup(s: string) {
  return s.replaceAll(/['-]+/g, "");
}

function normalizeTextForInput(s: string) {
  return s
    .replaceAll(/[^A-Za-z'-]+/g, "")
    .replaceAll(/''+/g, "'") // remove multiple apostrophes
    .replaceAll(/--+/g, "-") // remove multiple dashes
    .replaceAll(/-'+/g, "-")
    .replaceAll(/'\-+/g, "'")
    .replace(/^-/, "") // remove initial dash
    .toLowerCase();
}

export function App() {
  const [input, setInput] = useState("");
  const [currentChoice, setCurrentChoice] = useState(0);

  let pronunciations = lookup(input);

  return (
    <div className="game">
      <div className="blocks">
        <div className="line">
          {randomPhonemes(5).map((p, i) => (
            <PhonemeBlock key={i} of={p} />
          ))}
        </div>
        <div className="line">
          {randomPhonemes(5).map((p, i) => (
            <PhonemeBlock key={i} of={p} />
          ))}
        </div>
        <div className="line">
          {randomPhonemes(5).map((p, i) => (
            <PhonemeBlock key={i} of={p} />
          ))}
        </div>
        <div className="line">
          {randomPhonemes(5).map((p, i) => (
            <PhonemeBlock key={i} of={p} />
          ))}
        </div>
        <div className="line">
          {randomPhonemes(5).map((p, i) => (
            <PhonemeBlock key={i} of={p} />
          ))}
        </div>
        <div className="line">
          {randomPhonemes(5).map((p, i) => (
            <PhonemeBlock key={i} of={p} />
          ))}
        </div>
        <hr />
        <div className="line">
          {Array.from(pronunciations[currentChoice] ?? "").map((p, i) => (
            <PhonemeBlock of={p as PhonemeKey} key={i} />
          ))}
        </div>
      </div>
      <div className="input">
        <input
          type="text"
          value={input}
          onKeyDown={(event) => {
            if (/^\d$/.test(event.key)) {
              const n = parseInt(event.key);
              if (Number.isFinite(n) && n > 0 && n <= pronunciations.length) {
                setCurrentChoice(n - 1);
              }
            }
          }}
          onChange={({ target }) => {
            if (!("value" in target) || typeof target.value !== "string") {
              return;
            }
            const newValue = normalizeTextForInput(target.value);
            if (input === newValue) {
              return;
            }
            setInput(newValue);
            // target.setSelectionRange(target.selectionStart, target.selectionStart); // avoid resetting cursor
            setCurrentChoice(0);
          }}
        />

        {pronunciations.length > 1 && (
          <div className="blocks">
            <ol>
              {pronunciations.map((pr, i) => (
                <li
                  key={i}
                  className={`choice ${i === currentChoice ? "chosen" : ""}`}>
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
