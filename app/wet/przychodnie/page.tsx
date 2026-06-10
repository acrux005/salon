import Link from "next/link";
import { getPublishedVetClinicsAsync } from "@/lib/vet/clinics";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Przychodnie weterynaryjne",
  description: "Lista przychodni z rezerwacją online w VetHarmonogram.",
};

export default async function WetClinicsListPage() {
  const clinics = await getPublishedVetClinicsAsync();
  const byCity = clinics.reduce<Record<string, typeof clinics>>((acc, c) => {
    if (!acc[c.city]) acc[c.city] = [];
    acc[c.city].push(c);
    return acc;
  }, {});

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-wet-navy">Przychodnie weterynaryjne</h1>
      <p className="mt-2 text-[15px] text-wet-navy-muted">
        Umów wizytę online lub zadzwoń do wybranej przychodni.
      </p>
      {clinics.length === 0 ? (
        <p className="mt-10 rounded-xl border border-wet-teal-200 bg-white p-6 text-wet-navy-muted">
          Wkrótce pojawią się pierwsze przychodnie.{" "}
          <Link href="/wet/register" className="font-medium text-wet-teal hover:underline">
            Zarejestruj swoją
          </Link>
          .
        </p>
      ) : (
        <div className="mt-10 space-y-10">
          {Object.entries(byCity)
            .sort(([a], [b]) => a.localeCompare(b, "pl"))
            .map(([city, list]) => (
              <section key={city}>
                <h2 className="text-lg font-semibold text-wet-teal-800">{city}</h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {list.map((c) => (
                    <li key={c.id}>
                      <Link
                        href={`/wet/przychodnia/${c.slug}`}
                        className="block rounded-xl border border-wet-teal-100 bg-white p-4 shadow-sm transition hover:border-wet-teal hover:shadow-md"
                      >
                        <p className="font-semibold text-wet-navy">{c.name}</p>
                        {c.address && (
                          <p className="mt-1 text-[14px] text-wet-navy-muted">{c.address}</p>
                        )}
                      </Link>
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
