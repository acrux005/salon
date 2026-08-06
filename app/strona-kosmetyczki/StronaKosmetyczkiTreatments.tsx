import Image from "next/image";
import Link from "next/link";
import { getCatalogAsync } from "@/lib/skinmatch/treatmentsDb";
import type { Treatment } from "@/lib/skinmatch/schema";

/** Zdjęcia dopasowane do typu zabiegu (Unsplash). */
const MASAZ_LIMFATYCZNY_IMG =
  "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80";
const TREATMENT_IMAGES: Record<string, string> = {
  oczyszczanie_manualne:
    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80",
  mikrodermabrazja:
    "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&q=80",
  massaż_limfatyczny_twarz: MASAZ_LIMFATYCZNY_IMG,
  massaz_limfatyczny_twarz: MASAZ_LIMFATYCZNY_IMG,
  hydrafacial:
    "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&q=80",
  terapia_witamina_c:
    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80",
  maska_kolagenowa:
    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80",
};

const FEATURED_IDS = [
  "oczyszczanie_manualne",
  "mikrodermabrazja",
  "massaż_limfatyczny_twarz",
];

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80";

function getImageForTreatment(t: Treatment): string {
  const key = t.id.replace(/ż/g, "z").replace(/ń/g, "n");
  return TREATMENT_IMAGES[t.id] ?? TREATMENT_IMAGES[key] ?? DEFAULT_IMAGE;
}

export async function StronaKosmetyczkiTreatments() {
  const catalog = await getCatalogAsync();
  const treatments = FEATURED_IDS.map((id) =>
    catalog.find((t) => t.id === id)
  ).filter((t): t is Treatment => t != null);

  if (treatments.length === 0) return null;

  return (
    <section id="nasze-zabiegi" className="py-16 lg:py-24 bg-beauty-cream scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-beauty-charcoal mb-4">
            Nasze zabiegi
          </h2>
          <p className="text-beauty-charcoal/70 max-w-2xl mx-auto">
            Wybierz zabieg dopasowany do potrzeb Twojej skóry. Profesjonalna
            pielęgnacja w miłej atmosferze.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {treatments.map((t) => {
            const slug = t.id.replace(/_/g, "-");
            const imgSrc = getImageForTreatment(t);
            return (
              <Link
                key={t.id}
                href={`/portal/zabieg/${slug}`}
                className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-beauty-pink-200/50 hover:border-beauty-rose/50"
              >
                <div className="aspect-[4/3] relative bg-beauty-pink-100">
                  <Image
                    src={imgSrc}
                    alt={t.nazwa}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg text-beauty-charcoal group-hover:text-beauty-pink-500 transition-colors">
                    {t.nazwa}
                  </h3>
                  <p className="text-sm text-beauty-charcoal/70 mt-2">
                    {t.opis}
                  </p>
                  <p className="mt-4 text-beauty-pink-500 font-semibold">
                    od {t.cena_od} zł
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/portal/gabinety"
            className="inline-flex items-center gap-2 px-8 py-3 bg-beauty-rose text-white rounded-full font-semibold hover:bg-beauty-pink-500 transition-colors"
          >
            Zobacz wszystkie zabiegi
          </Link>
        </div>
      </div>
    </section>
  );
}
