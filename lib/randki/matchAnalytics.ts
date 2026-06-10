import { getPrisma } from "@/lib/db";

/** Wewnętrzna telemetria rozmowy — nigdy nie eksponować w UI (guardrail: noReadReceipts). */
export type MatchConversationMetrics = {
  score: number;
  label: string;
  summary: string;
  signals: string[];
};

function avg(nums: number[]): number {
  if (!nums.length) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

/** Analityka flow rozmowy — retention, anti-spam, jakość dopasowania. Nie „ocena chemii”. */
export async function analyzeMatchConversation(matchId: string): Promise<MatchConversationMetrics> {
  const messages = await getPrisma().datingMessage.findMany({
    where: { matchId },
    orderBy: { createdAt: "asc" },
    select: { senderAccountId: true, body: true, createdAt: true },
  });

  if (messages.length < 2) {
    return {
      score: 0,
      label: "za_wczesnie",
      summary: "Za mało wiadomości do metryk wewnętrznych.",
      signals: [],
    };
  }

  const bySender = new Map<string, typeof messages>();
  for (const m of messages) {
    const arr = bySender.get(m.senderAccountId) ?? [];
    arr.push(m);
    bySender.set(m.senderAccountId, arr);
  }
  const senders = Array.from(bySender.keys());
  if (senders.length < 2) {
    return {
      score: 25,
      label: "jednostronna",
      summary: "Rozmowa jednostronna — metryka wewnętrzna.",
      signals: ["Jedna strona dominuje w wolumenie"],
    };
  }

  const signals: string[] = [];
  let score = 50;

  const lengths = messages.map((m) => m.body.length);
  const avgLen = avg(lengths);
  if (avgLen >= 40 && avgLen <= 280) {
    score += 10;
    signals.push("Podobna głębokość wiadomości");
  }

  const counts = senders.map((s) => bySender.get(s)!.length);
  const ratio = Math.min(...counts) / Math.max(...counts);
  if (ratio >= 0.45) {
    score += 15;
    signals.push("Obie strony angażują się");
  } else if (ratio < 0.2) {
    score -= 15;
    signals.push("Nierównowaga wolumenu");
  }

  const gaps: number[] = [];
  for (let i = 1; i < messages.length; i++) {
    gaps.push((messages[i].createdAt.getTime() - messages[i - 1].createdAt.getTime()) / 3600000);
  }
  const avgGap = avg(gaps);
  if (avgGap <= 4) {
    score += 10;
    signals.push("Krótkie odstępy między wiadomościami");
  } else if (avgGap > 48) {
    score -= 10;
    signals.push("Długie przerwy");
  }

  const questions = messages.filter((m) => m.body.includes("?")).length;
  if (questions >= 2) {
    score += 8;
    signals.push("Pytania w rozmowie");
  }

  score = Math.max(0, Math.min(100, score));

  let label = "rosnie";
  if (score >= 75) label = "wysoka_aktywnosc";
  else if (score >= 55) label = "obiecujaca";
  else if (score < 35) label = "niska_aktywnosc";

  return {
    score,
    label,
    summary: "Metryka wewnętrzna — nie wyświetlać użytkownikom.",
    signals,
  };
}

/** Zapis metryk do kolumn DB — tylko analytics-side (chemistryScore/Label to legacy schema). */
export async function persistMatchConversationAnalytics(matchId: string): Promise<MatchConversationMetrics> {
  const analysis = await analyzeMatchConversation(matchId);
  await getPrisma().datingMatch.update({
    where: { id: matchId },
    data: { chemistryScore: analysis.score, chemistryLabel: analysis.label },
  });
  return analysis;
}
