import { redirect } from "next/navigation";
import { RAFAL_KOWALKOWSKI_MUZYKA_PATH } from "@/lib/rafalKowalkowskiMuzyka";

export default function RafalMuzykaAutorskaLegacyRedirect() {
  redirect(RAFAL_KOWALKOWSKI_MUZYKA_PATH);
}
