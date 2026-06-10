import Link from "next/link";
import { Users, Building2, Sparkles, Bell, MessageSquare, FileText } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-white py-12">
      <div className="mx-auto max-w-2xl px-4">
        <h1 className="font-[var(--font-serif)] text-2xl font-normal text-[#1F1A1C]">
          Panel admina
        </h1>
        <p className="mt-2 font-[var(--font-sans)] text-[15px] text-[#6F5E64]">
          Zarządzaj portalem, użytkownikami, gabinetami i treściami.
        </p>
        <div className="mt-8 flex flex-col gap-4">
          <Link
            href="/portal/admin/klienci"
            className="flex items-center gap-4 rounded-xl border border-pink-200 bg-pink-50/50 px-6 py-4 font-[var(--font-sans)] text-[15px] font-medium text-pink-700 shadow-sm transition-colors hover:bg-pink-100/50"
          >
            <Users className="h-6 w-6 shrink-0" />
            <div>
              <span className="block font-medium">Użytkownicy</span>
              <span className="text-[13px] font-normal text-pink-600/80">
                Klienci i konta gabinetów
              </span>
            </div>
          </Link>
          <Link
            href="/portal/admin/gabinety"
            className="flex items-center gap-4 rounded-xl border border-pink-200 bg-pink-50/50 px-6 py-4 font-[var(--font-sans)] text-[15px] font-medium text-pink-700 shadow-sm transition-colors hover:bg-pink-100/50"
          >
            <Building2 className="h-6 w-6 shrink-0" />
            <div>
              <span className="block font-medium">Gabinety</span>
              <span className="text-[13px] font-normal text-pink-600/80">
                Lista, edycja i usuwanie gabinetów
              </span>
            </div>
          </Link>
          <Link
            href="/portal/admin/zabiegi"
            className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white px-6 py-4 font-[var(--font-sans)] text-[15px] font-medium text-[#1F1A1C] shadow-sm transition-colors hover:border-pink-300 hover:bg-pink-50/50"
          >
            <Sparkles className="h-6 w-6 shrink-0 text-neutral-500" />
            <div>
              <span className="block font-medium">Zabiegi</span>
              <span className="text-[13px] font-normal text-neutral-500">
                Katalog zabiegów — podgląd
              </span>
            </div>
          </Link>
          <Link
            href="/portal/admin/randki"
            className="flex items-center gap-4 rounded-xl border border-rose-200 bg-rose-50/50 px-6 py-4 font-[var(--font-sans)] text-[15px] font-medium text-rose-800 shadow-sm transition-colors hover:bg-rose-100/50"
          >
            <FileText className="h-6 w-6 shrink-0" />
            <div>
              <span className="block font-medium">Moderacja Randki Odart</span>
              <span className="text-[13px] font-normal text-rose-700/80">Zgłoszenia użytkowników</span>
            </div>
          </Link>
          <Link
            href="/portal/admin/propozycje"
            className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white px-6 py-4 font-[var(--font-sans)] text-[15px] font-medium text-[#1F1A1C] shadow-sm transition-colors hover:border-pink-300 hover:bg-pink-50/50"
          >
            <FileText className="h-6 w-6 shrink-0 text-neutral-500" />
            <div>
              <span className="block font-medium">Propozycje zabiegów od gabinetów</span>
            </div>
          </Link>
          <Link
            href="/portal/admin/powiadomienia"
            className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white px-6 py-4 font-[var(--font-sans)] text-[15px] font-medium text-[#1F1A1C] shadow-sm transition-colors hover:border-pink-300 hover:bg-pink-50/50"
          >
            <Bell className="h-6 w-6 shrink-0 text-neutral-500" />
            Powiadomienia
          </Link>
          <Link
            href="/portal/admin/wiadomosci"
            className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white px-6 py-4 font-[var(--font-sans)] text-[15px] font-medium text-[#1F1A1C] shadow-sm transition-colors hover:border-pink-300 hover:bg-pink-50/50"
          >
            <MessageSquare className="h-6 w-6 shrink-0 text-neutral-500" />
            Wiadomości
          </Link>
        </div>
      </div>
    </main>
  );
}
