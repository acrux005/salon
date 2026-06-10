/**
 * Dekoracja hero: wąska pionowa „ścieżka” ze świetlną smugą sunącą w dół (globals: .odart-snake-*).
 */
export function OdartSnakeLineAccent({
  side = "left",
  phaseDelay = false,
}: {
  side?: "left" | "right";
  /** Druga linia (np. prawa) — opóźniona faza animacji */
  phaseDelay?: boolean;
}) {
  const pos =
    side === "left"
      ? "left-0 md:left-4 lg:left-8"
      : "right-0 md:right-4 lg:right-8";
  return (
    <div
      className={`pointer-events-none absolute inset-y-0 ${pos} w-px overflow-hidden sm:w-[2px]`}
      aria-hidden
    >
      <div className="odart-snake-track" />
      <div className={`odart-snake-glow${phaseDelay ? " odart-snake-glow--delayed" : ""}`} />
    </div>
  );
}
