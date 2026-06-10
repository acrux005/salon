import { redirect } from "next/navigation";
import { getWetRedirectPath } from "@/lib/wetRedirect";

export default async function WetZwierzetaRedirectPage() {
  redirect(await getWetRedirectPath("/panel/zwierzeta/lista"));
}
