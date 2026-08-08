"use client";

import * as React from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { KeyboardControls, useKeyboardControls } from "@react-three/drei";
import Link from "next/link";
import type { GalleryImage } from "./page";

// ─── Utility ──────────────────────────────────────────────────────────────────
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const seededRandom = (seed: number) => { const x = Math.sin(seed * 9999) * 10000; return x - Math.floor(x); };
const hashString = (str: string) => { let h = 0; for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0; return Math.abs(h); };

// ─── Constants ────────────────────────────────────────────────────────────────
const CHUNK_SIZE = 110;
const RENDER_DISTANCE = 2;
const CHUNK_FADE_MARGIN = 1;
const MAX_VELOCITY = 3.2;
const DEPTH_FADE_START = 140;
const DEPTH_FADE_END = 260;
const INVIS_THRESHOLD = 0.01;
const KEYBOARD_SPEED = 0.18;
const VELOCITY_LERP = 0.16;
const VELOCITY_DECAY = 0.9;
const INITIAL_CAMERA_Z = 50;
const MAX_PLANE_CACHE = 256;

type ChunkOffset = { dx: number; dy: number; dz: number };
const CHUNK_OFFSETS: ChunkOffset[] = (() => {
  const maxDist = RENDER_DISTANCE + CHUNK_FADE_MARGIN;
  const offsets: ChunkOffset[] = [];
  for (let dx = -maxDist; dx <= maxDist; dx++)
    for (let dy = -maxDist; dy <= maxDist; dy++)
      for (let dz = -maxDist; dz <= maxDist; dz++)
        if (Math.max(Math.abs(dx), Math.abs(dy), Math.abs(dz)) <= maxDist)
          offsets.push({ dx, dy, dz });
  return offsets;
})();

// ─── Types ────────────────────────────────────────────────────────────────────
type MediaItem = GalleryImage;
type PlaneData = { id: string; position: THREE.Vector3; scale: THREE.Vector3; mediaIndex: number };
type ChunkData = { key: string; cx: number; cy: number; cz: number };
type CameraGridState = { cx: number; cy: number; cz: number; camZ: number };

// ─── Plane Registry ───────────────────────────────────────────────────────────
type PlaneEntry = {
  meshRef: React.RefObject<THREE.Mesh | null>;
  materialRef: React.RefObject<THREE.MeshBasicMaterial | null>;
  state: { opacity: number; frame: number };
  chunkCx: number; chunkCy: number; chunkCz: number;
  posZ: number;
};
const activePlanes = new Set<PlaneEntry>();

// ─── Texture Manager (ImageBitmapLoader — off main thread) ────────────────────
const textureCache = new Map<string, THREE.Texture>();
const pendingCallbacks = new Map<string, Set<(tex: THREE.Texture) => void>>();
const globalLoadListeners = new Set<() => void>();

const bitmapLoader = new THREE.ImageBitmapLoader();
bitmapLoader.setOptions({ imageOrientation: "flipY" });

// Use Next.js image optimization to serve images at reduced resolution
const getOptimizedUrl = (url: string) =>
  `/_next/image?url=${encodeURIComponent(url)}&w=828&q=80`;

const getTexture = (url: string, onLoad: (tex: THREE.Texture) => void) => {
  const cached = textureCache.get(url);
  if (cached) { onLoad(cached); return; }

  if (!pendingCallbacks.has(url)) {
    pendingCallbacks.set(url, new Set());
    const optimizedUrl = getOptimizedUrl(url);
    bitmapLoader.load(
      optimizedUrl,
      (imageBitmap) => {
        const texture = new THREE.CanvasTexture(imageBitmap);
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = true;
        texture.anisotropy = 4;
        texture.colorSpace = THREE.SRGBColorSpace;
        textureCache.set(url, texture);
        pendingCallbacks.get(url)?.forEach((cb) => { try { cb(texture); } catch {} });
        pendingCallbacks.delete(url);
        globalLoadListeners.forEach((fn) => fn());
      },
      undefined,
      () => {
        // fallback: try unoptimized
        const fallbackLoader = new THREE.TextureLoader();
        fallbackLoader.load(url, (tex) => {
          tex.minFilter = THREE.LinearMipmapLinearFilter;
          tex.magFilter = THREE.LinearFilter;
          tex.generateMipmaps = true;
          tex.anisotropy = 4;
          tex.colorSpace = THREE.SRGBColorSpace;
          textureCache.set(url, tex);
          pendingCallbacks.get(url)?.forEach((cb) => { try { cb(tex); } catch {} });
          pendingCallbacks.delete(url);
          globalLoadListeners.forEach((fn) => fn());
        });
      }
    );
  }

  pendingCallbacks.get(url)?.add(onLoad);
};

