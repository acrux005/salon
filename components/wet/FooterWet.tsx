import { WetLink } from "@/components/wet/WetLink";

export function FooterWet() {
  return (
    <footer className="mt-auto border-t border-wet-teal-200 bg-wet-navy text-wet-teal-100">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-lg font-bold text-white">VetHarmonogram</p>
            <p className="mt-2 max-w-sm text-[14px] text-slate-400">
              Wizyty, kalendarz i przypomnienia o szczepieniach dla przychodni weterynaryjnych.
            </p>
          </div>
          <div className="flex flex-col gap-2 text-[14px]">
            <WetLink href="/przychodnie" className="hover:text-white">
              Znajdź przychodnię
            </WetLink>
            <WetLink href="/dla-przychodni" className="hover:text-white">
              Dla przychodni
            </WetLink>
            <WetLink href="/register" className="hover:text-white">
              Rejestracja
            </WetLink>
            <a href="mailto:biuro@odart.pl" className="hover:text-white">
              biuro@odart.pl
            </a>
          </div>
        </div>
        <p className="mt-8 text-[13px] text-slate-500">
          © {new Date().getFullYear()} ODART — VetHarmonogram
        </p>
      </div>
    </footer>
  );
}
