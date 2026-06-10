import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Zabiegi kosmetyczne w Polsce | Dobór terapii i gabinetu",
  description:
    "Dobierz zabieg do problemu skóry lub usługi, sprawdź gabinety w całej Polsce i umów wizytę online. Quiz, lista miast i rezerwacje w portalu Zabiegi Odart.",
  keywords: [
    "zabiegi kosmetyczne",
    "zabiegi na twarz",
    "anti-aging",
    "przebarwienia zabiegi",
    "trądzik zabiegi",
    "gabinet kosmetyczny",
    "portal zabiegów",
  ],
  alternates: {
    canonical: "https://salon.odart.pl/zabiegi",
  },
};

const treatmentGroups = [
  {
    name: "Zabiegi na trądzik i niedoskonałości",
    target: "Dla osób z aktywnymi zmianami, zaskórnikami i stanami zapalnymi.",
    effect: "Cel: wyciszenie skóry, regulacja sebum i ograniczenie nawrotów.",
  },
  {
    name: "Zabiegi na przebarwienia i nierówny koloryt",
    target: "Dla cery z plamami posłonecznymi, pozapalnymi i szarym kolorytem.",
    effect: "Cel: rozjaśnienie przebarwień i stopniowe wyrównanie koloru skóry.",
  },
  {
    name: "Zabiegi anti-aging i rewitalizacja",
    target: "Dla skóry odwodnionej, mniej jędrnej, z pierwszymi i utrwalonymi zmarszczkami.",
    effect: "Cel: poprawa napięcia, nawilżenia i jakości skóry w serii wizyt.",
  },
  {
    name: "Oczyszczanie i odświeżenie skóry",
    target: "Dla osób, które chcą bezpiecznie odświeżyć cerę i przygotować ją do dalszej terapii.",
    effect: "Cel: wygładzenie, redukcja zanieczyszczeń i poprawa komfortu skóry.",
  },
  {
    name: "Zabiegi pielęgnacyjne na ciało",
    target: "Dla osób, które chcą poprawić wygląd i kondycję skóry ciała.",
    effect: "Cel: wygładzenie, nawilżenie i wsparcie modelowania sylwetki.",
  },
  {
    name: "Usługi beauty i pielęgnacja regularna",
    target: "Dla osób szukających sprawdzonych usług codziennej pielęgnacji.",
    effect: "Cel: trwały efekt estetyczny i regularna opieka dopasowana do potrzeb.",
  },
];

const faqItems = [
  {
    question: "Jak dobrać zabieg do problemu skóry?",
    answer:
      "Najlepiej zacząć od krótkiej analizy potrzeb. Dzięki temu łatwiej wybrać terapię, która odpowiada na konkretny problem zamiast wybierać zabieg wyłącznie po nazwie.",
  },
  {
    question: "Ile zabiegów zwykle potrzeba, żeby zobaczyć efekt?",
    answer:
      "Wiele terapii wymaga serii wizyt, a nie jednego spotkania. Liczba zabiegów zależy od problemu, stanu skóry i pielęgnacji domowej.",
  },
  {
    question: "Czy można od razu zarezerwować wizytę online?",
    answer:
      "Tak. Po dopasowaniu usługi lub terapii możesz przejść do wyboru gabinetu i dostępnego terminu w systemie rezerwacji.",
  },
  {
    question: "Czy platforma działa tylko w jednym mieście?",
    answer:
      "Nie. Portal Zabiegi Odart obejmuje gabinety w całej Polsce — możesz wybrać miasto, zabieg i dostępny termin online.",
  },
];

