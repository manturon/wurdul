import React, { useContext, useState } from "react";
import { Answer, AnswerType } from "../game/game";
import { MatchType } from "../game/matching";
import Phoneme, {
  getPhonemeDescriptor,
  PHONEME_DEFINITIONS,
} from "../game/phonemes";
import { Transcript } from "../game/transcript";
import { choose, extendArray, repeat, repeatWithProvider } from "../util";
import { DictionaryContext } from "./App";
import Block from "./Block";
import Board from "./Board";
import Input from "./Input";
import Summary from "./Summary";

interface Props {
  maxTries: number;
}

type Input = Transcript;
type History = Transcript[];

export default function Game({ maxTries }: Props) {
  const answer: Answer = {
    type: AnswerType.CUSTOM,
    transcript: [Phoneme.B, Phoneme.ERR, Phoneme.I, Phoneme.NG, Phoneme.Z],
    word: ["bearings"],
  };

  const dictionary = useContext(DictionaryContext);

  const [history, setHistory] = useState<History>([]);
  const [input, setInput] = useState<Input>([]);

  const handleOnInput: React.FormEventHandler<HTMLInputElement> = ({
    currentTarget,
  }) => {
    let value = currentTarget.value;
    value = value.trim();
    const transcript = dictionary.dict.get(value);
    if (transcript?.length) {
      const phonemes = transcript.at(0)!.split(" ") as Phoneme[];
      setInput(phonemes);
    } else {
      setInput([]);
    }
  };

  type LayoutRow = Phoneme[];
  type Layout = LayoutRow[];

  const CONSONANTS_LAYOUT: Layout = [
    [
      Phoneme.B,
      Phoneme.D,
      Phoneme.G,
      Phoneme.F,
      Phoneme.H,
      Phoneme.S,
      Phoneme.TH,
      Phoneme.SH,
      Phoneme.CH,
    ],
    [
      Phoneme.P,
      Phoneme.T,
      Phoneme.K,
      Phoneme.V,
      Phoneme.Z,
      Phoneme.DH,
      Phoneme.ZH,
      Phoneme.J,
    ],
    [
      Phoneme.L,
      Phoneme.R,
      Phoneme.W,
      Phoneme.Y,
      Phoneme.M,
      Phoneme.N,
      Phoneme.NG,
    ],
  ];

  const VOWELS_LAYOUT: Layout = [
    [
      Phoneme.ARE,
      Phoneme.ERR,
      Phoneme.EAR,
      Phoneme.OOR,
      Phoneme.ER,
      Phoneme.IRE,
      Phoneme.OR,
      Phoneme.OUR,
    ],
    [
      Phoneme.AO,
      Phoneme.EY,
      Phoneme.EE,
      Phoneme.EYE,
      Phoneme.OH,
      Phoneme.OO,
      Phoneme.OY,
    ],
    [Phoneme.AA, Phoneme.EH, Phoneme.I, Phoneme.AWE, Phoneme.U, Phoneme.UH],
  ];

  const makeSummaryBoard = (layout: Layout) =>
    layout.map((row, index) => (
      <div className="summary-row" key={index}>
        {row.map(getPhonemeDescriptor).map((pd, index) => (
          <Block key={index}>{pd.key}</Block>
        ))}
      </div>
    ));

  const makeBoard = () => {
    const cols = answer.transcript.length;
    let index = 0;
    const inputRow = input
      .slice(0, cols)
      .map((phoneme) => {
        const pd = getPhonemeDescriptor(phoneme);
        return (
          <Block input={true} key={index++}>
            {pd.key}
          </Block>
        );
      })
      .concat(
        repeatWithProvider(Math.max(0, cols - input.length), () => (
          <Block input={true} key={index++}></Block>
        )),
      );
    const emptyRow = repeatWithProvider(cols * (maxTries - 1), () => (
      <Block key={index++}></Block>
    ));
    return inputRow.concat(emptyRow);
  };

  return (
    <div className="game">
      <div className="game-board">{makeBoard()}</div>
      <div className="game-input">
        <input className="word-input" type="text" onInput={handleOnInput} />
        <div className="word-preview"></div>
        <button className="submit-guess-button" type="button">
          Submit
        </button>
      </div>
      <div className="game-summary">
        <div className="summary-board">
          {makeSummaryBoard(CONSONANTS_LAYOUT)}
        </div>
        <div className="summary-board">{makeSummaryBoard(VOWELS_LAYOUT)}</div>
      </div>
    </div>
  );

  /*
  return <div>
    <Board></Board>
    <Input></Input>
    <Summary></Summary>
  </div>;
  */
}
