import { ZamowTopHeader } from "@/components/ZamowTopHeader";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-zamow-cream">
      <ZamowTopHeader showRestauracjeNavLink />
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
