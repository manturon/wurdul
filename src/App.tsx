import React from "react";
import { DEFAULT_COLUMNS, DEFAULT_ROWS, getAnswerByDate } from "./game";
import { Werdel } from "./Wurdul";

export const App = () => {
  let columns = DEFAULT_COLUMNS;
  let rows = DEFAULT_ROWS;
  let answer = getAnswerByDate(columns, Date.now());
  console.log("Answer", answer);

  return (
    <React.StrictMode>
      <Werdel answer={answer} columns={columns} rows={rows} />
    </React.StrictMode>
  );
};
