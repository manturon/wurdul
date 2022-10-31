import React from "react";
import Block from "./Block";
import { Sound } from "./Sound";
import { rangeMap } from "./util";

const BASE_STYLES = "flex flex-row gap-1";

export interface RowProps {
  columns: number;
  values?: Sound[];
}

let padEmpty = (blocks: any[], total: number) =>
  blocks.concat(
    rangeMap(total - blocks.length, (index) => (
      <Block key={blocks.length + index} value={null} />
    ))
  );

export const Row = ({ columns, values = [] }: RowProps) => {
  let blocks = values.map((value, index) => (
    <Block key={index} value={value} />
  ));
  blocks = padEmpty(values, columns);
  
  return <div className={`${BASE_STYLES}`}>{blocks}</div>;
};

export default Row;
