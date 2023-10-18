import { Match, Matcher } from "../matching";
import Phoneme from "../phonemes";

test("empty matcher generates empty results", () => {
  let chest = [Phoneme.CH, Phoneme.EH, Phoneme.S, Phoneme.T];
  let chestMatcher = new Matcher(chest, []);

  expect(chestMatcher.allMatches).toEqual([]);
  // expect(chestMatcher.bestMatches).toEqual(new Map());
});

test("matcher generates correct matches", () => {
  {
    let expected = [Phoneme.CH, Phoneme.EH, Phoneme.S, Phoneme.T];

    let allCorrect = new Matcher(expected, [expected]);

    expect(allCorrect.allMatches).toEqual([
      [Match.MATCH, Match.MATCH, Match.MATCH, Match.MATCH],
    ]);
    // expect(allCorrect.bestMatches).toEqual([Match.MATCH, Match.MATCH, Match.MATCH, Match.MATCH]);
    expect(allCorrect.bestForPhoneme(Phoneme.CH)).toEqual(Match.MATCH);
    expect(allCorrect.bestForPhoneme(Phoneme.EH)).toEqual(Match.MATCH);
    expect(allCorrect.bestForPhoneme(Phoneme.S)).toEqual(Match.MATCH);
    expect(allCorrect.bestForPhoneme(Phoneme.T)).toEqual(Match.MATCH);
    expect(allCorrect.bestForPhoneme(Phoneme.K)).toEqual(Match.UNKNOWN);

    let allIncorrect = new Matcher(expected, [
      [Phoneme.AA, Phoneme.AO, Phoneme.ARE, Phoneme.AWE],
    ]);
    expect(allIncorrect.allMatches).toEqual([
      [Match.NO_MATCH, Match.NO_MATCH, Match.NO_MATCH, Match.NO_MATCH],
    ]);
    expect(allIncorrect.bestForPhoneme(Phoneme.CH)).toEqual(Match.UNKNOWN);
    expect(allIncorrect.bestForPhoneme(Phoneme.EH)).toEqual(Match.UNKNOWN);
    expect(allIncorrect.bestForPhoneme(Phoneme.S)).toEqual(Match.UNKNOWN);
    expect(allIncorrect.bestForPhoneme(Phoneme.T)).toEqual(Match.UNKNOWN);
    expect(allIncorrect.bestForPhoneme(Phoneme.AA)).toEqual(Match.NO_MATCH);
    expect(allIncorrect.bestForPhoneme(Phoneme.AO)).toEqual(Match.NO_MATCH);
    expect(allIncorrect.bestForPhoneme(Phoneme.ARE)).toEqual(Match.NO_MATCH);
    expect(allIncorrect.bestForPhoneme(Phoneme.AWE)).toEqual(Match.NO_MATCH);
  }
  {
    let expected = [Phoneme.B, Phoneme.AA, Phoneme.AA, Phoneme.B, Phoneme.ER];

    let somewhereElse = new Matcher(expected, [
      [Phoneme.AA, Phoneme.B, Phoneme.B, Phoneme.AA, Phoneme.B],
    ]);

    expect(somewhereElse.allMatches).toEqual([
      [
        Match.SOME_MATCH,
        Match.SOME_MATCH,
        Match.SOME_MATCH,
        Match.SOME_MATCH,
        Match.NO_MATCH,
      ],
    ]);

    let somewhereElseSomewhatCorrect = new Matcher(expected, [
      [Phoneme.B, Phoneme.AA, Phoneme.B, Phoneme.AA, Phoneme.B],
    ]);

    expect(somewhereElseSomewhatCorrect.allMatches).toEqual([
      [
        Match.MATCH,
        Match.MATCH,
        Match.SOME_MATCH,
        Match.SOME_MATCH,
        Match.NO_MATCH,
      ],
    ]);
  }
});
