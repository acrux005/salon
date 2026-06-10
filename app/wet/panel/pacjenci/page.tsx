import { redirect } from "next/navigation";
import { getWetRedirectPath } from "@/lib/wetRedirect";

export default async function WetPacjenciRedirectPage() {
  redirect(await getWetRedirectPath("/panel/zwierzeta/lista"));
}
