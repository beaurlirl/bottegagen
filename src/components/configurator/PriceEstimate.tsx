"use client";

import { getPackage } from "@/configurator/packages";
import {
  budgetStatus,
  estimateConfiguration,
  formatUsd,
} from "@/configurator/pricing";
import { useConfiguratorStore } from "@/store/configuratorStore";

export function PriceEstimate() {
  const budget = useConfiguratorStore((state) => state.budget);
  const cabinet = useConfiguratorStore((state) => state.cabinet);
  const upperCabinet = useConfiguratorStore((state) => state.upperCabinet);
  const countertop = useConfiguratorStore((state) => state.countertop);
  const backsplash = useConfiguratorStore((state) => state.backsplash);
  const floor = useConfiguratorStore((state) => state.floor);
  const hardware = useConfiguratorStore((state) => state.hardware);
  const packageId = useConfiguratorStore((state) => state.packageId);

  const estimate = estimateConfiguration({
    budget,
    cabinet,
    upperCabinet,
    countertop,
    backsplash,
    floor,
    hardware,
  });
  const status = budgetStatus(estimate.total, budget);
  const kitchen = getPackage(packageId);

  return (
    <div className="flex min-w-0 flex-col gap-1">
      <p className="font-sans text-[10px] tracking-[0.26em] text-black/40 uppercase">
        Estimated investment
      </p>
      <p className="font-sans text-xl tracking-[0.04em] text-black sm:text-2xl">
        {formatUsd(estimate.total)}
      </p>
      <p className="font-sans text-[10px] tracking-[0.22em] text-[#CF162D] uppercase">
        {status.label}
        {kitchen ? ` · Bottega / ${kitchen.name}` : ""}
      </p>
    </div>
  );
}
