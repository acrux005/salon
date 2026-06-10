import { calcAge } from "@/lib/randki/constants";
import type { VibeMaterialRow } from "@/lib/randki/vibeMaterialTypes";

export type RandkiRoomData = {
  displayName: string;
  age?: number;
  city?: string;
  whyReason?: string;
  mood?: string | null;
  voiceIntroUrl?: string | null;
  vibeMaterials: VibeMaterialRow[];
  interests: string[];
  prompts: { question: string; answer: string }[];
  photoUrls: string[];
  bio?: string;
  dailyMomentUrl?: string | null;
  dailyMomentSecondaryUrl?: string | null;
  dailyMomentAudioUrl?: string | null;
  dailyMomentType?: "photo" | "audio" | "voice" | null;
  dailyMomentAt?: Date | string | null;
  circleLabel?: string | null;
  gender?: string | null;
  auraImageUrl?: string | null;
  auraImageUrl2?: string | null;
  auraImageUrl3?: string | null;
  auraCaption?: string | null;
  auraPrompt?: string | null;
  isPresent?: boolean;
};

export type LiveRoomPreviewInput = {
  displayName: string;
  birthYear: number;
  city: string;
  bio: string;
  mood: string | null;
  voiceIntroUrl: string | null;
  vibeMaterials: VibeMaterialRow[];
  interests: string[];
  prompts: { question: string; answer: string }[];
  photos: { url: string }[];
  dailyMomentUrl?: string | null;
  dailyMomentSecondaryUrl?: string | null;
  gender?: string | null;
  auraImageUrl?: string | null;
  auraImageUrl2?: string | null;
  auraImageUrl3?: string | null;
  auraCaption?: string | null;
  auraPrompt?: string | null;
};

export function buildLiveRoomPreview(input: LiveRoomPreviewInput): RandkiRoomData {
  return {
    displayName: input.displayName.trim() || "Ty",
    age: calcAge(input.birthYear),
    city: input.city,
    mood: input.mood,
    voiceIntroUrl: input.voiceIntroUrl,
    vibeMaterials: input.vibeMaterials,
    interests: input.interests,
    prompts: input.prompts.filter((p) => p.question.trim() && p.answer.trim()),
    photoUrls: input.photos.map((p) => p.url),
    bio: input.bio,
    dailyMomentUrl: input.dailyMomentUrl ?? null,
    dailyMomentSecondaryUrl: input.dailyMomentSecondaryUrl ?? null,
    gender: input.gender,
    auraImageUrl: input.auraImageUrl ?? null,
    auraImageUrl2: input.auraImageUrl2 ?? null,
    auraImageUrl3: input.auraImageUrl3 ?? null,
    auraCaption: input.auraCaption ?? null,
    auraPrompt: input.auraPrompt ?? null,
  };
}

/** Statyczny pokój na landing — bez prawdziwych danych użytkownika. */
export const DEMO_LANDING_ROOM: RandkiRoomData = {
  displayName: "Ania",
  mood: "calm",
  whyReason: "Ania — spokojna energia na wieczór",
  voiceIntroUrl: null,
  vibeMaterials: [
    {
      id: "demo-music",
      url: "https://open.spotify.com/track/4cOdK2wglTKBFrVl7gY4P7",
      title: "Apocalypse",
      platform: "spotify",
      embedUrl: "https://open.spotify.com/embed/track/4cOdK2wglTKBFrVl7gY4P7?utm_source=randka",
      thumbnailUrl: null,
      caption: "bas w aucie nocą, deszcz na szybie",
      slotType: "music",
      sortOrder: 0,
    },
  ],
  interests: ["kawiarnie", "nocne spacery", "jazz"],
  prompts: [
    {
      question: "Idealny wtorek wieczorem?",
      answer: "Kawa bez pośpiechu i rozmowa, która nie kończy się na „a Ty?”",
    },
  ],
  photoUrls: ["https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=480&q=80"],
  bio: "",
  gender: "woman",
  auraImageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
  auraCaption: "góry we mnie, spokój po burzy",
};
