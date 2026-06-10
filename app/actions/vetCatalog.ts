"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { VET_CLINIC_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";
import {
  DEFAULT_CATALOG_TEMPLATES,
  normalizeCatalogCategory,
  parseCatalogPriceInput,
  PREVENTION_CATALOG_TEMPLATES,
} from "@/lib/vet/catalog";
import { normalizeVisitType } from "@/lib/vet/visitTypes";

export type VetCatalogActionResult = { ok: true; id?: string } | { ok: false; error: string };

async function requireVetClinicId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== VET_CLINIC_ROLE) return null;
  return (session?.user as { vetClinicId?: string })?.vetClinicId ?? null;
}

export async function upsertCatalogItemAction(formData: FormData): Promise<VetCatalogActionResult> {
  const vetClinicId = await requireVetClinicId();
  if (!vetClinicId) return { ok: false, error: "Brak uprawnień." };

  const id = formData.get("id")?.toString()?.trim();
  const name = formData.get("name")?.toString()?.trim();
  if (!name) return { ok: false, error: "Nazwa jest wymagana." };

  const category = normalizeCatalogCategory(formData.get("category")?.toString());
  const manufacturer = formData.get("manufacturer")?.toString()?.trim() || null;
  const defaultPrice = parseCatalogPriceInput(formData.get("defaultPrice")?.toString() ?? "");
  const defaultVisitType = formData.get("defaultVisitType")?.toString()?.trim() || null;
  const intervalRaw = formData.get("defaultIntervalDays")?.toString()?.trim();
  const defaultIntervalDays = intervalRaw ? parseInt(intervalRaw, 10) : 365;
  if (Number.isNaN(defaultIntervalDays) || defaultIntervalDays < 1) {
    return { ok: false, error: "Podaj poprawny interwał przypomnienia (dni)." };
  }
  const active = formData.get("active")?.toString() !== "false";
  const trackStock = formData.get("trackStock")?.toString() === "true";
  const stockRaw = formData.get("stockDoses")?.toString()?.trim();
  let stockDoses: number | null = null;
  if (stockRaw) {
    stockDoses = parseInt(stockRaw, 10);
    if (Number.isNaN(stockDoses) || stockDoses < 0) {
      return { ok: false, error: "Podaj poprawną liczbę dawek." };
    }
  }

  try {
    const prisma = getPrisma();
    if (id) {
      const existing = await prisma.vaccineType.findFirst({ where: { id, vetClinicId } });
      if (!existing) return { ok: false, error: "Nie znaleziono pozycji." };
      await prisma.vaccineType.update({
        where: { id },
        data: {
          category,
          name,
          manufacturer,
          defaultPrice,
          defaultIntervalDays,
          defaultVisitType: defaultVisitType ? normalizeVisitType(defaultVisitType) : null,
          trackStock,
          stockDoses: trackStock ? stockDoses : null,
          active,
        },
      });
      return { ok: true, id };
    }

    const maxOrder = await prisma.vaccineType.aggregate({
      where: { vetClinicId, category },
      _max: { order: true },
    });
    const created = await prisma.vaccineType.create({
      data: {
        vetClinicId,
        category,
        name,
        manufacturer,
        defaultPrice,
        defaultIntervalDays,
        defaultVisitType: defaultVisitType ? normalizeVisitType(defaultVisitType) : null,
        trackStock,
        stockDoses: trackStock ? stockDoses : null,
        active,
        order: (maxOrder._max.order ?? 0) + 1,
      },
    });
    return { ok: true, id: created.id };
  } catch {
    return { ok: false, error: "Nie udało się zapisać pozycji katalogu." };
  }
}

export async function deleteCatalogItemAction(id: string): Promise<VetCatalogActionResult> {
  const vetClinicId = await requireVetClinicId();
  if (!vetClinicId) return { ok: false, error: "Brak uprawnień." };
  if (!id?.trim()) return { ok: false, error: "Brak identyfikatora." };

  try {
    const prisma = getPrisma();
    const existing = await prisma.vaccineType.findFirst({ where: { id, vetClinicId } });
    if (!existing) return { ok: false, error: "Nie znaleziono pozycji." };

    const used = await prisma.vaccination.count({ where: { vaccineTypeId: id } });
    if (used > 0) {
      await prisma.vaccineType.update({ where: { id }, data: { active: false } });
      return { ok: true, id };
    }
    await prisma.vaccineType.delete({ where: { id } });
    return { ok: true, id };
  } catch {
    return { ok: false, error: "Nie udało się usunąć pozycji." };
  }
}

