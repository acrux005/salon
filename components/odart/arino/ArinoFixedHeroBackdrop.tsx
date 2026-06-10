type Props = { backgroundUrl: string };

/**
 * Tło hero „przyklejone” do viewportu (`position: fixed`).
 * Treść strony przewija się nad nim; kolejne sekcje z `bg-black` je zasłaniają.
 */
export function ArinoFixedHeroBackdrop({ backgroundUrl }: Props) {
  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-[1] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url("${backgroundUrl}")` }}
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 z-[1] bg-gradient-to-br from-black/95 via-black/80 to-[#180606]/95"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(ellipse_85%_65%_at_72%_38%,rgba(217,91,58,0.42),transparent_55%)]"
        aria-hidden
      />
    </>
  );
}
