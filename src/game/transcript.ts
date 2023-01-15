import Phoneme from "./phonemes";

/**
 * Phonemes separated by spaces representing a transcription.
 */
export type RawTranscript = string;

/**
 * Array of phonemes representing a transcription.
 */
export type Transcript = readonly Phoneme[];

/**
 * A simple word.
 */
export type Word = string;

export function getTranscript(rawTranscript: RawTranscript): Transcript {
  return rawTranscript.split(" ") as Transcript;
}
