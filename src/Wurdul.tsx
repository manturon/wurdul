import React, { ChangeEventHandler, useEffect, useRef, useState } from "react";
import { getTranscriptions, Transcription } from "./dictionary";
import { EnglishKeyboard, SoundKeyboard } from "./Keyboard";
import Row from "./Row";
import { Sound, SOUNDS } from "./sound";
import { rangeMap } from "./util";

export const DEFAULT_ROWS = 6;
export const DEFAULT_COLUMNS = 5;

export interface WerdelProps {
  rows?: number;
  columns?: number;
}

export enum InputMode {
  Sound,
  English,
}
const CODE_A = "a".codePointAt(0)!;
const CODE_Z = "z".codePointAt(0)!;
const isAlphaCi = (char: string) => {
  let code = char[0].codePointAt(0)!;
  return char.length === 1 && code >= CODE_A && code <= CODE_Z;
};

export const Werdel = ({
  rows = DEFAULT_ROWS,
  columns = DEFAULT_COLUMNS,
}: WerdelProps) => {
  let [inputMode, setInputMode] = useState(InputMode.English);
  // let [word, setWord] = useState("");
  let [transcription, setTranscription] = useState([] as Transcription);
  let [english, setEnglish] = useState("");

  let blockRows = rangeMap(rows, (index) => (
    <Row key={index} columns={columns} transcription={transcription} />
  ));

  let keyboard =
    inputMode === InputMode.English ? <EnglishKeyboard /> : <SoundKeyboard />;

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
      let transcription = getTranscriptions(english)[0];
      console.log(transcription);
      if (transcription) {
        setTranscription(transcription);
      } else {
        setTranscription([]);
      }
    }
  }, [english]);

  return (
    <>
      <div className="container">
        <h1>wur-dul</h1>
      </div>
      <div className="container flex flex-col mx-auto">
        <div className="flex flex-col gap-1 p-2 items-center">{blockRows}</div>
        <input
          className="border-b-2 w-sm mx-auto text-center"
          ref={englishInputRef}
          type="text"
          value={english}
          onChange={handleOnChange}
        />
        {keyboard}
      </div>
    </>
  );
};
