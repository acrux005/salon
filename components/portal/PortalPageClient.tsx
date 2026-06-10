"use client";

import { Suspense } from "react";
import { PortalQuizProvider } from "./PortalQuizContext";
import { HeaderPortal } from "./HeaderPortal";
import { HeroPortal } from "./HeroPortal";
import { CategoriesBar } from "./CategoriesBar";
import { HowItWorks } from "./HowItWorks";
import { YourTherapy } from "./YourTherapy";
import { FeaturedClinics } from "./FeaturedClinics";
import { CaseStudies } from "./CaseStudies";
import { BlogSection } from "./BlogSection";
import { ForClinics } from "./ForClinics";
import { FooterPortal } from "./FooterPortal";
import { StickyCTA } from "./StickyCTA";
import { QuizModal } from "./QuizModal";
import { OpenModalFromQuery } from "./OpenModalFromQuery";
import type { ClinicRecord } from "@/lib/skinmatch/schema";

function PortalContent({ featuredClinics }: { featuredClinics?: ClinicRecord[] }) {
  return (
    <>
      <Suspense fallback={null}>
        <OpenModalFromQuery />
      </Suspense>
      <HeaderPortal />
      <main>
        <HeroPortal />
        <CategoriesBar />
        <HowItWorks />
        <YourTherapy />
        <FeaturedClinics clinics={featuredClinics && featuredClinics.length > 0 ? featuredClinics : undefined} />
        <CaseStudies />
        <BlogSection />
        <ForClinics />
        <FooterPortal />
      </main>
      <StickyCTA />
      <QuizModal />
      <div className="h-20 lg:hidden" aria-hidden />
    </>
  );
}

export function PortalPageClient({ featuredClinics }: { featuredClinics?: ClinicRecord[] }) {
  return (
    <PortalQuizProvider>
      <PortalContent featuredClinics={featuredClinics} />
    </PortalQuizProvider>
  );
}
