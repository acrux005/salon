/**
 * Seed / uzupełnienie demo profili randkowych:
 * npx tsx prisma/seedRandki.ts
 */
import bcrypt from "bcrypt";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:/www/wwwroot/zabiegi.odart.pl/frontend/prisma/dev.db",
});
const prisma = new PrismaClient({ adapter });

type DemoVibe = {
  slotType: string;
  platform: string;
  url: string | null;
  title: string;
  embedUrl?: string | null;
  thumbnailUrl?: string | null;
  caption: string;
};

type DemoDef = {
  email: string;
  slug: string;
  initial: string;
  color: string;
  name: string;
  birthYear: number;
  city: string;
  gender: string;
  lookingFor: string[];
  bio: string;
  interests: string[];
  prompts: { question: string; answer: string }[];
  mood: string;
  activityIntent: string;
  circleSlug: string;
  auraImageUrl?: string;
  auraImageUrl2?: string;
  auraImageUrl3?: string;
  auraCaption?: string;
  vibes?: DemoVibe[];
  extraPhotoUrl?: string;
};

const DEMO: DemoDef[] = [
  {
    email: "ania.demo@randka.odart.pl",
    slug: "ania",
    initial: "A",
    color: "#e11d48",
    name: "Ania",
    birthYear: 1995,
    city: "Warszawa",
    gender: "woman",
    lookingFor: ["man"],
    bio: "Lubię kawę, spacery nad Wisłą i dobre kino.",
    interests: ["kawiarnie", "nocne spacery", "jazz"],
    prompts: [
      { question: "Idealny wtorek wieczorem?", answer: "Kawa bez pośpiechu i rozmowa, która nie kończy się na „a Ty?”" },
      { question: "Po czym poznajesz, że dobrze się przy kimś czujesz?", answer: "Nie muszę nic udawać — mogę milczeć." },
    ],
    mood: "calm",
    activityIntent: "coffee",
    circleSlug: "creatives",
    auraImageUrl: "https://images.unsplash.com/photo-1419242902214-272b066170b4?w=600&q=80",
    auraImageUrl2: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
    auraImageUrl3: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80",
    auraCaption: "góry we mnie, spokój po burzy",
    vibes: [
      {
        slotType: "music",
        platform: "spotify",
        url: "https://open.spotify.com/track/4cOdK2wglTKBFrVl7gY4P7",
        title: "Apocalypse — Cigarettes After Sex",
        embedUrl: "https://open.spotify.com/embed/track/4cOdK2wglTKBFrVl7gY4P7?utm_source=randka",
        thumbnailUrl: null,
        caption: "bas w aucie nocą, deszcz na szybie",
      },
    ],
  },
  {
    email: "tomek.demo@randka.odart.pl",
    slug: "tomek",
    initial: "T",
    color: "#1d4ed8",
    name: "Tomek",
    birthYear: 1992,
    city: "Warszawa",
    gender: "man",
    lookingFor: ["woman"],
    bio: "Programista, biegam w Łazienkach, gotuję w weekendy.",
    interests: ["gotowanie w weekend", "psy", "jazz"],
    prompts: [
      { question: "Z kim można jechać bez celu?", answer: "Z kim nie trzeba tłumaczyć, dokąd jedziemy." },
      { question: "Najlepsza randka, jaką miałem/am to…", answer: "Spontaniczny spacer i lody o północy." },
    ],
    mood: "chat",
    activityIntent: "coffee",
    circleSlug: "startup",
    auraImageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80",
    auraCaption: "neon miasta, myśli które nie śpią",
    vibes: [
      {
        slotType: "music",
        platform: "spotify",
        url: "https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b",
        title: "Blinding Lights — The Weeknd",
        embedUrl: "https://open.spotify.com/embed/track/0VjIjW4GlUZAMYd2vXMi3b?utm_source=randka",
        caption: "nocny bieg po deszczu",
      },
    ],
  },
  {
    email: "piotr.demo@randka.odart.pl",
    slug: "piotr",
    initial: "P",
    color: "#0f766e",
    name: "Piotr",
    birthYear: 1990,
    city: "Warszawa",
    gender: "man",
    lookingFor: ["woman"],
    bio: "Architekt, wolę rozmowę niż small talk.",
    interests: ["design", "nocne spacery", "film autorski"],
    prompts: [
      { question: "Idealny wtorek wieczorem?", answer: "Winyl, okno na podwórko, zero pośpiechu." },
      { question: "Z kim utknął(a)byś na stacji o 1 w nocy?", answer: "Z kim czas się rozciąga — nie znika." },
    ],
    mood: "calm",
    activityIntent: "coffee",
    circleSlug: "creatives",
    auraImageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80",
    auraCaption: "las w głowie, cisza która nie jest pusta",
    extraPhotoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=480&q=80",
    vibes: [
      {
        slotType: "film",
        platform: "tmdb",
        url: "https://www.themoviedb.org/movie/11216",
        title: "Lost in Translation (2003)",
        thumbnailUrl: "https://image.tmdb.org/t/p/w342/wfpSnKwNW6jJJBifNaR3A9VAX11.jpg",
        caption: "samotność która nie boli, gdy ktoś obok milczy",
      },
      {
        slotType: "music",
        platform: "spotify",
        url: "https://open.spotify.com/track/6lanRgr6wXibZr8KgzXxBl",
        title: "Pink Moon — Nick Drake",
        embedUrl: "https://open.spotify.com/embed/track/6lanRgr6wXibZr8KgzXxBl?utm_source=randka",
        caption: "koc i herbata o 22",
      },
    ],
  },
  {
    email: "michal.demo@randka.odart.pl",
    slug: "michal",
    initial: "M",
    color: "#b45309",
    name: "Michał",
    birthYear: 1994,
    city: "Warszawa",
    gender: "man",
    lookingFor: ["woman"],
    bio: "Muzyk, kocham jazz i długie rozmowy przy winie.",
    interests: ["jazz", "wino naturalne", "koncerty na żywo"],
    prompts: [
      { question: "Jak wygląda spokojny wieczór idealny?", answer: "Trzy utwory na gitarze, potem cisza i śmiech." },
      { question: "Po czym poznajesz, że dobrze się przy kimś czujesz?", answer: "Nie sprawdzam telefonu przez godzinę." },
    ],
    mood: "date",
    activityIntent: "coffee",
    circleSlug: "creatives",
    auraImageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80",
    auraCaption: "scena, światło reflektorów, serce które gra",
    vibes: [
      {
        slotType: "youtube",
        platform: "youtube",
        url: "https://www.youtube.com/watch?v=E8gmARGvPlI",
        title: "Erik Satie — Gnossienne No.1",
        embedUrl: "https://www.youtube.com/embed/E8gmARGvPlI",
        thumbnailUrl: "https://img.youtube.com/vi/E8gmARGvPlI/hqdefault.jpg",
        caption: "wracam do tego po trudnym dniu",
      },
    ],
  },
  {
    email: "krzysiek.demo@randka.odart.pl",
    slug: "krzysiek",
    initial: "K",
    color: "#4338ca",
    name: "Krzysiek",
    birthYear: 1988,
    city: "Warszawa",
    gender: "man",
    lookingFor: ["woman"],
    bio: "Introvert energy. Spacery, książki, dobre pytania.",
    interests: ["ksiazki", "spokojne poranki", "filozofia przy kawie"],
    prompts: [
      { question: "Z kim można jechać bez celu?", answer: "Z kim mapa nie jest potrzebna." },
      { question: "Idealny wtorek wieczorem?", answer: "Książka, herbata, jedna wiadomość od kogoś ważnego." },
    ],
    mood: "calm",
    activityIntent: "walk",
    circleSlug: "introverts",
    auraImageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&q=80",
    auraCaption: "mgła nad jeziorem, myśli które nie gonią",
    vibes: [
      {
        slotType: "quote",
        platform: "text",
        url: null,
        title: "Nie musisz być głośny, żeby być obecny.",
        caption: "zdanie które wraca",
      },
    ],
  },
  {
    email: "ola.demo@randka.odart.pl",
    slug: "ola",
    initial: "O",
    color: "#db2777",
    name: "Ola",
    birthYear: 1996,
    city: "Warszawa",
    gender: "woman",
    lookingFor: ["man"],
    bio: "UX designerka. Wolę jakość nad ilość rozmów.",
    interests: ["design", "kawiarnie", "galerie"],
    prompts: [
      { question: "Jak wygląda spokojny wieczór idealny?", answer: "Sketchbook, lampka, rozmowa bez planu B." },
    ],
    mood: "date",
    activityIntent: "coffee",
    circleSlug: "creatives",
    auraImageUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=80",
    auraCaption: "zimowe góry, ciepło które nosisz w środku",
    vibes: [
      {
        slotType: "music",
        platform: "spotify",
        url: "https://open.spotify.com/track/0A0FLsqk8l8GQN4bJzEAXr",
        title: "Space Song — Beach House",
        embedUrl: "https://open.spotify.com/embed/track/0A0FLsqk8l8GQN4bJzEAXr?utm_source=randka",
        caption: "wieczór kiedy wszystko zwalnia",
      },
    ],
  },
  {
    email: "kasia.demo@randka.odart.pl",
    slug: "kasia",
    initial: "K",
    color: "#7c3aed",
    name: "Kasia",
    birthYear: 1998,
    city: "Warszawa",
    gender: "woman",
    lookingFor: ["man", "other"],
    bio: "Fotografia uliczna i góry poza sezonem.",
    interests: ["fotografia uliczna", "góry poza sezonem", "slow mornings"],
    prompts: [
      { question: "Jak wygląda spokojny wieczór idealny?", answer: "Herbata, koc i rozmowa bez pośpiechu." },
      { question: "Idealny wtorek wieczorem?", answer: "Spacer z aparatem, potem zdjęcia na kanapie." },
    ],
    mood: "walk",
    activityIntent: "walk",
    circleSlug: "photographers",
    auraImageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80",
    auraCaption: "światło złotej godziny, zawsze gdzieś czeka",
    vibes: [
      {
        slotType: "music",
        platform: "spotify",
        url: "https://open.spotify.com/track/5DxDLsW6Psy07cRuniCb4n",
        title: "Holocene — Bon Iver",
        embedUrl: "https://open.spotify.com/embed/track/5DxDLsW6Psy07cRuniCb4n?utm_source=randka",
        caption: "góry o świcie, para z ust",
      },
    ],
  },
];

