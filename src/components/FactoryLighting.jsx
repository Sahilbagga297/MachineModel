import React from 'react';

/**
 * FactoryLighting – layered industrial lighting:
 *  - Ambient base
 *  - Key directional light (sun-like)
 *  - Ceiling strip light fixtures (warm white)
 *  - Accent fill lights
 *  - Subtle floor bounce
 */
export default function FactoryLighting() {
  // Ceiling strip rows: [x, z] pairs for strip light fixtures
  const stripPositions = [
    [-8, -8], [0, -8], [8, -8],
    [-8,  0], [0,  0], [8,  0],
    [-8,  8], [0,  8], [8,  8],
  ];

  return (
    <>
      {/* ── Global ambient (very low, factory feel) ── */}
      <ambientLight intensity={0.30} color="#9ab8d8" />

      {/* ── Key directional light (simulates high windows / overhead) ── */}
      <directionalLight
        position={[10, 15, 10]}
        intensity={1.4}
        color="#ddeeff"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={60}
        shadow-camera-left={-18}
        shadow-camera-right={18}
        shadow-camera-top={18}
        shadow-camera-bottom={-18}
        shadow-bias={-0.001}
      />

      {/* ── Secondary fill from opposite side ── */}
      <directionalLight
        position={[-8, 12, -8]}
        intensity={0.5}
        color="#8090a8"
        castShadow={false}
      />

      {/* ── Ceiling industrial strip light fixtures ── */}
      {stripPositions.map(([x, z]) => (
        <CeilingStripLight key={`strip-${x}-${z}`} x={x} z={z} />
      ))}

      {/* ── Accent / atmosphere lights ── */}
      {/* Cool blue from back wall */}
      <pointLight position={[0, 9, -13]} color="#4070b8" intensity={0.8} distance={18} />
      {/* Warm corner accents */}
      <pointLight position={[-13, 7, -13]} color="#304060" intensity={0.5} distance={12} />
      <pointLight position={[ 13, 7, -13]} color="#304060" intensity={0.5} distance={12} />
      {/* Floor bounce (low, soft) */}
      <pointLight position={[0, 0.3, 0]} color="#1a2840" intensity={0.4} distance={20} />
    </>
  );
}

/**
 * Individual ceiling strip light unit:
 * – Physical fixture mesh
 * – Glowing white tube
 * – Point light that casts shadows (soft)
 */
function CeilingStripLight({ x, z }) {
  const fixtureY = 11.5;

  return (
    <group position={[x, fixtureY, z]}>
      {/* Fixture housing */}
      <mesh castShadow>
        <boxGeometry args={[1.8, 0.12, 0.28]} />
        <meshStandardMaterial color="#2a3344" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* Light tube (glowing) */}
      <mesh position={[0, -0.07, 0]}>
        <boxGeometry args={[1.6, 0.05, 0.22]} />
        <meshStandardMaterial
          color="#e8f0ff"
          emissive="#e8f0ff"
          emissiveIntensity={2.8}
          roughness={0}
          toneMapped={false}
        />
      </mesh>

      {/* Light source (cast shadow) */}
      <pointLight
        position={[0, -0.5, 0]}
        color="#ffffff"
        intensity={1.8}
        distance={11}
        castShadow
        shadow-mapSize={[512, 512]}
        shadow-bias={-0.005}
      />

      {/* Subtle warm halo */}
      <pointLight
        position={[0, -0.2, 0]}
        color="#ffe8c8"
        intensity={0.4}
        distance={6}
        castShadow={false}
      />
    </group>
  );
}
