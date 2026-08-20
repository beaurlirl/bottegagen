import type { KitchenModelDefinition, MaterialCategory } from "./types";

/**
 * Names discovered by parsing bottegakitchen.glb (Blender I/O v5.1.18).
 * Do not invent replacements — if these change, re-inspect the GLB.
 */
export const GLB_MATERIALS = {
  WALL: "MAT_WALL",
  LOWER_CABINET: "MAT_LOWER_CABINET",
  UPPER_CABINET: "MAT_UPPER_CABINET",
  COUNTER_TOP: "MAT_COUNTER_TOP",
  BACKSPLASH: "MAT_BACKSPLASH",
  FLOOR: "MAT_FLOOR",
  CONTAINER: "MAT_CONTAINER",
} as const;

export const KITCHEN_MODELS: Record<string, KitchenModelDefinition> = {
  "u-shape": {
    id: "u-shape",
    name: "U-Shape",
    url: "/models/kitchen.glb",
    cabinetTargets: [GLB_MATERIALS.LOWER_CABINET],
    upperCabinetTargets: [GLB_MATERIALS.UPPER_CABINET],
    countertopTargets: [GLB_MATERIALS.COUNTER_TOP],
    backsplashTargets: [GLB_MATERIALS.BACKSPLASH],
    floorTargets: [GLB_MATERIALS.FLOOR],
    hardwareTargets: [],
    staticTargets: {
      wall: GLB_MATERIALS.WALL,
      container: GLB_MATERIALS.CONTAINER,
    },
  },
};

export const ACTIVE_MODEL_ID = "u-shape";

export function getActiveModel(): KitchenModelDefinition {
  return KITCHEN_MODELS[ACTIVE_MODEL_ID];
}

export type TargetCategory = MaterialCategory | "upperCabinet";

export function targetsForCategory(
  category: TargetCategory,
): readonly string[] {
  const model = getActiveModel();
  if (category === "cabinet") return model.cabinetTargets;
  if (category === "upperCabinet") return model.upperCabinetTargets;
  if (category === "countertop") return model.countertopTargets;
  if (category === "floor") return model.floorTargets;
  return model.backsplashTargets;
}
