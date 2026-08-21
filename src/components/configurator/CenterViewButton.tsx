"use client";

import { useConfiguratorStore } from "@/store/configuratorStore";

export function CenterViewButton() {
  const requestCenterView = useConfiguratorStore((state) => state.requestCenterView);

  return (
    <button
      type="button"
      onClick={requestCenterView}
      title="Center view — stop and look head-on"
      aria-label="Center view — stop and look head-on"
      className="pointer-events-auto flex h-10 w-10 items-center justify-center border border-black/15 bg-[#f7f4ef]/90 text-black/60 backdrop-blur-[2px] transition-colors hover:border-black/40 hover:text-black"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        aria-hidden="true"
      >
        <circle cx="8" cy="8" r="5.5" />
        <circle cx="8" cy="8" r="1.1" fill="currentColor" stroke="none" />
        <path d="M8 0.5V3M8 13V15.5M0.5 8H3M13 8H15.5" />
      </svg>
    </button>
  );
}
