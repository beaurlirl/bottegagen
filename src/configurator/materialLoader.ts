import * as THREE from "three";
import type { MaterialDefinition } from "./types";

const loader = new THREE.TextureLoader();
const cache = new Map<string, THREE.Texture>();

function colorSpaceForMap(kind: "color" | "data") {
  return kind === "color"
    ? THREE.SRGBColorSpace
    : THREE.LinearSRGBColorSpace;
}

export function loadTexture(
  url: string,
  kind: "color" | "data",
  repeat: [number, number],
  anisotropy: number,
) {
  const key = `${url}:${kind}:${repeat.join("x")}:${anisotropy}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const texture = loader.load(url);
  texture.colorSpace = colorSpaceForMap(kind);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeat[0], repeat[1]);
  texture.anisotropy = anisotropy;
  texture.flipY = false;
  cache.set(key, texture);
  return texture;
}

export function applyFinish(
  material: THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial,
  finish: Pick<MaterialDefinition, "maps" | "tint" | "repeat" | "properties">,
  anisotropy: number,
) {
  const repeat = finish.repeat ?? [1, 1];
  const maps = finish.maps;

  material.map = maps?.color
    ? loadTexture(maps.color, "color", repeat, anisotropy)
    : null;
  material.normalMap = maps?.normal
    ? loadTexture(maps.normal, "data", repeat, anisotropy)
    : null;
  material.roughnessMap = maps?.roughness
    ? loadTexture(maps.roughness, "data", repeat, anisotropy)
    : null;
  material.aoMap = maps?.ao
    ? loadTexture(maps.ao, "data", repeat, anisotropy)
    : null;

  material.color.set(finish.tint ?? "#ffffff");
  material.roughness = finish.properties.roughness;
  material.metalness = finish.properties.metalness;
  material.envMapIntensity = finish.properties.envMapIntensity ?? 1;
  material.transparent = false;
  material.opacity = 1;
  material.side = THREE.FrontSide;

  const physical = material as THREE.MeshPhysicalMaterial;
  if (physical.isMeshPhysicalMaterial) {
    physical.clearcoat = finish.properties.clearcoat ?? 0;
    physical.clearcoatRoughness = finish.properties.clearcoatRoughness ?? 0.3;
  }

  material.needsUpdate = true;
}

export function collectMaterialsByName(root: THREE.Object3D) {
  const grouped = new Map<string, THREE.MeshStandardMaterial[]>();

  root.traverse((object) => {
    if (!(object as THREE.Mesh).isMesh) return;
    const mesh = object as THREE.Mesh;
    const materials = Array.isArray(mesh.material)
      ? mesh.material
      : [mesh.material];

    for (const material of materials) {
      if (!material || !("isMeshStandardMaterial" in material)) continue;
      const named = material as THREE.MeshStandardMaterial;
      const name = named.name || "(unnamed)";
      const list = grouped.get(name) ?? [];
      if (!list.includes(named)) list.push(named);
      grouped.set(name, list);
    }
  });

  return grouped;
}

export function upgradeToPhysical(root: THREE.Object3D) {
  const upgraded = new Map<THREE.Material, THREE.MeshPhysicalMaterial>();

  root.traverse((object) => {
    if (!(object as THREE.Mesh).isMesh) return;
    const mesh = object as THREE.Mesh;
    const source = mesh.material;
    const list = Array.isArray(source) ? source : [source];

    const next = list.map((material) => {
      const existing = upgraded.get(material);
      if (existing) return existing;
      if ((material as THREE.MeshPhysicalMaterial).isMeshPhysicalMaterial) {
        return material as THREE.MeshPhysicalMaterial;
      }
      const physical = new THREE.MeshPhysicalMaterial();
      THREE.MeshStandardMaterial.prototype.copy.call(physical, material);
      physical.name = material.name;
      upgraded.set(material, physical);
      return physical;
    });

    mesh.material = Array.isArray(source) ? next : next[0];
    mesh.castShadow = true;
    mesh.receiveShadow = true;
  });
}

export function applyNamedFinish(
  grouped: Map<string, THREE.MeshStandardMaterial[]>,
  names: readonly string[],
  finish: Pick<MaterialDefinition, "maps" | "tint" | "repeat" | "properties">,
  anisotropy: number,
) {
  for (const name of names) {
    const materials = grouped.get(name);
    if (!materials) continue;
    for (const material of materials) {
      applyFinish(material, finish, anisotropy);
    }
  }
}
