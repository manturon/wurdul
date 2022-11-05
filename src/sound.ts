import KEYS from "./keys.json";

export type SoundType =
  | "vowel"
  | "rhotic"
  | "consonant"
  | "approximant"
  | "liquid"
  | "glide"
  | "voiced"
  | "unvoiced"
  | "plosive"
  | "affricate"
  | "fricative"
  | "nasal";
export type WordSound = Sound[];
export type SoundKey = keyof typeof KEYS;

export class Sound {
  public static SOUND_MAP = new Map<SoundKey, Sound>(
    Object.entries(KEYS).map(([soundKey, sound]) => [
      soundKey,
      Object.assign(new Sound(), sound),
    ]) as any
  );

  public static get all() {
    return Sound.SOUND_MAP.values();
  }

  public static from(key: SoundKey) {
    return Sound.SOUND_MAP.get(key) || null;
  }

  public is(other: Sound) {
    return this === other || other.name === this.name;
  }

  public readonly name: SoundKey;
  public readonly type: SoundType[];
  public readonly ipa: string[];
  public readonly asin: string[];
  public readonly alias?: string[];
  public readonly rhotic?: string[];
  public readonly unrhotic?: string[];
  public readonly voiced?: string[];
  public readonly voiceless?: string[];
}

export default Sound;