// ─── Plane Cache ──────────────────────────────────────────────────────────────
const planeCache = new Map<string, PlaneData[]>();

const generateChunkPlanesCached = (cx: number, cy: number, cz: number): PlaneData[] => {
  const key = `${cx},${cy},${cz}`;
  const cached = planeCache.get(key);
  if (cached) { planeCache.delete(key); planeCache.set(key, cached); return cached; }
  const planes: PlaneData[] = [];
  const seed = hashString(`${cx},${cy},${cz}`);
  for (let i = 0; i < 3; i++) {
    const s = seed + i * 1000;
    const r = (n: number) => seededRandom(s + n);
    const size = 12 + r(4) * 8;
    planes.push({
      id: `${cx}-${cy}-${cz}-${i}`,
      position: new THREE.Vector3(cx * CHUNK_SIZE + r(0) * CHUNK_SIZE, cy * CHUNK_SIZE + r(1) * CHUNK_SIZE, cz * CHUNK_SIZE + r(2) * CHUNK_SIZE),
      scale: new THREE.Vector3(size, size, 1),
      mediaIndex: Math.floor(r(5) * 1_000_000),
    });
  }
  planeCache.set(key, planes);
  while (planeCache.size > MAX_PLANE_CACHE) planeCache.delete(planeCache.keys().next().value as string);
  return planes;
};

const getChunkThrottleMs = (isZooming: boolean, speed: number) =>
  speed > 1.0 ? 500 : isZooming ? 400 : 100;

// ─── MediaPlane ───────────────────────────────────────────────────────────────
const PLANE_GEOMETRY = new THREE.PlaneGeometry(1, 1);

