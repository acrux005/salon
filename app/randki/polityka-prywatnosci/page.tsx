export default function RandkiPrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12 prose prose-rose">
      <h1>Polityka prywatności Randki Odart</h1>
      <p>Ostatnia aktualizacja: {new Date().toISOString().slice(0, 10)}</p>
      <h2>Administrator danych</h2>
      <p>ODART — kontakt: biuro@odart.pl</p>
      <h2>Jakie dane przetwarzamy</h2>
      <ul>
        <li>E-mail i hasło (hash) konta</li>
        <li>Dane profilu: imię/pseudonim, wiek, miasto, zdjęcia, bio, zainteresowania</li>
        <li>Historia śladów rezonansu, dopasowań i wiadomości</li>
        <li>Zgłoszenia i blokady użytkowników</li>
      </ul>
      <h2>Cel przetwarzania</h2>
      <p>Świadczenie usługi randkowej, bezpieczeństwo, moderacja i obsługa konta.</p>
      <h2>Twoje prawa</h2>
      <p>
        Masz prawo dostępu, sprostowania, usunięcia konta i eksportu danych (ustawienia konta). Skargi: UODO.
      </p>
      <h2>Pliki cookies</h2>
      <p>Sesja logowania i niezbędne cookies techniczne. Analityka tylko za zgodą, jeśli włączona.</p>
    </main>
  );
}
