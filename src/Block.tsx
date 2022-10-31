import React from "react";

export interface BlockValue {
  main: string;
  secondary: string;
}

export enum BlockState {
  NoMatch,
  SomeMatch,
  Match,
}

export const BLOCK_VALUES: Map<string, BlockValue> = new Map([
  ["a", { main: "A", secondary: "ah" }],
]);

export interface BlockProps {
  value: BlockValue | null | undefined;
  state?: BlockState;
}

const MUTED_BG = "bg-gray-300";
const SOME_MATCH_BG = "bg-yellow-400";
const MATCH_BG = "bg-green-400";

export const Block = ({ value, state = BlockState.NoMatch }: BlockProps) => {
  const BASE_STYLE = "rounded-md p-4 flex flex-col items-center";
  if (value) {
    let bg =
      state === BlockState.Match
        ? MATCH_BG
        : state === BlockState.SomeMatch
        ? SOME_MATCH_BG
        : MUTED_BG;
    return (
      <div className={`${BASE_STYLE} ${bg}`}>
        <b className="text-bold">{value.main}</b>
        <small>{value.secondary}</small>
      </div>
    );
  } else {
    return <div className={`${BASE_STYLE} ${MUTED_BG}`}></div>;
  }
};

export default Block;
