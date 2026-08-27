"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useProgress } from "@react-three/drei";
import { Suspense, useEffect } from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useConfiguratorStore } from "@/store/configuratorStore";
import { KitchenModel } from "./KitchenModel";
import { SceneLights } from "./SceneLights";

const FALLBACK_POSITION = new THREE.Vector3(6.4, 2.35, 3.7);
const FALLBACK_TARGET = new THREE.Vector3(0.85, 1.05, 0);
const IDLE_ROTATE_DELAY = 4000;

// The room is only open on one side; past this arc the camera grazes past
// the side walls' outer faces (solid, since they're not meant to be seen
// from outside), so orbiting further makes the kitchen read as blocked
// instead of open. Free 360° rotation is still used for the passive
// auto-rotate showcase, where it reads as a turntable spin rather than a
// stuck viewpoint.
const MIN_AZIMUTH = THREE.MathUtils.degToRad(65);
const MAX_AZIMUTH = THREE.MathUtils.degToRad(125);

function AutoRotateController({ active }: { active: boolean }) {
  const controls = useThree(
    (state) => state.controls,
  ) as OrbitControlsImpl | null;
  const hasStarted = useConfiguratorStore((state) => state.hasStarted);

  useEffect(() => {
    if (!controls) return;

    // Summary turntable mode: always rotate
    if (active) {
      controls.autoRotate = true;
      return;
    }

    // Before user starts (intro splash): no auto-rotate, let rAF rest
    if (!hasStarted) {
      controls.autoRotate = false;
      return;
    }

    // After user starts: idle-resume auto-rotate behavior
    controls.autoRotate = false;
    let idleTimer: ReturnType<typeof setTimeout>;

    const stop = () => {
      clearTimeout(idleTimer);
      controls.autoRotate = false;
      useConfiguratorStore.getState().clearViewLock();
    };
    const scheduleResume = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        if (useConfiguratorStore.getState().viewLocked) return;
        controls.autoRotate = true;
      }, IDLE_ROTATE_DELAY);
    };

    controls.addEventListener("start", stop);
    controls.addEventListener("end", scheduleResume);
    scheduleResume();

    return () => {
      clearTimeout(idleTimer);
      controls.removeEventListener("start", stop);
      controls.removeEventListener("end", scheduleResume);
    };
  }, [controls, active, hasStarted]);

  return null;
}

export function KitchenViewer({
  showSummary = false,
}: {
  showSummary?: boolean;
}) {
  return (
    <Canvas
      className="kitchen-canvas"
      dpr={[1, 2]}
      shadows
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.08,
        outputColorSpace: THREE.SRGBColorSpace,
        powerPreference: "high-performance",
      }}
      camera={{
        fov: 38,
        position: FALLBACK_POSITION.toArray(),
        near: 0.1,
        far: 50,
      }}
      onCreated={({ camera }) => {
        camera.lookAt(FALLBACK_TARGET);
      }}
    >
      <color attach="background" args={[showSummary ? "#CF162D" : "#ece7e0"]} />
      <Suspense fallback={null}>
        <SceneLights />
        <KitchenModel />
      </Suspense>
      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping
        dampingFactor={0.055}
        minDistance={3.4}
        maxDistance={12}
        minPolarAngle={Math.PI * 0.12}
        maxPolarAngle={Math.PI * 0.62}
        minAzimuthAngle={showSummary ? -Infinity : MIN_AZIMUTH}
        maxAzimuthAngle={showSummary ? Infinity : MAX_AZIMUTH}
        autoRotateSpeed={1.1}
        target={FALLBACK_TARGET}
      />
      <AutoRotateController active={showSummary} />
    </Canvas>
  );
}

export function KitchenLoadStatus() {
  const { active, progress } = useProgress();
  if (!active) return null;
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-end justify-start p-6 sm:p-8">
      <p className="font-sans text-[11px] tracking-[0.28em] text-black/50 uppercase">
        Loading kitchen {Math.round(progress)}%
      </p>
    </div>
  );
}
