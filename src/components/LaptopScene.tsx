import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import {
  fitModelCamera,
  modelFramePoints,
  poseLaptopEntrance,
} from "../lib/laptopCamera";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

export default function LaptopScene({
  open,
  onReady,
  onFailure,
  onOpen,
}: {
  open: boolean;
  onReady: () => void;
  onFailure: () => void;
  onOpen: () => void;
}) {
  const openRef = useRef(open);
  openRef.current = open;
  const startOpening = useRef<(() => void) | null>(null);
  useEffect(() => {
    if (open) startOpening.current?.();
  }, [open]);
  const container = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const host = container.current;
    if (!host) return;
    if (failed) {
      onFailure();
      return;
    }
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        // Retain the last frame while the on-demand renderer is idle.
        preserveDrawingBuffer: true,
        antialias: true,
        powerPreference: "low-power",
      });
    } catch {
      setFailed(true);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.9;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 150);
    camera.position.set(5, 9, 18);
    camera.lookAt(0, 3.8, 0);
    const envGenerator = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const environment = envGenerator.fromScene(room, 0.04);
    scene.environment = environment.texture;
    scene.environmentIntensity = 0.35;
    room.dispose();
    envGenerator.dispose();
    const group = new THREE.Group();
    scene.add(group);
    const ambient = new THREE.HemisphereLight(0xddeaff, 0x171a20, 0.7);
    scene.add(ambient);
    const key = new THREE.DirectionalLight(0xf1f4ff, 2);
    key.position.set(1, 15, 12);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.left = -12;
    key.shadow.camera.right = 12;
    key.shadow.camera.top = 12;
    key.shadow.camera.bottom = -12;
    key.shadow.bias = -0.001;
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x91adff, 1.2);
    rim.position.set(-12, 8, -8);
    scene.add(rim);
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(60, 60),
      new THREE.ShadowMaterial({ opacity: 0.2 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.12;
    floor.receiveShadow = true;
    scene.add(floor);
    let disposed = false;
    let unavailable = false;
    let visible = true;
    let model: THREE.Group | undefined;
    let modelCorners: THREE.Vector3[] = [];
    let frame = 0;
    let firstModelFrame = false;
    const render = () => {
      if (disposed || unavailable || !visible || document.hidden) return;
      renderer.render(scene, camera);
      if (model && !firstModelFrame) {
        firstModelFrame = true;
        setReady(true);
        onReady();
      }
    };
    const requestRender = () => {
      if (disposed || unavailable || frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        render();
      });
    };
    let updateIntroPose: (() => void) | undefined;
    const resize = () => {
      if (!host.clientWidth || !host.clientHeight) return;
      renderer.setSize(host.clientWidth, host.clientHeight);
      camera.aspect = host.clientWidth / host.clientHeight;
      camera.updateProjectionMatrix();
      if (updateIntroPose) updateIntroPose();
      else fitModelCamera(camera, modelCorners);
      requestRender();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();
    const media = gsap.matchMedia();
    let interactionReady = false;
    let rotateX: ReturnType<typeof gsap.quickTo> | undefined;
    let rotateY: ReturnType<typeof gsap.quickTo> | undefined;
    const pointer = (event: PointerEvent) => {
      if (
        !interactionReady ||
        event.pointerType !== "mouse" ||
        !rotateX ||
        !rotateY
      )
        return;
      const box = host.getBoundingClientRect();
      rotateY(((event.clientX - box.left) / box.width - 0.5) * 0.32);
      rotateX(((event.clientY - box.top) / box.height - 0.5) * 0.12);
    };
    const leave = () => {
      rotateX?.(0);
      rotateY?.(0);
    };
    host.parentElement?.addEventListener("pointermove", pointer);
    host.parentElement?.addEventListener("pointerleave", leave);
    const visibility = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) requestRender();
      },
      { rootMargin: "100px" },
    );
    visibility.observe(host);
    document.addEventListener("visibilitychange", requestRender);
    const onLost = (event: Event) => {
      event.preventDefault();
      unavailable = true;
      setFailed(true);
    };
    renderer.domElement.addEventListener("webglcontextlost", onLost);
    const texture = new THREE.TextureLoader().load(
      "/models/laptop-screen.webp",
      requestRender,
    );
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.flipY = true;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    new GLTFLoader().load(
      "/models/laptop.glb",
      (gltf) => {
        if (disposed) {
          gltf.scene.traverse((obj) => {
            if (obj instanceof THREE.Mesh) {
              obj.geometry.dispose();
              const mats = Array.isArray(obj.material)
                ? obj.material
                : [obj.material];
              mats.forEach((mat) => mat.dispose());
            }
          });
          return;
        }
        model = gltf.scene;
        model.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
            obj.castShadow = true;
            obj.receiveShadow = false;
            if (["DisplayBezel", "CameraNotch"].includes(obj.name)) {
              const materials = Array.isArray(obj.material)
                ? obj.material
                : [obj.material];
              materials.forEach((material) => {
                if (material instanceof THREE.MeshStandardMaterial) {
                  material.color.set(0x030405);
                  material.roughness = 1;
                  material.metalness = 0;
                  material.envMapIntensity = 0;
                }
              });
            }
            if (obj.name === "ScreenDisplay") {
              const old = Array.isArray(obj.material)
                ? obj.material
                : [obj.material];
              old.forEach((m) => m.dispose());
              obj.material = new THREE.MeshBasicMaterial({
                map: texture,
                toneMapped: false,
              });
            }
          }
        });
        const hinge = model.getObjectByName("ScreenHingeRoot");
        const openAngle = hinge?.rotation.x ?? -0.122173;
        const hingeHeight = hinge?.position.y ?? 0.4;
        group.add(model);
        modelCorners = modelFramePoints(model);
        resize();
        media.add("(prefers-reduced-motion: no-preference)", () => {
          const pose = { progress: 0 };
          updateIntroPose = () => {
            if (model)
              poseLaptopEntrance(
                camera,
                model,
                hinge,
                pose.progress,
                openAngle,
                hingeHeight,
              );
          };
          updateIntroPose();
          const intro = gsap.timeline({
            paused: true,
            onUpdate: () => {
              updateIntroPose?.();
              requestRender();
            },
            onComplete: () => {
              updateIntroPose = undefined;
              interactionReady = true;
              onOpen();
            },
          });
          intro.to(pose, { progress: 1, duration: 2.5, ease: "none" }, 0.15);
          startOpening.current = () => intro.play();
          if (openRef.current) intro.play();
          requestRender();
          rotateX = gsap.quickTo(group.rotation, "x", {
            duration: 0.8,
            ease: "power3.out",
            onUpdate: requestRender,
          });
          rotateY = gsap.quickTo(group.rotation, "y", {
            duration: 0.8,
            ease: "power3.out",
            onUpdate: requestRender,
          });
          return () => {
            startOpening.current = null;
            updateIntroPose = undefined;
            interactionReady = false;
            rotateX = undefined;
            rotateY = undefined;
            requestRender();
          };
        });
        media.add("(prefers-reduced-motion: reduce)", () => {
          onOpen();
          if (hinge) {
            hinge.rotation.x = openAngle;
            hinge.position.y = hingeHeight;
          }
          fitModelCamera(camera, modelCorners);
          group.rotation.set(0, 0, 0);
          group.position.set(0, 0, 0);
          model?.rotation.set(0, 0, 0);
          model?.position.set(0, 0, 0);
          requestRender();
        });
      },
      undefined,
      () => {
        if (!disposed) {
          unavailable = true;
          setFailed(true);
        }
      },
    );
    return () => {
      disposed = true;
      media.revert();
      resizeObserver.disconnect();
      visibility.disconnect();
      host.parentElement?.removeEventListener("pointermove", pointer);
      host.parentElement?.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", requestRender);
      renderer.domElement.removeEventListener("webglcontextlost", onLost);
      cancelAnimationFrame(frame);
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          const mats = Array.isArray(obj.material)
            ? obj.material
            : [obj.material];
          mats.forEach((m) => m.dispose());
        }
      });
      texture.dispose();
      environment.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [failed, onOpen, onReady, onFailure]);
  return (
    <div
      className={`laptop-scene ${ready ? "is-ready" : ""} ${failed ? "is-failed" : ""}`}
      ref={container}
      aria-hidden="true"
    >
      {(!ready || failed) && (
        <img
          className="laptop-fallback"
          src={
            failed
              ? "/models/laptop-fallback.webp"
              : "/models/laptop-closed.webp"
          }
          alt=""
        />
      )}
    </div>
  );
}
