import { describe, expect, it } from "vitest";
import { parseCatalogImportCsv, buildCatalogImportTemplate } from "@/lib/gabinet/catalogImport";

describe("catalogImport", () => {
  it("parses template rows", () => {
    const { rows, errors } = parseCatalogImportCsv(buildCatalogImportTemplate());
    expect(errors.length).toBe(0);
    expect(rows.length).toBeGreaterThan(0);
    expect(rows[0].name).toBe("Konsultacja");
    expect(rows[0].pricePln).toBe(150);
  });

  it("reports empty file", () => {
    const { rows, errors } = parseCatalogImportCsv("   ");
    expect(rows.length).toBe(0);
    expect(errors.length).toBeGreaterThan(0);
  });
});
