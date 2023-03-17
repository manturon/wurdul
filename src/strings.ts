import { AnswerType } from "./game/game";

export default {
  input: {
    submit: "play",
    submitAlt: "play a word",
    placeholder: "guess the word",
    previous: "back",
    previousAlt: "previous transcript choice",
    next: "next",
    nextAlt: "next transcript choice",
    currentEmpty: "empty",
    currentSingle: "single",
    current: ":0 / :1",
    currentAlt: "alternative transcription (:0 out of :1)",
  },
  gameType: {
    [AnswerType.DAILY]: "daily",
    [AnswerType.RANDOM]: "random",
    [AnswerType.CUSTOM]: "custom",
  },
  scoring: {
    win: {
      title: "Good job!",
      subtitle: "You correctly guessed the word.",
    },
    lose: {
      title: "Too bad!",
      subtitle: "You didn't guess the word in the expected amount of tries.",
    },
    whichOnlyOne: "The word was :0.",
    copyToClipboard: "Copy to clipboard",
  }
};
