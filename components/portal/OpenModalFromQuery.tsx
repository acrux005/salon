"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { usePortalQuiz } from "./PortalQuizContext";

export function OpenModalFromQuery() {
  const searchParams = useSearchParams();
  const { openModalWithProblem } = usePortalQuiz();
  const problem = searchParams.get("problem");

  useEffect(() => {
    if (!problem) return;
    openModalWithProblem(problem);
    const url = new URL(window.location.href);
    url.searchParams.delete("problem");
    window.history.replaceState({}, "", url.pathname + url.search);
  }, [problem, openModalWithProblem]);

  return null;
}
