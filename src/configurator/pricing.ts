import { getMaterial } from "./materials";
import { BUDGETS } from "./questions";

// PLACEHOLDER PRICING — replace with verified BOTTEGA pricing
export const BASE_KITCHEN_PRICE = 42_000;

export type ConfigurationSnapshot = {
  budget: string | null;
  cabinet: string | null;
  upperCabinet: string | null;
  countertop: string | null;
  backsplash: string | null;
  floor: string | null;
  hardware: string | null;
};

export type PriceBreakdown = {
  base: number;
  cabinet: number;
  upperCabinet: number;
  countertop: number;
  backsplash: number;
  floor: number;
  hardware: number;
  total: number;
};

export function estimateConfiguration(
  snapshot: ConfigurationSnapshot,
): PriceBreakdown {
  const cabinet = getMaterial(snapshot.cabinet)?.priceAdjustment ?? 0;
  const upperCabinet = getMaterial(snapshot.upperCabinet)?.priceAdjustment ?? 0;
  const countertop = getMaterial(snapshot.countertop)?.priceAdjustment ?? 0;
  const backsplash = getMaterial(snapshot.backsplash)?.priceAdjustment ?? 0;
  const floor = getMaterial(snapshot.floor)?.priceAdjustment ?? 0;
  const hardware = getMaterial(snapshot.hardware)?.priceAdjustment ?? 0;

  return {
    base: BASE_KITCHEN_PRICE,
    cabinet,
    upperCabinet,
    countertop,
    backsplash,
    floor,
    hardware,
    total:
      BASE_KITCHEN_PRICE +
      cabinet +
      upperCabinet +
      countertop +
      backsplash +
      floor +
      hardware,
  };
}

export function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export type BudgetStatus = {
  label: string;
  delta: number | null;
};

export function budgetStatus(
  total: number,
  budgetId: string | null,
): BudgetStatus {
  const budget = BUDGETS.find((entry) => entry.id === budgetId);
  if (!budget) {
    return { label: "ESTIMATE", delta: null };
  }

  if (budget.max === null) {
    if (total >= budget.min) {
      return { label: "WITHIN YOUR TARGET", delta: 0 };
    }
    return { label: "WITHIN YOUR TARGET", delta: 0 };
  }

  if (total <= budget.max) {
    return { label: "WITHIN YOUR TARGET", delta: 0 };
  }

  const delta = total - budget.max;
  if (delta > 12_000) {
    return { label: "PREMIUM SELECTION", delta };
  }

  return {
    label: `+${formatUsd(delta)} ABOVE YOUR TARGET`,
    delta,
  };
}
