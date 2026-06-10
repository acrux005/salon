import { readFile } from "fs/promises";
import path from "path";
import OpenAI from "openai";

function getOpenAI(): OpenAI | null {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) return null;
  return new OpenAI({ apiKey: key });
}

function toDataUrl(buffer: Buffer, mime: string): string {
  return `data:${mime};base64,${buffer.toString("base64")}`;
}

type FaceCheckJson = {
  hasClearFace?: boolean;
  isRealPhoto?: boolean;
  isScreenOrAi?: boolean;
  samePerson?: boolean;
  confidence?: number;
  reason?: string;
};

function parseJson(content: string | null | undefined): FaceCheckJson {
  if (!content) return {};
  try {
    return JSON.parse(content) as FaceCheckJson;
  } catch {
    return {};
  }
}

/** Selfie musi pokazywać prawdziwą twarz (nie screenshot / AI). */
export async function verifySelfieHasRealFace(
  buffer: Buffer,
  mime: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const openai = getOpenAI();
  if (!openai) return { ok: true };

  try {
    const resp = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 100,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text:
                'Selfie do daily moment w aplikacji randkowej. Odpowiedz JSON: {"hasClearFace":bool,"isRealPhoto":bool,"isScreenOrAi":bool,"reason":"krótko po polsku"}. hasClearFace=true tylko gdy widać jedną prawdziwą twarz człowieka. Odrzuć screenshoty, memy, stock, AI.',
            },
            { type: "image_url", image_url: { url: toDataUrl(buffer, mime), detail: "low" } },
          ],
        },
      ],
    });
    const parsed = parseJson(resp.choices[0]?.message?.content);
    if (!parsed.hasClearFace) {
      return { ok: false, error: parsed.reason ?? "Selfie musi wyraźnie pokazywać Twoją twarz." };
    }
    if (parsed.isScreenOrAi || parsed.isRealPhoto === false) {
      return { ok: false, error: parsed.reason ?? "Zdjęcie wygląda na screenshot lub AI — zrób live selfie." };
    }
    return { ok: true };
  } catch (e) {
    console.error("[verifySelfieHasRealFace]", e);
    return { ok: true };
  }
}

/** Selfie vs główne zdjęcie profilowe — anty-catfish. */
export async function verifySelfieMatchesProfile(
  selfieBuffer: Buffer,
  profilePhotoUrl: string,
  mime: string
): Promise<{ ok: true; score: number } | { ok: false; error: string }> {
  const openai = getOpenAI();
  if (!openai) return { ok: true, score: 0.5 };

  const rel = profilePhotoUrl.startsWith("/") ? profilePhotoUrl.slice(1) : profilePhotoUrl;
  const filePath = path.join(process.cwd(), "public", rel);
  let profileBuffer: Buffer;
  try {
    profileBuffer = await readFile(filePath);
  } catch {
    return { ok: true, score: 0.5 };
  }

  const profileMime = rel.endsWith(".png") ? "image/png" : rel.endsWith(".webp") ? "image/webp" : "image/jpeg";

  try {
    const resp = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 100,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text:
                'ZDJĘCIE A = selfie z daily moment. ZDJĘCIE B = zdjęcie profilowe. Czy to ta sama osoba? Mogą różnić się kadr, światło, makijaż, fryzura, aura artystyczna. JSON: {"samePerson":bool,"confidence":0-1,"reason":"po polsku — nie pisz „pierwsze/drugie zdjęcie”, używaj „selfie” i „profil”"}. samePerson=true tylko gdy wyraźnie ta sama osoba; przy wątpliwości false.',
            },
            { type: "image_url", image_url: { url: toDataUrl(selfieBuffer, mime), detail: "auto" } },
            { type: "image_url", image_url: { url: toDataUrl(profileBuffer, profileMime), detail: "auto" } },
          ],
        },
      ],
    });
    const parsed = parseJson(resp.choices[0]?.message?.content);
    const score = typeof parsed.confidence === "number" ? parsed.confidence : 0;
    if (!parsed.samePerson || score < 0.38) {
      return {
        ok: false,
        error:
          parsed.reason ??
          "Selfie nie przypomina zdjęcia profilowego. Ustaw w profilu wyraźne zdjęcie twarzy (nie tylko kadr z aury), potem spróbuj ponownie.",
      };
    }
    return { ok: true, score };
  } catch (e) {
    console.error("[verifySelfieMatchesProfile]", e);
    return { ok: true, score: 0.5 };
  }
}

/**
 * Daily moment: otoczenie (tył aparatu) i selfie (przód) to celowo różne kadry — nie porównujemy ich.
 * Selfie: tylko prawdziwa twarz użytkownika. Porównanie selfie↔profil wyłączone (aura / stare foto / fałszywe odrzuty).
 * Opcjonalnie włącz: RANDKI_MOMENT_PROFILE_FACE_MATCH=1
 */
export async function verifyDailyMomentFaces(
  selfieBuffer: Buffer,
  mime: string,
  profilePhotoUrl?: string | null
): Promise<{ ok: true; faceScore: number } | { ok: false; error: string }> {
  const selfieCheck = await verifySelfieHasRealFace(selfieBuffer, mime);
  if (!selfieCheck.ok) return selfieCheck;

  const strictProfile =
    process.env.RANDKI_MOMENT_PROFILE_FACE_MATCH === "1" ||
    process.env.RANDKI_MOMENT_PROFILE_FACE_MATCH === "true";

  if (strictProfile && profilePhotoUrl) {
    const profileCheck = await verifySelfieMatchesProfile(selfieBuffer, profilePhotoUrl, mime);
    if (!profileCheck.ok) {
      return {
        ok: false,
        error:
          profileCheck.error ??
          "Selfie nie pasuje do zdjęcia profilowego. Ustaw w profilu aktualne zdjęcie twarzy i spróbuj ponownie.",
      };
    }
    return { ok: true, faceScore: profileCheck.score };
  }

  return { ok: true, faceScore: 0.85 };
}
