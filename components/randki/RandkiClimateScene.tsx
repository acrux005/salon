import type { RoomClimateId } from "@/lib/randki/roomClimate";

/** Dekoracyjna warstwa klimatu — każdy pokój ma własny świat wizualny. */
export function RandkiClimateScene({ climateId }: { climateId: RoomClimateId }) {
  return (
    <div className="randki-climate-scene" aria-hidden>
      <div className="randki-climate-scene__base" />
      <div className={`randki-climate-scene__fx randki-climate-scene__fx--${climateId}`}>
        {climateId === "rainy" && (
          <>
            <span className="randki-climate-rain" />
            <span className="randki-climate-reflection" />
          </>
        )}
        {climateId === "warm-cafe" && <span className="randki-climate-lamp" />}
        {climateId === "lo-fi" && (
          <>
            <span className="randki-climate-stars" />
            <span className="randki-climate-neon-horizon" />
            <span className="randki-climate-synth-sun" />
          </>
        )}
        {climateId === "night-walk" && (
          <>
            <span className="randki-climate-streetlight" />
            <span className="randki-climate-motion-blur" />
          </>
        )}
        {climateId === "quiet-reading" && <span className="randki-climate-desk-lamp" />}
        {climateId === "city-lights" && <span className="randki-climate-bokeh" />}
        {climateId === "cozy-orange" && <span className="randki-climate-fire" />}
        {climateId === "moonlight-blue" && <span className="randki-climate-moon" />}
      </div>
      {(climateId === "warm-cafe" || climateId === "lo-fi" || climateId === "quiet-reading") && (
        <div className="randki-climate-scene__grain" />
      )}
    </div>
  );
}
