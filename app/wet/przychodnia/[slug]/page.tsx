import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { getVetClinicBySlugAsync } from "@/lib/vet/clinics";
import { WetClinicProfileClient } from "./WetClinicProfileClient";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const clinic = await getVetClinicBySlugAsync(slug);
  if (!clinic) return { title: "Przychodnia" };
  return {
    title: clinic.name,
    description: clinic.description || `Przychodnia weterynaryjna ${clinic.name} — ${clinic.city}`,
  };
}

export default async function WetClinicProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const clinic = await getVetClinicBySlugAsync(slug);
  if (!clinic || !clinic.isPublished) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <Link href="/wet/przychodnie" className="text-[14px] font-medium text-wet-teal hover:underline">
        ← Wszystkie przychodnie
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-wet-navy">{clinic.name}</h1>
      <p className="mt-1 text-[15px] text-wet-navy-muted">
        {clinic.city}
        {clinic.address ? ` · ${clinic.address}` : ""}
      </p>
      {clinic.description && (
        <p className="mt-6 whitespace-pre-wrap text-[15px] leading-relaxed text-wet-navy-muted">
          {clinic.description}
        </p>
      )}
      <Suspense fallback={<div className="mt-8 h-12 animate-pulse rounded-lg bg-wet-teal-50" />}>
        <WetClinicProfileClient clinic={clinic} />
      </Suspense>
    </main>
  );
}