function MediaPlane({ position, scale, media, chunkCx, chunkCy, chunkCz }: {
  position: THREE.Vector3; scale: THREE.Vector3; media: MediaItem;
  chunkCx: number; chunkCy: number; chunkCz: number;
}) {
  const meshRef = React.useRef<THREE.Mesh>(null);
  const materialRef = React.useRef<THREE.MeshBasicMaterial>(null);
  const localState = React.useRef({ opacity: 0, frame: 0 });
  const [texture, setTexture] = React.useState<THREE.Texture | null>(null);

  // Dimensions known upfront from manifest — stable, no re-render needed
  const displayScale = React.useMemo(() => {
    if (media.width && media.height) {
      const aspect = media.width / media.height;
      return new THREE.Vector3(scale.y * aspect, scale.y, 1);
    }
    return scale;
  }, [media.width, media.height, scale]);

  React.useEffect(() => {
    const entry: PlaneEntry = {
      meshRef: meshRef as React.RefObject<THREE.Mesh | null>,
      materialRef: materialRef as React.RefObject<THREE.MeshBasicMaterial | null>,
      state: localState.current,
      chunkCx, chunkCy, chunkCz, posZ: position.z,
    };
    activePlanes.add(entry);
    return () => { activePlanes.delete(entry); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    localState.current.opacity = 0;
    const mat = materialRef.current;
    if (mat) { mat.opacity = 0; mat.depthWrite = false; mat.map = null; }
    setTexture(null);
    let canceled = false;
    getTexture(media.url, (tex) => {
      if (!canceled) setTexture(tex);
    });
    return () => { canceled = true; };
  }, [media.url]);

  // Apply texture to material once loaded
  React.useEffect(() => {
    const mat = materialRef.current;
    const mesh = meshRef.current;
    if (!mat || !mesh || !texture) return;
    mat.map = texture;
    mat.needsUpdate = true;
    mesh.scale.copy(displayScale);
  }, [texture, displayScale]);

  if (!texture) return null;

  return (
    <mesh ref={meshRef} position={position} scale={displayScale} visible={false} geometry={PLANE_GEOMETRY}>
      <meshBasicMaterial ref={materialRef} transparent opacity={0} side={THREE.DoubleSide} />
    </mesh>
  );
}

// ─── Chunk ────────────────────────────────────────────────────────────────────
const Chunk = React.memo(function Chunk({ cx, cy, cz, media }: {
  cx: number; cy: number; cz: number; media: MediaItem[];
}) {
  const [planes, setPlanes] = React.useState<PlaneData[] | null>(null);

  React.useEffect(() => {
    let canceled = false;
    const run = () => !canceled && setPlanes(generateChunkPlanesCached(cx, cy, cz));
    if (typeof requestIdleCallback !== "undefined") {
      const id = requestIdleCallback(run, { timeout: 100 });
      return () => { canceled = true; cancelIdleCallback(id); };
    }
    const id = setTimeout(run, 0);
    return () => { canceled = true; clearTimeout(id); };
  }, [cx, cy, cz]);

  if (!planes) return null;

  return (
    <group>
      {planes.map((plane) => {
        const mediaItem = media[plane.mediaIndex % media.length];
        if (!mediaItem) return null;
        return (
          <MediaPlane key={plane.id} position={plane.position} scale={plane.scale}
            media={mediaItem} chunkCx={cx} chunkCy={cy} chunkCz={cz} />
        );
      })}
    </group>
  );
});

// ─── Touch Helper ─────────────────────────────────────────────────────────────
const getTouchDist = (touches: Touch[]) => {
  if (touches.length < 2) return 0;
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
};

// ─── Keyboard ─────────────────────────────────────────────────────────────────
const KEYBOARD_MAP = [
  { name: "forward", keys: ["w", "W", "ArrowUp"] },
  { name: "backward", keys: ["s", "S", "ArrowDown"] },
  { name: "left", keys: ["a", "A", "ArrowLeft"] },
  { name: "right", keys: ["d", "D", "ArrowRight"] },
  { name: "up", keys: ["e", "E"] },
  { name: "down", keys: ["q", "Q"] },
];
type Keys = { forward: boolean; backward: boolean; left: boolean; right: boolean; up: boolean; down: boolean };

// ─── Scene Controller ─────────────────────────────────────────────────────────
type S = {
  vel: { x: number; y: number; z: number };
  tvel: { x: number; y: number; z: number };
  pos: { x: number; y: number; z: number };
  drift: { x: number; y: number };
  mouse: { x: number; y: number };
  lastMouse: { x: number; y: number };
  scrollAccum: number;
  zoomMomentum: number;
  dragging: boolean;
  lastTouches: Touch[];
  lastTouchDist: number;
  lastChunkKey: string;
  lastChunkUpdate: number;
  pendingChunk: { cx: number; cy: number; cz: number } | null;
};

const mkState = (z: number): S => ({
  vel: { x: 0, y: 0, z: 0 }, tvel: { x: 0, y: 0, z: 0 },
  pos: { x: 0, y: 0, z }, drift: { x: 0, y: 0 },
  mouse: { x: 0, y: 0 }, lastMouse: { x: 0, y: 0 },
  scrollAccum: 0, zoomMomentum: 0, dragging: false,
  lastTouches: [], lastTouchDist: 0,
  lastChunkKey: "", lastChunkUpdate: 0, pendingChunk: null,
});

function SceneController({ media }: { media: MediaItem[] }) {
  const { camera, gl } = useThree();
  const [, getKeys] = useKeyboardControls<keyof Keys>();
  const isTouch = React.useMemo(() =>
    typeof navigator !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0), []);
  const s = React.useRef<S>(mkState(INITIAL_CAMERA_Z));
  const cam = React.useRef<CameraGridState>({ cx: 0, cy: 0, cz: 0, camZ: camera.position.z });
  const [chunks, setChunks] = React.useState<ChunkData[]>([]);

  React.useEffect(() => {
    const el = gl.domElement;
    const st = s.current;
    el.style.cursor = "grab";

    const onMD = (e: MouseEvent) => { st.dragging = true; st.lastMouse = { x: e.clientX, y: e.clientY }; el.style.cursor = "grabbing"; };
    const onMU = () => { st.dragging = false; el.style.cursor = "grab"; };
    const onML = () => { st.mouse = { x: 0, y: 0 }; st.dragging = false; el.style.cursor = "grab"; };
    const onMM = (e: MouseEvent) => {
      st.mouse = { x: (e.clientX / window.innerWidth) * 2 - 1, y: -(e.clientY / window.innerHeight) * 2 + 1 };
      if (st.dragging) {
        st.tvel.x -= (e.clientX - st.lastMouse.x) * 0.025;
        st.tvel.y += (e.clientY - st.lastMouse.y) * 0.025;
        st.lastMouse = { x: e.clientX, y: e.clientY };
      }
    };
    const onW = (e: WheelEvent) => { e.preventDefault(); const d = e.deltaY * 0.018; st.scrollAccum += d; st.zoomMomentum += d * 0.4; };
    const onTS = (e: TouchEvent) => { e.preventDefault(); st.lastTouches = Array.from(e.touches) as Touch[]; st.lastTouchDist = getTouchDist(st.lastTouches); el.style.cursor = "grabbing"; };
    const onTM = (e: TouchEvent) => {
      e.preventDefault();
      const t = Array.from(e.touches) as Touch[];
      if (t.length === 1 && st.lastTouches.length >= 1) {
        const [a] = t; const [b] = st.lastTouches;
        if (a && b) { st.tvel.x -= (a.clientX - b.clientX) * 0.02; st.tvel.y += (a.clientY - b.clientY) * 0.02; }
      } else if (t.length === 2 && st.lastTouchDist > 0) {
        const d = getTouchDist(t); const delta = (st.lastTouchDist - d) * 0.018; st.scrollAccum += delta; st.zoomMomentum += delta * 0.4; st.lastTouchDist = d;
      }
      st.lastTouches = t;
    };
    const onTE = (e: TouchEvent) => { st.lastTouches = Array.from(e.touches) as Touch[]; st.lastTouchDist = getTouchDist(st.lastTouches); el.style.cursor = "grab"; };

    el.addEventListener("mousedown", onMD);
    window.addEventListener("mouseup", onMU);
    window.addEventListener("mousemove", onMM);
    el.addEventListener("mouseleave", onML);
    el.addEventListener("wheel", onW, { passive: false });
    el.addEventListener("touchstart", onTS, { passive: false });
    el.addEventListener("touchmove", onTM, { passive: false });
    el.addEventListener("touchend", onTE, { passive: false });

    return () => {
      el.removeEventListener("mousedown", onMD);
      window.removeEventListener("mouseup", onMU);
      window.removeEventListener("mousemove", onMM);
      el.removeEventListener("mouseleave", onML);
      el.removeEventListener("wheel", onW);
      el.removeEventListener("touchstart", onTS);
      el.removeEventListener("touchmove", onTM);
      el.removeEventListener("touchend", onTE);
    };
  }, [gl]);

  useFrame(() => {
    const st = s.current; const now = performance.now();
    const { forward, backward, left, right, up, down } = getKeys();
    if (forward) st.tvel.z -= KEYBOARD_SPEED;
    if (backward) st.tvel.z += KEYBOARD_SPEED;
    if (left) st.tvel.x -= KEYBOARD_SPEED;
    if (right) st.tvel.x += KEYBOARD_SPEED;
    if (down) st.tvel.y -= KEYBOARD_SPEED;
    if (up) st.tvel.y += KEYBOARD_SPEED;

    const isZooming = Math.abs(st.vel.z) > 0.05;
    const zf = clamp(st.pos.z / 50, 0.3, 2.0);
    const dl = isZooming ? 0.2 : 0.12;

    if (!st.dragging) {
      if (isTouch) { st.drift.x = lerp(st.drift.x, 0, dl); st.drift.y = lerp(st.drift.y, 0, dl); }
      else { st.drift.x = lerp(st.drift.x, st.mouse.x * 8 * zf, dl); st.drift.y = lerp(st.drift.y, st.mouse.y * 8 * zf, dl); }
    }

    st.tvel.z += st.scrollAccum + st.zoomMomentum;
    st.scrollAccum *= 0.65;
    st.zoomMomentum *= 0.96;
    st.tvel.x = clamp(st.tvel.x, -MAX_VELOCITY, MAX_VELOCITY);
    st.tvel.y = clamp(st.tvel.y, -MAX_VELOCITY, MAX_VELOCITY);
    st.tvel.z = clamp(st.tvel.z, -MAX_VELOCITY, MAX_VELOCITY);

    st.vel.x = lerp(st.vel.x, st.tvel.x, VELOCITY_LERP);
    st.vel.y = lerp(st.vel.y, st.tvel.y, VELOCITY_LERP);
    st.vel.z = lerp(st.vel.z, st.tvel.z, VELOCITY_LERP);

    st.pos.x += st.vel.x; st.pos.y += st.vel.y; st.pos.z += st.vel.z;
    camera.position.set(st.pos.x + st.drift.x, st.pos.y + st.drift.y, st.pos.z);

    st.tvel.x *= VELOCITY_DECAY; st.tvel.y *= VELOCITY_DECAY; st.tvel.z *= VELOCITY_DECAY;

    const cx = Math.floor(st.pos.x / CHUNK_SIZE);
    const cy = Math.floor(st.pos.y / CHUNK_SIZE);
    const cz = Math.floor(st.pos.z / CHUNK_SIZE);
    const c = cam.current;
    c.cx = cx; c.cy = cy; c.cz = cz; c.camZ = st.pos.z;

    const key = `${cx},${cy},${cz}`;
    if (key !== st.lastChunkKey) { st.pendingChunk = { cx, cy, cz }; st.lastChunkKey = key; }

    const throttle = getChunkThrottleMs(isZooming, Math.abs(st.vel.z));
    if (st.pendingChunk && now - st.lastChunkUpdate >= throttle) {
      const { cx: ucx, cy: ucy, cz: ucz } = st.pendingChunk;
      st.pendingChunk = null; st.lastChunkUpdate = now;
      setChunks(CHUNK_OFFSETS.map((o) => ({
        key: `${ucx + o.dx},${ucy + o.dy},${ucz + o.dz}`,
        cx: ucx + o.dx, cy: ucy + o.dy, cz: ucz + o.dz,
      })));
    }

    // Consolidated visibility loop
    for (const plane of activePlanes) {
      const mesh = plane.meshRef.current; const mat = plane.materialRef.current;
      if (!mat || !mesh) continue;
      const ps = plane.state;
      ps.frame = (ps.frame + 1) & 1;
      if (ps.opacity < INVIS_THRESHOLD && !mesh.visible && ps.frame === 0) continue;
      const dist = Math.max(Math.abs(plane.chunkCx - c.cx), Math.abs(plane.chunkCy - c.cy), Math.abs(plane.chunkCz - c.cz));
      const depth = Math.abs(plane.posZ - c.camZ);
      if (depth > DEPTH_FADE_END + 50) { ps.opacity = 0; mat.opacity = 0; mat.depthWrite = false; mesh.visible = false; continue; }
      const gf = dist <= RENDER_DISTANCE ? 1 : Math.max(0, 1 - (dist - RENDER_DISTANCE) / Math.max(CHUNK_FADE_MARGIN, 1e-4));
      const df = depth <= DEPTH_FADE_START ? 1 : Math.max(0, 1 - (depth - DEPTH_FADE_START) / Math.max(DEPTH_FADE_END - DEPTH_FADE_START, 1e-4));
      const target = Math.min(gf, df * df);
      ps.opacity = (target < INVIS_THRESHOLD && ps.opacity < INVIS_THRESHOLD) ? 0 : lerp(ps.opacity, target, 0.18);
      const full = ps.opacity > 0.99;
      mat.opacity = full ? 1 : ps.opacity;
      mat.depthWrite = full;
      mesh.visible = ps.opacity > INVIS_THRESHOLD;
    }
  });

  React.useEffect(() => {
    const st = s.current;
    st.pos = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
    setChunks(CHUNK_OFFSETS.map((o) => ({ key: `${o.dx},${o.dy},${o.dz}`, cx: o.dx, cy: o.dy, cz: o.dz })));
  }, [camera]);

  return (
    <>
      {chunks.map((chunk) => (
        <Chunk key={chunk.key} cx={chunk.cx} cy={chunk.cy} cz={chunk.cz} media={media} />
      ))}
    </>
  );
}

