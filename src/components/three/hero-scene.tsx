"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, extend, useFrame, useThree, type ThreeElement } from "@react-three/fiber";
import { Billboard, OrbitControls } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";
import * as THREE from "three";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import { LineSegments2 } from "three/addons/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/addons/lines/LineSegmentsGeometry.js";

extend({ LineSegments2, LineMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    lineSegments2: ThreeElement<typeof LineSegments2>;
    lineMaterial: ThreeElement<typeof LineMaterial>;
  }
}

type Palette = {
  line: string;
  glow: string;
  core: string;
  blending: THREE.Blending;
  particleOpacity: number;
  particleSize: number;
  density: number;
};

const darkPalette: Palette = {
  line: "#aec48f",
  glow: "#c5e86c",
  core: "#f4ffd0",
  blending: THREE.AdditiveBlending,
  particleOpacity: 0.88,
  particleSize: 1,
  density: 1,
};

const lightPalette: Palette = {
  line: "#6b705c",
  glow: "#6f7f3a",
  core: "#4a6829",
  blending: THREE.NormalBlending,
  particleOpacity: 0.82,
  particleSize: 1.25,
  density: 0.72,
};

function createWaveformRingGeometry(radius: number, ticks = 72) {
  const positions: number[] = [];
  for (let i = 0; i < ticks; i += 1) {
    const a = (i / ticks) * Math.PI * 2;
    const wave = 0.012 + Math.abs(Math.sin(i * 0.55)) * 0.038 + (i % 7 === 0 ? 0.02 : 0);
    const inner = radius - wave;
    const outer = radius + wave * 0.35;
    pushSeg(
      positions,
      Math.cos(a) * inner,
      Math.sin(a) * inner,
      0,
      Math.cos(a) * outer,
      Math.sin(a) * outer,
      0
    );
    if (i % 2 === 0) {
      const a1 = a + Math.PI * 2 / ticks;
      pushSeg(
        positions,
        Math.cos(a) * radius,
        Math.sin(a) * radius,
        0,
        Math.cos(a1) * radius,
        Math.sin(a1) * radius,
        0
      );
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  return geo;
}

function createReticleGeometry() {
  const positions: number[] = [];
  const arm = 0.05;
  const gap = 0.016;
  pushSeg(positions, -arm, 0, 0, -gap, 0, 0);
  pushSeg(positions, gap, 0, 0, arm, 0, 0);
  pushSeg(positions, 0, -arm, 0, 0, -gap, 0);
  pushSeg(positions, 0, gap, 0, 0, arm, 0);

  for (let i = 0; i < 16; i += 1) {
    if (i % 4 === 0) continue;
    const a = (i / 16) * Math.PI * 2;
    const inner = 0.02;
    const outer = i % 2 === 0 ? 0.042 : 0.032;
    pushSeg(
      positions,
      Math.cos(a) * inner,
      Math.sin(a) * inner,
      0,
      Math.cos(a) * outer,
      Math.sin(a) * outer,
      0
    );
  }

  const x0 = 0.1;
  const x1 = 0.76;
  const y0 = -0.075;
  const y1 = 0.075;
  const b = 0.048;
  pushSeg(positions, x0, y1, 0, x0 + b, y1, 0);
  pushSeg(positions, x0, y1, 0, x0, y1 - b, 0);
  pushSeg(positions, x1, y1, 0, x1 - b, y1, 0);
  pushSeg(positions, x1, y1, 0, x1, y1 - b, 0);
  pushSeg(positions, x0, y0, 0, x0 + b, y0, 0);
  pushSeg(positions, x0, y0, 0, x0, y0 + b, 0);
  pushSeg(positions, x1, y0, 0, x1 - b, y0, 0);
  pushSeg(positions, x1, y0, 0, x1, y0 + b, 0);

  const dash = 0.026;
  const skip = 0.014;
  let x = 0.04;
  while (x < x0 - 0.01) {
    pushSeg(positions, x, 0, 0, Math.min(x + dash, x0 - 0.01), 0, 0);
    x += dash + skip;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  return geo;
}

const RING_ORBITS = [
  { radius: 1.28, seed: 1, rot: [Math.PI / 2, 0.05, 0] as const, spin: [0.04, 0.11, 0.21] as const },
  { radius: 1.38, seed: 2, rot: [0, 0, 0] as const, spin: [-0.19, 0.05, 0.07] as const },
  { radius: 1.48, seed: 3, rot: [0, Math.PI / 2, 0] as const, spin: [0.08, -0.22, 0.05] as const },
  { radius: 1.58, seed: 4, rot: [0.85, 0.4, 0.18] as const, spin: [-0.06, 0.16, -0.14] as const },
  { radius: 1.68, seed: 5, rot: [1.1, -0.35, 0.6] as const, spin: [0.13, -0.09, 0.18] as const },
];

const ORBIT_NODES = [0.55, 2.3, 4.15];

const HUD_LABELS = [
  { text: "SYSTEM ACTIVE", radius: 1.46, angle: 0.35 },
  { text: "CORE: 99%", radius: 1.52, angle: 2.15 },
  { text: "SYS_LOAD: LOW", radius: 1.6, angle: 4.05 },
];

const RING_OPACITY = [0.62, 0.48, 0.4, 0.34, 0.28] as const;
const RING_OPACITY_LIGHT = [0.96, 0.88, 0.8, 0.7, 0.6] as const;

function fibonacciPositions(count: number, radius: number) {
  const positions = new Float32Array(count * 3);
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i += 1) {
    const y = 1 - (i / Math.max(count - 1, 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = phi * i;
    positions[i * 3] = Math.cos(theta) * r * radius;
    positions[i * 3 + 1] = y * radius;
    positions[i * 3 + 2] = Math.sin(theta) * r * radius;
  }
  return positions;
}

function pushSeg(out: number[], ax: number, ay: number, az: number, bx: number, by: number, bz: number) {
  out.push(ax, ay, az, bx, by, bz);
}

function HudLines({
  geometry,
  color,
  opacity,
  blending,
  fat = false,
  width = 1.85,
}: {
  geometry: THREE.BufferGeometry;
  color: string;
  opacity: number;
  blending: THREE.Blending;
  fat?: boolean;
  width?: number;
}) {
  const size = useThree((state) => state.size);
  const fatGeometry = useMemo(() => {
    if (!fat) return null;
    const next = new LineSegmentsGeometry();
    const position = geometry.getAttribute("position");
    next.setPositions(position.array as Float32Array);
    return next;
  }, [fat, geometry]);

  useEffect(() => () => fatGeometry?.dispose(), [fatGeometry]);

  if (fat && fatGeometry) {
    return (
      <lineSegments2 geometry={fatGeometry}>
        <lineMaterial
          color={color}
          transparent
          opacity={opacity}
          depthWrite={false}
          linewidth={width}
          resolution={[size.width, size.height]}
          toneMapped={false}
        />
      </lineSegments2>
    );
  }

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={blending}
        toneMapped={false}
      />
    </lineSegments>
  );
}

function createTechRingGeometry(radius: number, seed: number, sparse = false) {
  const positions: number[] = [];
  const arcCount = sparse ? 6 : 9 + (seed % 4);

  for (let i = 0; i < arcCount; i += 1) {
    if ((i + seed) % (sparse ? 3 : 6) === 0) continue;
    const start = (i / arcCount) * Math.PI * 2 + seed * 0.17;
    const span = ((0.42 + ((i * 13 + seed) % 8) / 22) * Math.PI * 2) / arcCount;
    const offset = sparse ? 0 : ((i + seed) % 3) * 0.012;
    const r = radius + offset;
    const steps = sparse ? 10 : 14;
    for (let s = 0; s < steps; s += 1) {
      const t0 = start + (span * s) / steps;
      const t1 = start + (span * (s + 1)) / steps;
      pushSeg(
        positions,
        Math.cos(t0) * r,
        Math.sin(t0) * r,
        0,
        Math.cos(t1) * r,
        Math.sin(t1) * r,
        0
      );
    }

    if (!sparse && i % 2 === 0) {
      const inner = r - 0.028;
      for (let s = 0; s < steps; s += 1) {
        const t0 = start + (span * s) / steps;
        const t1 = start + (span * (s + 1)) / steps;
        pushSeg(
          positions,
          Math.cos(t0) * inner,
          Math.sin(t0) * inner,
          0,
          Math.cos(t1) * inner,
          Math.sin(t1) * inner,
          0
        );
      }
      const mid = start + span * 0.5;
      pushSeg(
        positions,
        Math.cos(mid) * inner,
        Math.sin(mid) * inner,
        0,
        Math.cos(mid) * r,
        Math.sin(mid) * r,
        0
      );
    }
  }

  const ticks = sparse ? 20 : 40 + seed * 3;
  for (let i = 0; i < ticks; i += 1) {
    if ((i + seed) % (sparse ? 3 : 8) === 0) continue;
    const a = (i / ticks) * Math.PI * 2;
    const long = i % 5 === 0;
    const inner = radius - (long ? 0.07 : 0.03);
    const outer = radius + (long ? 0.05 : 0.018);
    pushSeg(
      positions,
      Math.cos(a) * inner,
      Math.sin(a) * inner,
      0,
      Math.cos(a) * outer,
      Math.sin(a) * outer,
      0
    );
  }

  if (!sparse) {
    const teeth = 18 + seed;
    for (let i = 0; i < teeth; i += 1) {
      if ((i + seed) % 3 === 0) continue;
      const a = (i / teeth) * Math.PI * 2 + 0.04;
      const w = 0.035;
      const a0 = a - w / radius;
      const a1 = a + w / radius;
      const outer = radius + 0.055;
      pushSeg(positions, Math.cos(a0) * radius, Math.sin(a0) * radius, 0, Math.cos(a0) * outer, Math.sin(a0) * outer, 0);
      pushSeg(positions, Math.cos(a1) * radius, Math.sin(a1) * radius, 0, Math.cos(a1) * outer, Math.sin(a1) * outer, 0);
      pushSeg(positions, Math.cos(a0) * outer, Math.sin(a0) * outer, 0, Math.cos(a1) * outer, Math.sin(a1) * outer, 0);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  return geo;
}

function ParticleField({
  count,
  radius,
  color,
  size,
  opacity,
  blending,
}: {
  count: number;
  radius: number;
  color: string;
  size: number;
  opacity: number;
  blending: THREE.Blending;
}) {
  const positions = useMemo(() => fibonacciPositions(count, radius), [count, radius]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={size}
        sizeAttenuation
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={blending}
        toneMapped={false}
      />
    </points>
  );
}

function GeodesicShell({
  radius,
  detail,
  color,
  opacity,
  blending,
  fat = false,
}: {
  radius: number;
  detail: number;
  color: string;
  opacity: number;
  blending: THREE.Blending;
  fat?: boolean;
}) {
  const geometry = useMemo(() => {
    const source = new THREE.IcosahedronGeometry(radius, detail);
    const wire = new THREE.WireframeGeometry(source);
    source.dispose();
    return wire;
  }, [detail, radius]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <HudLines geometry={geometry} color={color} opacity={opacity} blending={blending} fat={fat} width={1.35} />
  );
}

function TechRingMesh({
  radius,
  seed,
  color,
  opacity,
  blending,
  fat = false,
}: {
  radius: number;
  seed: number;
  color: string;
  opacity: number;
  blending: THREE.Blending;
  fat?: boolean;
}) {
  const geometry = useMemo(() => createTechRingGeometry(radius, seed), [radius, seed]);
  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <HudLines geometry={geometry} color={color} opacity={opacity} blending={blending} fat={fat} width={2} />
  );
}

function WaveformRing({
  radius,
  color,
  opacity,
  blending,
  ticks = 72,
  fat = false,
}: {
  radius: number;
  color: string;
  opacity: number;
  blending: THREE.Blending;
  ticks?: number;
  fat?: boolean;
}) {
  const geometry = useMemo(() => createWaveformRingGeometry(radius, ticks), [radius, ticks]);
  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <HudLines geometry={geometry} color={color} opacity={opacity} blending={blending} fat={fat} width={1.7} />
  );
}

function HudLabel({
  text,
  color,
  blending,
  emphasis = false,
}: {
  text: string;
  color: string;
  blending: THREE.Blending;
  emphasis?: boolean;
}) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 768;
    canvas.height = 96;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.clearRect(0, 0, 768, 96);
    ctx.font = emphasis
      ? "700 40px ui-monospace, SFMono-Regular, Menlo, monospace"
      : "600 28px ui-monospace, SFMono-Regular, Menlo, monospace";
    ctx.fillStyle = color;
    ctx.textBaseline = "middle";
    ctx.fillText(text, 16, 48);
    const map = new THREE.CanvasTexture(canvas);
    map.colorSpace = THREE.SRGBColorSpace;
    map.needsUpdate = true;
    return map;
  }, [color, emphasis, text]);

  const reticle = useMemo(() => createReticleGeometry(), []);

  useEffect(
    () => () => {
      texture?.dispose();
      reticle.dispose();
    },
    [reticle, texture]
  );

  if (!texture) return null;

  return (
    <Billboard follow>
      <HudLines
        geometry={reticle}
        color={color}
        opacity={emphasis ? 1 : 0.82}
        blending={blending}
        fat={emphasis}
        width={1.6}
      />
      <mesh>
        <octahedronGeometry args={[emphasis ? 0.03 : 0.022, 0]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={1}
          depthWrite={false}
          blending={blending}
          wireframe
          toneMapped={false}
        />
      </mesh>
      <sprite position={[emphasis ? 0.52 : 0.43, 0, 0]} scale={emphasis ? [1.12, 0.15, 1] : [0.78, 0.1, 1]}>
        <spriteMaterial
          map={texture}
          transparent
          depthWrite={false}
          blending={blending}
          toneMapped={false}
        />
      </sprite>
    </Billboard>
  );
}

function OrbitingDataNode({
  color,
  blending,
  reducedMotion,
  opacity = 0.85,
}: {
  color: string;
  blending: THREE.Blending;
  reducedMotion: boolean;
  opacity?: number;
}) {
  const spin = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (reducedMotion || !spin.current) return;
    const t = state.clock.elapsedTime;
    spin.current.rotation.x = t * 1.9;
    spin.current.rotation.y = t * 1.35;
  });

  return (
    <group ref={spin}>
      <mesh>
        <octahedronGeometry args={[0.034, 0]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={opacity}
          depthWrite={false}
          blending={blending}
          wireframe
          toneMapped={false}
        />
      </mesh>
      <mesh>
        <octahedronGeometry args={[0.018, 0]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={opacity * 0.65}
          depthWrite={false}
          blending={blending}
          wireframe
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function JarvisSphere({ palette, reducedMotion }: { palette: Palette; reducedMotion: boolean }) {
  const tilt = useRef<THREE.Group>(null);
  const coreLayer = useRef<THREE.Group>(null);
  const midLayer = useRef<THREE.Group>(null);
  const outerLayer = useRef<THREE.Group>(null);
  const shells = useRef<THREE.Group>(null);
  const shellLayers = useRef<THREE.Group[]>([]);
  const coreGroup = useRef<THREE.Group>(null);
  const energyRing = useRef<THREE.Group>(null);
  const coreNodes = useRef<THREE.Mesh[]>([]);
  const rings = useRef<THREE.Group[]>([]);
  const mouse = useRef({ x: 0, y: 0 });
  const smoothed = useRef({ x: 0, y: 0 });
  const additive = palette.blending === THREE.AdditiveBlending;
  const size = palette.particleSize;
  const density = palette.density;
  const opacities = additive ? RING_OPACITY : RING_OPACITY_LIGHT;
  const corePulse = additive
    ? { base: 0.52, amp: 0.28, speed: 2.15 }
    : { base: 0.88, amp: 0.08, speed: 1.7 };

  useEffect(() => {
    const setPointer = (x: number, y: number) => {
      mouse.current.x = (x / window.innerWidth) * 2 - 1;
      mouse.current.y = -(y / window.innerHeight) * 2 + 1;
    };
    const onMouseMove = (event: MouseEvent) => setPointer(event.clientX, event.clientY);
    const onTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (touch) setPointer(touch.clientX, touch.clientY);
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  useFrame((state, delta) => {
    if (reducedMotion) return;
    const t = state.clock.elapsedTime;

    smoothed.current.x = THREE.MathUtils.damp(smoothed.current.x, mouse.current.x, 2.8, delta);
    smoothed.current.y = THREE.MathUtils.damp(smoothed.current.y, mouse.current.y, 2.8, delta);

    const px = smoothed.current.x;
    const py = smoothed.current.y;
    const depth = Math.hypot(px, py);

    if (tilt.current) {
      tilt.current.rotation.y = px * 0.48;
      tilt.current.rotation.x = py * 0.32;
      tilt.current.position.set(px * 0.06, py * 0.04, -depth * 0.14);
    }
    if (coreLayer.current) {
      coreLayer.current.position.set(px * 0.16, py * 0.1, -py * 0.12);
    }
    if (midLayer.current) {
      midLayer.current.position.set(px * 0.08, py * 0.05, -depth * 0.06);
    }
    if (outerLayer.current) {
      outerLayer.current.position.set(px * 0.03, py * 0.02, depth * 0.05);
    }

    if (shells.current) {
      shells.current.rotation.y = t * 0.1;
      shells.current.scale.setScalar(1 + Math.sin(t * 1.15) * 0.014);
    }

    shellLayers.current.forEach((shell, index) => {
      if (!shell) return;
      shell.rotation.x = Math.sin(t * (1.55 + index * 0.38) + index) * 0.03;
      shell.rotation.z = Math.cos(t * (1.28 + index * 0.31) + index * 1.4) * 0.024;
      shell.rotation.y = t * (0.07 + index * 0.025);
    });

    rings.current.forEach((ring, index) => {
      if (!ring) return;
      const orbit = RING_ORBITS[index];
      if (!orbit) return;
      ring.rotation.set(
        orbit.rot[0] + t * orbit.spin[0],
        orbit.rot[1] + t * orbit.spin[1],
        orbit.rot[2] + t * orbit.spin[2]
      );
      ring.position.y = Math.sin(t * (0.65 + index * 0.21) + index) * 0.028;
    });

    if (coreGroup.current) {
      coreGroup.current.rotation.y = t * 0.55;
      coreGroup.current.rotation.x = Math.sin(t * 0.8) * 0.12;
    }

    if (energyRing.current) {
      energyRing.current.rotation.z = t * 0.42;
      energyRing.current.rotation.x = Math.sin(t * 0.9) * 0.18;
      energyRing.current.scale.setScalar(1 + Math.sin(t * 1.7) * 0.045);
    }

    coreNodes.current.forEach((mesh, index) => {
      if (!mesh) return;
      const phase = index * 1.05;
      const pulse = 1 + Math.sin(t * 1.85 + phase) * (0.12 + index * 0.028);
      mesh.scale.setScalar(pulse);
      const mat = mesh.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = additive
          ? 0.52 + Math.sin(t * corePulse.speed + phase) * corePulse.amp
          : Math.max(0.55, 0.92 - index * 0.1) + Math.sin(t * corePulse.speed + phase) * corePulse.amp;
      }
    });
  });

  const setRing = (index: number) => (node: THREE.Group | null) => {
    if (node) rings.current[index] = node;
  };

  const setShell = (index: number) => (node: THREE.Group | null) => {
    if (node) shellLayers.current[index] = node;
  };

  const setCoreNode = (index: number) => (node: THREE.Mesh | null) => {
    if (node) coreNodes.current[index] = node;
  };

  return (
    <group ref={tilt}>
      <group ref={coreLayer}>
        <group ref={coreGroup}>
          {[0.045, 0.075, 0.11, 0.155].map((radius, index) => (
            <mesh key={radius} ref={setCoreNode(index)}>
              <sphereGeometry args={[radius, 18, 18]} />
              <meshBasicMaterial
                color={index % 2 === 0 ? palette.core : palette.glow}
                transparent
                opacity={additive ? 0.85 : 0.92 - index * 0.12}
                depthWrite={!additive && index === 0}
                blending={palette.blending}
                toneMapped={false}
              />
            </mesh>
          ))}
          <ParticleField
            count={Math.round(180 * density)}
            radius={0.2}
            color={palette.core}
            size={0.016 * size}
            opacity={palette.particleOpacity}
            blending={palette.blending}
          />
        </group>
        <group ref={energyRing} rotation={[Math.PI / 2, 0, 0]}>
          <WaveformRing
            radius={0.26}
            color={additive ? palette.glow : palette.core}
            opacity={additive ? 0.7 : 0.92}
            blending={palette.blending}
            fat={!additive}
          />
        </group>
      </group>

      <group ref={midLayer}>
        <ParticleField
          count={Math.round(320 * density)}
          radius={0.42}
          color={palette.glow}
          size={0.014 * size}
          opacity={palette.particleOpacity}
          blending={palette.blending}
        />
        <ParticleField
          count={Math.round(480 * density)}
          radius={0.72}
          color={palette.line}
          size={0.013 * size}
          opacity={palette.particleOpacity * 0.9}
          blending={palette.blending}
        />
        <ParticleField
          count={Math.round(360 * density)}
          radius={1.02}
          color={palette.glow}
          size={0.011 * size}
          opacity={palette.particleOpacity * 0.72}
          blending={palette.blending}
        />

        <group ref={shells}>
          <group ref={setShell(0)}>
            <GeodesicShell
              radius={0.56}
              detail={additive ? 2 : 1}
              color={additive ? palette.glow : palette.core}
              opacity={additive ? 0.28 : 0.55}
              blending={palette.blending}
              fat={!additive}
            />
          </group>
          <group ref={setShell(1)}>
            <GeodesicShell
              radius={0.84}
              detail={additive ? 2 : 1}
              color={additive ? palette.line : palette.glow}
              opacity={additive ? 0.22 : 0.42}
              blending={palette.blending}
              fat={!additive}
            />
          </group>
          <group ref={setShell(2)}>
            <GeodesicShell
              radius={1.1}
              detail={additive ? 2 : 1}
              color={palette.line}
              opacity={additive ? 0.16 : 0.32}
              blending={palette.blending}
              fat={!additive}
            />
          </group>
        </group>
      </group>

      <group ref={outerLayer}>
        <ParticleField
          count={Math.round(220 * density)}
          radius={1.22}
          color={palette.line}
          size={0.01 * size}
          opacity={palette.particleOpacity * 0.55}
          blending={palette.blending}
        />

        {RING_ORBITS.map((ring, index) => (
          <group key={ring.seed} ref={setRing(index)} rotation={[...ring.rot]}>
            <TechRingMesh
              radius={ring.radius}
              seed={ring.seed}
              color={index % 2 === 0 ? (additive ? palette.glow : palette.core) : palette.glow}
              opacity={opacities[index] ?? 0.3}
              blending={palette.blending}
              fat={!additive}
            />
            {index === 1
              ? ORBIT_NODES.map((angle) => (
                  <group
                    key={angle}
                    position={[Math.cos(angle) * ring.radius, Math.sin(angle) * ring.radius, 0]}
                  >
                    <OrbitingDataNode
                      color={additive ? palette.glow : palette.core}
                      blending={palette.blending}
                      reducedMotion={reducedMotion}
                      opacity={additive ? 0.85 : 1}
                    />
                  </group>
                ))
              : null}
            {index === 2
              ? HUD_LABELS.map((label) => (
                  <group
                    key={label.text}
                    position={[
                      Math.cos(label.angle) * label.radius,
                      Math.sin(label.angle) * label.radius,
                      0,
                    ]}
                  >
                    <HudLabel
                      text={label.text}
                      color={additive ? palette.glow : palette.core}
                      blending={palette.blending}
                      emphasis={!additive}
                    />
                  </group>
                ))
              : null}
          </group>
        ))}
      </group>
    </group>
  );
}

export default function HeroScene() {
  const reduce = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";
  const palette = isDark ? darkPalette : lightPalette;

  return (
    <div className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 5.4], fov: 40, near: 0.1, far: 40 }}
        dpr={isDark ? [1, 1.25] : [1, 1.75]}
        gl={{
          alpha: true,
          antialias: true,
          premultipliedAlpha: false,
          powerPreference: "default",
          failIfMajorPerformanceCaveat: false,
        }}
        style={{ touchAction: "pan-y", pointerEvents: "none" }}
        frameloop={reduce ? "demand" : "always"}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(0x000000, 0);
          scene.background = null;
          gl.domElement.style.touchAction = "pan-y";
          gl.domElement.style.pointerEvents = "none";
        }}
      >
        <JarvisSphere palette={palette} reducedMotion={!!reduce} />
        {!reduce ? (
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={false}
            enableDamping={false}
            autoRotate
            autoRotateSpeed={0.8}
          />
        ) : null}
        {!reduce && isDark ? (
          <EffectComposer enableNormalPass={false} multisampling={0} stencilBuffer={false}>
            <Bloom intensity={1.65} luminanceThreshold={0.18} mipmapBlur />
          </EffectComposer>
        ) : null}
      </Canvas>
    </div>
  );
}
