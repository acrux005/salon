import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { RANDKI_ROLE } from "@/lib/auth";
import {
  discoverProfiles,
  getMyProfile,
  countDailyResonances,
  countDailyImpressions,
  DAILY_RESONANCE_LIMIT,
  getDailyDiscoveryLimit,
  profileReadyForDiscovery,
  needsOnboarding,
} from "@/lib/randki/matching";
import { RandkiDiscoveryClient } from "@/components/randki/RandkiDiscoveryClient";
import { getActiveDailyMoment, hasPostedMomentToday } from "@/lib/randki/dailyMoment";
import { RandkiLiveFeed } from "@/components/randki/RandkiLiveFeed";
import { getLiveFeed } from "@/lib/randki/liveFeed";
import { getCommunityPulse } from "@/lib/randki/communityPulse";
import { shouldShowDemoDiscoveryRooms } from "@/lib/randki/demoDiscoveryCards";
import {
  getDemoDiscoveryCardsForPhase,
  getDemoLiveFeedForPhase,
  getDemoOnlineCountForPhase,
  getDemoPresentCountForPhase,
  shouldShowDemoDayRhythm,
} from "@/lib/randki/demoDayRhythm";
import { RandkiPanelCenterStack } from "@/components/randki/RandkiPanelCenterStack";
import { RandkiPanelActionsAside } from "@/components/randki/RandkiPanelActionsAside";
import { RandkiRoomRotationBanner } from "@/components/randki/RandkiRoomRotationBanner";
import { RandkiDayPhaseDemoBar } from "@/components/randki/RandkiDayPhaseDemoBar";
import { resolveDayPhaseMeta, isEveningPhase, isVoicePeakPhase, dayPhaseClass } from "@/lib/randki/dayRhythm";
import { getAmbientPanelContext } from "@/lib/randki/ambientPresence";
import { listHostPresenceInbox } from "@/lib/randki/presenceTraces";

type PageProps = {
  searchParams?: { phase?: string };
};

