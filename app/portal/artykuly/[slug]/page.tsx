import Link from "next/link";
import { notFound } from "next/navigation";
import { HeaderPortal } from "@/components/portal/HeaderPortal";
import { FooterPortal } from "@/components/portal/FooterPortal";
import { PORTAL_LOCALE } from "@/content/portalLocale";

const SITE_URL = "https://salon.odart.pl";

// ─── Typy ────────────────────────────────────────────────────────────────────

type Section = {
  h2: string;
  content: string; // HTML
};

type FaqItem = {
  q: string;
  a: string;
};

type Article = {
  title: string;
  headline: string;        // H1 (może być dłuższy niż title)
  excerpt: string;         // description meta
  keywords: string[];
  readingTime: number;     // min
  datePublished: string;   // ISO
  dateModified: string;
  sections: Section[];
  relatedSlugs: string[];
  ctaText?: string;
  ctaHref?: string;
  faq?: FaqItem[];
};

// ─── Treści artykułów ─────────────────────────────────────────────────────────

const ARTICLES: Record<string, Article> = {

  "przygotowanie-skory": {
    title: "Jak przygotować skórę do zabiegu kosmetycznego?",
    headline: "Jak przygotować skórę do zabiegu? Kompletny poradnik krok po kroku",
    excerpt:
      "Dowiedz się, jak przygotować skórę do zabiegu kosmetycznego — co robić na 7 dni, 1 dzień i w dniu wizyty. Unikaj błędów, które mogą zmniejszyć efekty terapii lub wywołać podrażnienia.",
    keywords: [
      "przygotowanie skóry do zabiegu",
      "jak przygotować się do zabiegu kosmetycznego",
      "co robić przed zabiegiem kosmetycznym",
      "pielęgnacja przed zabiegiem",
      `gabinet kosmetyczny ${PORTAL_LOCALE.region}`,
    ],
    readingTime: 6,
    datePublished: "2026-01-10",
    dateModified: "2026-02-18",
    relatedSlugs: ["tradzik-doroslych", "przebarwienia-plan", "anti-aging-dom"],
    ctaText: "Umów wizytę w gabinecie",
    ctaHref: "/portal/gabinety",
    sections: [
      {
        h2: "Dlaczego przygotowanie przed zabiegiem ma znaczenie?",
        content: `
          <p>Wiele osób idzie na zabieg spontanicznie, nie wiedząc, że kilka prostych zasad potrafi
          znacząco wpłynąć na efekt i bezpieczeństwo terapii. Skóra odpowiednio przygotowana
          łatwiej przyjmuje składniki aktywne, szybciej się regeneruje i rzadziej reaguje
          podrażnieniami lub alergią.</p>
          <p>Odwrotnie — skóra opalona, po agresywnym peelingu lub depilacji jest bardziej
          wrażliwa, co może prowadzić do przebarwień pozabiegowych, a nawet blizn.
          Poniżej znajdziesz kompletną listę zasad podzieloną według czasu przed wizytą.</p>
        `,
      },
      {
        h2: "7–14 dni przed zabiegiem — pierwsze przygotowania",
        content: `
          <h3>Ogranicz ekspozycję na słońce i solarium</h3>
          <p>Skóra opalone lub z aktywnym rumieniem reaguje silniej na większość zabiegów
          — peelingi, laserowe, mezoterapię. Przez co najmniej tydzień przed wizytą unikaj
          intensywnego słońca i solarium. Jeśli musisz wychodzić na zewnątrz, stosuj
          krem z filtrem SPF 30–50.</p>

          <h3>Odczekaj po zabiegach iniekcyjnych i laserowych</h3>
          <p>Jeżeli niedawno miałaś/miałeś botoks, kwas hialuronowy lub laser frakcyjny —
          poinformuj kosmetyczkę. Wiele zabiegów wymaga odstępu 2–4 tygodni, a niektóre
          nawet dłuższego.</p>

          <h3>Zrób nawilżający reset pielęgnacji</h3>
          <p>Jeśli stosujesz agresywne produkty (retinoidy, wysokie stężenia kwasów AHA/BHA,
          witamina C &gt;15%), skonsultuj z kosmetyczką, czy je odstawić. Nawilżona
          i niepodrażniona skóra lepiej reaguje na zabiegi.</p>
        `,
      },
      {
        h2: "3–5 dni przed zabiegiem — czego unikać?",
        content: `
          <h3>Peelingi mechaniczne i chemiczne</h3>
          <p>Ziarniste scruby, szczoteczki sonikowe i domowe peelingi kwasowe w tym czasie
          to błąd. Ścierają warstwę rogową naskórka, przez co skóra staje się bardziej
          reaktywna i podatna na podrażnienia podczas właściwego zabiegu.</p>

          <h3>Depilacja i golenie w obszarze zabiegu</h3>
          <p>Golenie i woskowanie powodują mikrouszkodzenia, które utrudniają wiele procedur.
          Jeśli musisz usunąć owłosienie — zrób to najwcześniej 3–4 dni przed wizytą
          lub zapytaj kosmetyczkę o indywidualne wskazówki.</p>

          <h3>Alkohol etylowy w kosmetykach</h3>
          <p>Toniki, spraye i niektóre żele żelujące z alkoholem denaturowanym silnie wysuszają
          skóra. Ogranicz je lub zastąp łagodniejszymi odpowiednikami.</p>

          <h3>Intensywny wysiłek fizyczny dzień przed</h3>
          <p>Intensywny trening podnosi temperaturę ciała i pobudza krążenie — to może
          nasilać rumień po niektórych zabiegach. Dzień lub dwa przed wizytą warto zwolnić
          tempo.</p>
        `,
      },
      {
        h2: "1 dzień przed zabiegiem — jak dbać o skórę?",
        content: `
          <p>Dnia poprzedzającego wizytę skup się na trzech rzeczach:</p>
          <ol style="margin:12px 0 12px 20px;list-style:decimal;line-height:1.8;font-size:15px;color:#4a3f42;">
            <li><strong>Delikatne oczyszczenie</strong> — łagodny żel lub micelary, bez tarcia gąbeczką.</li>
            <li><strong>Intensywne nawilżenie</strong> — krem lub serum z kwasem hialuronowym lub aloesem;
            nawilżona skóra lepiej toleruje zabiegi.</li>
            <li><strong>Brak nowych produktów</strong> — nie testuj żadnego nowego kosmetyku
            dzień przed wizytą; reakcja alergiczna w tym momencie może pokrzyżować
            plany.</li>
          </ol>
          <p>Jeżeli masz skórę wrażliwą lub naczynkową — wieczorem nałóż łagodny krem
          kojący (np. z centellą azjatycką lub aveną) i nie aplikuj niczego silnie aktywnego.</p>
        `,
      },
      {
        h2: "W dniu zabiegu — najważniejsze zasady",
        content: `
          <h3>Makijaż i produkty do stylizacji</h3>
          <p>Na twarz — bez podkładu, korektora i pudru. Lekki krem nawilżający jest
          zazwyczaj w porządku, ale zapytaj kosmetyczkę z wyprzedzeniem. Na zabiegi
          okolic oczu lub ust — bez tuszu do rzęs, eyelinera i pomadki.</p>

          <h3>Dieta i nawodnienie</h3>
          <p>Dobrze nawodniony organizm to lepsze ukrwienie skóry i sprawniejsza regeneracja.
          Wypij rano szklankę wody; unikaj kawy tuż przed zabiegami naczyniowymi
          (poszerza naczynia, co może komplikować niektóre zabiegi laserowe).</p>

          <h3>Wywiad kosmetyczny — nie pomijaj go</h3>
          <p>Dobra kosmetyczka zawsze przeprowadza wywiad przed zabiegiem. Powiedz jej o:</p>
          <ul style="margin:8px 0 12px 20px;list-style:disc;line-height:1.8;font-size:15px;color:#4a3f42;">
            <li>lekach (szczególnie Accutane/izotretynoina, leki rozrzedzające krew),</li>
            <li>ciąży lub karmieniu piersią,</li>
            <li>aktywnych zmianach chorobowych (opryszczka, egzema, łuszczyca),</li>
            <li>poprzednich zabiegach iniekcyjnych lub laserowych,</li>
            <li>alergiach kontaktowych.</li>
          </ul>
          <p>Te informacje chronią Cię przed powikłaniami i pozwalają dobrać technikę
          zabiegową odpowiednią do Twojego stanu skóry.</p>
        `,
      },
      {
        h2: "Po zabiegu — kilka słów o pielęgnacji pozabiegowej",
        content: `
          <p>Przygotowanie to połowa sukcesu — drugą jest właściwa pielęgnacja po zabiegu.
          Ogólne zasady po większości procedur:</p>
          <ul style="margin:8px 0 12px 20px;list-style:disc;line-height:1.8;font-size:15px;color:#4a3f42;">
            <li><strong>SPF zawsze</strong> — skóra po zabiegu jest bardziej wrażliwa na promieniowanie UV;
            filtr SPF 30–50 każdego ranka to podstawa.</li>
            <li><strong>Łagodne oczyszczanie</strong> przez 48–72 h po zabiegu.</li>
            <li><strong>Brak sauny, basenu, jacuzzi</strong> przez min. 48 h (ryzyko infekcji, przekrwień).</li>
            <li><strong>Nie dotykaj i nie wyciskaj</strong> ewentualnych zmian pozabiegowych.</li>
          </ul>
          <p>Szczegółowe wskazówki pozabiegowe zawsze przekazuje kosmetyczka — stosuj się
          do jej zaleceń, nawet jeśli skóra wydaje się "w porządku" wcześniej niż
          przewidywany czas regeneracji.</p>
        `,
      },
      {
        h2: `Gdzie zrobić zabieg w ${PORTAL_LOCALE.regionIn}?`,
        content: `
          <p>Jeśli szukasz sprawdzonego gabinetu kosmetycznego w ${PORTAL_LOCALE.regionIn}
          i okolicach, Zabiegi Odart dopasuje Cię do miejsc, które specjalizują się
          dokładnie w tym, czego potrzebujesz — na podstawie Twojego problemu skóry
          lub wybranej usługi.</p>
          <p>Nie przeglądasz katalogu — dostajesz konkretne dopasowanie.</p>
        `,
      },
    ],
  },

  "tradzik-doroslych": {
    title: "Trądzik dorosłych: co działa, a co szkodzi?",
    headline: "Trądzik dorosłych — przyczyny, skuteczne metody i błędy, których unikać",
    excerpt:
      "Trądzik u dorosłych po 25. roku życia ma zwykle podłoże hormonalne lub stresowe — i rządzi się innymi prawami niż nastoletni. Dowiedz się, co naprawdę działa, jakich błędów unikać i kiedy zamiast kremu potrzebny jest gabinet.",
    keywords: [
      "trądzik dorosłych",
      "trądzik hormonalny",
      "jak leczyć trądzik dorosłych",
      "zabiegi na trądzik",
      "pielęgnacja cery trądzikowej",
      "trądzik po 30",
      `kosmetyczka trądzik ${PORTAL_LOCALE.region}`,
    ],
    readingTime: 8,
    datePublished: "2026-01-15",
    dateModified: "2026-02-18",
    relatedSlugs: ["przygotowanie-skory", "przebarwienia-plan", "anti-aging-dom"],
    ctaText: "Znajdź gabinet specjalizujący się w trądziku",
    ctaHref: "/portal/gabinety",
    faq: [
      {
        q: "Czy trądzik dorosłych można wyleczyć samymi kosmetykami?",
        a: "W łagodnych przypadkach odpowiednia rutyna pielęgnacyjna (niacynamid, kwas azelainowy, delikatne peelingi) może wyraźnie poprawić stan skóry. Przy trądziku hormonalnym lub umiarkowanym najlepsze efekty daje połączenie domowej pielęgnacji z serią zabiegów w gabinecie. W cięższych przypadkach konieczna jest konsultacja dermatologiczna.",
      },
      {
        q: "Jak długo trwa terapia trądziku dorosłych?",
        a: "Pierwsze efekty widać po 6–8 tygodniach stosowania odpowiedniej rutyny. Pełna poprawa — w przypadku serii zabiegów gabinetowych — następuje zazwyczaj po 3–6 miesiącach. Skóra potrzebuje czasu na regenerację i regulację łojotoku.",
      },
      {
        q: "Czy wyciskanie pryszczy przyspieszy efekty?",
        a: "Wręcz przeciwnie — wyciskanie niszczy tkankę, wprowadza bakterie w głąb skóry i prowadzi do trwałych przebarwień pozapalnych oraz blizn. To jeden z najczęstszych błędów, który przedłuża leczenie o kilka miesięcy.",
      },
      {
        q: "Kiedy trądzik dorosłych wymaga wizyty u dermatologa?",
        a: "Do dermatologa warto się udać, gdy zmiany są głębokie (guzki, torbiele), gdy nie reagują na 3-miesięczną pielęgnację domową, lub gdy podejrzewasz podłoże hormonalne (PCOS, niedoczynność tarczycy). Dermatolog może zlecić leczenie farmakologiczne, które kosmetyczka dopełni zabiegami.",
      },
    ],
    sections: [
      {
        h2: "Czym trądzik dorosłych różni się od nastoletniego?",
        content: `
          <p>Trądzik nastolatków to w dużej mierze efekt gwałtownego wzrostu produkcji sebum
          podczas dojrzewania — zmiany pojawiają się na czole, nosie i brodzie (strefa T)
          i zazwyczaj ustępują po kilku latach.</p>
          <p>Trądzik u dorosłych (po 25. roku życia) rządzi się innymi prawami:</p>
          <ul style="margin:10px 0 10px 22px;list-style:disc;line-height:1.9;font-size:15px;color:#4a3f42;">
            <li>Zmiany skupiają się głównie na <strong>żuchwie, brodzie, szyi i policzkach</strong>.</li>
            <li>Skóra bywa jednocześnie <strong>tłusta w strefie T i sucha na policzkach</strong> (cera mieszana trądzikowa).</li>
            <li>Częściej towarzyszą mu <strong>bolesne, głębokie krosty</strong> zamiast powierzchniowych zaskórników.</li>
            <li>Nawroty są typowe — szczególnie przed menstruacją lub w okresach silnego stresu.</li>
          </ul>
          <p>To oznacza, że produkty i metody sprawdzone na nastoletnim trądziku często
          <strong>nie działają lub nasilają problem</strong> u dorosłych — stąd tak wiele
          frustracji.</p>
        `,
      },
      {
        h2: "Najczęstsze przyczyny trądziku u dorosłych",
        content: `
          <h3>Wahania hormonalne</h3>
          <p>To numer jeden. Androgeny stymulują gruczoły łojowe do nadprodukcji sebum.
          U kobiet zmiany nasilają się przed menstruacją, w czasie ciąży, po odstawieniu
          antykoncepcji hormonalnej lub przy zaburzeniach takich jak PCOS czy niedoczynność
          tarczycy. Jeśli trądzik wyraźnie koreluje z cyklem — warto zbadać gospodarkę
          hormonalną.</p>

          <h3>Przewlekły stres</h3>
          <p>Kortyzol (hormon stresu) pośrednio pobudza produkcję sebum i nasila stan zapalny
          w skórze. Osoby z wyczerpanym nadnerczem i przewlekłym stresem często obserwują
          wyraźne pogorszenie trądziku nawet bez zmian w pielęgnacji.</p>

          <h3>Błędy pielęgnacyjne</h3>
          <p>Paradoksalnie — zbyt agresywna pielęgnacja (wielokrotne mycie, silne toniki
          z alkoholem, peeling mechaniczny co kilka dni) niszczy barierę ochronną skóry.
          W odpowiedzi skóra produkuje więcej sebum jako mechanizm obronny, a podrażniony
          naskórek łatwiej ulega infekcji bakteryjnej.</p>

          <h3>Dieta i styl życia</h3>
          <p>Produkty o wysokim indeksie glikemicznym (cukier, biała mąka, słodzone napoje),
          nabiał (szczególnie mleko odtłuszczone) i niedobory cynku oraz omega-3 mogą
          nasilać trądzik. Brak snu i odwodnienie osłabiają regenerację skóry.</p>

          <h3>Komedogenne składniki w kosmetykach</h3>
          <p>Olej kokosowy, masło shea, laurynian izopropylu i niektóre silikony mogą
          zatykać ujścia gruczołów łojowych u osób predysponowanych. Szczególnie
          podstępne są produkty „naturalne" reklamowane jako odpowiednie dla każdej skóry.</p>
        `,
      },
      {
        h2: "Co naprawdę działa na trądzik dorosłych?",
        content: `
          <h3>1. Łagodne, dwufazowe oczyszczanie</h3>
          <p>Wieczorem: najpierw <strong>olejek lub balsam myjący</strong> (rozpuszcza sebum
          i makijaż), następnie <strong>żel myjący o pH 4,5–5,5</strong> bez detergentów
          laurylowych (SLS, SLES). Rano wystarczy sama woda lub delikatna pianka.</p>
          <p>Cel: usunąć zanieczyszczenia bez naruszania bariery hydrolipidowej.</p>

          <h3>2. Składniki aktywne regulujące łojotok</h3>
          <ul style="margin:8px 0 12px 22px;list-style:disc;line-height:1.9;font-size:15px;color:#4a3f42;">
            <li><strong>Niacynamid 4–5%</strong> — reguluje sebum, zwęża pory, działa
            przeciwzapalnie i rozjaśnia przebarwienia pozapalne.</li>
            <li><strong>Kwas azelainowy 10–20%</strong> — przeciwbakteryjny, przeciwzapalny,
            hamuje melaninę (dobry przy przebarwieniach). Bezpieczny w ciąży.</li>
            <li><strong>Cynk (PCA cynku, octan cynku)</strong> — działa antybakteryjnie
            i zmniejsza stan zapalny.</li>
            <li><strong>Kwas salicylowy (BHA) 0,5–2%</strong> — rozkurczowy, oczyszcza
            pory, hamuje namnażanie <em>Cutibacterium acnes</em>. Stosować wieczorem,
            maks. 3–4 razy w tygodniu.</li>
            <li><strong>Adapalen (Differin)</strong> — retinoida dostępna bez recepty,
            zapobiega powstawaniu zaskórników i stanów zapalnych. Wprowadzaj stopniowo.</li>
          </ul>

          <h3>3. Nawilżenie — niezbędne nawet przy tłustej skórze</h3>
          <p>Lekki żel lub emulsja z <strong>kwasem hialuronowym, aloesem lub niacynamidem</strong>
          uzupełniona filtrem SPF 30–50 (non-comedogenic) rano. Nawilżona skóra rzadziej
          produkuje nadmiar sebum jako kompensację.</p>

          <h3>4. Zabiegi profesjonalne w gabinecie</h3>
          <p>Domowa pielęgnacja ma swoje limity — gabinet dociera tam, gdzie kosmetyki nie mogą.
          Najskuteczniejsze zabiegi przy trądziku dorosłych:</p>
          <ul style="margin:8px 0 12px 22px;list-style:disc;line-height:1.9;font-size:15px;color:#4a3f42;">
            <li><strong>Peelingi chemiczne (AHA/BHA/TCA)</strong> — złuszczają martwy naskórek,
            odblokowują pory, zmniejszają stany zapalne. Seria 4–6 zabiegów co 2–3 tygodnie.</li>
            <li><strong>Oczyszczanie ultradźwiękowe i próżniowe</strong> — mechaniczne usunięcie
            zaskórników bez traumy dla skóry.</li>
            <li><strong>Terapia LED (światło niebieskie)</strong> — zabija bakterię
            <em>C. acnes</em>, redukuje stan zapalny bez efektów ubocznych.
            Świetna jako uzupełnienie serii.</li>
            <li><strong>Mezoterapia regulująca sebum</strong> — koktajle z niacynamidem,
            cynkiem i kwasem hialuronowym wstrzykiwane śródskórnie; efekty widoczne
            po 2–3 wizytach.</li>
            <li><strong>Mikronakłuwanie (dermapen)</strong> — stymuluje przebudowę skóry,
            zmniejsza blizny i przebarwienia pozapalne.</li>
          </ul>
        `,
      },
      {
        h2: "Czego bezwzględnie unikać?",
        content: `
          <ul style="margin:8px 0 16px 22px;list-style:disc;line-height:1.9;font-size:15px;color:#4a3f42;">
            <li><strong>Wyciskania zmian</strong> — prowadzi do blizn i głębszych przebarwień
            pozapalnych, które leczy się znacznie trudniej niż sam trądzik.</li>
            <li><strong>Agresywnych scrubów i szczoteczek sonikowych</strong> na aktywnych
            zmianach — mechaniczne tarcie napędza stan zapalny.</li>
            <li><strong>Zmieniania rutyny częściej niż co 8 tygodni</strong> — skóra
            potrzebuje czasu; zbyt częste eksperymenty uniemożliwiają ocenę efektów.</li>
            <li><strong>Alkoholu denaturowanego w tonikach</strong> — wysusza, niszczy barierę,
            skóra kompensuje nadprodukcją sebum.</li>
            <li><strong>Grubych, komedogennych kremów</strong> — olej kokosowy, masło shea,
            wazelina przy cerze trądzikowej to błąd.</li>
            <li><strong>Testowania wielu nowych produktów jednocześnie</strong> — przy reakcji
            nie wiesz, który produkt jest winny.</li>
          </ul>
        `,
      },
      {
        h2: "Kosmetyczka czy dermatolog — kogo wybrać?",
        content: `
          <p>To pytanie, które wiele osób zadaje za późno. Ogólna zasada:</p>
          <ul style="margin:10px 0 12px 22px;list-style:disc;line-height:1.9;font-size:15px;color:#4a3f42;">
            <li><strong>Kosmetyczka</strong> — zabiegi gabinetowe, pielęgnacja, korekta rutyny domowej,
            praca z przebarwieniami i zaskórnikami, lekki i umiarkowany trądzik.</li>
            <li><strong>Dermatolog</strong> — trądzik głęboki (guzki, torbiele), brak poprawy
            po 3 miesiącach pielęgnacji, podejrzenie podłoża hormonalnego, decyzja
            o leczeniu farmakologicznym (antybiotyki, izotretynoina).</li>
          </ul>
          <p>Najlepsze efekty daje <strong>współpraca</strong>: dermatolog ustala leczenie
          farmakologiczne, a kosmetyczka dopełnia je zabiegami i odpowiednią pielęgnacją.
          To nie jest wybór albo/albo — to dwa poziomy tej samej terapii.</p>
        `,
      },
      {
        h2: "Jak wygląda skuteczna rutyna przy trądziku dorosłych?",
        content: `
          <h3>Rano</h3>
          <ol style="margin:8px 0 12px 22px;list-style:decimal;line-height:1.9;font-size:15px;color:#4a3f42;">
            <li>Delikatne mycie wodą lub pianką myjącą (pH 5).</li>
            <li>Tonik bez alkoholu (np. z niacynamidem lub aloesem).</li>
            <li>Serum z niacynamidem lub kwasem azelainowym.</li>
            <li>Lekki krem nawilżający (non-comedogenic).</li>
            <li><strong>SPF 30–50</strong> — obowiązkowo, chroni przed przebarwieniami
            pozapalnymi i spowalnia fotostarzenie.</li>
          </ol>
          <h3>Wieczorem</h3>
          <ol style="margin:8px 0 12px 22px;list-style:decimal;line-height:1.9;font-size:15px;color:#4a3f42;">
            <li>Double cleansing (olejek → żel myjący).</li>
            <li>Tonik regulujący (BHA 1–2% lub niacynamid), 3–4 razy w tygodniu.</li>
            <li>Adapalen lub retinoida (na przemian z kwasem azelainowym).</li>
            <li>Lekkie nawilżenie (żel z HA lub aloes).</li>
          </ol>
          <p style="font-size:13px;color:#888;margin-top:8px;">
            Uwaga: retinoidy i kwas salicylowy wprowadzaj stopniowo (2–3 razy w tygodniu
            na start), by nie przeciążyć skóry.
          </p>
        `,
      },
      {
        h2: `Zabiegi na trądzik dorosłych w ${PORTAL_LOCALE.regionIn}`,
        content: `
          <p>Jeśli szukasz gabinetu kosmetycznego w ${PORTAL_LOCALE.regionIn}
          specjalizującego się w terapii trądziku, Zabiegi Odart dopasuje Cię do miejsc
          z odpowiednim doświadczeniem — na podstawie Twojego problemu skóry
          i oczekiwanych efektów. Nie przeglądasz katalogu — dostajesz konkretne
          dopasowanie do gabinetu, który zna Twój typ trądziku.</p>
        `,
      },
    ],
  },

  "przebarwienia-plan": {
    title: "Przebarwienia: od czego zacząć dobór pielęgnacji i zabiegów?",
    headline: "Przebarwienia skóry — od czego zacząć dobór pielęgnacji i zabiegów",
    excerpt:
      "Plamy słoneczne, przebarwienia pozapalne i melasma wymagają różnego podejścia. Sprawdź, od czego zacząć: diagnoza, bezpieczna pielęgnacja z SPF i kiedy warto omówić zabiegi w gabinecie.",
    keywords: [
      "przebarwienia skóry",
      "jak usunąć przebarwienia",
      "terapia przebarwień",
      "peeling na przebarwienia",
      "melasma leczenie",
      "przebarwienia pozapalne",
      "zabiegi rozjaśniające",
      `zabiegi na przebarwienia ${PORTAL_LOCALE.region}`,
    ],
    readingTime: 9,
    datePublished: "2026-01-20",
    dateModified: "2026-02-18",
    relatedSlugs: ["przygotowanie-skory", "tradzik-doroslych", "anti-aging-dom"],
    ctaText: "Znajdź gabinet specjalizujący się w przebarwieniach",
    ctaHref: "/portal/gabinety",
    faq: [
      {
        q: "Czy przebarwienia skóry można usunąć w domu bez wizyty w gabinecie?",
        a: "Płytkie przebarwienia słoneczne (naskórkowe) można wyraźnie rozjaśnić regularnym stosowaniem serum z witaminą C, arbutyną lub kwasem traneksamowym połączonym z SPF 50. Głębsze zmiany — przebarwienia hormonalne (melasma) i pozapalne — wymagają zabiegów gabinetowych (peelingi chemiczne, IPL, laser), ponieważ składniki aktywne w kosmetykach nie docierają do skóry właściwej.",
      },
      {
        q: "Jak długo trwa usuwanie przebarwień?",
        a: "Przy płytkich przebarwieniach pierwsze efekty widać po 4–6 tygodniach regularnej pielęgnacji i serii zabiegów. Melasma i głębokie przebarwienia hormonalne to proces 3–6-miesięczny wymagający ścisłej ochrony UV przez cały czas terapii — bez SPF efekty zanikają w ciągu kilku tygodni.",
      },
      {
        q: "Czy SPF jest naprawdę konieczny przy leczeniu przebarwień?",
        a: "Tak — to warunek sine qua non. Promieniowanie UV stymuluje melanocyty do produkcji melaniny i w ciągu jednego dnia może zniszczyć tygodniowe efekty zabiegu. Filtr SPF 30–50 rano (nanoszony ponownie co 2–3 h przy ekspozycji na słońce) jest integralną częścią każdego protokołu terapii przebarwień.",
      },
      {
        q: "Czym różni się melasma od zwykłych przebarwień słonecznych?",
        a: "Melasma (ostuda) ma podłoże hormonalne — często wyzwalana przez ciążę, antykoncepcję hormonalną lub zaburzenia tarczycy. Zmiany są symetryczne, głębsze (skórno-naskórkowe) i znacznie trudniejsze do leczenia. Wymagają innych protokołów terapeutycznych (np. kwas traneksamowy, laser Q-switched) i absolutnej, codziennej ochrony UV.",
      },
      {
        q: "Jakie zabiegi gabinetowe są najskuteczniejsze na przebarwienia?",
        a: "Przy naskórkowych przebarwieniach: peelingi chemiczne AHA/TCA i IPL. Przy melasie: kwas traneksamowy + laser Q-switched lub pikosekundowy + ścisłe SPF. Przy przebarwieniach pozapalnych (po trądziku): peelingi BHA, mikronakłuwanie z witaminą C, terapia LED. Wybór metody zawsze zależy od głębokości i przyczyny zmiany.",
      },
    ],
    sections: [
      {
        h2: "Rodzaje przebarwień — od czego zacząć diagnozę?",
        content: `
          <p>Nie każda ciemna plamka to to samo — a błąd diagnostyczny na starcie oznacza
          terapię, która nie zadziała. Przed doborem zabiegu kosmetyczka powinna określić
          <strong>trzy parametry</strong>: rodzaj, głębokość i przyczynę przebarwienia.</p>

          <h3>Przebarwienia słoneczne (lentigines, „plamy starości")</h3>
          <p>Płaskie, dobrze odgraniczone plamy w kolorze jasnobrązowym do ciemnobrązowego.
          Pojawiają się na twarzy, dekolcie, dłoniach i ramionach — wszędzie tam,
          gdzie skóra była regularnie eksponowana na słońce. Zazwyczaj naskórkowe —
          stosunkowo dobrze reagują na peelingi i IPL.</p>

          <h3>Melasma (ostuda, chloasma)</h3>
          <p>Symetryczne, rozmyte plamy na czole, policzkach, górnej wardze i brodzie.
          Podłoże hormonalne (ciąża, antykoncepcja, niedoczynność tarczycy) + UV jako
          wyzwalacz. Zmiany mogą być naskórkowe, skórne lub mieszane — te ostatnie
          najtrudniejsze do leczenia. Bez ochrony UV efekty terapii szybko znikają.</p>

          <h3>Przebarwienia pozapalne (PIH)</h3>
          <p>Ciemne ślady po krostach trądzikowych, oparzeniach, ukąszeniach lub
          agresywnych zabiegach. Kolor od różowego przez brązowy do prawie czarnego —
          zależy od fototypu skóry. Przy ciemnych fototypach szczególna ostrożność
          z zabiegami — ryzyko paradoksalnego nasilenia przebarwień.</p>

          <h3>Przebarwienia naskórkowe vs. skórne</h3>
          <p>Prosta metoda oceny: lampa Wooda w gabinecie — naskórkowe fluoryzują mocniej.
          Głębsze (skórne) wymagają bardziej agresywnych metod i dłuższej terapii.
          Peelingi powierzchniowe przy głębokich przebarwieniach dadzą tylko chwilowy efekt.</p>
        `,
      },
      {
        h2: "Tydzień 1–2: diagnoza i przygotowanie skóry",
        content: `
          <p>To etap, który większość osób pomija — i dlatego terapia nie daje efektów.
          Dobrze przeprowadzona diagnoza to połowa sukcesu.</p>

          <h3>Konsultacja i wywiad skórny</h3>
          <p>Kosmetyczka zbada rodzaj i głębokość przebarwień (lampą Wooda lub dermoskopem),
          zapyta o historię antykoncepcji hormonalnej, ekspozycji na słońce i stosowane
          dotychczas produkty. Na tej podstawie dobiera protokół.</p>

          <h3>Przygotowanie domowe — „pre-treatment"</h3>
          <p>Przez 1–2 tygodnie przed pierwszym silniejszym zabiegiem:</p>
          <ul style="margin:8px 0 12px 22px;list-style:disc;line-height:1.9;font-size:15px;color:#4a3f42;">
            <li><strong>Intensywne nawilżenie</strong> — żel z kwasem hialuronowym lub ceramidy.
            Nawilżona skóra lepiej toleruje peelingi i rzadziej reaguje podrażnieniami.</li>
            <li><strong>Kwas kojowy lub arbutyna w pielęgnacji domowej</strong> — łagodnie
            hamują aktywność melanocytów, przygotowując skórę na intensywniejsze zabiegi.</li>
            <li><strong>SPF 50 każdego ranka</strong> — bez wyjątku, nawet w pochmurny dzień.
            To nie jest opcja — to warunek konieczny powodzenia całej terapii.</li>
            <li><strong>Odstawienie retinoidów i mocnych kwasów</strong> na 5–7 dni przed
            pierwszym zabiegiem w gabinecie.</li>
          </ul>
        `,
      },
      {
        h2: "Tydzień 2–4: pierwsze zabiegi i budowanie efektu",
        content: `
          <h3>Peelingi enzymatyczne i kwasy łagodne</h3>
          <p>Zabieg 1–2: peeling enzymatyczny (bromelaina, papaina) lub kwasowy
          o niskim stężeniu (kwas migdałowy 30–40%, laktobionowy). Efekt: delikatne
          złuszczenie zrogowaciałego naskórka, wyrównanie powierzchni, pierwsza poprawa
          kolorytu.</p>

          <h3>Mezoterapia rozjaśniająca</h3>
          <p>Koktajle z kwasem traneksamowym, witaminą C, arbutyną i glutation podawane
          śródskórnie lub przy pomocy dermapena. Działają bezpośrednio na melanocyty —
          skuteczniejsze niż kosmetyki stosowane na powierzchni skóry.</p>

          <h3>Domowa pielęgnacja w tym etapie</h3>
          <ul style="margin:8px 0 12px 22px;list-style:disc;line-height:1.9;font-size:15px;color:#4a3f42;">
            <li>Rano: serum z witaminą C (stabilna forma: askorbyl glukozydu lub 3-O-etyl
            L-askorbinianu) + SPF 50.</li>
            <li>Wieczorem: serum z arbutyną lub kwasem kojowym, lekki krem nawilżający.</li>
            <li>Brak mechanicznych peelingu — skóra jest uwrażliwiona po zabiegach.</li>
          </ul>
        `,
      },
      {
        h2: "Tydzień 4–6: zabiegi rozjaśniające wysokiej skuteczności",
        content: `
          <p>Na tym etapie skóra jest przygotowana na silniejsze zabiegi, a melanocyty
          są już częściowo wyciszone przez pre-treatment.</p>

          <h3>Peelingi chemiczne wyższych stężeń</h3>
          <p>Peeling TCA 10–20% (trichlorooctowy) lub kwas migdałowy wyższego stężenia
          w połączeniu z rezorcynolem. Efekt: głębsze złuszczenie, wyraźne rozjaśnienie
          naskórkowych przebarwień po 5–7 dniach od zabiegu (złuszczanie). Wymaga
          dokładnej opieki pozabiegowej i absolutnego unikania słońca przez min. 2 tygodnie.</p>

          <h3>IPL (Intense Pulsed Light)</h3>
          <p>Selektywne działanie na melaninę — termicznie niszczy skupiska barwnika
          bez uszkadzania otaczającej tkanki. Idealne dla przebarwień słonecznych
          i płytkich przebarwień naczyniowych. Po zabiegu przebarwienia chwilowo
          ciemnieją (efekt „kawy"), a następnie łuszczą się i zanikają w ciągu 7–14 dni.
          Nie stosować przy melasie aktywnej — może ją nasilić.</p>

          <h3>Laser frakcyjny i pikosekundowy</h3>
          <p>Laser frakcyjny (np. CO2 frakcyjny, erbium) działa głębiej i równocześnie
          stymuluje przebudowę kolagenu. Laser pikosekundowy (Picosure, PicoWay) —
          najnowsza generacja, skuteczny przy melasie i opornych przebarwieniach
          hormonalnych. Większy czas regeneracji (5–10 dni) w zamian za wyraźniejsze efekty.</p>

          <h3>Domowa pielęgnacja na tym etapie</h3>
          <ul style="margin:8px 0 12px 22px;list-style:disc;line-height:1.9;font-size:15px;color:#4a3f42;">
            <li>Kwas traneksamowy — rano i wieczorem; kliniczne badania potwierdzają
            skuteczność w melasie porównywalną z hydroquinonem, bez ryzyka okronotozy.</li>
            <li>Witamina C 10–15% (rano) + SPF 50+ (obowiązkowo, ponownie co 2–3 h).</li>
            <li>Unikanie sauny, solarium i intensywnego wysiłku przez 48–72 h po zabiegu.</li>
          </ul>
        `,
      },
      {
        h2: "Czego oczekiwać po 6 tygodniach?",
        content: `
          <p>Efekty zależą od rodzaju i głębokości przebarwień, ale przy systematycznej
          terapii można spodziewać się:</p>
          <ul style="margin:8px 0 12px 22px;list-style:disc;line-height:1.9;font-size:15px;color:#4a3f42;">
            <li><strong>Przebarwienia słoneczne naskórkowe</strong>: zmniejszenie intensywności
            o 50–80%, u wielu osób całkowite ustąpienie widocznych zmian.</li>
            <li><strong>Przebarwienia pozapalne</strong>: poprawa o 40–60%; efekty zależne
            od fototypu i głębokości zmian.</li>
            <li><strong>Melasma</strong>: widoczna poprawa (30–50%), ale nie całkowite
            ustąpienie — to proces długotrwały wymagający podtrzymującej terapii
            i absolutnego SPF na stałe.</li>
          </ul>
          <p>Kluczowe: <strong>efekty utrzymują się tylko wtedy, gdy kontynuujesz
          ochronę UV</strong>. Bez SPF przebarwienia wracają w ciągu kilku tygodni letnich.</p>
        `,
      },
      {
        h2: "Pielęgnacja podtrzymująca — co po terapii?",
        content: `
          <p>Po zakończeniu intensywnej serii terapeutycznej skóra wymaga pielęgnacji
          podtrzymującej. Bez niej efekty zanikają szybko — szczególnie przy melasie.</p>

          <h3>Codzienna rutyna podtrzymująca</h3>
          <ol style="margin:8px 0 12px 22px;list-style:decimal;line-height:1.9;font-size:15px;color:#4a3f42;">
            <li><strong>Rano</strong>: delikatne mycie → serum z witaminą C lub kwasem
            traneksamowym → SPF 50 (non-comedogenic).</li>
            <li><strong>Wieczorem</strong>: double cleansing → retinol lub retinal
            (stymuluje obrót komórkowy, zapobiega nawrotom) → krem nawilżający.</li>
          </ol>
          <p>Raz w miesiącu: peeling enzymatyczny w domu lub wizyta podtrzymująca
          w gabinecie (peeling kwasowy niskiego stężenia) — by utrzymać efekt złuszczający
          i wyrównany koloryt.</p>

          <h3>Czego nadal unikać</h3>
          <ul style="margin:8px 0 12px 22px;list-style:disc;line-height:1.9;font-size:15px;color:#4a3f42;">
            <li>Solarium — kategoria zakaz przy jakichkolwiek przebarwieniach.</li>
            <li>Długotrwałej ekspozycji na słońce bez kapelusza i ponownie nałożonego SPF.</li>
            <li>Agresywnych scrubów mechanicznych — niszczą barierę i mogą prowokować PIH.</li>
          </ul>
        `,
      },
      {
        h2: `Zabiegi na przebarwienia w ${PORTAL_LOCALE.regionIn}`,
        content: `
          <p>Jeśli szukasz gabinetu kosmetycznego w ${PORTAL_LOCALE.regionIn}
          specjalizującego się w terapii przebarwień, Zabiegi Odart dopasuje Cię do
          gabinetów z odpowiednim sprzętem i doświadczeniem — na podstawie rodzaju
          Twoich przebarwień (słoneczne, hormonalne, pozapalne). Nie przeglądasz katalogu
          — dostajesz konkretne dopasowanie.</p>
        `,
      },
    ],
  },

  // pozostałe artykuły — krótka wersja fallback
  "anti-aging-dom": {
    title: "Pielęgnacja anti-aging w domu: retinoidy, witamina C i peptydy",
    headline: "Pielęgnacja anti-aging w domu — co naprawdę działa i jak to stosować?",
    excerpt:
      "Retinoidy, witamina C, peptydy sygnałowe, kwas hialuronowy i SPF — to filary skutecznej rutyny anti-aging. Dowiedz się, jak dobierać składniki aktywne do wieku i fototypu skóry, jak je bezpiecznie wprowadzać i kiedy domowa pielęgnacja powinna być uzupełniona zabiegami w gabinecie.",
    keywords: [
      "pielęgnacja anti-aging",
      "krem anti-aging",
      "retinoidy na zmarszczki",
      "witamina C skóra",
      "peptydy kolagen",
      "rutyna anti-aging po 30",
      "zabiegi anti-aging",
      `gabinet anti-aging ${PORTAL_LOCALE.region}`,
    ],
    readingTime: 9,
    datePublished: "2026-01-22",
    dateModified: "2026-02-18",
    relatedSlugs: ["przebarwienia-plan", "przygotowanie-skory", "tradzik-doroslych"],
    ctaText: "Znajdź gabinet anti-aging",
    ctaHref: "/portal/gabinety",
    faq: [
      {
        q: "Od jakiego wieku warto zacząć pielęgnację anti-aging?",
        a: "Profilaktyczne działanie ma sens już od 25–28 roku życia — wtedy produkcja kolagenu zaczyna stopniowo spadać. Nie chodzi o agresywne składniki, lecz o nawilżenie, SPF i antyoksydanty (witamina C, E). Retinoidy i peptydy sygnałowe warto wprowadzić po 30., gdy pierwsze linie mimiczne stają się widoczne.",
      },
      {
        q: "Czy retinol i witamina C można stosować razem?",
        a: "Najlepiej nie jednocześnie — retinol stosuj wieczorem, witaminę C rano. Przy nakładaniu obu produktów w tej samej porze istnieje ryzyko podrażnienia i dezaktywacji witaminy C przez obniżenie pH. Rozdzielenie na dzień/noc daje maksimum efektów bez ryzyka.",
      },
      {
        q: "Jak szybko działają retinoidy na zmarszczki?",
        a: "Pierwsze efekty (wygładzenie tekstury, poprawa kolorytu) pojawiają się po 8–12 tygodniach regularnego stosowania. Widoczne spłycenie zmarszczek i poprawa gęstości skóry — po 6 miesiącach. Retinoidy działają wolno, ale wyniki z badań klinicznych są jednoznaczne: to jedyne kosmetyki o udowodnionym działaniu przeciwzmarszczkowym.",
      },
      {
        q: "Czy pielęgnacja domowa zastąpi zabiegi w gabinecie?",
        a: "Nie — działają na różnych poziomach. Kosmetyki docierają do naskórka i płytkiej warstwy skóry właściwej. Zabiegi gabinetowe (mezoterapia, laser frakcyjny, microneedling) stymulują głębsze procesy przebudowy kolagenu i elastyny. Najlepsze efekty daje połączenie obu strategii.",
      },
      {
        q: "Co to jest retinal i czym różni się od retinolu?",
        a: "Retinal (retinaldehyd) to forma witaminy A o jeden krok bliższa do aktywnej tretinoiny niż retinol — działa szybciej i silniej przy podobnym profilu tolerancji. Klinicznie oceniany jako 11-krotnie silniejszy od retinolu przy redukcji zmarszczek. Dobry wybór dla osób, które chcą mocniejszego efektu bez recepty na tretinoinę.",
      },
    ],
    sections: [
      {
        h2: "Dlaczego skóra się starzeje — co tak naprawdę się dzieje?",
        content: `
          <p>Zrozumienie mechanizmu starzenia to punkt wyjścia do skutecznej pielęgnacji.
          Skóra starzeje się z dwóch przyczyn — i każda wymaga innej strategii:</p>

          <h3>Starzenie chronologiczne (wewnętrzne)</h3>
          <p>Po 25. roku życia produkcja kolagenu spada o ok. <strong>1% rocznie</strong>.
          Zwalnia też obrót komórkowy naskórka (z 28 do ponad 40 dni po 40. roku życia),
          zmniejsza się produkcja ceramidów i naturalnego czynnika nawilżającego (NMF).
          Efekt: skóra staje się cieńsza, bardziej sucha, mniej sprężysta.</p>

          <h3>Starzenie fotochemiczne (zewnętrzne)</h3>
          <p>Promieniowanie UVA i UVB generuje wolne rodniki niszczące włókna kolagenowe
          i elastynowe, prowadzi do mutacji DNA melanocytów (przebarwienia) i degraduje
          macierz zewnątrzkomórkową. Szacuje się, że <strong>fotostarzenie odpowiada
          za 80–90% widocznych oznak starzenia</strong> skóry twarzy.
          Stąd SPF to nie opcja — to fundament.</p>

          <p>Skuteczna pielęgnacja anti-aging działa na obu frontach jednocześnie:
          <strong>spowalnia degenerację</strong> (antyoksydanty, SPF) i
          <strong>stymuluje odbudowę</strong> (retinoidy, peptydy, kwasy).</p>
        `,
      },
      {
        h2: "Retinoidy — złoty standard anti-aging",
        content: `
          <p>Retinoidy to jedyna grupa składników kosmetycznych, dla których istnieją
          <strong>wieloletnie randomizowane badania kliniczne</strong> potwierdzające
          redukcję zmarszczek i poprawę gęstości skóry. Działają na poziomie genetycznym
          — aktywują receptory RAR i RXR, regulujące transkrypcję genów odpowiedzialnych
          za syntezę kolagenu i obrót naskórka.</p>

          <h3>Hierarchia retinoidów (od najłagodniejszego)</h3>
          <ul style="margin:8px 0 12px 22px;list-style:disc;line-height:1.9;font-size:15px;color:#4a3f42;">
            <li><strong>Retinyl palmitat / retinyl octan</strong> — najłagodniejszy,
            najmniej skuteczny; dobry na start dla skóry wrażliwej.</li>
            <li><strong>Retinol</strong> — najpopularniejszy w kosmetykach OTC; wymaga
            konwersji do tretinoiny (2 etapy). Efekty po 3–6 miesiącach.</li>
            <li><strong>Retinal (retinaldehyd)</strong> — o krok bliżej do tretinoiny,
            ok. 11× silniejszy od retinolu przy podobnej tolerancji. Szybsze efekty.</li>
            <li><strong>Tretinoina (kwas retinowy)</strong> — najsilniejsza, na receptę
            (Retin-A, Retacnyl). Złoty standard w badaniach klinicznych. Wymaga
            adaptacji i nadzoru kosmetyczki lub dermatologa.</li>
          </ul>

          <h3>Jak bezpiecznie wprowadzać retinol?</h3>
          <ol style="margin:8px 0 12px 22px;list-style:decimal;line-height:1.9;font-size:15px;color:#4a3f42;">
            <li>Zacznij od stężenia 0,025–0,05% retinolu, 2× w tygodniu wieczorem.</li>
            <li>Po 4–6 tygodniach bez podrażnień — zwiększ do 3–4× tygodniowo.</li>
            <li>Po kolejnych 4–6 tygodniach — codziennie lub przejdź na wyższe stężenie.</li>
            <li>Zawsze po retinozie nakładaj krem nawilżający (technika „sandwich").</li>
            <li>Bezwzględnie SPF 30–50 rano przez cały czas stosowania.</li>
          </ol>

          <p style="font-size:13px;color:#888;margin-top:6px;">
            Uwaga: unikaj retinoidów w ciąży i karmieniu piersią. Przy cerze naczynkowej
            lub rosacea — skonsultuj z kosmetyczką przed wprowadzeniem.
          </p>
        `,
      },
      {
        h2: "Witamina C — antyoksydant i stymulator kolagenu",
        content: `
          <p>Witamina C (kwas L-askorbinowy i jego pochodne) to drugi filar pielęgnacji
          anti-aging. Działa wielokierunkowo: neutralizuje wolne rodniki, hamuje
          melanogenezę (rozjaśnia przebarwienia) i — co kluczowe — jest niezbędna
          do hydroksylacji proliny i lizyny podczas syntezy kolagenu.</p>

          <h3>Formy witaminy C i ich stabilność</h3>
          <ul style="margin:8px 0 12px 22px;list-style:disc;line-height:1.9;font-size:15px;color:#4a3f42;">
            <li><strong>Kwas L-askorbinowy (czysty)</strong> — najlepiej przebadana,
            najbardziej aktywna forma; niestabilna (utlenia się, żółknie). Stężenie
            10–20%. Stosuj rano — synergia z SPF.</li>
            <li><strong>Askorbyl glukozydu (AA2G)</strong> — stabilna, łagodna, przekształcana
            przez skórę do kwasu L-askorbinowego. Wolniejsze, ale trwalsze działanie.</li>
            <li><strong>3-O-etyl L-askorbinian (EAC)</strong> — stabilna, dobrze penetrująca
            forma; skuteczna nawet przy cerze wrażliwej.</li>
            <li><strong>Askorbyl tetraizopalmitynian</strong> — lipofilowa, penetruje
            do głębszych warstw skóry; dobra do kremów z retinoidami.</li>
          </ul>

          <h3>Jak stosować?</h3>
          <p>Serum z witaminą C aplikuj rano na oczyszczoną skórę, przed kremem
          z SPF. Przechowuj w ciemnym, chłodnym miejscu — utlenienie widoczne
          jest po zmianie koloru na żółto-pomarańczowy (zmniejszona skuteczność,
          choć niekoniecznie szkodliwe).</p>
        `,
      },
      {
        h2: "Peptydy, kwas hialuronowy i ceramidy — uzupełnienie rutyny",
        content: `
          <h3>Peptydy sygnałowe i neuropeptydy</h3>
          <p>Krótkie łańcuchy aminokwasów wysyłające sygnały do fibroblastów — stymulują
          produkcję kolagenu, elastyny i lamininy. Najlepiej przebadane:</p>
          <ul style="margin:8px 0 12px 22px;list-style:disc;line-height:1.9;font-size:15px;color:#4a3f42;">
            <li><strong>Matrixyl (palmitoilo-pentapeptyd-4)</strong> — stymuluje kolagen
            I i III; często stosowany jako alternatywa dla retinoidów przy nietolerancji.</li>
            <li><strong>Argireline (acetyl hexapeptyd-3)</strong> — „botoks w kremie";
            łagodzi zmarszczki mimiczne poprzez hamowanie uwalniania acetylocholiny.
            Działanie lokalne, bez iniekcji.</li>
            <li><strong>Copper peptides (GHK-Cu)</strong> — antyoksydacyjne, stymulują
            syntezę kolagenu i elastyny, przyspieszają gojenie.</li>
          </ul>

          <h3>Kwas hialuronowy (HA)</h3>
          <p>Nie każde HA jest takie samo — cząsteczki różnych mas cząsteczkowych
          działają inaczej:</p>
          <ul style="margin:8px 0 12px 22px;list-style:disc;line-height:1.9;font-size:15px;color:#4a3f42;">
            <li><strong>Wysokie MW (&gt;1 MDa)</strong> — tworzy film na powierzchni,
            nawilża naskórek, efekt natychmiastowy.</li>
            <li><strong>Średnie MW (50–300 kDa)</strong> — penetruje głębiej,
            lepsze długoterminowe nawilżenie.</li>
            <li><strong>Niskie MW (&lt;50 kDa) i nano-HA</strong> — dociera do
            głębszych warstw skóry właściwej; uwaga przy skórze wrażliwej —
            może delikatnie drażnić.</li>
          </ul>
          <p>Idealnie wybierz produkt z kilkoma frakcjami HA — nawilżenie wielowarstwowe.</p>

          <h3>Ceramidy i bariera hydrolipidowa</h3>
          <p>Ceramidy (ceramid NP, AP, EOP) to „cement" między komórkami naskórka.
          Ich niedobór prowadzi do TEWL (przeznaskórkowej utraty wody), suchości
          i podatności na podrażnienia. Szczególnie ważne po 40. roku życia
          i przy stosowaniu retinoidów.</p>
        `,
      },
      {
        h2: "SPF — najważniejszy składnik anti-aging",
        content: `
          <p>Badania pokazują, że <strong>codzienne stosowanie SPF 30+ przez 4,5 roku
          odmładza skórę o ok. 24%</strong> (badanie Queensland, 2013). Żaden krem
          anti-aging nie zbliży się do tego efektu.</p>

          <h3>Jaki SPF wybrać?</h3>
          <ul style="margin:8px 0 12px 22px;list-style:disc;line-height:1.9;font-size:15px;color:#4a3f42;">
            <li><strong>SPF 30–50</strong> — minimum przy codziennej pielęgnacji anti-aging.</li>
            <li><strong>Filtr mineralny (ZnO, TiO2)</strong> — lepszy przy cerze wrażliwej,
            trądzikowej, po zabiegach; działa od razu po nałożeniu.</li>
            <li><strong>Filtr chemiczny</strong> — lżejsza tekstura, lepszy pod makijaż;
            wymaga 20 min przed ekspozycją.</li>
            <li><strong>Filtr hybrydowy</strong> — połączenie obu, balans między
            skutecznością a komfortem.</li>
          </ul>
          <p>Nanosz SPF jako ostatni krok porannej rutyny (po kremie nawilżającym),
          w ilości ok. ¼ łyżeczki na twarz. Poprawiaj co 2–3 h przy ekspozycji na słońce.</p>
        `,
      },
      {
        h2: "Kompletna rutyna anti-aging — krok po kroku",
        content: `
          <h3>Rano</h3>
          <ol style="margin:8px 0 12px 22px;list-style:decimal;line-height:1.9;font-size:15px;color:#4a3f42;">
            <li>Delikatne oczyszczanie (żel lub pianka, pH 5–5,5).</li>
            <li>Tonik nawilżający lub esencja (opcjonalnie).</li>
            <li>Serum z witaminą C (10–15%) — antyoksydant + stymulacja kolagenu.</li>
            <li>Serum z peptydami lub HA (opcjonalnie, jeśli skóra sucha).</li>
            <li>Krem nawilżający z ceramidami.</li>
            <li><strong>SPF 30–50</strong> — obowiązkowo, jako ostatni krok.</li>
          </ol>

          <h3>Wieczorem</h3>
          <ol style="margin:8px 0 12px 22px;list-style:decimal;line-height:1.9;font-size:15px;color:#4a3f42;">
            <li>Double cleansing (olejek → żel myjący) lub sama micelarna.</li>
            <li>Tonik łagodzący / esencja.</li>
            <li>Retinoid (retinol/retinal 0,025–0,1%) — 2–7× w tygodniu
            zależnie od tolerancji.</li>
            <li>Krem nawilżający lub balsam z ceramidami, peptydami, HA.</li>
          </ol>

          <p style="font-size:13px;color:#888;margin-top:6px;">
            Zasada layeringu: od najlżejszej do najgęstszej konsystencji.
            Nie mieszaj retinoidu z witaminą C w tej samej porze dnia.
          </p>
        `,
      },
      {
        h2: "Kiedy domowa pielęgnacja to za mało?",
        content: `
          <p>Kosmetyki działają w naskórku i powierzchniowej warstwie skóry właściwej.
          Głębsze procesy — utrata objętości, degradacja macierzy kolagenowej,
          wiotkość — wymagają zabiegów gabinetowych:</p>
          <ul style="margin:8px 0 12px 22px;list-style:disc;line-height:1.9;font-size:15px;color:#4a3f42;">
            <li><strong>Mezoterapia witaminowa</strong> — mikroiniekcje koktajli
            z HA, witaminami i peptydami bezpośrednio do skóry właściwej.</li>
            <li><strong>Mikronakłuwanie (dermapen)</strong> — kontrolowane
            mikrouszkodzenia stymulujące syntezę kolagenu; wzmacnia też wnikanie
            składników aktywnych.</li>
            <li><strong>Laser frakcyjny</strong> — przebudowa kolagenu i elastyny,
            redukcja głębszych zmarszczek i poprawia gęstość skóry.</li>
            <li><strong>Peelingi chemiczne TCA/Jessner</strong> — głębsze złuszczenie,
            wyrównanie kolorytu, poprawa tekstury.</li>
            <li><strong>HIFU i RF</strong> — lifting bez igieł; stymulacja kolagenu
            przez ciepło w głębszych warstwach skóry i SMAS.</li>
          </ul>
          <p>Zalecana strategia: solidna rutyna domowa + seria 2–4 zabiegów rocznie
          w gabinecie = najlepszy stosunek efektu do kosztu.</p>
        `,
      },
      {
        h2: `Zabiegi anti-aging w ${PORTAL_LOCALE.regionIn}`,
        content: `
          <p>Szukasz gabinetu kosmetycznego w ${PORTAL_LOCALE.regionIn}
          specjalizującego się w zabiegach anti-aging? Zabiegi Odart dopasuje Cię
          do gabinetów z odpowiednim sprzętem i doświadczeniem — na podstawie
          Twoich potrzeb i etapu starzenia skóry. Nie przeglądasz katalogu —
          dostajesz konkretne dopasowanie.</p>
        `,
      },
    ],
  },

  "naczynka-cera": {
    title: "Cera naczynkowa: pielęgnacja, czego unikać i zabiegi",
    headline: "Cera naczynkowa — jak o nią dbać, czego unikać i jakie zabiegi działają?",
    excerpt:
      "Cera naczynkowa to nie tylko estetyczny problem — widoczne naczynka i przewlekły rumień to sygnał osłabionych ścianek naczyń włosowatych. Dowiedz się, czego unikać, jakie składniki wzmacniają naczynia i kiedy laser lub IPL dają trwałe efekty.",
    keywords: [
      "cera naczynkowa",
      "rumień skóry",
      "widoczne naczynka na twarzy",
      "jak dbać o cerę naczynkową",
      "zabiegi na naczynka",
      "laser na naczynka",
      "rosacea pielęgnacja",
      `gabinet cera naczynkowa ${PORTAL_LOCALE.region}`,
    ],
    readingTime: 8,
    datePublished: "2026-01-25",
    dateModified: "2026-02-18",
    relatedSlugs: ["przygotowanie-skory", "anti-aging-dom", "tradzik-doroslych"],
    ctaText: "Znajdź gabinet specjalizujący się w skórze naczynkowej",
    ctaHref: "/portal/gabinety",
    faq: [
      {
        q: "Czy cera naczynkowa to to samo co rosacea?",
        a: "Nie — cera naczynkowa (couperose) to typ skóry z tendencją do rozszerzania naczyń i trwałego rumienia. Rosacea (trądzik różowaty) to przewlekła choroba zapalna skóry, w której naczynka i rumień to jeden z objawów — obok grudek, krost i teleangiektazji. Rosacea wymaga konsultacji dermatologicznej i leczenia; cera naczynkowa może być skutecznie zarządzana przez kosmetyczkę.",
      },
      {
        q: "Czy laser naprawdę usuwa naczynka na twarzy?",
        a: "Tak — laser Nd:YAG (1064 nm) i IPL selektywnie niszczą hemoglobinę w rozszerzonych naczyniach bez uszkadzania otaczającej tkanki. Efekty po jednej sesji są widoczne po 7–14 dniach (naczynie blednie i zanika). Najlepsze wyniki daje seria 2–4 zabiegów. Zabieg jest bezpieczny, ale wymaga odpowiedniego sprzętu i doświadczenia operatora.",
      },
      {
        q: "Jakich składników kosmetycznych unikać przy cerze naczynkowej?",
        a: "Przede wszystkim: alkohol denaturowany (SD alcohol, denatured alcohol), mentol, eugenol, kamfora, olejek z drzewa herbacianego w wysokich stężeniach i silne kwasy AHA przy aktywnym rumienie. Wszystkie rozszerzają naczynia lub podrażniają skórę, nasilając reaktywność. Unikaj też syntetycznych perfum w produktach do pielęgnacji.",
      },
      {
        q: "Czy peeling jest zakazany przy cerze naczynkowej?",
        a: "Mechaniczne peelingi ziarniste i szczoteczki sonikowe są niewskazane — mechaniczne tarcie podrażnia i uszkadza naczynka. Natomiast delikatne peelingi enzymatyczne (bromelaina, papaina) lub łagodne kwasy (laktobionowy, glukonolakton) w niskich stężeniach mogą być stosowane przez doświadczoną kosmetyczkę — poprawiają teksturę bez ryzyka podrażnienia.",
      },
      {
        q: "Co wzmacnia ścianki naczyń krwionośnych w skórze?",
        a: "Najlepiej przebadane składniki wzmacniające naczynia to: escyna (kasztanowiec), ruscus aculeatus (ruszczyk), witamina K1 (filochinon), rutyna i kwercetyna (flawonoidy), witamina C (niezbędna do syntezy kolagenu budującego ściankę naczynia) oraz centella asiatica (wąkrotka azjatycka). Stosuj je zarówno w kosmetykach, jak i ewentualnie suplementacyjnie — po konsultacji.",
      },
    ],
    sections: [
      {
        h2: "Czym jest cera naczynkowa i dlaczego naczynka są widoczne?",
        content: `
          <p>Cera naczynkowa (couperose) charakteryzuje się <strong>trwale rozszerzonymi
          lub rozerwanymi naczyniami włosowatymi</strong> — teleangiektazjami —
          widocznymi jako czerwone lub fioletowe nitki lub plamki, najczęściej
          na policzkach, nosie i brodzie.</p>

          <h3>Mechanizm powstawania</h3>
          <p>Naczynia włosowate rozszerzają się pod wpływem bodźców (ciepło, mróz, pikantne
          potrawy, alkohol) i normalnie wracają do poprzedniego stanu. Przy cerze naczynkowej
          <strong>ścianka naczynia jest osłabiona</strong> — traci elastyczność i nie może
          się odpowiednio skurczyć. Naczynie pozostaje trwale poszerzone lub pęka,
          tworząc widoczną teleangiektazję.</p>

          <h3>Predyspozycje i przyczyny</h3>
          <ul style="margin:8px 0 12px 22px;list-style:disc;line-height:1.9;font-size:15px;color:#4a3f42;">
            <li><strong>Genetyka</strong> — skłonność do słabszych ścianek naczyń
            jest dziedziczna; jasna karnacja (fototyp I–II) jest bardziej podatna.</li>
            <li><strong>Promieniowanie UV</strong> — degraduje kolagen budujący ściankę
            naczynia; długoletnia ekspozycja bez SPF znacząco nasila problem.</li>
            <li><strong>Gwałtowne zmiany temperatury</strong> — sauna → mróz, gorący
            prysznic → chłodne powietrze.</li>
            <li><strong>Agresywna pielęgnacja</strong> — alkohol w kosmetykach, silne
            kwasy, mechaniczne peelingi niszczą barierę i nasilają reaktywność.</li>
            <li><strong>Hormony i ciąża</strong> — estrogeny rozszerzają naczynia;
            ciąża i menopauza często nasilają objawy.</li>
          </ul>
        `,
      },
      {
        h2: "Czego bezwzględnie unikać przy cerze naczynkowej?",
        content: `
          <h3>Czynniki fizyczne</h3>
          <ul style="margin:8px 0 12px 22px;list-style:disc;line-height:1.9;font-size:15px;color:#4a3f42;">
            <li><strong>Sauna, jacuzzi, bardzo gorące kąpiele</strong> — wysoka temperatura
            gwałtownie rozszerza naczynia. Jeśli lubisz saunę — kończ zimnym prysznicem
            (ale nie lodowatym) i stopniowo skracaj czas ekspozycji.</li>
            <li><strong>Intensywny wysiłek fizyczny</strong> bez ochłodzenia — trening
            podnosi temperaturę ciała; po treningu schłódź twarz chłodną (nie zimną)
            wodą.</li>
            <li><strong>Bezpośrednia ekspozycja na mróz i wiatr</strong> bez ochrony —
            stosuj kremy barierowe zawierające wosk pszczeli lub ceramidy przed wyjściem
            na zewnątrz zimą.</li>
            <li><strong>Mechaniczne peelingi i szczoteczki sonikowe</strong> — tarcie
            mechaniczne podrażnia naczynia i nasila rumień.</li>
          </ul>

          <h3>Składniki kosmetyczne do eliminacji</h3>
          <ul style="margin:8px 0 12px 22px;list-style:disc;line-height:1.9;font-size:15px;color:#4a3f42;">
            <li><strong>Alkohol denaturowany</strong> (SD alcohol, alcohol denat.,
            denatured alcohol) — wysusza i drażni, rozszerza naczynia.</li>
            <li><strong>Mentol i kamfora</strong> — dają wrażenie chłodzenia,
            ale paradoksalnie drażnią naczynia.</li>
            <li><strong>Eugenol i olejki eteryczne</strong> (goździkowy, cynamonowy,
            miętowy w wysokich stężeniach) — potencjalnie alergizujące i wazodylatacyjne.</li>
            <li><strong>Silne kwasy AHA przy aktywnym rumienie</strong> (glikolowy
            powyżej 10%) — mogą nasilić przekrwienie. Łagodniejsze kwasy (mlekowy,
            laktobionowy) są lepiej tolerowane.</li>
            <li><strong>Syntetyczne zapachy</strong> — częsty alergen kontaktowy
            nasilający reaktywność naczyniową.</li>
          </ul>

          <h3>Dieta i styl życia</h3>
          <ul style="margin:8px 0 12px 22px;list-style:disc;line-height:1.9;font-size:15px;color:#4a3f42;">
            <li>Alkohol — szczególnie czerwone wino (histamina + taniny).</li>
            <li>Ostre przyprawy (kapsaicyna) i bardzo gorące napoje.</li>
            <li>Duże wahania temperatury spożywanych posiłków.</li>
          </ul>
        `,
      },
      {
        h2: "Składniki aktywne wzmacniające naczynia — co naprawdę działa?",
        content: `
          <h3>Escyna i ruscus (ruszczyk)</h3>
          <p>Escyna (saponina z kasztanowca) uszczelnia ściankę naczyń i zmniejsza
          przepuszczalność — klinicznie stosowana przy niewydolności żylnej. Ruszczyk
          działa analogicznie, poprawiając napięcie ściany naczyniowej. Szukaj ich
          w kremach i serum przeznaczonych do cery naczynkowej.</p>

          <h3>Witamina K1 (filochinon)</h3>
          <p>Wspomaga koagulację i zmniejsza widoczność teleangiektazji i sińców.
          Stosowana miejscowo w kremach i żelach — szczególnie polecana po zabiegach
          laserowych i IPL, by przyspieszyć ustępowanie zaczerwienienia.</p>

          <h3>Centella asiatica (wąkrotka azjatycka)</h3>
          <p>Zawiera madecassozyd i asiatikozydy — stymulują syntezę kolagenu,
          uszczelniają naczynia i działają przeciwzapalnie. Jeden z najlepiej
          przebadanych składników przy cerze reaktywnej i naczynkowej.
          Świetnie tolerowana nawet przez bardzo wrażliwą skórę.</p>

          <h3>Witamina C (stabilne formy)</h3>
          <p>Niezbędna do syntezy kolagenu — hydroksyluje prolinę budującą ściankę
          naczynia. Przy cerze naczynkowej wybieraj stabilne, łagodne formy:
          askorbyl glukozyd (AA2G) lub 3-O-etyl L-askorbinian zamiast czystego
          kwasu L-askorbinowego (może drażnić przy aktywnym rumienie).</p>

          <h3>Rutyna, kwercetyna i inne flawonoidy</h3>
          <p>Uszczelniają i wzmacniają ściankę naczyń włosowatych. Rutyna blokuje
          enzym hialuronidazę, która rozkłada kwas hialuronowy w ścianie naczynia.
          Dostępna zarówno w kosmetykach, jak i suplementach.</p>

          <h3>Ceramidy i avenanthramidy</h3>
          <p>Ceramidy odbudowują barierę hydrolipidową — uszkodzona bariera nasila
          reaktywność naczyniową. Avenanthramidy z płatków owsianych (Avena sativa)
          działają silnie przeciwzapalnie i łagodzą rumień.</p>
        `,
      },
      {
        h2: "Pielęgnacja domowa — codzienna rutyna",
        content: `
          <h3>Rano</h3>
          <ol style="margin:8px 0 12px 22px;list-style:decimal;line-height:1.9;font-size:15px;color:#4a3f42;">
            <li>Delikatne mycie <strong>chłodną lub letnią wodą</strong> — nigdy gorącą.
            Żel myjący bez SLS i alkoholu (pH 5–5,5).</li>
            <li>Tonik bez alkoholu — najlepiej z centellą lub aloesem.</li>
            <li>Serum z centellą, niacynamidem (4–5%) lub witaminą C (stabilna forma).</li>
            <li>Krem barierowy z ceramidami, ruscusem lub escyną.</li>
            <li><strong>SPF 30–50 mineralny</strong> (ZnO lub TiO2) — filtry mineralne
            działają jak fizyczna bariera i nie drażnią skóry reaktywnej.</li>
          </ol>

          <h3>Wieczorem</h3>
          <ol style="margin:8px 0 12px 22px;list-style:decimal;line-height:1.9;font-size:15px;color:#4a3f42;">
            <li>Delikatne mycie — balsam lub mleczko oczyszczające bez alkoholu.</li>
            <li>Tonik łagodzący.</li>
            <li>Serum regenerujące: ceramidy + centella + witamina K.</li>
            <li>Bogaty krem odżywczy — nocna regeneracja bariery.</li>
          </ol>

          <p style="font-size:13px;color:#888;margin-top:6px;">
            Unikaj retinoidów przy aktywnym rumienie i rozszerzonych naczyniach —
            mogą nasilać reaktywność. Jeśli chcesz stosować retinoidy,
            skonsultuj to z kosmetyczką i zacznij od najniższego stężenia.
          </p>
        `,
      },
      {
        h2: "Zabiegi gabinetowe na cerę naczynkową — co jest najskuteczniejsze?",
        content: `
          <h3>Laser Nd:YAG (1064 nm)</h3>
          <p>Złoty standard w usuwaniu teleangiektazji. Fala 1064 nm jest selektywnie
          absorbowana przez hemoglobinę w naczyniu — powoduje jego termiczne zamknięcie
          bez uszkadzania naskórka. Efekty: naczynie blednie i zanika w ciągu 7–14 dni.
          Seria 2–3 zabiegów co 4–6 tygodni. Zabieg krótki (15–30 min), dyskomfort
          umiarkowany (uczucie „gumki").</p>

          <h3>IPL (Intense Pulsed Light)</h3>
          <p>Szerokie spektrum światła z filtrem na hemoglobinę — skuteczny przy rozlanych
          rumieniach i delikatnych naczyniach. Mniej precyzyjny niż laser Nd:YAG przy
          pojedynczych teleagiektazjach, ale bardziej wszechstronny przy rozległym
          rumieniu. Seria 3–5 zabiegów.</p>

          <h3>Mezoterapia wzmacniająca naczynia</h3>
          <p>Mikroiniekcje koktajli z witaminą C, rutyną, escyną i kwasem hialuronowym
          bezpośrednio do skóry właściwej. Poprawia mikrokrążenie, uszczelnia ściankę
          naczyń i nawilża skórę od wewnątrz. Seria 3–4 zabiegów co 2–3 tygodnie,
          następnie 1 zabieg podtrzymujący co 2–3 miesiące.</p>

          <h3>Karboksyterapia</h3>
          <p>Podskórne wstrzyknięcia CO2 — poprawiają mikrokrążenie i dotlenienie tkanek,
          wzmacniają naczynia. Dobry wybór przy cerze naczynkowej z jednoczesną bladością
          i słabym mikrokrążeniem.</p>

          <h3>Peelingi enzymatyczne i kwas laktobionowy</h3>
          <p>Jedyna bezpieczna forma złuszczania przy cerze naczynkowej. Enzym (bromelaina,
          papaina) lub kwas laktobionowy (PHA) delikatnie rozpuszczają martwy naskórek
          bez mechanicznego tarcia i bez drażnienia naczyń. Poprawiają teksturę i wchłanianie
          składników aktywnych.</p>
        `,
      },
      {
        h2: "Cera naczynkowa a rosacea — kiedy do dermatologa?",
        content: `
          <p>Cera naczynkowa (couperose) i rosacea mają podobne objawy — rumień,
          naczynka — ale to dwie różne sprawy:</p>
          <ul style="margin:10px 0 12px 22px;list-style:disc;line-height:1.9;font-size:15px;color:#4a3f42;">
            <li><strong>Cera naczynkowa</strong> — typ skóry, zarządzany przez kosmetyczkę
            z pomocą odpowiedniej pielęgnacji i zabiegów.</li>
            <li><strong>Rosacea (trądzik różowaty)</strong> — choroba dermatologiczna;
            poza rumienią i teleangiektazjami pojawiają się grudki, krosty, obrzęk nosa
            (phyma) lub zmiany oczne. Wymaga diagnozy i leczenia dermatologicznego
            (metronidazol, iwermektyna, doksycyklina).</li>
          </ul>
          <p>Jeśli rumień jest stały, nasilony, towarzyszą mu grudki lub krosty —
          udaj się do dermatologa przed rozpoczęciem zabiegów kosmetycznych.</p>
        `,
      },
      {
        h2: `Zabiegi na cerę naczynkową w ${PORTAL_LOCALE.regionIn}`,
        content: `
          <p>Szukasz gabinetu kosmetycznego w ${PORTAL_LOCALE.regionIn}
          z laserem Nd:YAG lub IPL na naczynka? Zabiegi Odart dopasuje Cię do gabinetów
          specjalizujących się w cerze naczynkowej i reaktywnej — na podstawie
          Twojego problemu. Nie przeglądasz katalogu — dostajesz konkretne dopasowanie
          do miejsca z odpowiednim sprzętem i doświadczeniem.</p>
        `,
      },
    ],
  },

  "manicure-wybor": {
    title: "Manicure hybrydowy, żelowy czy tytanowy — jak wybrać?",
    headline: "Manicure hybrydowy, żelowy czy tytanowy — kompletny przewodnik wyboru",
    excerpt:
      "Hybryda, żel, akryl, poligel, tytanowy — różnią się trwałością, grubością, bezpieczeństwem dla płytki i ceną. Dowiedz się, który rodzaj manicure pasuje do Twojego stylu życia, jak przygotować paznokcie i po czym poznać dobry salon paznokciowy.",
    keywords: [
      "manicure hybrydowy",
      "manicure żelowy",
      "trwały manicure",
      "hybryda czy żel",
      "manicure tytanowy",
      "poligel paznokcie",
      "jak wybrać manicure",
      `salon paznokciowy ${PORTAL_LOCALE.region}`,
    ],
    readingTime: 8,
    datePublished: "2026-01-28",
    dateModified: "2026-02-18",
    relatedSlugs: ["przygotowanie-skory", "masaz-relaksacyjny-sportowy"],
    ctaText: "Znajdź salon paznokciowy",
    ctaHref: "/portal/gabinety",
    faq: [
      {
        q: "Ile trzyma się manicure hybrydowy?",
        a: "Przy prawidłowo wykonanym manicure i właściwej pielęgnacji hybryda trzyma się 2–4 tygodnie. Na trwałość wpływają: staranne odtłuszczenie i gruntowanie płytki, jakość lakieru hybrydowego, grubość naturalne płytki oraz styl życia — częsta praca w wodzie lub manualnie skraca żywotność.",
      },
      {
        q: "Czy manicure hybrydowy niszczy paznokcie?",
        a: "Sam lakier hybrydowy nie uszkadza płytki, ale nieprawidłowe zdejmowanie (zrywanie zamiast namaczania w acetonie) niszczy warstwy naskórka paznokcia. Regularne stosowanie olejku do skórek i nawilżającego serum do paznokci między wizytami minimalizuje ryzyko przesuszenia i łamliwości.",
      },
      {
        q: "Czym różni się hybryda od żelu?",
        a: "Hybryda to cienka powłoka lakieru UV/LED — zachowuje naturalną grubość płytki, łatwa do usunięcia acetonem. Żel to budulec — może wzmacniać, przedłużać i kształtować paznokieć; grubszy, trwalszy (3–5 tygodni), ale trudniejszy w usuwaniu (frezowanie). Żel daje więcej możliwości kształtowania, hybryda — szybszy zabieg i łatwiejsze usuwanie.",
      },
      {
        q: "Co to jest manicure tytanowy?",
        a: "Manicure tytanowy to zabieg z użyciem lakieru hybrydowego wzbogaconego o drobiny tlenku tytanu (TiO2) lub specjalnymi materiałami wzmacniającymi. Daje bardzo twardy, odporny na odpryski efekt. Nie jest osobną kategorią jak żel czy akryl — to raczej linia produktów konkretnych marek (np. Semilac Tytanium). Trwałość podobna do standardowej hybrydy lub nieco wyższa.",
      },
      {
        q: "Jak wybrać dobry salon paznokciowy?",
        a: "Zwróć uwagę na: dezynfekcję narzędzi (autoklawowanie lub jednorazowe pilniki), wentylację sali (pyły z frezowania), markę używanych produktów i certyfikaty stylistki. Dobry salon nie spieszy się przy zdejmowaniu — nie frezuje hybrydy na sucho ani nie zrywa. Pytaj o czas zabiegu — zbyt krótki (poniżej 45 min z manicure) to sygnał ostrzegawczy.",
      },
    ],
    sections: [
      {
        h2: "Przegląd rodzajów manicure — czym się różnią?",
        content: `
          <p>Na rynku funkcjonuje kilka technik manicure z utwardzeniem UV/LED —
          różnią się składem, sposobem aplikacji, grubością, trwałością
          i wymaganiami przy usuwaniu. Zanim wybierzesz, warto wiedzieć, co tak naprawdę
          jest nakładane na Twoje paznokcie.</p>

          <h3>Lakier hybrydowy (hybryda)</h3>
          <p>Najcieńsza i najpopularniejsza forma — warstwa lakieru utwardzana lampą UV/LED.
          Zachowuje naturalną grubość płytki. Trwałość: <strong>2–4 tygodnie</strong>.
          Usuwanie: namaczanie w acetonie (10–15 min) — nieinwazyjne dla płytki.
          Idealna dla osób, które lubią regularnie zmieniać kolor lub mają wrażliwe,
          cienkie paznokcie.</p>

          <h3>Żel UV/LED</h3>
          <p>Grubsza, bardziej plastyczna warstwa — może być nakładana na naturalne paznokcie
          (wzmocnienie) lub na tipsy/formy (przedłużanie). Trwałość:
          <strong>3–5 tygodni</strong>. Usuwanie wymaga frezowania lub długiego
          namaczania — bardziej inwazyjne niż hybryda. Daje większe możliwości
          kształtowania i jest twardszy. Dobry przy łamliwych, krótkich paznokciach
          wymagających wzmocnienia.</p>

          <h3>Akryl</h3>
          <p>Mieszanina proszku (polimeru) i monomerów ciekłych — utwardza się chemicznie
          (bez lampy). Bardzo twarda, odporna na uderzenia powłoka. Trwałość:
          <strong>3–5 tygodni</strong>, często dłużej. Najczęściej stosowany przy
          przedłużaniu i mocno uszkodzonych płytkach. Usuwanie wyłącznie przez frezowanie
          lub wielogodzinne namaczanie. Wymaga wentylacji (opary monomerów). Przy dobrym
          wykonaniu bezpieczny, choć potencjalnie najbardziejobciążający dla naturalnej płytki.</p>

          <h3>Poligel</h3>
          <p>Hybryda żelu i akrylu — gęsty, modelowalny żel bez oparów monomeru.
          Utwardzany lampą. Lżejszy niż akryl, łatwiejszy w kształtowaniu niż żel.
          Trwałość: <strong>3–5 tygodni</strong>. Dobry kompromis dla osób, które chcą
          kształtowania bez zapachu akrylu. Stosunkowo nowy na rynku, wymaga wprawnej
          stylistki.</p>

          <h3>Manicure tytanowy</h3>
          <p>Nie jest osobną kategorią techniczną — to nazwa linii produktów (głównie
          Semilac Titanium) z wzmocnioną formułą zawierającą składniki tworzące
          twardszą powłokę. Technika aplikacji taka sama jak hybryda, trwałość nieco
          wyższa. Dobry wybór przy delikatnych, łamliwych paznokciach, które
          potrzebują wzmocnienia bez budowania żelem.</p>
        `,
      },
      {
        h2: "Hybryda czy żel — który wybrać?",
        content: `
          <p>To najczęstsze pytanie w salonach. Odpowiedź zależy od trzech czynników:</p>

          <h3>Styl życia i praca</h3>
          <ul style="margin:8px 0 12px 22px;list-style:disc;line-height:1.9;font-size:15px;color:#4a3f42;">
            <li><strong>Praca biurowa, mało kontaktu z wodą</strong> → hybryda wystarczy.</li>
            <li><strong>Praca manualna, częste mycie rąk, gotowanie</strong> → żel
            lub tytanowa hybryda — twardsza powłoka lepiej znosi mechaniczne obciążenia.</li>
            <li><strong>Sport, siłownia, częsty kontakt z chlorem</strong> → żel
            lub akryl; hybryda może odpryskiwać szybciej.</li>
          </ul>

          <h3>Stan naturalnej płytki</h3>
          <ul style="margin:8px 0 12px 22px;list-style:disc;line-height:1.9;font-size:15px;color:#4a3f42;">
            <li><strong>Zdrowe, normalne paznokcie</strong> → hybryda w zupełności.</li>
            <li><strong>Łamliwe, cienkie, rozdwajające się</strong> → żel wzmacniający
            lub poligel — dają fizyczne wsparcie płytce.</li>
            <li><strong>Krótkie, chcesz przedłużyć</strong> → żel na formach/tipsach
            lub akryl.</li>
          </ul>

          <h3>Częstotliwość uzupełnień</h3>
          <p>Hybryda: co 2–3 tygodnie (całkowite zdjęcie i nałożenie nowej).
          Żel/akryl: co 3–4 tygodnie możliwe <em>uzupełnienie</em> (dosunięcie
          przy odrośnięciu) bez zdejmowania całości — oszczędność czasu i pieniędzy
          przy regularnych wizytach.</p>
        `,
      },
      {
        h2: "Co naprawdę decyduje o trwałości manicure?",
        content: `
          <h3>1. Przygotowanie płytki</h3>
          <p>To najważniejszy etap — i ten najczęściej skracany w pośpiechu.
          Płytka musi być <strong>idealnie odtłuszczona i osuszona</strong>.
          Nawet ślad tłuszczu, kremów lub wilgoci sprawi, że hybryda oderwie się
          w ciągu kilku dni. Prawidłowe przygotowanie to: zepchnięcie skórek,
          delikatne sfrezowanie (matowienie) płytki, odtłuszczenie,
          aplikacja primera/bond.</p>

          <h3>2. Primer i bonder</h3>
          <p>Primer kwasowy (agresywniejszy, etcha płytkę mikroskoijnie)
          lub bezwasowy bonder (łagodniejszy, dla wrażliwych paznokci)
          — tworzą mostki chemiczne między płytką a żelem/hybrydą.
          Bez tego etapu nawet najlepszy lakier oderwie się przy wolnym brzegu.</p>

          <h3>3. Jakość produktów</h3>
          <p>Profesjonalne systemy (Semilac, Indigo, Victoria Vynn, Palu, Kodi)
          są formulowane jako zestawy — base coat, kolor i top coat tej samej
          marki są kompatybilne chemicznie. Mieszanie produktów różnych marek
          może skrócić trwałość nawet o połowę.</p>

          <h3>4. Technika utwardzania</h3>
          <p>Lampę UV/LED trzeba dopasować do produktu — różne żele wymagają
          różnych długości fali i czasów ekspozycji. Niedoutwardzony produkt
          jest miękki, łatwo się odpryskuje i może być drażniący dla skóry.</p>

          <h3>5. Pielęgnacja między wizytami</h3>
          <ul style="margin:8px 0 12px 22px;list-style:disc;line-height:1.9;font-size:15px;color:#4a3f42;">
            <li><strong>Olejek do skórek</strong> (jojoba, migdałowy, rącznik)
            — codziennie wieczorem; nawilża skórki i płytkę, zmniejsza ryzyko
            pęknięcia przy wolnym brzegu.</li>
            <li><strong>Rękawiczki przy myciu naczyń</strong> — detergenty
            i długotrwały kontakt z wodą to wrogowie trwałości.</li>
            <li><strong>Nie używaj paznokci jako narzędzi</strong> — otwieranie
            puszek, skrobanie — to najszybsza droga do odprysku.</li>
          </ul>
        `,
      },
      {
        h2: "Jak prawidłowo zdejmować manicure — dlaczego to ważne?",
        content: `
          <p>Zrywanie i odłupywanie hybrydy to <strong>najczęstsza przyczyna
          uszkodzenia płytki paznokcia</strong>. Przy odłupaniu zabieramy warstwę
          naskórka płytki — staje się ona cienka, warstwująca się i wrażliwa.</p>

          <h3>Prawidłowe zdejmowanie hybrydy</h3>
          <ol style="margin:8px 0 12px 22px;list-style:decimal;line-height:1.9;font-size:15px;color:#4a3f42;">
            <li>Delikatne sfrezowanie (lub spiłowanie) warstwy top coat
            — bez dotykania naturalnej płytki.</li>
            <li>Nasączenie wacika acetonem, ułożenie na płytce i owinięcie folią
            aluminiową na 10–15 min.</li>
            <li>Delikatne zepchnięcie zmiękczonego lakieru patyczkiem pomarańczowym
            — bez skrobania.</li>
            <li>Polerowanie płytki bufem, nałożenie odżywki lub olejku.</li>
          </ol>

          <h3>Prawidłowe zdejmowanie żelu i akrylu</h3>
          <p>Wymaga frezarki i doświadczonej stylistki — samodzielna próba prawie
          zawsze kończy się przefrezowaniem naturalnej płytki. To jeden z głównych
          powodów, dla których żel i akryl powinny być zdejmowane wyłącznie
          w salonie.</p>
        `,
      },
      {
        h2: "Na co zwrócić uwagę wybierając salon paznokciowy?",
        content: `
          <h3>Higiena i dezynfekcja</h3>
          <p>To kwestia zdrowia, nie estetyki. Sprawdź:</p>
          <ul style="margin:8px 0 12px 22px;list-style:disc;line-height:1.9;font-size:15px;color:#4a3f42;">
            <li><strong>Autoklawowanie metalowych narzędzi</strong> (pilniki, cążki)
            lub stosowanie jednorazowych zestawów — każdy klient powinien mieć
            swój sterylny zestaw.</li>
            <li><strong>Wymiana pilników i buforów</strong> — jednorazowe lub
            przypisane konkretnemu klientowi.</li>
            <li><strong>Dezynfekcja rąk i stanowiska</strong> przed zabiegiem.</li>
            <li><strong>Wentylacja lub odciąg pyłu</strong> przy frezarce.</li>
          </ul>

          <h3>Czas zabiegu</h3>
          <p>Prawidłowy manicure hybrydowy (z przygotowaniem i usunięciem starego
          koloru) powinien trwać <strong>minimum 45–60 min</strong>.
          Zbyt krótki zabieg to sygnał, że pominięto etapy przygotowania
          płytki lub skrócono utwardzanie.</p>

          <h3>Marka i jakość produktów</h3>
          <p>Zapytaj, z jakich produktów korzysta salon. Renomowane marki
          (Semilac, Indigo, Victoria Vynn, Kodi Professional, Palu)
          spełniają normy bezpieczeństwa EU i mają certyfikaty.
          Produkty nieznanego pochodzenia mogą zawierać alergeny
          i substancje drażniące (np. MMA — metyloakrylan metylu)
          zakazane w UE w manicure zawodowym.</p>

          <h3>Certyfikaty i szkolenia stylistki</h3>
          <p>Dobra stylistka paznokci ma ukończone szkolenia z konkretnych
          systemów produktów i regularnie aktualizuje wiedzę. Nie bój się pytać
          o kwalifikacje — profesjonalny salon chętnie o nich opowie.</p>
        `,
      },
      {
        h2: "Pielęgnacja paznokci między wizytami — jak przedłużyć efekt?",
        content: `
          <p>Trwałość manicure zależy nie tylko od tego, co dzieje się w salonie,
          ale też od codziennej pielęgnacji:</p>
          <ul style="margin:8px 0 12px 22px;list-style:disc;line-height:1.9;font-size:15px;color:#4a3f42;">
            <li><strong>Olejek do skórek</strong> — jojoba, migdałowy lub specjalny
            olejek do paznokci; aplikuj wieczorem na skórki i wolny brzeg płytki.
            Nawilżona skórka nie pęka, nie oderwie też hybrydy przy wolnym brzegu.</li>
            <li><strong>Krem do rąk z SPF</strong> — UV przyspiesza żółknięcie
            jasnych hybryd i degradację żelu; filtr rano przedłuży świeżość koloru.</li>
            <li><strong>Rękawiczki ochronne</strong> przy sprzątaniu, myciu naczyń,
            pracy w ogrodzie — detergenty i woda to główne czynniki skracające trwałość.</li>
            <li><strong>Suplementacja</strong> — biotyna, cynk i witamina D wspierają
            strukturę płytki od wewnątrz; szczególnie ważne przy łamliwych paznokciach.</li>
          </ul>
        `,
      },
      {
        h2: `Salon paznokciowy w ${PORTAL_LOCALE.regionIn}`,
        content: `
          <p>Szukasz sprawdzonego salonu paznokciowego w ${PORTAL_LOCALE.regionIn}?
          Zabiegi Odart dopasuje Cię do gabinetów oferujących manicure hybrydowy,
          żelowy lub przedłużanie paznokci — na podstawie Twoich preferencji
          i stanu płytki. Nie przeglądasz katalogu — dostajesz konkretne
          dopasowanie do salonu z odpowiednią specjalizacją.</p>
        `,
      },
    ],
  },

  "masaz-relaksacyjny-sportowy": {
    title: "Masaż relaksacyjny czy sportowy — co wybrać?",
    headline: "Masaż relaksacyjny czy sportowy — czym się różnią i który wybrać?",
    excerpt:
      "Masaż relaksacyjny redukuje stres i napięcie emocjonalne, sportowy regeneruje mięśnie i likwiduje przeciążenia po treningu — ale to nie jedyna różnica. Dowiedz się, czym różnią się techniki, wskazania i efekty, jak się przygotować i jak znaleźć dobrego masażystę.",
    keywords: [
      "masaż relaksacyjny",
      "masaż sportowy",
      "rodzaje masażu",
      "masaż klasyczny",
      "masaż tkanek głębokich",
      "masaż regeneracyjny",
      "jak wybrać masaż",
      `masażysta ${PORTAL_LOCALE.region}`,
    ],
    readingTime: 8,
    datePublished: "2026-02-01",
    dateModified: "2026-02-18",
    relatedSlugs: ["przygotowanie-skory", "manicure-wybor"],
    ctaText: "Znajdź salon masażu",
    ctaHref: "/portal/gabinety",
    faq: [
      {
        q: "Czy masaż sportowy boli?",
        a: "Może być intensywny — szczególnie praca na punktach spustowych i głęboka praca na tkankach. Jednak ból nie powinien być ostry ani nie do zniesienia. Prawidłowa zasada: dyskomfort do 7/10 w skali odczuć jest akceptowalny; jeśli mimowolnie napinasz ciało, masażysta naciska za mocno. Zawsze komunikuj swoje odczucia — dobry specjalista dostosuje nacisk.",
      },
      {
        q: "Jak często można się masować?",
        a: "Masaż relaksacyjny raz w tygodniu lub co 2 tygodnie to bezpieczna częstotliwość dla większości osób. Masaż sportowy w celach regeneracyjnych — 1–2 razy w tygodniu przy intensywnym treningu. Masaż leczniczy (terapeutyczny) — według zaleceń fizjoterapeuty lub masażysty. Po pierwszej sesji daj sobie 48–72 h na regenerację.",
      },
      {
        q: "Co lepsze na ból pleców — masaż relaksacyjny czy sportowy?",
        a: "Zależy od przyczyny. Przewlekłe napięcia z siedzącego trybu życia i stresu — masaż relaksacyjny lub klasyczny dobrze rozluźni mięśnie przykręgosłupowe. Przeciążenia po treningu, punkty spustowe (twarde, bolesne guzki w mięśniu) lub przykurcze powięziowe — masaż sportowy lub terapeutyczny głęboki. Przy bólu korzeniowym, dyskopatii lub po urazach — najpierw fizjoterapeuta.",
      },
      {
        q: "Jak przygotować się do masażu?",
        a: "Nie jedz obficie na 1–2 h przed zabiegiem. Weź prysznic — skóra powinna być czysta (ułatwia pracę z olejkami). Poinformuj masażystę o kontuzjach, chorobach, lekach i obszarach, których nie chcesz masować. Po masażu wypij dużo wody — wspomaga wypłukiwanie produktów metabolizmu z mięśni.",
      },
      {
        q: "Czy masaż można wykonywać przy żylakach?",
        a: "Żylaki to bezwzględne przeciwwskazanie do masażu klasycznego i sportowego w obszarze ich występowania. Ucisk na żylaki może prowadzić do zakrzepicy. Informuj masażystę o wszelkich zmianach naczyniowych. Masaż można wykonywać poza obszarem żylaków, jeśli nie ma innych przeciwwskazań.",
      },
    ],
    sections: [
      {
        h2: "Czym różnią się rodzaje masażu — krótki przegląd",
        content: `
          <p>„Masaż" to bardzo szerokie pojęcie — obejmuje dziesiątki technik o różnych
          celach, intensywności i wskazaniach. Zanim zdecydujesz, warto rozumieć
          podstawowe kategorie:</p>
          <ul style="margin:10px 0 12px 22px;list-style:disc;line-height:1.9;font-size:15px;color:#4a3f42;">
            <li><strong>Masaż klasyczny (szwedzki)</strong> — fundament większości technik;
            5 podstawowych chwytów (głaskanie, rozcieranie, ugniatanie, oklepywanie,
            wibracja); zakres od relaksującego do głębokiego.</li>
            <li><strong>Masaż relaksacyjny</strong> — odmiana klasycznego o łagodnym,
            równomiernym nacisku; priorytet: redukcja napięcia nerwowego i stresu.</li>
            <li><strong>Masaż sportowy</strong> — głębsza praca na tkankach mięśniowych
            i powięzi; punkty spustowe, stretching; cel: regeneracja i wydajność.</li>
            <li><strong>Masaż tkanek głębokich (deep tissue)</strong> — intensywna praca
            na głębokich warstwach mięśni i powięzi; terapeutyczny, nie relaksacyjny.</li>
            <li><strong>Masaż terapeutyczny / leczniczy</strong> — ukierunkowany
            na konkretny problem (kręgosłup, barki, biodra); często element rehabilitacji.</li>
            <li><strong>Masaż tajski, shiatsu, refleksologia</strong> — techniki
            wschodnie; praca na meridianach, punktach akupresury i rozciąganie
            w pozycjach jogi.</li>
          </ul>
        `,
      },
      {
        h2: "Masaż relaksacyjny — jak działa i kto skorzysta najbardziej?",
        content: `
          <h3>Techniki i przebieg</h3>
          <p>Masaż relaksacyjny opiera się na <strong>długich, płynnych głaskaniach
          (effleurage)</strong> i umiarkowanym ugniataniu (petrissage). Ruchy są wolne,
          rytmiczne i obejmują całe ciało lub wybrane partie. Nacisk jest komfortowy —
          nigdy bolesny. Czas sesji: zazwyczaj 60–90 minut.</p>

          <h3>Efekty fizjologiczne</h3>
          <ul style="margin:8px 0 12px 22px;list-style:disc;line-height:1.9;font-size:15px;color:#4a3f42;">
            <li><strong>Obniżenie kortyzolu</strong> — badania pokazują spadek poziomu
            kortyzolu (hormonu stresu) o 30–50% po 45-minutowej sesji.</li>
            <li><strong>Wzrost serotoniny i dopaminy</strong> — poprawia nastrój,
            redukuje lęk, ułatwia zasypianie.</li>
            <li><strong>Aktywacja układu przywspółczulnego</strong> — zwolnienie
            rytmu serca, obniżenie ciśnienia krwi, rozluźnienie mięśni.</li>
            <li><strong>Poprawa mikrokrążenia</strong> — rozgrzanie tkanek,
            lepsze odżywienie skóry i mięśni.</li>
          </ul>

          <h3>Dla kogo?</h3>
          <ul style="margin:8px 0 12px 22px;list-style:disc;line-height:1.9;font-size:15px;color:#4a3f42;">
            <li>Osoby z przewlekłym stresem i napięciem emocjonalnym.</li>
            <li>Praca siedząca — bóle pleców wynikające z napięcia, nie urazów.</li>
            <li>Problemy ze snem i regeneracją.</li>
            <li>Profilaktycznie — jako regularny reset raz na 2–4 tygodnie.</li>
            <li>Osoby niesportowe, starsze lub z niską tolerancją bólu.</li>
          </ul>
        `,
      },
      {
        h2: "Masaż sportowy — techniki, wskazania i czego się spodziewać",
        content: `
          <h3>Techniki i przebieg</h3>
          <p>Masaż sportowy łączy techniki klasyczne z <strong>głęboką pracą
          na tkankach (deep tissue)</strong>, uwalnianiem punktów spustowych
          (trigger points) i rozciąganiem powięziowym. Nacisk jest znacznie
          większy niż w masażu relaksacyjnym — masażysta pracuje łokciami,
          przedramionami i kciukami na konkretnych grupach mięśniowych.
          Sesja może być bolesna, szczególnie przy przykurczach i punktach spustowych.</p>

          <h3>Masaż przed treningiem vs. po treningu</h3>
          <ul style="margin:8px 0 12px 22px;list-style:disc;line-height:1.9;font-size:15px;color:#4a3f42;">
            <li><strong>Przed treningiem (rozgrzewający)</strong> — szybkie,
            energetyzujące techniki (tapotement, rozcieranie); rozgrzewa mięśnie,
            zwiększa elastyczność i zakres ruchu. Czas: 15–20 min.</li>
            <li><strong>Po treningu (regeneracyjny)</strong> — wolniejszy, głębszy;
            usuwa produkty przemiany materii (kwas mlekowy), zmniejsza DOMS
            (zakwasy), przyspiesza regenerację. Czas: 45–90 min;
            najlepiej 2–6 h po wysiłku.</li>
          </ul>

          <h3>Punkty spustowe — co to jest?</h3>
          <p>Punkt spustowy (trigger point) to <strong>lokalne, nadmiernie napięte
          włókno mięśniowe</strong> — twarde „gruzełki" w mięśniu, które są bolesne
          przy ucisku i mogą promieniować bólem do innych obszarów (np. punkt
          w mięśniu czworobocznym promieniuje do głowy powodując ból napięciowy).
          Masażysta identyfikuje je dotykiem i uwalnia przez długotrwały, stopniowany
          ucisk — odczucie „boli, ale dobrze".</p>

          <h3>Dla kogo?</h3>
          <ul style="margin:8px 0 12px 22px;list-style:disc;line-height:1.9;font-size:15px;color:#4a3f42;">
            <li>Osoby aktywne fizycznie: biegacze, kolarze, pływacy, siłownia.</li>
            <li>Przeciążenia mięśniowe z pracy fizycznej lub powtarzalnych ruchów.</li>
            <li>Przewlekłe napięcia szyi, barków i lędźwi — szczególnie przy punktach spustowych.</li>
            <li>Przygotowanie do zawodów i regeneracja po intensywnym treningu.</li>
          </ul>
        `,
      },
      {
        h2: "Masaż relaksacyjny vs. sportowy — tabela porównawcza",
        content: `
          <div style="overflow-x:auto;margin:8px 0 16px;">
            <table style="width:100%;border-collapse:collapse;font-size:14px;font-family:inherit;">
              <thead>
                <tr style="background:#fdf2f5;">
                  <th style="padding:10px 14px;text-align:left;border-bottom:2px solid #f0d6de;color:#1F1A1C;font-weight:600;"></th>
                  <th style="padding:10px 14px;text-align:left;border-bottom:2px solid #f0d6de;color:#1F1A1C;font-weight:600;">Relaksacyjny</th>
                  <th style="padding:10px 14px;text-align:left;border-bottom:2px solid #f0d6de;color:#1F1A1C;font-weight:600;">Sportowy</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom:1px solid #f5e8ec;">
                  <td style="padding:9px 14px;color:#6F5E64;font-weight:500;">Cel</td>
                  <td style="padding:9px 14px;color:#4a3f42;">Relaks, redukcja stresu</td>
                  <td style="padding:9px 14px;color:#4a3f42;">Regeneracja, wydajność</td>
                </tr>
                <tr style="background:#fdfbfc;border-bottom:1px solid #f5e8ec;">
                  <td style="padding:9px 14px;color:#6F5E64;font-weight:500;">Nacisk</td>
                  <td style="padding:9px 14px;color:#4a3f42;">Lekki–umiarkowany</td>
                  <td style="padding:9px 14px;color:#4a3f42;">Umiarkowany–głęboki</td>
                </tr>
                <tr style="border-bottom:1px solid #f5e8ec;">
                  <td style="padding:9px 14px;color:#6F5E64;font-weight:500;">Odczucia</td>
                  <td style="padding:9px 14px;color:#4a3f42;">Przyjemny, zasypiający</td>
                  <td style="padding:9px 14px;color:#4a3f42;">Może być intensywny</td>
                </tr>
                <tr style="background:#fdfbfc;border-bottom:1px solid #f5e8ec;">
                  <td style="padding:9px 14px;color:#6F5E64;font-weight:500;">Czas</td>
                  <td style="padding:9px 14px;color:#4a3f42;">60–90 min</td>
                  <td style="padding:9px 14px;color:#4a3f42;">45–90 min</td>
                </tr>
                <tr style="border-bottom:1px solid #f5e8ec;">
                  <td style="padding:9px 14px;color:#6F5E64;font-weight:500;">Częstotliwość</td>
                  <td style="padding:9px 14px;color:#4a3f42;">Co 2–4 tygodnie</td>
                  <td style="padding:9px 14px;color:#4a3f42;">1–2× tygodniowo</td>
                </tr>
                <tr style="background:#fdfbfc;">
                  <td style="padding:9px 14px;color:#6F5E64;font-weight:500;">Po sesji</td>
                  <td style="padding:9px 14px;color:#4a3f42;">Senność, błogość</td>
                  <td style="padding:9px 14px;color:#4a3f42;">Możliwa tkliwość 24–48 h</td>
                </tr>
              </tbody>
            </table>
          </div>
        `,
      },
      {
        h2: "Inne popularne rodzaje masażu — kiedy warto sięgnąć po coś innego?",
        content: `
          <h3>Masaż tkanek głębokich (deep tissue)</h3>
          <p>Bardziej terapeutyczny niż sportowy — wolniejszy, skupiony
          na głębokich przykurczach i bliznach tkankowych. Dobry przy
          przewlekłych bólach kręgosłupa, bólach barku (stożek rotatorów)
          i syndromie cieśni nadgarstka.</p>

          <h3>Masaż gorącymi kamieniami (hot stone)</h3>
          <p>Kamienie bazaltowe nagrzane do 50–60°C rozluźniają mięśnie głębiej
          niż ręce — ciepło penetruje tkankę na 3–4 cm. Doskonały przy
          bardzo napiętych mięśniach i frygidyzmie mięśniowym w zimnych porach roku.
          Nie stosować przy żylakach, cukrzycy i zaburzeniach czucia.</p>

          <h3>Masaż tajski</h3>
          <p>Połączenie akupresury i pasywnej jogi — masażysta rozciąga ciało
          w różnych pozycjach bez olejków. Poprawia elastyczność, uwalnia
          energię meridianów. Intensywność może być wysoka. Dobry przy
          sztywności i słabej elastyczności.</p>

          <h3>Refleksologia stóp</h3>
          <p>Ucisk na punkty na stopach odpowiadające organom wewnętrznym.
          Efekt relaksacyjny pewny; wpływ na narządy — niepotwierdzony klinicznie,
          ale efekty ogólnego odprężenia są dobrze udokumentowane.
          Świetna alternatywa dla osób, które nie lubią masażu całego ciała.</p>
        `,
      },
      {
        h2: "Jak się przygotować do masażu i co robić po?",
        content: `
          <h3>Przed masażem</h3>
          <ul style="margin:8px 0 12px 22px;list-style:disc;line-height:1.9;font-size:15px;color:#4a3f42;">
            <li>Nie jedz obficie na <strong>1–2 h przed</strong> zabiegiem.</li>
            <li>Weź prysznic — czysta skóra ułatwia pracę z olejkami
            i jest kwestią higieny dla masażysty.</li>
            <li>Poinformuj o <strong>kontuzjach, chorobach, lekach
            rozrzedzających krew</strong> i obszarach, których nie chcesz masować.</li>
            <li>Jeśli masz żylaki — koniecznie poinformuj masażystę (zakaz masowania
            tych obszarów).</li>
          </ul>

          <h3>Po masażu</h3>
          <ul style="margin:8px 0 12px 22px;list-style:disc;line-height:1.9;font-size:15px;color:#4a3f42;">
            <li><strong>Pij wodę</strong> — masaż pobudza limfę i uwalnia
            produkty metabolizmu; nawodnienie wspomaga ich eliminację.</li>
            <li>Unikaj intensywnego wysiłku bezpośrednio po sesji
            — mięśnie potrzebują chwili na adaptację.</li>
            <li>Po masażu sportowym możliwa tkliwość mięśni przez 24–48 h
            (jak po treningu) — to normalne, nie uszkodzenie.</li>
            <li>Kąpiel w ciepłej (nie gorącej) wodzie po masażu relaksacyjnym
            przedłuży efekt rozluźnienia.</li>
          </ul>
        `,
      },
      {
        h2: "Przeciwwskazania do masażu — kiedy się nie masować?",
        content: `
          <p>Masaż nie jest odpowiedni w każdej sytuacji. Bezwzględne
          przeciwwskazania:</p>
          <ul style="margin:8px 0 12px 22px;list-style:disc;line-height:1.9;font-size:15px;color:#4a3f42;">
            <li><strong>Gorączka i stany zapalne</strong> — masaż rozgrzewa
            ciało i może nasilić infekcję.</li>
            <li><strong>Żylaki i zakrzepica</strong> — ryzyko przemieszczenia
            zakrzepu (zatorowość płucna).</li>
            <li><strong>Świeże urazy (złamania, stłuczenia, skręcenia)</strong>
            — obszar urazu wymaga spokoju, nie ucisku.</li>
            <li><strong>Nowotwory</strong> — bez zgody onkologa; masaż może
            pobudzać krążenie limfatyczne.</li>
            <li><strong>Ciąża I trymestr</strong> — szczególna ostrożność;
            masaż prenatalny w II i III trymestrze u specjalisty jest bezpieczny.</li>
            <li><strong>Skórne stany zapalne, łuszczyca w fazie zaostrzenia,
            otwarty trądzik</strong> — w obszarze zmian.</li>
          </ul>
          <p>Przy jakichkolwiek wątpliwościach — skonsultuj z lekarzem
          przed pierwszą sesją.</p>
        `,
      },
      {
        h2: `Salon masażu w ${PORTAL_LOCALE.regionIn}`,
        content: `
          <p>Szukasz sprawdzonego masażysty w ${PORTAL_LOCALE.regionIn}?
          Zabiegi Odart dopasuje Cię do gabinetów oferujących masaż relaksacyjny,
          sportowy lub terapeutyczny — na podstawie Twoich potrzeb i oczekiwań.
          Nie przeglądasz katalogu — dostajesz konkretne dopasowanie do miejsca
          z odpowiednią specjalizacją i technikami.</p>
        `,
      },
    ],
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const ARTICLE_TITLES: Record<string, string> = Object.fromEntries(
  Object.entries(ARTICLES).map(([slug, a]) => [slug, a.title])
);

// ─── Page ─────────────────────────────────────────────────────────────────────

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return Object.keys(ARTICLES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const article = ARTICLES[slug];
  if (!article) return { title: "Artykuł" };
  return {
    title: article.title,
    description: article.excerpt,
    keywords: article.keywords.join(", "),
    alternates: { canonical: `${SITE_URL}/portal/artykuly/${slug}` },
    openGraph: {
      title: article.headline,
      description: article.excerpt,
      url: `${SITE_URL}/portal/artykuly/${slug}`,
      type: "article",
      publishedTime: article.datePublished,
      modifiedTime: article.dateModified,
      locale: "pl_PL",
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = ARTICLES[slug];
  if (!article) notFound();

  const jsonLdGraph: object[] = [
    {
      "@type": "Article",
      "@id": `${SITE_URL}/portal/artykuly/${slug}#article`,
      headline: article.headline,
      description: article.excerpt,
      datePublished: article.datePublished,
      dateModified: article.dateModified,
      author: { "@type": "Organization", name: "Zabiegi Odart", url: `${SITE_URL}/portal` },
      publisher: { "@type": "Organization", name: "Zabiegi Odart", url: `${SITE_URL}/portal` },
      mainEntityOfPage: `${SITE_URL}/portal/artykuly/${slug}`,
      keywords: article.keywords.join(", "),
      inLanguage: "pl",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Zabiegi Odart", item: `${SITE_URL}/portal` },
        { "@type": "ListItem", position: 2, name: "Artykuły", item: `${SITE_URL}/portal/artykuly` },
        { "@type": "ListItem", position: 3, name: article.title, item: `${SITE_URL}/portal/artykuly/${slug}` },
      ],
    },
  ];

  if (article.faq && article.faq.length > 0) {
    jsonLdGraph.push({
      "@type": "FAQPage",
      mainEntity: article.faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    });
  }

  const jsonLd = { "@context": "https://schema.org", "@graph": jsonLdGraph };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeaderPortal />
      <main>
        {/* ── HERO ── */}
        <section className="border-b border-neutral-100 bg-white py-10 lg:py-14">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 font-[var(--font-sans)] text-[13px] text-neutral-400">
              <Link href="/portal" className="hover:text-pink-600">Zabiegi Odart</Link>
              <span>›</span>
              <Link href="/portal/artykuly" className="hover:text-pink-600">Artykuły</Link>
              <span>›</span>
              <span className="text-[#6F5E64]">{article.title}</span>
            </nav>

            <h1 className="font-[var(--font-serif)] text-2xl font-normal leading-tight text-[#1F1A1C] sm:text-3xl lg:text-[2.2rem]">
              {article.headline}
            </h1>
            <p className="mt-4 font-[var(--font-sans)] text-[15px] leading-relaxed text-[#6F5E64]">
              {article.excerpt}
            </p>
            <p className="mt-4 font-[var(--font-sans)] text-[13px] text-neutral-400">
              Czas czytania: ok. {article.readingTime} min ·{" "}
              Zaktualizowano:{" "}
              {new Date(article.dateModified).toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        </section>

        {/* ── TREŚĆ ── */}
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <article className="prose-custom space-y-10">
            {article.sections.map((section, i) => (
              <section key={i}>
                <h2 className="font-[var(--font-serif)] text-xl font-normal text-[#1F1A1C] sm:text-2xl">
                  {section.h2}
                </h2>
                <div
                  className="mt-4 space-y-4 font-[var(--font-sans)] text-[15px] leading-relaxed text-[#4a3f42] [&_h3]:mt-6 [&_h3]:font-sans [&_h3]:text-[16px] [&_h3]:font-semibold [&_h3]:text-[#1F1A1C] [&_p]:leading-relaxed [&_strong]:font-semibold [&_strong]:text-[#1F1A1C]"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              </section>
            ))}
          </article>

          {/* FAQ */}
          {article.faq && article.faq.length > 0 && (
            <div className="mt-12 border-t border-neutral-100 pt-10">
              <h2 className="font-[var(--font-serif)] text-xl font-normal text-[#1F1A1C]">
                Najczęstsze pytania
              </h2>
              <dl className="mt-6 space-y-6">
                {article.faq.map((item, i) => (
                  <div key={i} className="rounded-xl border border-neutral-100 bg-neutral-50/60 px-5 py-5">
                    <dt className="font-[var(--font-sans)] text-[15px] font-semibold text-[#1F1A1C]">
                      {item.q}
                    </dt>
                    <dd className="mt-2 font-[var(--font-sans)] text-[15px] leading-relaxed text-[#4a3f42]">
                      {item.a}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* CTA */}
          {article.ctaText && article.ctaHref && (
            <div className="mt-12 rounded-2xl border border-pink-100 bg-pink-50/50 px-6 py-8 text-center">
              <p className="font-[var(--font-sans)] text-[15px] text-[#6F5E64]">
                Szukasz gabinetu w {PORTAL_LOCALE.regionIn}?
              </p>
              <Link
                href={article.ctaHref}
                className="mt-4 inline-block rounded-full border border-pink-400 bg-white px-6 py-3 font-[var(--font-sans)] text-[15px] font-medium text-pink-600 transition-all hover:bg-pink-600 hover:text-white"
              >
                {article.ctaText} →
              </Link>
            </div>
          )}

          {/* Powiązane artykuły */}
          {article.relatedSlugs.length > 0 && (
            <div className="mt-12 border-t border-neutral-100 pt-10">
              <h2 className="font-[var(--font-serif)] text-xl font-normal text-[#1F1A1C]">
                Powiązane artykuły
              </h2>
              <ul className="mt-4 space-y-3">
                {article.relatedSlugs
                  .filter((s) => ARTICLE_TITLES[s])
                  .map((s) => (
                    <li key={s}>
                      <Link
                        href={`/portal/artykuly/${s}`}
                        className="font-[var(--font-sans)] text-[15px] font-medium text-pink-600 hover:underline"
                      >
                        → {ARTICLE_TITLES[s]}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {/* Powrót */}
          <p className="mt-10">
            <Link href="/portal/artykuly" className="font-[var(--font-sans)] text-[14px] text-pink-600 hover:underline">
              ← Wszystkie artykuły
            </Link>
          </p>
        </div>
      </main>
      <FooterPortal />
    </>
  );
}
