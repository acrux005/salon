import Link from "next/link";
import {
  listPendingDatingReportsAction,
  listResolvedDatingReportsAction,
  listRecentDatingPhotosAction,
  getDatingPremiumStatsAction,
  listDatingPremiumUsersAction,
} from "@/app/actions/randkiAdmin";
import { RandkiAdminPanel } from "./RandkiAdminPanel";
import "@/app/randki/randki-theme.css";

export default async function AdminRandkiPage() {
  const [pending, resolved, photos, premiumStats, premiumUsers] = await Promise.all([
    listPendingDatingReportsAction(),
    listResolvedDatingReportsAction(),
    listRecentDatingPhotosAction(),
    getDatingPremiumStatsAction(),
    listDatingPremiumUsersAction(),
  ]);

  return (
    <main className="min-h-screen bg-white py-12">
      <div className="mx-auto max-w-4xl px-4">
        <Link href="/portal/admin" className="text-[14px] text-pink-600 hover:underline">
          ← Panel admina
        </Link>
        <h1 className="mt-4 font-[var(--font-serif)] text-2xl font-normal text-[#1F1A1C]">Moderacja Randka Odart</h1>
        <p className="mt-2 text-[15px] text-[#6F5E64]">Zgłoszenia, użytkownicy, zdjęcia i Premium.</p>
        <div className="mt-8">
          <RandkiAdminPanel
            pendingReports={pending.ok ? pending.rows : []}
            resolvedReports={resolved.ok ? resolved.rows : []}
            recentPhotos={photos.ok ? photos.rows : []}
            premiumStats={premiumStats.ok ? premiumStats.stats : null}
            premiumUsers={premiumUsers.ok ? premiumUsers.rows : []}
          />
        </div>
      </div>
    </main>
  );
}
