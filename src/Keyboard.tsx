import React from "react";
import { SoundKey } from "./sound";

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
  ["z", "x", "c", "v", "b", "n", "m"],
];

const KEYBOARD_BASE_STYLE = "flex flex-col gap-1 p-2";
const KEYBOARD_ROW_BASE_STYLE = "flex flex-row gap-1";

const makeKeys = (layout: KeyboardLayout, keyInfo?: (head: String) => string) =>
  layout.map((row, index) => (
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
  ));

export const SoundKeyboard = () => {
  let keys = makeKeys(SOUND_KEYBOARD_LAYOUT);
  return <div className={`${KEYBOARD_BASE_STYLE}`}>{keys}</div>;
};

export interface EnglishKeyboardProps {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

export const EnglishKeyboard = ({ onChange, value }: EnglishKeyboardProps) => {
  let keys = makeKeys(ENGLISH_KEYBOARD_LAYOUT);
  return (
    <div>
      <input
        className="border-b-2 w-sm mx-auto text-center"
        type="text"
        value={value}
        onChange={onChange}
      />
      <div className={`${KEYBOARD_BASE_STYLE}`}>{keys}</div>
    </div>
  );
};

const KEY_BASE_STYLE =
  "rounded-md pt-1 pb-1.5 bg-gray-300 flex-1 text-center flex flex-col leading-none select-none";
const KEY_HEAD_STYLE = "pb-0.5";
const KEY_IPA_STYLE = "text-xs opacity-75 leading-none";

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
