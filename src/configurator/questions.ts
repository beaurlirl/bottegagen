import type { BudgetOption, Question, StyleOption } from "./types";

export const BUDGETS: BudgetOption[] = [
  { id: "25-40", label: "$25k–$40k", min: 25000, max: 40000 },
  { id: "40-65", label: "$40k–$65k", min: 40000, max: 65000 },
  { id: "65-100", label: "$65k–$100k", min: 65000, max: 100000 },
  { id: "100-plus", label: "$100k+", min: 100000, max: null },
];

export const STYLES: StyleOption[] = [
  {
    id: "warm-natural",
    name: "Warm & Natural",
    description: "Wood, warm stone, subtle metal",
    packageId: "natural",
  },
  {
    id: "quiet-minimal",
    name: "Quiet & Minimal",
    description: "Light cabinetry, restrained surfaces",
    packageId: "gallery",
  },
  {
    id: "classic-stone",
    name: "Classic Stone",
    description: "Traditional natural materials with modern detailing",
    packageId: "heritage",
  },
  {
    id: "dark-architectural",
    name: "Dark & Architectural",
    description: "Dark wood, deeper stone, minimal hardware",
    packageId: "monolith",
  },
];

export const QUESTIONS: Question[] = [
  {
    id: "investment",
    index: 1,
    type: "budget",
    kicker: "Investment",
    title: "What are you looking to invest in your kitchen?",
  },
  {
    id: "direction",
    index: 2,
    type: "style",
    kicker: "Direction",
    title: "What feels closest to your space?",
  },
  {
    id: "cabinetry",
    index: 3,
    type: "material",
    kicker: "Cabinetry",
    title: "Choose a finish",
    category: "cabinet",
  },
  {
    id: "upper-cabinetry",
    index: 4,
    type: "material",
    kicker: "Upper Cabinetry",
    title: "Choose an upper finish",
    category: "cabinet",
  },
  {
    id: "countertop",
    index: 5,
    type: "material",
    kicker: "Countertop",
    title: "Select a surface",
    category: "countertop",
  },
  {
    id: "backsplash",
    index: 6,
    type: "material",
    kicker: "Backsplash",
    title: "Set the vertical plane",
    category: "backsplash",
  },
  {
    id: "floor",
    index: 7,
    type: "material",
    kicker: "Floor",
    title: "Ground the room",
    category: "floor",
  },
  {
    id: "summary",
    index: 8,
    type: "summary",
    kicker: "Your Kitchen",
    title: "A specification, not a sketch",
  },
];

export const TOTAL_STEPS = QUESTIONS.length;
