export type MaterialCategory = "cabinet" | "countertop" | "backsplash" | "floor";

export type QuestionType = "budget" | "style" | "material" | "summary";

export type MaterialMaps = {
  color?: string;
  normal?: string;
  roughness?: string;
  ao?: string;
};

export type MaterialDefinition = {
  id: string;
  name: string;
  category: MaterialCategory;
  description: string;
  thumbnail: string;
  maps?: MaterialMaps;
  tint?: string;
  repeat?: [number, number];
  properties: {
    roughness: number;
    metalness: number;
    envMapIntensity?: number;
    clearcoat?: number;
    clearcoatRoughness?: number;
  };
  /** PLACEHOLDER PRICING — replace with verified BOTTEGA pricing */
  priceAdjustment: number;
};

export type BudgetOption = {
  id: string;
  label: string;
  min: number;
  max: number | null;
};

export type StyleOption = {
  id: string;
  name: string;
  description: string;
  packageId: string;
};

export type KitchenPackage = {
  id: string;
  name: string;
  character: string;
  selections: {
    cabinet: string;
    upperCabinet: string;
    countertop: string;
    backsplash: string;
    floor: string;
  };
};

export type Question = {
  id: string;
  index: number;
  type: QuestionType;
  kicker: string;
  title: string;
  category?: MaterialCategory;
};

export type KitchenModelDefinition = {
  id: string;
  name: string;
  url: string;
  cabinetTargets: readonly string[];
  upperCabinetTargets: readonly string[];
  countertopTargets: readonly string[];
  backsplashTargets: readonly string[];
  floorTargets: readonly string[];
  hardwareTargets: readonly string[];
  staticTargets: {
    wall: string;
    container: string;
  };
};

export type MeshMaterialReport = {
  node: string;
  mesh: string;
  materials: string[];
};

export type InspectionReport = {
  meshCount: number;
  materialNames: string[];
  assignments: MeshMaterialReport[];
  unnamed: string[];
  duplicatedMaterialNames: string[];
  multiMaterialMeshes: string[];
  missingHardware: boolean;
};
