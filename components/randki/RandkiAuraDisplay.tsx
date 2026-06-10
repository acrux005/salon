"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { RandkiAuraDisplayCss } from "@/components/randki/RandkiAuraDisplayCss";
import {
  shouldDisableAuraMotion,
  shouldUseAuraWebGL,
  shouldUseAuraWebGLMobileStatic,
} from "@/lib/randki/clientDevice";
import type { AuraPlaneImages } from "@/lib/randki/auraSilhouettes";

const RandkiAuraDisplayGL = dynamic(
  () => import("@/components/randki/RandkiAuraDisplayGL"),
  { ssr: false, loading: () => null }
);

type Props = {
  imageUrls?: AuraPlaneImages;
  imageUrl?: string;
  caption?: string | null;
  gender?: string | null;
  resolveUrl: (url: string | null) => string;
  compact?: boolean;
  hero?: boolean;
  showHint?: boolean;
  legacyFill?: boolean;
};

export function RandkiAuraDisplay(props: Props) {
  const isHero = !!props.hero && !props.compact;
  const [useGL, setUseGL] = useState(false);
  const [useGLStatic, setUseGLStatic] = useState(false);
  const [noMotion, setNoMotion] = useState(true);

  useEffect(() => {
    setNoMotion(shouldDisableAuraMotion());
    if (!isHero) {
      setUseGL(false);
      setUseGLStatic(false);
      return;
    }
    if (shouldUseAuraWebGL()) {
      setUseGL(true);
      setUseGLStatic(false);
      return;
    }
    if (shouldUseAuraWebGLMobileStatic()) {
      setUseGL(false);
      setUseGLStatic(true);
      return;
    }
    setUseGL(false);
    setUseGLStatic(false);
  }, [isHero]);

  if (useGL) return <RandkiAuraDisplayGL {...props} />;
  if (useGLStatic)
    return (
      <RandkiAuraDisplayGL
        {...props}
        freezeAnimation
        rootsAsPhoto
        particleBudget={900}
      />
    );
  return <RandkiAuraDisplayCss {...props} staticMode={noMotion} />;
}
