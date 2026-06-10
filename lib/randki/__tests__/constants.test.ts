import { describe, expect, it } from "vitest";
import { calcAge, genderCompatible, parseInterests } from "@/lib/randki/constants";

describe("randki constants", () => {
  it("calcAge returns current year minus birth year", () => {
    const year = new Date().getFullYear();
    expect(calcAge(year - 30)).toBe(30);
  });

  it("genderCompatible respects mutual preferences", () => {
    expect(genderCompatible("woman", ["man"], "man", ["woman"])).toBe(true);
    expect(genderCompatible("woman", ["man"], "woman", ["woman"])).toBe(false);
    expect(genderCompatible("woman", ["man"], "man", ["woman", "other"])).toBe(true);
  });

  it("parseInterests parses JSON array", () => {
    expect(parseInterests('["Kawa","Sport"]')).toEqual(["Kawa", "Sport"]);
    expect(parseInterests("invalid")).toEqual([]);
  });
});

describe("interest scoring logic", () => {
  it("counts shared interests", () => {
    const mine = parseInterests('["Kawa","Sport","Kino"]');
    const theirs = parseInterests('["Kawa","Muzyka"]');
    const shared = theirs.filter((i) => new Set(mine).has(i)).length;
    expect(shared).toBe(1);
  });
});
