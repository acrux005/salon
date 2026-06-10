/**
 * Treść polityki prywatności serwisu www.odart.pl.
 * Administrator: jednoosobowa działalność ODART Rafał Kowalkowski (nie spółka).
 */
const ADMIN_BUSINESS = "Ostry Dyżur Artystyczny";
const ADMIN_FULL_NAME = "ODART Rafał Kowalkowski";
const ADMIN_ADDRESS = "ul. Makowskiego 3, 78-100 Kołobrzeg";
const ADMIN_NIP = "5791020696";

export function OdartPolitykaPrywatnosciArticles() {
  return (
    <div className="prose prose-invert prose-headings:scroll-mt-24 prose-p:text-neutral-400 prose-li:text-neutral-400 prose-strong:text-neutral-200 max-w-none">
      <p className="text-sm text-neutral-500 not-prose">
        Polityka prywatności: pierwotnie od 25.10.2020 · aktualizacja opisu Administratora 23.03.2026 · wersja 1.1 ·{" "}
        <a href="https://www.odart.pl" className="text-odart-accent hover:text-orange-300">
          www.odart.pl
        </a>
      </p>

      <h2 className="text-xl font-bold text-white mt-10">Artykuł I. Definicje</h2>
      <p>
        <strong>Administrator (Serwis)</strong> –{" "}
        <strong>{ADMIN_FULL_NAME}</strong>, prowadzący jednoosobową działalność gospodarczą pod nazwą „{ADMIN_BUSINESS}” z
        siedzibą w Kołobrzegu (NIP {ADMIN_NIP}).
      </p>
      <p>
        <strong>Dane osobowe</strong> – wszystkie informacje o osobie fizycznej zidentyfikowanej lub możliwej do
        zidentyfikowania poprzez jeden bądź kilka szczególnych czynników określających fizyczną, fizjologiczną,
        genetyczną, psychiczną, ekonomiczną, kulturową lub społeczną tożsamość, w tym IP urządzenia, dane o
        lokalizacji, identyfikator internetowy oraz informacje gromadzone za pośrednictwem plików cookie oraz innej
        podobnej technologii.
      </p>
      <p>
        <strong>Polityka</strong> – niniejsza Polityka prywatności.
      </p>
      <p>
        <strong>RODO (GDPR, DSGVO)</strong> – Rozporządzenie Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27
        kwietnia 2016 r. w sprawie ochrony osób fizycznych w związku z przetwarzaniem danych osobowych i w sprawie
        swobodnego przepływu takich danych oraz uchylenia dyrektywy 95/46/WE.
      </p>
      <p>
        <strong>Serwis</strong> – serwis internetowy prowadzony przez Administratora pod adresem www.odart.pl.{" "}
        <strong>Użytkownik</strong> – każda osoba fizyczna odwiedzająca Serwis lub korzystająca z jednej albo kilku
        usług czy funkcjonalności opisanych w Polityce.
      </p>

      <h2 className="text-xl font-bold text-white mt-10">Artykuł II. Administrator danych osobowych</h2>
      <p>
        Administratorem danych osobowych użytkowników będących osobami fizycznymi, w rozumieniu przepisów o ochronie
        danych osobowych, w tym RODO, jest{" "}
        <strong>{ADMIN_FULL_NAME}</strong>, prowadzący jednoosobową działalność gospodarczą pod nazwą „{ADMIN_BUSINESS}”,
        zwany dalej Administratorem. Adres do korespondencji: {ADMIN_ADDRESS}. NIP: {ADMIN_NIP}.
      </p>

      <h2 className="text-xl font-bold text-white mt-10">Artykuł III. Przetwarzanie danych w związku z korzystaniem z serwisu</h2>
      <p>
        W związku z korzystaniem przez Użytkownika z Serwisu Administrator zbiera dane w zakresie niezbędnym do
        świadczenia poszczególnych oferowanych usług, a także informacje o aktywności Użytkownika w Serwisie. Poniżej
        zostały opisane szczegółowe zasady oraz cele przetwarzania danych osobowych gromadzonych podczas korzystania z
        Serwisu przez Użytkownika.
      </p>

      <h2 className="text-xl font-bold text-white mt-10">Artykuł IV. Cele oraz podstawy prawne przetwarzania danych w serwisie</h2>
      <h3 className="text-lg font-semibold text-neutral-200 mt-6">Korzystanie z serwisu</h3>
      <p>
        Dane osobowe wszystkich osób korzystających z Serwisu (w tym adres IP lub inne identyfikatory oraz informacje
        gromadzone za pośrednictwem plików cookies lub innych podobnych technologii), a niebędących zarejestrowanymi
        Użytkownikami (tj. osoby nieposiadające profilu w Serwisie) przetwarzane są przez Administratora:
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          w celu świadczenia usług drogą elektroniczną w zakresie udostępniana Użytkownikom treści gromadzonych w
          Serwisie, w tym w zakresie niezbędnym do nawiązania, ukształtowania treści, zmiany, rozwiązania i prawidłowej
          realizacji usług świadczonych drogą elektroniczną;
        </li>
        <li>
          w celach analitycznych i statystycznych – wówczas podstawą prawną przetwarzania jest uzasadniony interes
          Administratora (art. 6 ust. 1 lit. f) RODO) polegający na prowadzeniu analiz aktywności Użytkowników, a także ich
          preferencji w celu poprawy stosowanych funkcjonalności i świadczonych usług;
        </li>
        <li>
          w celu ewentualnego ustalenia i dochodzenia roszczeń lub obrony przed nimi – podstawą prawną przetwarzania
          jest uzasadniony interes Administratora (art. 6 ust. 1 lit. f RODO) polegający na ochronie jego praw.
        </li>
      </ul>
      <p>
        Aktywność Użytkownika w Serwisie, w tym jego dane osobowe, są rejestrowane w logach systemowych (specjalnym
        programie komputerowym służącym do przechowywania chronologicznego zapisu zawierającego informację o zdarzeniach
        i działaniach dotyczących systemu informatycznego służącego do świadczenia usług przez Administratora). Zebrane w
        logach informacje przetwarzane są przede wszystkim w celach związanych ze świadczeniem usług. Administrator
        przetwarza je również w celach technicznych, administracyjnych, na potrzeby zapewnienia bezpieczeństwa systemu
        informatycznego oraz zarządzania tym systemem, a także w celach analitycznych i statystycznych – w tym zakresie
        podstawą prawną przetwarzania jest prawnie uzasadniony interes Administratora (art. 6 ust. 1 lit. f RODO).
      </p>

      <h3 className="text-lg font-semibold text-neutral-200 mt-8">Rejestracja w serwisie</h3>
      <p>
        Osoby, które dokonują rejestracji w Serwisie, proszone są o podanie danych niezbędnych do utworzenia i obsługi
        konta. W celu ułatwienia obsługi użytkownik może podać dodatkowe dane, wyrażając tym samym zgodę na ich
        przetwarzanie. Takie dane można w każdym czasie usunąć. Podanie danych jest wymagane w celu założenia i obsługi
        konta, a ich niepodanie skutkuje brakiem możliwości założenia konta.
      </p>
      <p>Użytkownicy zakładający konto w Serwisie są zobowiązani do podania konkretnych informacji, takich jak:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>login</li>
        <li>imię i nazwisko</li>
        <li>adres korespondencyjny</li>
        <li>adres e-mail</li>
        <li>numer telefonu</li>
      </ul>
      <p>Powyższe dane zostaną wprowadzone automatycznie do bazy osobowej użytkowników Serwisu.</p>
      <p>Dane osobowe są przetwarzane:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          w celu świadczenia usług związanych z prowadzeniem i obsługą konta w Serwisie – podstawą prawną przetwarzania
          jest niezbędność przetwarzania do wykonania umowy (art. 6 ust. 1 lit. b RODO), a w zakresie danych podanych
          fakultatywnie – podstawą prawną przetwarzania jest zgoda (art. 6 ust. 1 lit. a RODO);
        </li>
        <li>
          w celach analitycznych i statystycznych – podstawą prawną przetwarzania jest uzasadniony interes Administratora
          (art. 6 ust. 1 lit. f RODO) polegający na prowadzeniu analiz aktywności Użytkowników w Serwisie i sposobu
          korzystania z konta, a także ich preferencji w celu poprawy stosowanych funkcjonalności;
        </li>
        <li>
          w celu ewentualnego ustalenia i dochodzenia roszczeń lub obrony przed nimi – podstawą prawną przetwarzania
          jest uzasadniony interes Administratora (art. 6 ust. 1 lit. f RODO) polegający na ochronie jego praw.
        </li>
      </ul>

      <p className="mt-6">
        Jeżeli Użytkownik umieszcza w Serwisie jakiekolwiek dane osobowe innych osób (w tym ich imię i nazwisko, adres,
        numer telefonu lub adres e-mail), może to uczynić jedynie pod warunkiem nienaruszenia przepisów obowiązującego
        prawa i dóbr osobistych tych osób. Istnieje możliwość, że Serwis będzie zmuszony ujawnić informacje o
        użytkowniku, gdy jest to wymagane przez prawo, w przypadku wezwania do sądu lub innego procesu prawnego, lub
        jeśli ujawnienie jest zasadnie konieczne, aby m.in.: zbadać, zapobiec lub podjąć działania w związku z
        podejrzeniem lub faktycznymi nielegalnymi działaniami lub pomóc rządowym organom ścigania; egzekwować umowy z
        użytkownikiem; egzekwować wymogi ustawy o prawie autorskim i prawach pokrewnych; egzekwować wymogi rozporządzenia
        RODO; badać i bronić się przed roszczeniami lub zarzutami stron trzecich; chronić bezpieczeństwo lub integralność
        usługi; wykonywać lub chronić prawa i bezpieczeństwo Administratora, Użytkowników lub innych osób.
      </p>
      <p>
        Powiadomimy w miarę możliwości każdą osobę o prawnych żądaniach dotyczących ich danych osobowych, gdy jest to
        uzasadnione naszym zdaniem, chyba że jest to zabronione przez prawo lub nakaz sądowy lub gdy żądanie jest nagłe.
        Możemy sprzeciwić się takim żądaniom, gdy uważamy, według naszego uznania, że prośby są wyolbrzymione, niejasne
        lub nie pochodzą od odpowiedniej władzy, ale nie obiecujemy kwestionować każdego żądania.
      </p>
      <p>
        Użytkownik ponosi wyłączną odpowiedzialność za wszelkie roszczenia osób trzecich z tytułu naruszenia przez niego
        autorskich praw majątkowych, autorskich praw osobistych lub jakichkolwiek praw osób trzecich w związku z
        korzystaniem z Serwisu i publikacją jego fotografii na stronach Serwisu. Zgodnie z powyższym Administrator jest
        zwolniony od odpowiedzialności dotyczącej jakichkolwiek roszczeń osób trzecich z tytułu naruszeń autorskich praw
        majątkowych, autorskich praw osobistych lub innych praw tych osób. W przypadku wystąpienia przez osoby trzecie z
        jakimikolwiek roszczeniami z tytułu naruszenia ich praw w wyniku publikacji przez użytkownika fotografii, analiz
        lub komentarzy w Serwisie, wyłącznie użytkownik będzie zobowiązany do poniesienia kosztów ewentualnego
        postępowania sądowego, kosztów zastępstwa procesowego oraz zasądzonych lub ustalonych w drodze ugody
        odszkodowań.
      </p>

      <h3 className="text-lg font-semibold text-neutral-200 mt-8">Portale społecznościowe</h3>
      <p>
        Serwis, po uzyskaniu dobrowolnej i wycofywalnej zgody użytkownika może publikować fotografie użytkowników na
        publicznych profilach serwisów społecznościowych, w tym Facebook, Instagram, Twitter i Youtube. Administrator
        przetwarza dane osobowe Użytkowników odwiedzających profile Administratora prowadzone w mediach społecznościowych
        (Facebook, YouTube, Instagram, Twitter). Dane te są przetwarzane wyłącznie w związku z prowadzeniem profilu, w tym
        w celu informowania Użytkowników o aktywności Administratora oraz promowaniu różnego rodzaju wydarzeń, usług
        oraz produktów, a także w celu komunikacji z użytkownikami za pośrednictwem funkcjonalności dostępnych w mediach
        społecznościowych. Podstawą prawną przetwarzania danych osobowych przez Administratora w tym celu jest jego
        uzasadniony interes (art. 6 ust. 1 lit. f RODO) polegający na promowaniu własnej marki oraz budowaniu i utrzymaniu
        społeczności związanej z marką.
      </p>
      <p>
        Użytkownik zakładając konto w Serwisie wskazuje unikalny identyfikator i hasło służące do korzystania z Serwisu.
        Użytkownik zobowiązany jest do nieujawniania danych służących do autoryzacji w portfolio osobom trzecim i ponosi
        odpowiedzialność za wszelkie skutki ujawnienia identyfikatora lub hasła.
      </p>

      <h3 className="text-lg font-semibold text-neutral-200 mt-8">Komunikacja pomiędzy Serwisem a użytkownikami</h3>
      <p>Przechowywane dane mogą być wykorzystywane do komunikacji między Administratorem a Użytkownikiem dotyczącej:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>sprzedaży dzieł i usług</li>
        <li>informacji i promocji</li>
        <li>innych wydarzeń związanych z charakterem Serwisu</li>
      </ul>
      <p>
        Serwis kontaktuje się z użytkownikami za pomocą adresu e-mail, wydarzeń, informacji na stronach Serwisu,
        wiadomości portalowych oraz ankiet. Wiadomości dotyczą działania serwisu, uaktualnień, bezpieczeństwa, poprawek,
        instrukcji oraz zarówno własnych jak i partnerów materiałów promocyjnych.
      </p>

      <h3 className="text-lg font-semibold text-neutral-200 mt-8">Komunikacja e-mail</h3>
      <p>
        Administrator w ramach Serwisu może gromadzić dane osobowe Użytkowników kontaktujących się za pośrednictwem
        adresu e-mail, które są niezbędne do zrealizowania prośby użytkownika i kontaktu z nim w razie konieczności.
        Kontakt możliwy będzie także poprzez wykorzystanie danych umieszczonych w tym celu na koncie użytkownika.
        Administrator jest uprawniony do gromadzenia innych danych dotyczących komunikacji z użytkownikami, np.
        informacji o prośbach o wsparcie lub informacji zwrotnych ze strony Użytkowników.
      </p>

      <h3 className="text-lg font-semibold text-neutral-200 mt-8">Jakie akcje powodują gromadzenie danych?</h3>
      <p>
        Zbieramy dane wtedy, gdy użytkownik publikuje zdjęcia do sprzedaży, publikuje komentarze do zdjęć, wypełnia
        formularze i ankiety oraz kupuje dzieła.
      </p>
      <p>
        Logujemy wizyty użytkownika i wyświetlanie stron w Serwisie, dotyczy to również statystyk użytkownika oraz
        urządzeń mobilnych. Monitorujemy użycie treści, aplikacji mobilnych i ich instalacje. Używamy loginów,
        ciasteczek, informacji o urządzeniach oraz mamy podgląd IP każdego Użytkownika.
      </p>

      <h3 className="text-lg font-semibold text-neutral-200 mt-8">Pliki cookies oraz podobna technologia</h3>
      <p>
        Pliki cookies to małe pliki tekstowe instalowane na urządzeniu Użytkownika przeglądającego Serwis. Cookies
        zbierają informacje ułatwiające korzystanie z Serwisu – np. poprzez zapamiętywanie odwiedzin Użytkownika w
        Serwisie i dokonywanych przez niego czynności. Zapisywane są na urządzeniu końcowym Użytkownika (komputerze,
        smartfonie, tablecie itp.). Dzięki zapisaniu tych plików na urządzeniu możliwe jest m.in. zapamiętanie danych
        logowania, dzięki czemu Użytkownik nie będzie musiał każdorazowo wpisywać loginu i hasła. Pliki te zapamiętują
        towary dodane do koszyka czy dostosowują treści strony do zainteresowań Użytkownika. Dzięki plikom cookie możliwe
        jest zbieranie danych statystycznych Serwisu, co umożliwia nam rozwijanie Serwisu zgodnie z preferencjami naszych
        Klientów. Jeśli Użytkownik nie zgadza się na zapisywanie plików cookies na swoim urządzeniu powinien w tym celu
        odpowiednio skonfigurować ustawienia przeglądarki lub każdorazowo po korzystaniu z serwisu usuwać z pamięci
        przeglądarki zapisane pliki cookies. Należy mieć na względzie, że stosowanie ograniczeń w zapisywaniu plików
        cookie może utrudnić lub uniemożliwić korzystanie z Serwisu.
      </p>
      <p>
        Administrator wykorzystuje tzw. cookie serwisowe przede wszystkim w celu dostarczania Użytkownikowi usług
        świadczonych drogą elektroniczną oraz poprawy jakości tych usług. W związku z tym Administrator oraz inne
        podmioty świadczące na jego rzecz usługi analityczne i statystyczne korzystają z plików cookies, przechowując
        informacje lub uzyskując dostęp do informacji już przechowywanych w telekomunikacyjnym urządzeniu końcowym
        Użytkownika (komputer, telefon, tablet itp.). Pliki cookies wykorzystywane w tym celu obejmują m.in.:{" "}
        <code className="text-orange-300">1P_JAR</code> używany przez usługę Google reCAPTCHA; <code className="text-orange-300">_ga</code> używane przez Google Analytics do rozróżniania użytkowników;{" "}
        <code className="text-orange-300">__utma</code>, <code className="text-orange-300">__utmb</code>,{" "}
        <code className="text-orange-300">__utmc</code>, <code className="text-orange-300">_utmz</code> – informacje o wizytach i sesji.
      </p>
      <p>
        Cookies innych witryn: Facebook, Twitter, Youtube mogą wysyłać cookies przydatne do dzielenia się treściami w
        sieciach społecznościowych lub do opracowania statystyk w sprawie dostępu. Obecność, liczba i status tych
        ciasteczek może zależeć od korzystania z danej platformy przed wizytą Serwisu lub w jej trakcie. Proszę zapoznać
        się z polityką zarządzania ciasteczkami sieci społecznościowych na danych stronach internetowych.
      </p>
      <p>
        Do analizy korzystania z naszej strony internetowej może być wykorzystywany Google Analytics. Dostawca usług
        analitycznych generuje informacje statystyczne i inne informacje na temat korzystania z witryny za pomocą plików
        cookie. Polityka prywatności dostawcy usług analitycznych jest dostępna pod adresem:{" "}
        <a
          href="https://www.google.com/policies/privacy/"
          className="text-odart-accent hover:text-orange-300 break-all"
          rel="noopener noreferrer"
        >
          https://www.google.com/policies/privacy/
        </a>
        .
      </p>
      <p>
        Blokowanie plików cookie: jeżeli zablokujesz ciasteczka, w większości przypadków nie będziesz mógł zalogować się
        na strony internetowe i będzie to mieć negatywny skutek na użyteczność stron z powodu braku możliwości korzystania
        z niektórych funkcji serwisu. Większość przeglądarek pozwala odmówić przyjęcia plików cookie. Usuwanie plików
        cookie: Użytkownik może usunąć ciasteczka już zapisane na swoim komputerze.
      </p>

      <h2 className="text-xl font-bold text-white mt-10">Artykuł V. Okres przetwarzania danych osobowych</h2>
      <p>
        Okres przetwarzania danych przez Administratora zależy od rodzaju świadczonej usługi i celu przetwarzania. Co do
        zasady dane przetwarzane są przez czas świadczenia usługi lub realizowania zamówienia, do czasu:
      </p>
      <ul className="list-disc pl-6 space-y-1">
        <li>zakończenia wykonywania umowy,</li>
        <li>
          wycofania wyrażonej zgody, gdy podstawą prawną przetwarzania danych jest zgoda Użytkownika,
        </li>
        <li>
          zgłoszenia skutecznego sprzeciwu względem przetwarzania danych w przypadkach, gdy podstawą prawną przetwarzania
          danych jest uzasadniony interes Administratora.
        </li>
      </ul>
      <p>
        Okres przetwarzania danych może być każdorazowo przedłużony w przypadku, gdy przetwarzanie jest niezbędne do
        ustalenia i dochodzenia ewentualnych roszczeń lub obrony przed nimi, a po tym czasie jedynie w przypadku i w
        zakresie, w jakim będą wymagać tego przepisy prawa. Po upływie okresu przetwarzania dane są nieodwracalnie usuwane
        lub anonimizowane.
      </p>

      <h2 className="text-xl font-bold text-white mt-10">Artykuł VI. Uprawnienia użytkownika</h2>
      <p>
        Użytkownikowi przysługuje prawo: dostępu do treści danych oraz żądania ich sprostowania, usunięcia, ograniczenia
        przetwarzania, prawo do przenoszenia danych oraz prawo wniesienia sprzeciwu względem przetwarzania danych, a także
        prawo wniesienia skargi do organu nadzorczego zajmującego się ochroną danych osobowych. W zakresie, w jakim dane
        Użytkownika przetwarzane są na podstawie zgody, można ją wycofać w dowolnym momencie, kontaktując się z
        Administratorem lub korzystając z funkcjonalności udostępnionych w Serwisie, w tym na adres e-mail:{" "}
        <a href="mailto:biuro@odart.pl" className="text-odart-accent hover:text-orange-300">
          biuro@odart.pl
        </a>
        . Użytkownik ma prawo zgłoszenia sprzeciwu względem przetwarzania danych dla celów marketingowych, jeśli
        przetwarzanie odbywa się w związku z uzasadnionym interesem Administratora, a także – z przyczyn związanych ze
        szczególną sytuacją Użytkownika – w innych przypadkach, gdy podstawą prawną przetwarzania danych jest uzasadniony
        interes Administratora (np. w związku z realizacją celów analitycznych i statystycznych).
      </p>
      <p>
        Użytkownicy, którzy utworzyli konto mają prawo do wglądu, edycji i usuwania podanych przez siebie danych w profilu
        lub poprzez kontakt za pośrednictwem adresu e-mail biuro@odart.pl.
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          skasowanie danych: Administrator usunie wszystkie lub część wskazanych danych do 3 dni roboczych, takich jak:
          zdjęcia, komentarze, posty, artykuły.
        </li>
        <li>zmiana i korekta danych: część danych może być zmieniona i poprawiona w profilu Użytkownika.</li>
        <li>częściowe lub całościowe wycofanie zgody na przetwarzanie danych za pośrednictwem adresu e-mail biuro@odart.pl.</li>
        <li>prawo Użytkownika do sprawdzenia danych używanych przez Administratora.</li>
      </ul>
      <p>
        <strong>Zamknięcie konta:</strong> jeżeli zdecydujesz się na zamknięcie konta, musisz wysłać informację na adres
        e-mail biuro@odart.pl – twoje konto zostanie skasowane w przeciągu 3 dni roboczych.
      </p>

      <h2 className="text-xl font-bold text-white mt-10">Artykuł VII. Odbiorcy danych</h2>
      <p>
        W związku z realizacją usług dane osobowe będą ujawniane zewnętrznym podmiotom, w tym w szczególności dostawcom
        odpowiedzialnym za obsługę systemów informatycznych, podmiotom takim jak banki i operatorzy płatności, podmioty
        świadczące usługi księgowe, kurierzy (w związku z realizacją zamówienia), agencje marketingowe (w zakresie usług
        marketingowych) oraz podmiotom powiązanym z Administratorem. W przypadku uzyskania zgody Użytkownika jego dane
        mogą zostać także udostępnione innym podmiotom do ich własnych celów, w tym celów marketingowych. Administrator
        zastrzega sobie prawo ujawnienia wybranych informacji dotyczących Użytkownika właściwym organom bądź osobom
        trzecim, które zgłoszą żądanie udzielenia takich informacji, opierając się na odpowiedniej podstawie prawnej oraz
        zgodnie z przepisami obowiązującego prawa. Administrator nie udostępnia zebranych danych osobowych Użytkowników
        podmiotom niepowiązanym bez zgody zainteresowanych Użytkowników. W ramach przyjętej polityki prywatności
        Administrator zobowiązuje się nie wypożyczać ani nie sprzedawać danych osobowych Użytkowników.
      </p>

      <h2 className="text-xl font-bold text-white mt-10">Artykuł VIII. Przekazywanie danych poza EOG</h2>
      <p>
        Poziom ochrony danych osobowych poza Europejskim Obszarem Gospodarczym (EOG) różni się od tego zapewnianego przez
        prawo europejskie. Z tego powodu Administrator przekazuje dane osobowe poza EOG tylko wtedy, gdy jest to konieczne,
        i z zapewnieniem odpowiedniego stopnia ochrony, przede wszystkim poprzez:
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          współpracę z podmiotami przetwarzającymi dane osobowe w państwach, w odniesieniu do których została wydana
          stosowna decyzja Komisji Europejskiej,
        </li>
        <li>stosowanie standardowych klauzul umownych wydanych przez Komisję Europejską,</li>
        <li>stosowanie wiążących reguł korporacyjnych, zatwierdzonych przez właściwy organ nadzorczy,</li>
        <li>
          w razie przekazywania danych do USA – współpracę z podmiotami uczestniczącymi w programie Tarcza Prywatności
          (Privacy Shield), zatwierdzonym decyzją Komisji Europejskiej.
        </li>
      </ul>
      <p>Administrator zawsze informuje o zamiarze przekazania danych osobowych poza EOG na etapie ich zbierania.</p>

      <h2 className="text-xl font-bold text-white mt-10">Artykuł IX. Bezpieczeństwo danych osobowych</h2>
      <p>
        Administrator zapewnia bezpieczeństwo danych osobowych dzięki odpowiednim środkom technicznym oraz organizacyjnym,
        mającym na celu zapobieżenie bezprawnemu przetwarzaniu danych oraz ich przypadkowej utracie, zniszczeniu oraz
        uszkodzeniu. Ponadto Administrator dokłada szczególnej staranności, żeby informacje osobowe były: poprawne i
        przetwarzane w sposób zgodny z prawem; uzyskane tylko dla określonych celów i nie przetwarzane dalej w sposób
        niezgodny z tymi celami; adekwatne, odpowiednie i nie nadmiarowe w stosunku do celów ich przetwarzania; dokładne i
        aktualne; nie przechowywane dłużej niż to niezbędne; bezpiecznie przechowywane; nie transferowane do państwa spoza
        Europejskiego Obszaru Gospodarczego bez odpowiedniej ochrony.
      </p>
      <p>W celu lepszego zabezpieczenia konta użytkownika rekomendowane jest:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          stosowanie złożonego hasła zabezpieczającego dostęp do konta uniemożliwiającego w prosty sposób odgadnięcie go
          przez osoby trzecie (minimum 8 znaków, duże i małe litery, cyfry i znaki specjalne);
        </li>
        <li>
          zachowanie loginu i hasła do konta Klienta w tajemnicy, w tym w szczególności nieprzekazywanie danych (loginu,
          hasła) jakimkolwiek osobom trzecim;
        </li>
        <li>
          wylogowanie się z Serwisu po każdej zakończonej sesji. Samo wyłączenie okna przeglądarki nie jest równoznaczne z
          wylogowaniem się ze strony odart.pl;
        </li>
        <li>korzystanie z programów antywirusowych, w tym regularne skanowanie dysków w poszukiwaniu wirusów;</li>
        <li>
          korzystanie z Serwisu wyłącznie za pośrednictwem zaufanych komputerów, na których zainstalowano wyłącznie
          sprawdzone oprogramowanie;
        </li>
        <li>
          jeśli Użytkownik korzysta z Serwisu za pomocą obcego komputera, np. w kafejce internetowej, nie powinien
          zapamiętywać danych na komputerze i powinien usunąć historię przeglądanych stron.
        </li>
      </ul>
      <p>
        Administrator na bieżąco prowadzi analizę ryzyka w celu zapewnienia, że dane osobowe przetwarzane są przez niego w
        sposób bezpieczny – zapewniający przede wszystkim, że dostęp do danych mają jedynie osoby upoważnione i jedynie w
        zakresie, w jakim jest to niezbędne ze względu na wykonywane przez nie zadania. Administrator dba o to, by
        wszystkie operacje na danych osobowych były rejestrowane i dokonywane jedynie przez uprawnionych pracowników i
        współpracowników. Administrator podejmuje wszelkie niezbędne działania, by także jego podwykonawcy i inne podmioty
        współpracujące dawały gwarancję stosowania odpowiednich środków bezpieczeństwa w każdym przypadku, gdy
        przetwarzają dane osobowe na zlecenie Administratora.
      </p>

      <h2 className="text-xl font-bold text-white mt-10">Artykuł X. Zmiany polityki prywatności</h2>
      <p>
        Polityka jest na bieżąco weryfikowana i w razie potrzeby aktualizowana. Kontakt z Administratorem jest możliwy
        poprzez adres e-mail{" "}
        <a href="mailto:biuro@odart.pl" className="text-odart-accent hover:text-orange-300">
          biuro@odart.pl
        </a>{" "}
        lub adres korespondencyjny: <strong>{ADMIN_FULL_NAME}</strong>, {ADMIN_ADDRESS}, POLAND.
      </p>
    </div>
  );
}