export default function ZabiegiPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <section className="py-20 bg-gradient-to-br from-beauty-pink via-beauty-pink-100 to-beauty-cream">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-beauty-charcoal mb-5">
              Zabiegi kosmetyczne w Polsce — dobierz terapię do swojej skóry
            </h1>
            <p className="text-lg lg:text-xl text-beauty-charcoal/80 max-w-4xl">
              Szukasz skutecznego zabiegu na twarz lub ciało? Na tej stronie
              znajdziesz najczęściej wybierane kierunki terapii i usługi beauty.
              Zamiast przypadkowej listy zabiegów dostajesz dopasowanie do
              problemu skóry, celu i możliwości regularnych wizyt — z rezerwacją
              w wybranym mieście.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/portal/quiz"
                className="inline-flex items-center justify-center rounded-full bg-beauty-rose px-6 py-3 font-semibold text-white hover:bg-beauty-pink-500 transition-colors"
              >
                Rozpocznij analizę skóry
              </Link>
              <Link
                href="/portal/gabinety"
                className="inline-flex items-center justify-center rounded-full border border-beauty-rose px-6 py-3 font-semibold text-beauty-rose hover:bg-beauty-pink-100 transition-colors"
              >
                Zobacz gabinety
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-beauty-charcoal mb-4">
              Jak dobrać zabieg krok po kroku
            </h2>
            <div className="grid gap-5 md:grid-cols-3">
              <article className="rounded-2xl border border-beauty-pink-200/60 bg-beauty-cream p-6">
                <h3 className="font-semibold text-xl text-beauty-charcoal mb-2">
                  1. Określ problem lub cel
                </h3>
                <p className="text-beauty-charcoal/80">
                  Trądzik, przebarwienia, anti-aging czy pielęgnacja regularna -
                  punkt wyjścia wpływa na cały plan terapii.
                </p>
              </article>
              <article className="rounded-2xl border border-beauty-pink-200/60 bg-beauty-cream p-6">
                <h3 className="font-semibold text-xl text-beauty-charcoal mb-2">
                  2. Wybierz właściwy kierunek
                </h3>
                <p className="text-beauty-charcoal/80">
                  Dobór opiera się na praktyce gabinetów i realnych seriach
                  zabiegowych, a nie tylko na modnych nazwach.
                </p>
              </article>
              <article className="rounded-2xl border border-beauty-pink-200/60 bg-beauty-cream p-6">
                <h3 className="font-semibold text-xl text-beauty-charcoal mb-2">
                  3. Rezerwuj termin online
                </h3>
                <p className="text-beauty-charcoal/80">
                  Po dopasowaniu możesz od razu przejść do sprawdzonych gabinetów
                  i wybrać dogodny termin wizyty.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-20 bg-beauty-cream/60">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-beauty-charcoal mb-4">
              Najczęściej wyszukiwane rodzaje zabiegów
            </h2>
            <p className="text-beauty-charcoal/80 mb-8 max-w-4xl">
              Poniżej znajdziesz kategorie, które najczęściej wybierają osoby
              planujące zabiegi kosmetyczne w gabinecie — od twarzy po ciało.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {treatmentGroups.map(({ name, target, effect }) => (
                <article
                  key={name}
                  className="rounded-2xl border border-beauty-pink-200/60 bg-white p-6"
                >
                  <h3 className="font-semibold text-xl text-beauty-charcoal mb-3">
                    {name}
                  </h3>
                  <p className="text-beauty-charcoal/80 mb-2">{target}</p>
                  <p className="text-beauty-charcoal/75">{effect}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-beauty-charcoal mb-4">
              Zabiegi kosmetyczne — co warto wiedzieć przed wizytą
            </h2>
            <div className="space-y-4 text-beauty-charcoal/80 max-w-5xl">
              <p>
                Skuteczna terapia to proces. W praktyce oznacza to plan oparty na
                stanie skóry, regularności i pielęgnacji domowej. Dlatego przed
                rezerwacją warto określić, czy celem jest szybkie odświeżenie,
                czy dłuższa praca nad problemem.
              </p>
              <p>
                Na platformie Zabiegi Odart możesz porównać gabinety i wybrać
                miejsce dopasowane do Twojego celu - od pielęgnacji twarzy po
                terapie ukierunkowane na przebarwienia, trądzik i anti-aging.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-20 bg-beauty-cream/60">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-beauty-charcoal mb-6">
              FAQ - zabiegi i rezerwacja
            </h2>
            <div className="space-y-4">
              {faqItems.map(({ question, answer }) => (
                <article
                  key={question}
                  className="rounded-2xl border border-beauty-pink-200/60 bg-white p-6"
                >
                  <h3 className="font-semibold text-xl text-beauty-charcoal mb-2">
                    {question}
                  </h3>
                  <p className="text-beauty-charcoal/80">{answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-beauty-charcoal mb-4">
              Znajdź zabieg dopasowany do siebie
            </h2>
            <p className="text-beauty-charcoal/80 max-w-3xl mx-auto mb-8">
              Przejdź krótką analizę i otrzymaj propozycje, które mają sens dla
              Twojego celu oraz dostępnych gabinetów.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/portal/quiz"
                className="inline-flex items-center justify-center rounded-full bg-beauty-rose px-8 py-4 font-semibold text-white hover:bg-beauty-pink-500 transition-colors"
              >
                Rozpocznij analizę
              </Link>
              <Link
                href="/portal"
                className="inline-flex items-center justify-center rounded-full border border-beauty-rose px-8 py-4 font-semibold text-beauty-rose hover:bg-beauty-pink-100 transition-colors"
              >
                Przejdź do portalu
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
