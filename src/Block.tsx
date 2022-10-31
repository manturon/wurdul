import React from "react";
import { Sound } from "./Sound";

const BASE_STYLES = "rounded-md p-4 flex flex-col items-center";
const MUTED_BG = "bg-gray-300";
const SOME_MATCH_BG = "bg-yellow-400";
const MATCH_BG = "bg-green-400";

export enum BlockState {
  NoMatch,
  SomeMatch,
  Match,
}

export interface BlockProps {
  value: Sound | null | undefined;
  state?: BlockState;
}

export const Block = ({ value, state = BlockState.NoMatch }: BlockProps) => {
  if (value) {
    let bg =
      state === BlockState.Match
        ? MATCH_BG
        : state === BlockState.SomeMatch
        ? SOME_MATCH_BG
        : MUTED_BG;
    return (
      <div className={`${BASE_STYLES} ${bg}`}>
        <b className="text-bold">{value.name}</b>
        <small>{value.ipa}</small>
      </div>
    );
  } else {
    return <div className={`${BASE_STYLES} ${MUTED_BG}`}></div>;
  }
};

export default Block;
