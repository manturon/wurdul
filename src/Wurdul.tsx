import React, { createContext, useEffect, useReducer } from "react";
import Board from "./Board";
import {
  GameAction,
  GameConfig,
  GameEvent,
  GameState,
  gameStateReducer,
  initialGameState,
} from "./game";
import { Keyboard } from "./Keyboard";

export const GameContext = createContext<
  [GameState, React.Dispatch<GameAction>]
>(undefined!);

export type WurdulProps = GameConfig;

export const Wurdul = ({ answer, rows, columns }: WurdulProps) => {
  let [state, dispatcher] = useReducer(gameStateReducer, {
    ...initialGameState,
    answer,
    rows,
    columns,
  });

  useEffect(() => {
    dispatcher({ type: GameEvent.RESET, config: { answer, rows, columns } });
  }, [answer, rows, columns]);

  return (
    <GameContext.Provider value={[state, dispatcher]}>
      <div className="container mx-auto">
        {answer ? (
          <div className="md:w-3/5 flex flex-col mx-auto py-2 justify-center gap-1 py-2">
            <Board />
            <Keyboard />
          </div>
        ) : (
          <div className="w-72 mx-auto text-right">Loading dictionary...</div>
        )}
      </div>
    </GameContext.Provider>
  );
};
