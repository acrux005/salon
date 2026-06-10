import { NextRequest, NextResponse } from "next/server";
import { findMatchingClinicsAsync } from "@/lib/skinmatch/clinics";
import { sortTags } from "@/lib/skinmatch/legacyQuiz";

function parseBody(body: unknown): { tags: string[]; city?: string } {
  if (!body || typeof body !== "object") {
    return { tags: [] };
  }
  const b = body as Record<string, unknown>;
  const tagsRaw = Array.isArray(b.tags) ? b.tags : [];
  const tags = tagsRaw.filter((t: unknown) => typeof t === "string") as string[];
  const city = typeof b.city === "string" ? b.city.trim() || undefined : undefined;
  return { tags, city };
}

/**
 * POST /api/clinics/match
 * Wejście: { tags: QuizTag[], city?: string }
 * Wyjście: { clinics: { slug, name, city, matchScore }[] }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { tags: rawTags, city } = parseBody(body);
    const tags = sortTags(rawTags);

    if (tags.length === 0) {
      return NextResponse.json(
        { error: "No valid tags provided" },
        { status: 400 }
      );
    }

    const clinics = (await findMatchingClinicsAsync(tags, city)).map((c) => ({
      slug: c.slug,
      name: c.name,
      city: c.city,
      matchScore: c.matchScore,
    }));

    return NextResponse.json({ clinics });
  } catch (err) {
    console.error("clinics/match error:", err);
    return NextResponse.json(
      { error: "Błąd dopasowania gabinetów" },
      { status: 500 }
    );
  }
}
