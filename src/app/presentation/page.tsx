"use client";

import { PresentationDashboard } from "@/components/presentation/dashboard/PresentationDashboard";
import { usePresentationState } from "@/states/presentation-state";
import { useEffect } from "react";

export default function PresentationPage() {
  const resetGeneration = usePresentationState((s) => s.resetGeneration);

  // Reset generation state when this page is visited
  useEffect(() => {
    resetGeneration();
  }, [resetGeneration]);

  return <PresentationDashboard />;
}