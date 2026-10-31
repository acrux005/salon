import { headers } from "next/headers";
import { GabLink } from "@/components/gabinetPlatform/GabLink";
import { getPublishedGabClinicsAsync } from "@/lib/gabinet/clinics";
import { GAB_SHOWCASE_LANDINGS } from "@/lib/gabinet/showcaseLandings";
import { GABINET_VERTICALS, getGabinetVerticalFromHost } from "@/lib/gabinetPlatform/verticals";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const host = (await headers()).get("host") ?? "";
  const vertical = getGabinetVerticalFromHost(host);
  const cfg = GABINET_VERTICALS[vertical];
  return {
    title: cfg.clinicLabel,
    description: `Lista gabinetów z rezerwacją online — ${cfg.brandName}.`,
  };
}

export default async function GabClinicsListPage() {
  const host = (await headers()).get("host") ?? "";
  const vertical = getGabinetVerticalFromHost(host);
  const cfg = GABINET_VERTICALS[vertical];
  const clinics = await getPublishedGabClinicsAsync();
  const filtered = clinics.filter((c) => c.vertical === vertical || vertical === "general");
  const showcases =
    vertical === "dent" || vertical === "general" ? GAB_SHOWCASE_LANDINGS : [];
  const byCity = filtered.reduce<Record<string, typeof filtered>>((acc, c) => {
    if (!acc[c.city]) acc[c.city] = [];
    acc[c.city].push(c);
    return acc;
  }, {});
  const hasAny = filtered.length > 0 || showcases.length > 0;

  return (
    <main className="mx-auto min-w-0 max-w-6xl px-4 py-8 sm:py-12">
      <h1 className="text-pretty text-2xl font-bold text-gab-navy sm:text-3xl">{cfg.clinicLabel}</h1>
      <p className="mt-2 text-[15px] text-slate-600">
        Umów wizytę online lub zadzwoń do wybranego gabinetu — {cfg.brandName}.
      </p>
      {!hasAny ? (
        <p className="mt-10 rounded-xl border border-sky-200 bg-white p-6 text-slate-600">
          Wkrótce pojawią się pierwsze gabinety.{" "}
          <GabLink href="/register" className="font-medium text-gab-sky hover:underline">
            Zarejestruj swój gabinet
          </GabLink>
          .
        </p>
      ) : (
        <div className="mt-10 space-y-10">
          {showcases.length > 0 ? (
            <section>
              <h2 className="text-lg font-semibold text-sky-800">Kołobrzeg</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {showcases.map((c) => (
                  <li key={c.slug}>
                    <GabLink
                      href={`/gabinet/${c.slug}`}
                      className="block rounded-xl border border-sky-100 bg-white p-4 shadow-sm transition hover:border-gab-sky hover:shadow-md"
                    >
                      <p className="font-semibold text-gab-navy">{c.clinicName}</p>
                      <p className="mt-0.5 text-[14px] text-slate-600">
                        {c.doctorTitle} {c.doctorName}
                      </p>
                      <p className="mt-1 text-[14px] text-slate-500">{c.address}</p>
                      <p className="mt-2 text-[13px] font-medium text-gab-sky">{c.reviewCount} opinii</p>
                    </GabLink>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          {Object.entries(byCity)
            .sort(([a], [b]) => a.localeCompare(b, "pl"))
            .map(([city, list]) => (
              <section key={city}>
                <h2 className="text-lg font-semibold text-sky-800">{city}</h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {list.map((c) => (
                    <li key={c.id}>
                      <GabLink
                        href={`/gabinet/${c.slug}`}
                        className="block rounded-xl border border-sky-100 bg-white p-4 shadow-sm transition hover:border-gab-sky hover:shadow-md"
                      >
                        <p className="font-semibold text-gab-navy">{c.name}</p>
                        {c.address && <p className="mt-1 text-[14px] text-slate-500">{c.address}</p>}
                      </GabLink>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
        </div>
      )}
    </main>
  );
}
