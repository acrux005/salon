import Link from "next/link";
import { Sparkles } from "lucide-react";

const treatments = [
  {
    slug: "pielęgnacja-twarzy",
    name: "Pielęgnacja twarzy",
    description: "Oczyszczanie, nawilżanie, anti-aging",
    price: "od 120 zł",
  },
  {
    slug: "mikrodermabrazja",
    name: "Mikrodermabrazja",
    description: "Głębokie oczyszczenie i odświeżenie",
    price: "od 150 zł",
  },
  {
    slug: "masaż-twarzy",
    name: "Masaż twarzy",
    description: "Relaks i lifting manualny",
    price: "od 90 zł",
  },
];

export function Treatments() {
  return (
    <section className="py-16 lg:py-24 bg-beauty-cream">
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
          {treatments.map(({ slug, name, description, price }) => (
            <Link
              key={slug}
              href={`/zabiegi/${slug}`}
              className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-beauty-pink-200/50 hover:border-beauty-rose/50"
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-beauty-pink-100 to-beauty-pink-200 flex items-center justify-center">
                <Sparkles className="w-16 h-16 text-beauty-rose/50 group-hover:text-beauty-rose group-hover:scale-110 transition-all" />
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-lg text-beauty-charcoal group-hover:text-beauty-pink-500 transition-colors">
                  {name}
                </h3>
                <p className="text-sm text-beauty-charcoal/70 mt-2">
                  {description}
                </p>
                <p className="mt-4 text-beauty-pink-500 font-semibold">
                  {price}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/zabiegi"
            className="inline-flex items-center gap-2 px-8 py-3 bg-beauty-rose text-white rounded-full font-semibold hover:bg-beauty-pink-500 transition-colors"
          >
            Zobacz wszystkie zabiegi
          </Link>
        </div>
      </div>
    </section>
  );
}
