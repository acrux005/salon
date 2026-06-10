# Kalendarz dostępnych terminów — integracja z kalendarzem WordPress

## Założenie

**Kalendarz na WordPressie** (np. pod zabiegi.odart.pl) to **kalendarz dla kosmetyczki** — źródło prawdy dla dostępności i miejsce zapisu rezerwacji. Strona SkinMatch **nie przekierowuje** użytkownika na panel; zamiast tego:

1. **Dostępność** — strona pobiera dostępne sloty z kalendarza WordPress (gdy skonfigurowane).
2. **Rezerwacja** — po wyborze terminu i kliknięciu „Umów” rezerwacja jest **zapisywana w kalendarzu WordPress** przez API (serwer Next.js wywołuje WordPress). Dostępność jest weryfikowana po stronie WordPress.

## Tryb działania

- **Bez konfiguracji WordPress:**  
  `/api/availability` zwraca **mock** (9–17, co 30 min). `POST /api/booking` zwraca **503** z komunikatem, że rezerwacja nie jest skonfigurowana.

- **Z konfiguracją WordPress:**  
  Ustaw w `.env` zmienne (patrz niżej). Wtedy:
  - **GET /api/availability** — serwer Next.js wywołuje endpoint WordPressa po dostępność i zwraca sloty w jednolitym formacie.
  - **POST /api/booking** — serwer Next.js wysyła rezerwację do WordPress; kalendarz WordPress zapisuje termin i może zweryfikować dostępność przed zapisem.

## Konfiguracja (Cosmo Scheduler na zabiegi.odart.pl)

Strona WordPress używa wtyczki **Cosmo Scheduler** z publicznym API (chronionym kluczem). W panelu WordPress: **Kosmetyczka → Ustawienia SMS** — sekcja **„API zewnętrzne”** — ustaw **Klucz API (public)** i zapisz.

W `.env` aplikacji Next.js (bez udostępniania klucza w JS):

```env
BOOKING_WP_AVAILABILITY_URL="https://salon.odart.pl/wp-json/cosmo/v1/public/available-times"
BOOKING_WP_BOOKING_URL="https://salon.odart.pl/wp-json/cosmo/v1/public/appointments"
BOOKING_WP_API_KEY="ten-sam-klucz-co-w-wordpress"
```

- **Dostępność:** Next wywołuje dla każdego dnia z zakresu `GET …/public/available-times?date=YYYY-MM-DD&api_key=…` (lub nagłówek `X-Cosmo-Api-Key`). Cosmo zwraca `{ ok, date, available: ["08:00",…] }` — Next mapuje to na format `{ date, slots }[]`.
- **Rezerwacja:** Next wysyła `POST …/public/appointments` z body `{ api_key, date, time, new_name?, new_phone? }`. Cosmo tworzy klientkę (lub używa „Rezerwacja ze strony”) i zapisuje wizytę w kalendarzu.

## Endpointy aplikacji Next.js

| Metoda | Ścieżka | Opis |
|--------|---------|------|
| GET | `/api/availability` | Zwraca dostępne terminy. Gdy ustawiono `BOOKING_WP_AVAILABILITY_URL` — proxy do WordPress; w przeciwnym razie mock. |
| POST | `/api/booking` | Zapisuje rezerwację. Gdy ustawiono `BOOKING_WP_BOOKING_URL` — proxy do WordPress; w przeciwnym razie 503. |

### GET /api/availability

**Query:** `gabinetSlug`, `from` (YYYY-MM-DD), `to` (YYYY-MM-DD), opcjonalnie `serviceSlug`.

**Odpowiedź:** `{ date, slots: { start, end, available, id }[] }[]`.

**Cache:** 60 s.

### POST /api/booking

**Body:** `clinicSlug`, `date` (YYYY-MM-DD), `time` (HH:mm), opcjonalnie `serviceSlug`, `name`, `email`.

**Sukces:** `{ success: true, id? }`.  
**Błąd:** `{ error: string, code? }` (400/502/503).

## Cosmo Scheduler (WordPress) — publiczne endpointy

Na **zabiegi.odart.pl** wtyczka Cosmo Scheduler udostępnia:

| Endpoint | Metoda | Opis |
|----------|--------|------|
| `/wp-json/cosmo/v1/public/available-times` | GET | Parametry: `date` (YYYY-MM-DD), `api_key`. Zwraca `{ ok, date, available: ["08:00",…], booked }`. Godziny 8:00–20:00 co 30 min, pomniejszone o zajęte wizyty. |
| `/wp-json/cosmo/v1/public/appointments` | POST | Body: `api_key`, `date`, `time` (lub `scheduled_at`), opcjonalnie `staff_id`, `service_id`, `new_name`, `new_phone`. Tworzy klientkę (lub używa „Rezerwacja ze strony”) i zapisuje wizytę. |

Klucz API ustawiasz w WordPress: **Kosmetyczka → Ustawienia SMS → Klucz API (public)**.

## Pliki

- **Modal:** `components/BookingCalendarModal.tsx` — kalendarz, godziny, przycisk „Umów” wywołuje `POST /api/booking` (bez przekierowania); komunikat sukcesu/błędu.
- **Hook:** `hooks/useAvailability.ts` — pobieranie z `/api/availability`.
- **API:** `app/api/availability/route.ts` — GET, opcjonalnie proxy do WordPress, fallback mock.  
- **API:** `app/api/booking/route.ts` — POST, proxy do WordPress (gdy skonfigurowane).
- **Integracja:** `components/clinic/ClinicSidebar.tsx` — przycisk „Zobacz dostępne terminy” otwiera modal.

## Strefa czasowa i format

- Strefa: **Europe/Warsaw**.
- W UI: formaty PL (daty i godziny).

## Bezpieczeństwo

- Wywołania do WordPress (dostępność i rezerwacja) wykonuje **wyłącznie serwer Next.js** (API routes). Tokeny/klucze nie trafiają do przeglądarki.
- Rezerwacja jest weryfikowana i zapisywana w kalendarzu WordPress; strona tylko przekazuje wybór użytkownika i ewentualne dane kontaktowe.
