"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { applyHeadOnFraming, applyKitchenFraming } from "@/configurator/framing";
import { inspectKitchenScene } from "@/configurator/inspectModel";
import {
  applyFinish,
  applyNamedFinish,
  collectMaterialsByName,
  upgradeToPhysical,
} from "@/configurator/materialLoader";
import { getMaterial, STATIC_ENVIRONMENT_FINISHES } from "@/configurator/materials";
import { getActiveModel, targetsForCategory } from "@/configurator/targets";
import { useConfiguratorStore } from "@/store/configuratorStore";

useGLTF.preload(getActiveModel().url);

/**
 * All three backsplash runs share one GLB material, but their UVs weren't
 * unwrapped at the same scale: measured directly from kitchen.glb, the
 * center run spans 3 world units at UV U-span 0.75, while each side run
 * spans 2.4 units at U-span 1.0. Applying one shared `repeat` therefore
 * renders visibly bigger tiles on the center run. This is a fixed geometry
 * fact (re-measure if the GLB changes) — the center run needs a repeat
 * multiplied by (3/0.75)/(2.4/1.0) = 5/3 to match the side runs' tile size.
 */
const CENTER_BACKSPLASH_MESH = "Center_Backsplash";
const CENTER_BACKSPLASH_REPEAT_CORRECTION = 5 / 3;

export function KitchenModel() {
  const model = getActiveModel();
  const { scene } = useGLTF(model.url);
  const gl = useThree((state) => state.gl);
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);
  const controls = useThree((state) => state.controls) as OrbitControlsImpl | null;
  const setInspection = useConfiguratorStore((state) => state.setInspection);
  const cabinet = useConfiguratorStore((state) => state.cabinet);
  const upperCabinet = useConfiguratorStore((state) => state.upperCabinet);
  const countertop = useConfiguratorStore((state) => state.countertop);
  const backsplash = useConfiguratorStore((state) => state.backsplash);
  const floor = useConfiguratorStore((state) => state.floor);
  const centerViewToken = useConfiguratorStore((state) => state.centerViewToken);
  const inspected = useRef(false);
  const framed = useRef(false);
  const centeredToken = useRef(centerViewToken);

  const kitchen = useMemo(() => {
    const root = scene.clone(true);
    upgradeToPhysical(root);

    // The outer enclosure shell duplicates the named Wall meshes and, at
    // several camera angles, intrudes between the camera and the open side
    // of the U — showing an opaque panel where the room should read as
    // transparent. The named walls already form the visible room, so drop
    // the shell entirely rather than fight face culling on it.
    root.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (!mesh.isMesh) return;
      const materials = Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material];
      if (materials.some((mat) => mat?.name === model.staticTargets.container)) {
        mesh.visible = false;
      }

      // Give the center backsplash run its own material instance so its
      // texture repeat can be corrected independently of the shared one
      // used by the two side runs (see CENTER_BACKSPLASH_REPEAT_CORRECTION).
      if (mesh.name === CENTER_BACKSPLASH_MESH) {
        mesh.material = Array.isArray(mesh.material)
          ? mesh.material.map((mat) => mat.clone())
          : mesh.material.clone();
      }
    });

    return root;
  }, [scene, model]);

  const grouped = useMemo(() => collectMaterialsByName(kitchen), [kitchen]);
  const anisotropy = Math.min(16, gl.capabilities.getMaxAnisotropy());

  useLayoutEffect(() => {
    if (inspected.current) return;
    inspected.current = true;
    setInspection(inspectKitchenScene(kitchen));
  }, [kitchen, setInspection]);

  useLayoutEffect(() => {
    if (framed.current) return;
    const aspect = size.width / size.height;
    applyKitchenFraming(camera, controls, kitchen, aspect);
    if (controls) framed.current = true;
  }, [camera, controls, kitchen, size.width, size.height]);

  useLayoutEffect(() => {
    if (centerViewToken === centeredToken.current) return;
    centeredToken.current = centerViewToken;
    applyHeadOnFraming(camera, controls, kitchen);
  }, [centerViewToken, camera, controls, kitchen]);

  useLayoutEffect(() => {
    applyNamedFinish(
      grouped,
      [model.staticTargets.wall],
      STATIC_ENVIRONMENT_FINISHES.MAT_WALL,
      anisotropy,
    );
  }, [anisotropy, grouped, model]);

  useLayoutEffect(() => {
    const finish = getMaterial(cabinet);
    if (!finish) return;
    applyNamedFinish(grouped, targetsForCategory("cabinet"), finish, anisotropy);
  }, [anisotropy, cabinet, grouped]);

  useLayoutEffect(() => {
    const finish = getMaterial(upperCabinet);
    if (!finish) return;
    applyNamedFinish(
      grouped,
      targetsForCategory("upperCabinet"),
      finish,
      anisotropy,
    );
  }, [anisotropy, upperCabinet, grouped]);

  useLayoutEffect(() => {
    const finish = getMaterial(floor);
    if (!finish) return;
    applyNamedFinish(grouped, targetsForCategory("floor"), finish, anisotropy);
  }, [anisotropy, floor, grouped]);

  useLayoutEffect(() => {
    const finish = getMaterial(countertop);
    if (!finish) return;
    applyNamedFinish(
      grouped,
      targetsForCategory("countertop"),
      finish,
      anisotropy,
    );
  }, [anisotropy, countertop, grouped]);

  useLayoutEffect(() => {
    const finish = getMaterial(backsplash);
    if (!finish) return;
    applyNamedFinish(
      grouped,
      targetsForCategory("backsplash"),
      finish,
      anisotropy,
    );

    const correctedRepeat: [number, number] = [
      (finish.repeat?.[0] ?? 1) * CENTER_BACKSPLASH_REPEAT_CORRECTION,
      finish.repeat?.[1] ?? 1,
    ];
    kitchen.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (!mesh.isMesh || mesh.name !== CENTER_BACKSPLASH_MESH) return;
      const material = mesh.material as THREE.MeshPhysicalMaterial;
      applyFinish(material, { ...finish, repeat: correctedRepeat }, anisotropy);
    });
  }, [anisotropy, backsplash, grouped, kitchen]);

  return <primitive object={kitchen} />;
}
