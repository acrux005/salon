/** Miniaturka realizacji WWW: laptop + telefon — bez lazy-load kolażu. */
export function SalonWebsiteDevicesMockup() {
  return (
    <div
      className="relative flex min-h-[200px] items-end justify-center bg-gradient-to-br from-[#f8eef3] via-[#faf7f8] to-[#f0e8ec] px-4 pb-5 pt-8 sm:min-h-[220px] sm:px-6 sm:pb-6 sm:pt-10"
      aria-hidden
    >
      {/* Laptop */}
      <div className="relative z-0 w-[78%] max-w-[340px]">
        <div className="overflow-hidden rounded-t-lg border border-[#2a2426] bg-[#2a2426] shadow-[0_18px_40px_-12px_rgba(31,26,28,0.45)]">
          <div className="flex items-center gap-1.5 border-b border-white/10 bg-[#1a1618] px-2.5 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff5f57]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#febc2e]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#28c840]" />
            <span className="ml-2 flex-1 truncate rounded bg-white/10 px-2 py-0.5 text-center text-[8px] text-white/55">
              salon-beauty.pl
            </span>
          </div>
          <div className="bg-white">
            <div className="flex items-center justify-between border-b border-pink-100/80 px-2.5 py-1.5">
              <span className="text-[9px] font-semibold text-[#C86D84]">Gabinet</span>
              <span className="rounded-full bg-pink-500 px-2 py-0.5 text-[7px] font-medium text-white">
                Umów wizytę
              </span>
            </div>
            <div className="grid grid-cols-[1.15fr_0.85fr] gap-2 p-2.5">
              <div>
                <p className="font-[var(--font-serif)] text-[11px] leading-tight text-[#C86D84] sm:text-[12px]">
                  Odkryj swój naturalny blask
                </p>
                <p className="mt-1 text-[7px] leading-snug text-[#6F5E64] sm:text-[8px]">
                  Kosmetologia estetyczna. Pierwsza wizyta od konsultacji.
                </p>
                <div className="mt-2 h-4 w-16 rounded-full bg-pink-500" />
              </div>
              <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-pink-100 via-rose-50 to-neutral-100">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(236,72,153,0.25),transparent_55%)]" />
                <div className="absolute bottom-1 left-1 right-1 rounded bg-white/90 px-1 py-0.5 text-[6px] text-[#6F5E64]">
                  Zabiegi · Cennik
                </div>
              </div>
            </div>
            <div className="flex gap-1 border-t border-neutral-100 px-2.5 py-1.5">
              {["Twarz", "Ciało", "Paznokcie"].map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-pink-200 bg-pink-50 px-1.5 py-0.5 text-[6px] text-[#C86D84]"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="mx-auto h-2 w-[108%] -translate-x-[3.5%] rounded-b-md bg-[#3a3336]" />
        <div className="mx-auto h-1 w-1/3 rounded-b-sm bg-[#2a2426]" />
      </div>

      {/* Phone */}
      <div className="absolute bottom-3 right-[6%] z-10 w-[26%] max-w-[92px] sm:right-[8%] sm:max-w-[100px]">
        <div className="overflow-hidden rounded-[1.1rem] border-[3px] border-[#1F1A1C] bg-[#1F1A1C] shadow-[0_14px_28px_-8px_rgba(31,26,28,0.5)]">
          <div className="mx-auto mt-1 h-1 w-8 rounded-full bg-white/25" />
          <div className="m-0.5 overflow-hidden rounded-[0.85rem] bg-white">
            <div className="bg-gradient-to-b from-pink-50 to-white px-1.5 pb-2 pt-2">
              <p className="text-center text-[6px] font-semibold text-[#C86D84]">Gabinet</p>
              <p className="mt-1.5 font-[var(--font-serif)] text-[8px] leading-tight text-[#1F1A1C]">
                Odkryj swój blask
              </p>
              <p className="mt-0.5 text-[5px] leading-snug text-[#6F5E64]">Konsultacja · Zabiegi</p>
              <div className="mt-1.5 h-3 w-full rounded-full bg-pink-500" />
              <div className="mt-1.5 space-y-1">
                <div className="h-5 rounded bg-pink-100/80" />
                <div className="h-5 rounded bg-neutral-100" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
