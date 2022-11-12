import React, { useContext, useEffect, useRef, useState } from "react";
import Block, { BlockType } from "./Block";
import {
  DICTIONARY,
  GameEvent,
  getSoundMatchStatus,
  SoundMatchStatus,
} from "./game";
import { WordSound } from "./sound";
import { keyGoesDown, keyGoesUp } from "./util";
import { GameContext } from "./Wurdul";

const MATCH_TABLE_LAYOUT = [
  ["l", "r", "m", "n", "ng", "w", "y"],
  ["p", "t", "k", "v", "z", "dh", "zh", "j"],
  ["b", "d", "g", "f", "h", "s", "th", "sh", "ch"],
  ["ey", "ee", "eye", "oh", "oo", "er", "ao", "ear", "or", "ire", "our"],
  ["aa", "eh", "i", "awe", "u", "uh", "oy", "err", "are", "oor"],
];

/**
 * Return an array of the sounds for a word, sorted with the ones with
 * a particular length first.
 */
const soundChoicesForEnglish = async (english: string, lengthBias: number) => {
  let sounds = await DICTIONARY.wordSounds(english);
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
      key={index}
      type={BlockType.KEY}
      value={sound.name}
      match={isCurrent ? matchMap.get(sound) : undefined}
    />
  ));

const makeMatchStateTable = matchState => {
  // TODO
};

/**
 * Handle user input, present choices and show current match state for sounds.
 */
export const Keyboard = () => {
  let [{ answer, history }, gameActionDispatcher] = useContext(GameContext);

  let matchMap = getSoundMatchStatus(history);

  let inputElement = useRef<HTMLInputElement>(null);

  // The current English word to get sounds from, if in english input mode
  let [english, setEnglish] = useState("");
  // The currently selected sound choice, in case there's more than one for a word
  let [currentSoundChoice, setCurrentSoundChoice] = useState(0);

  let soundChoices = soundChoicesForEnglish(english, answer!.sound.length);
  let [choices, setChoices] = useState<WordSound[]>([]);
  let [choiceListRows, setChoiceListRows] = useState<JSX.Element[][]>();

  useEffect(() => {
    soundChoices.then(choices => [setChoices(choices)]);
    soundChoices.then(choices =>
      setChoiceListRows(
        choices.map((choice, index) =>
          makeChoiceBlocks(
            choice,
            matchMap,
            answer!.sound.length,
            index === currentSoundChoice
          )
        )
      )
    );
  }, [english, currentSoundChoice]);

  // Is this the ideal way to do this?
  // Trying deal with async and state...
  useEffect(() => {
    soundChoices.then(choices => {
      if (!english) {
        gameActionDispatcher({
          type: GameEvent.INPUT,
          input: [],
        });
        return;
      }
      // Sets the input shown on the board
      gameActionDispatcher({
        type: GameEvent.INPUT,
        input: choices[currentSoundChoice] || [],
      });
    });
  }, [currentSoundChoice, english]);

  useEffect(() => {
    let listener = () => {
      // Focus on the input element in case it's not in focus
      if (
        inputElement.current &&
        document.activeElement !== inputElement.current
      ) {
        inputElement.current.focus();
      }
    };
    window.addEventListener("keydown", listener);
    () => removeEventListener("keydown", listener);
  }, []);

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
    if (!choices || !choices.length) {
      return;
    }
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
      commit();
    }
  };

  let commit = () => {
    if (!choices) {
      return;
    }
    setEnglish("");
    gameActionDispatcher({ type: GameEvent.COMMIT });
  };

  // Handle clicking on the choice list
  let handleOnClick = (soundChoice: number) => {
    setCurrentSoundChoice(soundChoice);
  };

  return (
    <div className="w-72 mx-auto flex flex-col gap-1 items-center">
      <div className="flex flex-row border-2 border-gray-100 w-full items-stretch">
        <input
          type="text"
          value={english}
          className="w-48 p-1 pr-3 focus:outline-none uppercase font-bold text-right grow placeholder:text-gray-300 text-gray-600"
          onChange={handleOnChange}
          onKeyDown={handleKeyDown}
          maxLength={12}
          ref={inputElement}
          placeholder={"guess"}
        />
        <button
          onClick={commit}
          className="bg-white px-2 text-red-400 border-l-2 border-gray-100 px-4 font-bold"
          type="button"
        >
          PLAY
        </button>
      </div>
      <ul className="w-full flex flex-col gap-1 h-20 p-1 border-2 border-gray-100 bg-white">
        {choiceListRows
          ? choiceListRows.map((soundBlocks, index) => (
              <li
                key={index}
                className="flex flex-row gap-0.5"
                onClick={() => handleOnClick(index)}
              >
                {soundBlocks}
              </li>
            ))
          : null}
      </ul>
    </div>
  );
};
