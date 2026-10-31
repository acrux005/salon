"use client";

import { Suspense } from "react";
import { PortalQuizProvider } from "./PortalQuizContext";
import { HeaderPortal } from "./HeaderPortal";
import { HeroPortal } from "./HeroPortal";
import { CategoriesBar } from "./CategoriesBar";
import { OwnerOfferSection } from "./OwnerOfferSection";
import { FeaturedClinics } from "./FeaturedClinics";
import { SkinAnalysisTeaser } from "./SkinAnalysisTeaser";
import { BlogSection } from "./BlogSection";
import { FooterPortal } from "./FooterPortal";
import { StickyCTA } from "./StickyCTA";
import { QuizModal } from "./QuizModal";
import { OpenModalFromQuery } from "./OpenModalFromQuery";
import type { ClinicRecord } from "@/lib/skinmatch/schema";

function PortalContent({
  featuredClinics,
  claimedIds,
}: {
  featuredClinics?: ClinicRecord[];
  claimedIds?: string[];
}) {
  return (
    <>
      <Suspense fallback={null}>
        <OpenModalFromQuery />
      </Suspense>
      <HeaderPortal />
      <main>
        <HeroPortal />
        <CategoriesBar />
        <OwnerOfferSection />
        <FeaturedClinics
          clinics={featuredClinics && featuredClinics.length > 0 ? featuredClinics : undefined}
          claimedIds={claimedIds}
        />
        <SkinAnalysisTeaser />
        <BlogSection />
        <FooterPortal />
      </main>
      <StickyCTA />
      <QuizModal />
      <div className="h-20 lg:hidden" aria-hidden />
    </>
  );
}

export function PortalPageClient({
  featuredClinics,
  claimedIds,
}: {
  featuredClinics?: ClinicRecord[];
  claimedIds?: string[];
}) {
  return (
    <PortalQuizProvider>
      <PortalContent featuredClinics={featuredClinics} claimedIds={claimedIds} />
    </PortalQuizProvider>
  );
}
