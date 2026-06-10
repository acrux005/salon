// lib/skinmatch/index.ts
export * from "./schema";
export * from "./catalog";
export * from "./clinics";
export { buildClinicPageData } from "./clinicData";
export type { ClinicPageData } from "./clinicData";
export {
  legacyToQuizTags,
  normalizeTags,
  sortTags,
  QUIZ_TAG_ORDER,
  type LegacyAnalyzePayload,
} from "./legacyQuiz";
