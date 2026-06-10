const WP_UPLOADS = "https://rafalkowalkowski.pl/wp-content/uploads/2023/01";

export const RAFAL_ALBUM_FOTOGRAFIA_COVER =
  "https://rafalkowalkowski.pl/wp-content/uploads/2023/01/ab67616d0000b2733659830f228f6e915529bf76-300x300.jpeg";

export type RafalAlbumTrack = {
  id: string;
  title: string;
  mp3?: string;
  duration?: string;
};

/** Kolejność jak na płycie; MP3 z rafalkowalkowski.pl (player Elementor). */
export const RAFAL_ALBUM_FOTOGRAFIA: RafalAlbumTrack[] = [
  { id: "zla-milosc", title: "Zła miłość", mp3: `${WP_UPLOADS}/1.-Zla-milosc.mp3` },
  { id: "przyjdz-balkonem", title: "Przyjdź balkonem", mp3: `${WP_UPLOADS}/2.-Przyjdz-balkonem.mp3` },
  {
    id: "piosenka-dzwiek",
    title: "Piosenka z takim dźwiękiem",
    mp3: `${WP_UPLOADS}/3.-Piosenka-z-takim-dzwiekiem.mp3`,
    duration: "10:34",
  },
  { id: "pan-kot", title: "Pan Kot", mp3: `${WP_UPLOADS}/4.-Pan-kot.mp3`, duration: "9:06" },
  { id: "krajobraz", title: "Krajobraz", mp3: `${WP_UPLOADS}/6.-Krajobraz.mp3` },
  { id: "od-h", title: "Od H", mp3: `${WP_UPLOADS}/7.-Od-H.mp3`, duration: "9:24" },
  { id: "fotografia", title: "Fotografia", mp3: `${WP_UPLOADS}/8.-Fotografia-1.mp3`, duration: "8:59" },
  {
    id: "gora-w-niebie",
    title: "Góra w niebie",
    mp3: `${WP_UPLOADS}/9.-Gora-w-niebie-1.mp3`,
    duration: "8:54",
  },
];

export const RAFAL_ALBUM_PLAYABLE = RAFAL_ALBUM_FOTOGRAFIA.filter((t): t is RafalAlbumTrack & { mp3: string } =>
  Boolean(t.mp3),
);