// ─── Gallery Canvas ───────────────────────────────────────────────────────────
export default function GalleryCanvas({ images }: { images: GalleryImage[] }) {
  const [overlayLoaded, setOverlayLoaded] = React.useState(false);
  const [loadProgress, setLoadProgress] = React.useState(0);

  React.useEffect(() => {
    const needed = Math.min(3, images.length);
    if (needed === 0) { setOverlayLoaded(true); return; }
    let count = 0;
    const listener = () => {
      count++;
      setLoadProgress(Math.round((count / needed) * 100));
      if (count >= needed) { globalLoadListeners.delete(listener); setOverlayLoaded(true); }
    };
    globalLoadListeners.add(listener);
    return () => { globalLoadListeners.delete(listener); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const isTouch = typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);
  const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, isTouch ? 1.25 : 1.5);

  if (!images.length) {
    return (
      <div style={{ position: "fixed", inset: 0, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "24px", zIndex: 9999 }}>
        <div style={{ letterSpacing: "0.5em", fontSize: "clamp(2.25rem, 12vw, 5rem)", fontWeight: 300, color: "#000" }}>L I F E</div>
        <Link href="/" prefetch={false} style={{ fontSize: "0.875rem", color: "#000", textDecoration: "none", letterSpacing: "0.05em" }}>Home</Link>
      </div>
    );
  }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999 }}>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.25} }`}</style>

      {/* Loading overlay */}
      <div style={{ position: "absolute", inset: 0, background: "#fff", zIndex: 20, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "32px", transition: "opacity 0.6s ease", opacity: overlayLoaded ? 0 : 1, pointerEvents: overlayLoaded ? "none" : "auto" }}>
        <div style={{ fontSize: "0.875rem", letterSpacing: "0.25em", color: "#000", animation: "pulse 1.4s ease-in-out infinite", userSelect: "none" }}>let it cook</div>
        <div style={{ width: "160px", height: "1px", background: "#e5e5e5", overflow: "hidden" }}>
          <div style={{ height: "100%", background: "#000", width: `${loadProgress}%`, transition: "width 0.3s ease-out" }} />
        </div>
      </div>

      <KeyboardControls map={KEYBOARD_MAP}>
        <div style={{ position: "absolute", inset: 0, touchAction: "none" }}>
          <Canvas
            camera={{ position: [0, 0, INITIAL_CAMERA_Z], fov: 60, near: 1, far: 500 }}
            dpr={dpr} flat
            gl={{ antialias: false, powerPreference: "high-performance" }}
            style={{ position: "absolute", inset: 0, touchAction: "none", background: "#ffffff" }}
          >
            <color attach="background" args={["#ffffff"]} />
            <fog attach="fog" args={["#ffffff", 120, 320]} />
            <SceneController media={images} />
          </Canvas>
        </div>
      </KeyboardControls>

      {/* UI overlay */}
      <style>{`
        @media (max-width: 639px) {
          .g-handle { left: 50% !important; transform: translateX(-50%); }
          .g-life { left: 50% !important; right: auto !important; transform: translateX(-50%); bottom: 60px !important; }
          .g-hints { left: 50% !important; transform: translateX(-50%); text-align: center; }
        }
      `}</style>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 10 }}>
        <Link href="/" prefetch={false} className="g-handle hover:text-[#f97316] transition-all"
          style={{ position: "absolute", top: "24px", left: "50%", transform: "translateX(-50%)", pointerEvents: "auto", fontSize: "0.8125rem", color: "#000", textDecoration: "none", letterSpacing: "0.05em", padding: "6px 14px", whiteSpace: "nowrap" }}>
          ←(@justtayyabkhan)
        </Link>
        <div className="g-life" style={{ position: "absolute", bottom: "24px", right: "28px", letterSpacing: "0.45em", fontSize: "1.25rem", color: "#000", userSelect: "none", textShadow: "0 0 6px #fff,0 0 10px #fff,0 0 14px #fff", whiteSpace: "nowrap" }}>
          L I F E
        </div>
        <div className="g-hints" style={{ position: "absolute", bottom: "24px", left: "28px", color: "#000", userSelect: "none", textShadow: "0 0 6px #fff,0 0 10px #fff,0 0 14px #fff", fontSize: "0.65rem", letterSpacing: "0.04em", lineHeight: "1.8", opacity: 0.75, whiteSpace: "nowrap" }}>
          {isTouch ? (
            <>
              <div>drag to &nbsp;<strong>navigate</strong></div>
              <div>pinch to &nbsp;<strong>zoom</strong></div>
            </>
          ) : (
            <>
              <div>drag &nbsp;or&nbsp; ↑↓←→ &nbsp;or&nbsp; WASD &nbsp;to&nbsp; <strong>navigate</strong></div>
              <div>scroll to &nbsp;<strong>zoom</strong></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
