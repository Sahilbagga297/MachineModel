import React from 'react';

/**
 * RoofLighting – ceiling-mounted point lights + LED strip panels.
 * Supplements the existing FactoryLighting with dedicated under-roof illumination.
 */
export default function RoofLighting() {
  // Point light positions below the roof (roof slab bottom is at Y≈10.2)
  const pointLightPositions = [
    [0,  9.2,  0],
    [6,  9.2,  0],
    [-6, 9.2,  0],
    [0,  9.2, -6],
    [0,  9.2,  6],
  ];

  // LED strip panel positions [x, z] placed along beam lines
  const ledStripPositions = [
    [-8, -8], [0, -8], [8, -8],
    [-8,  0], [0,  0], [8,  0],
    [-8,  8], [0,  8], [8,  8],
  ];

  return (
    <>
      {/* ── Roof point lights (illuminate machines below) ── */}
      {pointLightPositions.map(([x, y, z]) => (
      <pointLight
          key={`rpl-${x}-${z}`}
          position={[x, y, z]}
          color="#ffffff"
          intensity={3.5}
          distance={18}
          castShadow
          shadow-mapSize={[512, 512]}
          shadow-bias={-0.005}
        />
      ))}

      {/* ── LED ceiling strip panels ── */}
      {ledStripPositions.map(([x, z]) => (
        <group key={`led-${x}-${z}`} position={[x, 9.0, z]}>
          {/* Housing */}
          <mesh castShadow>
            <boxGeometry args={[4, 0.2, 0.5]} />
            <meshStandardMaterial color="#2a3344" roughness={0.5} metalness={0.7} />
          </mesh>
          {/* Glowing emissive face */}
          <mesh position={[0, -0.11, 0]}>
            <boxGeometry args={[3.8, 0.04, 0.42]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={2.5}
              roughness={0}
              toneMapped={false}
            />
          </mesh>
          {/* Downward fill light */}
          <pointLight
            position={[0, -0.4, 0]}
            color="#e8f0ff"
            intensity={0.8}
            distance={8}
            castShadow={false}
          />
        </group>
      ))}
    </>
  );
}
