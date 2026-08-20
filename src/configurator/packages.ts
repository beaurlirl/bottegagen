import type { KitchenPackage } from "./types";

export const PACKAGES: KitchenPackage[] = [
  {
    id: "natural",
    name: "Natural",
    character: "Warm, architectural, residential",
    selections: {
      cabinet: "cabinet-white-oak",
      upperCabinet: "cabinet-white-oak",
      countertop: "stone-limestone",
      backsplash: "tile-warm-clay",
      floor: "floor-warm-oak",
    },
  },
  {
    id: "monolith",
    name: "Monolith",
    character: "Strong, contemporary, architectural",
    selections: {
      cabinet: "cabinet-charcoal",
      upperCabinet: "cabinet-charcoal",
      countertop: "stone-nero",
      backsplash: "tile-ink",
      floor: "floor-nero",
    },
  },
  {
    id: "gallery",
    name: "Gallery",
    character: "Bright, art-focused, refined",
    selections: {
      cabinet: "cabinet-painted-white",
      upperCabinet: "cabinet-painted-white",
      countertop: "stone-calacatta",
      backsplash: "tile-handmade-white",
      floor: "floor-limestone",
    },
  },
  {
    id: "heritage",
    name: "Heritage",
    character: "Traditional material richness with contemporary detailing",
    selections: {
      cabinet: "cabinet-walnut",
      upperCabinet: "cabinet-walnut",
      countertop: "stone-travertine",
      backsplash: "tile-handmade-white",
      floor: "floor-walnut",
    },
  },
];

export function getPackage(id: string | null) {
  if (!id) return undefined;
  return PACKAGES.find((entry) => entry.id === id);
}
