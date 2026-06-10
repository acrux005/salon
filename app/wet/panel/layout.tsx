import { WetPanelLayoutClient } from "@/components/wet/WetPanelLayoutClient";

export default function WetPanelLayout({ children }: { children: React.ReactNode }) {
  return <WetPanelLayoutClient>{children}</WetPanelLayoutClient>;
}
