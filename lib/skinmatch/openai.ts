import OpenAI from "openai";

const PROMPT = `Na podstawie poniższego opisu wytłumacz użytkownikowi czego potrzebuje jego skóra prostym językiem.
Nie podawaj nazw konkretnych zabiegów ani marek.
Nie zmieniaj kierunku terapii.
Nie diagnozuj chorób.
Odpowiedz krótko (2-4 zdania), po polsku.`;

/**
 * Generuje opis dla użytkownika na podstawie explanation_context.
 * AI tylko opisuje — nie wybiera zabiegów ani gabinetów.
 */
export async function generateHumanDescription(
  explanation_context: string,
  apiKey: string
): Promise<string> {
  const openai = new OpenAI({ apiKey });
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: PROMPT },
      { role: "user", content: explanation_context },
    ],
  });
  const text = completion.choices[0]?.message?.content?.trim();
  return text ?? explanation_context;
}
