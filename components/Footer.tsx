import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-beauty-charcoal text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-beauty-rose flex items-center justify-center">
                <span className="font-semibold text-lg">G</span>
              </div>
              <span className="font-semibold text-xl">Gabinet</span>
            </div>
            <p className="text-white/70 max-w-md">
              Profesjonalna pielęgnacja twarzy i ciała. Odkryj swój naturalny
              blask w miłej, kameralnej atmosferze.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Nawigacja</h4>
            <nav className="space-y-2">
              <Link href="/zabiegi" className="block text-white/70 hover:text-white transition-colors">
                Zabiegi
              </Link>
              <Link href="/cennik" className="block text-white/70 hover:text-white transition-colors">
                Cennik
              </Link>
              <Link href="/o-nas" className="block text-white/70 hover:text-white transition-colors">
                O nas
              </Link>
            </nav>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Kontakt</h4>
            <a href="mailto:biuro@odart.pl" className="block text-white/70 hover:text-white transition-colors">
              biuro@odart.pl
            </a>
            <a href="tel:+48695432415" className="block text-white/70 hover:text-white transition-colors mt-1">
              695 432 415
            </a>
            <Link
              href="/kontakt"
              className="inline-block mt-4 px-6 py-2 bg-beauty-rose rounded-full font-medium hover:bg-beauty-pink-500 transition-colors"
            >
              Kontakt
            </Link>
          </div>
        </div>
        <p className="mt-12 pt-8 border-t border-white/20 text-center text-white/70 text-sm max-w-2xl mx-auto">
          Serwis salon.odart.pl nie świadczy usług kosmetycznych i nie jest stroną umowy pomiędzy
          klientem a gabinetem.
        </p>
        <div className="mt-6 text-center text-white/50 text-sm">
          © {new Date().getFullYear()} Gabinet. Wszystkie prawa zastrzeżone.
          <Link href="/polityka-prywatnosci" className="ml-4 hover:text-white transition-colors">
            Polityka prywatności
          </Link>
          <Link href="/polityka-cookies" className="ml-4 hover:text-white transition-colors">
            Polityka cookies
          </Link>
          <Link href="/regulamin" className="ml-4 hover:text-white transition-colors">
            Regulamin
          </Link>
          <Link href="/regulamin-wspolpracy" className="ml-4 hover:text-white transition-colors">
            Regulamin współpracy
          </Link>
        </div>
      </div>
    </footer>
  );
}
