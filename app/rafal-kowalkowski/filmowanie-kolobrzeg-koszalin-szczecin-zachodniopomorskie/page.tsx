import { redirect } from "next/navigation";
import { RAFAL_KOWALKOWSKI_TELEDYSKI_PATH } from "@/lib/rafalKowalkowskiGallery";

export default function RafalFilmowanieRedirect() {
  redirect(RAFAL_KOWALKOWSKI_TELEDYSKI_PATH);
}
