import P from "./phonemes";
import Phoneme from "./phonemes";

export type LayoutRow = Phoneme[];
export type Layout = LayoutRow[];

export const CONSONANTS_LAYOUT: Layout = [
  [P.B, P.D, P.G, P.F, P.H, P.S, P.TH, P.SH, P.CH],
  [P.P, P.T, P.K, P.V, P.Z, P.DH, P.ZH, P.J],
  [P.L, P.R, P.W, P.Y, P.M, P.N, P.NG],
];

export const VOWELS_LAYOUT: Layout = [
  [P.ARE, P.ERR, P.EAR, P.OOR, P.ER, P.IRE, P.OR, P.OUR],
  [P.AO, P.EY, P.EE, P.EYE, P.OH, P.OO, P.OY],
  [P.AA, P.EH, P.I, P.AWE, P.U, P.UH],
];
