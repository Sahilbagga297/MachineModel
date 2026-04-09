import React, { Suspense } from 'react';
import { Text } from '@react-three/drei';

/**
 * FactorySignBoard – industrial name board mounted above the entrance.
 * Displays "FACTORY" in bold yellow text on a dark steel panel.
 *
 * NOTE: No custom font URL – troika-three-text's built-in font is used
 * so it works immediately without a network fetch.
 */
export default function FactorySignBoard() {
  const boardPos   = [0, 10.5, 15.6];
  const boardColor = '#1f2937';
  const textColor  = '#facc15';

  return (
    <group position={boardPos}>
      {/* ── Board backing panel ── */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[12, 3, 0.4]} />
        <meshStandardMaterial
          color={boardColor}
          roughness={0.6}
          metalness={0.3}
        />
      </mesh>

      {/* ── Board face – subtle brighter inner panel ── */}
      <mesh position={[0, 0, 0.21]}>
        <boxGeometry args={[11.4, 2.4, 0.05]} />
        <meshStandardMaterial color="#111827" roughness={0.5} metalness={0.2} />
      </mesh>

      {/* ── Mounting bolt caps (four corners for realism) ── */}
      {[-5.6, 5.6].map((x) =>
        [-1.2, 1.2].map((y) => (
          <mesh key={`bolt-${x}-${y}`} position={[x, y, 0.22]}>
            <cylinderGeometry args={[0.1, 0.1, 0.05, 8]} />
            <meshStandardMaterial color="#4b5563" roughness={0.4} metalness={0.8} />
          </mesh>
        ))
      )}

      {/* ── FACTORY text (wrapped in Suspense for async font loading) ── */}
      <Suspense fallback={null}>
        <Text
          position={[0, 0, 0.25]}
          fontSize={1}
          color={textColor}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.15}
        >
          FACTORY
        </Text>
      </Suspense>

      {/* ── Highlight strip along the top edge of board ── */}
      <mesh position={[0, 1.55, 0.21]}>
        <boxGeometry args={[12, 0.1, 0.06]} />
        <meshStandardMaterial
          color="#facc15"
          emissive="#facc15"
          emissiveIntensity={0.6}
          roughness={0}
        />
      </mesh>
      {/* ── Highlight strip along the bottom edge ── */}
      <mesh position={[0, -1.55, 0.21]}>
        <boxGeometry args={[12, 0.1, 0.06]} />
        <meshStandardMaterial
          color="#facc15"
          emissive="#facc15"
          emissiveIntensity={0.6}
          roughness={0}
        />
      </mesh>

      {/* ── Sign illumination – warm point light in front ── */}
      <pointLight position={[0, 0, 2]} color="#ffe066" intensity={1.2} distance={8} />
    </group>
  );
}

