import React, { createContext, useReducer } from "react";
import Board from "./Board";
import {
  Answer,
  DEFAULT_COLUMNS,
  DEFAULT_ROWS,
  GameAction,
  GameState,
  gameStateReducer,
  initialGameState,
} from "./game";
import { InputMode, Keyboard } from "./Keyboard";

export const GameContext = createContext<
  [GameState, React.Dispatch<GameAction>]
>(undefined!);

export interface WerdelProps {
  answer: Answer;
  rows: number;
  columns: number;
}

export const Werdel = ({ answer, rows, columns }: WerdelProps) => {
  let [state, dispatcher] = useReducer(gameStateReducer, {
    ...initialGameState,
    answer,
    rows,
    columns,
  } as GameState);

  return (
    <GameContext.Provider value={[state, dispatcher]}>
      <div className="h-screen container mx-auto">
        <div className="w-3/5 h-full flex flex-col mx-auto py-2 justify-center">
          <Board />
          <Keyboard initialInputMode={InputMode.ENGLISH} />
        </div>
      </div>
    </GameContext.Provider>
  );
};
