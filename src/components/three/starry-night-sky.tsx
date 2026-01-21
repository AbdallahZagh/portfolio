"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function StarryNightSky() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const starsRef = useRef<THREE.Points[]>([]);
  const opacityAttributesRef = useRef<THREE.BufferAttribute[]>([]);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);

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

  useEffect(() => {
    if (!containerRef.current || !mounted) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

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

    const isDark = theme === "dark";
    const starColor = isDark ? 0xffffff : 0x93a1a1;
    const brightStarColor = isDark ? 0xfacc15 : 0xcb4b16;

    // Responsive star count
    const getStarCount = () => {
      const width = containerRef.current?.clientWidth || window.innerWidth;
      if (width < 640) return 800;
      if (width < 1024) return 1200;
      if (width < 1920) return 1500;
      return 2000;
    };

    const starCount = getStarCount();

    // Create multiple layers of stars for depth
    const createStarLayer = (
      count: number,
      radius: number,
      size: number,
      color: number,
      layerIndex: number
    ) => {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      const sizes = new Float32Array(count);
      const opacities = new Float32Array(count);
      const colors = new Float32Array(count * 3);

      const colorObj = new THREE.Color(color);

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;

        // Random position on sphere
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        const r = radius + (Math.random() - 0.5) * radius * 0.2;

        positions[i3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = r * Math.cos(phi);

        // Random size - larger for visibility
        sizes[i] = size * (1 + Math.random() * 2);

        // Random initial opacity for twinkling - brighter range
        opacities[i] = 0.6 + Math.random() * 0.4;

        // Color variation - brighter
        const brightness = 0.9 + Math.random() * 0.1;
        colors[i3] = colorObj.r * brightness;
        colors[i3 + 1] = colorObj.g * brightness;
        colors[i3 + 2] = colorObj.b * brightness;
      }

      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
      geometry.setAttribute("opacity", new THREE.BufferAttribute(opacities, 1));
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: size,
        sizeAttenuation: true,
        vertexColors: true,
        transparent: true,
        opacity: 1,
        blending: THREE.AdditiveBlending,
        map: createStarTexture(),
      });

      const stars = new THREE.Points(geometry, material);
      stars.userData.layerIndex = layerIndex;
      stars.userData.baseRadius = radius;
      scene.add(stars);

      starsRef.current.push(stars);
      opacityAttributesRef.current.push(
        geometry.getAttribute("opacity") as THREE.BufferAttribute
      );

      return stars;
    };

    // Create star texture for better appearance - more prominent
    const createStarTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 128;
      canvas.height = 128;
      const context = canvas.getContext("2d")!;

      const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
      gradient.addColorStop(0, "rgba(255,255,255,1)");
      gradient.addColorStop(0.15, "rgba(255,255,255,0.95)");
      gradient.addColorStop(0.3, "rgba(255,255,255,0.7)");
      gradient.addColorStop(0.6, "rgba(255,255,255,0.3)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");

      context.fillStyle = gradient;
      context.fillRect(0, 0, 128, 128);

      const texture = new THREE.CanvasTexture(canvas);
      return texture;
    };

    // Create multiple star layers for depth - larger sizes for visibility
    const farStars = createStarLayer(
      Math.floor(starCount * 0.4),
      50,
      0.15,
      starColor,
      0
    );
    const midStars = createStarLayer(
      Math.floor(starCount * 0.4),
      40,
      0.22,
      starColor,
      1
    );
    const closeStars = createStarLayer(
      Math.floor(starCount * 0.15),
      30,
      0.35,
      starColor,
      2
    );
    const brightStars = createStarLayer(
      Math.floor(starCount * 0.05),
      35,
      0.5,
      brightStarColor,
      3
    );

    // Animation variables
    const clock = new THREE.Clock();
    let time = 0;

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      time = elapsedTime;

      // Slow rotation for all star layers (different speeds for depth)
      farStars.rotation.y += 0.0001;
      midStars.rotation.y += 0.00015;
      closeStars.rotation.y += 0.0002;
      brightStars.rotation.y += 0.00012;

      // Subtle rotation on other axes
      farStars.rotation.x = Math.sin(elapsedTime * 0.05) * 0.02;
      midStars.rotation.x = Math.sin(elapsedTime * 0.07) * 0.03;
      closeStars.rotation.x = Math.sin(elapsedTime * 0.09) * 0.04;

      // Twinkling effect - animate opacity - brighter range
      opacityAttributesRef.current.forEach((opacityAttr, layerIndex) => {
        const opacities = opacityAttr.array as Float32Array;
        for (let i = 0; i < opacities.length; i++) {
          // Each star twinkles at different rate
          const twinkleSpeed = 0.5 + (i % 3) * 0.3;
          const twinklePhase = (i * 0.1 + elapsedTime * twinkleSpeed) % (Math.PI * 2);
          // Smooth sine wave for twinkling - brighter range
          opacities[i] = 0.7 + Math.sin(twinklePhase) * 0.3;
        }
        opacityAttr.needsUpdate = true;
      });

      // Update star colors for theme
      starsRef.current.forEach((starPoints) => {
        const material = starPoints.material as THREE.PointsMaterial;
        if (material.vertexColors) {
          const colorAttr = starPoints.geometry.getAttribute(
            "color"
          ) as THREE.BufferAttribute;
          const colors = colorAttr.array as Float32Array;
          const baseColor = starPoints.userData.layerIndex === 3 
            ? new THREE.Color(brightStarColor)
            : new THREE.Color(starColor);

          for (let i = 0; i < colors.length; i += 3) {
            const brightness = 0.95 + Math.random() * 0.05;
            colors[i] = baseColor.r * brightness;
            colors[i + 1] = baseColor.g * brightness;
            colors[i + 2] = baseColor.b * brightness;
          }
          colorAttr.needsUpdate = true;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return;

      camera.aspect =
        containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      );
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      // Cleanup
      starsRef.current.forEach((stars) => {
        stars.geometry.dispose();
        (stars.material as THREE.PointsMaterial).dispose();
        scene.remove(stars);
      });
      starsRef.current = [];
      opacityAttributesRef.current = [];

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
