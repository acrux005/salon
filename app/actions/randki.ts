"use server";

import bcrypt from "bcrypt";
import crypto from "crypto";
import { headers } from "next/headers";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { RANDKI_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";
import { tryConsume } from "@/lib/rateLimit";
import { getAllowedCities } from "@/lib/voivodeships";
import { recordLike, sendMatchMessage, discoverProfiles, countDailyResonances, countDailyImpressions, DAILY_RESONANCE_LIMIT, undoLastPass } from "@/lib/randki/matching";
import { getDailyDiscoveryLimit } from "@/lib/randki/premium";
import { deriveCommunicationStyle, RANDKI_ONBOARDING_QUESTIONS, type OnboardingAnswers } from "@/lib/randki/onboarding";
import { generateDateSuggestions } from "@/lib/randki/ai";
import { listRestaurantsForDating } from "@/lib/randki/restaurants";
import { sendDatingVerificationEmail } from "@/lib/randki/email";
import { blockDatingUser, reportDatingUser, unmatchByMatchId } from "@/lib/randki/blocks";
import { createDateProposal, respondDateProposal } from "@/lib/randki/dateProposal";
import { listProfilePhotos, MAX_PHOTOS, syncPrimaryPhotoUrl, countVisiblePhotos, deletePhotoById } from "@/lib/randki/photos";
import { requireDatingAccountIdWithError } from "@/lib/randki/session";
import {
  verifyDatingImageBuffer,
  verifyMomentCaptureTime,
  verifyMomentPairCaptureTimes,
  type PhotoVerifyMode,
} from "@/lib/randki/photoVerify";
import { prepareDatingImageFile } from "@/lib/randki/normalizeDatingImage";

const MIN_PASSWORD = 8;
const VERIFY_EXPIRES_MS = 24 * 60 * 60 * 1000;
const MAX_AVATAR = 4 * 1024 * 1024;
const UPLOADS_DIR = "uploads/randki";

function imageExt(mime: string): string {
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/png") return "png";
  return "webp";
}

async function saveDatingImageFile(
  accountId: string,
  file: File,
  suffix: string,
  verifyMode?: PhotoVerifyMode
): Promise<{ url: string; capturedAt?: Date } | { error: string }> {
  if (file.size > MAX_AVATAR) return { error: "Plik może mieć maks. 4 MB." };
  const prepared = await prepareDatingImageFile(file);
  if ("error" in prepared) return prepared;
  const { raw, sourceMime, buffer, mime } = prepared;

  let capturedAt: Date | undefined;
  if (verifyMode) {
    const check = await verifyDatingImageBuffer(raw, sourceMime, verifyMode);
    if (!check.ok) return { error: check.error };
    capturedAt = check.capturedAt ?? undefined;
  }

  const ext = imageExt(mime);
  const fileName = `${accountId}${suffix}.${ext}`;
  const dir = path.join(process.cwd(), "public", UPLOADS_DIR);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, fileName), buffer);
  return {
    url: `/${UPLOADS_DIR}/${fileName}`,
    capturedAt,
  };
}

export type RandkiActionResult = { ok: true } | { ok: false; error: string };

async function requireDatingSession() {
  return requireDatingAccountIdWithError();
}

async function getRequestHost(): Promise<string> {
  return (await headers()).get("host") ?? "";
}

export async function registerDatingAccountAction(formData: FormData): Promise<
  RandkiActionResult & { accountId?: string; needsEmailVerification?: boolean; emailSent?: boolean }
> {
  const email = formData.get("email")?.toString()?.trim()?.toLowerCase();
  const password = formData.get("password")?.toString();
  const displayName = formData.get("displayName")?.toString()?.trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Podaj prawidłowy adres e-mail." };
  }
  if (!password || password.length < MIN_PASSWORD) {
    return { ok: false, error: `Hasło musi mieć co najmniej ${MIN_PASSWORD} znaków.` };
  }
  if (!displayName || displayName.length < 2) {
    return { ok: false, error: "Podaj imię lub pseudonim (min. 2 znaki)." };
  }
  if (!tryConsume("randki-register:" + email, 5, 60 * 60 * 1000)) {
    return { ok: false, error: "Zbyt wiele prób rejestracji. Spróbuj za godzinę." };
  }
  try {
    const prisma = getPrisma();
    if (await prisma.datingAccount.findUnique({ where: { email } })) {
      return { ok: false, error: "Konto z tym e-mailem już istnieje." };
    }
    const hash = await bcrypt.hash(password, 10);
    const autoVerify = process.env.RANDKI_AUTO_VERIFY === "true";
    const verificationToken = autoVerify ? null : crypto.randomBytes(32).toString("hex");
    const account = await prisma.datingAccount.create({
      data: {
        email,
        passwordHash: hash,
        emailVerifiedAt: autoVerify ? new Date() : null,
        verificationToken,
        verificationTokenExpires: autoVerify ? null : new Date(Date.now() + VERIFY_EXPIRES_MS),
      },
    });
    await prisma.datingProfile.create({
      data: {
        accountId: account.id,
        displayName,
        birthYear: new Date().getFullYear() - 25,
        city: "Warszawa",
        gender: "other",
        lookingFor: JSON.stringify(["woman", "man"]),
        completed: false,
      },
    });
    let emailSent = false;
    if (!autoVerify && verificationToken) {
      const host = await getRequestHost();
      emailSent = await sendDatingVerificationEmail(email, verificationToken, host);
    }
    return {
      ok: true,
      accountId: account.id,
      needsEmailVerification: !autoVerify,
      emailSent,
    };
  } catch (e) {
    console.error("registerDatingAccountAction:", e);
    return { ok: false, error: "Błąd rejestracji." };
  }
}

