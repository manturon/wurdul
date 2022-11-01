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

export type Sound = {
  name: string;
  type: SoundType[];
  ipa: string[];
  asin: string[];
  alias?: string[];
  rhotic?: string[];
  unrhotic?: string[];
  voiced?: string[];
  voiceless?: string[];
};

export type SoundKey = keyof typeof KEYS;

export const SOUNDS = new Map<SoundKey, Sound>(
  Object.entries(KEYS) as unknown as Array<[SoundKey, Sound]>
);