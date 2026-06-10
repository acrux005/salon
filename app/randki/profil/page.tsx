import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { RANDKI_ROLE } from "@/lib/auth";
import { parseInterests, parseLookingFor, parsePrompts } from "@/lib/randki/constants";
import { getMyProfile } from "@/lib/randki/matching";
import { listProfilePhotos } from "@/lib/randki/photos";
import { listVibeMaterials } from "@/lib/randki/vibeMaterial";
import { listVibeCatalogForMood, seedVibeCatalogIfEmpty } from "@/lib/randki/vibeCatalog";
import { getActiveDailyMoment, hasPostedMomentToday } from "@/lib/randki/dailyMoment";
import { RandkiProfileForm } from "@/components/randki/RandkiProfileForm";

export default async function RandkiProfilPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role;
  const accountId = (session?.user as { datingAccountId?: string })?.datingAccountId;
  if (role !== RANDKI_ROLE || !accountId) redirect("/randki/logowanie");

  const profile = await getMyProfile(accountId);
  if (!profile) redirect("/randki/rejestracja");
  const photos = await listProfilePhotos(accountId);
  const vibeMaterials = await listVibeMaterials(accountId);
  await seedVibeCatalogIfEmpty();
  const vibeCatalog = await listVibeCatalogForMood(profile.mood);
  const [activeMoment, momentToday] = await Promise.all([
    getActiveDailyMoment(accountId),
    hasPostedMomentToday(accountId),
  ]);

  return (
    <main className="mx-auto max-w-[72rem] px-4 py-10">
      <h1 className="text-2xl font-bold text-white">Twój pokój</h1>
      <p className="mt-2 text-[14px] text-white/60">Nie profil — przestrzeń. Goście wchodzą na chwilę, nie oceniają CV.</p>
      <p className="mb-6 mt-4 text-[12px] text-white/40">
        Wejdź do swojego pokoju jak gość. Przełącz na „Edycję”, gdy chcesz coś zmienić.
      </p>
      <RandkiProfileForm
        initial={{
          displayName: profile.displayName,
          birthYear: profile.birthYear,
          city: profile.city,
          gender: profile.gender,
          bio: profile.bio,
          photoUrl: profile.photoUrl,
          photos,
          searchAllCities: profile.searchAllCities,
          profileActive: profile.active,
          ageMinPref: profile.ageMinPref,
          ageMaxPref: profile.ageMaxPref,
          lookingFor: parseLookingFor(profile.lookingFor),
          interests: parseInterests(profile.interests),
          prompts: parsePrompts(profile.promptsJson),
          voiceIntroUrl: profile.voiceIntroUrl,
          vibeMaterials,
          vibeCatalog,
          userMood: profile.mood,
          dailyMomentUrl: activeMoment?.url ?? null,
          dailyMomentSecondaryUrl: activeMoment?.secondaryUrl ?? null,
          hasMomentToday: momentToday,
          auraImageUrl: profile.auraStatus === "uploaded" ? profile.auraImageUrl : null,
          auraImageUrl2: profile.auraStatus === "uploaded" ? profile.auraImageUrl2 : null,
          auraImageUrl3: profile.auraStatus === "uploaded" ? profile.auraImageUrl3 : null,
          auraCaption: profile.auraCaption ?? "",
          auraPrompt: profile.auraPrompt ?? "",
          roomPhasesJson: profile.roomPhasesJson ?? "{}",
        }}
      />
    </main>
  );
}