export async function saveDatingProfileAction(formData: FormData): Promise<RandkiActionResult> {
  const session = await requireDatingSession();
  if (!session.ok) return session;
  const accountId = session.accountId;

  const displayName = formData.get("displayName")?.toString()?.trim() ?? "";
  const birthYearRaw = parseInt(formData.get("birthYear")?.toString() ?? "", 10);
  const city = formData.get("city")?.toString()?.trim() ?? "";
  const gender = formData.get("gender")?.toString()?.trim() ?? "";
  const bio = formData.get("bio")?.toString()?.trim() ?? "";
  const lookingForRaw = formData.getAll("lookingFor").map((v) => v.toString());
  const interestsRaw = formData.getAll("interests").map((v) => v.toString());
  const { sanitizeInterestTags } = await import("@/lib/randki/interestTags");
  const interests = sanitizeInterestTags(interestsRaw);
  const promptQ1 = formData.get("promptQ1")?.toString()?.trim() ?? "";
  const promptA1 = formData.get("promptA1")?.toString()?.trim() ?? "";
  const promptQ2 = formData.get("promptQ2")?.toString()?.trim() ?? "";
  const promptA2 = formData.get("promptA2")?.toString()?.trim() ?? "";
  const searchAllCities = formData.get("searchAllCities") === "1";
  const profileActive = formData.get("profileActive") !== "0";
  const ageMinPref = parseInt(formData.get("ageMinPref")?.toString() ?? "18", 10);
  const ageMaxPref = parseInt(formData.get("ageMaxPref")?.toString() ?? "99", 10);

  if (displayName.length < 2) return { ok: false, error: "Imię / pseudonim — min. 2 znaki." };
  const year = new Date().getFullYear();
  if (!birthYearRaw || birthYearRaw < year - 80 || birthYearRaw > year - 18) {
    return { ok: false, error: "Musisz mieć co najmniej 18 lat." };
  }
  if (!getAllowedCities().includes(city)) return { ok: false, error: "Wybierz miasto z listy." };
  if (!["woman", "man", "other"].includes(gender)) return { ok: false, error: "Wybierz płeć." };
  if (lookingForRaw.length === 0) return { ok: false, error: "Zaznacz, kogo szukasz." };
  if (ageMinPref < 18 || ageMaxPref > 99 || ageMinPref > ageMaxPref) {
    return { ok: false, error: "Nieprawidłowy zakres wieku." };
  }

  const prompts = [
    promptQ1 && promptA1 ? { question: promptQ1, answer: promptA1 } : null,
    promptQ2 && promptA2 ? { question: promptQ2, answer: promptA2 } : null,
  ].filter(Boolean);

  try {
    const photoCount = await countVisiblePhotos(accountId);
    if (photoCount < 1) {
      return { ok: false, error: "Dodaj co najmniej jedno zdjęcie, zanim ukończysz profil." };
    }
    await getPrisma().datingProfile.update({
      where: { accountId },
      data: {
        displayName,
        birthYear: birthYearRaw,
        city,
        gender,
        bio: bio.slice(0, 800),
        lookingFor: JSON.stringify(lookingForRaw),
        interests: JSON.stringify(interests),
        promptsJson: JSON.stringify(prompts),
        searchAllCities,
        ageMinPref,
        ageMaxPref,
        completed: true,
        active: profileActive,
      },
    });
    return { ok: true };
  } catch (e) {
    console.error("saveDatingProfileAction:", e);
    return { ok: false, error: "Nie udało się zapisać profilu." };
  }
}

export async function uploadDatingPhotoAction(formData: FormData): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  const session = await requireDatingSession();
  if (!session.ok) return session;
  const accountId = session.accountId;
  const file = formData.get("photo");
  if (!file || !(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Wybierz zdjęcie (JPG, PNG lub WebP)." };
  }
  const prisma = getPrisma();
  const count = await prisma.datingPhoto.count({ where: { accountId } });
  if (count >= MAX_PHOTOS) return { ok: false, error: `Maksymalnie ${MAX_PHOTOS} zdjęć.` };
  if (!tryConsume("randki-upload:" + accountId, 20, 60 * 60 * 1000)) {
    return { ok: false, error: "Zbyt wiele uploadów. Spróbuj za godzinę." };
  }
  try {
    const saved = await saveDatingImageFile(accountId, file, `-${Date.now()}`, "profile");
    if ("error" in saved) return { ok: false, error: saved.error };
    await prisma.datingPhoto.create({
      data: { accountId, url: saved.url, order: count },
    });
    await syncPrimaryPhotoUrl(accountId);
    return { ok: true, url: saved.url };
  } catch (e) {
    console.error("uploadDatingPhotoAction:", e);
    return { ok: false, error: "Nie udało się zapisać zdjęcia." };
  }
}

export async function deleteDatingPhotoAction(photoId: string): Promise<RandkiActionResult> {
  const session = await requireDatingSession();
  if (!session.ok) return session;
  const accountId = session.accountId;
  const deleted = await deletePhotoById(accountId, photoId);
  if (!deleted) return { ok: false, error: "Nie znaleziono zdjęcia." };
  const rest = await listProfilePhotos(accountId, true);
  for (let i = 0; i < rest.length; i++) {
    await getPrisma().datingPhoto.update({ where: { id: rest[i].id }, data: { order: i } });
  }
  await syncPrimaryPhotoUrl(accountId);
  return { ok: true };
}

export async function saveDatingAuraAction(
  formData: FormData
): Promise<
  { ok: true; imageUrl?: string; imageUrl2?: string; imageUrl3?: string } | { ok: false; error: string }
> {
  const session = await requireDatingSession();
  if (!session.ok) return session;
  const accountId = session.accountId;

  const caption = formData.get("caption")?.toString()?.trim() ?? "";
  const prompt = formData.get("prompt")?.toString()?.trim() ?? "";
  if (caption.length > 200) return { ok: false, error: "Podpis może mieć maks. 200 znaków." };
  if (prompt.length > 320) return { ok: false, error: "Opis klimatu może mieć maks. 320 znaków." };

  const planeKeys = ["aura_head", "aura_heart", "aura_roots"] as const;
  const uploaded: Partial<Record<(typeof planeKeys)[number], string>> = {};

  for (const key of planeKeys) {
    const file = formData.get(key);
    if (!(file instanceof File) || file.size === 0) continue;
    if (!tryConsume("randki-aura:" + accountId, 15, 60 * 60 * 1000)) {
      return { ok: false, error: "Zbyt wiele uploadów aury. Spróbuj za godzinę." };
    }
    const saved = await saveDatingImageFile(accountId, file, `-${key}-${Date.now()}`, undefined);
    if ("error" in saved) return { ok: false, error: saved.error };
    uploaded[key] = saved.url;
  }

  try {
    const prisma = getPrisma();
    const existing = await prisma.datingProfile.findUnique({
      where: { accountId },
      select: { auraImageUrl: true, auraImageUrl2: true, auraImageUrl3: true },
    });

    const next1 = uploaded.aura_head ?? existing?.auraImageUrl ?? null;
    const next2 = uploaded.aura_heart ?? existing?.auraImageUrl2 ?? null;
    const next3 = uploaded.aura_roots ?? existing?.auraImageUrl3 ?? null;

    if (!next1 && !next2 && !next3) {
      return { ok: false, error: "Wgraj co najmniej jedną grafikę (dowolna płaszczyzna)." };
    }

    await prisma.datingProfile.update({
      where: { accountId },
      data: {
        ...(uploaded.aura_head ? { auraImageUrl: next1 } : {}),
        ...(uploaded.aura_heart ? { auraImageUrl2: next2 } : {}),
        ...(uploaded.aura_roots ? { auraImageUrl3: next3 } : {}),
        auraCaption: caption,
        auraPrompt: prompt,
        auraStatus: "uploaded",
      },
    });
    return { ok: true, imageUrl: next1 ?? undefined, imageUrl2: next2 ?? undefined, imageUrl3: next3 ?? undefined };
  } catch (e) {
    console.error("saveDatingAuraAction:", e);
    return { ok: false, error: "Nie udało się zapisać aury." };
  }
}

export async function deleteDatingAuraAction(): Promise<RandkiActionResult> {
  const session = await requireDatingSession();
  if (!session.ok) return session;
  try {
    await getPrisma().datingProfile.update({
      where: { accountId: session.accountId },
      data: {
        auraImageUrl: null,
        auraImageUrl2: null,
        auraImageUrl3: null,
        auraCaption: "",
        auraPrompt: "",
        auraStatus: "none",
      },
    });
    return { ok: true };
  } catch (e) {
    console.error("deleteDatingAuraAction:", e);
    return { ok: false, error: "Nie udało się usunąć aury." };
  }
}

