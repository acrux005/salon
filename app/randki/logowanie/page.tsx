import { headers } from "next/headers";
import { Suspense } from "react";
import { isRandkiPortalHost } from "@/lib/randkiHost";
import { RandkiLoginForm } from "./RandkiLoginForm";

export default function RandkiLoginPage() {
  const host = headers().get("host") ?? "";
  const isRandkiPortal = isRandkiPortalHost(host);

  return (
    <Suspense>
      <RandkiLoginForm isRandkiPortal={isRandkiPortal} />
    </Suspense>
  );
}
