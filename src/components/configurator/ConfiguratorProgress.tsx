"use client";

import { QUESTIONS, TOTAL_STEPS } from "@/configurator/questions";
import { useConfiguratorStore } from "@/store/configuratorStore";

export function ConfiguratorProgress() {
  const currentStep = useConfiguratorStore((state) => state.currentStep);
  const setStep = useConfiguratorStore((state) => state.setStep);
  const current = QUESTIONS[currentStep];

  return (
    <>
      <div className="pointer-events-none absolute top-0 right-0 left-0 z-20 flex items-start justify-between px-5 pt-5 sm:px-8 sm:pt-7">
        <div>
          <p className="font-sans text-[13px] font-medium tracking-[0.42em] text-[#CF162D] uppercase">
            Bottega
          </p>
          <p className="mt-1 hidden font-sans text-[10px] tracking-[0.28em] text-black/45 uppercase sm:block">
            Kitchen configurator
          </p>
        </div>
        <p className="font-sans text-[11px] tracking-[0.32em] text-black/55 uppercase">
          {String(current.index).padStart(2, "0")} / {String(TOTAL_STEPS).padStart(2, "0")}
        </p>
      </div>

      <nav
        aria-label="Progress"
        className="absolute top-1/2 left-4 z-20 hidden -translate-y-1/2 flex-col gap-3 md:flex"
      >
        {QUESTIONS.map((question, index) => {
          const active = index === currentStep;
          const done = index < currentStep;
          return (
            <button
              key={question.id}
              type="button"
              onClick={() => setStep(index)}
              className="group flex h-3 w-3 items-center justify-center"
              aria-label={question.kicker}
              aria-current={active ? "step" : undefined}
            >
              <span
                className={[
                  "block rounded-full border transition-colors",
                  active
                    ? "h-[9px] w-[9px] border-[#CF162D] bg-[#CF162D]"
                    : done
                      ? "h-2 w-2 border-[#CF162D] bg-transparent"
                      : "h-2 w-2 border-black/30 bg-transparent",
                ].join(" ")}
              />
            </button>
          );
        })}
      </nav>
    </>
  );
}
