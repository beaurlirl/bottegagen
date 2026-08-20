"use client";

import { useConfiguratorStore } from "@/store/configuratorStore";

export function IntroScreen() {
  const start = useConfiguratorStore((state) => state.start);

  return (
    <div className="absolute inset-0 z-30 flex bg-[#CF162D] text-white">
      <div className="pointer-events-none absolute inset-5 border border-white/55 sm:inset-8" />
      <div className="relative flex flex-1 flex-col justify-between px-8 py-10 sm:px-14 sm:py-14">
        <p className="font-sans text-[13px] tracking-[0.5em] uppercase">
          B o t t e g a
        </p>
        <div>
          <h1 className="max-w-xl font-sans text-4xl leading-[0.95] font-medium tracking-[0.08em] uppercase sm:text-6xl">
            Design
            <br />
            your kitchen
          </h1>
          <p className="mt-6 max-w-sm font-sans text-sm leading-6 tracking-[0.04em] text-white/80">
            A short consultation. The kitchen stays in front of you.
          </p>
        </div>
        <button
          type="button"
          onClick={start}
          className="w-fit border border-white px-7 py-3 font-sans text-[11px] tracking-[0.32em] uppercase transition-colors hover:bg-white hover:text-[#CF162D]"
        >
          Begin
        </button>
      </div>
    </div>
  );
}
