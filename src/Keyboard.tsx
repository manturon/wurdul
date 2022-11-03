import React, { Ref, useEffect } from "react";
import Block from "./Block";
import { Match } from "./game";
import { SoundKey, WordSounds } from "./sound";

export type Key<T> = T | null | [head: T | null, width: number];
export type KeyboardLayout<T = string> = Key<T>[][];

export const SOUND_KEYBOARD_LAYOUT: KeyboardLayout<SoundKey> = [
  [
    ["eer", 2],
    "ar",
    "or",
    "ire",
    "our",
    ["err", 3],
    "oir",
    ["oor", 2],
    // "ure",
    "ur",
  ],
  [
    "i",
    "ee",
    ["ah", 2],
    "oh",
    "eye",
    "ow",
    "a",
    "e",
    "ay",
    "oy",
    "oo",
    "uu",
    // "ew",
    "uh",
  ],
  ["b", "d", "g", "s", "sh", "ch", "f", "h", "th"],
  ["p", "t", "k", "z", "zh", "j", ["v", 2], "dh"],
  ["l", "r", "w", "y", "m", "n", "ng"],
];
export const ENGLISH_KEYBOARD_LAYOUT: KeyboardLayout = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["ENTER", "z", "x", "c", "v", "b", "n", "m", "DEL"],
];

const KEYBOARD_BASE_STYLE = "flex flex-col gap-2 p-2";
const KEYBOARD_ROW_BASE_STYLE = "flex flex-row gap-2";

const makeKeys = (
  layout: KeyboardLayout,
  keyInfo?: (head: String) => string
) => {
  return layout.map((row, index) => {
    return (
      <div key={index} className={`${KEYBOARD_ROW_BASE_STYLE}`}>
        {row.map((key, jndex) => {
          let [head, width] = Array.isArray(key) ? key : [key, undefined];
          if (head) {
            let sub = keyInfo ? keyInfo(head) : undefined;
            return <Key key={jndex} head={head} sub={sub} width={width} />;
          } else {
            return <Key key={jndex} width={width} />;
          }
        })}
      </div>
    );
  });
};

export const SoundKeyboard = () => {
  let keys = makeKeys(SOUND_KEYBOARD_LAYOUT);
  return <div></div> /*<div className={`${KEYBOARD_BASE_STYLE}`}>{keys}</div>*/;
};

export interface EnglishKeyboardProps {
  value: string;
  choices: WordSounds[];
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  currentChoice: number;
  maxColumns: number;
  inputRef: Ref<HTMLInputElement>;
}

const makeChoiceBlocks = (
  wordSounds: WordSounds,
  maxBlocks: number,
  isCurrent: boolean
) =>
  wordSounds.map((sound, index) => (
    <Block
      small={true}
      key={index}
      info={sound.ipa}
      head={sound.name}
      guessMatch={isCurrent && index < maxBlocks ? Match.MATCH : undefined}
    />
  ));

export const EnglishKeyboard = ({
  onChange,
  choices,
  currentChoice,
  value,
  maxColumns,
  inputRef,
}: EnglishKeyboardProps) => {
  let keys = makeKeys(ENGLISH_KEYBOARD_LAYOUT);
  let choiceListRows = choices.map((choice, index) =>
    makeChoiceBlocks(choice, maxColumns, index === currentChoice)
  );
  return (
    <div className="flex flex-col justify-center">
      <input
        className="border-b-2 w-sm mx-auto text-center focus:outline-none h-8 font-medium text-xl mt-8 uppercase mb-4"
        type="text"
        value={value}
        onChange={onChange}
        ref={inputRef}
      />
      <div className="h-full w-full mx-auto p-2 h-32">
        <ul className="flex flex-col gap-2">
          {choiceListRows.map((choice, index) => (
            <li className="flex flex-row gap-0.5" key={index}>
              {choice}
            </li>
          ))}
        </ul>
      </div>
      {/*<div className={`${KEYBOARD_BASE_STYLE}`}>{keys}</div>*/}
    </div>
  );
};

const KEY_BASE_STYLE =
  "rounded-sm px-2 h-16 bg-gray-200 text-gray-800 flex-1 text-center flex flex-col leading-none select-none justify-center";
const KEY_HEAD_STYLE = "text-xl font-normal";
const KEY_IPA_STYLE = "text-xs opacity-75 leading-none";

const keyStyleMap = {
  [Match.NO_MATCH]: "",
  [Match.SOME_MATCH]: "",
  [Match.MATCH]: "",
};

export interface KeyProps {
  head?: string;
  sub?: string;
  width?: number;
}

export const Key = ({
  head = undefined,
  sub = undefined,
  width = 1,
}: KeyProps) => {
  if (head) {
    return (
      <div className={`${KEY_BASE_STYLE}`} style={{ flexGrow: width }}>
        <b className={KEY_HEAD_STYLE}>{head}</b>
        {sub ? <small className={KEY_IPA_STYLE}>{sub}</small> : null}
      </div>
    );
  } else {
    return (
      <div className={`${KEY_BASE_STYLE}`} style={{ flexGrow: width }}></div>
    );
  }
};
