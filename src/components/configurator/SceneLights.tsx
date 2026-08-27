"use client";

import { Environment } from "@react-three/drei";

export function SceneLights() {
  return (
    <>
      <Environment files="/env/studio-small.hdr" environmentIntensity={0.62} />
      <hemisphereLight args={["#f4f1ec", "#8f877d", 0.28]} />
      <directionalLight
        castShadow
        position={[3.8, 6.4, 2.6]}
        intensity={1.35}
        color="#fff7ee"
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.00015}
        shadow-normalBias={0.03}
      >
        <orthographicCamera
          attach="shadow-camera"
          args={[-5, 5, 5, -5, 0.5, 22]}
        />
      </directionalLight>
      <directionalLight
        position={[-2.8, 3.4, -1.8]}
        intensity={0.22}
        color="#e8eef4"
      />
    </>
  );
}
