import {
  getPreventionPlanForSpecies,
  PREVENTION_KIND_LABELS,
  PREVENTION_PRIORITY_LABELS,
  type PreventionKind,
  type PreventionPlanItem,
  type PreventionPriority,
} from "@/lib/vet/preventionPlans";
import { normalizeCatLifestyle, type CatLifestyle } from "@/lib/vet/catLifestyle";
import { normalizeSpeciesValue } from "@/lib/vet/speciesCatalog";

export type PreventionItemStatus = "done" | "overdue" | "due_soon" | "upcoming" | "skipped" | "na";

export type PreventionChecklistRow = {
  key: string;
  kind: PreventionKind;
  kindLabel: string;
  title: string;
  description: string;
  priority: PreventionPriority;
  priorityLabel: string;
  source: string;
  status: PreventionItemStatus;
  statusLabel: string;
  dueAt: string | null;
  doneAt: string | null;
  progress: string | null;
  seriesDone: number;
  seriesTotal: number;
};

export type PreventionChecklistSummary = {
  planId: string | null;
  planLabel: string | null;
  ageWeeks: number | null;
  lifeStage: string | null;
  total: number;
  done: number;
  overdue: number;
  dueSoon: number;
  items: PreventionChecklistRow[];
};

type VaccinationRow = {
  vaccineName: string;
  administeredAt: string;
};

type PreventionRecordRow = {
  itemKey: string;
  doneAt: string;
};

const MS_DAY = 24 * 60 * 60 * 1000;
const MS_WEEK = 7 * MS_DAY;
const DUE_SOON_DAYS = 14;

function parseDate(iso: string): Date {
  const d = iso.includes("T") ? new Date(iso) : new Date(`${iso}T12:00:00`);
  return d;
}

export function ageInWeeks(birthDate: string | null, ref = new Date()): number | null {
  if (!birthDate) return null;
  const birth = parseDate(birthDate);
  if (Number.isNaN(birth.getTime())) return null;
  return Math.floor((ref.getTime() - birth.getTime()) / MS_WEEK);
}

export function lifeStageLabel(ageWeeks: number | null, species: string): string | null {
  if (ageWeeks == null) return null;
  const s = normalizeSpeciesValue(species);
  if (ageWeeks < 16) {
    if (s === "pies") return "Szczenię";
    if (s === "kot") return "Kocię";
    if (s === "krolik") return "Młody królik";
    if (["owca", "koza", "krowa", "bydlo", "wol", "cielak", "swinia", "prosiak"].includes(s)) return "Młode";
    if (["drob", "kura", "kaczka", "ges", "indyk", "przepiorka"].includes(s)) return "Pisklę";
    return "Młody";
  }
  if (ageWeeks < 52) return "Młody";
  if (ageWeeks < 364) return "Dorosły";
  return "Senior";
}

function matchesKeyword(text: string, keywords: string[]): boolean {
  const n = text.toLowerCase();
  return keywords.some((k) => n.includes(k.toLowerCase()));
}

function statusLabel(status: PreventionItemStatus): string {
  switch (status) {
    case "done":
      return "Wykonane";
    case "overdue":
      return "Zaległe";
    case "due_soon":
      return "Wkrótce";
    case "upcoming":
      return "Planowane";
    case "skipped":
      return "Pominięte";
    default:
      return "Nie dotyczy";
  }
}

