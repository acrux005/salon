# Zabiegi / SkinMatch — frontend

Next.js (App Router), portal gabinetów, quiz dopasowania, panel rejestracji i edycji gabinetów.

## Wymagania

- Node 18+
- (Opcjonalnie) SQLite — do działania panelu gabinetów i zapisu danych w DB

## Instalacja i uruchomienie

```bash
npm install
npm run dev
```

Aplikacja działa z `basePath`: `/oferta` (np. `http://localhost:3000/oferta`).

## Panel gabinetów (auth + DB)

### Zmienne środowiskowe

W pliku `.env` lub `.env.local`:

| Zmienna | Opis |
|--------|------|
| `DATABASE_URL` | **Wymagane dla panelu.** Produkcja (PostgreSQL): `postgresql://user:haslo@host:5432/nazwa_bazy`. Lokalnie (SQLite): w `prisma/schema.prisma` ustaw `provider = "sqlite"` i `DATABASE_URL="file:./prisma/dev.db"`. |
| `NEXTAUTH_SECRET` | **Wymagane dla NextAuth.** Losowy ciąg (np. `openssl rand -base64 32`). |
| `NEXTAUTH_URL` | **Produkcja.** Pełny URL aplikacji, np. `https://domena.pl/oferta`. W dev Next.js ustawia to automatycznie. |
| `NEXT_PUBLIC_BASE_PATH` | Zazwyczaj `/oferta` (zgodne z `next.config.js`). |
| `DEMO_CLINIC_PASSWORD` | (Opcjonalnie) Hasło dla konta demo. Jeśli ustawione (min. 10 znaków), seed utworzy/zaktualizuje konto `demo@skinmatch.pl` dla gabinetu „odkryj-blask”. |

### Migracje i seed

**Produkcja (PostgreSQL)** — domyślny schemat w projekcie:

1. W `.env` ustaw `DATABASE_URL=postgresql://user:haslo@host:5432/nazwa_bazy`.
2. Na serwerze / przy pierwszym wdrożeniu:

```bash
npx prisma migrate deploy
npx prisma db seed
```

Opcjonalnie z kontem demo:

```bash
DEMO_CLINIC_PASSWORD="TwojeHasloDemo" npx prisma db seed
```

**Lokalnie (SQLite):**  
W `prisma/schema.prisma` ustaw `provider = "sqlite"`, w `.env` wpisz `DATABASE_URL="file:./prisma/dev.db"`, potem:

```bash
npx prisma migrate dev
npx prisma db seed
```

### Demo login

Po wykonaniu seed z ustawionym `DEMO_CLINIC_PASSWORD`:

- **URL logowania:** `/oferta/portal/login`
- **Email:** `demo@skinmatch.pl`
- **Hasło:** wartość `DEMO_CLINIC_PASSWORD` (np. `DemoHaslo123!`)

Po zalogowaniu: **Panel** → `/oferta/portal/panel`, **Edycja danych** → `/oferta/portal/panel/klinika`. Profil publiczny: `/oferta/portal/gabinet/odkryj-blask`.

### Trasy panelu

| Ścieżka | Opis |
|---------|------|
| `/oferta/portal/login` | Logowanie (Credentials). |
| `/oferta/portal/register` | Rejestracja nowego gabinetu (wariant MVP: tylko nowe gabinety). |
| `/oferta/portal/panel` | Dashboard — link do edycji i podgląd profilu. |
| `/oferta/portal/panel/klinika` | Formularz edycji danych gabinetu (nazwa, miasto, opis, kontakt, specjalizacje, zabiegi, widoczność). |

Trasy `/oferta/portal/panel` i `/oferta/portal/panel/*` są chronione przez middleware (przekierowanie na `/oferta/portal/login` przy braku sesji).

## Skrypty

- `npm run dev` — serwer deweloperski
- `npm run build` — build produkcyjny
- `npm run start` — uruchomienie po buildzie
- `npm run test` — testy (Vitest)
- `npm run db:seed` — seed bazy (wymaga `DATABASE_URL`)
- `npm run db:migrate` — migracje (dev)
