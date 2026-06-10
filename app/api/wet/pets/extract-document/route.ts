import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { VET_CLINIC_ROLE, VET_OWNER_ROLE } from "@/lib/auth";
import { extractPetDocumentFromImage } from "@/lib/vet/petDocumentExtract";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role;
  if (role !== VET_CLINIC_ROLE && role !== VET_OWNER_ROLE) {
    return NextResponse.json({ error: "Brak uprawnień." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("image");
  const hint = formData.get("hint")?.toString()?.trim() || undefined;

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Dołącz zdjęcie dokumentu." }, { status: 400 });
  }

  if (!process.env.OPENAI_API_KEY?.trim()) {
    return NextResponse.json(
      { error: "Skan dokumentów wymaga OPENAI_API_KEY na serwerze." },
      { status: 503 }
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");
    const fields = await extractPetDocumentFromImage(base64, hint);
    if (!fields) {
      return NextResponse.json(
        { error: "Nie udało się odczytać dokumentu. Spróbuj lepszego zdjęcia." },
        { status: 422 }
      );
    }
    return NextResponse.json({ fields });
  } catch {
    return NextResponse.json({ error: "Błąd przetwarzania pliku." }, { status: 500 });
  }
}
