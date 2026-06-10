import { BeautyHeroExact } from "@/components/BeautyHeroExact";

/**
 * Sample page showcasing BeautyHeroExact (pixel-perfect Figma match)
 */
export default function HeroExactPage() {
  return (
    <main className="min-h-screen">
      <BeautyHeroExact />
      <div className="max-w-7xl mx-auto px-6 py-12 text-center text-beauty-charcoal-muted">
        <p className="text-sm">BeautyHeroExact — pixel-perfect 1440×650 hero</p>
      </div>
    </main>
  );
}
