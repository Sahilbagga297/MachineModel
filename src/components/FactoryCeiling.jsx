import React from 'react';

/**
 * FactoryCeiling – ceiling deck, steel crossbeams, trusses, and cable trays.
 */
export default function FactoryCeiling() {
  const W = 30;
  const H = 12;    // ceiling height
  const beamColor = '#374151';
  const deckColor = '#1a1e26';
  const trussDark = '#2d3340';

  // Crossbeams every 5 units along Z
  const beamZPositions = [-10, -5, 0, 5, 10];
  // Longitudinal beams along X
  const longBeamXPositions = [-8, 0, 8];

  return (
    <>
      {/* ── Ceiling deck panel ── */}
      <mesh position={[0, H, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[W, W]} />
        <meshStandardMaterial color={deckColor} roughness={0.9} metalness={0.2} />
      </mesh>

      {/* ── Crossbeams (span X axis, spaced along Z) ── */}
      {beamZPositions.map((z) => (
        <group key={`cb-${z}`}>
          {/* Main I-beam body */}
          <mesh position={[0, H - 0.2, z]} castShadow>
            <boxGeometry args={[W, 0.4, 0.8]} />
            <meshStandardMaterial color={beamColor} roughness={0.6} metalness={0.5} />
          </mesh>
          {/* Top flange */}
          <mesh position={[0, H - 0.02, z]} castShadow>
            <boxGeometry args={[W, 0.08, 1.2]} />
            <meshStandardMaterial color={trussDark} roughness={0.55} metalness={0.6} />
          </mesh>
          {/* Bottom flange */}
          <mesh position={[0, H - 0.38, z]} castShadow>
            <boxGeometry args={[W, 0.08, 1.2]} />
            <meshStandardMaterial color={trussDark} roughness={0.55} metalness={0.6} />
          </mesh>
        </group>
      ))}

      {/* ── Longitudinal beams (span Z axis, along X) ── */}
      {longBeamXPositions.map((x) => (
        <mesh key={`lb-${x}`} position={[x, H - 0.55, 0]} castShadow>
          <boxGeometry args={[0.35, 0.22, W]} />
          <meshStandardMaterial color={beamColor} roughness={0.6} metalness={0.5} />
        </mesh>
      ))}

      {/* ── Corner columns ── */}
      {[-14, 14].map((x) =>
        [-14, 14].map((z) => (
          <mesh key={`col-${x}-${z}`} position={[x, H / 2 - 0.5, z]} castShadow receiveShadow>
            <boxGeometry args={[0.5, H, 0.5]} />
            <meshStandardMaterial color="#1a2030" roughness={0.7} metalness={0.4} />
          </mesh>
        ))
      )}

      {/* ── Mid columns (back wall) ── */}
      {[-7, 0, 7].map((x) => (
        <mesh key={`mc-${x}`} position={[x, H / 2 - 0.5, -14.5]} castShadow receiveShadow>
          <boxGeometry args={[0.4, H, 0.4]} />
          <meshStandardMaterial color="#1a2030" roughness={0.7} metalness={0.4} />
        </mesh>
      ))}

      {/* ── Cable tray along center ── */}
      <mesh position={[0, H - 0.8, 0]} castShadow>
        <boxGeometry args={[0.6, 0.12, W - 2]} />
        <meshStandardMaterial color="#263040" roughness={0.5} metalness={0.7} />
      </mesh>

      {/* ── Ventilation ducts ── */}
      {[-6, 6].map((x) => (
        <group key={`duct-${x}`}>
          <mesh position={[x, H - 0.7, 0]} castShadow>
            <boxGeometry args={[0.9, 0.5, W - 4]} />
            <meshStandardMaterial color="#2e3540" roughness={0.45} metalness={0.75} />
          </mesh>
          {/* Duct joints */}
          {[-9, -3, 3, 9].map((z) => (
            <mesh key={`dj-${z}`} position={[x, H - 0.7, z]} castShadow>
              <boxGeometry args={[1.0, 0.55, 0.15]} />
              <meshStandardMaterial color="#232c38" roughness={0.5} metalness={0.7} />
            </mesh>
          ))}
        </group>
      ))}
    </>
  );
}