export async function reorderDatingPhotoAction(photoId: string, direction: "up" | "down"): Promise<RandkiActionResult> {
  const session = await requireDatingSession();
  if (!session.ok) return session;
  const accountId = session.accountId;
  const photos = await listProfilePhotos(accountId, true);
  const idx = photos.findIndex((p) => p.id === photoId);
  if (idx < 0) return { ok: false, error: "Nie znaleziono zdjęcia." };
  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= photos.length) return { ok: true };
  const prisma = getPrisma();
  await prisma.datingPhoto.update({ where: { id: photos[idx].id }, data: { order: swapIdx } });
  await prisma.datingPhoto.update({ where: { id: photos[swapIdx].id }, data: { order: idx } });
  await syncPrimaryPhotoUrl(accountId);
  return { ok: true };
}

export async function refreshDiscoveryAction(offset = 0): Promise<
  | { ok: true; cards: Awaited<ReturnType<typeof discoverProfiles>>; dailyResonances: number; dailyLimit: number; impressionsToday: number; discoveryLimit: number }
  | { ok: false; error: string }
> {
  const session = await requireDatingSession();
  if (!session.ok) return session;
  const accountId = session.accountId;
  const discoveryLimit = await getDailyDiscoveryLimit(accountId);
  const cards = await discoverProfiles(accountId, discoveryLimit, offset);
  const dailyResonances = await countDailyResonances(accountId);
  const impressionsToday = await countDailyImpressions(accountId);
  return {
    ok: true,
    cards,
    dailyResonances,
    dailyLimit: DAILY_RESONANCE_LIMIT,
    impressionsToday,
    discoveryLimit,
  };
}

/** Zostań w pokoju — ślad rezonansu, nie ocena człowieka. */
export async function resonateWithRoomAction(toAccountId: string): Promise<{ ok: true; matched: boolean; matchId?: string } | { ok: false; error: string }> {
  const session = await requireDatingSession();
  if (!session.ok) return session;
  const accountId = session.accountId;
  if (!tryConsume("randki-resonance:" + accountId, 60, 60 * 1000)) {
    return { ok: false, error: "Zbyt szybko. Odczekaj chwilę." };
  }
  const host = await getRequestHost();
  return recordLike(accountId, toAccountId, true, host);
}

/** Dryfuj dalej — wyjście z pokoju bez oceny. */
export async function driftFromRoomAction(toAccountId: string): Promise<RandkiActionResult> {
  const session = await requireDatingSession();
  if (!session.ok) return session;
  const accountId = session.accountId;
  const res = await recordLike(accountId, toAccountId, false);
  if (!res.ok) return res;
  return { ok: true };
}

/** @deprecated use resonateWithRoomAction */
export async function likeDatingProfileAction(toAccountId: string): Promise<{ ok: true; matched: boolean; matchId?: string } | { ok: false; error: string }> {
  return resonateWithRoomAction(toAccountId);
}

/** @deprecated use driftFromRoomAction */
export async function passDatingProfileAction(toAccountId: string): Promise<RandkiActionResult> {
  return driftFromRoomAction(toAccountId);
}

export async function sendDatingMessageAction(matchId: string, body: string): Promise<RandkiActionResult> {
  const session = await requireDatingSession();
  if (!session.ok) return session;
  const accountId = session.accountId;
  if (!tryConsume("randki-msg:" + accountId, 30, 60 * 1000)) {
    return { ok: false, error: "Zbyt wiele wiadomości. Odczekaj chwilę." };
  }
  const host = await getRequestHost();
  const res = await sendMatchMessage(matchId, accountId, body, host);
  if (!res.ok) return res;
  return { ok: true };
}

const MAX_CHAT_VOICE = 384 * 1024;

export async function sendChatVoiceNoteAction(
  matchId: string,
  formData: FormData
): Promise<RandkiActionResult> {
  const session = await requireDatingSession();
  if (!session.ok) return session;
  const file = formData.get("voiceNote");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Nagraj krótką notkę głosową." };
  }
  if (file.size > MAX_CHAT_VOICE) {
    return { ok: false, error: "Notka może mieć maks. ~20 s." };
  }
  if (!tryConsume("randki-chat-voice:" + session.accountId, 12, 60 * 60 * 1000)) {
    return { ok: false, error: "Limit notek głosowych — spróbuj za chwilę." };
  }
  const saved = await saveDatingAudioFile(session.accountId, file, "chat-voice");
  if ("error" in saved) return { ok: false, error: saved.error };
  const { formatVoiceChatBody } = await import("@/lib/randki/chatMessage");
  const host = await getRequestHost();
  const res = await sendMatchMessage(matchId, session.accountId, formatVoiceChatBody(saved.url), host);
  if (!res.ok) return res;
  return { ok: true };
}

export async function blockDatingUserAction(targetAccountId: string): Promise<RandkiActionResult> {
  const session = await requireDatingSession();
  if (!session.ok) return session;
  const accountId = session.accountId;
  const res = await blockDatingUser(accountId, targetAccountId);
  if (!res.ok) return res;
  return { ok: true };
}

export async function reportDatingUserAction(targetAccountId: string, reason: string): Promise<RandkiActionResult> {
  const session = await requireDatingSession();
  if (!session.ok) return session;
  const accountId = session.accountId;
  if (!tryConsume("randki-report:" + accountId, 5, 24 * 60 * 60 * 1000)) {
    return { ok: false, error: "Zbyt wiele zgłoszeń na dziś." };
  }
  const res = await reportDatingUser(accountId, targetAccountId, reason);
  if (!res.ok) return res;
  return { ok: true };
}

export async function proposeDatingDateAction(
  matchId: string,
  formData: FormData
): Promise<RandkiActionResult & { proposalId?: string }> {
  const session = await requireDatingSession();
  if (!session.ok) return session;
  const accountId = session.accountId;
  const res = await createDateProposal(matchId, accountId, {
    proposedDate: formData.get("proposedDate")?.toString() ?? "",
    proposedTime: formData.get("proposedTime")?.toString() ?? "",
    place: formData.get("place")?.toString() ?? "",
    note: formData.get("note")?.toString() ?? "",
  });
  if (!res.ok) return res;
  return { ok: true, proposalId: res.proposalId };
}

export async function respondDatingDateAction(proposalId: string, accept: boolean): Promise<RandkiActionResult> {
  const session = await requireDatingSession();
  if (!session.ok) return session;
  const accountId = session.accountId;
  return respondDateProposal(proposalId, accountId, accept);
}

export async function unmatchDatingMatchAction(matchId: string): Promise<RandkiActionResult> {
  const session = await requireDatingSession();
  if (!session.ok) return session;
  const accountId = session.accountId;
  await unmatchByMatchId(matchId, accountId);
  return { ok: true };
}

/** Cofnij wyjście z pokoju. */
export async function undoDriftAction(toAccountId: string): Promise<RandkiActionResult> {
  const session = await requireDatingSession();
  if (!session.ok) return session;
  const accountId = session.accountId;
  const res = await undoLastPass(accountId, toAccountId);
  if (!res.ok) return res;
  return { ok: true };
}

/** @deprecated use undoDriftAction */
export async function undoPassDatingAction(toAccountId: string): Promise<RandkiActionResult> {
  return undoDriftAction(toAccountId);
}

