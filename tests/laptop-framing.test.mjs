import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { fitModelCamera, modelFramePoints } from "../src/lib/laptopCamera.ts";
const buffer = fs.readFileSync("public/models/laptop.glb");
const { scene: model } = await new GLTFLoader().parseAsync(
  buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength),
  "",
);
const points = modelFramePoints(model);
for (const [w, h] of [
  [960, 480],
  [370, 258],
  [320, 258],
])
  test(`laptop is fully framed at ${w}×${h}`, () => {
    const camera = new THREE.PerspectiveCamera(30, w / h, 0.1, 150);
    fitModelCamera(camera, points);
    const extent = Math.max(
      ...points.flatMap((p) => {
        const v = p.clone().project(camera);
        return [Math.abs(v.x), Math.abs(v.y)];
      }),
    );
    assert.ok(extent <= 0.901, `projected extent ${extent}`);
    assert.ok(extent > 0.89, "model should fill available frame");
    assert.ok(
      camera.position.distanceTo(new THREE.Vector3(0, 3.8, 0)) < 25,
      "do not shrink for empty corners of a scene-wide box",
    );
  });
test("screen and engraved mark follow a single lid hinge", () => {
  const hinge = model.getObjectByName("ScreenHingeRoot");
  for (const name of [
    "ScreenDisplay",
    "ScreenBackShell",
    "CameraNotch",
    "AppleMark_0",
    "AppleMark_1",
  ])
    assert.equal(model.getObjectByName(name)?.parent, hinge, name);
  assert.ok(!model.getObjectByName("StudioFloor"));
});

test("opening animation stays inside the frame", () => {
  const hinge = model.getObjectByName("ScreenHingeRoot");
  const openAngle = hinge.rotation.x;
  for (const [w, h] of [
    [960, 480],
    [370, 238],
    [320, 238],
  ]) {
    const camera = new THREE.PerspectiveCamera(30, w / h, 0.1, 150);
    fitModelCamera(camera, points);
    for (let step = 0; step <= 20; step++) {
      const progress = step / 20;
      hinge.rotation.x = 1.43117 + (openAngle - 1.43117) * progress;
      model.rotation.y = -0.18 * (1 - progress);
      const extent = Math.max(
        ...modelFramePoints(model).flatMap((p) => {
          const v = p.clone().project(camera);
          return [Math.abs(v.x), Math.abs(v.y)];
        }),
      );
      assert.ok(extent < 0.99, `opening at ${w}×${h}, ${progress}: ${extent}`);
    }
  }
  hinge.rotation.x = openAngle;
  model.rotation.y = 0;
});

test("closed top view, orbit and opening stay framed at wide and narrow sizes", async () => {
  const { poseLaptopEntrance } = await import("../src/lib/laptopCamera.ts");
  const hinge = model.getObjectByName("ScreenHingeRoot");
  const openAngle = hinge.rotation.x;
  const height = hinge.position.y;
  for (const [w, h] of [
    [960, 480],
    [370, 258],
    [320, 200],
  ]) {
    const camera = new THREE.PerspectiveCamera(30, w / h, 0.1, 150);
    for (let step = 0; step <= 20; step++) {
      poseLaptopEntrance(camera, model, hinge, step / 20, openAngle, height);
      const extent = Math.max(
        ...modelFramePoints(model).flatMap((point) => {
          const v = point.clone().project(camera);
          return [Math.abs(v.x), Math.abs(v.y)];
        }),
      );
      assert.ok(extent <= 0.905, `${w}x${h}, ${step}: ${extent}`);
      if (step === 0) {
        assert.ok(
          Math.abs(hinge.rotation.x - Math.PI / 2) < 0.0001,
          "fully closed lid",
        );
        assert.ok(camera.position.y > 15, "camera starts overhead");
      }
      if (step === 5)
        assert.equal(hinge.rotation.x, Math.PI / 2, "orbit begins before lid");
    }
  }
  assert.ok(Math.abs(hinge.rotation.x - openAngle) < 0.0001);
  assert.ok(Math.abs(hinge.position.y - height) < 0.0001);
});
test("Air ports have recessed geometry on the correct sides", () => {
  for (const name of ["USB_C_0", "USB_C_1", "MagSafe"]) {
    const part = model.getObjectByName(name);
    assert.ok(part, name);
    assert.ok(
      new THREE.Vector3().setFromMatrixPosition(part.matrixWorld).x < -5.9,
    );
  }
  const jack = model.getObjectByName("HeadphoneJack");
  assert.ok(jack);
  assert.ok(
    new THREE.Vector3().setFromMatrixPosition(jack.matrixWorld).x > 5.9,
  );
  assert.equal(
    model.getObjectByName("BaseChassis").userData.recessed_ports,
    "MagSafe 3, two USB-C, 3.5mm headphone",
  );
});

test("camera framing matches the original projection search throughout the entrance", async () => {
  const { poseLaptopEntrance } = await import("../src/lib/laptopCamera.ts");
  const hinge = model.getObjectByName("ScreenHingeRoot");
  const openAngle = hinge.rotation.x;
  const height = hinge.position.y;
  for (const aspect of [2, 370 / 258, 320 / 200]) {
    for (let step = 0; step <= 20; step++) {
      const camera = new THREE.PerspectiveCamera(30, aspect, 0.1, 150);
      poseLaptopEntrance(camera, model, hinge, step / 20, openAngle, height);
      const frame = modelFramePoints(model);
      const t = Math.min(1, step / 20 / 0.7);
      const orbit = t * t * (3 - 2 * t);
      const target = new THREE.Vector3(
        0,
        THREE.MathUtils.lerp(0.6, 2.8, orbit),
        0,
      );
      const direction = new THREE.Vector3(0, 1, 0.035)
        .lerp(new THREE.Vector3(0.24, 0.29, 1).normalize(), orbit)
        .normalize();
      const reference = new THREE.PerspectiveCamera(30, aspect, 0.1, 150);
      let near = 14,
        far = 100;
      for (let pass = 0; pass < 18; pass++) {
        const distance = (near + far) / 2;
        reference.position.copy(target).addScaledVector(direction, distance);
        reference.lookAt(target);
        reference.updateMatrixWorld();
        const extent = Math.max(
          ...frame.flatMap((point) => {
            const projected = point.clone().project(reference);
            return [Math.abs(projected.x), Math.abs(projected.y)];
          }),
        );
        if (extent > 0.9) near = distance;
        else far = distance;
      }
      const difference = Math.abs(camera.position.distanceTo(target) - far);
      assert.ok(
        difference < 0.0004,
        `aspect ${aspect}, step ${step}: ${difference}`,
      );
    }
  }
  hinge.rotation.x = openAngle;
  hinge.position.y = height;
});
