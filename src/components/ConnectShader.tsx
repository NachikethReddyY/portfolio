import { useEffect, useRef } from "react";
import { createShaderMotion } from "../lib/shaderMotion";

const vertexSource = `
attribute vec2 position;
varying vec2 uv;
void main() { uv = position * 0.5 + 0.5; gl_Position = vec4(position, 0.0, 1.0); }
`;
const fragmentSource = `
precision mediump float;
varying vec2 uv;
uniform float time;
uniform vec2 pointer;
void main() {
  vec2 p = uv;
  float bend = sin(p.x * 4.7 + time * 0.3) * 0.08;
  bend += sin(p.x * 8.0 - time * 0.16) * 0.025;
  bend += (pointer.y - 0.5) * 0.06;
  float wave = p.y - (0.36 + bend + p.x * 0.15);
  float ribbon = exp(-wave * wave * 110.0);
  float halo = exp(-wave * wave * 12.0) * 0.4;
  float edge = smoothstep(0.0, 0.14, p.x) * (1.0 - smoothstep(0.86, 1.0, p.x));
  edge *= smoothstep(0.0, 0.18, p.y) * (1.0 - smoothstep(0.76, 1.0, p.y));
  vec3 brand = vec3(0.32157, 0.44314, 1.0);
  vec3 lightBlue = vec3(0.47059, 0.70980, 1.0);
  vec3 color = mix(brand, lightBlue, clamp(p.x + (pointer.x - 0.5) * 0.1, 0.0, 1.0));
  gl_FragColor = vec4(color, min(0.24, (ribbon * 0.19 + halo * 0.12) * edge));
}
`;

/** Original procedural artwork. It settles after four seconds; pointer movement nudges it. */
export default function ConnectShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.closest("footer");
    if (!canvas || !host) return;
    let gl: WebGLRenderingContext | null = null;
    try {
      gl = canvas.getContext("webgl", {
        alpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        premultipliedAlpha: false,
        preserveDrawingBuffer: true,
        powerPreference: "low-power",
      });
    } catch {
      return;
    }
    if (!gl) return;
    const shaders: WebGLShader[] = [];
    const program = gl.createProgram();
    const buffer = gl.createBuffer();
    const cleanupGPU = () => {
      shaders.forEach((shader) => gl.deleteShader(shader));
      if (program) gl.deleteProgram(program);
      if (buffer) gl.deleteBuffer(buffer);
    };
    try {
      if (!program || !buffer) throw new Error("Shader resources unavailable");
      for (const [type, source] of [
        [gl.VERTEX_SHADER, vertexSource],
        [gl.FRAGMENT_SHADER, fragmentSource],
      ] as const) {
        const shader = gl.createShader(type);
        if (!shader) throw new Error("Shader unavailable");
        shaders.push(shader);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
          throw new Error("Shader compilation failed");
        gl.attachShader(program, shader);
      }
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS))
        throw new Error("Shader link failed");
    } catch {
      cleanupGPU();
      return;
    }
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const timeUniform = gl.getUniformLocation(program, "time");
    const pointerUniform = gl.getUniformLocation(program, "pointer");
    let elapsed = 0;
    let pointer = [0.5, 0.5];
    let target = [0.5, 0.5];
    let intersecting = false;
    let started = false;
    let lost = false;
    const draw = (seconds: number) => {
      if (lost) return;
      elapsed += seconds;
      const blend = 1 - Math.exp(-seconds * 7);
      pointer = pointer.map((value, i) => value + (target[i] - value) * blend);
      gl.uniform1f(timeUniform, elapsed);
      gl.uniform2f(pointerUniform, pointer[0], pointer[1]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      canvas.dataset.ready = "true";
    };
    const motion = createShaderMotion(draw, {
      request: (callback) => window.requestAnimationFrame(callback),
      cancel: (id) => window.cancelAnimationFrame(id),
    });
    const visibility = () =>
      motion.setVisible(intersecting && !document.hidden && !lost);
    const observer = new IntersectionObserver(([entry]) => {
      intersecting = entry.isIntersecting;
      visibility();
      if (intersecting && !started) {
        started = true;
        motion.play(4000);
      }
    });
    observer.observe(host);
    const resize = new ResizeObserver(() => {
      // One low-resolution, full-screen triangle; independent of device pixel ratio.
      const width = Math.max(1, Math.round(canvas.clientWidth));
      const height = Math.max(1, Math.round(canvas.clientHeight));
      const scale = Math.min(1, 960 / width, 480 / height);
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      gl.viewport(0, 0, canvas.width, canvas.height);
      motion.play(1);
    });
    resize.observe(canvas);
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const box = host.getBoundingClientRect();
      target = [
        Math.max(0, Math.min(1, (event.clientX - box.left) / box.width)),
        Math.max(0, Math.min(1, 1 - (event.clientY - box.top) / box.height)),
      ];
      motion.play(800);
    };
    const leave = () => {
      target = [0.5, 0.5];
      motion.play(800);
    };
    const contextLost = () => {
      lost = true;
      delete canvas.dataset.ready;
      motion.dispose();
    };
    host.addEventListener("pointermove", move);
    host.addEventListener("pointerleave", leave);
    canvas.addEventListener("webglcontextlost", contextLost);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      motion.dispose();
      observer.disconnect();
      resize.disconnect();
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
      canvas.removeEventListener("webglcontextlost", contextLost);
      document.removeEventListener("visibilitychange", visibility);
      delete canvas.dataset.ready;
      cleanupGPU();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);
  return <canvas ref={canvasRef} aria-hidden="true" />;
}
