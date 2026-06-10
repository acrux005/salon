/**
 * Buduje długi opis zabiegu (ok. 500–800 słów) na podstawie nazwy, opisu i problemów.
 * Używane w seedzie dla zabiegów bez wpisu w longDescriptions.ts.
 */
import type { ProblemId } from "../lib/skinmatch/schema";

const PROBLEM_LABELS: Record<ProblemId, string> = {
  tradzik: "trądzik",
  przebarwienia: "przebarwienia",
  anti_aging: "anti-aging i pierwsze oznaki starzenia",
  naczynka: "cera naczynkowa i rumień",
  sucha_skora: "sucha i odwodniona skóra",
  zmarszczki: "zmarszczki",
  jedrnost: "utrata jędrności",
  owal: "owal twarzy",
  brwi_rzesy: "brwi i rzęsy",
  makijaz: "makijaż",
  wlosy: "włosy",
  stopy: "stopy",
  masaze: "masaże",
  terapia_manualna: "terapia manualna",
  dzwiekoterapia: "dźwiękoterapia",
};

const PROBLEM_EFFECTS: Record<ProblemId, string> = {
  tradzik: "redukcja zaskórników i niedoskonałości, odświeżenie cery",
  przebarwienia: "wyrównanie kolorytu, rozjaśnienie i zdrowy wygląd skóry",
  anti_aging: "odżywienie, nawilżenie i spowolnienie widocznych oznak starzenia",
  naczynka: "łagodzenie rumienia i wzmocnienie ścian naczyń",
  sucha_skora: "intensywne nawilżenie i odbudowa bariery hydrolipidowej",
  zmarszczki: "wygładzenie zmarszczek i poprawa napięcia skóry",
  jedrnost: "ujędrnienie i poprawa gęstości skóry",
  owal: "lifting i podniesienie owalu twarzy",
  brwi_rzesy: "stylizacja, podkreślenie i uporządkowanie brwi lub rzęs",
  makijaz: "makijaż okolicznościowy, ślubny i sesyjny",
  wlosy: "pielęgnacja, stylizacja i koloryzacja włosów",
  stopy: "pielęgnacja i odświeżenie stóp",
  masaze: "relaks, rozluźnienie i poprawa krążenia",
  terapia_manualna: "terapia manualna i praca na tkankach",
  dzwiekoterapia: "relaks i wsparcie regeneracji",
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Zwraca true, jeśli zabieg dotyczy głównie brwi/rzes (stylizacja). */
function isBrowLashCategory(problemy: ProblemId[]): boolean {
  return problemy.length > 0 && problemy.every((p) => p === "brwi_rzesy");
}

/** Zwraca true, jeśli zabieg dotyczy stóp. */
function isFootCategory(problemy: ProblemId[]): boolean {
  return problemy.includes("stopy");
}

/** Zwraca true, jeśli zabieg dotyczy masaży / terapii manualnej. */
function isMassageCategory(problemy: ProblemId[]): boolean {
  return problemy.some((p) => p === "masaze" || p === "terapia_manualna" || p === "dzwiekoterapia");
}

/** Zwraca true, jeśli zabieg dotyczy włosów (fryzjerstwo, pielęgnacja). */
function isHairCategory(problemy: ProblemId[]): boolean {
  return problemy.includes("wlosy");
}

/** Długi opis HTML (ok. 500–800 słów) na podstawie danych zabiegu. */
export function buildLongDescription(t: {
  id: string;
  nazwa: string;
  opis: string;
  problemy: ProblemId[];
  czas: number;
  cena_od: number;
}): string {
  const nazwa = escapeHtml(t.nazwa);
  const opis = escapeHtml(t.opis);
  const problemy = t.problemy.length ? t.problemy : (["anti_aging"] as ProblemId[]);
  const labels = Array.from(new Set(problemy.map((p) => PROBLEM_LABELS[p])));
  const effects = Array.from(new Set(problemy.map((p) => PROBLEM_EFFECTS[p])));

  const sectionIntro = [
    `<h3>Na czym polega ${nazwa}?</h3>`,
    `<p>${opis}</p>`,
    `<p>Zabieg ${nazwa.toLowerCase()} jest wykonywany w profesjonalnych gabinetach kosmetycznych i salonach przez wykwalifikowane kosmetyczki lub stylistki. Czas trwania wynosi zwykle około ${t.czas} minut, a ceny zaczynają się od ${t.cena_od} zł – dokładny przebieg i koszt zależą od protokołu gabinetu oraz indywidualnych potrzeb. Przed pierwszą wizytą warto skonsultować się z wybranym salonem, upewnić się co do przeciwwskazań oraz ewentualnie zapytać o zalecaną serię zabiegów dla utrwalenia efektów.</p>`,
  ].join("\n");

  let sectionHow = "";
  if (isBrowLashCategory(problemy)) {
    sectionHow = [
      "<h3>Jak wygląda zabieg?</h3>",
      "<p>Zabiegi z zakresu brwi i rzęs wykonywane są w pozycji leżącej lub półleżącej, z zabezpieczeniem okolicy oczu. Stosowane są profesjonalne preparaty oraz sterylne lub jednorazowe narzędzia. Kosmetyczka lub stylistka dobiera technikę i intensywność do kształtu twarzy oraz oczekiwań klientki. Po zabiegu zwykle nie ma potrzeby rekonwalescencji – można od razu wrócić do codziennych aktywności, stosując się do zaleceń dotyczących pielęgnacji (np. unikanie moczenia przez kilka godzin).</p>",
    ].join("\n");
  } else if (isFootCategory(problemy)) {
    sectionHow = [
      "<h3>Jak wygląda zabieg?</h3>",
      "<p>Zabiegi na stopy obejmują zwykle kąpiel, zmiękczenie naskórka, usunięcie zrogowaceń oraz pielęgnację paznokci i skóry. Wykonywane są w komfortowej pozycji, z użyciem profesjonalnych preparatów i narzędzi. Regularne wizyty pozwalają utrzymać stopy w dobrej kondycji i zapobiec bolesnym pęknięciom czy odciskom.</p>",
    ].join("\n");
  } else if (isMassageCategory(problemy)) {
    sectionHow = [
      "<h3>Jak wygląda zabieg?</h3>",
      "<p>Zabieg łączy techniki masażu lub terapii manualnej z relaksem i dbałością o skórę. Przebieg zależy od wybranej metody – może obejmować pracę na mięśniach, stawach lub powięzi, a także aplikację olejków czy kremów. Często zaleca się serię spotkań, aby uzyskać trwały efekt rozluźnienia i poprawy samopoczucia.</p>",
    ].join("\n");
  } else if (isHairCategory(problemy)) {
    sectionHow = [
      "<h3>Jak wygląda zabieg?</h3>",
      "<p>Zabiegi na włosy – strzyżenie, koloryzacja, przedłużanie czy pielęgnacja – wykonywane są w salonie fryzjerskim przez wykwalifikowanego fryzjera lub stylistę. Przebieg zależy od rodzaju usługi: od szybkiego strzyżenia i modelowania po wieloetapową koloryzację lub zabiegi regeneracyjne. Stosowane są profesjonalne kosmetyki; czas i cena zależą od długości i gęstości włosów oraz wybranej techniki.</p>",
    ].join("\n");
  } else {
    sectionHow = [
      "<h3>Jak działa zabieg?</h3>",
      "<p>Zabieg oddziałuje na skórę i tkanki w sposób charakterystyczny dla danej metody – może łączyć oczyszczanie, złuszczanie, nawilżenie, odżywienie lub stymulację kolagenu. Składniki aktywne i technika dobierane są tak, aby wspierać naturalne procesy regeneracji i poprawiać wygląd oraz kondycję cery. Wielu klientów zauważa poprawę już po pierwszej wizycie; dla utrwalenia rezultatów gabinet może zaproponować serię zabiegów w regularnych odstępach.</p>",
    ].join("\n");
  }

  const sectionEffects = [
    "<h3>Jakie daje efekty?</h3>",
    effects.length > 0
      ? `<p>Zabieg jest szczególnie polecany przy następujących potrzebach: ${labels.join(", ")}. Można się po nim spodziewać m.in. takich efektów jak: ${effects.join("; ")}. Dokładny rezultat zależy od stanu skóry, prowadzonej na co dzień pielęgnacji oraz od tego, czy zabieg jest wykonywany jednorazowo, czy w ramach serii. Kosmetyczka po badaniu skóry doradzi optymalną częstotliwość wizyt.</p>`
      : "<p>Efekty obejmują poprawę kondycji skóry, odświeżenie i lepsze samopoczucie. Szczegóły warto omówić z kosmetyczką podczas konsultacji – dobierze ona częstotliwość i ewentualną serię zabiegów.</p>",
  ].join("\n");

  const sectionWho = [
    "<h3>Dla kogo jest przeznaczony?</h3>",
    "<p>Zabieg jest dopasowany do osób szukających wsparcia w zakresie pielęgnacji skóry, stylizacji brwi i rzęs lub innych usług oferowanych w gabinetach. Wskazania i przeciwwskazania mogą się nieznacznie różnić w zależności od metody i stosowanych produktów – np. w ciąży, przy skórze bardzo wrażliwej lub przy niektórych schorzeniach część zabiegów wymaga konsultacji z lekarzem lub przełożenia na inny termin. Przed umówieniem wizyty warto sprawdzić ofertę gabinetu, przeczytać opinie innych klientów i ewentualnie zadać pytania przez formularz lub telefon. W wielu salonach w regionie możesz umówić się na wizytę bezpośrednio przez portal.</p>",
  ].join("\n");

  return [sectionIntro, sectionHow, sectionEffects, sectionWho].join("\n\n");
}
