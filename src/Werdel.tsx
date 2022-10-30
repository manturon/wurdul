import React, { Fragment } from "react";

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
  value: BlockValue | null;
  state?: BlockState;
}

const MUTED_BG = "bg-gray-300";
const SOME_MATCH_BG = "bg-yellow-400";
const MATCH_BG = "bg-green-400";

const Block = ({ value, state = BlockState.NoMatch }: BlockProps) => {
  if (value) {
    let bg =
      state === BlockState.Match
        ? MATCH_BG
        : state === BlockState.SomeMatch
        ? SOME_MATCH_BG
        : MUTED_BG;
    return (
      <div className={`${bg}`}>
        <span>{value.main}</span>
        <span>{value.secondary}</span>
      </div>
    );
  } else {
    return <div className={`${MUTED_BG} rounded-md p-4`}></div>;
  }
};

interface RowProps extends React.PropsWithChildren {
  columns: number;
}

const Row = ({ columns, children }: RowProps) => {
  if (!children) {
    let emptyBlocks = Array(columns)
      .fill(null)
      .map((_e, index) => <Block key={index} value={null} />);
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
  let blockRows = Array(rows)
    .fill(null)
    .map((_e, index) => <Row columns={columns} key={index}></Row>);
  return <div className="flex flex-col gap-1 p-2">{blockRows}</div>;
};
