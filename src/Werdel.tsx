import React, { useEffect, useState } from "react";
import Keyboard from "./Keyboard";
import Row from "./Row";
import { Sound, SOUNDS } from "./sound";
import { rangeMap } from "./util";

const ROW_CONTAINER_STYLES = "flex flex-col gap-1 p-2";

export const DEFAULT_ROWS = 6;
export const DEFAULT_COLUMNS = 5;

export interface WerdelProps {
  rows?: number;
  columns?: number;
}

export enum InputMode {
  Sound,
  Word,
}

export const Werdel = ({
  rows = DEFAULT_ROWS,
  columns = DEFAULT_COLUMNS,
}: WerdelProps) => {
  let [inputMode, setInputMode] = useState(InputMode.Sound);
  // let [word, setWord] = useState("");
  let [sounds, setSounds] = useState([] as Sound[]);

  let pushSound = (sound: Sound) => {
    setSounds((sounds) => {
      if (sounds.length < columns) {
        return [...sounds, sound];
      } else {
        return sounds;
      }
    });
  };

  let popSound = (sound: Sound) => {
    setSounds((sounds) => {
      if (sounds.length !== 0) {
        sounds.pop();
        return [...sounds];
      } else {
        return [];
      }
    });
  };

  let blockRows = rangeMap(rows, (index) => (
    <Row key={index} columns={columns} values={sounds} />
  ));

  return (
    <div>
      <div className={`${ROW_CONTAINER_STYLES}`}>{blockRows}</div>
      <Keyboard></Keyboard>
    </div>
  );
};
