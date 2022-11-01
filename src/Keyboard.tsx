import React, { PropsWithChildren } from "react";
import { Sound, SOUNDS } from "./sound";

export const KEYBOARD_LAYOUT: (string | null | [string | null, number])[][] = [
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

const KEYBOARD_BASE_STYLE = "flex flex-col gap-1 p-2";
const KEYBOARD_ROW_BASE_STYLE = "flex flex-row gap-1";

export const Keyboard = () => {
  let keys = KEYBOARD_LAYOUT.map((row, index) => {
    return (
      <div key={index} className={`${KEYBOARD_ROW_BASE_STYLE}`}>
        {row.map((head, jndex) => {
          let width: number | undefined = undefined;
          let value;
          if (Array.isArray(head)) {
            width = head[1] as number;
            value = head[0] as string | null;
          } else {
            value = head;
          }

          if (value === null) {
            return <SoundKey key={jndex} width={width} />;
          } else {
            let sound = SOUNDS.get(value);
            return <SoundKey key={jndex} width={width} sound={sound} />;
          }
        })}
      </div>
    );
  });
  return <div className={`${KEYBOARD_BASE_STYLE}`}>{keys}</div>;
};

const KEY_BASE_STYLE = "rounded-md pt-1 pb-1.5 bg-gray-300 flex-1 text-center flex flex-col leading-none select-none";
const KEY_HEAD_STYLE = "pb-0.5";
const KEY_IPA_STYLE = "text-xs opacity-75 leading-none";

export interface SoundKeyProps {
  sound?: Sound | null | undefined;
  width?: number;
}

export const SoundKey = ({ width = 1, sound = null }: SoundKeyProps) => {
  if (sound) {
    let top = sound.name;
    let ipa = sound.ipa[0];
    return <div className={`${KEY_BASE_STYLE}`} style={{ flexGrow: width }}><b className={KEY_HEAD_STYLE}>{top}</b><small className={KEY_IPA_STYLE}>{ipa}</small></div>
  } else {
    return (
      <div className={`${KEY_BASE_STYLE}`} style={{ flexGrow: width }}></div>
    );
  }
};

export default Keyboard;
