import { getPrisma } from "@/lib/db";

export type IceSignal = { fromAccountId: string; candidate: string; at: number };

export type CallSignalSnapshot = {
  callId: string;
  accountAId: string;
  accountBId: string;
  offerSdp: string | null;
  answerSdp: string | null;
  ice: IceSignal[];
  isInitiator: boolean;
};

const CALL_TTL_MS = 10 * 60 * 1000;

function normalizePair(a: string, b: string): [string, string] {
  return a < b ? [a, b] : [b, a];
}

export async function createVoiceCall(accountAId: string, accountBId: string): Promise<string> {
  const prisma = getPrisma();
  const [accountA, accountB] = normalizePair(accountAId, accountBId);
  const callId = `vc_${accountA.slice(-6)}_${accountB.slice(-6)}_${Date.now()}`;
  const expiresAt = new Date(Date.now() + CALL_TTL_MS);
  await prisma.datingVoiceCallSignal.create({
    data: { callId, accountAId: accountA, accountBId: accountB, expiresAt },
  });
  return callId;
}

export async function getCallSnapshot(callId: string, viewerAccountId: string): Promise<CallSignalSnapshot | null> {
  const row = await getPrisma().datingVoiceCallSignal.findUnique({ where: { callId } });
  if (!row || row.expiresAt < new Date()) return null;
  if (row.accountAId !== viewerAccountId && row.accountBId !== viewerAccountId) return null;
  let ice: IceSignal[] = [];
  try {
    ice = JSON.parse(row.signalsJson) as IceSignal[];
    if (!Array.isArray(ice)) ice = [];
  } catch {
    ice = [];
  }
  return {
    callId: row.callId,
    accountAId: row.accountAId,
    accountBId: row.accountBId,
    offerSdp: row.offerSdp,
    answerSdp: row.answerSdp,
    ice,
    isInitiator: row.accountAId === viewerAccountId,
  };
}

export async function postCallSignal(
  callId: string,
  accountId: string,
  payload: { type: "offer" | "answer" | "ice"; sdp?: string; candidate?: string }
): Promise<void> {
  const prisma = getPrisma();
  const row = await prisma.datingVoiceCallSignal.findUnique({ where: { callId } });
  if (!row || row.expiresAt < new Date()) throw new Error("Połączenie wygasło.");
  if (row.accountAId !== accountId && row.accountBId !== accountId) throw new Error("Brak dostępu.");

  if (payload.type === "offer") {
    await prisma.datingVoiceCallSignal.update({
      where: { callId },
      data: { offerSdp: payload.sdp ?? null },
    });
    return;
  }
  if (payload.type === "answer") {
    await prisma.datingVoiceCallSignal.update({
      where: { callId },
      data: { answerSdp: payload.sdp ?? null },
    });
    return;
  }
  if (payload.type === "ice" && payload.candidate) {
    let ice: IceSignal[] = [];
    try {
      ice = JSON.parse(row.signalsJson) as IceSignal[];
      if (!Array.isArray(ice)) ice = [];
    } catch {
      ice = [];
    }
    ice.push({ fromAccountId: accountId, candidate: payload.candidate, at: Date.now() });
    if (ice.length > 80) ice = ice.slice(-80);
    await prisma.datingVoiceCallSignal.update({
      where: { callId },
      data: { signalsJson: JSON.stringify(ice) },
    });
  }
}

export async function endVoiceCall(callId: string): Promise<void> {
  await getPrisma().datingVoiceCallSignal.deleteMany({ where: { callId } });
}
