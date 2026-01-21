"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";
import { useRef } from "react";

function SpinningCube(props: JSX.IntrinsicElements["mesh"]) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.x = t * 0.4;
      ref.current.rotation.y = t * 0.7;
    }
  });
  return (
    <mesh ref={ref} {...props}>
      <boxGeometry args={[1.4, 1.4, 1.4]} />
      <meshStandardMaterial
        color="#0EA5E9"
        metalness={0.85}
        roughness={0.15}
        emissive="#0EA5E9"
        emissiveIntensity={0.4}
      />
    </mesh>
  );
}

function OrbitingRing(props: JSX.IntrinsicElements["mesh"]) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.z = t * 0.7;
    }
  });
  return (
    <mesh ref={ref} {...props}>
      <ringGeometry args={[1.9, 2.1, 64]} />
      <meshBasicMaterial color="#F97316" wireframe />
    </mesh>
  );
}

export function ProjectsOrbit() {
  return (
    <div className="relative h-64 w-full overflow-hidden rounded-3xl border border-secondary/30 bg-gradient-to-br from-secondary/10 via-background to-primary/10 shadow-[0_0_60px_rgba(14,165,233,0.45)]">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 40 }}
        dpr={[1, 1.75]}
      >
        <color attach="background" args={["transparent"]} />
        <ambientLight intensity={0.25} />
        <directionalLight position={[4, 4, 6]} intensity={0.9} />

        <SpinningCube position={[0, 0, 0]} />
        <OrbitingRing rotation={[Math.PI / 3, 0, 0]} />

        <Environment preset="city" />
      </Canvas>
      <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_0%_0%,rgba(56,189,248,0.35),transparent_55%),radial-gradient(circle_at_100%_100%,rgba(249,115,22,0.32),transparent_55%)] mix-blend-soft-light" />
    </div>
  );
}

