/**
 * Pełny katalog zabiegów (rynek PL) – źródło do seeda i fallback gdy DB niedostępna.
 * Każdy zabieg: id (snake_case), nazwa, opis (1–2 zdania), problemIds (1–4), czas (min), cena_od (PLN).
 */
import type { ProblemId, Treatment } from "./schema";

export const TREATMENTS_CATALOG_FULL: Treatment[] = [
  { id: "oczyszczanie_manualne", nazwa: "Oczyszczanie manualne", opis: "Manualne usunięcie zaskórników i niedoskonałości. Odświeżenie i wyrównanie kolorytu.", problemy: ["tradzik"], czas: 60, cena_od: 120 },
  { id: "oczyszczanie_wodorowe", nazwa: "Oczyszczanie wodorowe", opis: "Delikatne oczyszczanie z użyciem wody i preparatów. Redukcja zaskórników i łagodne rozjaśnienie.", problemy: ["tradzik", "przebarwienia"], czas: 45, cena_od: 140 },
  { id: "peeling_kawitacyjny", nazwa: "Peeling kawitacyjny", opis: "Delikatne oczyszczanie, redukcja zaskórników, odświeżenie skóry.", problemy: ["tradzik"], czas: 45, cena_od: 160 },
  { id: "peeling_chemiczny_aha_bha", nazwa: "Peeling chemiczny AHA/BHA", opis: "Złuszczanie kontrolowane. Praca nad trądzikiem i przebarwieniami (dobór kwasu).", problemy: ["tradzik", "przebarwienia"], czas: 45, cena_od: 190 },
  { id: "peeling_tca", nazwa: "Peeling TCA", opis: "Średniogłęboki peeling trichlorooctowy. Redukcja przebarwień i blizn potrądzikowych.", problemy: ["przebarwienia", "tradzik"], czas: 45, cena_od: 280 },
  { id: "mikrodermabrazja", nazwa: "Mikrodermabrazja", opis: "Mechaniczne złuszczanie naskórka. Wygładzenie i poprawa tekstury.", problemy: ["tradzik", "przebarwienia"], czas: 50, cena_od: 180 },
  { id: "dermapen_mikronakluwanie", nazwa: "Dermapen / mikronakłuwanie", opis: "Stymulacja kolagenu i wchłanianie składników aktywnych. Poprawa tekstury, blizn i zmarszczek.", problemy: ["tradzik", "przebarwienia", "zmarszczki", "jedrnost"], czas: 60, cena_od: 350 },
  { id: "laser_frakcyjny", nazwa: "Laser frakcyjny CO2 / ablacyjny", opis: "Odbudowa kolagenu, redukcja blizn i przebarwień, lifting.", problemy: ["przebarwienia", "zmarszczki", "jedrnost"], czas: 45, cena_od: 500 },
  { id: "terapia_witamina_c", nazwa: "Terapia witaminą C", opis: "Rozjaśnienie, antyoksydacja i wsparcie kolagenu. Efekt świeżości i równomiernego kolorytu.", problemy: ["przebarwienia", "anti_aging"], czas: 45, cena_od: 200 },
  { id: "mezoterapia_beziglowa", nazwa: "Mezoterapia bezigłowa", opis: "Wprowadzenie składników aktywnych bez naruszania ciągłości skóry. Nawilżenie i ukojenie.", problemy: ["sucha_skora", "anti_aging", "zmarszczki"], czas: 60, cena_od: 250 },
  { id: "mezoterapia_iglowa_ha", nazwa: "Mezoterapia igłowa (kwas hialuronowy)", opis: "Intensywne nawilżenie i biorewitalizacja (po kwalifikacji).", problemy: ["anti_aging", "zmarszczki", "sucha_skora"], czas: 45, cena_od: 350 },
  { id: "mezoterapia_witaminowa", nazwa: "Mezoterapia witaminowa", opis: "Koktajl witamin i minerałów. Nawilżenie, odżywienie i wsparcie bariery.", problemy: ["sucha_skora", "anti_aging"], czas: 45, cena_od: 220 },
  { id: "infuzja_tlenowa", nazwa: "Infuzja tlenowa", opis: "Dotlenienie i nawilżenie skóry, wsparcie bariery, efekt świeżości.", problemy: ["sucha_skora", "naczynka", "anti_aging"], czas: 45, cena_od: 220 },
  { id: "kwas_hialuronowy_zabieg", nazwa: "Zabieg nawilżający z kwasem hialuronowym", opis: "Silne nawilżenie, komfort skóry, wsparcie regeneracji bariery.", problemy: ["sucha_skora", "anti_aging", "zmarszczki"], czas: 60, cena_od: 240 },
  { id: "zabiegi_lagodzace_bariera", nazwa: "Terapia łagodząca i odbudowa bariery", opis: "Zabieg kojący, wsparcie bariery hydrolipidowej, redukcja reaktywności.", problemy: ["sucha_skora", "naczynka"], czas: 60, cena_od: 210 },
  { id: "maska_algowa_chlodzaca", nazwa: "Maska algowa chłodząca (zabieg)", opis: "Kojenie, redukcja zaczerwienień, komfort skóry wrażliwej.", problemy: ["naczynka", "sucha_skora"], czas: 30, cena_od: 120 },
  { id: "laser_naczynka", nazwa: "Laser na naczynka", opis: "Selektywne zamykanie poszerzonych naczynek. Redukcja rumienia i couperose.", problemy: ["naczynka"], czas: 30, cena_od: 250 },
  { id: "ipl_naczynka", nazwa: "IPL na naczynka i rumień", opis: "Światło pulsacyjne. Redukcja zaczerwienień i widocznych naczynek.", problemy: ["naczynka"], czas: 30, cena_od: 220 },
  { id: "terapia_naczynkowa", nazwa: "Terapia naczynkowa (zabieg)", opis: "Preparaty i techniki łagodzące skórę naczyniową. Wzmacnianie ścian naczyń.", problemy: ["naczynka", "sucha_skora"], czas: 45, cena_od: 180 },
  { id: "stymulatory_tkankowe", nazwa: "Stymulatory tkankowe (PDRN / polinukleotydy)", opis: "Stymulacja regeneracji i odbudowy. Poprawa gęstości i jędrności skóry.", problemy: ["zmarszczki", "jedrnost", "owal"], czas: 45, cena_od: 400 },
  { id: "osocze_bogatoplytkowe_prp", nazwa: "Osocze bogatopłytkowe (PRP)", opis: "Autologiczny koncentrat czynników wzrostu. Regeneracja i lifting.", problemy: ["zmarszczki", "jedrnost"], czas: 60, cena_od: 450 },
  { id: "rf_mikroiglowa", nazwa: "RF mikroigłowa (radiofrekwencja)", opis: "Podgrzanie skóry właściwej przez mikroigły. Lifting i zagęszczenie.", problemy: ["jedrnost", "owal", "zmarszczki"], czas: 60, cena_od: 500 },
  { id: "hifu", nazwa: "HIFU (ultradźwięki)", opis: "Lifting nieinwazyjny. Stymulacja SMAS i skóry właściwej.", problemy: ["owal", "jedrnost"], czas: 60, cena_od: 600 },
  { id: "zabieg_bankietowy", nazwa: "Zabieg bankietowy / express", opis: "Szybkie nawilżenie i świeży wygląd. Idealny przed ważnym wyjściem.", problemy: ["sucha_skora", "anti_aging"], czas: 30, cena_od: 150 },
  { id: "elektrostymulacja_twarzy", nazwa: "Elektrostymulacja twarzy", opis: "Trening mięśni mimicznych. Wygładzenie i podniesienie owalu.", problemy: ["owal", "zmarszczki"], czas: 45, cena_od: 180 },
  { id: "massaż_limfatyczny_twarz", nazwa: "Masaż limfatyczny twarzy", opis: "Drenaż i detoksykacja. Zmniejszenie obrzęków i worków pod oczami.", problemy: ["owal", "anti_aging"], czas: 45, cena_od: 160 },
  { id: "mezoterapia_beziglowa_elektroporacja", nazwa: "Mezoterapia bezigłowa (elektroporacja)", opis: "Wzmocnione wchłanianie składników bez nakłuwania. Nawilżenie i odżywienie.", problemy: ["sucha_skora", "anti_aging"], czas: 45, cena_od: 220 },
  { id: "oxybrazja", nazwa: "Oxybrazja", opis: "Oczyszczanie i dotlenienie w jednym. Delikatne złuszczanie i świeży wygląd.", problemy: ["tradzik", "sucha_skora"], czas: 45, cena_od: 170 },
  { id: "hydrafacial", nazwa: "HydraFacial", opis: "Oczyszczanie, ekstrakcja i nawilżenie w jednym zabiegu. Uniwersalny dla wielu typów skóry.", problemy: ["tradzik", "przebarwienia", "sucha_skora"], czas: 60, cena_od: 350 },
  { id: "peeling_ferulowy", nazwa: "Peeling kwasem ferulowym", opis: "Rozjaśnienie i antyoksydacja. Wsparcie przy przebarwieniach i fotostarzeniu.", problemy: ["przebarwienia", "anti_aging"], czas: 45, cena_od: 200 },
  { id: "peeling_retinolowy", nazwa: "Peeling retinolowy", opis: "Przyspieszenie odnowy naskórka. Redukcja zmarszczek i przebarwień.", problemy: ["anti_aging", "zmarszczki", "przebarwienia"], czas: 45, cena_od: 220 },
  { id: "nanoneedling", nazwa: "Nanoneedling", opis: "Delikatne mikronakłuwanie. Wchłanianie składników i poprawa tekstury.", problemy: ["przebarwienia", "sucha_skora", "anti_aging"], czas: 45, cena_od: 280 },
  { id: "led_terapia", nazwa: "Terapia LED (światłoterapia)", opis: "Czerwone światło na regenerację, niebieskie na bakterie. Wsparcie po zabiegach i przy trądziku.", problemy: ["tradzik", "anti_aging"], czas: 20, cena_od: 80 },
  { id: "darsonwal", nazwa: "Darsonwal (prąd wysokiej częstotliwości)", opis: "Lepsze wchłanianie preparatów, łagodzenie stanów zapalnych. Często jako uzupełnienie zabiegu.", problemy: ["tradzik", "naczynka"], czas: 15, cena_od: 50 },
  { id: "sonoforeza", nazwa: "Sonoforeza", opis: "Wprowadzanie składników aktywnych za pomocą ultradźwięków. Nawilżenie i odżywienie.", problemy: ["sucha_skora", "anti_aging"], czas: 30, cena_od: 120 },
  { id: "jonoforeza", nazwa: "Jonoforeza", opis: "Wprowadzanie jonów do skóry prądem. Wsparcie nawilżenia i wchłaniania preparatów.", problemy: ["sucha_skora"], czas: 25, cena_od: 100 },
  { id: "maska_kolagenowa", nazwa: "Maska kolagenowa (zabieg)", opis: "Intensywne nawilżenie i uelastycznienie. Efekt „second skin”.", problemy: ["sucha_skora", "anti_aging", "zmarszczki"], czas: 30, cena_od: 140 },
  { id: "maska_witaminowa", nazwa: "Maska witaminowa", opis: "Bomba witaminowa dla skóry. Świeżość i równomierny koloryt.", problemy: ["przebarwienia", "sucha_skora"], czas: 30, cena_od: 110 },
  { id: "karboksyterapia", nazwa: "Karboksyterapia (CO2)", opis: "Wprowadzenie medycznego CO2. Lepsze dotlenienie i mikrokrążenie. Wsparcie przy cellulicie i skórze wiotkiej.", problemy: ["jedrnost", "owal"], czas: 30, cena_od: 250 },
  { id: "mezoterapia_beziglowa_iglowa_hybryda", nazwa: "Mezoterapia hybrydowa (bezigłowa + igłowa)", opis: "Połączenie obu technik. Maksymalne nawilżenie i odżywienie.", problemy: ["sucha_skora", "anti_aging", "zmarszczki"], czas: 60, cena_od: 380 },

  // Brwi
  { id: "regulacja_brwi", nazwa: "Regulacja brwi", opis: "Kształtowanie i regulacja łuku brwi. Czyszczenie, nadanie formy.", problemy: ["brwi_rzesy"], czas: 30, cena_od: 40 },
  { id: "henna_brwi", nazwa: "Henna brwi", opis: "Barwienie brwi henną. Naturalny, trwały kolor i efekt wypełnienia.", problemy: ["brwi_rzesy"], czas: 45, cena_od: 50 },
  { id: "laminacja_brwi", nazwa: "Laminacja brwi", opis: "Układanie i utrwalenie brwi. Efekt gładkich, ułożonych brwi na kilka tygodni.", problemy: ["brwi_rzesy"], czas: 60, cena_od: 80 },
  { id: "laminacja_brwi_regulacja", nazwa: "Laminacja brwi + regulacja", opis: "Laminacja brwi z regulacją kształtu. Ułożenie i nadanie formy.", problemy: ["brwi_rzesy"], czas: 60, cena_od: 130 },
  { id: "laminacja_brwi_45min", nazwa: "Laminacja brwi (45 min)", opis: "Laminacja brwi w wersji express. Układanie i utrwalenie brwi.", problemy: ["brwi_rzesy"], czas: 45, cena_od: 100 },
  { id: "color_set_brwi", nazwa: "Color Set Brwi", opis: "Trwałe ułożenie i koloryzacja brwi. Efekt wyraźnego, uporządkowanego łuku.", problemy: ["brwi_rzesy"], czas: 60, cena_od: 100 },
  { id: "laminacja_brwi_farbka_regulacja", nazwa: "Laminacja brwi + farbka + regulacja", opis: "Komplet: laminacja, koloryzacja i regulacja brwi. Pełna stylizacja.", problemy: ["brwi_rzesy"], czas: 90, cena_od: 150 },
  { id: "botox_brwi", nazwa: "Botox brwi (lifting brwi)", opis: "Delikatna korekta mimiki. Uniesienie zewnętrznego ogona brwi.", problemy: ["brwi_rzesy"], czas: 30, cena_od: 120 },
  { id: "microblading", nazwa: "Microblading / nano brwi", opis: "Półpermanentne wypełnienie brwi. Efekt naturalnych włosków.", problemy: ["brwi_rzesy"], czas: 120, cena_od: 400 },
  { id: "korekta_brwi", nazwa: "Korekta / podmalowanie brwi", opis: "Uzupełnienie koloru i kształtu. Szybka poprawa wyglądu brwi.", problemy: ["brwi_rzesy"], czas: 30, cena_od: 35 },

  // Makijaż – okolicznościowy i ślubny
  { id: "makijaz_okolicznosciowy", nazwa: "Makijaż okolicznościowy", opis: "Profesjonalny makijaż na wyjątkowe okazje: uroczystości, przyjęcia, wyjścia wieczorowe.", problemy: ["makijaz"], czas: 60, cena_od: 250 },
  { id: "makijaz_slubny_bez_probnego", nazwa: "Makijaż ślubny bez próbnego", opis: "Makijaż ślubny wykonywany bez wcześniejszej próby. Idealny efekt na ten wyjątkowy dzień.", problemy: ["makijaz"], czas: 90, cena_od: 300 },
  { id: "makijaz_probny_slubny", nazwa: "Makijaż próbny ślubny", opis: "Próbny makijaż ślubny – dopasowanie stylu, kolorów i techniki przed dniem wesela.", problemy: ["makijaz"], czas: 90, cena_od: 250 },

  // Makijaż permanentny (Permanent Studio)
  { id: "makijaz_permanentny_brwi", nazwa: "Makijaż permanentny brwi", opis: "Trwałe pigmentowanie brwi. Naturalny kształt i kolor przez 1–2 lata.", problemy: ["brwi_rzesy"], czas: 120, cena_od: 800 },
  { id: "makijaz_permanentny_usta", nazwa: "Makijaż permanentny ust", opis: "Trwałe pigmentowanie ust. Kontur i kolor bez codziennego makijażu.", problemy: ["brwi_rzesy", "anti_aging"], czas: 120, cena_od: 900 },
  { id: "kreska_linia_rzes", nazwa: "Kreska w linii rzęs", opis: "Makijaż permanentny kreski w linii rzęs. Efekt naturalnego eyelinera.", problemy: ["brwi_rzesy"], czas: 90, cena_od: 650 },
  { id: "kreska_dekoracyjna", nazwa: "Kreska dekoracyjna", opis: "Makijaż permanentny kreski dekoracyjnej (eyeliner). Wyraźny kontur oka.", problemy: ["brwi_rzesy"], czas: 90, cena_od: 750 },
  { id: "dopigmentowanie", nazwa: "Dopigmentowanie (touch-up)", opis: "Uzupełnienie koloru i kształtu pigmentacji. Zabieg przypominający co 1–2 lata.", problemy: ["brwi_rzesy"], czas: 60, cena_od: 150 },
  { id: "aureola_brodawka", nazwa: "Aureola / brodawka sutkowa", opis: "Rekonstrukcja pigmentu aureoli i brodawki sutkowej. Zabieg rekonstrukcyjny po operacjach.", problemy: ["anti_aging"], czas: 120, cena_od: 500 },
  { id: "peeling_weglowy", nazwa: "Peeling węglowy", opis: "Zabieg oczyszczający z węglem aktywnym. Redukcja zaskórników, sebum i wygładzenie skóry.", problemy: ["tradzik", "przebarwienia", "anti_aging"], czas: 45, cena_od: 300 },
  { id: "resurfacing", nazwa: "Resurfacing", opis: "Złuszczanie i odnowa skóry. Wygładzenie tekstury i wyrównanie kolorytu.", problemy: ["przebarwienia", "anti_aging"], czas: 45, cena_od: 200 },
  { id: "peeling_weglowy_resurfacing", nazwa: "Peeling węglowy + Resurfacing", opis: "Połączenie peelingu węglowego i resurfacing. Intensywne oczyszczenie i odnowa.", problemy: ["tradzik", "przebarwienia", "anti_aging"], czas: 60, cena_od: 350 },
  { id: "mezoterapia_dermapen_twarz", nazwa: "Mezoterapia Dermapen twarz", opis: "Mikronakłuwanie twarzy z wprowadzeniem koktajlu aktywnych składników. Cena zależna od wybranej ampułki.", problemy: ["anti_aging", "zmarszczki", "przebarwienia"], czas: 60, cena_od: 350 },
  { id: "mezoterapia_dermapen_twarz_szyja_dekolt", nazwa: "Mezoterapia Dermapen twarz + szyja + dekolt", opis: "Mikronakłuwanie twarzy, szyi i dekoltu. Biorewitalizacja i nawilżenie.", problemy: ["anti_aging", "zmarszczki"], czas: 90, cena_od: 600 },
  { id: "mezoterapia_dermapen_cialo", nazwa: "Mezoterapia Dermapen ciało", opis: "Mikronakłuwanie ciała. Cena od wybranej ampułki. Seria 5 zabiegów (3 Dermapen) –20% przy płatności z góry.", problemy: ["anti_aging", "jedrnost"], czas: 45, cena_od: 300 },
  { id: "mezoterapia_twarz_dives", nazwa: "Mezoterapia twarz (DIVES/MESOHEAL/GUNA)", opis: "Mezoterapia igłowa twarzy z preparatami DIVES, MESOHEAL lub GUNA.", problemy: ["anti_aging", "zmarszczki", "sucha_skora"], czas: 45, cena_od: 400 },
  { id: "mezoterapia_neauvia", nazwa: "Mezoterapia NEAUVIA", opis: "Mezoterapia z preparatem NEAUVIA. Nawilżenie i odżywienie skóry twarzy.", problemy: ["anti_aging", "zmarszczki"], czas: 60, cena_od: 600 },
  { id: "mezoterapia_szyja_dekolt_dlonie", nazwa: "Mezoterapia szyja / dekolt / dłonie", opis: "Mezoterapia igłowa szyi, dekoltu lub dłoni. Cena zależna od preparatu.", problemy: ["anti_aging", "zmarszczki"], czas: 60, cena_od: 500 },
  { id: "lipoliza_podbrodek", nazwa: "Lipoliza podbródek", opis: "Iniekcyjna lipoliza podbródka. Redukcja nadmiaru tkanki tłuszczowej w okolicy podbródka.", problemy: ["jedrnost", "owal"], czas: 45, cena_od: 400 },
  { id: "lipoliza_cialo_10ml", nazwa: "Lipoliza ciało 10 ml", opis: "Iniekcyjna lipoliza ciała (10 ml preparatu). Redukcja lokalnej tkanki tłuszczowej.", problemy: ["jedrnost"], czas: 60, cena_od: 500 },
  { id: "lipoliza_cialo_20ml", nazwa: "Lipoliza ciało 20 ml", opis: "Iniekcyjna lipoliza ciała (20 ml preparatu). Skuteczna redukcja tłuszczu w wybranej okolicy.", problemy: ["jedrnost"], czas: 90, cena_od: 700 },

  // Rzęsy – stylizacja
  { id: "przedluzanie_rzes_1_1", nazwa: "Przedłużanie rzęs 1:1", opis: "Jedna sztuczna rzęsa do jednej naturalnej. Naturalny, wydłużony efekt.", problemy: ["brwi_rzesy"], czas: 120, cena_od: 160 },
  { id: "lifting_rzes", nazwa: "Lifting rzęs", opis: "Lifting i odżywianie rzęs. Podniesienie i pogrubienie naturalnych rzęs.", problemy: ["brwi_rzesy"], czas: 45, cena_od: 90 },
  { id: "lifting_rzes_90min", nazwa: "Lifting rzęs (1g 30min)", opis: "Lifting rzęs z pełną pielęgnacją. Podniesienie i odżywienie naturalnych rzęs.", problemy: ["brwi_rzesy"], czas: 90, cena_od: 150 },
  { id: "zdjecie_stylizacji_innej_stylistki", nazwa: "Zdjęcie stylizacji innej stylistki", opis: "Profesjonalne usunięcie przedłużeń wykonanych w innym salonie.", problemy: ["brwi_rzesy"], czas: 40, cena_od: 50 },
  { id: "przedluzanie_rzes_1_1_2g", nazwa: "Przedłużanie 1:1 (2g)", opis: "Przedłużanie rzęs 1:1. Jedna do jednej, naturalny efekt.", problemy: ["brwi_rzesy"], czas: 120, cena_od: 160 },
  { id: "przedluzanie_rzes_2_3d", nazwa: "Przedłużanie 2/3d", opis: "Przedłużanie rzęs w technice 2D/3D. Gęstość i objętość.", problemy: ["brwi_rzesy"], czas: 120, cena_od: 170 },
  { id: "efekt_wispy_2_3d", nazwa: "Efekt Wispy 2/3d", opis: "Stylizacja rzęs Wispy w technice 2D/3D. Naturalnie puszysty efekt.", problemy: ["brwi_rzesy"], czas: 140, cena_od: 190 },
  { id: "liner_rzesy", nazwa: "Liner", opis: "Stylizacja rzęs Liner. Wyraźna linia rzęs, efekt eyeliner.", problemy: ["brwi_rzesy"], czas: 150, cena_od: 200 },
  { id: "mokry_efekt_2_3d", nazwa: "Mokry Efekt 2/3d", opis: "Stylizacja Mokry Efekt w technice 2D/3D. Efekt mokrych, sklejonych rzęs.", problemy: ["brwi_rzesy"], czas: 130, cena_od: 180 },
  { id: "efekt_wispy_4_5d", nazwa: "Efekt Wispy 4/5d", opis: "Stylizacja Wispy w technice 4D/5D. Maksymalna puszystość.", problemy: ["brwi_rzesy"], czas: 140, cena_od: 200 },
  { id: "wild_cat_sensual_lashes", nazwa: "Wild Cat Sensual Lashes", opis: "Stylizacja Wild Cat Sensual. Dramatyczny, koci efekt.", problemy: ["brwi_rzesy"], czas: 150, cena_od: 230 },
  { id: "foxy_lashes", nazwa: "Foxy lashes", opis: "Stylizacja Foxy. Wyrazisty, lisi efekt.", problemy: ["brwi_rzesy"], czas: 150, cena_od: 230 },
  { id: "express_lash", nazwa: "Express Lash", opis: "Szybka stylizacja rzęs. Efekt w krótszym czasie.", problemy: ["brwi_rzesy"], czas: 70, cena_od: 150 },
  { id: "przedluzanie_rzes_volume", nazwa: "Przedłużanie rzęs volume (2D–6D)", opis: "Pęczki 2–6 rzęs do jednej naturalnej. Gęstość i objętość.", problemy: ["brwi_rzesy"], czas: 150, cena_od: 220 },
  { id: "laminacja_rzes", nazwa: "Laminacja rzęs", opis: "Podniesienie i wygięcie rzęs. Efekt podkręconych rzęs bez tuszu.", problemy: ["brwi_rzesy"], czas: 60, cena_od: 120 },
  { id: "regeneracja_rzes", nazwa: "Regeneracja / odżywianie rzęs", opis: "Serum i zabieg wzmacniający rzęsy. Odżywienie i stymulacja wzrostu.", problemy: ["brwi_rzesy"], czas: 30, cena_od: 60 },
  { id: "henna_rzes", nazwa: "Henna rzęs", opis: "Barwienie rzęs henną. Ciemniejszy kolor, efekt pomalowanych rzęs.", problemy: ["brwi_rzesy"], czas: 45, cena_od: 50 },
  { id: "zdejmowanie_rzes", nazwa: "Zdejmowanie przedłużonych rzęs", opis: "Profesjonalne usunięcie przedłużeń. Bez uszkodzenia naturalnych rzęs.", problemy: ["brwi_rzesy"], czas: 30, cena_od: 50 },
  { id: "korekta_rzes", nazwa: "Korekta przedłużonych rzęs", opis: "Uzupełnienie ubytków po 2–3 tygodniach. Podtrzymanie efektu.", problemy: ["brwi_rzesy"], czas: 60, cena_od: 80 },

  // Zestawy brwi + rzęsy
  { id: "komplet_laminacja_brwi_rzesy", nazwa: "Komplet laminacja brwi i rzęs", opis: "Laminacja brwi i rzęs w jednym wizycie. Pełna stylizacja okolicy oczu.", problemy: ["brwi_rzesy"], czas: 150, cena_od: 250 },

  // Uzupełnienia rzęs
  { id: "uzupelnienie_rzes_1_1", nazwa: "Uzupełnienie 1:1", opis: "Uzupełnienie przedłużeń 1:1. Uzupełnienie ubytków.", problemy: ["brwi_rzesy"], czas: 120, cena_od: 140 },
  { id: "uzupelnienie_rzes_2_3d", nazwa: "Uzupełnienie 2/3d", opis: "Uzupełnienie przedłużeń 2D/3D. Uzupełnienie ubytków.", problemy: ["brwi_rzesy"], czas: 120, cena_od: 150 },
  { id: "efekt_wispy_2_3d_uzupelnienie", nazwa: "Efekt Wispy 2/3d uzupełnienie", opis: "Uzupełnienie stylizacji Wispy 2D/3D.", problemy: ["brwi_rzesy"], czas: 140, cena_od: 170 },
  { id: "mokry_efekt_2_3d_uzupelnienie", nazwa: "Mokry Efekt 2/3d uzupełnienie", opis: "Uzupełnienie stylizacji Mokry Efekt 2D/3D.", problemy: ["brwi_rzesy"], czas: 140, cena_od: 160 },
  { id: "efekt_wispy_4_5d_uzupelnienie", nazwa: "Efekt Wispy 4/5d uzupełnienie", opis: "Uzupełnienie stylizacji Wispy 4D/5D.", problemy: ["brwi_rzesy"], czas: 150, cena_od: 180 },
  { id: "wild_cat_sensual_lashes_uzupelnienie", nazwa: "Wild Cat Sensual Lashes uzupełnienie", opis: "Uzupełnienie stylizacji Wild Cat Sensual Lashes.", problemy: ["brwi_rzesy"], czas: 150, cena_od: 210 },
  { id: "foxy_lashes_uzupelnienie", nazwa: "Foxy lashes uzupełnienie", opis: "Uzupełnienie stylizacji Foxy lashes.", problemy: ["brwi_rzesy"], czas: 150, cena_od: 210 },

  // Masaże twarzy & lifting
  { id: "maderolift_twarzy", nazwa: "Maderolift twarzy", opis: "Masaż twarzy Maderolift. Lifting i ujędrnienie skóry twarzy.", problemy: ["masaze", "zmarszczki"], czas: 75, cena_od: 224 },
  { id: "rytual_piekna_sauna_kobido", nazwa: "Rytuał Piękna: Sauna & Kobido", opis: "Połączenie sauny i japońskiego masażu Kobido. Głęboka odnowa i relaks.", problemy: ["masaze", "anti_aging"], czas: 150, cena_od: 379 },
  { id: "japonski_masaz_kobido", nazwa: "Japoński masaż KOBIDO", opis: "Tradycyjny japoński masaż twarzy Kobido. Lifting i odmładzanie.", problemy: ["masaze", "zmarszczki"], czas: 90, cena_od: 251 },
  { id: "masaz_twarzy_kobido_maseczka_algowa", nazwa: "Masaż twarzy KOBIDO + Maseczka algowa", opis: "Masaż Kobido z maseczką algową. Odżywienie i ujędrnienie.", problemy: ["masaze", "sucha_skora"], czas: 120, cena_od: 329 },

  // Oferta dla dwojga
  { id: "masaz_relaksacyjny_dla_dwojga_piling_stop", nazwa: "Masaż Relaksacyjny dla dwojga z pilingiem stop", opis: "Masaż relaksacyjny dla pary z peelingiem stóp. Wspólna chwila relaksu.", problemy: ["masaze"], czas: 120, cena_od: 550 },
  { id: "masaz_czekoladowy_dla_dwojga_60", nazwa: "Masaż czekoladowy dla dwojga (60 min)", opis: "Masaż czekoladowy dla pary. Relaks i pielęgnacja w duecie.", problemy: ["masaze"], czas: 60, cena_od: 459 },
  { id: "masaz_czekoladowy_dla_dwojga_90", nazwa: "Masaż czekoladowy dla dwojga (1g 30min)", opis: "Masaż czekoladowy dla pary. Dłuższy rytuał we dwoje.", problemy: ["masaze"], czas: 90, cena_od: 529 },
  { id: "masaz_relaksacyjny_calo_ciala_dla_dwojga_60", nazwa: "Masaż Relaksacyjny Całego Ciała dla dwojga (60 min)", opis: "Masaż relaksacyjny całego ciała dla pary.", problemy: ["masaze"], czas: 60, cena_od: 370 },
  { id: "masaz_relaksacyjny_calo_ciala_dla_dwojga_90", nazwa: "Masaż Relaksacyjny Całego Ciała dla dwojga (1g 30min)", opis: "Masaż relaksacyjny całego ciała dla pary.", problemy: ["masaze"], czas: 90, cena_od: 460 },
  { id: "masaz_relaksacyjny_calo_ciala_dla_dwojga_120", nazwa: "Masaż Relaksacyjny Całego Ciała dla dwojga (2g)", opis: "Masaż relaksacyjny całego ciała dla pary.", problemy: ["masaze"], czas: 120, cena_od: 549 },
  { id: "masaz_klasyczny_dla_dwojga_60", nazwa: "Masaż klasyczny dla dwojga (60 min)", opis: "Masaż klasyczny dla pary. Wspólne rozluźnienie.", problemy: ["masaze"], czas: 60, cena_od: 350 },
  { id: "masaz_klasyczny_dla_dwojga_90", nazwa: "Masaż klasyczny dla dwojga (1g 30min)", opis: "Masaż klasyczny dla pary.", problemy: ["masaze"], czas: 90, cena_od: 430 },
  { id: "masaz_klasyczny_dla_dwojga_120", nazwa: "Masaż klasyczny dla dwojga (2g)", opis: "Masaż klasyczny dla pary.", problemy: ["masaze"], czas: 120, cena_od: 499 },
  { id: "medytacja_dla_dwojga_60", nazwa: "Medytacja dla dwojga (Wariant 1)", opis: "Sesja medytacji dla pary. Wspólna praktyka oddechu i wyciszenia.", problemy: ["masaze"], czas: 60, cena_od: 290 },
  { id: "medytacja_dla_dwojga_90", nazwa: "Medytacja dla dwojga (Wariant 2)", opis: "Sesja medytacji dla pary. Rozszerzona praktyka.", problemy: ["masaze"], czas: 90, cena_od: 420 },

  // SPA dla dwojga
  { id: "fitobalans_dla_dwojga_100", nazwa: "Fitobalans (fitobeczka + masaż) dla dwojga (1g 40min)", opis: "Fitobeczka i masaż dla pary. Ziołowa sauna i relaks we dwoje.", problemy: ["masaze"], czas: 100, cena_od: 479 },
  { id: "fitobalans_dla_dwojga_120", nazwa: "Fitobalans (fitobeczka + masaż) dla dwojga (2g)", opis: "Fitobeczka i masaż dla pary. Dłuższy rytuał.", problemy: ["masaze"], czas: 120, cena_od: 560 },
  { id: "spa_kompleks_fitorelaks_dla_dwojga_130", nazwa: "SPA Kompleks Naturalny FitoRelaks dla dwojga (2g 10min)", opis: "Kompleksowy rytuał SPA FitoRelaks dla pary.", problemy: ["masaze"], czas: 130, cena_od: 549 },
  { id: "spa_kompleks_fitorelaks_dla_dwojga_150", nazwa: "SPA Kompleks Naturalny FitoRelaks dla dwojga (2g 30min)", opis: "Kompleksowy rytuał SPA FitoRelaks dla pary.", problemy: ["masaze"], czas: 150, cena_od: 649 },
  { id: "babelkowy_raj_dla_dwojga_100", nazwa: "Bąbelkowy raj (jacuzzi + masaż) dla dwojga (100 min)", opis: "Jacuzzi i masaż dla pary. Bąbelkowy relaks.", problemy: ["masaze"], czas: 100, cena_od: 469 },
  { id: "babelkowy_raj_dla_dwojga_120", nazwa: "Bąbelkowy raj (jacuzzi + masaż) dla dwojga (2g)", opis: "Jacuzzi i masaż dla pary.", problemy: ["masaze"], czas: 120, cena_od: 529 },
  { id: "jacuzzi_dla_dwojga_60", nazwa: "Jacuzzi dla dwojga (60 min)", opis: "Sesja w jacuzzi dla pary.", problemy: ["masaze"], czas: 60, cena_od: 170 },
  { id: "jacuzzi_dla_dwojga_90", nazwa: "Jacuzzi dla dwojga (1g 30min)", opis: "Sesja w jacuzzi dla pary.", problemy: ["masaze"], czas: 90, cena_od: 219 },
  { id: "rytual_relaksu_dla_dwojga", nazwa: "Rytuał Relaksu dla dwojga (Fitosauna + Jacuzzi)", opis: "Fitosauna i jacuzzi dla pary. Relaks we dwoje.", problemy: ["masaze"], czas: 90, cena_od: 379 },
  { id: "fitobeczka_peeling_dla_dwojga", nazwa: "Fitobeczka z Peelingiem dla dwojga", opis: "Fitobeczka z peelingiem dla pary. Ziołowa sauna i pielęgnacja.", problemy: ["masaze"], czas: 105, cena_od: 449 },
  { id: "fitobeczka_dla_dwojga", nazwa: "Fitobeczka (Fitosauna parowa) dla dwojga", opis: "Sesja w fitobeczce dla pary. Ziołowa para we dwoje.", problemy: ["masaze"], czas: 50, cena_od: 199 },

  // Oferta specjalna
  { id: "prywatny_wieczor_spa_4os", nazwa: "Prywatny wieczór SPA FitoRelax (Dla 4 osób)", opis: "Prywatna sesja SPA dla 4 osób. Wyjątkowy wieczór w gronie znajomych.", problemy: ["masaze"], czas: 240, cena_od: 1390 },
  { id: "prywatny_wieczor_spa_6os", nazwa: "Prywatny wieczór SPA FitoRelax (Dla 6 osób)", opis: "Prywatna sesja SPA dla 6 osób. Wyjątkowy wieczór w większym gronie.", problemy: ["masaze"], czas: 240, cena_od: 1690 },
  { id: "romantyczny_wieczor_spa_dla_dwojga_150", nazwa: "Romantyczny Wieczór SPA Dla Dwojga (2g 30min)", opis: "Romantyczny pakiet SPA dla pary. Dwie i pół godziny relaksu.", problemy: ["masaze"], czas: 150, cena_od: 629 },
  { id: "romantyczny_wieczor_spa_dla_dwojga_180", nazwa: "Romantyczny Wieczór SPA Dla Dwojga (3g)", opis: "Romantyczny pakiet SPA dla pary. Trzy godziny relaksu.", problemy: ["masaze"], czas: 180, cena_od: 749 },

  // Relaksacja i praca z oddechem
  { id: "swiadome_oddychanie_aromaterapia_50", nazwa: "Świadome oddychanie + Aromaterapia (Wariant 1)", opis: "Sesja świadomego oddychania z aromaterapią. Wyciszenie i oddech.", problemy: ["masaze"], czas: 50, cena_od: 180 },
  { id: "swiadome_oddychanie_aromaterapia_dla_dwojga", nazwa: "Świadome oddychanie + Aromaterapia (Dla dwojga)", opis: "Sesja świadomego oddychania z aromaterapią dla pary.", problemy: ["masaze"], czas: 60, cena_od: 270 },
  { id: "swiadome_oddychanie_aromaterapia_80", nazwa: "Świadome oddychanie + Aromaterapia (Wariant 3)", opis: "Rozszerzona sesja świadomego oddychania z aromaterapią.", problemy: ["masaze"], czas: 80, cena_od: 270 },
  { id: "medytacja_aromaterapia_60", nazwa: "Medytacja + Aromaterapia (Wariant 1)", opis: "Sesja medytacji z aromaterapią. Relaks i wyciszenie.", problemy: ["masaze"], czas: 60, cena_od: 190 },
  { id: "medytacja_aromaterapia_90", nazwa: "Medytacja + Aromaterapia (Wariant 2)", opis: "Sesja medytacji z aromaterapią. Dłuższa praktyka.", problemy: ["masaze"], czas: 90, cena_od: 277 },

  // Rozwój osobisty
  { id: "coaching", nazwa: "Coaching", opis: "Sesja coachingu. Rozwój osobisty i wsparcie w realizacji celów.", problemy: ["masaze"], czas: 50, cena_od: 222 },

  // Zabiegi holistyczne
  { id: "autorska_sesja_odnowy_energetycznej", nazwa: "Autorska sesja odnowy energetycznej", opis: "Holistyczna sesja odnowy. Równowaga ciała i umysłu.", problemy: ["masaze"], czas: 60, cena_od: 250 },

  // Programy kompleksowe
  { id: "pakiet_body_system", nazwa: "Pakiet BODY SYSTEM", opis: "Kompleksowy program BODY SYSTEM. Trening i odnowa w jednym.", problemy: ["masaze"], czas: 90, cena_od: 1880 },

  // Masaże terapeutyczne (warianty czasowe)
  { id: "masaz_klasyczny_40", nazwa: "Masaż klasyczny (40 min)", opis: "Masaż klasyczny. Rozluźnienie mięśni i redukcja napięcia.", problemy: ["masaze"], czas: 40, cena_od: 119 },
  { id: "masaz_klasyczny_60", nazwa: "Masaż klasyczny (1g)", opis: "Masaż klasyczny. Godzina głębokiego rozluźnienia.", problemy: ["masaze"], czas: 60, cena_od: 179 },
  { id: "masaz_klasyczny_90", nazwa: "Masaż klasyczny (1g 30min)", opis: "Masaż klasyczny. Półtorej godziny relaksu.", problemy: ["masaze"], czas: 90, cena_od: 239 },
  { id: "masaz_klasyczny_120", nazwa: "Masaż klasyczny (2g)", opis: "Masaż klasyczny. Dwie godziny pełnego masażu ciała.", problemy: ["masaze"], czas: 120, cena_od: 280 },
  // Masaż leczniczy
  { id: "masaz_leczniczy_60", nazwa: "Masaż Leczniczy (60 min)", opis: "Masaż leczniczy. Terapia bólu i napięć mięśniowych.", problemy: ["masaze"], czas: 60, cena_od: 200 },
  { id: "masaz_leczniczy_95", nazwa: "Masaż Leczniczy (95 min)", opis: "Masaż leczniczy. Rozszerzona sesja terapeutyczna.", problemy: ["masaze"], czas: 95, cena_od: 250 },
  { id: "masaz_leczniczy_120", nazwa: "Masaż Leczniczy (2g)", opis: "Masaż leczniczy. Pełna sesja na całe ciało.", problemy: ["masaze"], czas: 120, cena_od: 319 },
  // Masaż relaksacyjny całego ciała (1 osoba)
  { id: "masaz_relaksacyjny_calo_ciala_60", nazwa: "Masaż Relaksacyjny Całego Ciała (60 min)", opis: "Masaż relaksacyjny całego ciała. Godzina odprężenia.", problemy: ["masaze"], czas: 60, cena_od: 180 },
  { id: "masaz_relaksacyjny_calo_ciala_90", nazwa: "Masaż Relaksacyjny Całego Ciała (90 min)", opis: "Masaż relaksacyjny całego ciała. Półtorej godziny relaksu.", problemy: ["masaze"], czas: 90, cena_od: 230 },
  { id: "masaz_relaksacyjny_calo_ciala_120", nazwa: "Masaż Relaksacyjny Całego Ciała (2g)", opis: "Masaż relaksacyjny całego ciała. Dwie godziny głębokiego odprężenia.", problemy: ["masaze"], czas: 120, cena_od: 280 },
  // Masaż stóp relaksacyjny / Lomi Lomi
  { id: "masaz_stop_relaksacyjny_30", nazwa: "Masaż stóp relaksacyjny (30 min)", opis: "Relaksacyjny masaż stóp. Odprężenie i pobudzenie punktów reflex.", problemy: ["masaze"], czas: 30, cena_od: 80 },
  { id: "masaz_lomi_lomi_60", nazwa: "Masaż Lomi Lomi (60 min)", opis: "Hawański masaż Lomi Lomi. Głęboki relaks i odprężenie.", problemy: ["masaze"], czas: 60, cena_od: 249 },
  { id: "masaz_lomi_lomi_90", nazwa: "Masaż Lomi Lomi (90 min)", opis: "Masaż Lomi Lomi. Rozszerzona sesja.", problemy: ["masaze"], czas: 90, cena_od: 319 },

  // Zabiegi estetyczne na ciało
  { id: "liposukcja_kawitacyjna_30", nazwa: "Liposukcja kawitacyjna ultradźwiękowa (30 min)", opis: "Liposukcja kawitacyjna. Redukcja tkanki tłuszczowej ultradźwiękami.", problemy: ["jedrnost"], czas: 30, cena_od: 150 },
  { id: "liposukcja_kawitacyjna_60", nazwa: "Liposukcja kawitacyjna ultradźwiękowa (60 min)", opis: "Liposukcja kawitacyjna. Zabieg na wybrane partie ciała.", problemy: ["jedrnost"], czas: 60, cena_od: 200 },
  { id: "liposukcja_kawitacyjna_90", nazwa: "Liposukcja kawitacyjna ultradźwiękowa (90 min)", opis: "Liposukcja kawitacyjna. Rozszerzona sesja.", problemy: ["jedrnost"], czas: 90, cena_od: 230 },
  { id: "liposukcja_kawitacyjna_120", nazwa: "Liposukcja kawitacyjna ultradźwiękowa (2g)", opis: "Liposukcja kawitacyjna. Pełny zabieg na kilka partii.", problemy: ["jedrnost"], czas: 120, cena_od: 260 },
  { id: "vacuum_rf_dermomasaz_60", nazwa: "Vacuum + RF Dermomasaż (60 min)", opis: "Dermomasaż próżniowy z radiofrekwencją. Modelowanie i ujędrnienie.", problemy: ["jedrnost"], czas: 60, cena_od: 200 },
  { id: "vacuum_rf_dermomasaz_90", nazwa: "Vacuum + RF Dermomasaż (90 min)", opis: "Vacuum + RF Dermomasaż. Rozszerzona sesja.", problemy: ["jedrnost"], czas: 90, cena_od: 230 },
  { id: "vacuum_rf_dermomasaz_120", nazwa: "Vacuum + RF Dermomasaż (2g)", opis: "Vacuum + RF Dermomasaż. Pełny zabieg.", problemy: ["jedrnost"], czas: 120, cena_od: 260 },
  { id: "radiofrekwencja_cialo_30", nazwa: "Radiofrekwencja (30 min)", opis: "Zabieg radiofrekwencji na ciało. Ujędrnienie i lifting.", problemy: ["jedrnost"], czas: 30, cena_od: 150 },
  { id: "radiofrekwencja_cialo_60", nazwa: "Radiofrekwencja (60 min)", opis: "Radiofrekwencja. Modelowanie i zagęszczenie skóry.", problemy: ["jedrnost"], czas: 60, cena_od: 200 },
  { id: "radiofrekwencja_cialo_90", nazwa: "Radiofrekwencja (90 min)", opis: "Radiofrekwencja. Rozszerzona sesja.", problemy: ["jedrnost"], czas: 90, cena_od: 230 },
  { id: "radiofrekwencja_cialo_120", nazwa: "Radiofrekwencja (2g)", opis: "Radiofrekwencja. Pełny zabieg.", problemy: ["jedrnost"], czas: 120, cena_od: 260 },
  { id: "laser_liposlim_30", nazwa: "Laser LIPOSLIM (30 min)", opis: "Zabieg laserem LIPOSLIM. Redukcja tkanki i modelowanie.", problemy: ["jedrnost"], czas: 30, cena_od: 150 },
  { id: "laser_liposlim_60", nazwa: "Laser LIPOSLIM (60 min)", opis: "Laser LIPOSLIM. Zabieg na wybrane partie.", problemy: ["jedrnost"], czas: 60, cena_od: 200 },
  { id: "laser_liposlim_90", nazwa: "Laser LIPOSLIM (90 min)", opis: "Laser LIPOSLIM. Rozszerzona sesja.", problemy: ["jedrnost"], czas: 90, cena_od: 230 },
  { id: "laser_liposlim_120", nazwa: "Laser LIPOSLIM (2g)", opis: "Laser LIPOSLIM. Pełny zabieg.", problemy: ["jedrnost"], czas: 120, cena_od: 260 },
  { id: "lifting_rf_twarzy_55", nazwa: "Lifting RF twarzy (55 min)", opis: "Lifting twarzy radiofrekwencją. Ujędrnienie i odmłodzenie owalu.", problemy: ["zmarszczki", "owal"], czas: 55, cena_od: 199 },

  // Rytuały SPA (1 osoba)
  { id: "fitobalans_100", nazwa: "Fitobalans (fitobeczka + masaż) (100 min)", opis: "Fitobeczka i masaż relaksacyjny. Ziołowa sauna i odprężenie.", problemy: ["masaze"], czas: 100, cena_od: 249 },
  { id: "fitobalans_120", nazwa: "Fitobalans (fitobeczka + masaż) (2g)", opis: "Fitobeczka i masaż. Dłuższy rytuał.", problemy: ["masaze"], czas: 120, cena_od: 329 },
  { id: "babelkowy_raj_100", nazwa: "Bąbelkowy Raj (Jacuzzi + Masaż) (100 min)", opis: "Jacuzzi i masaż. Bąbelkowy relaks.", problemy: ["masaze"], czas: 100, cena_od: 249 },
  { id: "babelkowy_raj_120", nazwa: "Bąbelkowy Raj (Jacuzzi + Masaż) (2g)", opis: "Jacuzzi i masaż. Dwie godziny relaksu.", problemy: ["masaze"], czas: 120, cena_od: 329 },
  { id: "spa_kompleks_modelujacy", nazwa: "SPA Kompleks modelujący (3h 45min)", opis: "Kompleksowy rytuał SPA modelujący. Pełna pielęgnacja ciała.", problemy: ["masaze", "jedrnost"], czas: 225, cena_od: 529 },
  { id: "ziolowy_masaz_wyszczuplajacy_60", nazwa: "Ziołowy Masaż Wyszczuplający (60 min)", opis: "Masaż ziołowy wyszczuplający. Detoks i modelowanie.", problemy: ["masaze"], czas: 60, cena_od: 219 },
  { id: "ziolowy_masaz_wyszczuplajacy_90", nazwa: "Ziołowy Masaż Wyszczuplający (90 min)", opis: "Ziołowy masaż wyszczuplający. Rozszerzona sesja.", problemy: ["masaze"], czas: 90, cena_od: 279 },
  { id: "ziolowy_masaz_wyszczuplajacy_120", nazwa: "Ziołowy Masaż Wyszczuplający (2g)", opis: "Ziołowy masaż wyszczuplający. Pełny rytuał.", problemy: ["masaze"], czas: 120, cena_od: 349 },
  { id: "fitobeczka_50", nazwa: "FitoBeczka – Fitosauna ziołowa (50 min)", opis: "Sesja w fitobeczce. Ziołowa sauna parowa.", problemy: ["masaze"], czas: 50, cena_od: 119 },
  { id: "fitobeczka_peeling_90", nazwa: "Fitobeczka z Peelingiem (90 min)", opis: "Fitobeczka z peelingiem ciała. Ziołowa para i złuszczanie.", problemy: ["masaze"], czas: 90, cena_od: 280 },
  { id: "czekoladowe_spa_foliowanie", nazwa: "Czekoladowe SPA foliowanie (2h 30min)", opis: "Rytuał czekoladowy z foliowaniem. Pielęgnacja i relaks.", problemy: ["masaze"], czas: 150, cena_od: 429 },
  { id: "spa_kompleks_fitorelaks_120", nazwa: "SPA Kompleks Naturalny FitoRelaks (2g)", opis: "Kompleksowy rytuał FitoRelaks. Zioła i odprężenie.", problemy: ["masaze"], czas: 120, cena_od: 399 },
  { id: "fito_glow_60", nazwa: "Fito Glow (Peeling całego ciała) (60 min)", opis: "Peeling całego ciała Fito Glow. Rozjaśnienie i gładkość skóry.", problemy: ["masaze"], czas: 60, cena_od: 219 },

  // Fryzjerstwo – popularne i damskie
  { id: "strzyzenie_modelowanie_ladies", nazwa: "Strzyżenie + Modelowanie Ladies", opis: "Strzyżenie i modelowanie. Kosmetyki GLYNT, Kevin Murphy. Cena zależna od długości włosów (krótkie/średnie/długie).", problemy: ["wlosy"], czas: 150, cena_od: 100 },
  { id: "strzyzenie_wlosow_krotkie", nazwa: "Strzyżenie włosów krótkich", opis: "Strzyżenie włosów krótkich.", problemy: ["wlosy"], czas: 150, cena_od: 100 },
  { id: "strzyzenie_wlosow_srednie", nazwa: "Strzyżenie włosów średnich", opis: "Strzyżenie włosów średniej długości.", problemy: ["wlosy"], czas: 150, cena_od: 140 },
  { id: "strzyzenie_wlosow_dlugie", nazwa: "Strzyżenie włosów długich", opis: "Strzyżenie włosów długich.", problemy: ["wlosy"], czas: 150, cena_od: 180 },
  { id: "strzyzenie_boys_klasyczne", nazwa: "Strzyżenie Boys Klasyczne", opis: "Klasyczne strzyżenie chłopięce.", problemy: ["wlosy"], czas: 45, cena_od: 80 },
  { id: "koloryzacja_air_touch", nazwa: "Koloryzacja AIR TOUCH", opis: "Rozjaśnianie cienkich pasm przy użyciu suszarki. Naturalny efekt rozświetlenia, płynne przejścia. Odrost mniej widoczny.", problemy: ["wlosy"], czas: 360, cena_od: 800 },
  { id: "modelowanie_ladies", nazwa: "Modelowanie Ladies", opis: "Modelowanie włosów. Kosmetyki GLYNT. Cena 90–160 zł.", problemy: ["wlosy"], czas: 120, cena_od: 80 },
  { id: "czesanie_okolicznosciowe_slubne", nazwa: "Czesanie okolicznościowe / ślubne", opis: "Czesanie na wesele lub inną okazję. Kosmetyki GLYNT. Cena 150–250 zł.", problemy: ["wlosy"], czas: 120, cena_od: 180 },
  { id: "fale_loki", nazwa: "Fale, Loki", opis: "Układanie włosów w fale lub loki.", problemy: ["wlosy"], czas: 120, cena_od: 180 },
  { id: "strzyzenie_grzywki", nazwa: "Strzyżenie grzywki", opis: "Strzyżenie grzywki. Kosmetyki GLYNT.", problemy: ["wlosy"], czas: 30, cena_od: 20 },
  { id: "trwala_ondulacja", nazwa: "Trwała Ondulacja", opis: "Trwała ondulacja włosów. Cena 170–250 zł.", problemy: ["wlosy"], czas: 180, cena_od: 180 },
  // Koloryzacja
  { id: "koloryzacja_odrostu", nazwa: "Koloryzacja Odrostu", opis: "Koloryzacja odrostu – bez rozjaśniania. Kosmetyki GLYNT.", problemy: ["wlosy"], czas: 120, cena_od: 200 },
  { id: "koloryzacja_calkowita_jednolita", nazwa: "Koloryzacja Całkowita – Jednolity Kolor", opis: "Koloryzacja całkowita jednolitym kolorem. Mała/standardowa/duża ilość włosów 300–550 zł. Kosmetyki GLYNT.", problemy: ["wlosy"], czas: 180, cena_od: 300 },
  { id: "koloryzacja_wielotonowa", nazwa: "Koloryzacja Wielotonowa", opis: "Koloryzacja odrostu z doborem koloru na długości. Technika 3D bez rozjaśniania. 300–550 zł. Kosmetyki GLYNT.", problemy: ["wlosy"], czas: 180, cena_od: 300 },
  { id: "tonowanie_wlosow", nazwa: "Tonowanie Włosów", opis: "Odświeżenie koloru bez rozjaśniania. Kosmetyki GLYNT.", problemy: ["wlosy"], czas: 120, cena_od: 200 },
  // Rozjaśnianie i dekoloryzacja
  { id: "rozjasnianie_odrostu_refleksy", nazwa: "Rozjaśnianie Odrostu Metodą Refleksów", opis: "Koloryzacja odrostu z drobnymi refleksami, repigmentacja i tonowanie. 380–700 zł. Kosmetyki GLYNT.", problemy: ["wlosy"], czas: 300, cena_od: 380 },
  { id: "globalne_rozjasnianie_odrostu_tonowanie", nazwa: "Globalne Rozjaśnianie Odrostu + Tonowanie Całości", opis: "Rozjaśnienie odrostu, repigmentacja i tonowanie. 380–700 zł. Kosmetyki GLYNT.", problemy: ["wlosy"], czas: 240, cena_od: 380 },
  { id: "dekoloryzacja_wlosow", nazwa: "Dekoloryzacja Włosów", opis: "Usunięcie koloru z koloryzacją docelową, uzupełnienie pigmentów. 400–700 zł. Kosmetyki GLYNT.", problemy: ["wlosy"], czas: 240, cena_od: 400 },
  // Artystyczne techniki
  { id: "artystyczne_techniki_pojasnien", nazwa: "Artystyczne Techniki Pojaśnień (Sombre, Flamboyage)", opis: "Ombre, Sombre, Flamboyage, Niteczkowa, Money Piece. Koloryzacja odrostu, repigmentacja, tonowanie. 500–800 zł. Kosmetyki GLYNT.", problemy: ["wlosy"], czas: 300, cena_od: 500 },
  { id: "front_blond", nazwa: "Front Blond", opis: "Refleksy przy twarzy, repigmentacja i tonowanie. Kosmetyki GLYNT.", problemy: ["wlosy"], czas: 120, cena_od: 220 },
  { id: "rozjasnianie_na_wolnym_powietrzu", nazwa: "Rozjaśnianie Metodą Na Wolnym Powietrzu", opis: "Rozświetlenie naturalnych włosów, koloryzacja odrostu, repigmentacja, tonowanie. 500–700 zł. Kosmetyki GLYNT.", problemy: ["wlosy"], czas: 240, cena_od: 500 },
  { id: "koloryzacja_brazilian", nazwa: "Koloryzacja BRAZILIAN", opis: "Efekt wiązki światła, farbowanie cienkich pasm, naturalny wielowymiar. 500–800 zł.", problemy: ["wlosy"], czas: 360, cena_od: 500 },
  // Przedłużanie Hairtalk
  { id: "zageszczanie_wlosow_hairtalk", nazwa: "Zagęszczanie Włosów Firmy Hairtalk", opis: "Metoda tape-in lub keratynowa. Wymagana konsultacja.", problemy: ["wlosy"], czas: 180, cena_od: 960 },
  { id: "przedluzanie_wlosow_hairtalk", nazwa: "Przedłużanie Włosów Firmy Hairtalk", opis: "Przedłużanie włosów Hairtalk. Wymagana konsultacja.", problemy: ["wlosy"], czas: 240, cena_od: 1900 },
  { id: "zageszczacz_hairtalk_hairwear", nazwa: "Zagęszczacz Hairtalk Hairwear", opis: "Rozwiązanie na przerzedzenie włosów. Ultra cienkie wykończenie. Dopasowanie przez fryzjera.", problemy: ["wlosy"], czas: 120, cena_od: 1500 },
  { id: "hairband_hairtalk", nazwa: "Hairband by Hairtalk", opis: "Włosy na żyłce. Długości 25 cm / 40 cm. Naturalne włosy Remy.", problemy: ["wlosy"], czas: 120, cena_od: 1200 },
  // Fryzjerstwo męskie
  { id: "strzyzenie_maszynka_rekrut", nazwa: "Strzyżenie maszynką na „rekruta”", opis: "Strzyżenie maszynką na krótko.", problemy: ["wlosy"], czas: 30, cena_od: 60 },
  { id: "pelna_broda", nazwa: "Pełna Broda", opis: "Modelowanie i pielęgnacja pełnej brody. Kosmetyki REUZEL.", problemy: ["wlosy"], czas: 60, cena_od: 70 },
  { id: "krotki_zarost", nazwa: "Krótki Zarost", opis: "Strzyżenie i pielęgnacja krótkiego zarostu. Kosmetyki REUZEL.", problemy: ["wlosy"], czas: 45, cena_od: 60 },
  { id: "tuszowanie_siwizny", nazwa: "Tuszowanie siwizny", opis: "Koloryzacja siwizny. Kosmetyki GLYNT.", problemy: ["wlosy"], czas: 60, cena_od: 150 },
  // Pielęgnacja włosów
  { id: "keratynowe_prostowanie_wlosow", nazwa: "Keratynowe Prostowanie Włosów", opis: "Prostowanie keratynowe. Bez formaldehydu. KERASTRAIGHT. Cena 350–1000 zł.", problemy: ["wlosy"], czas: 240, cena_od: 350 },
  { id: "nanoplastia_diamond_touch", nazwa: "Nanoplastia Włosów Diamond Touch", opis: "Zabieg nanoplastii Diamond Touch na włosy.", problemy: ["wlosy"], czas: 300, cena_od: 450 },
  { id: "fibreceutic_botox_wlosy", nazwa: "Fibreceutic – Botox dla włosów", opis: "Zabieg Fibreceutic (botoks do włosów). Regeneracja i odżywienie.", problemy: ["wlosy"], czas: 120, cena_od: 200 },
  // Szkolenia
  { id: "szkolenie_koloryzacja_3d_dekoloryzacja", nazwa: "Szkolenie: Koloryzacja 3D i Dekoloryzacja", opis: "Szkolenie 86h. Program koloryzacji 3D i dekoloryzacji. Certyfikat PL/EN. Cena 2500 zł indywidualnie.", problemy: ["wlosy"], czas: 1380, cena_od: 3000 },
  { id: "szkolenie_strzyzenia_meskie", nazwa: "Szkolenie: Strzyżenia Męskie", opis: "Szkolenie 110h. 100% praktyki. Certyfikat PL/EN. Cena 2500 zł indywidualnie.", problemy: ["wlosy"], czas: 1380, cena_od: 3000 },
  { id: "szkolenie_strzyzenia_damskie", nazwa: "Szkolenie: Strzyżenia Damskie", opis: "Szkolenie 110h. 100% praktyki. Certyfikat PL/EN. Cena 2500 zł indywidualnie.", problemy: ["wlosy"], czas: 1380, cena_od: 3000 },

  // Stopy
  { id: "pedicure_klasyczny", nazwa: "Pedicure klasyczny", opis: "Kąpiel, usunięcie zrogowaceń, skrócenie i opiłowanie paznokci. Podstawowa pielęgnacja stóp.", problemy: ["stopy"], czas: 60, cena_od: 80 },
  { id: "pedicure_kosmetyczny", nazwa: "Pedicure kosmetyczny", opis: "Pełna pielęgnacja stóp: kąpiel, peeling, usunięcie zrogowaceń, masaż, lakier.", problemy: ["stopy"], czas: 75, cena_od: 100 },
  { id: "pedicure_podologiczny", nazwa: "Pedicure leczniczy / podologiczny", opis: "Zabieg podologiczny. Praca nad modzelami, odciskami, wrastającymi paznokciami.", problemy: ["stopy"], czas: 60, cena_od: 120 },
  { id: "peeling_stop", nazwa: "Peeling stóp", opis: "Złuszczanie zrogowaciałego naskórka. Gładkie, miękkie stopy.", problemy: ["stopy"], czas: 30, cena_od: 50 },
  { id: "pielegnacja_suchych_stop", nazwa: "Pielęgnacja suchych stóp (zestaw)", opis: "Zabieg na bardzo suche stopy: pumeks, krem, opatrunek. Intensywne nawilżenie.", problemy: ["stopy"], czas: 45, cena_od: 70 },
  { id: "usuwanie_modzeli", nazwa: "Usuwanie modzeli i odcisków", opis: "Bezpieczne usunięcie zgrubień i odcisków. Profilaktyka i leczenie.", problemy: ["stopy"], czas: 45, cena_od: 80 },
  { id: "lakier_stopy", nazwa: "Lakierowanie paznokci stóp", opis: "Manicure paznokci stóp z lakierem klasycznym lub hybrydowym.", problemy: ["stopy"], czas: 45, cena_od: 50 },
  { id: "zel_stopy", nazwa: "Żel na paznokcie stóp", opis: "Przedłużenie lub wzmocnienie paznokci stóp żelem. Trwały wygląd.", problemy: ["stopy"], czas: 60, cena_od: 90 },
  { id: "manicure_pedicure", nazwa: "Manicure + pedicure (pakiet)", opis: "Pełna pielęgnacja dłoni i stóp w jednym wizycie. Oszczędność czasu.", problemy: ["stopy"], czas: 120, cena_od: 150 },

  // Paznokcie dłonie – żelowe
  { id: "manicure_zelowy_dlugosc_0_2", nazwa: "Manicure żelowy (długość 0–2)", opis: "Manicure żelowy na krótkich paznokciach. Trwała stylizacja.", problemy: ["anti_aging"], czas: 120, cena_od: 140 },
  { id: "manicure_zelowy_zdobienie_dlugosc_0_2", nazwa: "Manicure żelowy + zdobienie (długość 0–2)", opis: "Manicure żelowy z zdobieniem na krótkich paznokciach.", problemy: ["anti_aging"], czas: 120, cena_od: 140 },
  { id: "manicure_zelowy_dlugosc_od_3", nazwa: "Manicure żelowy (długość od 3)", opis: "Manicure żelowy na średnich i długich paznokciach. Czas 2g lub 3g w zależności od wariantu.", problemy: ["anti_aging"], czas: 120, cena_od: 160 },
  { id: "manicure_zelowy_dlugosc_od_3_3g", nazwa: "Manicure żelowy (długość od 3) — 3g", opis: "Manicure żelowy na średnich/długich paznokciach. Wersja 3-godzinna.", problemy: ["anti_aging"], czas: 180, cena_od: 160 },
  { id: "manicure_zelowy_zdobienie_dlugosc_od_3", nazwa: "Manicure żelowy + zdobienie (długość od 3)", opis: "Manicure żelowy z zdobieniem na średnich/długich paznokciach.", problemy: ["anti_aging"], czas: 180, cena_od: 160 },
  { id: "manicure_zelowy_nail_art_dlugosc_od_3", nazwa: "Manicure żelowy + nail art (długość od 3)", opis: "Manicure żelowy z nail art na średnich/długich paznokciach.", problemy: ["anti_aging"], czas: 180, cena_od: 160 },
  { id: "manicure_zelowy_nail_art_dlugosc_0_2", nazwa: "Manicure żelowy + nail art (długość 0–2)", opis: "Manicure żelowy z nail art na krótkich paznokciach.", problemy: ["anti_aging"], czas: 180, cena_od: 140 },
  // Paznokcie hybrydowe
  { id: "paznokcie_hybrydowe", nazwa: "Paznokcie hybrydowe", opis: "Stylizacja hybrydowa paznokci. Lakier hybrydowy utrwalany w lampie.", problemy: ["anti_aging"], czas: 90, cena_od: 120 },
  // Przedłużanie paznokci
  { id: "przedluzanie_paznokci_wariant_1", nazwa: "Przedłużanie paznokci – Wariant 1", opis: "Przedłużanie paznokci żelami lub akrylem. Budowanie długości.", problemy: ["anti_aging"], czas: 120, cena_od: 160 },
  { id: "przedluzanie_paznokci_dlugosc_od_6", nazwa: "Przedłużanie paznokci (długość od 6)", opis: "Przedłużanie paznokci na dużą długość.", problemy: ["anti_aging"], czas: 120, cena_od: 200 },
  { id: "przedluzanie_paznokci_dlugosc_3_5", nazwa: "Przedłużanie paznokci (długość 3–5)", opis: "Przedłużanie paznokci na średnią długość.", problemy: ["anti_aging"], czas: 120, cena_od: 180 },
  // Paznokcie – pozostałe
  { id: "manicure_meski", nazwa: "Manicure męski", opis: "Pielęgnacja dłoni i paznokci dla mężczyzn. Opracowanie skórek, nawilżenie.", problemy: ["anti_aging"], czas: 90, cena_od: 100 },
  { id: "sciagniecie_stylizacji_manicure_klasyczny", nazwa: "Ściągnięcie stylizacji + manicure klasyczny", opis: "Zdjęcie żelu/hybridy oraz klasyczny manicure. Odświeżenie paznokci.", problemy: ["anti_aging"], czas: 60, cena_od: 80 },

  // Masaże
  { id: "masaz_klasyczny_plecy", nazwa: "Masaż klasyczny pleców", opis: "Rozluźnienie mięśni pleców. Redukcja napięcia i bólu.", problemy: ["masaze"], czas: 60, cena_od: 120 },
  { id: "masaz_calo_ciala", nazwa: "Masaż całego ciała", opis: "Masaż klasyczny całego ciała. Głębokie rozluźnienie.", problemy: ["masaze"], czas: 90, cena_od: 180 },
  { id: "masaz_relaksacyjny", nazwa: "Masaż relaksacyjny", opis: "Delikatny masaż nastawiony na odprężenie i redukcję stresu.", problemy: ["masaze"], czas: 60, cena_od: 140 },
  { id: "masaz_sportowy", nazwa: "Masaż sportowy", opis: "Masaż dla osób aktywnych. Rozgrzewka, regeneracja, rozciąganie mięśni.", problemy: ["masaze"], czas: 60, cena_od: 150 },
  { id: "masaz_limfatyczny_cialo", nazwa: "Masaż limfatyczny (ciało)", opis: "Drenaż limfatyczny. Obrzęki, detoksykacja, wsparcie odporności.", problemy: ["masaze"], czas: 60, cena_od: 160 },
  { id: "masaz_stop", nazwa: "Masaż stóp", opis: "Refleksologia i masaż stóp. Odprężenie i pobudzenie punktów reflex.", problemy: ["masaze"], czas: 45, cena_od: 90 },
  { id: "masaz_gorace_kamienie", nazwa: "Masaż gorącymi kamieniami", opis: "Masaż z użyciem nagrzanych kamieni. Głębokie rozluźnienie i ciepło.", problemy: ["masaze"], czas: 75, cena_od: 180 },
  { id: "masaz_aromaterapeutyczny", nazwa: "Masaż aromaterapeutyczny", opis: "Masaż z olejkami eterycznymi. Relaks i dobrostan zapachowy.", problemy: ["masaze"], czas: 60, cena_od: 150 },
  { id: "masaz_banka_chinska", nazwa: "Masaż bańką chińską", opis: "Bańki próżniowe. Pobudzenie krążenia, rozluźnienie powięzi.", problemy: ["masaze"], czas: 45, cena_od: 120 },
  { id: "masaz_ciazy", nazwa: "Masaż dla kobiet w ciąży", opis: "Bezpieczny masaż przyszłych mam. Ulga w bólach pleców i obrzękach.", problemy: ["masaze"], czas: 60, cena_od: 160 },

  // Eximia – modelowanie sylwetki
  { id: "eximia_podbrodek", nazwa: "Eximia – redukcja podbródka", opis: "Zabieg modelujący Eximia na okolice podbródka. Redukcja tkanki tłuszczowej i ujędrnienie. Pakiet 5 zabiegów + 1 gratis.", problemy: ["jedrnost"], czas: 45, cena_od: 300 },
  { id: "eximia_ramiona", nazwa: "Eximia – ramiona", opis: "Zabieg modelujący Eximia na ramiona. Ujędrnienie i redukcja tkanki tłuszczowej. Pakiet 5 zabiegów + 1 gratis.", problemy: ["jedrnost"], czas: 45, cena_od: 400 },
  { id: "eximia_boczki_brzucha", nazwa: "Eximia – boczki brzucha", opis: "Zabieg modelujący Eximia na boczki brzucha. Redukcja obwodów i ujędrnienie. Pakiet 5 zabiegów + 1 gratis.", problemy: ["jedrnost"], czas: 45, cena_od: 500 },
  { id: "eximia_bryczesy_posladki_brzuch", nazwa: "Eximia – bryczesy / pośladki / brzuch", opis: "Zabieg modelujący Eximia na bryczesy, pośladki lub brzuch. Redukcja tkanki i lifting. Pakiet 5 zabiegów + 1 gratis.", problemy: ["jedrnost"], czas: 45, cena_od: 600 },

  // Epilstar – epilacja laserowa (okolice twarzy)
  { id: "epilstar_wasik", nazwa: "Epilstar – wąsik", opis: "Epilacja laserowa Epilstar okolicy wąsika. Trwałe usuwanie owłosienia.", problemy: ["anti_aging"], czas: 20, cena_od: 100 },
  { id: "epilstar_broda", nazwa: "Epilstar – broda", opis: "Epilacja laserowa Epilstar okolicy brody. Trwałe usuwanie owłosienia.", problemy: ["anti_aging"], czas: 20, cena_od: 120 },
  { id: "epilstar_baki", nazwa: "Epilstar – baki", opis: "Epilacja laserowa Epilstar okolicy baków. Trwałe usuwanie owłosienia.", problemy: ["anti_aging"], czas: 20, cena_od: 120 },

  // Epilstar – epilacja laserowa (nogi)
  { id: "epilstar_nogi_cale", nazwa: "Epilstar – nogi całe", opis: "Epilacja laserowa Epilstar na całe nogi. Trwałe usuwanie owłosienia.", problemy: ["anti_aging"], czas: 60, cena_od: 500 },
  { id: "epilstar_lydki", nazwa: "Epilstar – łydki", opis: "Epilacja laserowa Epilstar na łydki. Trwałe usuwanie owłosienia.", problemy: ["anti_aging"], czas: 30, cena_od: 300 },
  { id: "epilstar_uda", nazwa: "Epilstar – uda", opis: "Epilacja laserowa Epilstar na uda. Trwałe usuwanie owłosienia.", problemy: ["anti_aging"], czas: 30, cena_od: 300 },
  { id: "epilstar_bikini", nazwa: "Epilstar – bikini", opis: "Epilacja laserowa Epilstar na okolice bikini. Trwałe usuwanie owłosienia.", problemy: ["anti_aging"], czas: 25, cena_od: 200 },
  { id: "epilstar_bikini_gleboki", nazwa: "Epilstar – bikini głębokie", opis: "Epilacja laserowa Epilstar – bikini głębokie. Trwałe usuwanie owłosienia.", problemy: ["anti_aging"], czas: 25, cena_od: 300 },

  // Epilstar – epilacja laserowa (górna część ciała)
  { id: "epilstar_cale_rece", nazwa: "Epilstar – całe ręce", opis: "Epilacja laserowa Epilstar na całe ręce. Trwałe usuwanie owłosienia.", problemy: ["anti_aging"], czas: 40, cena_od: 400 },
  { id: "epilstar_przedramiona", nazwa: "Epilstar – przedramiona", opis: "Epilacja laserowa Epilstar na przedramiona. Trwałe usuwanie owłosienia.", problemy: ["anti_aging"], czas: 20, cena_od: 200 },
  { id: "epilstar_ramiona_epilacja", nazwa: "Epilstar – ramiona", opis: "Epilacja laserowa Epilstar na ramiona. Trwałe usuwanie owłosienia.", problemy: ["anti_aging"], czas: 20, cena_od: 200 },
  { id: "epilstar_tors", nazwa: "Epilstar – tors", opis: "Epilacja laserowa Epilstar na tors. Trwałe usuwanie owłosienia.", problemy: ["anti_aging"], czas: 35, cena_od: 350 },
  { id: "epilstar_tors_brzuch", nazwa: "Epilstar – tors i brzuch", opis: "Epilacja laserowa Epilstar na tors i brzuch. Trwałe usuwanie owłosienia.", problemy: ["anti_aging"], czas: 45, cena_od: 450 },
  { id: "epilstar_pachy", nazwa: "Epilstar – pachy", opis: "Epilacja laserowa Epilstar na pachy. Trwałe usuwanie owłosienia.", problemy: ["anti_aging"], czas: 15, cena_od: 150 },
  { id: "epilstar_brzuch", nazwa: "Epilstar – brzuch", opis: "Epilacja laserowa Epilstar na brzuch. Trwałe usuwanie owłosienia.", problemy: ["anti_aging"], czas: 30, cena_od: 300 },
  { id: "epilstar_plecy", nazwa: "Epilstar – plecy", opis: "Epilacja laserowa Epilstar na plecy. Trwałe usuwanie owłosienia.", problemy: ["anti_aging"], czas: 40, cena_od: 450 },

  // Terapia manualna
  { id: "access_facelift", nazwa: "Access Facelift®", opis: "Delikatna, energetyczna praca z twarzą, szyją i barkami. Rozluźnienie napięć, pobudzenie naturalnych mechanizmów odnowy, poprawa przepływu energii i krążenia. Efekt: wyraźnie rozluźniona twarz, miękkość rysów, uczucie lekkości i spokoju.", problemy: ["terapia_manualna", "owal", "anti_aging"], czas: 75, cena_od: 200 },

  // Terapia manualna – Access Facelift
  // (already exists as access_facelift)

  // Dzwiekoterapia
  { id: "access_bars", nazwa: "Access Bars®", opis: "Delikatna, energetyczna praca z 32 punktami na głowie odpowiadającymi za różne obszary życia (stres, relacje, kreatywność). Lekki dotyk uwalnia napięcia i nagromadzone schematy. Efekt: większa lekkość w głowie, poprawa snu, głęboki relaks.", problemy: ["dzwiekoterapia", "terapia_manualna", "masaze"], czas: 75, cena_od: 180 },
  { id: "sesja_dzwiekowa_milosc_do_siebie", nazwa: "Indywidualna sesja dźwiękowa „Z miłości do siebie”", opis: "Relaksacyjna sesja z misami, gongami i instrumentami wibracyjnymi. Dźwięk wprowadza w stan głębokiego odprężenia, wspiera regulację układu nerwowego i pomaga puścić napięcia.", problemy: ["dzwiekoterapia", "masaze"], czas: 60, cena_od: 160 },
  { id: "sesja_dzwiekowa_para", nazwa: "Sesja dźwiękowa dla par", opis: "Wspólna przestrzeń wyciszenia i bliskości dla dwóch osób. Instrumenty wibracyjne wspierają głęboki relaks i regenerację. Czas i forma ustalane indywidualnie.", problemy: ["dzwiekoterapia", "masaze"], czas: 60, cena_od: 250 },
  { id: "koncert_sesja_grupowa_dzwiek", nazwa: "Koncert / sesja grupowa w dźwiękach", opis: "Grupowe spotkanie relaksacyjne z instrumentami wibracyjnymi. Głęboki odpoczynek, regeneracja układu nerwowego, wspólna przestrzeń relaksu. Terminy ogłaszane na bieżąco.", problemy: ["dzwiekoterapia", "masaze"], czas: 60, cena_od: 80 },
  { id: "masaz_dzwiekiem", nazwa: "Masaż dźwiękiem / relaksacja w dźwiękach", opis: "Sesja oparta na wibracji i częstotliwości instrumentów terapeutycznych. Wprowadzenie w stan głębokiego relaksu, rozluźnienie napięć, harmonizacja układu nerwowego.", problemy: ["dzwiekoterapia", "masaze"], czas: 60, cena_od: 150 },
  { id: "joga_na_dobranoc_dzwiek", nazwa: "Joga na dobranoc z relaksacją w dźwiękach", opis: "Wieczorne spotkanie łączące delikatną praktykę jogi z relaksacją w dźwiękach mis, gongów i bębna szamańskiego. Kameralne grupy (maks. 8 osób). Łagodna joga + koncert relaksacyjny.", problemy: ["dzwiekoterapia", "masaze"], czas: 60, cena_od: 80 },
];
