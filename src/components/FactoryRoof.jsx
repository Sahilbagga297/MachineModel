import React from 'react';

/**
 * FactoryRoof – solid concrete slab + edge border strips.
 * Sits above the beam structure at Y=10.5, does NOT remove any beams.
 */
export default function FactoryRoof() {
  const roofY     = 12.1;
  const roofW     = 30;
  const roofD     = 30;
  const roofH     = 0.6;
  const borderT   = 0.5;       // border thickness
  const borderH   = 1.0;       // slightly taller to close ceiling gap
  const concreteColor  = '#9ca3af';
  const borderColor    = '#374151';

  return (
    <>
      {/* ── Concrete roof slab (no shadow-casting – interior lit by point lights) ── */}
      <mesh
        position={[0, roofY, 0]}
        receiveShadow={false}
      >
        <boxGeometry args={[roofW, roofH, roofD]} />
        <meshStandardMaterial
          color={concreteColor}
          roughness={0.95}
          metalness={0.05}
        />
      </mesh>

      {/* ── Border edges – Front (Z+) ── */}
      <mesh position={[0, roofY + 0.1, roofD / 2 - borderT / 2]} castShadow>
        <boxGeometry args={[roofW, borderH, borderT]} />
        <meshStandardMaterial color={borderColor} roughness={0.9} metalness={0.1} />
      </mesh>

      {/* ── Border edges – Back (Z-) ── */}
      <mesh position={[0, roofY + 0.1, -roofD / 2 + borderT / 2]} castShadow>
        <boxGeometry args={[roofW, borderH, borderT]} />
        <meshStandardMaterial color={borderColor} roughness={0.9} metalness={0.1} />
      </mesh>

      {/* ── Border edges – Left (X-) ── */}
      <mesh position={[-roofW / 2 + borderT / 2, roofY + 0.1, 0]} castShadow>
        <boxGeometry args={[borderT, borderH, roofD]} />
        <meshStandardMaterial color={borderColor} roughness={0.9} metalness={0.1} />
      </mesh>

      {/* ── Border edges – Right (X+) ── */}
      <mesh position={[roofW / 2 - borderT / 2, roofY + 0.1, 0]} castShadow>
        <boxGeometry args={[borderT, borderH, roofD]} />
        <meshStandardMaterial color={borderColor} roughness={0.9} metalness={0.1} />
      </mesh>
    </>
  );
}
