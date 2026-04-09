import React, { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

/**
 * IndustrialProps – factory props placed near walls:
 *   Storage racks, crates, control panels, wall pipes, ventilation units
 */
export default function IndustrialProps() {
  return (
    <>
      {/* ── Back wall area ── */}
      <StorageRack position={[-11, 0, -13]} />
      <StorageRack position={[ 11, 0, -13]} />
      <CrateStack   position={[-7.5, 0, -12.5]} />
      <CrateStack   position={[ 7.5, 0, -12.5]} />
      <ControlPanel position={[0, 0, -12.5]} />
      <ControlPanel position={[3.5, 0, -12.5]} />
      <ControlPanel position={[-3.5, 0, -12.5]} />

      {/* ── Left wall area ── */}
      <StorageRack position={[-13, 0, -4]} rotation={[0, Math.PI / 2, 0]} />
      <StorageRack position={[-13, 0,  4]} rotation={[0, Math.PI / 2, 0]} />
      <VentUnit    position={[-12.5, 4.5, 0]} rotation={[0, Math.PI / 2, 0]} />
      <WallPipeRun position={[-12.8, 2.5, -8]} axis="z" length={6} />
      <WallPipeRun position={[-12.8, 2.5,  8]} axis="z" length={6} />

      {/* ── Right wall area ── */}
      <StorageRack position={[13, 0, -4]} rotation={[0, -Math.PI / 2, 0]} />
      <VentUnit    position={[12.5, 4.5, 0]} rotation={[0, -Math.PI / 2, 0]} />
      <WallPipeRun position={[12.8, 2.5, -8]} axis="z" length={6} />

      {/* ── Corner props ── */}
      <CrateStack position={[-12, 0, 12]} height={3} />
      <CrateStack position={[ 12, 0, 12]} height={2} />
      <ToolCabinet position={[-11, 0, 10]} />
      <ToolCabinet position={[ 11, 0, 10]} />

      {/* ── Depth filler (behind machine rows) ── */}
      <BarrelRow   position={[-9, 0, -11]} />
      <BarrelRow   position={[ 9, 0, -11]} />

      {/* ── Warning beacon (spinning light) ── */}
      <WarningBeacon position={[0, 0.5, -12.8]} />
    </>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

/** Multi-shelf storage rack */
function StorageRack({ position, rotation = [0, 0, 0] }) {
  const frameColor = '#2d3a4a';
  const shelfColor = '#1e2a38';
  const boxColor   = '#3a4555';
  const W = 2.5;
  const H = 4;
  const D = 0.8;

  return (
    <group position={position} rotation={rotation}>
      {/* Frame uprights */}
      {[-W / 2 + 0.05, W / 2 - 0.05].map((x, i) => (
        <mesh key={i} position={[x, H / 2, 0]} castShadow>
          <boxGeometry args={[0.1, H, D]} />
          <meshStandardMaterial color={frameColor} roughness={0.6} metalness={0.6} />
        </mesh>
      ))}
      {/* Shelves */}
      {[0.6, 1.6, 2.6, 3.5].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} castShadow receiveShadow>
          <boxGeometry args={[W, 0.06, D]} />
          <meshStandardMaterial color={shelfColor} roughness={0.6} metalness={0.4} />
        </mesh>
      ))}
      {/* Stored boxes on shelves */}
      {[0.85, 1.85].map((y, si) => (
        [-0.7, 0.0, 0.7].map((x, bi) => (
          <mesh key={`b-${si}-${bi}`} position={[x, y, 0]} castShadow>
            <boxGeometry args={[0.55, 0.38, 0.6]} />
            <meshStandardMaterial
              color={bi % 2 === 0 ? boxColor : '#2a3344'}
              roughness={0.8} metalness={0.1}
            />
          </mesh>
        ))
      ))}
    </group>
  );
}

/** Stack of industrial crates */
function CrateStack({ position, height = 2 }) {
  const colors = ['#2e3a28', '#3a4530', '#344228'];
  return (
    <group position={position}>
      {Array.from({ length: height }).map((_, i) => (
        <mesh key={i} position={[0, i * 0.65 + 0.32, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.9, 0.6, 0.9]} />
          <meshStandardMaterial color={colors[i % colors.length]} roughness={0.9} metalness={0.05} />
        </mesh>
      ))}
    </group>
  );
}

/** Wall-mounted control panel / fuse box */
function ControlPanel({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Cabinet body */}
      <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.7, 1.0, 0.2]} />
        <meshStandardMaterial color="#1a2234" roughness={0.5} metalness={0.5} />
      </mesh>
      {/* Front panel */}
      <mesh position={[0, 1.2, 0.11]}>
        <boxGeometry args={[0.6, 0.9, 0.02]} />
        <meshStandardMaterial color="#141e2c" roughness={0.3} metalness={0.7} />
      </mesh>
      {/* Indicator lights */}
      {[['#22c55e', -0.15, 1.4], ['#eab308', 0, 1.4], ['#ef4444', 0.15, 1.4]].map(([c, x, y], i) => (
        <mesh key={i} position={[x, y, 0.125]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial color={c} emissive={c} emissiveIntensity={1.5} roughness={0} />
        </mesh>
      ))}
      {/* Display screen */}
      <mesh position={[0, 1.15, 0.12]}>
        <boxGeometry args={[0.4, 0.3, 0.01]} />
        <meshStandardMaterial color="#0a1420" emissive="#0d4080" emissiveIntensity={0.4} roughness={0} />
      </mesh>
    </group>
  );
}