export default async function RandkiPanelPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role;
  const accountId = (session?.user as { datingAccountId?: string })?.datingAccountId;
  if (role !== RANDKI_ROLE || !accountId) redirect("/randki/logowanie");

  const profile = await getMyProfile(accountId);
  if (!profile) redirect("/randki/rejestracja");
  if (await needsOnboarding(accountId)) redirect("/randki/onboarding");

  const ready = await profileReadyForDiscovery(accountId);
  let cards: Awaited<ReturnType<typeof discoverProfiles>> = [];
  let dailyResonances = 0;
  let impressionsToday = 0;
  let discoveryLimit = 1;
  let momentToday: Awaited<ReturnType<typeof getActiveDailyMoment>> = null;
  let hasMoment = false;
  let pulse: Awaited<ReturnType<typeof getCommunityPulse>> | null = null;
  let liveFeed: Awaited<ReturnType<typeof getLiveFeed>> | null = null;

  const demoRooms = shouldShowDemoDiscoveryRooms();
  const demoDay = shouldShowDemoDayRhythm();
  const phaseOverride = demoDay ? searchParams?.phase : undefined;
  const dayPhase = resolveDayPhaseMeta(phaseOverride);

  if (ready || demoRooms) {
    const dataPromise = ready
      ? Promise.all([
          discoverProfiles(accountId),
          countDailyResonances(accountId),
          countDailyImpressions(accountId),
          getDailyDiscoveryLimit(accountId),
          getActiveDailyMoment(accountId),
          hasPostedMomentToday(accountId),
          getCommunityPulse(accountId),
          getLiveFeed(accountId),
        ])
      : Promise.all([
          Promise.resolve([] as Awaited<ReturnType<typeof discoverProfiles>>),
          Promise.resolve(0),
          Promise.resolve(0),
          Promise.resolve(1),
          Promise.resolve(null as Awaited<ReturnType<typeof getActiveDailyMoment>>),
          Promise.resolve(false),
          getCommunityPulse(accountId),
          getLiveFeed(accountId),
        ]);

    [cards, dailyResonances, impressionsToday, discoveryLimit, momentToday, hasMoment, pulse, liveFeed] = await dataPromise;
  }

  const panelCards = demoRooms ? getDemoDiscoveryCardsForPhase(dayPhase.id) : cards;
  const featuredCard = panelCards[0] ?? null;
  const guestCards = demoRooms ? panelCards.slice(1, 7) : panelCards.slice(1, 4);
  const ambientContext = !demoRooms && ready && panelCards.length === 0 ? getAmbientPanelContext(phaseOverride) : null;
  const feedItems = demoDay
    ? getDemoLiveFeedForPhase(dayPhase.id)
    : liveFeed?.items?.length
      ? liveFeed.items
      : (ambientContext?.feedItems ?? []);
  const onlineCount = demoDay ? getDemoOnlineCountForPhase(dayPhase.id) : (liveFeed?.onlineInCity ?? pulse?.momentsToday ?? 24);
  const presentCount = demoRooms
    ? getDemoPresentCountForPhase(dayPhase.id, panelCards.length)
    : Math.min(4, 1 + guestCards.length);
  const panelDiscoveryLimit = demoRooms ? panelCards.length : discoveryLimit;
  const panelImpressions = demoRooms ? 0 : impressionsToday;
  const discoveryDone = demoRooms ? false : impressionsToday >= discoveryLimit;
  const eveningUi = isEveningPhase(dayPhase.id);
  const voicePeak = isVoicePeakPhase(dayPhase.id);
  const presenceInbox = ready ? await listHostPresenceInbox(accountId) : [];

  return (
    <main className={`mx-auto max-w-[1400px] px-4 py-6 lg:py-8 ${dayPhaseClass(dayPhase.id)}`}>
      {(ready || demoRooms) && (
        <>
          {demoDay && (
            <>
              <Suspense fallback={null}>
                <RandkiDayPhaseDemoBar currentPhase={dayPhase.id} />
              </Suspense>
              <RandkiRoomRotationBanner activeRooms={panelCards.length} />
            </>
          )}

          {demoRooms && !demoDay && (
            <p className="mb-4 rounded-xl border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-center text-[13px] text-violet-100/90 lg:text-left">
              Podgląd demo — 10 pokoi z pełną konfiguracją pór dnia (ślady rezonansu nie są zapisywane).
            </p>
          )}

          {demoRooms && demoDay && (
            <p className="mb-4 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-2 text-center text-[12px] text-emerald-100/85 lg:text-left">
              Demo · {panelCards.length} aktywnych pokoi · ~{onlineCount} obecnych · przełącz porę powyżej
            </p>
          )}

          <section className={`randki-panel-stage ${dayPhaseClass(dayPhase.id)}`}>
          <div className="randki-panel-stage-ambient pointer-events-none" aria-hidden />
          <div className="randki-panel-hero-grid grid gap-6 lg:grid-cols-[minmax(280px,340px)_minmax(0,1fr)_minmax(260px,300px)] lg:items-start lg:gap-6 xl:gap-8">
            <RandkiPanelActionsAside
              ready={ready}
              hasMoment={hasMoment}
              hasPerson={panelCards.length > 0}
              discoveryDone={discoveryDone}
              momentUrl={momentToday?.url ?? null}
              momentSecondaryUrl={momentToday?.secondaryUrl}
              capturedAt={momentToday?.capturedAt?.toISOString()}
              mood={profile.mood}
              activityIntent={profile.activityIntent}
              todayState={profile.todayState}
              todayStateUpdatedAt={profile.todayStateUpdatedAt?.toISOString()}
              isEvening={eveningUi}
              dayPhase={dayPhase}
              onlineCount={onlineCount}
              activeRoomCards={panelCards}
              presenceInbox={presenceInbox.map((e) => ({
                id: e.id,
                traceLabel: e.traceLabel,
                reactionId: e.reactionId,
                guestAlias: e.guestAlias,
                replies: e.replies.map((r) => ({ traceLabel: r.traceLabel, reactionId: r.reactionId })),
              }))}
            />

            <RandkiPanelCenterStack
              dayPhase={dayPhase}
              hero={{
                featuredCard,
                guestCards,
                microEvents: feedItems,
                onlineCount,
                presentCount,
                isEvening: eveningUi,
                voiceActive: voicePeak || (pulse?.voiceWaiting ?? 0) > 0,
                dayPhase,
                compact: true,
              }}
              ambient={ambientContext}
              discovery={{
                initialCards: panelCards,
                profileIncomplete: !ready && !demoRooms,
                incompleteReason: !profile.completed ? "complete" : !profile.onboardingDone ? "onboarding" : "photo",
                initialDailyResonances: dailyResonances,
                dailyLimit: DAILY_RESONANCE_LIMIT,
                impressionsToday: panelImpressions,
                discoveryLimit: panelDiscoveryLimit,
                demoBrowseMode: demoRooms,
              }}
            />

            {(liveFeed || demoDay || ambientContext) && (
              <RandkiLiveFeed
                variant="hero"
                items={feedItems}
                onlineInCity={onlineCount}
                isEvening={eveningUi}
                cityLabel={liveFeed?.cityLabel ?? profile.city ?? null}
                dayPhase={dayPhase}
                voiceActive={voicePeak || (pulse?.voiceWaiting ?? 0) > 0}
                roomCards={panelCards}
              />
            )}
          </div>
          </section>
        </>
      )}

      {!ready && !demoRooms && (
        <div className="mt-4">
          <RandkiDiscoveryClient
            initialCards={[]}
            profileIncomplete
            incompleteReason={!profile.completed ? "complete" : !profile.onboardingDone ? "onboarding" : "photo"}
          />
        </div>
      )}
    </main>
  );
}
