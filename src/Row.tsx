import React from "react";
import Block from "./Block";
import { Transcription } from "./dictionary";
import { rangeMap } from "./util";

let padEmpty = (blocks: any[], total: number) =>
  blocks.length < total
    ? blocks.concat(
        rangeMap(total - blocks.length, (index) => (
          <Block key={blocks.length + index} value={null} />
        ))
      )
    : blocks.slice(0, total);

export interface RowProps {
  columns: number;
  transcription: Transcription;
}

export const Row = ({ columns, transcription = [] }: RowProps) => {
  let isTooLong = transcription.length > columns;
  let blocks = transcription
    .slice(0, columns)
    .map((value, index) => (
      <Block key={index} value={value} invalid={isTooLong} />
    ));
  blocks = padEmpty(blocks, columns);

  return <div className="flex flex-row gap-1">{blocks}</div>;
};

export default Row;
