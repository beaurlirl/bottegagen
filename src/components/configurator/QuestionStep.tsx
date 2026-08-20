"use client";

import { BUDGETS, QUESTIONS, STYLES } from "@/configurator/questions";
import { canAdvance, useConfiguratorStore } from "@/store/configuratorStore";
import { MaterialGrid } from "./MaterialGrid";
import { PriceEstimate } from "./PriceEstimate";

export function QuestionStep() {
  const currentStep = useConfiguratorStore((state) => state.currentStep);
  const budget = useConfiguratorStore((state) => state.budget);
  const style = useConfiguratorStore((state) => state.style);
  const cabinet = useConfiguratorStore((state) => state.cabinet);
  const upperCabinet = useConfiguratorStore((state) => state.upperCabinet);
  const countertop = useConfiguratorStore((state) => state.countertop);
  const backsplash = useConfiguratorStore((state) => state.backsplash);
  const floor = useConfiguratorStore((state) => state.floor);
  const setBudget = useConfiguratorStore((state) => state.setBudget);
  const setStyle = useConfiguratorStore((state) => state.setStyle);
  const setCabinet = useConfiguratorStore((state) => state.setCabinet);
  const setUpperCabinet = useConfiguratorStore((state) => state.setUpperCabinet);
  const setCountertop = useConfiguratorStore((state) => state.setCountertop);
  const setBacksplash = useConfiguratorStore((state) => state.setBacksplash);
  const setFloor = useConfiguratorStore((state) => state.setFloor);
  const next = useConfiguratorStore((state) => state.next);
  const back = useConfiguratorStore((state) => state.back);
  const state = useConfiguratorStore();

  const question = QUESTIONS[currentStep];
  if (!question || question.type === "summary") return null;

  return (
    <aside className="pointer-events-none absolute inset-x-0 bottom-0 z-20 md:inset-x-auto md:right-8 md:bottom-8 md:w-[min(28rem,42vw)]">
      <div className="pointer-events-auto border border-black/12 bg-[#f7f4ef]/92 px-5 py-5 backdrop-blur-[2px] md:px-6">
        <p className="font-sans text-[10px] tracking-[0.34em] text-[#CF162D] uppercase">
          {String(question.index).padStart(2, "0")} · {question.kicker}
        </p>
        <h2 className="mt-2 max-w-sm font-sans text-xl leading-tight tracking-[0.04em] text-black uppercase sm:text-2xl">
          {question.title}
        </h2>

        <div className="mt-5">
          {question.type === "budget" ? (
            <div className="flex flex-col">
              {BUDGETS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setBudget(option.id)}
                  className={[
                    "flex items-center justify-between border-t border-black/10 py-3 text-left font-sans text-sm tracking-[0.08em] uppercase",
                    budget === option.id ? "text-[#CF162D]" : "text-black/75",
                  ].join(" ")}
                >
                  <span>{option.label}</span>
                  {budget === option.id ? (
                    <span className="h-1.5 w-1.5 bg-[#CF162D]" />
                  ) : null}
                </button>
              ))}
            </div>
          ) : null}

          {question.type === "style" ? (
            <div className="flex flex-col">
              {STYLES.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setStyle(option.id)}
                  className={[
                    "border-t border-black/10 py-3 text-left",
                    style === option.id ? "text-[#CF162D]" : "text-black/80",
                  ].join(" ")}
                >
                  <span className="block font-sans text-sm tracking-[0.12em] uppercase">
                    {option.name}
                  </span>
                  <span className="mt-1 block font-sans text-[11px] tracking-[0.04em] text-black/45 normal-case">
                    {option.description}
                  </span>
                </button>
              ))}
            </div>
          ) : null}

          {question.type === "material" && question.id === "cabinetry" ? (
            <MaterialGrid
              category="cabinet"
              value={cabinet}
              onSelect={setCabinet}
            />
          ) : null}
          {question.type === "material" && question.id === "upper-cabinetry" ? (
            <MaterialGrid
              category="cabinet"
              value={upperCabinet}
              onSelect={setUpperCabinet}
            />
          ) : null}
          {question.type === "material" && question.category === "countertop" ? (
            <MaterialGrid
              category="countertop"
              value={countertop}
              onSelect={setCountertop}
            />
          ) : null}
          {question.type === "material" && question.category === "backsplash" ? (
            <MaterialGrid
              category="backsplash"
              value={backsplash}
              onSelect={setBacksplash}
            />
          ) : null}
          {question.type === "material" && question.category === "floor" ? (
            <MaterialGrid
              category="floor"
              value={floor}
              onSelect={setFloor}
            />
          ) : null}
        </div>

        <div className="mt-6 flex items-end justify-between gap-4">
          <PriceEstimate />
          <div className="flex items-center gap-4">
            {currentStep > 0 ? (
              <button
                type="button"
                onClick={back}
                className="font-sans text-[11px] tracking-[0.26em] text-black/45 uppercase hover:text-black"
              >
                Back
              </button>
            ) : null}
            <button
              type="button"
              onClick={next}
              disabled={!canAdvance(state)}
              className="border border-[#CF162D] bg-[#CF162D] px-5 py-2.5 font-sans text-[11px] tracking-[0.28em] text-white uppercase disabled:border-black/15 disabled:bg-transparent disabled:text-black/25"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