export async function saveOnboardingAction(formData: FormData): Promise<RandkiActionResult> {
  const session = await requireDatingSession();
  if (!session.ok) return session;
  const accountId = session.accountId;
  const intention = formData.get("intention")?.toString()?.trim() || "relationship";
  const answers: OnboardingAnswers = {};
  for (const q of RANDKI_ONBOARDING_QUESTIONS) {
    if (q.type === "multi") {
      const vals = formData.getAll(`q_${q.id}`).map((v) => v.toString());
      if (vals.length) answers[q.id] = vals;
    } else {
      const v = formData.get(`q_${q.id}`)?.toString()?.trim();
      if (v) answers[q.id] = v;
    }
  }
  const communicationStyle = deriveCommunicationStyle(answers);
  await getPrisma().datingProfile.update({
    where: { accountId },
    data: {
      intention,
      onboardingJson: JSON.stringify(answers),
      onboardingDone: true,
      communicationStyle,
      profileQualityScore: 95,
    },
  });
  return { ok: true };
}

export async function setDatingTodayStateAction(state: string | null): Promise<RandkiActionResult> {
  const session = await requireDatingSession();
  if (!session.ok) return session;
  const { normalizeTodayState, TODAY_STATE_MAX_LEN } = await import("@/lib/randki/todayState");
  const normalized = state?.trim() ? normalizeTodayState(state) : null;
  if (normalized && normalized.length > TODAY_STATE_MAX_LEN) {
    return { ok: false, error: "Mikro-status jest za długi." };
  }
  await getPrisma().datingProfile.update({
    where: { accountId: session.accountId },
    data: { todayState: normalized, todayStateUpdatedAt: normalized ? new Date() : null },
  });
  return { ok: true };
}

export async function enterGuestRoomAction(roomId: string): Promise<
  { ok: true; guestId: string; alias: string } | { ok: false; error: string }
> {
  if (!roomId?.trim()) return { ok: false, error: "Brak pokoju." };
  const { resolveGuestRoom } = await import("@/lib/randki/guestRoom");
  const { generateGuestId, pickGuestAlias, writeGuestSession } = await import("@/lib/randki/guestSession");
  const view = await resolveGuestRoom(roomId.trim());
  if (!view) return { ok: false, error: "Nie znaleziono pokoju." };
  if (!view.allowsGuest) return { ok: false, error: "Ten pokój wymaga konta." };
  const guestId = generateGuestId();
  const alias = pickGuestAlias(guestId);
  await writeGuestSession(guestId, view.roomId, alias);
  return { ok: true, guestId, alias };
}

export async function leaveGuestRoomAction(): Promise<RandkiActionResult> {
  const { clearGuestSession } = await import("@/lib/randki/guestSession");
  await clearGuestSession();
  return { ok: true };
}

export async function leavePresenceReactionAction(
  roomAccountId: string,
  reactionId: string,
  opts?: { replyToTraceId?: string; momentId?: string }
): Promise<{ ok: true; trace: string } | { ok: false; error: string }> {
  const session = await requireDatingSession();
  if (!session.ok) return session;
  if (!roomAccountId?.trim()) return { ok: false, error: "Brak pokoju." };
  const { recordPresenceTrace } = await import("@/lib/randki/presenceTraces");
  const row = await recordPresenceTrace({
    roomAccountId: roomAccountId.trim(),
    fromAccountId: session.accountId,
    reactionId,
    replyToTraceId: opts?.replyToTraceId ?? null,
    momentId: opts?.momentId ?? null,
    targetType: opts?.momentId ? "moment" : "room",
  });
  if (!row) return { ok: false, error: "Nieprawidłowa reakcja." };
  return { ok: true, trace: row.traceLabel };
}

export async function replyToTraceAction(
  roomAccountId: string,
  traceId: string,
  reactionId: string
): Promise<{ ok: true; trace: string } | { ok: false; error: string }> {
  return leavePresenceReactionAction(roomAccountId, reactionId, { replyToTraceId: traceId });
}

export async function leaveMomentResonanceAction(
  roomAccountId: string,
  momentId: string,
  reactionId: string
): Promise<{ ok: true; trace: string } | { ok: false; error: string }> {
  return leavePresenceReactionAction(roomAccountId, reactionId, { momentId });
}

export async function getPresenceDialogAction(
  roomAccountId: string
): Promise<
  | { ok: true; entries: import("@/lib/randki/presenceTraces").PresenceDialogEntry[] }
  | { ok: false; error: string }
> {
  const session = await requireDatingSession();
  if (!session.ok) return session;
  if (!roomAccountId?.trim()) return { ok: false, error: "Brak pokoju." };
  const { listPresenceDialog } = await import("@/lib/randki/presenceTraces");
  const entries = await listPresenceDialog(roomAccountId.trim(), session.accountId);
  return { ok: true, entries };
}

export async function leaveGuestPresenceReactionAction(
  roomAccountId: string,
  reactionId: string
): Promise<{ ok: true; trace: string } | { ok: false; error: string }> {
  const { readGuestSession } = await import("@/lib/randki/guestSession");
  const { recordPresenceTrace } = await import("@/lib/randki/presenceTraces");
  const guest = await readGuestSession();
  if (!guest.guestId || guest.roomId !== roomAccountId.trim()) {
    return { ok: false, error: "Najpierw dołącz do pokoju." };
  }
  const row = await recordPresenceTrace({
    roomAccountId: roomAccountId.trim(),
    fromAccountId: null,
    guestAlias: guest.alias,
    reactionId,
  });
  if (!row) return { ok: false, error: "Nieprawidłowa reakcja." };
  return { ok: true, trace: row.traceLabel };
}

export async function openPrivateSpaceAction(
  matchId: string
): Promise<RandkiActionResult> {
  const session = await requireDatingSession();
  if (!session.ok) return session;
  const { openPrivateSpace } = await import("@/lib/randki/presenceTraces");
  const res = await openPrivateSpace(matchId.trim(), session.accountId);
  if (!res.ok) return res;
  return { ok: true };
}

export async function setDatingMoodAction(mood: string | null): Promise<RandkiActionResult> {
  const session = await requireDatingSession();
  if (!session.ok) return session;
  const allowed = new Set(["chat", "flirt", "date", "calm", ""]);
  if (mood && !allowed.has(mood)) return { ok: false, error: "Nieprawidłowy nastrój." };
  await getPrisma().datingProfile.update({
    where: { accountId: session.accountId },
    data: { mood: mood || null, moodUpdatedAt: new Date() },
  });
  return { ok: true };
}

export async function saveDatingRoomPhasesAction(json: string): Promise<RandkiActionResult> {
  const session = await requireDatingSession();
  if (!session.ok) return session;
  const { parseRoomPhasesJson, sanitizeRoomPhasesInput, serializeRoomPhasesMap } = await import(
    "@/lib/randki/roomPhases"
  );
  const sanitized = sanitizeRoomPhasesInput(parseRoomPhasesJson(json));
  try {
    await getPrisma().datingProfile.update({
      where: { accountId: session.accountId },
      data: { roomPhasesJson: serializeRoomPhasesMap(sanitized) },
    });
    return { ok: true };
  } catch (e) {
    console.error("saveDatingRoomPhasesAction:", e);
    return { ok: false, error: "Nie udało się zapisać pór dnia." };
  }
}

export async function getAiDateSuggestionsAction(matchId: string): Promise<
  { ok: true; suggestions: string[] } | { ok: false; error: string }
