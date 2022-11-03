import React, { ChangeEventHandler, useEffect, useRef, useState } from "react";
import Board from "./Board";
import { englishDictionary as dictionary } from "./dictionary";
import {
  DEFAULT_COLUMNS,
  DEFAULT_ROWS,
  GuessHistory,
  Input,
  InputMode,
  Match,
} from "./game";
import Header from "./Header";
import { EnglishKeyboard, SoundKeyboard } from "./Keyboard";
import Sound, { WordSounds } from "./sound";
import { keyGoesDown, keyGoesUp } from "./util";

export interface WerdelProps {
  rows?: number;
  columns?: number;
}

export const Werdel = ({
  rows = DEFAULT_ROWS,
  columns = DEFAULT_COLUMNS,
}: WerdelProps) => {
  let [inputMode, setInputMode] = useState(InputMode.ENGLISH);
  let [soundChoices, setSoundChoices] = useState<WordSounds[]>([]);
  let [currentSoundChoice, setCurrentSoundChoice] = useState(0);
  let [english, setEnglish] = useState("");
  let [history, setHistory] = useState<GuessHistory>([
    [
      [Sound.from("ah")!, Match.MATCH],
      [Sound.from("ay")!, Match.SOME_MATCH],
      [Sound.from("sh")!, Match.NO_MATCH],
      [Sound.from("oir")!, Match.SOME_MATCH],
      [Sound.from("ur")!, Match.MATCH],
    ],
  ]);

  let englishInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log("sound choices", soundChoices)
  }, [soundChoices])
  
  useEffect(() => {
    console.log("english", english);
  }, [english]);

  let scrollChoiceDown = () =>
    setCurrentSoundChoice((current) => {
      console.log("current sound choices when scrolling choice down", soundChoices);
      return soundChoices.length
        ? Math.min(current + 1, soundChoices.length - 1)
        : current;}
    );

  let scrollChoiceUp = () =>
    setCurrentSoundChoice((current) =>
      soundChoices.length ? Math.max(current - 1, 0) : current
    );

  let handleKeyDown = (event: KeyboardEvent) => {
    if (keyGoesUp(event.key)) {
      scrollChoiceUp();
    } else if (keyGoesDown(event.key)) {
      scrollChoiceDown();
    }
    if (
      englishInputRef.current &&
      document.activeElement !== englishInputRef.current
    ) {
      setEnglish("");
      englishInputRef.current.focus();
    }
  };
  
  let handleOnChange: ChangeEventHandler = ({ target }) => {
    let value = (target as HTMLInputElement).value
      ?.toLowerCase()
      .replace(/[^a-z]/g, "");
    setEnglish(value);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (english) {
      let sounds = dictionary.wordSounds(english);
      if (sounds.length) {
        if (sounds.length > 1) {
          // Put the most likely solution on top
          let sorted = new Array<WordSounds>();
          for (let sound of sounds) {
            if (sound.length === columns) {
              sorted.unshift(sound);
            } else {
              sorted.push(sound);
            }
          }
          sounds = sorted;
        }
        setSoundChoices(sounds);
        setCurrentSoundChoice(0);
      } else {
        console.log("setting sound choices to empty")
        setSoundChoices([]);
      }
    }
  }, [english]);

  return (
    <div className="container h-screen mx-auto">
      <Header />
      <div className="mx-auto h-full flex flex-col w-3/5 py-2 justify-center">
        <Board
          rows={rows}
          columns={columns}
          history={history}
          input={soundChoices[currentSoundChoice]}
        />
        {InputMode.ENGLISH ? (
          <EnglishKeyboard
            maxColumns={columns}
            value={english}
            choices={soundChoices}
            currentChoice={currentSoundChoice}
            onChange={handleOnChange}
            inputRef={englishInputRef}
          />
        ) : (
          <SoundKeyboard />
        )}
      </div>
    </div>
  );
};
