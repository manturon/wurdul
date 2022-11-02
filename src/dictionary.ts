import DICT from "./dict.json";
import { SoundKey } from "./sound";

export type Transcription = SoundKey[];

const DICTIONARY = new Map(Object.entries(DICT) as unknown as Array<[string, Transcription[]]>);

export const getTranscriptions = (english: string) => {
    return DICTIONARY.get(english) ?? [];
}