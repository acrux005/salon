import { redirect } from "next/navigation";
import { getWetRedirectPath } from "@/lib/wetRedirect";

export default async function WetKlienciIndexPage() {
  redirect(await getWetRedirectPath("/panel/klienci/lista"));
}