export async function seedDefaultCatalogAction(): Promise<VetCatalogActionResult & { added?: number }> {
  const vetClinicId = await requireVetClinicId();
  if (!vetClinicId) return { ok: false, error: "Brak uprawnień." };

  try {
    const prisma = getPrisma();
    const existing = await prisma.vaccineType.count({ where: { vetClinicId } });
    if (existing > 0) {
      return { ok: false, error: "Katalog nie jest pusty — usuń lub edytuj istniejące pozycje." };
    }

    let order = 0;
    for (const t of DEFAULT_CATALOG_TEMPLATES) {
      order += 1;
      await prisma.vaccineType.create({
        data: {
          vetClinicId,
          category: t.category,
          name: t.name,
          manufacturer: t.manufacturer ?? null,
          defaultPrice: t.defaultPriceGrosze ?? null,
          defaultIntervalDays: t.defaultIntervalDays ?? 365,
          defaultVisitType: t.defaultVisitType ?? null,
          order,
        },
      });
    }
    return { ok: true, added: DEFAULT_CATALOG_TEMPLATES.length };
  } catch {
    return { ok: false, error: "Nie udało się dodać szablonów." };
  }
}

export async function seedPreventionCatalogAction(): Promise<
  VetCatalogActionResult & { added?: number; skipped?: number }
> {
  const vetClinicId = await requireVetClinicId();
  if (!vetClinicId) return { ok: false, error: "Brak uprawnień." };

  try {
    const prisma = getPrisma();
    const existing = await prisma.vaccineType.findMany({
      where: { vetClinicId },
      select: { name: true },
    });
    const names = new Set(existing.map((e) => e.name.toLowerCase()));
    let added = 0;
    let skipped = 0;
    let order = (await prisma.vaccineType.aggregate({ where: { vetClinicId }, _max: { order: true } }))._max.order ?? 0;

    for (const t of PREVENTION_CATALOG_TEMPLATES) {
      if (names.has(t.name.toLowerCase())) {
        skipped += 1;
        continue;
      }
      order += 1;
      await prisma.vaccineType.create({
        data: {
          vetClinicId,
          category: t.category,
          name: t.name,
          manufacturer: t.manufacturer ?? null,
          defaultIntervalDays: t.defaultIntervalDays ?? 365,
          defaultVisitType: t.defaultVisitType ?? null,
          order,
        },
      });
      added += 1;
    }

    return { ok: true, added, skipped };
  } catch {
    return { ok: false, error: "Nie udało się dodać pozycji profilaktyki." };
  }
}

export async function importUrplProductsAction(
  urplIds: string[]
): Promise<VetCatalogActionResult & { imported?: number; skipped?: number }> {
  const vetClinicId = await requireVetClinicId();
  if (!vetClinicId) return { ok: false, error: "Brak uprawnień." };
  if (!urplIds.length) return { ok: false, error: "Wybierz produkty z rejestru URPL." };

  try {
    const { loadUrplVetProductsSnapshot } = await import("@/lib/vet/urplProducts");
    const all = await loadUrplVetProductsSnapshot();
    const byId = new Map(all.map((p) => [p.urplId, p]));
    const prisma = getPrisma();
    let imported = 0;
    let skipped = 0;

    for (const urplId of urplIds) {
      const src = byId.get(urplId);
      if (!src) continue;

      const exists = await prisma.vaccineType.findFirst({
        where: { vetClinicId, urplId },
      });
      if (exists) {
        skipped += 1;
        continue;
      }

      const maxOrder = await prisma.vaccineType.aggregate({
        where: { vetClinicId, category: src.isVaccine ? "szczepienie" : "inne" },
        _max: { order: true },
      });

      await prisma.vaccineType.create({
        data: {
          vetClinicId,
          category: src.isVaccine ? "szczepienie" : "inne",
          name: src.name,
          manufacturer: src.manufacturer,
          permitNumber: src.permitNumber,
          urplId: src.urplId,
          defaultIntervalDays: src.isVaccine ? 365 : 0,
          defaultVisitType: src.isVaccine ? "szczepienie" : null,
          order: (maxOrder._max.order ?? 0) + 1,
        },
      });
      imported += 1;
    }

    return { ok: true, imported, skipped };
  } catch {
    return { ok: false, error: "Nie udało się zaimportować z URPL." };
  }
}

export async function syncUrplRegisterAction(): Promise<
  VetCatalogActionResult & { total?: number; vaccines?: number; fetchedAt?: string }
> {
  const vetClinicId = await requireVetClinicId();
  if (!vetClinicId) return { ok: false, error: "Brak uprawnień." };

  try {
    const { fetchAndParseUrplVetProducts } = await import("@/lib/vet/urplProducts");
    const fs = await import("fs");
    const path = await import("path");
    const { products, fetchedAt } = await fetchAndParseUrplVetProducts();
    const outDir = path.join(process.cwd(), "lib/vet/data");
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, "urpl-vet-products.json"), JSON.stringify(products));
    fs.writeFileSync(
      path.join(outDir, "urpl-vet-products-meta.json"),
      JSON.stringify({
        fetchedAt,
        total: products.length,
        vaccines: products.filter((p) => p.isVaccine).length,
      })
    );
    return {
      ok: true,
      total: products.length,
      vaccines: products.filter((p) => p.isVaccine).length,
      fetchedAt,
    };
  } catch {
    return { ok: false, error: "Nie udało się pobrać rejestru URPL." };
  }
}
