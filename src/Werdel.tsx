import React, { Fragment, useEffect, useState } from "react";

interface BlockValue {
  main: string;
  secondary: string;
}

enum BlockState {
  NoMatch,
  SomeMatch,
  Match,
}

const BLOCK_VALUES: Map<string, BlockValue> = new Map([
  ["a", { main: "A", secondary: "ah" }],
]);

interface BlockProps {
  value: BlockValue | null | undefined;
  state?: BlockState;
}

const MUTED_BG = "bg-gray-300";
const SOME_MATCH_BG = "bg-yellow-400";
const MATCH_BG = "bg-green-400";

const Block = ({ value, state = BlockState.NoMatch }: BlockProps) => {
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

interface RowProps extends React.PropsWithChildren {
  columns: number;
  values: string;
}

const Row = ({ columns, values, children }: RowProps) => {
  if (!children) {
    let emptyBlocks = Array(columns)
      .fill(null)
      .map((_e, index) => (
        <Block key={index} value={BLOCK_VALUES.get(values[index])} />
      ));
    return <div className="flex flex-row gap-1">{emptyBlocks}</div>;
  } else {
    return <div></div>;
  }
};

export const DEFAULT_ROWS = 6;
export const DEFAULT_COLUMNS = 5;

export interface WerdelProps {
  rows?: number;
  columns?: number;
}

export const Werdel = ({
  rows = DEFAULT_ROWS,
  columns = DEFAULT_COLUMNS,
}: WerdelProps) => {
  let [input, setInput] = useState("");
  let handleKeydown = ({ key }) => {
    if (key === "Backspace") {
      setInput((input) => (input ? input.slice(0, -1) : ""));
    } else if (key.match(/^[A-z]$/)) {
      setInput((input) => (input.length < rows ? input + key : input));
    }
  };
  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);
  let blockRows = Array(rows)
    .fill(null)
    .map((_e, index) => (
      <Row key={index} columns={columns} values={input}></Row>
    ));
  return <div className="flex flex-col gap-1 p-2">{blockRows}</div>;
};
