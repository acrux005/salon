import { getPrisma } from "@/lib/db";
import { assertMatchParticipant } from "@/lib/randki/matching";

export type DatingDateSlot = { date: string; time: string; label: string };

export function generateDatingDateSlots(days = 14): DatingDateSlot[] {
  const slots: DatingDateSlot[] = [];
  const now = new Date();
  for (let d = 0; d < days; d++) {
    const day = new Date(now);
    day.setDate(day.getDate() + d);
    const dateStr = day.toISOString().slice(0, 10);
    for (let h = 10; h <= 20; h++) {
      const time = `${String(h).padStart(2, "0")}:00`;
      if (d === 0) {
        const slotDate = new Date(`${dateStr}T${time}:00`);
        if (slotDate <= now) continue;
      }
      slots.push({
        date: dateStr,
        time,
        label: `${dateStr} ${time}`,
      });
    }
  }
  return slots;
}

export async function listDateProposals(matchId: string, accountId: string) {
  const ok = await assertMatchParticipant(matchId, accountId);
  if (!ok) return null;
  return getPrisma().datingDateProposal.findMany({
    where: { matchId },
    orderBy: { createdAt: "desc" },
  });
}

export async function createDateProposal(
  matchId: string,
  proposerAccountId: string,
  data: { proposedDate: string; proposedTime: string; place?: string; note?: string }
) {
  const ok = await assertMatchParticipant(matchId, proposerAccountId);
  if (!ok) return { ok: false as const, error: "Brak dostępu." };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.proposedDate)) return { ok: false as const, error: "Nieprawidłowa data." };
  if (!/^\d{2}:\d{2}$/.test(data.proposedTime)) return { ok: false as const, error: "Nieprawidłowa godzina." };

  const proposal = await getPrisma().datingDateProposal.create({
    data: {
      matchId,
      proposerAccountId,
      proposedDate: data.proposedDate,
      proposedTime: data.proposedTime,
      place: data.place?.trim() || null,
      note: data.note?.trim() || null,
      status: "pending",
    },
  });

  const match = await getPrisma().datingMatch.findUnique({ where: { id: matchId } });
  if (match) {
    const placePart = data.place?.trim() ? ` · ${data.place.trim()}` : "";
    const notePart = data.note?.trim() ? `\n${data.note.trim()}` : "";
    await getPrisma().datingMessage.create({
      data: {
        matchId,
        senderAccountId: proposerAccountId,
        body: `📅 Propozycja randki: ${data.proposedDate} o ${data.proposedTime}${placePart}${notePart}`,
      },
    });
  }

  return { ok: true as const, proposalId: proposal.id };
}

export async function respondDateProposal(
  proposalId: string,
  accountId: string,
  accept: boolean
): Promise<{ ok: true; matchId: string } | { ok: false; error: string }> {
  const prisma = getPrisma();
  const proposal = await prisma.datingDateProposal.findUnique({ where: { id: proposalId } });
  if (!proposal || proposal.status !== "pending") return { ok: false, error: "Propozycja nie istnieje lub wygasła." };

  const ok = await assertMatchParticipant(proposal.matchId, accountId);
  if (!ok) return { ok: false, error: "Brak dostępu." };
  if (proposal.proposerAccountId === accountId) return { ok: false, error: "Nie możesz odpowiedzieć na własną propozycję." };

  const status = accept ? "accepted" : "declined";
  await prisma.datingDateProposal.update({
    where: { id: proposalId },
    data: { status, respondedAt: new Date() },
  });

  await prisma.datingMessage.create({
    data: {
      matchId: proposal.matchId,
      senderAccountId: accountId,
      body: accept
        ? `✅ Randka potwierdzona: ${proposal.proposedDate} o ${proposal.proposedTime}`
        : `Propozycja randki (${proposal.proposedDate} ${proposal.proposedTime}) — odrzucona.`,
    },
  });

  return { ok: true, matchId: proposal.matchId };
}
