export default function RandkiRegulaminPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12 prose prose-rose">
      <h1>Regulamin Randki Odart</h1>
      <p>Ostatnia aktualizacja: {new Date().toISOString().slice(0, 10)}</p>
      <h2>1. Postanowienia ogólne</h2>
      <p>
        Serwis Randki Odart (randka.odart.pl) umożliwia tworzenie profilu randkowego, odkrywanie innych użytkowników,
        nawiązywanie dopasowań i komunikację. Korzystając z serwisu, akceptujesz niniejszy regulamin.
      </p>
      <h2>2. Wymagania</h2>
      <ul>
        <li>Musisz mieć ukończone 18 lat.</li>
        <li>Podajesz prawdziwe dane w zakresie wymaganym do korzystania z serwisu.</li>
        <li>Tworzysz jedno konto na osobę.</li>
      </ul>
      <h2>3. Zakazane treści i zachowania</h2>
      <p>
        Zabronione są treści wulgarne, nękające, dyskryminujące, oszustwa, spam oraz publikowanie cudzych zdjęć bez
        zgody. Zastrzegamy prawo do zawieszenia konta po zgłoszeniu lub moderacji.
      </p>
      <h2>4. Bezpieczeństwo</h2>
      <p>
        Spotkania offline organizujesz na własną odpowiedzialność. Nie udostępniaj danych wrażliwych (PESEL, hasła
        bankowe) w czacie.
      </p>
      <h2>5. Kontakt</h2>
      <p>Pytania: biuro@odart.pl</p>
    </main>
  );
}
