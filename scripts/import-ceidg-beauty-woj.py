#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""CEIDG beauty → salon.odart.pl, województwo miastami (jak zamow — szybciej niż całe woj).

PKD 2025: 9621Z fryzjerstwo, 9622Z kosmetyka, 9623Z manicure/pedicure(+).

Usage:
  python3 scripts/import-ceidg-beauty-woj.py Zachodniopomorskie
  nohup python3 ... Zachodniopomorskie >> /tmp/import-salon-zp.log 2>&1 &
"""
from __future__ import annotations

import argparse
import json
import re
import secrets
import sqlite3
import subprocess
import time
import unicodedata
import urllib.parse
from datetime import datetime, timezone
from pathlib import Path

# Produkcja salon.odart.pl czyta tę samą bazę co zabiegi (DATABASE_URL).
DB = "/www/wwwroot/zabiegi.odart.pl/frontend/prisma/dev.db"
API = "https://dane.biznes.gov.pl/api/ceidg/v3/firmy"
PKDS = ("9621Z", "9622Z", "9623Z")
LIMIT = 25
SLEEP_S = 1.2

# Miasta per województwo (katalog beauty) — rozszerzone vs. sam rejestracja
WOJ_CITIES: dict[str, list[str]] = {
    "Zachodniopomorskie": [
        "Szczecin", "Koszalin", "Stargard", "Kołobrzeg", "Świnoujście",
        "Police", "Wałcz", "Białogard", "Goleniów", "Gryfino", "Nowogard",
        "Gryfice", "Choszczno", "Drawsko Pomorskie", "Sławno", "Szczecinek",
        "Mielno", "Międzyzdroje", "Darłowo", "Dziwnów", "Kamień Pomorski",
        "Rewal", "Trzebiatów", "Pyrzyce", "Myślibórz", "Barlinek", "Łobez",
        "Świdwin", "Złocieniec", "Karlino", "Gościno", "Ustronie Morskie",
        "Dźwirzyno", "Grzybowo",
    ],
    "Pomorskie": [
        "Gdańsk", "Gdynia", "Sopot", "Słupsk", "Tczew", "Starogard Gdański",
        "Wejherowo", "Rumia", "Chojnice", "Malbork", "Kwidzyn", "Lębork",
        "Pruszcz Gdański", "Reda", "Kartuzy", "Kościerzyna", "Puck", "Hel",
        "Władysławowo", "Ustka", "Łeba", "Krynica Morska",
    ],
}

PROTECTED_SLUGS = {
    "beauty-room", "czar-centrum-mocy", "fryzje-kolobrzeg",
    "gabinet-a", "gabinet-b", "gabinet-c", "gabinet-d", "gabinet-f", "gabinet-g",
    "masaze-kolobrzeg", "odkryj-blask", "beauty-kolobrzeg",
    "strona-kosmetyczki", "salon", "salon-demo",
}

DROP_RE = re.compile(
    r"\bdent\b|stomat|weteryn|kancelar|ubezpiec|komornik|budowl|"
    r"\bauto\b|mechanik|informat|księgow|ksiegow|nieruchom|"
    r"gastronom|restaur|pizzer|kebab|sushi|\bbar mleczny\b|"
    r"sklep spożyw|spożywcz|\bmarket\b|żabka|zabka|"
    r"transport|spedyc|kurier|ogólnobudowl|ogolnobudowl",
    re.I,
)
KEEP_RE = re.compile(
    r"fryzjer|barber|beauty|kosmet|nail|paznok|rzęs|rzes|"
    r"brwi|makijaż|makijaz|permanent|lashe|lash|brow|"
    r"spa\b|masaż|masaz|podolog|medycyna estet|"
    r"depilac|wosk|laser|mezoterap|botox|kwas hial|"
    r"manicure|pedicure|hybryd|studio urody|gabinet urody|"
    r"salon urody|atelier|hair|stylist",
    re.I,
)


def fold(s: str) -> str:
    s = (s or "").lower().replace("ł", "l").replace("Ł", "l")
    s = unicodedata.normalize("NFKD", s)
    return "".join(c for c in s if not unicodedata.combining(c))


CITY_FIX = {
    "szczecin": "Szczecin",
    "koszalin": "Koszalin",
    "stargard": "Stargard",
    "stargard szczecinski": "Stargard",
    "swinoujscie": "Świnoujście",
    "kolobrzeg": "Kołobrzeg",
    "bialogard": "Białogard",
    "gryfice": "Gryfice",
    "police": "Police",
    "walcz": "Wałcz",
}


def normalize_city(raw: str) -> str:
    s = (raw or "").strip() or "Polska"
    key = fold(s)
    if key in CITY_FIX:
        return CITY_FIX[key]
    if s != s.upper():
        return s
    return " ".join(p[:1].upper() + p[1:] for p in s.lower().split())


def slugify(name: str) -> str:
    s = fold(name)
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")[:48].strip("-")
    return s or "salon"


def classify(name: str) -> str:
    n = fold(name)
    if DROP_RE.search(n) and not KEEP_RE.search(n):
        return "drop"
    if KEEP_RE.search(n):
        return "keep"
    return "uncertain"


def token() -> str:
    for path in (
        Path("/www/wwwroot/salon.odart.pl/.env.local"),
        Path("/www/wwwroot/zamow.odart.pl/.env.local"),
    ):
        if not path.exists():
            continue
        for line in path.read_text().splitlines():
            if line.startswith("CEIDG_API_TOKEN="):
                return line.split("=", 1)[1].strip().strip('"').strip("'")
    raise SystemExit("Brak CEIDG_API_TOKEN")


def progress_path(woj: str) -> Path:
    return Path(f"/tmp/ceidg-beauty-{fold(woj).replace(' ', '-')}-cities-progress.json")


def load_progress(woj: str) -> dict:
    p = progress_path(woj)
    if not p.exists():
        return {"wojewodztwo": woj, "firms": {}, "done_keys": []}
    data = json.loads(p.read_text())
    data.setdefault("firms", {})
    data.setdefault("done_keys", [])
    return data


def save_progress(woj: str, data: dict) -> None:
    p = progress_path(woj)
    tmp = p.with_suffix(".tmp")
    tmp.write_text(json.dumps(data, ensure_ascii=False))
    tmp.replace(p)


def format_address(addr: dict | None, city: str) -> str:
    if not addr:
        return city
    ulica = (addr.get("ulica") or "").strip()
    bud = (addr.get("budynek") or "").strip()
    lok = (addr.get("lokal") or "").strip()
    street = " ".join(x for x in [ulica, bud] if x)
    if lok:
        street = f"{street} lok. {lok}".strip()
    kod = (addr.get("kod") or "").strip()
    miasto = (addr.get("miasto") or city).strip()
    parts = [p for p in [street, " ".join(x for x in [kod, miasto] if x)] if p]
    return ", ".join(parts) if parts else city


def fetch_page(tok: str, woj: str, city: str, pkd: str, page: int) -> dict:
    q = urllib.parse.urlencode(
        {
            "wojewodztwo": woj,
            "miasto": city,
            "pkd": pkd,
            "status": "AKTYWNY",
            "page": page,
            "limit": LIMIT,
        }
    )
    url = API + "?" + q
    for attempt in range(12):
        try:
            raw = subprocess.check_output(
                [
                    "curl", "-4", "-sS", "-m", "90",
                    "-H", f"Authorization: Bearer {tok}",
                    "-H", "Accept: application/json",
                    url,
                ],
                text=True,
                stderr=subprocess.DEVNULL,
            )
            if not raw.strip():
                raise TimeoutError("empty")
            return json.loads(raw)
        except Exception as e:
            if attempt < 11:
                wait = min(90, 8 * (attempt + 1))
                print(f"  retry {type(e).__name__} wait {wait}s", flush=True)
                time.sleep(wait)
                continue
            raise
    raise RuntimeError("fetch failed")


def unique_slug(conn: sqlite3.Connection, base: str) -> str:
    slug = base
    n = 2
    while conn.execute("SELECT 1 FROM Clinic WHERE slug=?", (slug,)).fetchone():
        slug = f"{base}-{n}"
        n += 1
        if n > 80:
            slug = f"{base}-{secrets.token_hex(3)}"
            break
    return slug


def snapshot_protected(conn: sqlite3.Connection):
    q = ",".join("?" * len(PROTECTED_SLUGS))
    return list(
        conn.execute(
            f"SELECT id, slug, name, isPublished FROM Clinic WHERE slug IN ({q})",
            tuple(PROTECTED_SLUGS),
        )
    )


def ensure_columns(conn: sqlite3.Connection) -> None:
    cols = {r[1] for r in conn.execute("PRAGMA table_info(Clinic)")}
    for col, typ in (
        ("listingSource", "TEXT"),
        ("ceidgId", "TEXT"),
        ("nip", "TEXT"),
        ("googlePlaceId", "TEXT"),
    ):
        if col not in cols:
            conn.execute(f'ALTER TABLE "Clinic" ADD COLUMN "{col}" {typ}')
            print(f"ALTER added {col}", flush=True)
    conn.commit()
    for sql in (
        'CREATE UNIQUE INDEX IF NOT EXISTS "Clinic_ceidgId_key" ON "Clinic"("ceidgId")',
        'CREATE INDEX IF NOT EXISTS "Clinic_listingSource_idx" ON "Clinic"("listingSource")',
        'CREATE INDEX IF NOT EXISTS "Clinic_city_idx" ON "Clinic"("city")',
        'CREATE INDEX IF NOT EXISTS "Clinic_isPublished_idx" ON "Clinic"("isPublished")',
    ):
        try:
            conn.execute(sql)
        except sqlite3.OperationalError as e:
            print("index note:", e, flush=True)
    conn.commit()


def insert_firms(conn: sqlite3.Connection, firms: dict, dry_run: bool) -> dict:
    existing_nips: set[str] = set()
    existing_ceidg: set[str] = set()
    existing_name_city: set[str] = set()
    for r in conn.execute("SELECT name, city, nip, ceidgId FROM Clinic"):
        existing_name_city.add(f"{fold(r['name'])}|{fold(r['city'])}")
        if r["nip"]:
            existing_nips.add(str(r["nip"]).strip())
        if r["ceidgId"]:
            existing_ceidg.add(str(r["ceidgId"]).strip())

    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000Z")
    inserted = published = skipped = dropped = uncertain = 0
    by_city: dict[str, int] = {}

    for f in firms.values():
        name = (f.get("nazwa") or "").strip()
        if not name:
            continue
        owner = f.get("wlasciciel") or {}
        nip = str(owner.get("nip") or "").strip()
        fid = str(f.get("id") or "").strip()
        if fid and fid in existing_ceidg:
            skipped += 1
            continue
        if nip and nip in existing_nips:
            skipped += 1
            continue
        addr = f.get("adresDzialalnosci") or {}
        city = normalize_city((addr.get("miasto") or "").strip() or "Polska")
        key = f"{fold(name)}|{fold(city)}"
        if key in existing_name_city:
            skipped += 1
            continue
        bucket = classify(name)
        if bucket == "drop":
            dropped += 1
            continue
        if bucket == "uncertain":
            uncertain += 1

        city_slug = fold(city).replace(" ", "-")[:24] or "pl"
        slug = unique_slug(conn, f"{slugify(name)}-{city_slug}")
        address = format_address(addr, city)
        desc = (
            f"{name} — salon / gabinet beauty w {city}. "
            "Informacje na podstawie publicznych danych CEIDG. "
            "Profil niepotwierdzony — właściciel może go przejąć w Salon Odart."
        )
        kontakt = json.dumps({"address": address}, ensure_ascii=False)
        cid = "c" + secrets.token_hex(12)
        if dry_run:
            inserted += 1
            published += 1
            by_city[city] = by_city.get(city, 0) + 1
            continue
        conn.execute(
            """
            INSERT INTO Clinic (
              id, slug, name, city, description, rating, reviewCount,
              specializations, matchingTags, treatmentIds, kontakt,
              avatarUrl, isPublished, cosmoStaffId, workingHours, bookingPhoneOnly,
              listingSource, ceidgId, nip, googlePlaceId, updatedAt
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
            """,
            (
                cid, slug, name, city, desc, 0, 0, "[]", "[]", "[]", kontakt,
                None, 1, None, None, 0, "ceidg", fid or None, nip or None, None, now,
            ),
        )
        inserted += 1
        published += 1
        by_city[city] = by_city.get(city, 0) + 1
        existing_name_city.add(key)
        if nip:
            existing_nips.add(nip)
        if fid:
            existing_ceidg.add(fid)
        if inserted % 200 == 0:
            conn.commit()
            print(f"  insert progress {inserted}", flush=True)
    if not dry_run:
        conn.commit()
    return {
        "inserted": inserted,
        "published": published,
        "skipped": skipped,
        "drop": dropped,
        "uncertain": uncertain,
        "by_city_published": by_city,
    }


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("wojewodztwo")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--db", default=DB)
    ap.add_argument("--insert-only", action="store_true")
    ap.add_argument("--cities", default="", help="CSV override listy miast")
    args = ap.parse_args()
    woj = args.wojewodztwo.strip()
    cities = [c.strip() for c in args.cities.split(",") if c.strip()]
    if not cities:
        cities = WOJ_CITIES.get(woj)
    if not cities:
        raise SystemExit(
            f"Brak listy miast dla {woj}. Dodaj do WOJ_CITIES albo --cities=..."
        )

    progress = load_progress(woj)
    done = set(progress.get("done_keys") or [])
    print(
        f"woj={woj} cities={len(cities)} cached_firms={len(progress['firms'])} done_keys={len(done)}",
        flush=True,
    )

    if not args.insert_only:
        tok = token()
        for city in cities:
            for pkd in PKDS:
                key = f"{city}|{pkd}"
                if key in done:
                    continue
                print(f"\n=== {city} / {pkd} ===", flush=True)
                page = 0
                while True:
                    data = fetch_page(tok, woj, city, pkd, page)
                    firmy = data.get("firmy") or []
                    for f in firmy:
                        fid = f.get("id")
                        if fid:
                            progress["firms"][str(fid)] = f
                    count = int(data.get("count") or 0)
                    print(
                        f"  page {page}: +{len(firmy)} count={count} unique={len(progress['firms'])}",
                        flush=True,
                    )
                    if not firmy or (page + 1) * LIMIT >= count:
                        break
                    page += 1
                    time.sleep(SLEEP_S)
                done.add(key)
                progress["done_keys"] = sorted(done)
                save_progress(woj, progress)
                time.sleep(SLEEP_S)

    conn = sqlite3.connect(args.db)
    conn.row_factory = sqlite3.Row
    ensure_columns(conn)
    before = snapshot_protected(conn)
    stats = insert_firms(conn, progress["firms"], args.dry_run)
    if not args.dry_run:
        after = {r["id"]: r for r in snapshot_protected(conn)}
        for r in before:
            a = after.get(r["id"])
            if not a or a["slug"] != r["slug"] or a["isPublished"] != r["isPublished"]:
                raise SystemExit(f"ERROR protected mutated {r['slug']}")

    summary = {"wojewodztwo": woj, "fetched": len(progress["firms"]), **stats, "dry_run": args.dry_run}
    out = Path(f"/tmp/import-salon-ceidg-{fold(woj).replace(' ', '-')}-summary.json")
    out.write_text(json.dumps(summary, ensure_ascii=False, indent=2))
    top = sorted(stats["by_city_published"].items(), key=lambda x: -x[1])[:40]
    print(
        f"DONE inserted={stats['inserted']} published={stats['published']} "
        f"skipped={stats['skipped']} drop={stats['drop']} uncertain={stats['uncertain']}",
        flush=True,
    )
    print("top cities:", top, flush=True)
    print("summary:", out, flush=True)
    conn.close()


if __name__ == "__main__":
    main()
