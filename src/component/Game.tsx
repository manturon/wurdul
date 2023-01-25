import React, { useContext, useState } from "react";
import { Answer } from "../game/game";
import { Matcher } from "../game/matching";
import Phoneme, { getPhonemeDescriptor } from "../game/phonemes";
import { Transcript } from "../game/transcript";
import { repeatWithProvider } from "../util";
import { DictionaryContext } from "./App";
import Block from "./Block";

interface Props {
  maxTries: number;
  answer: Answer;
}

interface HistoryEntry {
  transcript: Transcript;
  word: string;
}
type History = HistoryEntry[];

export default function Game({ maxTries, answer }: Props) {
  const colCount = answer.transcript.length;
  const dictionary = useContext(DictionaryContext);

  const [history, setHistory] = useState<History>([]);
  const [wordInput, setWordInput] = useState<string>("");
  const transcriptsForInput = dictionary.wordTranscripts(wordInput.trim());

  const phonemeInput = transcriptsForInput[0] ?? []; // todo: chooser

  const matcher = new Matcher(
    answer.transcript,
    history.map((entry) => entry.transcript),
  );

  const handleOnInput: React.FormEventHandler<HTMLInputElement> = ({
    currentTarget,
  }) => {
    let value = currentTarget.value;
    setWordInput(value);
  };

  const clearInput = () => {
    setWordInput("");
  };

  const handleOnClick: React.MouseEventHandler<HTMLButtonElement> = () => {
    commitInput();
  };

  const handleOnKeyUp: React.KeyboardEventHandler = ({ key }) => {
    if (key === "Enter") {
      commitInput();
    }
  };

  const commitInput = () => {
    if (!phonemeInput?.length || phonemeInput.length != colCount) {
      // todo: check if input is valid & so on
      return;
    }
    setHistory((history) => [
      ...history,
      { transcript: phonemeInput, word: wordInput },
    ]);
    clearInput();
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
        {row.map(getPhonemeDescriptor).map((pd, index) => {
          const match = matcher.bestForPhoneme(pd.key as Phoneme);
          return (
            <Block key={index} match={match}>
              {pd.key}
            </Block>
          );
        })}
      </div>
    ));

  const makeBoard = () => {
    let i = 0;
    const matches = matcher.allMatches;
    const historyBlocks = history.flatMap((entry, j) => {
      const rowMatches = matches[j];
      const transcript = entry.transcript;
      return transcript.map((phoneme, k) => {
        const pd = getPhonemeDescriptor(phoneme);
        return (
          <Block key={i++} match={rowMatches[k]}>
            {pd.key}
          </Block>
        );
      });
    });
    const inputBlocks = phonemeInput
      .slice(0, colCount)
      .map((phoneme) => {
        const pd = getPhonemeDescriptor(phoneme);
        return (
          <Block input={true} key={i++}>
            {pd.key}
          </Block>
        );
      })
      .concat(
        // appends the empty elements at the end of an unfinished input
        repeatWithProvider(Math.max(0, colCount - phonemeInput.length), () => (
          <Block input={true} key={i++}></Block>
        )),
      );
    const emptyBlocks = repeatWithProvider(
      colCount * (maxTries - (inputBlocks.length ? 1 : 0) - history.length),
      () => <Block key={i++}></Block>,
    );
    return [...historyBlocks, ...inputBlocks, ...emptyBlocks];
  };

  return (
    <div className="game">
      <div
        className="game-board"
        style={
          { "--rows": maxTries, "--cols": colCount } as React.CSSProperties
        }>
        {makeBoard()}
      </div>
      <div className="game-input">
        <input
          className="word-input"
          type="text"
          onInput={handleOnInput}
          onKeyUp={handleOnKeyUp}
          value={wordInput}
        />
        <div className="word-preview"></div>
        <button
          className="submit-guess-button"
          type="button"
          onClick={handleOnClick}>
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
