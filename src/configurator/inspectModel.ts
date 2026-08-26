import * as THREE from "three";
import type { Object3D } from "three";
import type { InspectionReport, MeshMaterialReport } from "./types";

function isMesh(object: Object3D): object is THREE.Mesh {
  return (object as THREE.Mesh).isMesh === true;
}

function materialNames(material: THREE.Material | THREE.Material[]) {
  if (Array.isArray(material)) {
    return material.map((entry) => entry.name || "(unnamed)");
  }
  return [material?.name || "(unnamed)"];
}

export function inspectKitchenScene(root: Object3D): InspectionReport {
  const assignments: MeshMaterialReport[] = [];
  const materialCounts = new Map<string, number>();
  const unnamed: string[] = [];
  const multiMaterialMeshes: string[] = [];

  root.traverse((object) => {
    if (!isMesh(object)) return;

    const materials = materialNames(object.material);
    const node = object.name || "(unnamed node)";
    const mesh = object.geometry?.name || object.name || "(unnamed mesh)";

    assignments.push({ node, mesh, materials });

    if (!object.name) unnamed.push(mesh);
    if (materials.includes("(unnamed)")) unnamed.push(node);
    if (Array.isArray(object.material) && object.material.length > 1) {
      multiMaterialMeshes.push(node);
    }

    for (const name of materials) {
      materialCounts.set(name, (materialCounts.get(name) ?? 0) + 1);
    }
  });

  const materialNamesUnique = [...materialCounts.keys()].sort();
  const duplicatedMaterialNames = materialNamesUnique.filter((name) => {
    return (materialCounts.get(name) ?? 0) > 1;
  });

  const report: InspectionReport = {
    meshCount: assignments.length,
    materialNames: materialNamesUnique,
    assignments,
    unnamed,
    duplicatedMaterialNames,
    multiMaterialMeshes,
    missingHardware: true,
  };

  if (process.env.NODE_ENV !== "production") {
    console.groupCollapsed("BOTTEGA kitchen.glb inspection");
    console.table(
      assignments.map((row) => ({
        node: row.node,
        mesh: row.mesh,
        material: row.materials.join(", "),
      })),
    );
    console.log("materials", report.materialNames);
    console.log("shared material names (expected)", report.duplicatedMaterialNames);
    console.log("unnamed", report.unnamed);
    console.log("multi-material meshes", report.multiMaterialMeshes);
    console.groupEnd();
  }

  return report;
}
