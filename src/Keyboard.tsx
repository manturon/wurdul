import React, { useContext, useEffect, useState } from "react";
import Block from "./Block";
import { DICTIONARY, GameEvent, getSoundMatchStatus, Match, SoundMatchStatus } from "./game";
import { SoundKey, WordSound } from "./sound";
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

/**
 * Return an array of the sounds for a word, sorted with the ones with
 * a particular length first.
 */
const soundChoicesForEnglish = (english: string, lengthBias: number) => {
  let sounds = DICTIONARY.wordSounds(english);
  if (sounds.length) {
    if (sounds.length > 1) {
      // Put the most likely solution on top
      let sorted = new Array<WordSound>();
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

const makeChoiceBlocks = (
  wordSounds: WordSound,
  matchMap: SoundMatchStatus,
  maxBlocks: number,
  isCurrent: boolean
) =>
  wordSounds.map((sound, index) => (
    <Block
      small={true}
      key={index}
      info={sound.ipa}
      head={sound.name}
      input={!isCurrent}
      guessMatch={matchMap.get(sound)}
    />
  ));

export interface KeyboardProps {
  initialInputMode: InputMode;
}

/**
 * An input method for the player to input words or sounds.
 */
export const Keyboard = ({ initialInputMode }: KeyboardProps) => {
  let [gameState, gameActionDispatcher] = useContext(GameContext);

  let [inputMode, setInputMode] = useState(initialInputMode);
  // The current English word to get sounds from, if in english input mode
  let [english, setEnglish] = useState("");
  // The currently selected sound choice, in case there's more than one for a word
  let [currentSoundChoice, setCurrentSoundChoice] = useState(0);

  let choices =
    inputMode === InputMode.ENGLISH
      ? soundChoicesForEnglish(english, gameState.columns)
      : [];
  let matchMap = 
    inputMode === InputMode.ENGLISH
    ? getSoundMatchStatus(gameState.history) : new Map();
  let choiceListRows = choices.map((choice, index) =>
    makeChoiceBlocks(choice, matchMap, gameState.columns, index === currentSoundChoice)
  );

  // Is this the ideal way to do this?
  useEffect(() => {
    // Sets the input shown on the board
    gameActionDispatcher({
      type: GameEvent.Input,
      input: choices[currentSoundChoice],
    });
  }, [currentSoundChoice, english]);

  if (gameState.gameOver) {
    return <div></div>;
  }

  if (inputMode === InputMode.ENGLISH) {
    // English keyboard

    // Handle the text field changing
    let handleOnChange: React.ChangeEventHandler<HTMLInputElement> = ({
      target,
    }) => {
      // Only allow alphabetic, dash and apostrophe characters
      let value = target.value?.toLowerCase().replace(/[^'a-z-]/g, "");
      setEnglish(value);
      setCurrentSoundChoice(0);
    };

    // Handle a key press in the page
    let handleKeyDown: React.KeyboardEventHandler = event => {
      if (keyGoesUp(event.key)) {
        setCurrentSoundChoice(current =>
          choices.length
            ? current - 1 < 0
              ? choices.length - 1
              : current - 1
            : current
        );
      } else if (keyGoesDown(event.key)) {
        setCurrentSoundChoice(current =>
          choices.length
            ? current + 1 >= choices.length
              ? 0
              : current + 1
            : current
        );
      } else if (event.key === "Enter") {
        setEnglish("");
        gameActionDispatcher({ type: GameEvent.Commit });
      }
    };

    // Handle clicking on the choice list
    let handleOnClick = (soundChoice: number) => {
      setCurrentSoundChoice(soundChoice);
    };

    return (
      <div className="w-full flex flex-col gap-1 items-center">
        <input
          type="text"
          value={english}
          className="w-2/5 p-1 pb-0 border-b-2 border-gray-200 focus:outline-none uppercase font-bold text-center"
          onChange={handleOnChange}
          onKeyDown={handleKeyDown}
        />
        <ul className="w-full flex flex-col gap-2">
          {choiceListRows.map((soundBlocks, index) => (
            <li
              key={index}
              className="flex flex-row gap-0.5"
              onClick={() => handleOnClick(index)}
            >
              {soundBlocks}
            </li>
          ))}
        </ul>
      </div>
    );
  } else {
    // Sound keyboard (TODO)
  }

  return <div></div>;
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
