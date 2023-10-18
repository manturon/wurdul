/**
 * String representation of a phoneme (sound).
 */
export enum Phoneme {
  AWE = "1",
  A = "a",
  EYE = "2",
  AO = "3",
  E = "e",
  EY = "4",
  I = "i",
  EE = "5",
  OH = "o",
  OY = "6",
  U = "u",
  OO = "7",
  UH = "0",
  // ER,
  B = "b",
  CH = "c",
  D = "d",
  DH = "D",
  F = "f",
  G = "g",
  H = "h",
  J = "j",
  K = "k",
  L = "l",
  M = "m",
  N = "n",
  NG = "N",
  P = "p",
  R = "r",
  S = "s",
  SH = "S",
  T = "t",
  TH = "T",
  V = "v",
  W = "w",
  Y = "y",
  Z = "z",
  ZH = "Z",
}

/**
 * Description of a phoneme.
 */
interface PhonemeDescriptor {
  readonly key: string;
  readonly ipa: string;
  readonly examples: readonly string[];
}

/**
 * Map with the definitions of all phonemes.
 */
export const PHONEME_DEFINITIONS: Record<Phoneme, PhonemeDescriptor> = {
  [Phoneme.AWE]: {
    key: "awe",
    ipa: "ɑ",
    examples: ["l[o]t", "th[ough]t", "p[al]m", "[a]re"],
  },
  [Phoneme.A]: {
    key: "a",
    ipa: "a",
    examples: ["tr[a]p", "b[a]n"],
  },
  [Phoneme.EYE]: {
    key: "eye",
    ipa: "aj",
    examples: ["pr[i]ce", "ab[i]de", "v[i]le", "[i]re"],
  },
  [Phoneme.AO]: {
    key: "ao",
    ipa: "aw",
    examples: ["m[ou]th", "ab[ou]t", "[ou]r"],
  },
  [Phoneme.E]: {
    key: "e",
    ipa: "e",
    examples: ["dr[e]ss", "b[e]t", "b[ea]r", "m[a]rry"],
  },
  [Phoneme.EY]: {
    key: "ey",
    ipa: "ej",
    examples: ["f[a]ce", "b[a]ne", "sl[ay]"],
  },
  [Phoneme.I]: {
    key: "i",
    ipa: "i",
    examples: ["k[i]t", "b[i]t", "b[ee]r", "m[i]rror"],
  },
  [Phoneme.EE]: {
    key: "ee",
    ipa: "ij",
    examples: ["fl[ee]ce", "b[ee]n", "br[ie]f"],
  },
  [Phoneme.OH]: {
    key: "oh",
    ipa: "ow",
    examples: ["g[oa]t", "d[ough]", "h[o]rse"],
  },
  [Phoneme.OY]: {
    key: "oy",
    ipa: "oj",
    examples: ["ch[oi]ce", "b[oy]", "s[oi]l"],
  },
  [Phoneme.OO]: {
    key: "oo",
    ipa: "uw",
    examples: ["g[oo]se", "b[oo]t", "p[oo]l"],
  },
  [Phoneme.U]: {
    key: "u",
    ipa: "u",
    examples: ["f[oo]t", "p[u]ll", "p[oo]r"],
  },
  [Phoneme.UH]: {
    key: "uh",
    ipa: "ə",
    examples: ["str[u]t", "b[u]t", "comm[a]", "s[o]n", "n[u]rse", "b[i]rd"],
  },
  // [Phoneme.ER]: {
  //   key: "er",
  //   ipa: "ər",
  //   examples: ["n[u]rse", "b[i]rd", "h[u]rry"],
  // },
  [Phoneme.B]: {
    key: "b",
    ipa: "b",
    examples: ["[b]ad"],
  },
  [Phoneme.CH]: {
    key: "ch",
    ipa: "tʃ",
    examples: ["[ch]urch"],
  },
  [Phoneme.D]: {
    key: "d",
    ipa: "d",
    examples: ["[d]ye", "rubb[ed]"],
  },
  [Phoneme.DH]: {
    key: "dh",
    ipa: "ð",
    examples: ["[th]at"],
  },
  [Phoneme.F]: {
    key: "f",
    ipa: "f",
    examples: ["[f]ight", "lau[gh]"],
  },
  [Phoneme.G]: {
    key: "g",
    ipa: "g",
    examples: ["[g]ood"],
  },
  [Phoneme.H]: {
    key: "h",
    ipa: "h",
    examples: ["[h]and", "[wh]o"],
  },
  [Phoneme.J]: {
    key: "j",
    ipa: "dʒ",
    examples: ["[j]ust", "gra[d]uate", "ba[dg]er"],
  },
  [Phoneme.K]: {
    key: "k",
    ipa: "k",
    examples: ["[c]at", "thin[k]"],
  },
  [Phoneme.L]: {
    key: "l",
    ipa: "l",
    examples: ["[l]ie", "ba[ll]"],
  },
  [Phoneme.M]: {
    key: "m",
    ipa: "m",
    examples: ["[m]oon"],
  },
  [Phoneme.N]: {
    key: "n",
    ipa: "n",
    examples: ["[n]ose", "i[nn]"],
  },
  [Phoneme.NG]: {
    key: "ng",
    ipa: "ŋ",
    examples: ["ri[ng]", "li[n]k"],
  },
  [Phoneme.P]: {
    key: "p",
    ipa: "p",
    examples: ["[p]ie", "a[pp]"],
  },
  [Phoneme.R]: {
    key: "r",
    ipa: "r",
    examples: ["[r]ye", "[wr]ong"],
  },
  [Phoneme.S]: {
    key: "s",
    ipa: "s",
    examples: ["[s]it", "i[c]e"],
  },
  [Phoneme.SH]: {
    key: "sh",
    ipa: "ʃ",
    examples: ["[sh]y", "o[ce]an"],
  },
  [Phoneme.T]: {
    key: "t",
    ipa: "t",
    examples: ["[t]ip", "wa[t]er", "[th]yme"],
  },
  [Phoneme.TH]: {
    key: "th",
    ipa: "θ",
    examples: ["[th]ing"],
  },
  [Phoneme.V]: {
    key: "v",
    ipa: "v",
    examples: ["[v]ine", "o[f]"],
  },
  [Phoneme.W]: {
    key: "w",
    ipa: "w",
    examples: ["[w]ine", "[wh]at"],
  },
  [Phoneme.Y]: {
    key: "y",
    ipa: "j",
    examples: ["[y]es", "[hu]man"],
  },
  [Phoneme.Z]: {
    key: "z",
    ipa: "z",
    examples: ["[z]oo", "ro[s]e"],
  },
  [Phoneme.ZH]: {
    key: "zh",
    ipa: "ʒ",
    examples: ["[g]enre", "plea[s]ure"],
  },
};

export function getPhonemeDescriptor(phoneme: Phoneme): PhonemeDescriptor {
  return PHONEME_DEFINITIONS[phoneme];
}

export default Phoneme;
