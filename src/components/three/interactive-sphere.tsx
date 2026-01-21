"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function InteractiveSphere() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const sphereRef = useRef<THREE.Mesh | null>(null);
  const wireframeRef = useRef<THREE.Mesh | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);

  // Watch for theme changes (using next-themes `class="dark"`)
  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
    };

    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Main Three.js setup
  useEffect(() => {
    if (!containerRef.current || !mounted) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const getSphereSize = () => {
      const width = containerRef.current?.clientWidth || window.innerWidth;
      if (width < 640) return 1.2;
      if (width < 1024) return 1.5;
      if (width < 1920) return 1.8;
      if (width < 2560) return 2.2;
      return 2.8;
    };

    const getCameraDistance = () => {
      const width = containerRef.current?.clientWidth || window.innerWidth;
      if (width < 640) return 5;
      if (width < 1024) return 5.5;
      if (width < 1920) return 6;
      if (width < 2560) return 7;
      return 8;
    };

    const sphereSize = getSphereSize();
    const cameraDistance = getCameraDistance();

    const camera = new THREE.PerspectiveCamera(
      50,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, cameraDistance);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const getColors = () => {
      const isDark = theme === "dark";
      return {
        primary: isDark ? 0xa855f7 : 0xcb4b16,
        secondary: isDark ? 0xfacc15 : 0x2aa198,
      };
    };

    const colors = getColors();

    const getGeometryDetail = () => {
      const width = containerRef.current?.clientWidth || window.innerWidth;
      if (width < 640) return { outer: 32, inner: 24 };
      if (width < 1024) return { outer: 48, inner: 32 };
      if (width < 1920) return { outer: 64, inner: 40 };
      if (width < 2560) return { outer: 80, inner: 50 };
      return { outer: 100, inner: 60 };
    };

    const detail = getGeometryDetail();

    const sphereGeometry = new THREE.SphereGeometry(
      sphereSize,
      detail.outer,
      detail.outer
    );
    const sphereMaterial = new THREE.MeshStandardMaterial({
      color: colors.primary,
      metalness: 0.9,
      roughness: 0.1,
      transparent: true,
      opacity: 0.35,
      emissive: colors.primary,
      emissiveIntensity: 0.6,
      wireframe: true,
    });

    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphereRef.current = sphere;
    scene.add(sphere);

    const innerSize = sphereSize * 0.88;
    const innerGeometry = new THREE.SphereGeometry(
      innerSize,
      detail.inner,
      detail.inner
    );
    const innerMaterial = new THREE.MeshBasicMaterial({
      color: colors.secondary,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const innerSphere = new THREE.Mesh(innerGeometry, innerMaterial);
    wireframeRef.current = innerSphere;
    scene.add(innerSphere);

    const getParticleCount = () => {
      const width = containerRef.current?.clientWidth || window.innerWidth;
      if (width < 640) return 150;
      if (width < 1024) return 200;
      if (width < 1920) return 300;
      if (width < 2560) return 400;
      return 500;
    };

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = getParticleCount();
    const positions = new Float32Array(particlesCount * 3);
    const sizes = new Float32Array(particlesCount);
    const particleRadius = sphereSize * 1.4 + Math.random() * sphereSize * 0.6;

    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;
      const radius = particleRadius + Math.random() * sphereSize * 0.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      const baseSize = window.innerWidth < 640 ? 0.02 : 0.03;
      sizes[i] = Math.random() * baseSize + baseSize * 0.5;
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    particlesGeometry.setAttribute(
      "size",
      new THREE.BufferAttribute(sizes, 1)
    );

    const particlesMaterial = new THREE.PointsMaterial({
      color: colors.secondary,
      size: window.innerWidth < 640 ? 0.08 : 0.1,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    particlesRef.current = particles;
    scene.add(particles);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(colors.primary, 2.5, 100);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(colors.secondary, 2, 100);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    const rimLight = new THREE.DirectionalLight(colors.primary, 0.8);
    rimLight.position.set(0, 0, -5);
    scene.add(rimLight);

    const mouse = new THREE.Vector2(0, 0);
    const targetRotation = new THREE.Vector2(0, 0);
    const currentRotation = new THREE.Vector2(0, 0);
    let mouseMoved = false;

    const handleMouseMove = (event: MouseEvent) => {
      mouseMoved = true;
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      targetRotation.x = mouse.y * 0.6;
      targetRotation.y = mouse.x * 0.6;
    };

    const handleMouseLeave = () => {
      mouseMoved = false;
      targetRotation.x = 0;
      targetRotation.y = 0;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    const clock = new THREE.Clock();
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      const lerpFactor = mouseMoved ? 0.08 : 0.03;
      currentRotation.x += (targetRotation.x - currentRotation.x) * lerpFactor;
      currentRotation.y += (targetRotation.y - currentRotation.y) * lerpFactor;

      sphere.rotation.x = currentRotation.x;
      sphere.rotation.y = currentRotation.y;
      innerSphere.rotation.x = currentRotation.x * 0.7;
      innerSphere.rotation.y = currentRotation.y * 0.7;

      sphere.rotation.z += 0.002;
      innerSphere.rotation.z -= 0.0015;

      const breathingScale = 1 + Math.sin(elapsedTime * 0.4) * 0.05;
      sphere.scale.set(breathingScale, breathingScale, breathingScale);
      innerSphere.scale.set(
        breathingScale * 0.9,
        breathingScale * 0.9,
        breathingScale * 0.9
      );

      particles.rotation.y += 0.0008;
      particles.rotation.x += 0.0005;

      camera.position.x += (mouse.x * 0.4 - camera.position.x) * 0.03;
      camera.position.y += (mouse.y * 0.4 - camera.position.y) * 0.03;
      camera.lookAt(scene.position);

      const newColors = getColors();
      (sphereMaterial as THREE.MeshStandardMaterial).color.setHex(
        newColors.primary
      );
      (sphereMaterial as THREE.MeshStandardMaterial).emissive.setHex(
        newColors.primary
      );
      (sphereMaterial as THREE.MeshStandardMaterial).emissiveIntensity = 0.6;
      (innerMaterial as THREE.MeshBasicMaterial).color.setHex(
        newColors.secondary
      );
      (particlesMaterial as THREE.PointsMaterial).color.setHex(
        newColors.secondary
      );
      pointLight1.color.setHex(newColors.primary);
      pointLight2.color.setHex(newColors.secondary);
      rimLight.color.setHex(newColors.primary);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return;

      const newSphereSize = getSphereSize();
      const newCameraDistance = getCameraDistance();
      const newDetail = getGeometryDetail();

      camera.aspect =
        containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.position.z = newCameraDistance;
      camera.updateProjectionMatrix();
      renderer.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      );

      if (Math.abs(newSphereSize - sphereSize) > 0.3) {
        const newGeometry = new THREE.SphereGeometry(
          newSphereSize,
          newDetail.outer,
          newDetail.outer
        );
        sphere.geometry.dispose();
        sphere.geometry = newGeometry;

        const newInnerGeometry = new THREE.SphereGeometry(
          newSphereSize * 0.88,
          newDetail.inner,
          newDetail.inner
        );
        innerSphere.geometry.dispose();
        innerSphere.geometry = newInnerGeometry;
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      sphereGeometry.dispose();
      sphereMaterial.dispose();
      innerGeometry.dispose();
      innerMaterial.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();

      scene.clear();

      if (
        rendererRef.current &&
        containerRef.current &&
        renderer.domElement.parentNode
      ) {
        renderer.domElement.remove();
        renderer.dispose();
      }
    };
  }, [theme, mounted]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}

