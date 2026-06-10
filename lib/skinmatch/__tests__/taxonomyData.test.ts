import { describe, it, expect } from "vitest";
import { normalizeSlug } from "../taxonomySlug";
import {
  CATEGORIES,
  SUBCATEGORIES,
  TAGS,
  TREATMENT_ENTRIES,
} from "../../../prisma/taxonomyData";

describe("taxonomyData", () => {
  describe("uniqueness – brak duplikatów po slug", () => {
    it("kategorie mają unikalne slugi", () => {
      const slugs = CATEGORIES.map((c) => normalizeSlug(c.slug) || c.slug);
      const set = new Set(slugs);
      expect(set.size).toBe(slugs.length);
    });

    it("podkategorie mają unikalne slugi", () => {
      const slugs = SUBCATEGORIES.map((s) => normalizeSlug(s.slug) || s.slug);
      const set = new Set(slugs);
      expect(set.size).toBe(slugs.length);
    });

    it("tagi mają unikalne slugi", () => {
      const slugs = TAGS.map((t) => normalizeSlug(t.slug) || t.slug);
      const set = new Set(slugs);
      expect(set.size).toBe(slugs.length);
    });

    it("wpisy zabiegów mają unikalne slugi (id zabiegu)", () => {
      const slugs = TREATMENT_ENTRIES.map((e) => normalizeSlug(e.slug) || e.slug).filter(Boolean);
      const set = new Set(slugs);
      expect(set.size).toBe(slugs.length);
    });
  });

  describe("referencje", () => {
    const categorySlugs = new Set(CATEGORIES.map((c) => normalizeSlug(c.slug) || c.slug));
    const subcategorySlugs = new Set(SUBCATEGORIES.map((s) => normalizeSlug(s.slug) || s.slug));

    it("podkategorie odwołują się do istniejących kategorii", () => {
      for (const sub of SUBCATEGORIES) {
        const catSlug = normalizeSlug(sub.categorySlug) || sub.categorySlug;
        expect(categorySlugs.has(catSlug), `Subcategory ${sub.slug} -> missing category ${sub.categorySlug}`).toBe(true);
      }
    });

    it("wpisy zabiegów odwołują się do istniejących kategorii i podkategorii", () => {
      for (const entry of TREATMENT_ENTRIES) {
        const catSlug = normalizeSlug(entry.categorySlug) || entry.categorySlug;
        const subSlug = normalizeSlug(entry.subcategorySlug) || entry.subcategorySlug;
        expect(categorySlugs.has(catSlug), `Treatment ${entry.slug} -> missing category ${entry.categorySlug}`).toBe(true);
        expect(subcategorySlugs.has(subSlug), `Treatment ${entry.slug} -> missing subcategory ${entry.subcategorySlug}`).toBe(true);
      }
    });
  });
});
