import * as THREE from "three";

type OrbitLike = {
  target: THREE.Vector3;
  minDistance: number;
  maxDistance: number;
  update: () => void;
  autoRotate?: boolean;
};

export function computeKitchenFraming(
  root: THREE.Object3D,
  aspect: number = 1.5,
  fov: number = 38,
) {
  const box = new THREE.Box3().setFromObject(root);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const span = Math.max(size.x, size.z, 1);

  // Look into the U, slightly toward the back wall and below geometric center.
  const target = new THREE.Vector3(
    center.x - size.x * 0.1,
    box.min.y + size.y * 0.38,
    center.z,
  );

  // Base distance for landscape framing
  let distance = span * 2.05;

  // For portrait/tall viewports, we need to pull back further so the kitchen
  // fits vertically. The vertical FOV stays constant, but with a narrow width
  // we see less horizontal span. Compute the required distance to fit the
  // kitchen height in view.
  if (aspect < 1.2) {
    const verticalFov = THREE.MathUtils.degToRad(fov);
    const kitchenVisibleHeight = size.y * 1.15;
    const requiredDistance = kitchenVisibleHeight / (2 * Math.tan(verticalFov / 2));
    distance = Math.max(distance, requiredDistance * 1.1);
  }

  const position = new THREE.Vector3(
    target.x + distance * 0.94,
    target.y + size.y * 0.46,
    target.z + distance * 0.3,
  );

  return {
    target,
    position,
    minDistance: span * 1.35,
    maxDistance: span * 3.6,
    far: Math.max(40, span * 14),
  };
}

export function applyKitchenFraming(
  camera: THREE.Camera,
  controls: OrbitLike | null | undefined,
  root: THREE.Object3D,
  aspect?: number,
) {
  const isPerspective = camera instanceof THREE.PerspectiveCamera;
  const effectiveAspect = aspect ?? (isPerspective ? camera.aspect : 1.5);
  const fov = isPerspective ? camera.fov : 38;

  const framing = computeKitchenFraming(root, effectiveAspect, fov);

  camera.position.copy(framing.position);
  camera.lookAt(framing.target);
  if (isPerspective) {
    camera.near = 0.1;
    camera.far = framing.far;
    camera.updateProjectionMatrix();
  }

  if (controls && controls.target?.isVector3) {
    controls.target.copy(framing.target);
    controls.minDistance = framing.minDistance;
    controls.maxDistance = framing.maxDistance;
    controls.update();
  }

  return framing;
}

/** Straight-on, symmetric view centered on the opening — a still "elevation"
 * shot rather than the default three-quarter angle. */
export function computeHeadOnFraming(root: THREE.Object3D) {
  const box = new THREE.Box3().setFromObject(root);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const span = Math.max(size.x, size.z, 1);

  const target = new THREE.Vector3(
    center.x - size.x * 0.1,
    box.min.y + size.y * 0.38,
    center.z,
  );

  const distance = span * 1.9;
  const position = new THREE.Vector3(
    target.x + distance,
    target.y + size.y * 0.3,
    target.z,
  );

  return { target, position };
}

export function applyHeadOnFraming(
  camera: THREE.Camera,
  controls: OrbitLike | null | undefined,
  root: THREE.Object3D,
) {
  const framing = computeHeadOnFraming(root);

  camera.position.copy(framing.position);
  camera.lookAt(framing.target);
  if (camera instanceof THREE.PerspectiveCamera) {
    camera.updateProjectionMatrix();
  }

  if (controls && controls.target?.isVector3) {
    controls.target.copy(framing.target);
    controls.autoRotate = false;
    controls.update();
  }

  return framing;
}
