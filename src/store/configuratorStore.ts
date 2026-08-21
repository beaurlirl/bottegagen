"use client";

import { create } from "zustand";
import { getMaterial } from "@/configurator/materials";
import { getPackage } from "@/configurator/packages";
import { QUESTIONS, TOTAL_STEPS } from "@/configurator/questions";
import { recommendedPackageId } from "@/configurator/recommendations";
import type { InspectionReport } from "@/configurator/types";

type ConfiguratorState = {
  hasStarted: boolean;
  reviewingIn3d: boolean;
  currentStep: number;
  budget: string | null;
  style: string | null;
  cabinet: string | null;
  upperCabinet: string | null;
  countertop: string | null;
  backsplash: string | null;
  floor: string | null;
  hardware: string | null;
  packageId: string | null;
  inspection: InspectionReport | null;
  centerViewToken: number;
  viewLocked: boolean;
  requestCenterView: () => void;
  clearViewLock: () => void;
  start: () => void;
  setStep: (step: number) => void;
  next: () => void;
  back: () => void;
  setBudget: (id: string) => void;
  setStyle: (id: string) => void;
  setCabinet: (id: string) => void;
  setUpperCabinet: (id: string) => void;
  setCountertop: (id: string) => void;
  setBacksplash: (id: string) => void;
  setFloor: (id: string) => void;
  applyPackage: (id: string) => void;
  setInspection: (report: InspectionReport) => void;
  setReviewingIn3d: (value: boolean) => void;
  revise: () => void;
};

export const useConfiguratorStore = create<ConfiguratorState>((set, get) => ({
  hasStarted: false,
  reviewingIn3d: false,
  currentStep: 0,
  budget: null,
  style: null,
  cabinet: "cabinet-white-oak",
  upperCabinet: "cabinet-white-oak",
  countertop: "stone-limestone",
  backsplash: "tile-warm-clay",
  floor: "floor-warm-oak",
  hardware: null,
  packageId: "natural",
  inspection: null,
  centerViewToken: 0,
  viewLocked: false,

  requestCenterView: () =>
    set((state) => ({
      centerViewToken: state.centerViewToken + 1,
      viewLocked: true,
    })),
  clearViewLock: () => set({ viewLocked: false }),

  start: () => set({ hasStarted: true, currentStep: 0 }),
  setStep: (step) =>
    set({
      currentStep: Math.max(0, Math.min(TOTAL_STEPS - 1, step)),
      reviewingIn3d: false,
    }),
  next: () => {
    const { currentStep } = get();
    const question = QUESTIONS[currentStep];
    if (question && !canAdvance(get())) return;
    set({
      currentStep: Math.min(TOTAL_STEPS - 1, currentStep + 1),
      reviewingIn3d: false,
    });
  },
  back: () =>
    set({
      currentStep: Math.max(0, get().currentStep - 1),
      reviewingIn3d: false,
    }),
  setBudget: (id) => set({ budget: id }),
  setStyle: (id) => {
    const packageId = recommendedPackageId(id, get().budget);
    const kitchen = getPackage(packageId);
    set({
      style: id,
      packageId,
      cabinet: kitchen?.selections.cabinet ?? get().cabinet,
      upperCabinet: kitchen?.selections.upperCabinet ?? get().upperCabinet,
      countertop: kitchen?.selections.countertop ?? get().countertop,
      backsplash: kitchen?.selections.backsplash ?? get().backsplash,
      floor: kitchen?.selections.floor ?? get().floor,
    });
  },
  setCabinet: (id) => set({ cabinet: id, packageId: matchingPackage(get(), { cabinet: id }) }),
  setUpperCabinet: (id) =>
    set({
      upperCabinet: id,
      packageId: matchingPackage(get(), { upperCabinet: id }),
    }),
  setCountertop: (id) =>
    set({
      countertop: id,
      packageId: matchingPackage(get(), { countertop: id }),
    }),
  setBacksplash: (id) =>
    set({
      backsplash: id,
      packageId: matchingPackage(get(), { backsplash: id }),
    }),
  setFloor: (id) =>
    set({ floor: id, packageId: matchingPackage(get(), { floor: id }) }),
  applyPackage: (id) => {
    const kitchen = getPackage(id);
    if (!kitchen) return;
    set({
      packageId: id,
      cabinet: kitchen.selections.cabinet,
      upperCabinet: kitchen.selections.upperCabinet,
      countertop: kitchen.selections.countertop,
      backsplash: kitchen.selections.backsplash,
      floor: kitchen.selections.floor,
    });
  },
  setInspection: (report) => set({ inspection: report }),
  setReviewingIn3d: (value) => set({ reviewingIn3d: value }),
  revise: () => set({ currentStep: 2, reviewingIn3d: false }),
}));

function matchingPackage(
  state: Pick<
    ConfiguratorState,
    "cabinet" | "upperCabinet" | "countertop" | "backsplash" | "floor"
  >,
  patch: Partial<
    Pick<
      ConfiguratorState,
      "cabinet" | "upperCabinet" | "countertop" | "backsplash" | "floor"
    >
  >,
) {
  const next = { ...state, ...patch };
  const match = ["natural", "monolith", "gallery", "heritage"].find((id) => {
    const kitchen = getPackage(id);
    return (
      kitchen?.selections.cabinet === next.cabinet &&
      kitchen?.selections.upperCabinet === next.upperCabinet &&
      kitchen?.selections.countertop === next.countertop &&
      kitchen?.selections.backsplash === next.backsplash &&
      kitchen?.selections.floor === next.floor
    );
  });
  return match ?? null;
}

export function canAdvance(state: ConfiguratorState) {
  const question = QUESTIONS[state.currentStep];
  if (!question) return false;
  if (question.type === "budget") return Boolean(state.budget);
  if (question.type === "style") return Boolean(state.style);
  if (question.type === "material") {
    if (question.id === "cabinetry") return Boolean(state.cabinet);
    if (question.id === "upper-cabinetry") return Boolean(state.upperCabinet);
    if (question.id === "countertop") return Boolean(state.countertop);
    if (question.id === "backsplash") return Boolean(state.backsplash);
    if (question.id === "floor") return Boolean(state.floor);
  }
  return true;
}

export function selectedMaterials(state: ConfiguratorState) {
  return {
    cabinet: getMaterial(state.cabinet),
    upperCabinet: getMaterial(state.upperCabinet),
    countertop: getMaterial(state.countertop),
    backsplash: getMaterial(state.backsplash),
    floor: getMaterial(state.floor),
  };
}
