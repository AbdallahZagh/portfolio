"use client";

import { Component, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";
import * as THREE from "three";

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
  particleOpacity: 0.85,
  particleSize: 1,
  density: 1,
};

const lightPalette: Palette = {
  line: "#6b705c",
  glow: "#6f7f3a",
  core: "#4a6829",
  blending: THREE.NormalBlending,
  particleOpacity: 0.42,
  particleSize: 0.8,
  density: 0.52,
};

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

function WireSphere({
  radius,
  color,
  detail = 24,
  opacity = 0.28,
  blending,
}: {
  radius: number;
  color: string;
  detail?: number;
  opacity?: number;
  blending: THREE.Blending;
}) {
  const geometry = useMemo(() => {
    const source = new THREE.SphereGeometry(radius, detail, Math.max(12, Math.floor(detail / 2)));
    const wire = new THREE.WireframeGeometry(source);
    source.dispose();
    return wire;
  }, [detail, radius]);

  useEffect(() => () => geometry.dispose(), [geometry]);

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

function TechRing({
  radius,
  color,
  opacity = 0.55,
  blending,
}: {
  radius: number;
  color: string;
  opacity?: number;
  blending: THREE.Blending;
}) {
  return (
    <mesh>
      <torusGeometry args={[radius, 0.006, 8, 160]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={blending}
        toneMapped={false}
      />
    </mesh>
  );
}

function JarvisSphere({ palette, reducedMotion }: { palette: Palette; reducedMotion: boolean }) {
  const tilt = useRef<THREE.Group>(null);
  const ringX = useRef<THREE.Group>(null);
  const ringY = useRef<THREE.Group>(null);
  const ringZ = useRef<THREE.Group>(null);
  const core = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const smoothed = useRef({ x: 0, y: 0 });
  const additive = palette.blending === THREE.AdditiveBlending;
  const size = palette.particleSize;
  const density = palette.density;

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((state, delta) => {
    if (reducedMotion) return;
    const t = state.clock.elapsedTime;

    smoothed.current.x = THREE.MathUtils.damp(smoothed.current.x, mouse.current.x, 3.5, delta);
    smoothed.current.y = THREE.MathUtils.damp(smoothed.current.y, mouse.current.y, 3.5, delta);

    if (tilt.current) {
      tilt.current.rotation.y = smoothed.current.x * 0.35;
      tilt.current.rotation.x = smoothed.current.y * 0.22;
    }
    if (ringX.current) ringX.current.rotation.x = t * 0.35;
    if (ringY.current) ringY.current.rotation.y = t * 0.28;
    if (ringZ.current) ringZ.current.rotation.z = t * 0.42;
    if (core.current) {
      const pulse = 1 + Math.sin(t * 2.4) * 0.12;
      core.current.scale.setScalar(pulse);
      core.current.children.forEach((child) => {
        const mat = (child as THREE.Points).material as THREE.PointsMaterial | undefined;
        if (mat && "opacity" in mat) {
          mat.opacity = additive
            ? 0.7 + Math.sin(t * 2.4) * 0.25
            : 0.4 + Math.sin(t * 2.4) * 0.08;
        }
      });
    }
  });

  return (
    <group ref={tilt}>
      <group ref={core}>
        <mesh>
          <sphereGeometry args={[0.08, 24, 24]} />
          <meshBasicMaterial
            color={palette.core}
            transparent
            opacity={additive ? 0.95 : 0.72}
            depthWrite={false}
            blending={palette.blending}
            toneMapped={false}
          />
        </mesh>
        <ParticleField
          count={Math.round(220 * density)}
          radius={0.22}
          color={palette.core}
          size={0.018 * size}
          opacity={palette.particleOpacity}
          blending={palette.blending}
        />
      </group>

      <ParticleField
        count={Math.round(420 * density)}
        radius={0.62}
        color={palette.glow}
        size={0.016 * size}
        opacity={palette.particleOpacity}
        blending={palette.blending}
      />
      <ParticleField
        count={Math.round(560 * density)}
        radius={0.92}
        color={palette.line}
        size={0.014 * size}
        opacity={palette.particleOpacity * 0.85}
        blending={palette.blending}
      />
      <ParticleField
        count={Math.round(380 * density)}
        radius={1.18}
        color={palette.glow}
        size={0.012 * size}
        opacity={palette.particleOpacity * 0.7}
        blending={palette.blending}
      />

      <WireSphere
        radius={0.62}
        color={palette.line}
        detail={additive ? 20 : 12}
        opacity={additive ? 0.22 : 0.32}
        blending={palette.blending}
      />
      <WireSphere
        radius={0.92}
        color={palette.glow}
        detail={additive ? 28 : 14}
        opacity={additive ? 0.2 : 0.26}
        blending={palette.blending}
      />
      <WireSphere
        radius={1.18}
        color={palette.line}
        detail={additive ? 24 : 12}
        opacity={additive ? 0.16 : 0.2}
        blending={palette.blending}
      />

      <group ref={ringX} rotation={[Math.PI / 2, 0, 0]}>
        <TechRing radius={1.32} color={palette.glow} opacity={additive ? 0.7 : 0.5} blending={palette.blending} />
      </group>
      <group ref={ringY} rotation={[0.4, 0.2, 0.1]}>
        <TechRing radius={1.42} color={palette.line} opacity={additive ? 0.45 : 0.32} blending={palette.blending} />
      </group>
      <group ref={ringZ} rotation={[-0.5, 0.8, 0.3]}>
        <TechRing radius={1.52} color={palette.glow} opacity={additive ? 0.35 : 0.22} blending={palette.blending} />
      </group>
    </group>
  );
}

class WebGLGuard extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

export default function HeroScene() {
  const reduce = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";
  const palette = isDark ? darkPalette : lightPalette;
  const [blocked, setBlocked] = useState(false);

  if (blocked) return null;

  return (
    <div className="absolute inset-0 h-full w-full" aria-hidden>
      <WebGLGuard>
        <Canvas
          camera={{ position: [0, 0, 5.1], fov: 40, near: 0.1, far: 40 }}
          dpr={[1, 1.25]}
          gl={{
            alpha: true,
            antialias: true,
            premultipliedAlpha: false,
            powerPreference: "default",
            failIfMajorPerformanceCaveat: false,
          }}
          frameloop={reduce ? "demand" : "always"}
          onCreated={({ gl, scene }) => {
            gl.setClearColor(0x000000, 0);
            scene.background = null;
            const canvas = gl.domElement;
            const onLost = (event: Event) => {
              event.preventDefault();
              setBlocked(true);
            };
            canvas.addEventListener("webglcontextlost", onLost, { once: true });
          }}
        >
          <JarvisSphere palette={palette} reducedMotion={!!reduce} />
          {!reduce ? (
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              enableRotate={false}
              autoRotate
              autoRotateSpeed={0.8}
            />
          ) : null}
        </Canvas>
      </WebGLGuard>
    </div>
  );
}
