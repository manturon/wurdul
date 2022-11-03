import DICT from "./dict.json";
import Sound, { SoundKey, WordSounds } from "./sound";

export type Transcription = SoundKey[];

export class Dictionary {
  public readonly transcriptions: Map<string, Transcription[]>;
  public readonly words: Set<string>;

  constructor(wordTranscriptions: Iterable<[string, Transcription[]]>) {
    this.transcriptions = new Map(wordTranscriptions);
    this.words = new Set(this.transcriptions.keys());
  }

  public wordSounds(english: string): WordSounds[] {
    return (
      this.transcriptions
        .get(english)
        ?.map((t) => t.map((key) => Sound.from(key)!)) ?? []
    );
  }
}

export const englishDictionary = new Dictionary(Object.entries(DICT) as any);
