import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { RANDKI_ROLE } from "@/lib/auth";
import { getVoiceMatchState } from "@/lib/randki/voiceMatch";
import { RandkiVoiceMatchClient } from "@/components/randki/RandkiVoiceMatchClient";
import { isTurnConfigured } from "@/lib/randki/webrtc";

export default async function RandkiVoiceMatchPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role;
  const accountId = (session?.user as { datingAccountId?: string })?.datingAccountId;
  if (role !== RANDKI_ROLE || !accountId) redirect("/randki/logowanie");

  const state = await getVoiceMatchState(accountId);
  const serializable =
    state.status === "paired"
      ? {
          status: "paired" as const,
          partner: state.partner,
          callId: state.callId,
          expiresAt: state.expiresAt.toISOString(),
        }
      : state.status === "waiting"
        ? { status: "waiting" as const, expiresAt: state.expiresAt.toISOString() }
        : { status: "idle" as const };

  return (
    <main className="px-4 py-10">
      <h1 className="text-center text-2xl font-bold text-white">Voice match</h1>
      <RandkiVoiceMatchClient initialState={serializable} myAccountId={accountId} turnEnabled={isTurnConfigured()} />
    </main>
  );
}
