# Cosmo Scheduler API – użycie w projekcie

Dokument opisuje **endpointy i parametry Cosmo**, z których korzysta aplikacja (WordPress: „Kosmetyczka” / Cosmo Scheduler). Bazę stanowi kod w `app/api/booking/*` i `app/api/availability/route.ts`.

**Konfiguracja (.env):**
- `BOOKING_WP_AVAILABILITY_URL` – np. `https://.../wp-json/cosmo/v1/public/available-times` (baza URL)
- `BOOKING_WP_BOOKING_URL` – np. `https://.../wp-json/cosmo/v1/public/appointments` (POST rezerwacji)
- `BOOKING_WP_API_KEY` – klucz API

**Nagłówek:** wszystkie requesty używają `X-Cosmo-Api-Key: <API_KEY>`.

---

## 1. Dostępne godziny (availability)

**URL:** `{BASE}/public/available-times`  
**Metoda:** GET  
**Query:**
- `date` (wymagane) – YYYY-MM-DD
- `api_key` – klucz API
- `staff_id` (opcjonalne) – id kosmetyczki

**Oczekiwana odpowiedź:**
```json
{
  "ok": true,
  "available": ["09:00", "09:30", "10:00", ...]
}
```
`available` – tablica stringów czasu w formacie "HH:mm" (np. co 30 min).

---

## 2. Kalendarz (wizyty wg miesiąca)

**URL:** `{BASE}/public/calendar`  
**Metoda:** GET  
**Query:**
- `month` (wymagane) – YYYY-MM
- `api_key` – klucz API
- `staff_id` (opcjonalne) – id kosmetyczki

**Oczekiwana odpowiedź:**
```json
{
  "ok": true,
  "month": "2026-02",
  "appointments": {
    "2026-02-18": [
      {
        "id": 123,
        "client": "Anna Kowalska",
        "phone": "+48...",
        "service": "Nazwa zabiegu",
        "staff": "Imię kosmetyczki",
        "time": "10:00",
        "status": "planned"
      }
    ]
  }
}
```
**Statusy:** `planned` | `done` | `cancelled` | `archived`.  
Anulowane (`cancelled`) są pomijane przy liczeniu zajętych godzin w availability.

---

## 3. Utworzenie rezerwacji (POST)

**URL:** z konfiguracji `BOOKING_WP_BOOKING_URL` (np. `{BASE}/public/appointments`)  
**Metoda:** POST  
**Body (JSON):**
- `api_key` – klucz API
- `date` – YYYY-MM-DD
- `time` – HH:mm
- `new_name` – imię i nazwisko klienta (opcjonalne przy blokadzie)
- `new_phone` – telefon (opcjonalne; przy braku może być email lub "-")
- `service_id` (opcjonalne) – id zabiegu
- `staff_id` (opcjonalne) – id kosmetyczki

**Oczekiwana odpowiedź:**
```json
{ "ok": true, "id": 123 }
```

---

## 4. Aktualizacja wizyty (PATCH)

**URL:** `{BASE}/public/appointments/{id}`  
**Metoda:** PATCH  
**Body (JSON):** przekazywane do Cosmo w całości + `api_key`.

W aplikacji używane są m.in.:
- `status` – "done" | "cancelled" (oznaczenie zrealizowana / anulowana)
- przy **edycji rezerwacji** wysyłane są (nazwy mogą zależeć od wersji Cosmo):
  - `date` – YYYY-MM-DD
  - `time` – HH:mm
  - `new_name` – klientka
  - `new_phone` – telefon
  - `service_id` – id zabiegu (opcjonalnie)

**Uwaga:** Jeśli Cosmo przyjmuje inne nazwy pól (np. `client_name` zamiast `new_name`), trzeba dodać mapowanie w `app/api/booking/appointments/[id]/route.ts`.

---

## 5. Lista wizyt (GET appointments)

**URL:** `{BASE}/public/appointments`  
**Metoda:** GET  
**Query:**
- `api_key` – klucz API
- `status` – "planned" | "done" | "cancelled" (domyślnie "planned")
- `staff_id` (opcjonalne) – id kosmetyczki

Używane do listy rezerwacji w panelu (np. „Wszystkie rezerwacje”); format odpowiedzi zależy od Cosmo (tablica lub obiekt z `items`).

---

## 6. Lista zabiegów (services)

**URL:** `{BASE}/public/services`  
**Metoda:** GET  
**Query:** `api_key`

Oczekiwany format: tablica lub obiekt z `items`, elementy z polami `id`, `name` (ew. `slug`).

---

## 7. Lista kosmetyczek (staff)

**URL:** `{BASE}/public/staff`  
**Metoda:** GET  
**Query:** `api_key`

Oczekiwany format: tablica lub obiekt z `items`, elementy z polami `id`, `name` (ew. `phone`).

---

## Podsumowanie

| Endpoint                     | Metoda | Opis                          |
|-----------------------------|--------|-------------------------------|
| `/public/available-times`   | GET    | Wolne godziny na dzień        |
| `/public/calendar`          | GET    | Wizyty wg miesiąca            |
| `/public/appointments`      | GET    | Lista wizyt (filtr status, staff) |
| `/public/appointments`      | POST   | Nowa rezerwacja / blokada     |
| `/public/appointments/{id}` | PATCH  | Aktualizacja (status, termin, dane) |
| `/public/appointments/{id}` | DELETE | Całkowite usunięcie wizyty z kalendarza (query: `api_key`) |
| `/public/services`          | GET    | Lista zabiegów                |
| `/public/staff`             | GET    | Lista kosmetyczek             |

Autentykacja: query `api_key` + nagłówek `X-Cosmo-Api-Key`.
