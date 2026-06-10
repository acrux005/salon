import { Suspense } from "react";
import { headers } from "next/headers";
import { isRandkiPortalHost } from "@/lib/randkiHost";
import { RandkiResetPasswordForm } from "./RandkiResetForm";

export default async function RandkiResetPasswordPage() {
  const host = (await headers()).get("host") ?? "";
  return (
    <Suspense>
      <RandkiResetPasswordForm isRandkiPortal={isRandkiPortalHost(host)} />
    </Suspense>
  );
}
