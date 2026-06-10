import { describe, expect, it } from "vitest";
import { MAX_INTEREST_TAGS, normalizeInterestTag, sanitizeInterestTags, searchInterestSuggestions } from "@/lib/randki/interestTags";

describe("interestTags", () => {
  it("normalizes and rejects invalid tags", () => {
    expect(normalizeInterestTag("  nocne spacery  ")).toBe("nocne spacery");
    expect(normalizeInterestTag("a")).toBeNull();
    expect(normalizeInterestTag("<script>")).toBeNull();
  });

  it("dedupes case-insensitively and caps at max", () => {
    const tags = sanitizeInterestTags(["jazz", "Jazz", "koty", ...Array.from({ length: 12 }, (_, i) => `tag${i}`)]);
    expect(tags.filter((t) => t.toLowerCase() === "jazz")).toHaveLength(1);
    expect(tags.length).toBeLessThanOrEqual(MAX_INTEREST_TAGS);
  });

  it("searches suggestions excluding selected", () => {
    const hits = searchInterestSuggestions("jaz", ["jazz"]);
    expect(hits.some((h) => h.tag === "jazz")).toBe(false);
  });
});
