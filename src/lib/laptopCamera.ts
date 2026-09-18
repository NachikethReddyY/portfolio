import * as THREE from "three";

// Use each mesh's corners so the empty space above the palm rest doesn't shrink the laptop.
export function modelFramePoints(model: THREE.Object3D): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  model.updateMatrixWorld(true);
  model.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    object.geometry.computeBoundingBox();
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
  let near = 14;
  let far = 100;
  for (let pass = 0; pass < 18; pass++) {
    const distance = (near + far) / 2;
    camera.position.copy(target).addScaledVector(direction, distance);
    camera.lookAt(target);
    camera.updateMatrixWorld();
    const extent = Math.max(
      ...points.flatMap((point) => {
        const projected = point.clone().project(camera);
        return [Math.abs(projected.x), Math.abs(projected.y)];
      }),
    );
    if (extent > 0.9) near = distance;
    else far = distance;
  }
  camera.position.copy(target).addScaledVector(direction, far);
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