> {
  const session = await requireDatingSession();
  if (!session.ok) return session;
  const accountId = session.accountId;
  const prisma = getPrisma();
  const match = await prisma.datingMatch.findUnique({ where: { id: matchId } });
  if (!match || match.status !== "active") return { ok: false, error: "Brak dopasowania." };
  const otherId = match.accountAId === accountId ? match.accountBId : match.accountAId;
  const [my, other] = await Promise.all([
    prisma.datingProfile.findUnique({ where: { accountId } }),
    prisma.datingProfile.findUnique({ where: { accountId: otherId } }),
  ]);
  if (!my || !other) return { ok: false, error: "Brak profilu." };
  const city = my.city || other.city;
  const restaurants = await listRestaurantsForDating(city);
  const suggestions = await generateDateSuggestions(
    { ...my, displayName: my.displayName, city: my.city },
    { ...other, displayName: other.displayName, city: other.city },
    city,
    restaurants.map((r) => ({ name: r.name, orderUrl: r.orderUrl }))
  );
  return { ok: true, suggestions };
}

const MAX_VOICE = 2 * 1024 * 1024;
const ALLOWED_VOICE = new Set([
  "audio/webm",
  "audio/mpeg",
  "audio/mp3",
  "audio/mp4",
  "audio/x-m4a",
  "audio/m4a",
  "audio/aac",
  "audio/ogg",
  "audio/wav",
  "audio/x-wav",
  "audio/x-caf",
  "audio/caf",
  "video/webm",
]);

function voiceExtFromFile(file: File): string | null {
  const type = file.type.toLowerCase();
  const name = file.name.toLowerCase();
  if (type.includes("mpeg") || type === "audio/mp3" || name.endsWith(".mp3")) return "mp3";
  if (type.includes("ogg") || name.endsWith(".ogg")) return "ogg";
  if (
    type.includes("mp4") ||
    type.includes("m4a") ||
    type.includes("aac") ||
    type.includes("caf") ||
    name.endsWith(".m4a") ||
    name.endsWith(".aac") ||
    name.endsWith(".mp4") ||
    name.endsWith(".caf")
  )
    return "m4a";
  if (type.includes("wav") || name.endsWith(".wav")) return "wav";
  if (type.includes("webm") || name.endsWith(".webm")) return "webm";
  if (!type && /\.(webm|mp3|ogg|m4a|aac|wav|mp4)$/.test(name)) {
    const ext = name.split(".").pop();
    return ext === "aac" || ext === "mp4" ? "m4a" : ext ?? null;
  }
  if (type.startsWith("audio/")) return "webm";
  if (type === "video/webm") return "webm";
  return null;
}

function isAllowedVoiceFile(file: File): boolean {
  const type = file.type.toLowerCase();
  if (!type || type === "application/octet-stream") return voiceExtFromFile(file) !== null;
  if (type.startsWith("audio/")) return true;
  if (type === "video/webm") return true;
  return ALLOWED_VOICE.has(type);
}

export async function uploadVoiceIntroAction(formData: FormData): Promise<
  { ok: true; url: string } | { ok: false; error: string }
> {
  const session = await requireDatingSession();
  if (!session.ok) return session;
  const file = formData.get("voice");
  if (!(file instanceof File)) return { ok: false, error: "Wybierz nagranie." };

  const ext = voiceExtFromFile(file);
  if (!ext) return { ok: false, error: "Dozwolone formaty: WebM, MP3, M4A, OGG, WAV." };
  if (!isAllowedVoiceFile(file)) {
    return { ok: false, error: "Nierozpoznany format audio — spróbuj MP3 lub M4A." };
  }
  if (file.size > MAX_VOICE) return { ok: false, error: "Max 2 MB (~45 s nagrania)." };
  if (file.size < 200) return { ok: false, error: "Plik jest za krótki — minimum ~2 sekundy." };

  const fileName = `${session.accountId}-voice.${ext}`;
  const dir = path.join(process.cwd(), "public", UPLOADS_DIR, "voice");

  try {
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, fileName), Buffer.from(await file.arrayBuffer()));
  } catch (e) {
    console.error("[uploadVoiceIntroAction] write failed:", e);
    return { ok: false, error: "Nie udało się zapisać pliku na serwerze — spróbuj ponownie." };
  }

  const url = `/${UPLOADS_DIR}/voice/${fileName}`;
  try {
    await getPrisma().datingProfile.update({
      where: { accountId: session.accountId },
      data: { voiceIntroUrl: url, profileQualityScore: 98 },
    });
  } catch (e) {
    console.error("[uploadVoiceIntroAction] db update failed:", e);
    return { ok: false, error: "Nie udało się zapisać profilu — odśwież stronę i spróbuj ponownie." };
  }
  return { ok: true, url };
}

export async function deleteVoiceIntroAction(): Promise<RandkiActionResult> {
  const session = await requireDatingSession();
  if (!session.ok) return session;
  const prisma = getPrisma();
  const profile = await prisma.datingProfile.findUnique({
    where: { accountId: session.accountId },
    select: { voiceIntroUrl: true },
  });
  if (profile?.voiceIntroUrl) {
    const { deleteDatingPhotoFile } = await import("@/lib/randki/fileCleanup");
    await deleteDatingPhotoFile(profile.voiceIntroUrl);
  }
  await prisma.datingProfile.update({
    where: { accountId: session.accountId },
    data: { voiceIntroUrl: null },
  });
  return { ok: true };
}

export async function addVibeMaterialAction(formData: FormData): Promise<
  { ok: true; material: import("@/lib/randki/vibeMaterialTypes").VibeMaterialRow } | { ok: false; error: string }
> {
  const session = await requireDatingSession();
  if (!session.ok) return session;

  const { parseVibeMaterialSlotType, saveVibeMaterial } = await import("@/lib/randki/vibeMaterial");
  const kind = parseVibeMaterialSlotType(formData.get("kind") ?? formData.get("slotType"));
  if (!kind) return { ok: false, error: "Wybierz typ klimatu." };
  const materialId = formData.get("materialId")?.toString() || null;

  return saveVibeMaterial(session.accountId, kind, {
    url: String(formData.get("url") ?? ""),
    textQuote: String(formData.get("textQuote") ?? ""),
    caption: String(formData.get("caption") ?? ""),
  }, materialId);
}

export async function pickVibeCatalogAction(
  slotType: string,
  catalogId: string,
  caption: string,
  materialId?: string | null
): Promise<
  { ok: true; material: import("@/lib/randki/vibeMaterialTypes").VibeMaterialRow } | { ok: false; error: string }
> {
  const session = await requireDatingSession();
  if (!session.ok) return session;

  const { parseVibeMaterialSlotType, saveVibeMaterialFromCatalog } = await import("@/lib/randki/vibeMaterial");
  const kind = parseVibeMaterialSlotType(slotType);
  if (!kind) return { ok: false, error: "Nieprawidłowy typ klimatu." };

  return saveVibeMaterialFromCatalog(session.accountId, kind, catalogId, caption, materialId ?? null);
}

export type SpotifySearchResult =
  | { ok: true; items: import("@/lib/randki/spotifySearch").SpotifySearchHit[] }
  | { ok: false; error: string };

export async function searchSpotifyCatalogAction(
  query: string,
  searchType: import("@/lib/randki/spotifySearch").SpotifySearchType = "track"
): Promise<SpotifySearchResult> {
  const session = await requireDatingSession();
  if (!session.ok) return session;

  const q = query.trim();
  if (q.length < 2) return { ok: false, error: "Wpisz co najmniej 2 znaki." };
  if (!tryConsume(`randki-spotify-search:${session.accountId}`, 40, 60 * 60 * 1000)) {
    return { ok: false, error: "Zbyt wiele wyszukiwań — spróbuj za chwilę." };
  }

  const { searchSpotifyCatalog } = await import("@/lib/randki/spotifySearch");
  const items = await searchSpotifyCatalog(q, searchType, 10);
  if (items.length === 0) return { ok: false, error: "Brak wyników — spróbuj innej frazy lub wklej link." };
  return { ok: true, items };
}

