"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { applyKitchenFraming } from "@/configurator/framing";
import { inspectKitchenScene } from "@/configurator/inspectModel";
import {
  applyNamedFinish,
  collectMaterialsByName,
  upgradeToPhysical,
} from "@/configurator/materialLoader";
import { getMaterial, STATIC_ENVIRONMENT_FINISHES } from "@/configurator/materials";
import { getActiveModel, targetsForCategory } from "@/configurator/targets";
import { useConfiguratorStore } from "@/store/configuratorStore";

useGLTF.preload(getActiveModel().url);

export function KitchenModel() {
  const model = getActiveModel();
  const { scene } = useGLTF(model.url);
  const gl = useThree((state) => state.gl);
  const camera = useThree((state) => state.camera);
  const controls = useThree((state) => state.controls) as OrbitControlsImpl | null;
  const setInspection = useConfiguratorStore((state) => state.setInspection);
  const cabinet = useConfiguratorStore((state) => state.cabinet);
  const upperCabinet = useConfiguratorStore((state) => state.upperCabinet);
  const countertop = useConfiguratorStore((state) => state.countertop);
  const backsplash = useConfiguratorStore((state) => state.backsplash);
  const floor = useConfiguratorStore((state) => state.floor);
  const inspected = useRef(false);
  const framed = useRef(false);

  const kitchen = useMemo(() => {
    const root = scene.clone(true);
    upgradeToPhysical(root);
    return root;
  }, [scene]);

  const grouped = useMemo(() => collectMaterialsByName(kitchen), [kitchen]);
  const anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());

  useLayoutEffect(() => {
    if (inspected.current) return;
    inspected.current = true;
    setInspection(inspectKitchenScene(kitchen));
  }, [kitchen, setInspection]);

  useLayoutEffect(() => {
    if (framed.current) return;
    applyKitchenFraming(camera, controls, kitchen);
    if (controls) framed.current = true;
  }, [camera, controls, kitchen]);

  useLayoutEffect(() => {
    applyNamedFinish(
      grouped,
      [model.staticTargets.wall, model.staticTargets.container],
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
  }, [anisotropy, backsplash, grouped]);

  return <primitive object={kitchen} />;
}
