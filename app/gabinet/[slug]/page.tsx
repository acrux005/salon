import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getGabClinicBySlugAsync } from "@/lib/gabinet/clinics";
import { GabLink } from "@/components/gabinetPlatform/GabLink";
import { GabClinicProfileClient } from "@/components/gabinet/GabClinicProfileClient";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const clinic = await getGabClinicBySlugAsync(slug);
    if (!clinic) return { title: "Gabinet" };
    return {
      title: clinic.name,
      description: clinic.description || `Gabinet ${clinic.name}`,
    };
  } catch {
    return { title: "Gabinet" };
  }
}

export default async function GabPublicProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const clinic = await getGabClinicBySlugAsync(slug).catch(() => null);
  if (!clinic || !clinic.isPublished) notFound();

  const mapQuery = [clinic.address, clinic.city].filter(Boolean).join(", ");
  const mapUrl = mapQuery ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}` : null;

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <GabLink href="/gabinety" className="text-[14px] font-medium text-gab-sky hover:underline">
        ← Wszystkie gabinety
      </GabLink>
      <div className="mt-4 flex flex-wrap items-start gap-4">
        {clinic.logoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={clinic.logoUrl} alt="" className="h-16 w-auto rounded-lg border border-slate-100 object-contain" />
        )}
        <div>
          <h1 className="text-3xl font-bold text-gab-navy">{clinic.name}</h1>
          <p className="mt-1 text-[15px] text-slate-600">
            {clinic.city}
            {clinic.address ? ` · ${clinic.address}` : ""}
          </p>
          {mapUrl && (
            <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-[14px] text-gab-sky hover:underline">
              Pokaż na mapie
            </a>
          )}
        </div>
      </div>
      {clinic.description && (
        <p className="mt-6 whitespace-pre-wrap text-[15px] leading-relaxed text-slate-600">
          {clinic.description}
        </p>
      )}
      <Suspense fallback={null}>
        <GabClinicProfileClient clinic={clinic} />
      </Suspense>
    </main>
  );
}
