import React, { Ref, useContext, useEffect, useState } from "react";
import Block from "./Block";
import { englishDictionary } from "./dictionary";
import { Match } from "./game";
import { SoundKey, WordSounds } from "./sound";
import { keyGoesDown, keyGoesUp } from "./util";
import { GameContext } from "./Wurdul";

export type Key<T> = T | null | [head: T | null, width: number];
export type KeyboardLayout<T = string> = Key<T>[][];

export enum InputMode {
  /**
   * The player inputs sounds directly.
   */
  SOUNDS,
  /**
   * The player enters words from which the sounds input are derived.
   */
  ENGLISH,
}

const SOUND_KEYBOARD_LAYOUT: KeyboardLayout<SoundKey> = [
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
const ENGLISH_KEYBOARD_LAYOUT: KeyboardLayout = [
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

export interface KeyboardProps {
  initialInputMode: InputMode;
}

const soundChoicesForEnglish = (english: string, lengthBias: number) => {
  let sounds = englishDictionary.wordSounds(english);
  if (sounds.length) {
    if (sounds.length > 1) {
      // Put the most likely solution on top
      let sorted = new Array<WordSounds>();
      for (let sound of sounds) {
        if (sound.length === lengthBias) {
          sorted.unshift(sound);
        } else {
          sorted.push(sound);
        }
      }
      sounds = sorted;
    }
    return sounds;
  } else {
    return [];
  }
};

export const Keyboard = ({ initialInputMode }: KeyboardProps) => {
  let [gameState, gameActionDispatcher] = useContext(GameContext);
  let [inputMode, setInputMode] = useState(initialInputMode);
  let [english, setEnglish] = useState("");
  let [currentSoundChoice, setCurrentSoundChoice] = useState(0);

  if (inputMode === InputMode.ENGLISH) {
    let choices = soundChoicesForEnglish(english, gameState.columns);
    let choiceListRows = choices.map((choice, index) =>
      makeChoiceBlocks(choice, gameState.columns, index === currentSoundChoice)
    );

    let handleOnChange: React.ChangeEventHandler<HTMLInputElement> = ({
      target,
    }) => {
      // Only allow alphabetic, dash and apostrophe characters
      let value = target.value?.toLowerCase().replace(/[^'a-z-]/g, "");
      setEnglish(value);
      setCurrentSoundChoice(0);
    };

    let handleKeyDown: React.KeyboardEventHandler = (event) => {
      if (keyGoesUp(event.key)) {
        setCurrentSoundChoice((current) =>
          choices.length ? Math.max(current - 1, 0) : current
        );
      } else if (keyGoesDown(event.key)) {
        setCurrentSoundChoice((current) =>
          choices.length ? Math.min(current + 1, choices.length - 1) : current
        );
      }
    };

    return (
      <div>
        <input
          type="text"
          value={english}
          onChange={handleOnChange}
          onKeyDown={handleKeyDown}
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
      </div>
    );
  }

  return <div></div>
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