export async function inspireVibeCaptionAction(
  kind: string,
  seed: string
): Promise<{ ok: true; suggestions: string[] } | { ok: false; error: string }> {
  const session = await requireDatingSession();
  if (!session.ok) return session;

  const { parseVibeMaterialSlotType } = await import("@/lib/randki/vibeMaterial");
  const parsed = parseVibeMaterialSlotType(kind);
  if (!parsed) return { ok: false, error: "Nieprawidłowy typ klimatu." };

  if (!tryConsume(`randki-vibe-inspire:${session.accountId}`, 20, 60 * 60 * 1000)) {
    return { ok: false, error: "Zbyt wiele prób — spróbuj za chwilę." };
  }

  const { generateVibeCaptionSuggestions } = await import("@/lib/randki/ai");
  const suggestions = await generateVibeCaptionSuggestions(parsed, seed);
  return { ok: true, suggestions };
}

export type VibeInspirationBatch = {
  chips: string[];
  examples: string[];
  placeholder: string;
  prompt: string;
  poolSize: number;
};

export async function getVibeInspirationBatchAction(
  kind: string
): Promise<{ ok: true; batch: VibeInspirationBatch } | { ok: false; error: string }> {
  const session = await requireDatingSession();
  if (!session.ok) return session;

  const { parseVibeMaterialSlotType } = await import("@/lib/randki/vibeMaterial");
  const parsed = parseVibeMaterialSlotType(kind);
  if (!parsed) return { ok: false, error: "Nieprawidłowy typ klimatu." };

  const {
    pickRandomThoughts,
    pickRandomPromptFromPool,
    pickRandomPlaceholder,
    getThoughtPoolSize,
  } = await import("@/lib/randki/vibeCaptionThoughts");

  return {
    ok: true,
    batch: {
      chips: pickRandomThoughts(parsed, 12),
      examples: pickRandomThoughts(parsed, 3),
      placeholder: pickRandomPlaceholder(parsed),
      prompt: pickRandomPromptFromPool(parsed),
      poolSize: getThoughtPoolSize(parsed),
    },
  };
}

export async function pickSpotifySearchAction(
  kind: string,
  hit: import("@/lib/randki/spotifySearch").SpotifySearchHit,
  caption: string,
  materialId?: string | null
): Promise<
  { ok: true; material: import("@/lib/randki/vibeMaterialTypes").VibeMaterialRow } | { ok: false; error: string }
> {
  const session = await requireDatingSession();
  if (!session.ok) return session;

  const { parseVibeMaterialSlotType, saveVibeMaterialFromSpotify } = await import("@/lib/randki/vibeMaterial");
  const parsed = parseVibeMaterialSlotType(kind);
  if (!parsed) return { ok: false, error: "Nieprawidłowy typ klimatu." };

  return saveVibeMaterialFromSpotify(session.accountId, parsed, hit, caption, materialId ?? null);
}

export type TmdbSearchResult =
  | { ok: true; items: import("@/lib/randki/tmdbSearch").TmdbSearchHit[] }
  | { ok: false; error: string };

export async function searchTmdbCatalogAction(query: string): Promise<TmdbSearchResult> {
  const session = await requireDatingSession();
  if (!session.ok) return session;

  const q = query.trim();
  if (q.length < 2) return { ok: false, error: "Wpisz co najmniej 2 znaki." };
  if (!tryConsume(`randki-tmdb-search:${session.accountId}`, 30, 60 * 60 * 1000)) {
    return { ok: false, error: "Zbyt wiele wyszukiwań — spróbuj za chwilę." };
  }

  const { searchTmdbMovies } = await import("@/lib/randki/tmdbSearch");
  const items = await searchTmdbMovies(q, 10);
  if (items.length === 0) return { ok: false, error: "Brak wyników — spróbuj innej frazy lub wybierz z propozycji." };
  return { ok: true, items };
}

export async function pickTmdbSearchAction(
  kind: string,
  hit: import("@/lib/randki/tmdbSearch").TmdbSearchHit,
  caption: string,
  materialId?: string | null
): Promise<
  { ok: true; material: import("@/lib/randki/vibeMaterialTypes").VibeMaterialRow } | { ok: false; error: string }
> {
  const session = await requireDatingSession();
  if (!session.ok) return session;

  const { parseVibeMaterialSlotType, saveVibeMaterialFromTmdb } = await import("@/lib/randki/vibeMaterial");
  const parsed = parseVibeMaterialSlotType(kind);
  if (!parsed) return { ok: false, error: "Nieprawidłowy typ klimatu." };

  return saveVibeMaterialFromTmdb(session.accountId, parsed, hit, caption, materialId ?? null);
}

export type YoutubeSearchResult =
  | { ok: true; items: import("@/lib/randki/youtubeSearch").YoutubeSearchHit[] }
  | { ok: false; error: string };

export async function searchYoutubeCatalogAction(query: string): Promise<YoutubeSearchResult> {
  const session = await requireDatingSession();
  if (!session.ok) return session;

  const q = query.trim();
  if (q.length < 2) return { ok: false, error: "Wpisz co najmniej 2 znaki." };
  if (!tryConsume(`randki-youtube-search:${session.accountId}`, 20, 60 * 60 * 1000)) {
    return { ok: false, error: "Zbyt wiele wyszukiwań — spróbuj za chwilę." };
  }

  const { searchYoutubeVideos } = await import("@/lib/randki/youtubeSearch");
  const items = await searchYoutubeVideos(q, 10);
  if (items.length === 0) {
    return { ok: false, error: "Brak wyników — spróbuj innej frazy, wklej link albo wybierz z propozycji." };
  }
  return { ok: true, items };
}

export async function pickYoutubeSearchAction(
  kind: string,
  hit: import("@/lib/randki/youtubeSearch").YoutubeSearchHit,
  caption: string,
  materialId?: string | null
): Promise<
  { ok: true; material: import("@/lib/randki/vibeMaterialTypes").VibeMaterialRow } | { ok: false; error: string }
> {
  const session = await requireDatingSession();
  if (!session.ok) return session;

  const { parseVibeMaterialSlotType, saveVibeMaterialFromYoutube } = await import("@/lib/randki/vibeMaterial");
  const parsed = parseVibeMaterialSlotType(kind);
  if (!parsed) return { ok: false, error: "Nieprawidłowy typ klimatu." };

  return saveVibeMaterialFromYoutube(session.accountId, parsed, hit, caption, materialId ?? null);
}

export async function updateVibeMaterialCaptionAction(id: string, caption: string): Promise<RandkiActionResult> {
  const session = await requireDatingSession();
  if (!session.ok) return session;

  const trimmed = caption.trim();
  if (trimmed.length < 8) return { ok: false, error: "Opis musi mieć min. 8 znaków." };
  if (trimmed.length > 320) return { ok: false, error: "Opis może mieć maks. 320 znaków." };

  const prisma = getPrisma();
  const row = await prisma.datingVibeMaterial.findFirst({ where: { id, accountId: session.accountId } });
  if (!row) return { ok: false, error: "Nie znaleziono materiału." };

  await prisma.datingVibeMaterial.update({
    where: { id },
    data: { caption: trimmed },
  });
  return { ok: true };
}

