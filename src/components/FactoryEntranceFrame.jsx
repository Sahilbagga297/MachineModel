import React from 'react';

/**
 * FactoryEntranceFrame – two vertical pillars + top beam at the front face (Z+).
 * Forms the main structural entrance opening of the factory building.
 */
export default function FactoryEntranceFrame() {
  const pillarColor = '#374151';
  const frontZ      = 15;       // front face Z position
  const pillarH     = 12;

  return (
    <>
      {/* ── Left entrance pillar ── */}
      <mesh position={[-15, pillarH / 2, frontZ]} castShadow receiveShadow>
        <boxGeometry args={[1, pillarH, 1]} />
        <meshStandardMaterial color={pillarColor} roughness={0.7} metalness={0.4} />
      </mesh>

      {/* ── Right entrance pillar ── */}
      <mesh position={[15, pillarH / 2, frontZ]} castShadow receiveShadow>
        <boxGeometry args={[1, pillarH, 1]} />
        <meshStandardMaterial color={pillarColor} roughness={0.7} metalness={0.4} />
      </mesh>

      {/* ── Top entrance beam spanning the full width ── */}
      <mesh position={[0, 11.5, frontZ]} castShadow receiveShadow>
        <boxGeometry args={[30, 1, 1]} />
        <meshStandardMaterial color={pillarColor} roughness={0.7} metalness={0.4} />
      </mesh>

      {/* ── Diagonal gussets on inner corners for structural detail ── */}
      {[-1, 1].map((side) => (
        <mesh
          key={`gusset-${side}`}
          position={[side * 14.1, 11.8, frontZ]}
          rotation={[0, 0, side * Math.PI / 4]}
          castShadow
        >
          <boxGeometry args={[0.15, 1.4, 0.8]} />
          <meshStandardMaterial color="#2d3748" roughness={0.8} metalness={0.3} />
        </mesh>
      ))}
    </>
  );
}
