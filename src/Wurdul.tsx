import React, {
  createContext,
  useReducer,
} from "react";
import Board from "./Board";
import {
  DEFAULT_COLUMNS,
  DEFAULT_ROWS,
  GameAction,
  GameEvent,
  GameState,
  Match,
} from "./game";
import { EnglishKeyboard, InputMode, Keyboard, SoundKeyboard } from "./Keyboard";
import Sound, { WordSounds } from "./sound";

export const GameContext = createContext<[GameState, React.Dispatch<GameAction>]>(null!);

const gameStateReducer: React.Reducer<GameState, GameAction> = (
  state,
  action
) => {
  switch (action.type) {
    case GameEvent.Reset:
      return initialGameState;
    default:
      throw new Error("Unknown action dispatched: " + action);
  }
};

const initialGameState: GameState = {
  rows: DEFAULT_ROWS,
  columns: DEFAULT_COLUMNS,
  answer: [],
  input: [],
  history: [
    [
      [Sound.from("ah")!, Match.MATCH],
      [Sound.from("ay")!, Match.SOME_MATCH],
      [Sound.from("sh")!, Match.NO_MATCH],
      [Sound.from("oir")!, Match.SOME_MATCH],
      [Sound.from("ur")!, Match.MATCH],
    ],
  ],
};

export interface WerdelProps {
  rows?: number;
  columns?: number;
}

export const Werdel = ({
  rows = DEFAULT_ROWS,
  columns = DEFAULT_COLUMNS,
}: WerdelProps) => {
  let [state, dispatcher] = useReducer(gameStateReducer, {
    ...initialGameState,
    rows,
    columns,
  });

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
