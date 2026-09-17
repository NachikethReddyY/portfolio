import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

gsap.registerPlugin(ScrollTrigger);

function editorTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 680;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#10141d";
  ctx.fillRect(0, 0, 1200, 680);
  ctx.fillStyle = "#1c2230";
  ctx.fillRect(0, 0, 1200, 64);
  ["#e58383", "#f2c875", "#43dcc5"].forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(30 + i * 24, 32, 7, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.fillStyle = "#a1aabc";
  ctx.font = "20px monospace";
  ctx.fillText("nachiketh / workspace", 780, 39);
  const lines = [
    ["#6c788d", "// a little curiosity, then a lot of building"],
    ["#b497ff", "const developer = {"],
    ["#e8e8ec", '  name: "Nachiketh Reddy",'],
    ["#43dcc5", '  focus: ["web", "AI", "useful things"],'],
    ["#f2c875", '  location: "Singapore",'],
    ["#e8e8ec", "  learning: true"],
    ["#b497ff", "};"],
    ["#6c788d", ""],
    ["#8db9f8", "await buildSomethingWorthUsing();"],
  ];
  ctx.font = "25px monospace";
  lines.forEach(([color, text], i) => {
    ctx.fillStyle = "#4c576a";
    ctx.fillText(String(i + 1).padStart(2, "0"), 28, 125 + i * 47);
    ctx.fillStyle = color;
    ctx.fillText(text, 86, 125 + i * 47);
  });
  ctx.fillStyle = "#43dcc5";
  ctx.fillRect(87, 571, 14, 27);
  ctx.fillStyle = "#1b2430";
  ctx.fillRect(0, 645, 1200, 35);
  ctx.fillStyle = "#8e9eb6";
  ctx.font = "16px monospace";
  ctx.fillText(
    "main  •  TypeScript                         ready to build",
    26,
    668,
  );
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace; // The generated planar UVs use bottom-left texture coordinates after export.
  texture.flipY = true;
  texture.anisotropy = 4;
  return texture;
}

export default function LaptopScene() {
  const container = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const host = container.current;
    if (!host) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
    } catch {
      setFailed(true);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.55;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 150);
    camera.position.set(15, 12.3, 23);
    camera.lookAt(0, 3.1, 0);
    const envGenerator = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const environment = envGenerator.fromScene(room, 0.04);
    scene.environment = environment.texture;
    room.dispose();
    envGenerator.dispose();
    const group = new THREE.Group();
    scene.add(group);
    const ambient = new THREE.HemisphereLight(0xddeaff, 0x27202c, 2.2);
    scene.add(ambient);
    const key = new THREE.DirectionalLight(0xf1e8ff, 5);
    key.position.set(1, 15, 12);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = -12;
    key.shadow.camera.right = 12;
    key.shadow.camera.top = 12;
    key.shadow.camera.bottom = -12;
    key.shadow.bias = -0.001;
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x91adff, 3);
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
    let visible = true;
    let model: THREE.Group | undefined;
    let frame = 0;
    const render = () => {
      if (disposed || !visible || document.hidden) return;
      renderer.render(scene, camera);
    };
    const requestRender = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        render();
      });
    };
    const resize = () => {
      if (!host.clientWidth || !host.clientHeight) return;
      renderer.setSize(host.clientWidth, host.clientHeight);
      camera.aspect = host.clientWidth / host.clientHeight;
      camera.updateProjectionMatrix();
      requestRender();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();
    const media = gsap.matchMedia();
    let rotateX: ReturnType<typeof gsap.quickTo> | undefined;
    let rotateY: ReturnType<typeof gsap.quickTo> | undefined;
    const pointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !rotateX || !rotateY) return;
      const box = host.getBoundingClientRect();
      rotateY(((event.clientX - box.left) / box.width - 0.5) * 0.32);
      rotateX(((event.clientY - box.top) / box.height - 0.5) * 0.12);
    };
    const leave = () => {
      rotateX?.(0);
      rotateY?.(0);
    };
    host.addEventListener("pointermove", pointer);
    host.addEventListener("pointerleave", leave);
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
      setFailed(true);
    };
    renderer.domElement.addEventListener("webglcontextlost", onLost);
    const texture = editorTexture();
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
            obj.receiveShadow = true;
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
        group.add(model);
        setReady(true);
        resize();
        media.add("(prefers-reduced-motion: no-preference)", () => {
          const intro = gsap.timeline({ onUpdate: requestRender });
          intro
            .fromTo(
              model!.rotation,
              { y: -0.45, x: 0.1 },
              { y: 0, x: 0, duration: 1.5, ease: "power3.out" },
            )
            .fromTo(
              model!.position,
              { y: -1.3 },
              { y: 0, duration: 1.5, ease: "power3.out" },
              0,
            );
          if (hinge)
            intro.fromTo(
              hinge.rotation,
              { x: 1.43117 },
              { x: openAngle, duration: 1.25, ease: "power3.inOut" },
              0.15,
            );
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
          gsap.to(group.position, {
            y: 0.6,
            ease: "none",
            onUpdate: requestRender,
            scrollTrigger: {
              trigger: host,
              start: "top 70%",
              end: "bottom top",
              scrub: 0.7,
            },
          });
          return () => {
            rotateX = undefined;
            rotateY = undefined;
            requestRender();
          };
        });
        media.add("(prefers-reduced-motion: reduce)", () => {
          if (hinge) hinge.rotation.x = openAngle;
          group.rotation.set(0, 0, 0);
          group.position.set(0, 0, 0);
          model?.rotation.set(0, 0, 0);
          model?.position.set(0, 0, 0);
          requestRender();
        });
      },
      undefined,
      () => {
        if (!disposed) setFailed(true);
      },
    );
    return () => {
      disposed = true;
      media.revert();
      resizeObserver.disconnect();
      visibility.disconnect();
      host.removeEventListener("pointermove", pointer);
      host.removeEventListener("pointerleave", leave);
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
  }, []);
  return (
    <div
      className={`laptop-scene ${ready ? "is-ready" : ""} ${failed ? "is-failed" : ""}`}
      ref={container}
      aria-hidden="true"
    >
      {(!ready || failed) && (
        <img
          className="laptop-fallback"
          src="/models/laptop-fallback.webp"
          alt=""
        />
      )}
    </div>
  );
}
