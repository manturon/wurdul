import React from "react";
import Block, { BLOCK_VALUES } from "./Block";

export interface RowProps extends React.PropsWithChildren {
  columns: number;
  values: string;
}

export const Row = ({ columns, values, children }: RowProps) => {
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

export default Row;
