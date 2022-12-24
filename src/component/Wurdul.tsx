import React, { createContext, useEffect, useReducer } from "react";
import Board from "./Board";
import {
  GameAction,
  GameConfig,
  GameEvent,
  GameState,
  gameStateReducer,
  initialGameState,
} from "../game/game";
import { Keyboard } from "./Keyboard";
import TheAnswer from "./TheAnswer";

export const GameContext = createContext<
  [GameState, React.Dispatch<GameAction>]
>(undefined!);

export type WurdulProps = GameConfig;

export const Wurdul = ({ answer, rows }: WurdulProps) => {
  const [state, dispatcher] = useReducer(gameStateReducer, {
    ...initialGameState,
    answer,
    rows,
  });

  useEffect(() => {
    dispatcher({ type: GameEvent.RESET, config: { answer, rows } });
  }, [answer, rows]);

  return (
    <GameContext.Provider value={[state, dispatcher]}>
      <div className="container mx-auto">
        <div className="md:w-3/5 flex flex-col mx-auto py-2 justify-center gap-1 py-2">
          <Board />
          {state.gameOver ? <TheAnswer /> : <Keyboard />}
        </div>
      </div>
    </GameContext.Provider>
  );
};
