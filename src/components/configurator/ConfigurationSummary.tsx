"use client";

import { getMaterial } from "@/configurator/materials";
import { getPackage } from "@/configurator/packages";
import {
  estimateConfiguration,
  formatUsd,
} from "@/configurator/pricing";
import { useConfiguratorStore } from "@/store/configuratorStore";

export function ConfigurationSummary() {
  const budget = useConfiguratorStore((state) => state.budget);
  const cabinet = useConfiguratorStore((state) => state.cabinet);
  const upperCabinet = useConfiguratorStore((state) => state.upperCabinet);
  const countertop = useConfiguratorStore((state) => state.countertop);
  const backsplash = useConfiguratorStore((state) => state.backsplash);
  const floor = useConfiguratorStore((state) => state.floor);
  const packageId = useConfiguratorStore((state) => state.packageId);
  const setReviewingIn3d = useConfiguratorStore((state) => state.setReviewingIn3d);
  const revise = useConfiguratorStore((state) => state.revise);

  const estimate = estimateConfiguration({
    budget,
    cabinet,
    upperCabinet,
    countertop,
    backsplash,
    floor,
    hardware: null,
  });

  const lines = [
    { label: "Lower Cabinetry", value: getMaterial(cabinet)?.name },
    { label: "Upper Cabinetry", value: getMaterial(upperCabinet)?.name },
    { label: "Countertop", value: getMaterial(countertop)?.name },
    { label: "Backsplash", value: getMaterial(backsplash)?.name },
    { label: "Floor", value: getMaterial(floor)?.name },
  ].filter((line) => Boolean(line.value));
  const kitchen = getPackage(packageId);

  const mail = new URL("mailto:info@bottega.nyc");
  mail.searchParams.set("subject", "Kitchen consultation");
  mail.searchParams.set(
    "body",
    [
      "I would like to request a consultation.",
      "",
      kitchen ? `Direction: BOTTEGA / ${kitchen.name}` : "",
      ...lines.map((line) => `${line.label}: ${line.value}`),
      `Estimated investment: ${formatUsd(estimate.total)}`,
      "",
      "Placeholder estimate — not verified BOTTEGA pricing.",
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return (
    <div className="absolute inset-0 z-20 flex text-white">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#CF162D] via-[#CF162D]/80 to-[#CF162D]/10" />
      <div className="pointer-events-none absolute inset-5 border border-white/55 sm:inset-8" />
      <div className="relative flex flex-1 flex-col justify-between px-8 py-10 sm:px-14 sm:py-14">
        <div className="flex items-start justify-between gap-6">
          <p className="font-sans text-[13px] tracking-[0.5em] uppercase">
            B o t t e g a
          </p>
          {kitchen ? (
            <p className="font-sans text-[10px] tracking-[0.28em] text-white/75 uppercase">
              {kitchen.name}
            </p>
          ) : null}
        </div>

        <div>
          <p className="font-sans text-[11px] tracking-[0.34em] text-white/70 uppercase">
            Your kitchen
          </p>
          <ul className="mt-6 space-y-2.5">
            {lines.map((line) => (
              <li key={line.label}>
                <p className="font-sans text-[10px] tracking-[0.26em] text-white/55 uppercase">
                  {line.label}
                </p>
                <p className="font-sans text-xl tracking-[0.06em] uppercase sm:text-2xl">
                  {line.value}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-10 font-sans text-[11px] tracking-[0.28em] text-white/70 uppercase">
            Estimated investment
          </p>
          <p className="mt-2 font-sans text-4xl tracking-[0.04em] sm:text-5xl">
            {formatUsd(estimate.total)}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => setReviewingIn3d(true)}
            className="border border-white px-6 py-3 font-sans text-[11px] tracking-[0.28em] uppercase hover:bg-white hover:text-[#CF162D]"
          >
            Review in 3D
          </button>
          <button
            type="button"
            onClick={revise}
            className="px-6 py-3 font-sans text-[11px] tracking-[0.28em] text-white/80 uppercase hover:text-white"
          >
            Revise selections
          </button>
          <a
            href={mail.toString()}
            className="px-6 py-3 font-sans text-[11px] tracking-[0.28em] text-white uppercase"
          >
            Request consultation
          </a>
        </div>
      </div>
    </div>
  );
}
