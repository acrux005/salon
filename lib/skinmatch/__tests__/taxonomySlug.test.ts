import { describe, it, expect } from "vitest";
import { normalizeSlug, normalizeNameToSlug } from "../taxonomySlug";

describe("taxonomySlug", () => {
  describe("normalizeSlug", () => {
    it("zwraca lowercase i zamienia spacje na podkreślenia", () => {
      expect(normalizeSlug("Brwi i rzęsy")).toBe("brwi_i_rzesy");
    });

    it("zamienia polskie znaki na ascii", () => {
      expect(normalizeSlug("Pielęgnacja")).toBe("pielegnacja");
      expect(normalizeSlug("Ślubny")).toBe("slubny");
      expect(normalizeSlug("Łojotok")).toBe("lojotok");
    });

    it("usuwa podwójne podkreślenia", () => {
      expect(normalizeSlug("a__b___c")).toBe("a_b_c");
    });

    it("obcina podkreślenia na początku i końcu", () => {
      expect(normalizeSlug("  brwi_rzesy  ")).toBe("brwi_rzesy");
    });

    it("zwraca pusty string dla pustego wejścia", () => {
      expect(normalizeSlug("")).toBe("");
      expect(normalizeSlug("   ")).toBe("");
    });

    it("daje ten sam wynik dla różnych wariantów (unikalność)", () => {
      expect(normalizeSlug("Brwi i rzęsy")).toBe(normalizeSlug("brwi i rzesy"));
      expect(normalizeSlug("Pielęgnacja")).toBe(normalizeSlug("pielegnacja"));
    });
  });

  describe("normalizeNameToSlug", () => {
    it("działa jak normalizeSlug dla nazw", () => {
      expect(normalizeNameToSlug("Oczyszczanie manualne")).toBe("oczyszczanie_manualne");
    });
  });
});
