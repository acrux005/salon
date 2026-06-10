import { getPrisma } from "@/lib/db";
import { sendDatingMatchEmail, sendDatingMessageEmail } from "@/lib/randki/email";
import { NOTIFICATION_COPY } from "@/lib/randki/presenceInteractions";
import { sendRandkiPush } from "@/lib/randki/push";

export async function notifyDatingMatch(accountAId: string, accountBId: string, host?: string) {
  const prisma = getPrisma();
  for (const [recipientId, otherId] of [
    [accountAId, accountBId],
    [accountBId, accountAId],
  ] as const) {
    const [account, otherProfile] = await Promise.all([
      prisma.datingAccount.findUnique({ where: { id: recipientId }, select: { email: true } }),
      prisma.datingProfile.findUnique({ where: { accountId: otherId }, select: { displayName: true } }),
    ]);
    const name = otherProfile?.displayName ?? "ktoś";
    if (account?.email) {
      await sendDatingMatchEmail(account.email, name, host);
    }
    await sendRandkiPush(
      recipientId,
      {
        title: NOTIFICATION_COPY.resonance(name).title,
        body: NOTIFICATION_COPY.resonance(name).body,
        url: "/dopasowania",
      },
      host
    );
  }
}

export async function notifyDatingMessage(
  matchId: string,
  senderAccountId: string,
  body: string,
  host?: string
) {
  const prisma = getPrisma();
  const match = await prisma.datingMatch.findUnique({ where: { id: matchId } });
  if (!match) return;
  const recipientId = match.accountAId === senderAccountId ? match.accountBId : match.accountAId;
  const [recipient, senderProfile] = await Promise.all([
    prisma.datingAccount.findUnique({ where: { id: recipientId }, select: { email: true } }),
    prisma.datingProfile.findUnique({ where: { accountId: senderAccountId }, select: { displayName: true } }),
  ]);
  const name = senderProfile?.displayName ?? "Użytkownik";
  const preview = body.length > 80 ? `${body.slice(0, 77)}…` : body;
  if (recipient?.email) {
    await sendDatingMessageEmail(recipient.email, name, body, matchId, host);
  }
  await sendRandkiPush(
    recipientId,
    {
      title: NOTIFICATION_COPY.message(name, preview).title,
      body: NOTIFICATION_COPY.message(name, preview).body,
      url: `/przestrzen/${matchId}`,
    },
    host
  );
}

export async function notifyVoiceMatchPaired(
  accountAId: string,
  accountBId: string,
  host?: string
) {
  const prisma = getPrisma();
  for (const [recipientId, otherId] of [
    [accountAId, accountBId],
    [accountBId, accountAId],
  ] as const) {
    const other = await prisma.datingProfile.findUnique({
      where: { accountId: otherId },
      select: { displayName: true },
    });
    const name = other?.displayName ?? "ktoś";
    await sendRandkiPush(
      recipientId,
      {
        title: NOTIFICATION_COPY.voicePaired(name).title,
        body: NOTIFICATION_COPY.voicePaired(name).body,
        url: "/voice-match",
      },
      host
    );
  }
}

export async function notifyPresenceResonance(
  hostAccountId: string,
  fromAccountId: string,
  opts?: { isReply?: boolean; isMoment?: boolean },
  host?: string
) {
  const prisma = getPrisma();
  const sender = await prisma.datingProfile.findUnique({
    where: { accountId: fromAccountId },
    select: { displayName: true },
  });
  const name = sender?.displayName ?? "ktoś";
  const copy = opts?.isMoment
    ? NOTIFICATION_COPY.momentResonance(name)
    : opts?.isReply
      ? NOTIFICATION_COPY.traceReply(name)
      : NOTIFICATION_COPY.resonance(name);
  await sendRandkiPush(
    hostAccountId,
    {
      title: copy.title,
      body: copy.body,
      url: "/panel",
    },
    host
  );
}