export async function deleteVibeMaterialAction(id: string): Promise<RandkiActionResult> {
  const session = await requireDatingSession();
  if (!session.ok) return session;

  const prisma = getPrisma();
  const row = await prisma.datingVibeMaterial.findFirst({ where: { id, accountId: session.accountId } });
  if (!row) return { ok: false, error: "Nie znaleziono materiału." };

  await prisma.datingVibeMaterial.delete({ where: { id } });
  const rest = await prisma.datingVibeMaterial.findMany({
    where: { accountId: session.accountId },
    orderBy: { sortOrder: "asc" },
  });
  await Promise.all(rest.map((item, idx) => prisma.datingVibeMaterial.update({ where: { id: item.id }, data: { sortOrder: idx } })));
  return { ok: true };
}

export async function setDatingActivityIntentAction(intent: string | null): Promise<RandkiActionResult> {
  const session = await requireDatingSession();
  if (!session.ok) return session;
  const allowed = new Set(["coffee", "walk", "food", "culture", "sport", "cowork", ""]);
  if (intent && !allowed.has(intent)) return { ok: false, error: "Nieprawidłowa aktywność." };
  await getPrisma().datingProfile.update({
    where: { accountId: session.accountId },
    data: { activityIntent: intent || null },
  });
  return { ok: true };
}

export async function setDatingCircleAction(slug: string | null): Promise<RandkiActionResult> {
  const session = await requireDatingSession();
  if (!session.ok) return session;
  const { RANDKI_CIRCLES } = await import("@/lib/randki/circles");
  const { isPremiumActive } = await import("@/lib/randki/premium");
  if (slug) {
    const circle = RANDKI_CIRCLES.find((c) => c.slug === slug);
    if (!circle) return { ok: false, error: "Nie znaleziono kręgu." };
    if (circle.premium && !(await isPremiumActive(session.accountId))) {
      return { ok: false, error: "Ten krąg wymaga Randki Odart Premium." };
    }
  }
  await getPrisma().datingProfile.update({
    where: { accountId: session.accountId },
    data: { circleSlug: slug || null },
  });
  return { ok: true };
}

export async function uploadDailyMomentAction(formData: FormData): Promise<
  { ok: true; url: string; secondaryUrl?: string | null; capturedAt: string; faceVerified?: boolean } | { ok: false; error: string }
> {
  const session = await requireDatingSession();
  if (!session.ok) return session;
  const { hasPostedMomentToday } = await import("@/lib/randki/dailyMoment");
  if (await hasPostedMomentToday(session.accountId)) {
    return { ok: false, error: "Dziś już dodałeś/aś moment. Wróć jutro — autentyczność, nie spam." };
  }
  const file = formData.get("moment");
  const secondary = formData.get("momentSelfie");
  if (!(file instanceof File)) return { ok: false, error: "Zrób zdjęcie aparatem (widok na świat)." };
  if (!(secondary instanceof File) || secondary.size === 0) {
    return { ok: false, error: "Selfie (przedni aparat) jest wymagane — weryfikacja twarzy." };
  }
  if (!tryConsume("randki-moment:" + session.accountId, 5, 24 * 60 * 60 * 1000)) {
    return { ok: false, error: "Limit uploadów momentu na dziś." };
  }

  const worldPrep = await prepareDatingImageFile(file);
  if ("error" in worldPrep) return { ok: false, error: worldPrep.error };
  const selfiePrep = await prepareDatingImageFile(secondary);
  if ("error" in selfiePrep) return { ok: false, error: selfiePrep.error };

  function parseClientCapture(raw: FormDataEntryValue | null): Date | null {
    if (typeof raw !== "string" || !raw.trim()) return null;
    const d = new Date(raw);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  async function resolveMomentCaptureTime(
    prep: { raw: Buffer; sourceMime: string },
    clientIso: FormDataEntryValue | null,
    clientModifiedIso: FormDataEntryValue | null
  ): Promise<Date | null> {
    const fromBuffer = await verifyDatingImageBuffer(prep.raw, prep.sourceMime, "moment");
    if (fromBuffer.ok && fromBuffer.capturedAt) return fromBuffer.capturedAt;

    const clientAt = parseClientCapture(clientIso);
    if (clientAt) {
      const check = verifyMomentCaptureTime(clientAt);
      if (check.ok && check.capturedAt) return check.capturedAt;
    }

    const modAt = parseClientCapture(clientModifiedIso);
    if (modAt) {
      const check = verifyMomentCaptureTime(modAt);
      if (check.ok && check.capturedAt) return check.capturedAt;
    }

    return null;
  }

  const worldAt = await resolveMomentCaptureTime(
    worldPrep,
    formData.get("momentCapturedAt"),
    formData.get("momentFileModified")
  );
  const selfieAt = await resolveMomentCaptureTime(
    selfiePrep,
    formData.get("selfieCapturedAt"),
    formData.get("selfieFileModified")
  );

  if (!worldAt || !selfieAt) {
    return {
      ok: false,
      error:
        "Nie udało się potwierdzić świeżości zdjęć. Zrób oba ujęcia teraz aparatem w aplikacji (nie z galerii). Na iPhone: Ustawienia → Prywatność → Zdjęcia → Safari → zezwól na dostęp.",
    };
  }

  const pairCheck = verifyMomentPairCaptureTimes(worldAt, selfieAt);
  if (!pairCheck.ok) return { ok: false, error: pairCheck.error };
  const worldExif = pairCheck;

  const { verifyDailyMomentFaces } = await import("@/lib/randki/faceVerify");
  const faceCheck = await verifyDailyMomentFaces(selfiePrep.buffer, selfiePrep.mime);
  if (!faceCheck.ok) return { ok: false, error: faceCheck.error };

  const ts = Date.now();
  const saved = await saveDatingImageFile(session.accountId, file, `-moment-${ts}`);
  if ("error" in saved) return { ok: false, error: saved.error };

  const saved2 = await saveDatingImageFile(session.accountId, secondary, `-moment-selfie-${ts}`);
  if ("error" in saved2) return { ok: false, error: saved2.error };
  const secondaryUrl = saved2.url;

  const caption = String(formData.get("caption") ?? "").slice(0, 120);
  const capturedAt = worldExif.capturedAt ?? new Date();
  await getPrisma().datingDailyMoment.create({
    data: {
      accountId: session.accountId,
      url: saved.url,
      secondaryUrl,
      caption,
      capturedAt,
      faceVerified: true,
      faceScore: faceCheck.faceScore,
      momentType: "photo",
    },
  });
  await getPrisma().datingProfile.update({
    where: { accountId: session.accountId },
    data: { profileQualityScore: 99 },
  });
  return {
    ok: true,
    url: saved.url,
    secondaryUrl,
    capturedAt: capturedAt.toISOString(),
    faceVerified: true,
  };
}

const MAX_AUDIO_MOMENT = 2 * 1024 * 1024;
const AUDIO_MOMENT_PLACEHOLDER = "/randki/moment-audio.svg";

async function saveDatingAudioFile(
  accountId: string,
  file: File,
  kind: "moment" | "chat-voice" = "moment"
): Promise<{ url: string } | { error: string }> {
  const maxSize = kind === "chat-voice" ? MAX_CHAT_VOICE : MAX_AUDIO_MOMENT;
  if (file.size > maxSize) {
    return { error: kind === "chat-voice" ? "Notka może mieć maks. ~20 s." : "Audio może mieć maks. 2 MB (~10 s)." };
  }
  const mime = file.type || "audio/webm";
  const allowed = ["audio/webm", "audio/ogg", "audio/mpeg", "audio/mp4", "audio/wav", "audio/x-m4a"];
  if (!allowed.some((a) => mime.startsWith(a.split("/")[0]) || allowed.includes(mime))) {
    if (!mime.startsWith("audio/")) return { error: "Dozwolone formaty: webm, mp3, m4a, ogg." };
  }
  const ext = mime.includes("mpeg") || mime.includes("mp3") ? "mp3" : mime.includes("mp4") || mime.includes("m4a") ? "m4a" : mime.includes("ogg") ? "ogg" : "webm";
  const fileName =
    kind === "chat-voice"
      ? `${accountId}-chat-voice-${Date.now()}.${ext}`
      : `${accountId}-moment-audio-${Date.now()}.${ext}`;
  const dir = path.join(process.cwd(), "public", UPLOADS_DIR);
  await mkdir(dir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, fileName), buffer);
  return { url: `/${UPLOADS_DIR}/${fileName}` };
}

