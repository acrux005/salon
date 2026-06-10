import { redirect } from "next/navigation";
import { getWetRedirectPath } from "@/lib/wetRedirect";

export default async function WetZwierzetaImportRedirectPage() {
  redirect(await getWetRedirectPath("/panel/narzedzia/import"));
}
