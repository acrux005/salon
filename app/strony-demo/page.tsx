import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight,
  Menu,
  Waves,
  Cloud,
  Lock,
  RefreshCw,
  Fingerprint,
  Settings,
  Database,
  Folder,
  Box,
  Activity,
  Globe,
  BarChart3,
  Search,
  Server,
  Star,
  Quote,
  Check,
  Phone,
  Video,
  MapPin,
  Mail,
} from "lucide-react";

export const metadata = {
  title: "Strony demo — Odart",
  description: "Przykładowe sekcje i szablony stron internetowych.",
};

export default function StronyDemoPage() {
  return (
    <main className="min-h-screen">
      {/* Hero z menu i logiem — menu na górze, obrazek pod menu, diagonalny przekrój */}
      <section className="bg-[#0f0f23] pb-24 lg:pb-32">
        {/* Menu — osobny pasek na górze, zawsze widoczny */}
        <header className="flex items-center gap-8 px-6 py-5 lg:px-12 xl:px-16">
          <button type="button" className="flex h-10 w-10 shrink-0 items-center justify-center text-slate-400 hover:text-white" aria-label="Menu">
            <Menu className="h-6 w-6" aria-hidden />
          </button>
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Waves className="h-8 w-8 text-cyan-400" aria-hidden />
            <span className="text-xl font-semibold text-white">Odart</span>
          </Link>
          <nav className="flex flex-1 items-center justify-end gap-8">
            <Link href="#oferta" className="text-sm font-medium text-slate-300 hover:text-white">Oferta</Link>
            <Link href="#cennik" className="text-sm font-medium text-slate-300 hover:text-white">Cennik</Link>
            <Link href="#zespol" className="text-sm font-medium text-slate-300 hover:text-white">Zespół</Link>
            <Link href="#kontakt" className="text-sm font-medium text-slate-300 hover:text-white">Kontakt</Link>
            <Link href="/panel/logowanie" className="text-sm font-medium text-slate-300 hover:text-white">Zaloguj się</Link>
          </nav>
        </header>

        {/* Obszar hero — obrazek pod menu, diagonalny przekrój */}
        <div className="relative min-h-[28rem] overflow-hidden lg:min-h-[34rem]">
          {/* Zdjęcie — pod menu, widoczne po prawej od przekroju (ukryte na mobile) */}
          <div className="absolute inset-0 z-0 hidden lg:block">
            <Image
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80"
              alt="Osoba pracująca na laptopie z widokiem na miasto"
              fill
              className="object-cover object-right"
              sizes="100vw"
            />
          </div>
          {/* Treść — ciemny obszar z diagonalnym przekrojem, diagonal dalej w prawo aby nie przycinał tekstu */}
          <div
            className="absolute inset-0 z-10 flex flex-col justify-between bg-[#0f0f23] px-6 py-12 lg:px-12 xl:px-16 [clip-path:polygon(0_0,100%_0,100%_100%,0_100%)] lg:[clip-path:polygon(0_0,68%_0,50%_100%,0_100%)]"
          >
            {/* Ogłoszenie — szary tekst z linkiem (niżej pod headline) */}
            <div className="max-w-2xl">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Dane, które rozwijają Twój biznes online
              </h1>
              <p className="mt-6 text-sm text-slate-400">
                Anim aute id magna aliqua ad ad non deserunt sunt.{" "}
                <Link href="#" className="font-medium text-indigo-400 hover:text-indigo-300">
                  Czytaj więcej →
                </Link>
              </p>
            </div>

            {/* Opis i CTAs */}
            <div className="mt-6 max-w-2xl lg:mt-8">
              <p className="max-w-xl text-base leading-7 text-slate-300">
                Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.
                Elit sunt amet fugiat veniam occaecat fugiat aliqua.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-6">
                <Link
                  href="#"
                  className="rounded-lg bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-500"
                >
                  Rozpocznij
                </Link>
                <Link
                  href="#"
                  className="inline-flex items-center text-base font-semibold text-white hover:text-slate-200"
                >
                  Dowiedz się więcej
                  <ChevronRight className="ml-1 h-5 w-5" aria-hidden />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features — 2x2 grid, Tailwind Plus style */}
      <section className="bg-slate-900 px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <p className="max-w-2xl text-base leading-7 text-slate-400">
            Quis tellus eget adipiscing convallis sit sit eget aliquet quis. Suspendisse eget egestas a elementum pulvinar et feugiat blandit at. In mi viverra elit nunc.
          </p>
          <div className="mt-16 grid gap-8 sm:grid-cols-2">
            <div className="flex gap-4 rounded-xl p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-indigo-500/50 bg-indigo-500/10">
                <Cloud className="h-6 w-6 text-indigo-400" aria-hidden />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Push to deploy</h3>
                <p className="mt-2 text-slate-400">
                  Morbi viverra dui mi arcu sed. Tellus semper adipiscing suspendisse semper morbi. Odio urna massa nunc massa.
                </p>
              </div>
            </div>
            <div className="flex gap-4 rounded-xl p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-indigo-500/50 bg-indigo-500/10">
                <Lock className="h-6 w-6 text-indigo-400" aria-hidden />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Certyfikaty SSL</h3>
                <p className="mt-2 text-slate-400">
                  Sit quis amet rutrum tellus ullamcorper ultricies libero dolor eget. Sem sodales gravida quam turpis enim lacus amet.
                </p>
              </div>
            </div>
            <div className="flex gap-4 rounded-xl p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-indigo-500/50 bg-indigo-500/10">
                <RefreshCw className="h-6 w-6 text-indigo-400" aria-hidden />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Proste kolejki</h3>
                <p className="mt-2 text-slate-400">
                  Quisque est vel vulputate cursus. Risus proin diam nunc commodo. Lobortis auctor congue commodo diam neque.
                </p>
              </div>
            </div>
            <div className="flex gap-4 rounded-xl p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-indigo-500/50 bg-indigo-500/10">
                <Fingerprint className="h-6 w-6 text-indigo-400" aria-hidden />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Zaawansowane zabezpieczenia</h3>
                <p className="mt-2 text-slate-400">
                  Arcu egestas dolor vel iaculis in ipsum mauris. Tincidunt mattis aliquet hac quis. Id hac maecenas ac donec pharetra eget.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hero „No server? No problem.” */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 via-[#1e1b4b]/40 to-slate-950 px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-medium uppercase tracking-wide text-indigo-400">Everything you need</p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            No server? No problem.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis.
          </p>
        </div>
      </section>

      {/* Dashboard — sidebar + projekty + activity feed */}
      <section className="bg-slate-900 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/50 shadow-xl">
            <div className="flex min-h-[420px]">
              {/* Sidebar */}
              <aside className="w-56 shrink-0 border-r border-slate-700/50 bg-slate-800/80 p-4">
                <p className="mb-4 text-xs font-medium uppercase tracking-wider text-slate-500">Navigation</p>
                <nav className="space-y-1">
                  {[
                    { icon: Folder, label: "Projects" },
                    { icon: Box, label: "Deployments" },
                    { icon: Activity, label: "Activity" },
                    { icon: Globe, label: "Domains" },
                    { icon: BarChart3, label: "Usage" },
                    { icon: Settings, label: "Settings" },
                  ].map((item, i) => (
                    <a
                      key={item.label}
                      href="#"
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                        i === 1 ? "bg-indigo-500/20 text-indigo-400" : "text-slate-400 hover:bg-slate-700/50 hover:text-white"
                      }`}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {item.label}
                    </a>
                  ))}
                </nav>
                <p className="mt-6 text-xs font-medium uppercase tracking-wider text-slate-500">Your teams</p>
                <div className="mt-2 space-y-2">
                  {["Planetaria", "Protocol", "Tailwind Labs"].map((team) => (
                    <div key={team} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-slate-700/50">
                      <div className="h-8 w-8 rounded-full bg-slate-600" />
                      <span>{team}</span>
                    </div>
                  ))}
                </div>
              </aside>
              {/* Main content */}
              <div className="flex-1 p-6">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2 rounded-lg border border-slate-600 bg-slate-800 px-3 py-2">
                    <Search className="h-4 w-4 text-slate-500" />
                    <span className="text-sm text-slate-400">Search projects...</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link href="#" className="text-sm text-slate-400 hover:text-white">Documentation</Link>
                    <Link href="#" className="text-sm text-slate-400 hover:text-white">Community</Link>
                    <Link href="#" className="text-sm text-slate-400 hover:text-white">Support</Link>
                    <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500">+ New project</button>
                  </div>
                </div>
                <div className="grid gap-8 lg:grid-cols-[1fr,320px]">
                  {/* All projects */}
                  <div>
                    <h3 className="text-lg font-semibold text-white">All projects</h3>
                    <div className="mt-4 space-y-3">
                      {[
                        { name: "Planetaria / ios-app", sub: "Deploys from GitHub • Initiated 1m 32s ago", tag: "Preview" },
                        { name: "Planetaria / mobile-api", sub: "Deploys from GitHub • Deployed 3m ago", tag: "Production" },
                      ].map((p) => (
                        <div key={p.name} className="flex items-center justify-between rounded-lg border border-slate-700/50 bg-slate-800/50 p-4">
                          <div>
                            <p className="font-medium text-white">{p.name}</p>
                            <p className="text-sm text-slate-500">{p.sub}</p>
                          </div>
                          <span className={`rounded-full px-3 py-1 text-xs font-medium ${p.tag === "Production" ? "bg-indigo-500/30 text-indigo-400" : "bg-slate-600 text-slate-400"}`}>
                            {p.tag}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Activity feed */}
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">Activity feed</h3>
                      <Link href="#" className="text-sm text-indigo-400 hover:text-indigo-300">View all →</Link>
                    </div>
                    <div className="mt-4 space-y-4">
                      {[
                        { user: "Cosetta Dusett", action: "Pushed to ios-app (27c83j on main)", time: "30s" },
                        { user: "Pammi Kakani", action: "Pushed to mobile-api (29jsd on main)", time: "3m" },
                      ].map((a) => (
                        <div key={a.user} className="flex gap-3">
                          <div className="h-8 w-8 shrink-0 rounded-full bg-slate-600" />
                          <div>
                            <p className="text-sm font-medium text-white">{a.user}</p>
                            <p className="text-sm text-slate-500">{a.action}</p>
                          </div>
                          <span className="ml-auto shrink-0 text-xs text-slate-600">{a.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 kart — 2x3 grid */}
      <section className="bg-slate-800/80 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Cloud, title: "Push to deploy.", desc: "Lorem ipsum, dolor sit amet consectetur adipisicing elit aute id magna." },
              { icon: Lock, title: "SSL certificates.", desc: "Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo." },
              { icon: RefreshCw, title: "Simple queues.", desc: "Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus." },
              { icon: Fingerprint, title: "Advanced security.", desc: "Lorem ipsum, dolor sit amet consectetur adipisicing elit aute id magna." },
              { icon: Settings, title: "Powerful API.", desc: "Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo." },
              { icon: Database, title: "Database backups.", desc: "Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus." },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-6">
                <item.icon className="h-8 w-8 text-indigo-400" aria-hidden />
                <h3 className="mt-3 text-base font-semibold text-indigo-400">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* A better workflow — Activity feed lewo, content prawo */}
      <section className="bg-slate-900 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-[380px_1fr]">
            {/* Activity feed — lewa kolumna */}
            <div className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Activity feed</h3>
                <Link href="#" className="text-sm text-indigo-400 hover:text-indigo-300">View all →</Link>
              </div>
              <div className="space-y-4">
                {[
                  { user: "Cosetta Dusett", action: "Pushed to ios-app (27c83j on main)", time: "30s", tag: "Preview" },
                  { user: "Pammi Kakani", action: "Pushed to mobile-api (29jsd on main)", time: "3m", tag: "Production" },
                  { user: "Kora Grisostomo", action: "Pushed to tailwindui.com (dd3ac on main)", time: "4m", tag: "Preview" },
                  { user: "Jean-Francois Tippy", action: "Pushed to relay-service (9da3c on main)", time: "8m", tag: "Production" },
                  { user: "Oberon Trevino", action: "Pushed to api.protocol.chat (b3fac on main)", time: "1d", tag: "Preview" },
                ].map((a) => (
                  <div key={a.user} className="flex gap-3">
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${a.tag === "Production" ? "bg-indigo-500/30 text-indigo-400" : "bg-slate-600 text-slate-400"}`}>
                      {a.tag}
                    </span>
                    <div className="h-8 w-8 shrink-0 rounded-full bg-slate-600" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white">{a.user}</p>
                      <p className="text-sm text-slate-500">{a.action}</p>
                    </div>
                    <span className="shrink-0 text-xs text-slate-600">{a.time}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Content — prawa kolumna */}
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-indigo-400">Deploy faster.</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                A better workflow.
              </h2>
              <p className="mt-4 text-slate-400">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.
              </p>
              <div className="mt-8 space-y-6">
                {[
                  { icon: Cloud, title: "Push to deploy.", desc: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione." },
                  { icon: Lock, title: "SSL certificates.", desc: "Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo." },
                  { icon: Database, title: "Database backups.", desc: "Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis." },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-indigo-500/50 bg-indigo-500/10">
                      <item.icon className="h-5 w-5 text-indigo-400" aria-hidden />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{item.title}</h3>
                      <p className="mt-1 text-sm text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Boost your productivity — content lewo, dashboard prawo */}
      <section className="bg-slate-900 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-[1fr,420px]">
            {/* Content — lewa kolumna */}
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Boost your productivity. Start using our app today.
              </h2>
              <p className="mt-4 text-slate-400">
                Ac euismod vel sit maecenas id pellentesque eu sed consectetur. Malesuada adipiscing sagittis vel nulla. Ac euismod vel sit maecenas.
              </p>
              <div className="mt-8 space-y-6">
                {[
                  { icon: Cloud, title: "Push to deploy.", desc: "Lorem ipsum, dolor sit amet consectetur adipisicing elit aute id magna." },
                  { icon: Lock, title: "SSL certificates.", desc: "Pellentesque enim a commodo malesuada turpis eleifend risus. Facilisis donec placerat sapien consequat tempor fermentum nibh." },
                  { icon: Database, title: "Database backups.", desc: "Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus." },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-indigo-500/50 bg-indigo-500/10">
                      <item.icon className="h-5 w-5 text-indigo-400" aria-hidden />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{item.title}</h3>
                      <p className="mt-1 text-sm text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Dashboard panel — prawa kolumna */}
            <div className="overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/50">
              <div className="flex min-h-[480px]">
                <aside className="w-48 shrink-0 border-r border-slate-700/50 p-4">
                  <p className="mb-4 text-xs font-medium uppercase tracking-wider text-slate-500">Navigation</p>
                  <nav className="space-y-1">
                    {[
                      { icon: Folder, label: "Projects" },
                      { icon: Server, label: "Deployments" },
                      { icon: Activity, label: "Activity" },
                      { icon: Globe, label: "Domains" },
                      { icon: BarChart3, label: "Usage" },
                      { icon: Settings, label: "Settings" },
                    ].map((item, i) => (
                      <a
                        key={item.label}
                        href="#"
                        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${i === 1 ? "bg-indigo-500/20 text-indigo-400" : "text-slate-400 hover:text-white"}`}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </a>
                    ))}
                  </nav>
                  <p className="mt-6 text-xs font-medium uppercase tracking-wider text-slate-500">Your teams</p>
                  <div className="mt-2 space-y-2">
                    {["Planetaria", "Protocol", "Tailwind Labs"].map((t) => (
                      <div key={t} className="flex items-center gap-2 text-sm text-slate-400">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-600 text-xs font-medium text-white">{t[0]}</div>
                        {t}
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 flex items-center gap-3 border-t border-slate-700 pt-4">
                    <div className="h-10 w-10 rounded-full bg-slate-600" />
                    <div>
                      <p className="text-sm font-medium text-white">Benjamin Button</p>
                      <p className="text-xs text-slate-500">benjbutt</p>
                    </div>
                  </div>
                </aside>
                <div className="flex-1 p-4">
                  <div className="mb-4 rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 flex items-center gap-2">
                    <Search className="h-4 w-4 text-slate-500" />
                    <span className="text-sm text-slate-400">Search projects...</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">All projects</h3>
                  <div className="mt-3 space-y-2">
                    {[
                      { team: "Planetaria", app: "ios-app", status: "grey", time: "Initiated 1m 32s ago" },
                      { team: "Planetaria", app: "mobile-api", status: "green", time: "Deployed 3m ago · 23s" },
                      { team: "Tailwind Labs", app: "tailwindcss.com", status: "grey", time: "Initiated 5m 45s ago" },
                      { team: "Tailwind Labs", app: "tailwindui.com", status: "green", time: "Initiated 8m ago", star: true },
                      { team: "Protocol", app: "relay-service", status: "green", time: "Deployed 3h ago" },
                      { team: "Planetaria", app: "android-app", status: "green", time: "Deployed 12d ago" },
                      { team: "Protocol", app: "api.protocol.chat", status: "red", time: "Failed to deploy 2m ago" },
                    ].map((p) => (
                      <div key={p.app} className="flex items-center gap-3 rounded-lg p-3 hover:bg-slate-700/30">
                        <span className={`h-2 w-2 shrink-0 rounded-full ${p.status === "green" ? "bg-emerald-500" : p.status === "red" ? "bg-red-500" : "bg-slate-500"}`} />
                        <div className="min-w-0 flex-1">
                          <p className="flex items-center gap-1 text-sm font-medium text-white">
                            {p.team} / {p.app}
                            {p.star && <Star className="h-4 w-4 fill-amber-400 text-amber-400" />}
                          </p>
                          <p className="text-xs text-slate-500">Deploys from GitHub · {p.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hero + Testimonial — lewo: Deploy faster, Get started, Maria Hill; prawo: dashboard */}
      <section className="bg-slate-900 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-[1fr,400px]">
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-indigo-400">Deploy faster.</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                A better workflow.
              </h2>
              <p className="mt-4 text-slate-400">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.
              </p>
              <button className="mt-6 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500">
                Get started
              </button>
              <blockquote className="mt-12 border-l-4 border-indigo-500/50 pl-6">
                <Quote className="h-8 w-8 text-slate-600" />
                <p className="mt-2 text-slate-300">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo expedita voluptas culpa sapiente alias molestiae.
                </p>
                <footer className="mt-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-600" />
                  <div>
                    <p className="font-medium text-white">Maria Hill</p>
                    <p className="text-sm text-slate-500">Marketing Manager</p>
                  </div>
                </footer>
              </blockquote>
            </div>
            <div className="overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/50">
              <div className="flex min-h-[400px]">
                <aside className="w-40 shrink-0 border-r border-slate-700/50 p-4">
                  <nav className="space-y-1">
                    {[
                      { icon: Folder, label: "Projects" },
                      { icon: Server, label: "Deployments" },
                      { icon: Activity, label: "Activity" },
                      { icon: Globe, label: "Domains" },
                      { icon: BarChart3, label: "Usage" },
                      { icon: Settings, label: "Settings" },
                    ].map((item, i) => (
                      <a
                        key={item.label}
                        href="#"
                        className={`flex items-center gap-2 rounded-lg px-2 py-2 text-sm ${i === 1 ? "bg-indigo-500/20 text-indigo-400" : "text-slate-400 hover:text-white"}`}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </a>
                    ))}
                  </nav>
                  <div className="mt-6 space-y-2">
                    <p className="text-xs font-medium text-slate-500">Your teams</p>
                    {["Planetaria", "Protocol", "Tailwind Labs"].map((t) => (
                      <div key={t} className="flex items-center gap-2 text-sm text-slate-400">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-600 text-xs text-white">{t[0]}</div>
                        {t}
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex items-center gap-2 pt-4 border-t border-slate-700">
                    <div className="h-8 w-8 rounded-full bg-slate-600" />
                    <div>
                      <p className="text-xs font-medium text-white">Benjamin Button</p>
                      <p className="text-xs text-slate-500">benjbutt</p>
                    </div>
                  </div>
                </aside>
                <div className="flex-1 p-4">
                  <div className="mb-4 rounded border border-slate-600 bg-slate-800 px-3 py-2 flex items-center gap-2">
                    <Search className="h-4 w-4 text-slate-500" />
                    <span className="text-sm text-slate-400">Search projects...</span>
                  </div>
                  <h3 className="text-sm font-semibold text-white">All projects</h3>
                  <div className="mt-2 space-y-2">
                    {[
                      { name: "Planetaria / ios-app", dot: "grey", time: "Initiated 1m 32s ago" },
                      { name: "Planetaria / mobile-api", dot: "green", time: "Deployed 3m ago" },
                      { name: "Tailwind Labs / tailwindui.com", dot: "green", time: "Initiated 8m ago", star: true },
                      { name: "Protocol / relay-service", dot: "green", time: "Deployed 3h ago" },
                    ].map((p) => (
                      <div key={p.name} className="flex items-center gap-2 py-2">
                        <span className={`h-2 w-2 shrink-0 rounded-full ${p.dot === "green" ? "bg-emerald-500" : "bg-slate-500"}`} />
                        <div className="min-w-0 flex-1">
                          <p className="flex items-center gap-1 text-sm text-white">
                            {p.name}
                            {p.star && <Star className="h-3 w-3 fill-amber-400 text-amber-400" />}
                          </p>
                          <p className="text-xs text-slate-500">Deploys from GitHub · {p.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1. Simple centered with gradient */}
      <section className="relative overflow-hidden bg-slate-950 px-6 py-24">
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-indigo-950/60 to-transparent" />
        <div className="relative mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Boost your productivity. Start using our app today.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            Incididunt sint fugiat pariatur cupidatat consectetur sit cillum anim id veniam aliqua proident excepteur commodo do ea.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button className="rounded-lg bg-indigo-600 px-6 py-3 text-base font-semibold text-white hover:bg-indigo-500">
              Get started
            </button>
            <Link href="#" className="inline-flex items-center text-base font-semibold text-white hover:text-slate-300">
              Learn more
              <ChevronRight className="ml-1 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. We're here to help */}
      <section className="bg-slate-900">
        <div className="mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2">
            <div className="min-h-[400px] bg-gradient-to-br from-indigo-900/80 via-slate-800 to-slate-900" />
            <div className="flex flex-col justify-center px-8 py-16 lg:px-12 lg:py-24">
              <p className="text-sm font-medium uppercase tracking-wide text-indigo-400">Award winning support</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                We're here to help
              </h2>
              <p className="mt-4 text-slate-400">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam voluptates, quod, quia, voluptatibus voluptatum voluptatem quidem quos voluptate quas.
              </p>
              <button className="mt-8 w-fit rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500">
                Visit the help center
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Join our team */}
      <section className="bg-slate-900 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-sky-400/30 via-blue-600/40 to-slate-800" />
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Join our team
              </h2>
              <p className="mt-4 text-slate-400">
                Lorem ipsum dolor sit amet consect adipisicing elit. Possimus magnam voluptatum cupiditate veritatis in accusamus quisquam.
              </p>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {["Competitive salaries", "30 days of paid vacation", "Benefits for you and your family", "Flexible work hours", "Annual team retreats", "A great work environment"].map((b) => (
                  <li key={b} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20">
                      <Check className="h-4 w-4 text-emerald-400" />
                    </span>
                    <span className="text-slate-300">{b}</span>
                  </li>
                ))}
              </ul>
              <Link href="#" className="mt-8 inline-flex items-center font-semibold text-indigo-400 hover:text-indigo-300">
                See our job postings
                <ChevronRight className="ml-1 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Our people */}
      <section className="bg-slate-900 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Our people
              </h2>
              <p className="mt-4 text-slate-400">
                Quasi est quaerat. Sit molestiae et. Provident ad dolorem occaecati eos iste. Soluta rerum quidem minus ut molestiae velit error quod. Excepturi quidem expedita molestias quas.
              </p>
              <p className="mt-4 text-slate-400">
                Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat fugiat. Quasi aperiam sit non sit neque reprehenderit.
              </p>
              <Link
                href="#"
                className="mt-8 inline-flex items-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
              >
                Join our team
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-rose-900/40 via-slate-700 to-slate-800" />
          </div>
        </div>
      </section>

      {/* Pricing — Hobby i Enterprise */}
      <section className="bg-slate-900 px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <p className="text-center text-sm font-medium uppercase tracking-wide text-indigo-400">Pricing</p>
          <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Choose the right plan for you
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-slate-400">
            Choose an affordable plan that's packed with the best features for engaging your audience, creating customer loyalty, and driving sales.
          </p>
          <div className="mt-16 grid gap-8 sm:grid-cols-2">
            {/* Hobby */}
            <div className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-8">
              <h3 className="text-base font-semibold text-indigo-400">Hobby</h3>
              <p className="mt-4">
                <span className="text-4xl font-bold text-white">$29</span>
                <span className="text-slate-400">/month</span>
              </p>
              <p className="mt-4 text-slate-400">
                The perfect plan if you're just getting started with our product.
              </p>
              <ul className="mt-6 space-y-3">
                {["25 products", "Up to 10,000 subscribers", "Advanced analytics", "24-hour support response time"].map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <Check className="h-5 w-5 shrink-0 text-indigo-400" />
                    <span className="text-slate-300">{f}</span>
                  </li>
                ))}
              </ul>
              <button className="mt-8 w-full rounded-lg bg-slate-700 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-600">
                Get started today
              </button>
            </div>
            {/* Enterprise */}
            <div className="relative rounded-2xl border border-indigo-500/50 bg-slate-800/80 bg-gradient-to-b from-indigo-950/40 to-transparent p-8 ring-1 ring-indigo-500/30">
              <h3 className="text-base font-semibold text-indigo-400">Enterprise</h3>
              <p className="mt-4">
                <span className="text-4xl font-bold text-white">$99</span>
                <span className="text-slate-400">/month</span>
              </p>
              <p className="mt-4 text-slate-400">
                Dedicated support and infrastructure for your company.
              </p>
              <ul className="mt-6 space-y-3">
                {["Unlimited products", "Unlimited subscribers", "Advanced analytics", "Dedicated support representative", "Marketing automations", "Custom integrations"].map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <Check className="h-5 w-5 shrink-0 text-indigo-400" />
                    <span className="text-slate-300">{f}</span>
                  </li>
                ))}
              </ul>
              <button className="mt-8 w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-500">
                Get started today
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing — Starter / Growth / Scale (3 plany) */}
      <section className="bg-slate-900 px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Pricing that grows with your team size
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-slate-400">
            Choose an affordable plan that's packed with the best features for engaging your audience, creating customer loyalty, and driving sales.
          </p>
          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {[
              { name: "Starter", desc: "Everything you need to get started.", price: 19 },
              { name: "Growth", desc: "All the extras for your growing team.", price: 49 },
              { name: "Scale", desc: "Added flexibility at scale.", price: 99 },
            ].map((plan) => (
              <div key={plan.name} className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-8">
                <h3 className="text-base font-semibold text-indigo-400">{plan.name}</h3>
                <p className="mt-2 text-slate-400">{plan.desc}</p>
                <p className="mt-4">
                  <span className="text-4xl font-bold text-white">${plan.price}</span>
                  <span className="text-slate-400"> USD per month</span>
                </p>
                <button className="mt-6 w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-500">
                  Start a free trial
                </button>
                <p className="mt-6 text-sm font-medium text-white">Start selling with:</p>
                <ul className="mt-3 space-y-2">
                  {["Custom domains", "Edge content delivery", "Advanced analytics", "Quarterly workshops", "Single sign-on (SSO)"].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-slate-400">
                      <span className="text-indigo-400">+</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing — Monthly/Annually toggle, Starter / Scale / Growth */}
      <section className="bg-slate-900 px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Pricing that grows with you
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-slate-400">
            Choose an affordable plan that's packed with the best features for engaging your audience, creating customer loyalty, and driving sales.
          </p>
          <div className="mt-8 flex justify-center">
            <div className="inline-flex rounded-full bg-slate-800 p-1">
              <button className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white">
                Monthly
              </button>
              <button className="rounded-full px-4 py-2 text-sm font-medium text-slate-400 hover:text-white">
                Annually
              </button>
            </div>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {[
              { name: "Starter", price: 19, features: ["Custom domains", "Edge content delivery", "Advanced analytics"], highlighted: false },
              { name: "Scale", price: 99, features: ["Custom domains", "Edge content delivery", "Advanced analytics", "Quarterly workshops", "Single sign-on (SSO)", "Priority phone support"], highlighted: true },
              { name: "Growth", price: 49, features: ["Custom domains", "Edge content delivery", "Advanced analytics", "Quarterly workshops"], highlighted: false },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl border p-8 ${
                  plan.highlighted
                    ? "border-indigo-500/50 bg-slate-800/80 ring-1 ring-indigo-500/30"
                    : "border-slate-700/50 bg-slate-800/50"
                }`}
              >
                <h3 className="text-base font-semibold text-indigo-400">{plan.name}</h3>
                <p className="mt-4">
                  <span className="text-4xl font-bold text-white">${plan.price}</span>
                  <span className="text-slate-400"> USD Billed monthly</span>
                </p>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3">
                      <Check className="h-5 w-5 shrink-0 text-indigo-400" />
                      <span className="text-slate-300">{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`mt-8 w-full rounded-lg px-4 py-3 text-sm font-semibold ${
                    plan.highlighted
                      ? "bg-indigo-600 text-white hover:bg-indigo-500"
                      : "bg-slate-700 text-white hover:bg-slate-600"
                  }`}
                >
                  Buy this plan
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing — Freelancer / Startup / Enterprise z „Most popular” */}
      <section className="bg-slate-900 px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <p className="text-center text-sm font-medium uppercase tracking-wide text-indigo-400">Pricing</p>
          <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Pricing that grows with you
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-slate-400">
            Choose an affordable plan that's packed with the best features for engaging your audience, creating customer loyalty, and driving sales.
          </p>
          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {/* Freelancer */}
            <div className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-8">
              <h3 className="text-base font-semibold text-indigo-400">Freelancer</h3>
              <p className="mt-2 text-slate-400">The essentials to provide your best work for clients.</p>
              <p className="mt-4">
                <span className="text-4xl font-bold text-white">$19</span>
                <span className="text-slate-400"> /month</span>
              </p>
              <ul className="mt-6 space-y-3">
                {["5 products", "Up to 1,000 subscribers", "Basic analytics", "48-hour support response time"].map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <Check className="h-5 w-5 shrink-0 text-indigo-400" />
                    <span className="text-slate-300">{f}</span>
                  </li>
                ))}
              </ul>
              <button className="mt-8 w-full rounded-lg border border-slate-600 bg-transparent px-4 py-3 text-sm font-semibold text-white hover:bg-slate-700">
                Buy plan
              </button>
            </div>
            {/* Startup — Most popular */}
            <div className="relative rounded-2xl border border-indigo-500/50 bg-slate-800/80 p-8 ring-1 ring-indigo-500/30">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-slate-600 px-3 py-1 text-xs font-medium text-white">
                Most popular
              </span>
              <h3 className="text-base font-semibold text-indigo-400">Startup</h3>
              <p className="mt-2 text-slate-400">A plan that scales with your rapidly growing business.</p>
              <p className="mt-4">
                <span className="text-4xl font-bold text-white">$49</span>
                <span className="text-slate-400"> /month</span>
              </p>
              <ul className="mt-6 space-y-3">
                {["25 products", "Up to 10,000 subscribers", "Advanced analytics", "24-hour support response time", "Marketing automations"].map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <Check className="h-5 w-5 shrink-0 text-indigo-400" />
                    <span className="text-slate-300">{f}</span>
                  </li>
                ))}
              </ul>
              <button className="mt-8 w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-500">
                Buy plan
              </button>
            </div>
            {/* Enterprise — Custom */}
            <div className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-8">
              <h3 className="text-base font-semibold text-indigo-400">Enterprise</h3>
              <p className="mt-2 text-slate-400">Dedicated support and infrastructure for your company.</p>
              <p className="mt-4 text-4xl font-bold text-white">Custom</p>
              <ul className="mt-6 space-y-3">
                {["Unlimited products", "Unlimited subscribers", "Advanced analytics", "1-hour, dedicated support response time", "Marketing automations", "Custom reporting tools"].map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <Check className="h-5 w-5 shrink-0 text-indigo-400" />
                    <span className="text-slate-300">{f}</span>
                  </li>
                ))}
              </ul>
              <button className="mt-8 w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-600">
                Contact sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Work with us — hero + statystyki */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950/30 to-slate-900 px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Work with us
          </h2>
          <p className="mt-6 max-w-2xl text-lg text-slate-400">
            Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat fugiat.
          </p>
          <div className="mt-8 flex flex-wrap gap-6">
            {["Open roles", "Internship program", "Our values", "Meet our leadership"].map((link) => (
              <Link key={link} href="#" className="inline-flex items-center font-medium text-indigo-400 hover:text-indigo-300">
                {link}
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            ))}
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { value: "12", label: "Offices worldwide" },
              { value: "300+", label: "Full-time colleagues" },
              { value: "40", label: "Hours per week" },
              { value: "Unlimited", label: "Paid time off" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="mt-1 text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support center — 3 karty glassmorphism */}
      <section className="bg-slate-900 px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Support center
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-slate-400">
            Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat fugiat.
          </p>
          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {[
              { icon: Phone, title: "Sales", desc: "Consectetur vel non. Rerum ut consequatur nobis unde. Enim est quo corrupti consequatur." },
              { icon: Globe, title: "Technical Support", desc: "Quod possimus sit modi rerum exercitationem quaerat atque tenetur ullam." },
              { icon: Video, title: "Media Inquiries", desc: "Ratione et porro eligendi est sed ratione rerum itaque. Placeat accusantium impedit eum odit." },
            ].map((card) => (
              <div key={card.title} className="rounded-2xl border border-slate-700/50 bg-slate-800/60 p-8 backdrop-blur-sm">
                <card.icon className="h-10 w-10 text-indigo-400" aria-hidden />
                <h3 className="mt-4 text-lg font-semibold text-white">{card.title}</h3>
                <p className="mt-2 text-slate-400">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our track record — obrazek + statystyki */}
      <section className="bg-slate-900 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800" />
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-amber-400">Our track record</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Trusted by thousands of creators worldwide
              </h2>
              <p className="mt-4 text-slate-400">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.
              </p>
              <div className="mt-12 grid grid-cols-2 gap-8">
                {[
                  { value: "8,000+", label: "Creators on the platform" },
                  { value: "3%", label: "Flat platform fee" },
                  { value: "99.9%", label: "Uptime guarantee" },
                  { value: "$70M", label: "Paid out to creators" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                    <p className="mt-1 text-slate-400">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats — A better workflow z 2 kolumnami */}
      <section className="bg-slate-900 px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-medium uppercase tracking-wide text-indigo-400">Deploy faster</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            A better workflow
          </h2>
          <div className="mt-6 grid gap-8 sm:grid-cols-2">
            <p className="text-slate-400">Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.</p>
            <p className="text-slate-400">Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat fugiat.</p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { value: "2021", label: "Founded" },
              { value: "37", label: "Employees" },
              { value: "12", label: "Countries" },
              { value: "$25M", label: "Raised" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="mt-1 text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact sales — formularz */}
      <section className="bg-slate-900 px-6 py-24">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Contact sales
          </h2>
          <p className="mt-4 text-slate-400">
            Aute magna irure deserunt veniam aliqua magna enim voluptate.
          </p>
          <form className="mt-8 space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <input type="text" placeholder="First name" className="rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
              <input type="text" placeholder="Last name" className="rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            </div>
            <input type="text" placeholder="Company" className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            <input type="email" placeholder="Email" className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            <input type="tel" placeholder="Phone number" className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            <textarea placeholder="Message" rows={4} className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            <label className="flex items-center gap-3">
              <input type="checkbox" className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-indigo-600 focus:ring-indigo-500" />
              <span className="text-slate-400">By selecting this, you agree to our <Link href="#" className="text-indigo-400 hover:text-indigo-300">privacy policy</Link>.</span>
            </label>
            <button type="submit" className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-500">
              Let's talk
            </button>
          </form>
        </div>
      </section>

      {/* Get in touch — kontakt + formularz 2 kolumny */}
      <section className="bg-slate-900 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Get in touch
              </h2>
              <p className="mt-4 text-slate-400">
                Proin volutpat consequat porttitor cras nullam gravida at. Orci molestie a eu arcu. Sed ut tincidunt integer elementum id sem. Arcu sed malesuada et magna.
              </p>
              <ul className="mt-8 space-y-4">
                <li className="flex items-center gap-3 text-slate-400">
                  <MapPin className="h-5 w-5 shrink-0 text-indigo-400" />
                  545 Mavis Island Chicago, IL 99191
                </li>
                <li className="flex items-center gap-3 text-slate-400">
                  <Phone className="h-5 w-5 shrink-0 text-indigo-400" />
                  +1 (555) 234-5678
                </li>
                <li className="flex items-center gap-3 text-slate-400">
                  <Mail className="h-5 w-5 shrink-0 text-indigo-400" />
                  hello@example.com
                </li>
              </ul>
            </div>
            <form className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <input type="text" placeholder="First name" className="rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-white placeholder-slate-500" />
                <input type="text" placeholder="Last name" className="rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-white placeholder-slate-500" />
              </div>
              <input type="email" placeholder="Email" className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-white placeholder-slate-500" />
              <input type="tel" placeholder="Phone number" className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-white placeholder-slate-500" />
              <textarea placeholder="Message" rows={4} className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-white placeholder-slate-500" />
              <div className="flex justify-end">
                <button type="submit" className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-500">
                  Send message
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Company values — misja + testimonial + statystyki */}
      <section className="bg-slate-900 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-medium uppercase tracking-wide text-indigo-400">Company values</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            On a mission to empower remote teams
          </h2>
          <div className="mt-6 grid gap-8 sm:grid-cols-2">
            <p className="text-slate-400">
              Faucibus commodo massa rhoncus, volutpat. Dignissim sed eget risus enim. Mattis mauris semper sed amet vitae sed turpis id. Id dolor praesent donec est.
            </p>
            <p className="text-slate-400">
              Et vitae blandit facilisi magna lacus commodo. Vitae sapien duis odio id et. Id blandit molestie auctor fermentum dignissim.
            </p>
          </div>
          <div className="mt-12 rounded-2xl border border-slate-700/50 bg-gradient-to-br from-indigo-950/40 to-slate-800 p-8">
            <Quote className="h-10 w-10 text-slate-600" />
            <blockquote className="mt-4 text-lg text-slate-300">
              Amet amet eget scelerisque tellus sit neque faucibus non eleifend. Integer eu praesent at a. Ornare arcu gravida natoque erat et cursus tortor.
            </blockquote>
            <footer className="mt-4 font-medium text-white">Judith Rogers, CEO at Workcation</footer>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { value: "2021", label: "Founded" },
              { value: "37", label: "Employees" },
              { value: "12", label: "Countries" },
              { value: "$25M", label: "Raised" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="mt-1 text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
          <Link href="#" className="mt-8 inline-flex items-center font-semibold text-indigo-400 hover:text-indigo-300">
            Learn more about our company
            <ChevronRight className="ml-1 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Info block */}
      <div className="bg-white py-12 text-center">
        <p className="text-sm text-stone-500">
          Strony demo · <Link href="/" className="text-beauty-rose hover:underline">Wróć na stronę główną</Link>
        </p>
      </div>
    </main>
  );
}
