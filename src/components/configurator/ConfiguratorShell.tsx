"use client";

import { QUESTIONS } from "@/configurator/questions";
import { useConfiguratorStore } from "@/store/configuratorStore";
import { ConfigurationSummary } from "./ConfigurationSummary";
import { ConfiguratorProgress } from "./ConfiguratorProgress";
import { IntroScreen } from "./IntroScreen";
import { KitchenLoadStatus, KitchenViewer } from "./KitchenViewer";
import { PriceEstimate } from "./PriceEstimate";
import { QuestionStep } from "./QuestionStep";

export default function ConfiguratorShell() {
  const hasStarted = useConfiguratorStore((state) => state.hasStarted);
  const currentStep = useConfiguratorStore((state) => state.currentStep);
  const reviewingIn3d = useConfiguratorStore((state) => state.reviewingIn3d);
  const setReviewingIn3d = useConfiguratorStore((state) => state.setReviewingIn3d);
  const question = QUESTIONS[currentStep];
  const showSummary = hasStarted && question?.type === "summary" && !reviewingIn3d;

  return (
    <div className="relative h-dvh overflow-hidden bg-[#ece7e0]">
      <KitchenViewer showSummary={showSummary} />
      <KitchenLoadStatus />

      {!hasStarted ? <IntroScreen /> : null}

      {hasStarted && !showSummary ? (
        <>
          <div className="pointer-events-none absolute inset-4 border border-black/12 sm:inset-6" />
          <ConfiguratorProgress />
          <QuestionStep />
          {reviewingIn3d ? (
            <button
              type="button"
              onClick={() => setReviewingIn3d(false)}
              className="absolute top-6 right-6 z-30 border border-black/15 bg-[#f7f4ef]/90 px-4 py-2 font-sans text-[10px] tracking-[0.26em] uppercase sm:top-8 sm:right-8"
            >
              Close review
            </button>
          ) : null}
          {reviewingIn3d ? (
            <div className="absolute bottom-6 left-6 z-20 hidden sm:block">
              <PriceEstimate />
            </div>
          ) : null}
        </>
      ) : null}

      {showSummary ? <ConfigurationSummary /> : null}
    </div>
  );
}
