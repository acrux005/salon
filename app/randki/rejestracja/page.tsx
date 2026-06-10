import { headers } from "next/headers";
import { isRandkiPortalHost } from "@/lib/randkiHost";
import RandkiRegisterClient from "./RandkiRegisterClient";

export default async function RandkiRegisterPage() {
  const host = (await headers()).get("host") ?? "";
  return <RandkiRegisterClient isRandkiPortal={isRandkiPortalHost(host)} />;
}
