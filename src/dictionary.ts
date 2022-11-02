import DICT from "./dict.json";
import Sound, { SoundKey, WordSounds } from "./sound";

export type Transcription = SoundKey[];

export class Dictionary {
  private transcriptions: Map<string, Transcription[]>;

  constructor(wordTranscriptions: Iterable<[string, Transcription[]]>) {
    this.transcriptions = new Map(wordTranscriptions);
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
