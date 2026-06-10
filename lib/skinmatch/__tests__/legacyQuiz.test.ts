import { describe, it, expect } from "vitest";
import {
  legacyToQuizTags,
  normalizeTags,
  sortTags,
  QUIZ_TAG_ORDER,
} from "../legacyQuiz";

describe("legacyQuiz", () => {
  it('dryness="dry" -> zawiera dryness i dehydration', () => {
    const tags = legacyToQuizTags({ dryness: "dry" });
    expect(tags).toContain("dryness");
    expect(tags).toContain("dehydration");
  });

  it('dryness="oily" -> zawiera acne, pores, blackheads', () => {
    const tags = legacyToQuizTags({ dryness: "oily" });
    expect(tags).toContain("acne");
    expect(tags).toContain("pores");
    expect(tags).toContain("blackheads");
  });

  it("reactive=true -> zawiera sensitivity i redness", () => {
    const tags = legacyToQuizTags({ reactive: true });
    expect(tags).toContain("sensitivity");
    expect(tags).toContain("redness");
  });

  it('issues=["pory","zaskorniki"] -> zawiera pores i blackheads', () => {
    const tags = legacyToQuizTags({ issues: ["pory", "zaskorniki"] });
    expect(tags).toContain("pores");
    expect(tags).toContain("blackheads");
  });

  it("normalizeTags({ tags: [...] }) zwraca te same tagi posortowane i odfiltrowane", () => {
    const input = ["redness", "acne", "acne", "invalid", "pores"];
    const result = normalizeTags({ tags: input });
    expect(result).not.toContain("invalid");
    expect(result).toEqual(sortTags(["acne", "pores", "redness"]));
    expect(result).toEqual(
      QUIZ_TAG_ORDER.filter((t) => ["acne", "pores", "redness"].includes(t))
    );
  });
});
