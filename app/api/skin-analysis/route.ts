import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { type SkinProfile, VALID_TYP_SKORY } from "@/lib/skinLogic";

const SYSTEM_PROMPT = `Jesteś asystentem kosmetologicznym. Nie stawiasz diagnozy medycznej. Nie zalecasz leków. Dajesz ogólne sugestie pielęgnacyjne i kierunki zabiegowe.
Masz użyć tylko listy zabiegów przekazanej w polu treatments – nie wymyślaj innych.
Odpowiedz wyłącznie poprawnym JSON, bez markdown i bez tekstu przed/po.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { profile, treatments } = body as {
      profile?: SkinProfile;
      treatments?: string[];
    };

    if (!profile || !Array.isArray(treatments)) {
      return NextResponse.json(
        { error: "Brak wymaganych pól: profile, treatments" },
        { status: 400 }
      );
    }

    const typ = profile.typ_skory;
    if (!typ || !VALID_TYP_SKORY.includes(typ)) {
      return NextResponse.json(
        { error: "Nieprawidłowy profile.typ_skory (dozwolone: sucha, normalna, tlusta)" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Brak konfiguracji OPENAI_API_KEY" },
        { status: 500 }
      );
    }

    const openai = new OpenAI({ apiKey });

    const userPrompt = `Na podstawie poniższego profilu skóry i listy zabiegów wygeneruj wynik analizy.

Profil (JSON):
${JSON.stringify(profile, null, 2)}

Lista zabiegów do użycia (tylko te możesz polecać):
${treatments.join("\n")}

Zwróć JSON z dokładnie tymi polami (bez innych):
- summary: string (2-3 zdania, Twój profil skóry – krótki opis)
- treatmentsText: string (tekst z listą punktową zabiegów, w formacie "• zabieg1\\n• zabieg2")
- homeCare: string (tekst z listą punktową ogólnych wskazówek pielęgnacji domowej)
- disclaimer: string (1 zdanie: że to nie zastępuje konsultacji u kosmetyczki/lekarza)`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: "Pusta odpowiedź z OpenAI" },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(content) as {
      summary?: string;
      treatmentsText?: string;
      homeCare?: string;
      disclaimer?: string;
    };

    return NextResponse.json({
      summary: parsed.summary ?? "",
      treatmentsText: parsed.treatmentsText ?? "",
      homeCare: parsed.homeCare ?? "",
      disclaimer: parsed.disclaimer ?? "",
    });
  } catch (err) {
    if (err instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Nieprawidłowy JSON w odpowiedzi" },
        { status: 500 }
      );
    }
    console.error("skin-analysis API error:", err);
    return NextResponse.json(
      { error: "Błąd podczas generowania wyniku" },
      { status: 500 }
    );
  }
}
