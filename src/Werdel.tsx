import React, { useEffect, useState } from "react";
import Row from "./Row";

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
