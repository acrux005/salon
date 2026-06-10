// app/api/analyze/route.ts
import { NextResponse } from "next/server";
import type { QuizTag } from "@/lib/skinmatch";
import { findMatchingClinicsAsync } from "@/lib/skinmatch/clinics";
import { legacyToQuizTags, sortTags } from "@/lib/skinmatch/legacyQuiz";

type AnalyzeRequest = {
  tags?: unknown;
  city?: string;
  optionalDescription?: string;
  /** Fallback: stary format (mapowany przez legacyToQuizTags) */
  dryness?: boolean | number | "dry" | "normal" | "oily";
  issues?: string[];
  reactive?: boolean | number;
};

type AnalyzeResponse = {
  tags: QuizTag[];
  human_readable_description: string;
  clinics: { slug: string; name: string; city: string; matchScore: number }[];
};

function hasLegacyFields(b: Partial<AnalyzeRequest>): boolean {
  return (
    b.dryness !== undefined ||
    b.reactive !== undefined ||
    (Array.isArray(b.issues) && b.issues.length > 0)
  );
}

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<AnalyzeRequest>;

  let tags: QuizTag[];
  const rawTags = Array.isArray(body.tags) ? body.tags : [];
  const fromTags = sortTags(rawTags);

  if (fromTags.length > 0) {
    tags = fromTags;
  } else if (hasLegacyFields(body)) {
    tags = legacyToQuizTags({
      dryness: body.dryness,
      reactive: body.reactive,
      issues: body.issues,
    });
  } else {
    return NextResponse.json(
      { error: "No valid tags provided" },
      { status: 400 }
    );
  }

  const city = body.city;

  const human_readable_description =
    body.optionalDescription?.trim() ||
    "Na podstawie odpowiedzi w quizie dopasowaliśmy kierunki terapii i gabinety.";

  const clinics = (await findMatchingClinicsAsync(tags, city)).map((c) => ({
    slug: c.slug,
    name: c.name,
    city: c.city,
    matchScore: c.matchScore,
  }));

  return NextResponse.json({
    tags,
    human_readable_description,
    clinics,
  } satisfies AnalyzeResponse);
}
