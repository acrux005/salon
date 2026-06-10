"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, ShoppingBag, User, ChevronDown, Sparkles, Calendar } from "lucide-react";

const STRONA_BASE = "/strona-gabinetu";

export function Header() {
  const pathname = usePathname() ?? "";
  const isStronaKosmetyczki = pathname === STRONA_BASE || pathname.startsWith(STRONA_BASE + "/");

  const navLinks = isStronaKosmetyczki ? (
    <>
      <Link href={`${STRONA_BASE}#nasze-zabiegi`} className="flex items-center gap-1 font-sans font-medium text-[15px] text-beauty-charcoal hover:text-beauty-pink-400 transition-colors">
        Zabiegi <ChevronDown className="w-4 h-4" />
      </Link>
      <Link href={`${STRONA_BASE}#przyklad-strony`} className="flex items-center gap-1 font-sans font-medium text-[15px] text-beauty-charcoal hover:text-beauty-pink-400 transition-colors">
        Oferta <ChevronDown className="w-4 h-4" />
      </Link>
      <Link href={`${STRONA_BASE}#o-mnie`} className="font-sans font-medium text-[15px] text-beauty-charcoal hover:text-beauty-pink-400 transition-colors">
        O mnie
      </Link>
    </>
  ) : (
    <>
      <Link href="/strona-gabinetu/zabiegi" className="flex items-center gap-1 font-sans font-medium text-[15px] text-beauty-charcoal hover:text-beauty-pink-400 transition-colors">
        Zabiegi <ChevronDown className="w-4 h-4" />
      </Link>
      <Link href="/strona-gabinetu/oferta" className="flex items-center gap-1 font-sans font-medium text-[15px] text-beauty-charcoal hover:text-beauty-pink-400 transition-colors">
        Oferta <ChevronDown className="w-4 h-4" />
      </Link>
      <Link href="/strona-gabinetu/bestsellery" className="font-sans font-medium text-[15px] text-beauty-charcoal hover:text-beauty-pink-400 transition-colors">
        Bestsellery
      </Link>
      <Link href="/strona-gabinetu/o-nas" className="font-sans font-medium text-[15px] text-beauty-charcoal hover:text-beauty-pink-400 transition-colors">
        O nas
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-beauty-pink-300/60 bg-white max-lg:backdrop-blur-none lg:bg-white/95 lg:backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-16 lg:h-20 flex items-center justify-between">
        <Link href={isStronaKosmetyczki ? STRONA_BASE : "/"} className="flex items-center gap-3 flex-shrink-0 group">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-beauty-hero group-hover:bg-beauty-pink-200 transition-colors">
            <Sparkles className="w-5 h-5 text-beauty-pink-400" />
          </div>
          <div>
            <span className="font-display font-normal text-lg block leading-tight text-beauty-charcoal">
              Gabinet
            </span>
            <span className="font-sans font-light text-xs block -mt-0.5 text-beauty-charcoal-muted">
              Odkryj swój blask
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {navLinks}
        </nav>

        <div className="flex items-center gap-3 sm:gap-4">
          {!isStronaKosmetyczki && (
            <div className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-full border border-beauty-pink-300 bg-white min-w-[140px] lg:min-w-[180px]">
              <Search className="w-4 h-4 text-beauty-charcoal-muted flex-shrink-0" />
              <input
                type="text"
                placeholder="Szukaj..."
                className="flex-1 bg-transparent text-sm text-beauty-charcoal placeholder:text-beauty-charcoal-muted outline-none"
              />
            </div>
          )}
          {isStronaKosmetyczki && (
            <Link
              href="/portal/gabinet/czar-centrum-mocy"
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-beauty-rose px-4 py-2.5 font-sans text-[14px] font-medium text-white hover:bg-beauty-pink-500 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              Rezerwuj
            </Link>
          )}
          {!isStronaKosmetyczki && (
            <a
              href="https://salon.odart.pl/panel-umawiania/"
              target="_blank"
              rel="noopener noreferrer"
              className="relative p-2.5 rounded-full hover:bg-beauty-hero/50 transition-colors"
            >
              <ShoppingBag className="w-5 h-5 text-beauty-charcoal" />
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-beauty-pink-400 text-white text-xs font-medium px-1">
                0
              </span>
            </a>
          )}
          <Link
            href="/panel/logowanie"
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-beauty-pink-300 flex-shrink-0 bg-beauty-pink-100 flex items-center justify-center hover:border-beauty-pink-400 transition-colors"
            aria-label="Konto"
          >
            <User className="w-5 h-5 text-beauty-charcoal" />
          </Link>
          <button className="lg:hidden p-2 rounded-full hover:bg-beauty-hero/50" aria-label="Menu">
            <Menu className="w-6 h-6 text-beauty-charcoal" />
          </button>
        </div>
      </div>
    </header>
  );
}
