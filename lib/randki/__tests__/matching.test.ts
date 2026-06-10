import { describe, expect, it } from "vitest";
import { parsePrompts } from "@/lib/randki/constants";

describe("parsePrompts", () => {
  it("returns up to 3 valid prompts", () => {
    const raw = JSON.stringify([
      { question: "Q1", answer: "A1" },
      { question: "Q2", answer: "A2" },
      { question: "", answer: "skip" },
      { question: "Q3", answer: "A3" },
      { question: "Q4", answer: "A4" },
    ]);
    expect(parsePrompts(raw)).toEqual([
      { question: "Q1", answer: "A1" },
      { question: "Q2", answer: "A2" },
      { question: "Q3", answer: "A3" },
    ]);
  });

  it("returns empty array for invalid JSON", () => {
    expect(parsePrompts("not-json")).toEqual([]);
    expect(parsePrompts(null)).toEqual([]);
  });
});

describe("pair normalization (blocks/matching)", () => {
  function normalizePair(a: string, b: string): [string, string] {
    return a < b ? [a, b] : [b, a];
  }

  it("orders account ids consistently", () => {
    expect(normalizePair("b-id", "a-id")).toEqual(["a-id", "b-id"]);
    expect(normalizePair("a-id", "b-id")).toEqual(["a-id", "b-id"]);
    expect(normalizePair("same", "same")).toEqual(["same", "same"]);
  });
});
