import React, { useMemo } from 'react';
import * as THREE from 'three';

/**
 * FactoryWalls – back, left, and right walls with industrial painted-panel
 * material, panel seam lines, and optional strip lights.
 */
export default function FactoryWalls() {
  const wallMat = useMemo(() => {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Base dark gray
    ctx.fillStyle = '#1a1e24';
    ctx.fillRect(0, 0, size, size);

    // Subtle panel texture noise
    for (let i = 0; i < 8000; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const b = 25 + Math.random() * 20;
      ctx.fillStyle = `rgb(${b},${b},${b})`;
      ctx.globalAlpha = 0.05;
      ctx.fillRect(x, y, 2, 2);
    }
    ctx.globalAlpha = 1;

    // Horizontal panel seam lines
    ctx.strokeStyle = '#0d1117';
    ctx.lineWidth = 3;
    for (let y = 64; y < size; y += 64) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(size, y);
      ctx.stroke();
    }
    // Vertical panel lines
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#111519';
    for (let x = 128; x < size; x += 128) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, size);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 1.5);
    return tex;
  }, []);

  const W = 30;   // wall width
  const H = 12;   // wall height
  const T = 0.5;  // thickness
  const halfW = W / 2;
  const halfH = H / 2;

  return (
    <>
      {/* ── Back wall ── */}
      <mesh position={[0, halfH, -halfW + T / 2]} receiveShadow castShadow>
        <boxGeometry args={[W, H, T]} />
        <meshStandardMaterial map={wallMat} color="#1f2937" roughness={0.85} metalness={0.12} />
      </mesh>

      {/* ── Left wall ── */}
      <mesh position={[-halfW + T / 2, halfH, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[W, H, T]} />
        <meshStandardMaterial map={wallMat} color="#1c2430" roughness={0.85} metalness={0.12} />
      </mesh>

      {/* ── Right wall ── */}
      <mesh position={[halfW - T / 2, halfH, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[W, H, T]} />
        <meshStandardMaterial map={wallMat} color="#1c2430" roughness={0.85} metalness={0.12} />
      </mesh>

      {/* ── Base trim strips (floor-wall junction) ── */}
      <WallBaseTrim />

      {/* ── Wall strip light fixtures (back wall) ── */}
      {[-9, -3, 3, 9].map((x) => (
        <group key={x} position={[x, H - 1.5, -halfW + 0.4]}>
          {/* Housing */}
          <mesh>
            <boxGeometry args={[1.2, 0.14, 0.08]} />
            <meshStandardMaterial color="#2a3344" roughness={0.4} metalness={0.7} />
          </mesh>
          {/* Glowing strip */}
          <mesh position={[0, -0.06, 0.01]}>
            <boxGeometry args={[1.0, 0.04, 0.02]} />
            <meshStandardMaterial color="#b8d8f8" emissive="#b8d8f8" emissiveIntensity={2.5} roughness={0} />
          </mesh>
        </group>
      ))}

      {/* ── Warning stripe on base of back wall ── */}
      <WarningStripe position={[0, 0.2, -halfW + 0.35]} width={W} />
    </>
  );
}

function WallBaseTrim() {
  const W = 30;
  return (
    <>
      {/* Back trim */}
      <mesh position={[0, 0.08, -W / 2 + 0.3]}>
        <boxGeometry args={[W, 0.15, 0.35]} />
        <meshStandardMaterial color="#111722" roughness={0.7} metalness={0.3} />
      </mesh>
      {/* Left trim */}
      <mesh position={[-W / 2 + 0.3, 0.08, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[W, 0.15, 0.35]} />
        <meshStandardMaterial color="#111722" roughness={0.7} metalness={0.3} />
      </mesh>
      {/* Right trim */}
      <mesh position={[W / 2 - 0.3, 0.08, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[W, 0.15, 0.35]} />
        <meshStandardMaterial color="#111722" roughness={0.7} metalness={0.3} />
      </mesh>
    </>
  );
}

function WarningStripe({ position, width }) {
  // Diagonal safety stripe texture
  const tex = useMemo(() => {
    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#111722';
    ctx.fillRect(0, 0, size, size);
    const step = 16;
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 6;
    for (let x = -size; x < size * 2; x += step * 2) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + size, size);
      ctx.stroke();
    }
    const t = new THREE.CanvasTexture(canvas);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(width / 1.5, 1);
    return t;
  }, [width]);

  return (
    <mesh position={position} rotation={[0, 0, 0]}>
      <planeGeometry args={[width, 0.4]} />
      <meshBasicMaterial map={tex} transparent opacity={0.5} depthWrite={false} />
    </mesh>
  );
}
