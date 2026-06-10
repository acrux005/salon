import { Instrument_Serif } from "next/font/google";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-instrument",
});

export default function SalonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={instrumentSerif.variable}>
      {children}
    </div>
  );
}
