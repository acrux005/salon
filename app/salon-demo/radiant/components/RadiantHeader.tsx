import Link from "next/link";

export function RadiantHeader({ variant = "light" }: { variant?: "light" | "dark" }) {
  const isLight = variant === "light";
  const linkClass = isLight
    ? "text-sm font-medium text-gray-700 hover:text-gray-950"
    : "text-sm font-medium text-white/90 hover:text-white";

  return (
    <header className={`relative z-10 border-b ${isLight ? "border-black/5" : "border-white/10"}`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-6">
          <Link href="/salon-demo/radiant" className="flex items-center gap-3">
            <div className="grid grid-cols-3 gap-0.5">
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 w-1.5 rounded-full ${isLight ? "bg-gray-950" : "bg-white"}`}
                />
              ))}
            </div>
            <span className={`text-lg font-bold ${isLight ? "text-gray-950" : "text-white"}`}>
              Radiant
            </span>
          </Link>
          {isLight && (
            <div className="rounded-full bg-white/70 px-4 py-1.5 text-sm font-medium text-gray-900 backdrop-blur-sm">
              Radiant raises $100M Series A from Tailwind Ventures{" "}
              <Link href="#" className="font-semibold underline">→</Link>
            </div>
          )}
        </div>
        <nav className="flex items-center gap-8">
          <Link href="/salon-demo" className={linkClass}>Oatmeal</Link>
          <Link href="/salon-demo/radiant#pricing" className={linkClass}>Pricing</Link>
          <Link href="/salon-demo/radiant/about" className={linkClass}>Company</Link>
          <Link href="#" className={linkClass}>Blog</Link>
          <Link href="/salon-demo/radiant/careers" className={linkClass}>Careers</Link>
          <Link href="/panel/logowanie" className={linkClass}>Login</Link>
          <Link
            href="/salon-demo/radiant/get-started"
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              isLight
                ? "bg-gray-950 text-white hover:bg-gray-800"
                : "bg-white text-gray-950 hover:bg-gray-100"
            }`}
          >
            Get started
          </Link>
        </nav>
      </div>
    </header>
  );
}
