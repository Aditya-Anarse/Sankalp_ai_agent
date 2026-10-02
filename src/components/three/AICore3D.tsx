"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Html, Sphere, Ring, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

const ORBITAL_NODES = [
  { name: "Research", color: "#00F0FF", angle: 0, distance: 2.3, speed: 0.6 },
  { name: "Strategy", color: "#38BDF8", angle: 1.05, distance: 2.7, speed: 0.5 },
  { name: "Create", color: "#818CF8", angle: 2.1, distance: 3.1, speed: 0.4 },
  { name: "Publish", color: "#A855F7", angle: 3.15, distance: 3.4, speed: 0.35 },
  { name: "Analyze", color: "#06B6D4", angle: 4.2, distance: 2.5, speed: 0.55 },
  { name: "Learn", color: "#10B981", angle: 5.25, distance: 2.9, speed: 0.45 },
];

function InnerEnergyCore() {
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (coreRef.current) {
      const t = clock.getElapsedTime();
      coreRef.current.rotation.y = t * 0.4;
      coreRef.current.rotation.x = Math.sin(t * 0.3) * 0.2;
    }
  });

  return (
    <group>
      {/* Central Pulsing Geometric Core */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.9, 1]} />
        <meshStandardMaterial
          color="#00F0FF"
          emissive="#00F0FF"
          emissiveIntensity={0.8}
          wireframe
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Internal Distorted Plasma Ball */}
      <Sphere args={[0.65, 32, 32]}>
        <MeshDistortMaterial
          color="#6366F1"
          emissive="#38BDF8"
          emissiveIntensity={0.6}
          roughness={0.1}
          metalness={0.8}
          distort={0.4}
          speed={3}
        />
      </Sphere>

      {/* Point Light Radiating outwards */}
      <pointLight color="#00F0FF" intensity={3} distance={6} />
      <pointLight color="#8B5CF6" intensity={2} distance={8} position={[0, -1, 0]} />
    </group>
  );
}

function GlassOuterSphere() {
  const glassRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (glassRef.current) {
      const t = clock.getElapsedTime();
      glassRef.current.rotation.y = -t * 0.15;
      glassRef.current.rotation.z = Math.cos(t * 0.2) * 0.1;
    }
  });

  return (
    <mesh ref={glassRef}>
      <sphereGeometry args={[1.35, 48, 48]} />
      <meshPhysicalMaterial
        color="#ffffff"
        transmission={0.92}
        opacity={1}
        transparent
        roughness={0.12}
        ior={1.45}
        reflectivity={0.9}
        clearcoat={1}
        clearcoatRoughness={0.1}
        metalness={0.05}
      />
    </mesh>
  );
}

function FloatingParticles({ count = 80 }) {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const baseColors = [
      new THREE.Color("#00F0FF"),
      new THREE.Color("#818CF8"),
      new THREE.Color("#A855F7"),
      new THREE.Color("#38BDF8"),
    ];

    for (let i = 0; i < count; i++) {
      const radius = 1.4 + Math.random() * 2.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      const color = baseColors[Math.floor(Math.random() * baseColors.length)];
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }

    return { positions: pos, colors: col };
  }, [count]);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      const t = clock.getElapsedTime();
      pointsRef.current.rotation.y = t * 0.08;
      pointsRef.current.rotation.x = Math.sin(t * 0.05) * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        vertexColors
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function OrbitalRingsAndNodes() {
  const ringsRef = useRef<THREE.Group>(null);
  const nodesRef = useRef<(THREE.Group | null)[]>([]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (ringsRef.current) {
      ringsRef.current.rotation.y = t * 0.04;
      ringsRef.current.rotation.x = Math.sin(t * 0.06) * 0.15;
    }

    ORBITAL_NODES.forEach((node, i) => {
      const group = nodesRef.current[i];
      if (group) {
        const curAngle = node.angle + t * node.speed * 0.4;
        group.position.x = Math.cos(curAngle) * node.distance;
        group.position.z = Math.sin(curAngle) * node.distance;
        group.position.y = Math.sin(t * 0.6 + i) * 0.25;
      }
    });
  });

  return (
    <group ref={ringsRef}>
      {/* 3 Concentric Orbital Path Rings */}
      <group rotation={[Math.PI / 3.5, 0, Math.PI / 6]}>
        <Ring args={[2.28, 2.3, 64]}>
          <meshBasicMaterial color="#00F0FF" transparent opacity={0.22} side={THREE.DoubleSide} />
        </Ring>
      </group>

      <group rotation={[-Math.PI / 4, Math.PI / 8, 0]}>
        <Ring args={[2.88, 2.9, 64]}>
          <meshBasicMaterial color="#818CF8" transparent opacity={0.25} side={THREE.DoubleSide} />
        </Ring>
      </group>

      <group rotation={[Math.PI / 6, -Math.PI / 5, 0]}>
        <Ring args={[3.38, 3.4, 64]}>
          <meshBasicMaterial color="#A855F7" transparent opacity={0.18} side={THREE.DoubleSide} />
        </Ring>
      </group>

      {/* Interactive Orbital Intelligence Nodes with Labels */}
      {ORBITAL_NODES.map((node, i) => (
        <group key={node.name} ref={(el) => { nodesRef.current[i] = el; }}>
          {/* Node Glowing Sphere */}
          <Sphere args={[0.07, 16, 16]}>
            <meshStandardMaterial
              color={node.color}
              emissive={node.color}
              emissiveIntensity={1.5}
            />
          </Sphere>

          {/* Thin Light Beam / Halo */}
          <Sphere args={[0.13, 16, 16]}>
            <meshBasicMaterial
              color={node.color}
              transparent
              opacity={0.3}
              blending={THREE.AdditiveBlending}
            />
          </Sphere>

          {/* Micro HUD Tag */}
          <Html distanceFactor={10} position={[0, 0.2, 0]} center>
            <div className="pointer-events-none select-none px-2 py-0.5 rounded-full bg-[#05060A]/85 backdrop-blur-md border border-white/20 text-[9px] font-mono tracking-wider font-semibold text-white shadow-lg whitespace-nowrap opacity-80 hover:opacity-100 flex items-center gap-1">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: node.color }}
              />
              {node.name}
            </div>
          </Html>
        </group>
      ))}
    </group>
  );
}

export function AICore3D() {
  const sceneRef = useRef<THREE.Group>(null);

  useFrame(({ mouse }) => {
    if (sceneRef.current) {
      // Smooth subtle mouse parallax
      sceneRef.current.rotation.y = THREE.MathUtils.lerp(
        sceneRef.current.rotation.y,
        mouse.x * 0.35,
        0.05
      );
      sceneRef.current.rotation.x = THREE.MathUtils.lerp(
        sceneRef.current.rotation.x,
        -mouse.y * 0.25,
        0.05
      );
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
      <group ref={sceneRef} scale={1.1}>
        <InnerEnergyCore />
        <GlassOuterSphere />
        <FloatingParticles count={90} />
        <OrbitalRingsAndNodes />
      </group>
    </Float>
  );
}
