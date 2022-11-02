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
    ],
  ]);

  let englishInputRef = useRef<HTMLInputElement>(null);

  let handleKeyDown = () => {
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
        setSoundChoices(sounds);
        setCurrentSoundChoice(0);
      } else {
        setSoundChoices([]);
      }
    }
  }, [english]);

  return (
    <div className="container h-screen flex flex-col justify-center align-center">
      <Header />
      <div className="mx-auto flex flex-col w-4/5">
        <Board
          rows={rows}
          columns={columns}
          history={history}
          input={soundChoices[currentSoundChoice]}
        />
        <ul>
          {soundChoices.map((choice, index) => (
            <li key={index}>{choice.map((sound) => sound.name).join("-")}</li>
          ))}
        </ul>
        {InputMode.ENGLISH ? (
          <EnglishKeyboard value={english} onChange={handleOnChange} />
        ) : (
          <SoundKeyboard />
        )}
      </div>
    </div>
  );
};
