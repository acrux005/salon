import { GabLink } from "@/components/gabinetPlatform/GabLink";

export function FooterGab() {
  return (
    <footer className="mt-auto border-t border-gab-sky/30 bg-gab-navy text-sky-100">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-lg font-bold text-white">DentHarmonogram</p>
            <p className="mt-2 max-w-sm text-[14px] text-slate-400">
              Wizyty, kalendarz, pacjenci i recall dla gabinetów stomatologicznych.
            </p>
          </div>
          <div className="flex flex-col gap-2 text-[14px]">
            <GabLink href="/gabinety" className="hover:text-white">
              Znajdź gabinet
            </GabLink>
            <GabLink href="/dla-gabinetow" className="hover:text-white">
              Dla gabinetów
            </GabLink>
            <GabLink href="/register" className="hover:text-white">
              Rejestracja
            </GabLink>
            <a href="mailto:biuro@odart.pl" className="hover:text-white">
              biuro@odart.pl
            </a>
          </div>
        </div>
        <p className="mt-8 text-[13px] text-slate-500">
          © {new Date().getFullYear()} ODART — DentHarmonogram
        </p>
      </div>
    </footer>
  );
}
