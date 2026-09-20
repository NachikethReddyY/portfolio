import * as THREE from "three";

// Use each mesh's corners so the empty space above the palm rest doesn't shrink the laptop.
export function modelFramePoints(model: THREE.Object3D): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  model.updateMatrixWorld(true);
  model.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    if (!object.geometry.boundingBox) object.geometry.computeBoundingBox();
    const bounds = object.geometry.boundingBox;
    if (!bounds) return;
    for (let i = 0; i < 8; i++) {
      points.push(
        new THREE.Vector3(
          i & 1 ? bounds.max.x : bounds.min.x,
          i & 2 ? bounds.max.y : bounds.min.y,
          i & 4 ? bounds.max.z : bounds.min.z,
        ).applyMatrix4(object.matrixWorld),
      );
    }
  });
  return points;
}

export function fitModelCamera(
  camera: THREE.PerspectiveCamera,
  points: readonly THREE.Vector3[],
  target = new THREE.Vector3(0, 2.8, 0),
  direction = new THREE.Vector3(0.24, 0.29, 1).normalize(),
) {
  if (!points.length) return;
  camera.position.copy(target).add(direction);
  camera.lookAt(target);
  camera.position.copy(target);
  camera.updateMatrixWorld();
  const projected = new THREE.Vector3();
  const projection = camera.projectionMatrix.elements;
  let distance = 14;
  // Solve the same 90% framing constraint in camera space in one pass.
  // Moving backwards changes depth only: abs(x * projectionX) / (d - z) <= .9.
  for (const point of points) {
    projected.copy(point).applyMatrix4(camera.matrixWorldInverse);
    distance = Math.max(
      distance,
      projected.z + Math.abs(projected.x * projection[0]) / 0.9,
      projected.z + Math.abs(projected.y * projection[5]) / 0.9,
    );
  }
  camera.position.copy(target).addScaledVector(direction, Math.min(100, distance));
  camera.lookAt(target);
  camera.updateMatrixWorld();
}

/** Closed overhead -> orbit -> lid opening. Framing is recomputed for each pose. */
export function poseLaptopEntrance(
  camera: THREE.PerspectiveCamera,
  model: THREE.Object3D,
  hinge: THREE.Object3D | undefined,
  progress: number,
  openAngle: number,
  hingeHeight: number,
) {
  const smooth = (value: number) => {
    const t = Math.max(0, Math.min(1, value));
    return t * t * (3 - 2 * t);
  };
  const orbit = smooth(progress / 0.7);
  const lid = smooth((progress - 0.3) / 0.7);
  if (hinge) {
    hinge.rotation.x = THREE.MathUtils.lerp(Math.PI / 2, openAngle, lid);
    hinge.position.y = hingeHeight + 0.2 * (1 - lid);
  }
  const target = new THREE.Vector3(0, THREE.MathUtils.lerp(0.6, 2.8, orbit), 0);
  const direction = new THREE.Vector3(0, 1, 0.035)
    .lerp(new THREE.Vector3(0.24, 0.29, 1).normalize(), orbit)
    .normalize();
  fitModelCamera(camera, modelFramePoints(model), target, direction);
}