export async function uploadDailyMomentAudioAction(formData: FormData): Promise<
  { ok: true; audioUrl: string; capturedAt: string } | { ok: false; error: string }
> {
  const session = await requireDatingSession();
  if (!session.ok) return session;
  const { hasPostedMomentToday } = await import("@/lib/randki/dailyMoment");
  if (await hasPostedMomentToday(session.accountId)) {
    return { ok: false, error: "Dziś już dodałeś/aś moment. Wróć jutro." };
  }
  const file = formData.get("momentAudio");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Nagraj krótki fragment dźwięku (do ~10 s)." };
  }
  if (!tryConsume("randki-moment-audio:" + session.accountId, 3, 24 * 60 * 60 * 1000)) {
    return { ok: false, error: "Limit audio na dziś." };
  }
  const saved = await saveDatingAudioFile(session.accountId, file);
  if ("error" in saved) return { ok: false, error: saved.error };
  const caption = String(formData.get("caption") ?? "").slice(0, 120);
  const capturedAt = new Date();
  await getPrisma().datingDailyMoment.create({
    data: {
      accountId: session.accountId,
      url: AUDIO_MOMENT_PLACEHOLDER,
      audioUrl: saved.url,
      caption,
      capturedAt,
      faceVerified: false,
      momentType: "audio",
    },
  });
  return { ok: true, audioUrl: saved.url, capturedAt: capturedAt.toISOString() };
}

const MAX_VOICE_FRAGMENT = 512 * 1024;

export async function uploadVoiceFragmentMomentAction(formData: FormData): Promise<
  { ok: true; audioUrl: string; capturedAt: string } | { ok: false; error: string }
> {
  const session = await requireDatingSession();
  if (!session.ok) return session;
  const { hasPostedMomentToday } = await import("@/lib/randki/dailyMoment");
  if (await hasPostedMomentToday(session.accountId)) {
    return { ok: false, error: "Dziś już dodałeś/aś moment. Wróć jutro." };
  }
  const file = formData.get("voiceFragment");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Nagraj krótki fragment głosu (do ~15 s)." };
  }
  if (file.size > MAX_VOICE_FRAGMENT) {
    return { ok: false, error: "Fragment głosu może mieć maks. ~15 s." };
  }
  if (!tryConsume("randki-voice-fragment:" + session.accountId, 3, 24 * 60 * 60 * 1000)) {
    return { ok: false, error: "Limit voice fragment na dziś." };
  }
  const saved = await saveDatingAudioFile(session.accountId, file);
  if ("error" in saved) return { ok: false, error: saved.error };
  const caption = String(formData.get("caption") ?? "").slice(0, 120);
  const capturedAt = new Date();
  await getPrisma().datingDailyMoment.create({
    data: {
      accountId: session.accountId,
      url: AUDIO_MOMENT_PLACEHOLDER,
      audioUrl: saved.url,
      caption,
      capturedAt,
      faceVerified: false,
      momentType: "voice",
    },
  });
  return { ok: true, audioUrl: saved.url, capturedAt: capturedAt.toISOString() };
}

export async function joinVoiceMatchAction(): Promise<
  { ok: true; state: Awaited<ReturnType<typeof import("@/lib/randki/voiceMatch").getVoiceMatchState>> } | { ok: false; error: string }
> {
  const session = await requireDatingSession();
  if (!session.ok) return session;
  try {
    const { joinVoiceMatchQueue } = await import("@/lib/randki/voiceMatch");
    const host = await getRequestHost();
    const state = await joinVoiceMatchQueue(session.accountId, host);
    return { ok: true, state };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Voice match niedostępny." };
  }
}

export async function pollVoiceMatchAction(): Promise<
  { ok: true; state: Awaited<ReturnType<typeof import("@/lib/randki/voiceMatch").getVoiceMatchState>> } | { ok: false; error: string }
> {
  const session = await requireDatingSession();
  if (!session.ok) return session;
  const { getVoiceMatchState } = await import("@/lib/randki/voiceMatch");
  return { ok: true, state: await getVoiceMatchState(session.accountId) };
}

export async function leaveVoiceMatchAction(): Promise<RandkiActionResult> {
  const session = await requireDatingSession();
  if (!session.ok) return session;
  const { leaveVoiceMatchQueue } = await import("@/lib/randki/voiceMatch");
  await leaveVoiceMatchQueue(session.accountId);
  return { ok: true };
}

export async function skipVoiceMatchAction(): Promise<
  { ok: true; state: Awaited<ReturnType<typeof import("@/lib/randki/voiceMatch").getVoiceMatchState>> } | { ok: false; error: string }
> {
  const session = await requireDatingSession();
  if (!session.ok) return session;
  try {
    const { skipVoiceMatchPartner } = await import("@/lib/randki/voiceMatch");
    const host = await getRequestHost();
    const state = await skipVoiceMatchPartner(session.accountId, host);
    return { ok: true, state };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Błąd voice match." };
  }
}

export async function createPremiumCheckoutAction(): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  const session = await requireDatingSession();
  if (!session.ok) return session;
  const { isStripeConfigured, createPremiumCheckoutSession } = await import("@/lib/randki/stripe");
  if (!isStripeConfigured()) return { ok: false, error: "Płatności Stripe wkrótce — użyj Premium demo na koncie testowym." };
  const account = await getPrisma().datingAccount.findUnique({ where: { id: session.accountId } });
  if (!account) return { ok: false, error: "Brak konta." };
  const host = await getRequestHost();
  try {
    const url = await createPremiumCheckoutSession(session.accountId, account.email, host);
    return { ok: true, url };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Nie udało się otworzyć płatności." };
  }
}

export async function activatePremiumDemoAction(): Promise<RandkiActionResult> {
  const session = await requireDatingSession();
  if (!session.ok) return session;
  const account = await getPrisma().datingAccount.findUnique({ where: { id: session.accountId } });
  if (!account?.email.endsWith("@randka.odart.pl")) {
    return { ok: false, error: "Premium demo dostępne tylko na kontach testowych." };
  }
  const until = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  await getPrisma().datingAccount.update({
    where: { id: session.accountId },
    data: { isPremium: true, premiumUntil: until },
  });
  return { ok: true };
}