/** Horizontal pipe run along a wall */
function WallPipeRun({ position, axis, length }) {
  // Cylinder defaults to Y axis; rotate to align with chosen axis
  const meshRotation = axis === 'z' ? [Math.PI / 2, 0, 0] : [0, 0, Math.PI / 2];

  return (
    <group position={position}>
      {/* Main pipe */}
      <mesh rotation={meshRotation} castShadow>
        <cylinderGeometry args={[0.07, 0.07, length, 8]} />
        <meshStandardMaterial color="#354050" roughness={0.4} metalness={0.8} />
      </mesh>
      {/* Brackets */}
      {Array.from({ length: Math.ceil(length / 2) + 1 }).map((_, i) => {
        const offset = -length / 2 + i * 2;
        return (
          <mesh key={i} position={axis === 'z' ? [0.12, 0, offset] : [offset, 0, 0.12]} castShadow>
            <boxGeometry args={[0.08, 0.22, 0.06]} />
            <meshStandardMaterial color="#263040" roughness={0.5} metalness={0.7} />
          </mesh>
        );
      })}
    </group>
  );
}

/** Wall-mounted ventilation unit */
function VentUnit({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Housing */}
      <mesh castShadow>
        <boxGeometry args={[2.5, 1.2, 0.6]} />
        <meshStandardMaterial color="#202834" roughness={0.5} metalness={0.65} />
      </mesh>
      {/* Vent grille slats */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} position={[0, -0.4 + i * 0.12, 0.31]} castShadow>
          <boxGeometry args={[2.3, 0.04, 0.05]} />
          <meshStandardMaterial color="#1a2130" roughness={0.5} metalness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

/** Tool / storage cabinet */
function ToolCabinet({ position }) {
  return (
    <group position={position}>
      {/* Body */}
      <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 2.0, 0.55]} />
        <meshStandardMaterial color="#1e2840" roughness={0.65} metalness={0.45} />
      </mesh>
      {/* Drawer lines */}
      {[0.5, 0.85, 1.2, 1.55].map((y, i) => (
        <mesh key={i} position={[0, y, 0.28]}>
          <boxGeometry args={[0.7, 0.03, 0.01]} />
          <meshStandardMaterial color="#0d1525" roughness={0.5} metalness={0.5} />
        </mesh>
      ))}
      {/* Handle knobs */}
      {[0.5, 0.85, 1.2, 1.55].map((y, i) => (
        <mesh key={i} position={[0, y + 0.08, 0.285]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color="#4a5568" roughness={0.3} metalness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

/** Row of industrial barrels */
function BarrelRow({ position }) {
  const offsets = [-0.55, 0, 0.55];
  return (
    <group position={position}>
      {offsets.map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.26, 0.28, 0.85, 16]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? '#2a1a10' : '#1a2a10'}
              roughness={0.7} metalness={0.2}
            />
          </mesh>
          {/* Banding rings */}
          {[0.2, 0.65].map((y, ri) => (
            <mesh key={ri} position={[0, y, 0]} castShadow>
              <torusGeometry args={[0.27, 0.025, 8, 24]} />
              <meshStandardMaterial color="#3a3a3a" roughness={0.4} metalness={0.7} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

/** Spinning warning beacon */
function WarningBeacon({ position }) {
  const lightRef = useRef();
  const rotRef   = useRef();

  useFrame(({ clock }) => {
    if (rotRef.current) rotRef.current.rotation.y = clock.getElapsedTime() * 4;
    if (lightRef.current) {
      // Emissive pulse
      const t = clock.getElapsedTime();
      lightRef.current.material.emissiveIntensity = 1.5 + Math.sin(t * 8) * 1.2;
    }
  });

  return (
    <group position={position}>
      {/* Pole */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 1.0, 8]} />
        <meshStandardMaterial color="#384050" roughness={0.4} metalness={0.8} />
      </mesh>
      {/* Spinning beacon dome */}
      <group ref={rotRef} position={[0, 1.1, 0]}>
        <mesh ref={lightRef} castShadow>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshStandardMaterial
            color="#facc15"
            emissive="#facc15"
            emissiveIntensity={2}
            roughness={0} metalness={0}
            toneMapped={false}
          />
        </mesh>
        {/* Tiny sweep light */}
        <pointLight color="#facc15" intensity={1.5} distance={5} castShadow={false} />
      </group>
    </group>
  );
}
