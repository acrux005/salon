import { Familjen_Grotesk } from "next/font/google";

const familjen = Familjen_Grotesk({
  subsets: ["latin"],
  variable: "--font-familjen",
});

export const metadata = {
  title: "Salon Demo — Odart | Oatmeal Mauve Familjen",
  description: "Strona demo w stylu Oatmeal Mauve Familjen.",
};

export default function SalonDemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={familjen.variable}>{children}</div>;
}