function addDays(iso: string, days: number): string {
  const d = parseDate(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

function addWeeksFromBirth(birthDate: string, weeks: number): string {
  const d = parseDate(birthDate);
  d.setDate(d.getDate() + weeks * 7);
  return d.toISOString();
}

function isApplicableByAge(item: PreventionPlanItem, birthDate: string | null, ageWeeks: number | null): boolean {
  const ageScoped = item.minAgeWeeks != null || item.maxAgeWeeks != null || (item.doseWeeks?.length ?? 0) > 0;

  if (!birthDate || ageWeeks == null) {
    return !ageScoped;
  }

  if (item.minAgeWeeks != null && ageWeeks < item.minAgeWeeks) return false;
  if (item.maxAgeWeeks != null && ageWeeks > item.maxAgeWeeks) return false;
  return true;
}

function isApplicableForCatLifestyle(
  item: PreventionPlanItem,
  species: string,
  catLifestyle: CatLifestyle | null
): boolean {
  if (normalizeSpeciesValue(species) !== "kot") return true;
  if (!catLifestyle) return true;

  if (catLifestyle === "indoor" && item.outdoorOnly) return false;

  // Kot wychodzący — ukryj pozycje typu „badanie” (panel krwi, testy laboratoryjne)
  if (catLifestyle === "outdoor" && item.kind === "badanie") return false;

  return true;
}

function isApplicable(
  item: PreventionPlanItem,
  birthDate: string | null,
  ageWeeks: number | null,
  species: string,
  catLifestyle: CatLifestyle | null
): boolean {
  if (!isApplicableByAge(item, birthDate, ageWeeks)) return false;
  if (!isApplicableForCatLifestyle(item, species, catLifestyle)) return false;
  return true;
}

function matchingVaccinations(item: PreventionPlanItem, vaccinations: VaccinationRow[]): VaccinationRow[] {
  return vaccinations
    .filter((v) => matchesKeyword(v.vaccineName, item.matchKeywords))
    .sort((a, b) => parseDate(a.administeredAt).getTime() - parseDate(b.administeredAt).getTime());
}

function matchingRecords(item: PreventionPlanItem, records: PreventionRecordRow[]): PreventionRecordRow[] {
  return records
    .filter((r) => r.itemKey === item.key)
    .sort((a, b) => parseDate(a.doneAt).getTime() - parseDate(b.doneAt).getTime());
}

function resolveItemStatus(
  item: PreventionPlanItem,
  birthDate: string | null,
  ageWeeks: number | null,
  vaccinations: VaccinationRow[],
  records: PreventionRecordRow[],
  now: Date
): Pick<PreventionChecklistRow, "status" | "dueAt" | "doneAt" | "progress" | "seriesDone" | "seriesTotal"> {
  const seriesTotal = item.doseWeeks?.length ?? (item.repeatIntervalDays ? 1 : 1);
  const vaxMatches = matchingVaccinations(item, vaccinations);
  const manualRecords = matchingRecords(item, records);
  const skipped = manualRecords.some((r) => r.doneAt === "1970-01-01T00:00:00.000Z");

  if (skipped) {
    return {
      status: "skipped",
      dueAt: null,
      doneAt: null,
      progress: null,
      seriesDone: 0,
      seriesTotal,
    };
  }

  const vaccineKind = item.kind === "szczepienie" || item.kind === "odrobaczanie" || item.kind === "profilaktyka";
  const useVax = vaccineKind && vaxMatches.length > 0;
  const lastManual = manualRecords.length > 0 ? manualRecords[manualRecords.length - 1] : null;
  const lastDone = useVax
    ? vaxMatches[vaxMatches.length - 1]
    : lastManual
      ? { administeredAt: lastManual.doneAt, vaccineName: item.title }
      : null;

  const seriesDone = item.doseWeeks ? Math.min(vaxMatches.length, item.doseWeeks.length) : lastDone ? 1 : 0;

  if (item.doseWeeks && birthDate && ageWeeks != null) {
    let nextDue: string | null = null;
    if (seriesDone < item.doseWeeks.length) {
      nextDue = addWeeksFromBirth(birthDate, item.doseWeeks[seriesDone]);
    } else if (item.repeatIntervalDays && lastDone) {
      nextDue = addDays(lastDone.administeredAt, item.repeatIntervalDays);
    }

    if (seriesDone >= item.doseWeeks.length && item.repeatIntervalDays && lastDone) {
      const boosterDue = addDays(lastDone.administeredAt, item.repeatIntervalDays);
      const boosterDone = vaxMatches.some(
        (v) => parseDate(v.administeredAt).getTime() > parseDate(lastDone.administeredAt).getTime() + item.repeatIntervalDays! * MS_DAY * 0.5
      );
      if (boosterDone) {
        const latest = vaxMatches[vaxMatches.length - 1];
        return {
          status: "done",
          dueAt: addDays(latest.administeredAt, item.repeatIntervalDays),
          doneAt: latest.administeredAt,
          progress: `${seriesDone}/${seriesTotal} dawek + booster`,
          seriesDone,
          seriesTotal,
        };
      }
      return classifyDue(boosterDue, lastDone.administeredAt, `${seriesDone}/${seriesTotal} + booster`, seriesDone, seriesTotal, now);
    }

    if (seriesDone >= item.doseWeeks.length && !item.repeatIntervalDays) {
      const latest = vaxMatches[vaxMatches.length - 1];
      return {
        status: "done",
        dueAt: null,
        doneAt: latest?.administeredAt ?? lastManual?.doneAt ?? null,
        progress: `${seriesDone}/${seriesTotal}`,
        seriesDone,
        seriesTotal,
      };
    }

    if (seriesDone > 0 && seriesDone < item.doseWeeks.length) {
      return classifyDue(nextDue!, lastDone!.administeredAt, `${seriesDone}/${seriesTotal}`, seriesDone, seriesTotal, now);
    }

    if (seriesDone === 0) {
      nextDue = addWeeksFromBirth(birthDate, item.doseWeeks[0]);
      return classifyDue(nextDue, null, `0/${seriesTotal}`, 0, seriesTotal, now);
    }
  }

  if (item.repeatIntervalDays && lastDone) {
    const nextDue = addDays(lastDone.administeredAt, item.repeatIntervalDays);
    return classifyDue(nextDue, lastDone.administeredAt, null, 1, 1, now);
  }

  if (lastManual) {
    return {
      status: "done",
      dueAt: item.repeatIntervalDays ? addDays(lastManual.doneAt, item.repeatIntervalDays) : null,
      doneAt: lastManual.doneAt,
      progress: null,
      seriesDone: 1,
      seriesTotal: 1,
    };
  }

  if (item.doseWeeks && birthDate) {
    const nextDue = addWeeksFromBirth(birthDate, item.doseWeeks[0]);
    return classifyDue(nextDue, null, `0/${seriesTotal}`, 0, seriesTotal, now);
  }

  if (item.repeatIntervalDays && birthDate) {
    const start = addWeeksFromBirth(birthDate, item.minAgeWeeks ?? 52);
    return classifyDue(start, null, null, 0, 1, now);
  }

  return {
    status: "upcoming",
    dueAt: null,
    doneAt: null,
    progress: null,
    seriesDone: 0,
    seriesTotal,
  };
}

function classifyDue(
  dueAtIso: string,
  doneAt: string | null,
  progress: string | null,
  seriesDone: number,
  seriesTotal: number,
  now: Date
): Pick<PreventionChecklistRow, "status" | "dueAt" | "doneAt" | "progress" | "seriesDone" | "seriesTotal"> {
  const dueMs = parseDate(dueAtIso).getTime();
  const nowMs = now.getTime();
  let status: PreventionItemStatus = "upcoming";
  if (dueMs < nowMs - MS_DAY) status = "overdue";
  else if (dueMs <= nowMs + DUE_SOON_DAYS * MS_DAY) status = "due_soon";

  return {
    status,
    dueAt: dueAtIso,
    doneAt: doneAt,
    progress,
    seriesDone,
    seriesTotal,
  };
}

export function buildPreventionChecklist(input: {
  species: string;
  birthDate: string | null;
  catLifestyle?: string | null;
  vaccinations: VaccinationRow[];
  records: PreventionRecordRow[];
  planDisabled?: boolean;
}): PreventionChecklistSummary {
  const plan = getPreventionPlanForSpecies(input.species);
  const now = new Date();
  const ageWeeks = ageInWeeks(input.birthDate, now);
  const catLifestyle = normalizeCatLifestyle(input.catLifestyle);

  if (!plan || input.planDisabled) {
    return {
      planId: plan?.id ?? null,
      planLabel: plan?.label ?? null,
      ageWeeks,
      lifeStage: lifeStageLabel(ageWeeks, input.species),
      total: 0,
      done: 0,
      overdue: 0,
      dueSoon: 0,
      items: [],
    };
  }

  const items: PreventionChecklistRow[] = plan.items
    .filter((item) => isApplicable(item, input.birthDate, ageWeeks, input.species, catLifestyle))
    .map((item) => {
      const resolved = resolveItemStatus(
        item,
        input.birthDate,
        ageWeeks,
        input.vaccinations,
        input.records,
        now
      );
      return {
        key: item.key,
        kind: item.kind,
        kindLabel: PREVENTION_KIND_LABELS[item.kind],
        title: item.title,
        description: item.description,
        priority: item.priority,
        priorityLabel: PREVENTION_PRIORITY_LABELS[item.priority],
        source: item.source,
        statusLabel: statusLabel(resolved.status),
        ...resolved,
      };
    });

  const priorityOrder = { obowiazkowe: 0, zalecane: 1, opcjonalne: 2 };
  const statusOrder = { overdue: 0, due_soon: 1, upcoming: 2, done: 3, skipped: 4, na: 5 };
  items.sort(
    (a, b) =>
      statusOrder[a.status] - statusOrder[b.status] ||
      priorityOrder[a.priority] - priorityOrder[b.priority] ||
      a.title.localeCompare(b.title, "pl")
  );

  return {
    planId: plan.id,
    planLabel: plan.label,
    ageWeeks,
    lifeStage: lifeStageLabel(ageWeeks, input.species),
    total: items.length,
    done: items.filter((i) => i.status === "done").length,
    overdue: items.filter((i) => i.status === "overdue").length,
    dueSoon: items.filter((i) => i.status === "due_soon").length,
    items,
  };
}
