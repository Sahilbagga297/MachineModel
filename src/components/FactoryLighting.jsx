import React from 'react';

/**
 * FactoryLighting – layered industrial lighting designed to work
 * inside a closed factory building with a solid concrete roof.
 *
 * Strategy:
 *  1. hemisphereLight as base fill (sky/ground, no shadows)
 *  2. directionalLights from FRONT and SIDES (not top) so
 *     they aren't blocked by the solid roof above
 *  3. Grid of interior point lights at Y=8 for machine illumination
 *  4. Physical ceiling strip light fixtures at Y=9.5
 */
export default function FactoryLighting() {
  // 9 ceiling strip positions in a 3×3 grid
  const stripPositions = [
    [-8, -8], [0, -8], [8, -8],
    [-8,  0], [0,  0], [8,  0],
    [-8,  8], [0,  8], [8,  8],
  ];

  // Interior point lights – placed at machine level to ensure visibility
  const interiorLights = [
    [-6, 8, -4],  // above M1
    [ 0, 8, -4],  // above M2
    [ 6, 8, -4],  // above M3
    [-6, 8,  4],  // above M4
    [ 0, 8,  4],  // above M5
    [ 6, 8,  4],  // above M6
    [ 0, 8,  0],  // centre fill
  ];

  return (
    <>
      {/* ── Sky/ground hemisphere – base fill (no shadows) ── */}
      <hemisphereLight
        args={['#c8dff5', '#2a3a50', 2.5]}
        position={[0, 10, 0]}
      />

      {/* ── Strong ambient to fill all dark crevices ── */}
      <ambientLight intensity={1.8} color="#d0e4f5" />

      {/* ── Front directional key (from camera side Z+, below roof) ── */}
      <directionalLight
        position={[0, 8, 20]}
        intensity={3.5}
        color="#e8f2ff"
        castShadow={false}
      />

      {/* ── Side-left fill ── */}
      <directionalLight
        position={[-18, 6, 0]}
        intensity={2.0}
        color="#ccddf0"
        castShadow={false}
      />

      {/* ── Side-right fill ── */}
      <directionalLight
        position={[18, 6, 0]}
        intensity={2.0}
        color="#ccddf0"
        castShadow={false}
      />

      {/* ── Back-top directional (above machines but angled from front-top) ── */}
      <directionalLight
        position={[4, 18, 14]}
        intensity={2.5}
        color="#ffffff"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-16}
        shadow-camera-right={16}
        shadow-camera-top={16}
        shadow-camera-bottom={-16}
        shadow-bias={-0.001}
      />

      {/* ── Per-machine interior point lights (inside factory, below roof) ── */}
      {interiorLights.map(([x, y, z]) => (
        <pointLight
          key={`il-${x}-${z}`}
          position={[x, y, z]}
          color="#ffffff"
          intensity={3.0}
          distance={14}
          castShadow={false}
        />
      ))}

      {/* ── Physical ceiling strip light fixtures at Y=9.5 ── */}
      {stripPositions.map(([x, z]) => (
        <CeilingStripLight key={`strip-${x}-${z}`} x={x} z={z} />
      ))}

      {/* ── Accent atmosphere lights ── */}
      <pointLight position={[0, 7, -12]} color="#5080c8" intensity={1.2} distance={20} />
      <pointLight position={[-12, 5, -12]} color="#304060" intensity={0.8} distance={15} />
      <pointLight position={[12, 5, -12]}  color="#304060" intensity={0.8} distance={15} />
    </>
  );
}

/**
 * Individual ceiling strip light unit:
 * – Physical fixture mesh at Y=9.5 (below concrete roof)
 * – Glowing emissive tube
 * – Point light downward
 */
function CeilingStripLight({ x, z }) {
  const fixtureY = 9.8; // below the concrete roof slab (top at Y=10.8)

  return (
    <group position={[x, fixtureY, z]}>
      {/* Fixture housing */}
      <mesh>
        <boxGeometry args={[1.8, 0.12, 0.28]} />
        <meshStandardMaterial color="#2a3344" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* Glowing LED tube face */}
      <mesh position={[0, -0.07, 0]}>
        <boxGeometry args={[1.6, 0.05, 0.22]} />
        <meshStandardMaterial
          color="#e8f0ff"
          emissive="#e8f0ff"
          emissiveIntensity={3.0}
          roughness={0}
          toneMapped={false}
        />
      </mesh>

      {/* Primary downward point light */}
      <pointLight
        position={[0, -0.5, 0]}
        color="#ffffff"
        intensity={4.5}
        distance={18}
        castShadow={false}
      />
    </group>
  );
}
