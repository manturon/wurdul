import React, {
  createContext,
  useEffect,
  useReducer,
} from "react";
import Board from "./Board";
import {
  GameAction,
  GameConfig,
  GameEvent,
  GameState,
  gameStateReducer,
  initialGameState,
} from "./game";
import { InputMode, Keyboard } from "./Keyboard";

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
    dispatcher({ type: GameEvent.Reset, config: { answer, rows, columns } });
  }, [answer, rows, columns]);

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
