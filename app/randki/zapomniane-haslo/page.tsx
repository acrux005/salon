import { headers } from "next/headers";
import { isRandkiPortalHost } from "@/lib/randkiHost";
import RandkiForgotForm from "./RandkiForgotForm";

export default async function RandkiForgotPasswordPage() {
  const host = (await headers()).get("host") ?? "";
  return <RandkiForgotForm isRandkiPortal={isRandkiPortalHost(host)} />;
}