function normalizePair(a: string, b: string): [string, string] {
  return a < b ? [a, b] : [b, a];
}

async function ensureDemoPhoto(slug: string, initial: string, color: string): Promise<string> {
  const dir = path.join(process.cwd(), "public", "uploads", "randki");
  await mkdir(dir, { recursive: true });
  const fileName = `demo-${slug}.svg`;
  const filePath = path.join(dir, fileName);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect fill="${color}" width="400" height="400"/><text x="200" y="220" text-anchor="middle" fill="white" font-size="140" font-family="system-ui,sans-serif" font-weight="600">${initial}</text></svg>`;
  await writeFile(filePath, svg, "utf8");
  return `/uploads/randki/${fileName}`;
}

async function ensureDemoRoom(accountId: string, d: DemoDef) {
  if (d.auraImageUrl || d.auraImageUrl2 || d.auraImageUrl3) {
    await prisma.datingProfile.update({
      where: { accountId },
      data: {
        auraImageUrl: d.auraImageUrl ?? null,
        auraImageUrl2: d.auraImageUrl2 ?? null,
        auraImageUrl3: d.auraImageUrl3 ?? null,
        auraCaption: d.auraCaption ?? "",
        auraStatus: "uploaded",
      },
    });
  }

  if (d.vibes?.length) {
    await prisma.datingVibeMaterial.deleteMany({ where: { accountId } });
    for (let i = 0; i < d.vibes.length; i++) {
      const v = d.vibes[i];
      await prisma.datingVibeMaterial.create({
        data: {
          accountId,
          url: v.url,
          title: v.title,
          platform: v.platform,
          embedUrl: v.embedUrl ?? null,
          thumbnailUrl: v.thumbnailUrl ?? null,
          caption: v.caption,
          slotType: v.slotType,
          sortOrder: i,
        },
      });
    }
  }

  if (d.extraPhotoUrl) {
    const existing = await prisma.datingPhoto.findFirst({
      where: { accountId, url: d.extraPhotoUrl },
    });
    if (!existing) {
      const count = await prisma.datingPhoto.count({ where: { accountId } });
      await prisma.datingPhoto.create({
        data: {
          accountId,
          url: d.extraPhotoUrl,
          order: count,
          approved: true,
          hidden: false,
        },
      });
    }
  }
}

async function ensureAccount(d: DemoDef, passwordHash: string) {
  let account = await prisma.datingAccount.findUnique({ where: { email: d.email } });
  if (!account) {
    account = await prisma.datingAccount.create({
      data: { email: d.email, passwordHash, emailVerifiedAt: new Date() },
    });
    await prisma.datingProfile.create({
      data: {
        accountId: account.id,
        displayName: d.name,
        birthYear: d.birthYear,
        city: d.city,
        gender: d.gender,
        lookingFor: JSON.stringify(d.lookingFor),
        bio: d.bio,
        interests: JSON.stringify(d.interests),
        promptsJson: JSON.stringify(d.prompts),
        completed: true,
        active: true,
        onboardingDone: true,
        intention: "relationship",
        mood: d.mood,
        activityIntent: d.activityIntent,
        circleSlug: d.circleSlug,
        revealMode: "vibe_first",
        ageMinPref: 22,
        ageMaxPref: 40,
        profileQualityScore: 95,
        onboardingJson: JSON.stringify({
          weekend: "spontaneous",
          pace: "medium",
          communication: "humor",
          values: ["honesty", "humor"],
        }),
      },
    });
    console.log("Created account:", d.email);
  } else {
    await prisma.datingProfile.updateMany({
      where: { accountId: account.id },
      data: {
        displayName: d.name,
        birthYear: d.birthYear,
        city: d.city,
        gender: d.gender,
        lookingFor: JSON.stringify(d.lookingFor),
        bio: d.bio,
        interests: JSON.stringify(d.interests),
        promptsJson: JSON.stringify(d.prompts),
        completed: true,
        active: true,
        onboardingDone: true,
        intention: "relationship",
        mood: d.mood,
        activityIntent: d.activityIntent,
        circleSlug: d.circleSlug,
        revealMode: "vibe_first",
        ageMinPref: 22,
        ageMaxPref: 40,
        profileQualityScore: 95,
        ghostScore: 100,
      },
    });
    console.log("Updated profile:", d.email);
  }

  if (d.slug === "ania") {
    await prisma.datingAccount.update({
      where: { id: account.id },
      data: { isPremium: true, premiumUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) },
    });
    await prisma.datingProfile.update({
      where: { accountId: account.id },
      data: { searchAllCities: false, ageMinPref: 25, ageMaxPref: 38 },
    });
  }

  const photoCount = await prisma.datingPhoto.count({ where: { accountId: account.id, hidden: false } });
  if (photoCount === 0) {
    const url = await ensureDemoPhoto(d.slug, d.initial, d.color);
    await prisma.datingPhoto.create({
      data: { accountId: account.id, url, order: 0, approved: true, hidden: false },
    });
    await prisma.datingProfile.update({
      where: { accountId: account.id },
      data: { photoUrl: url },
    });
    console.log("Added demo photo:", d.email);
  }

  await ensureDemoRoom(account.id, d);
  return account.id;
}

/** Czyści pass/like i dzisiejsze wyświetlenia — żeby Odkrywaj znów pokazało profile. */
async function resetDiscoveryForViewer(viewerId: string, discoverableIds: string[]) {
  await prisma.datingLike.deleteMany({
    where: {
      fromAccountId: viewerId,
      toAccountId: { in: discoverableIds },
    },
  });
  await prisma.datingDiscoveryImpression.deleteMany({
    where: { viewerAccountId: viewerId },
  });
  console.log("Reset discovery state for viewer →", discoverableIds.length, "targets");
}

async function ensureDemoMatch(aniaId: string, tomekId: string) {
  await prisma.datingLike.upsert({
    where: { fromAccountId_toAccountId: { fromAccountId: aniaId, toAccountId: tomekId } },
    create: { fromAccountId: aniaId, toAccountId: tomekId, liked: true },
    update: { liked: true },
  });
  await prisma.datingLike.upsert({
    where: { fromAccountId_toAccountId: { fromAccountId: tomekId, toAccountId: aniaId } },
    create: { fromAccountId: tomekId, toAccountId: aniaId, liked: true },
    update: { liked: true },
  });

  const [accountAId, accountBId] = normalizePair(aniaId, tomekId);
  let match = await prisma.datingMatch.findFirst({ where: { accountAId, accountBId } });
  if (!match) {
    match = await prisma.datingMatch.create({
      data: {
        accountAId,
        accountBId,
        status: "active",
        compatibilityNote: "Spokojna energia + humor — dobry start na kawę bez pośpiechu.",
      },
    });
    console.log("Created demo match Ania ↔ Tomek");
  }

  const msgCount = await prisma.datingMessage.count({ where: { matchId: match.id } });
  if (msgCount === 0) {
    await prisma.datingMessage.createMany({
      data: [
        {
          matchId: match.id,
          senderAccountId: tomekId,
          body: "Hej Ania! Fajny pokój — też lubisz kino nad Wisłą?",
          createdAt: new Date(Date.now() - 3600000),
        },
        {
          matchId: match.id,
          senderAccountId: aniaId,
          body: "Cześć Tomek! Tak, szczególnie letnie seanse plenerowe 🙂",
          createdAt: new Date(Date.now() - 1800000),
        },
      ],
    });
  }
}

async function main() {
  const hash = await bcrypt.hash("demo12345", 10);
  const ids: Record<string, string> = {};
  for (const d of DEMO) {
    ids[d.slug] = await ensureAccount(d, hash);
  }

  const menForAnia = ["piotr", "michal", "krzysiek"].map((s) => ids[s]).filter(Boolean);
  if (ids.ania && menForAnia.length) {
    await resetDiscoveryForViewer(ids.ania, menForAnia);
  }

  const womenForTomek = ["ola", "kasia"].map((s) => ids[s]).filter(Boolean);
  if (ids.tomek && womenForTomek.length) {
    await resetDiscoveryForViewer(ids.tomek, womenForTomek);
  }

  if (ids.ania && ids.tomek) {
    await ensureDemoMatch(ids.ania, ids.tomek);
  }

  console.log("\n=== Demo Randki ===");
  console.log("Hasło wszystkich kont: demo12345");
  console.log("\nZaloguj jako Ania → Odkrywaj zobaczysz:");
  console.log("  piotr.demo@randka.odart.pl — architekt, aura lasu, Lost in Translation");
  console.log("  michal.demo@randka.odart.pl — jazz, YouTube Satie");
  console.log("  krzysiek.demo@randka.odart.pl — introvert, cytat, mgła");
  console.log("(Tomek jest już dopasowany — czat, nie Odkrywaj)");
  console.log("\nInne konta do testów:");
  console.log("  tomek.demo — match z Anią");
  console.log("  ola.demo, kasia.demo — kobiety (Odkrywaj jako Tomek)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
