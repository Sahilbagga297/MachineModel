import React, { useMemo } from 'react';
import { Grid } from '@react-three/drei';
import * as THREE from 'three';

/**
 * FactoryFloor – concrete industrial floor with PBR-style material,
 * grid overlay, and yellow safety zone markings.
 */
export default function FactoryFloor() {
  // Procedural "concrete" texture via canvas
  const concreteTexture = useMemo(() => {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Base concrete gray
    ctx.fillStyle = '#2a2d32';
    ctx.fillRect(0, 0, size, size);

    // Add noise/grain for concrete look
    for (let i = 0; i < 18000; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const r = Math.random() * 1.5;
      const brightness = 30 + Math.random() * 35;
      ctx.fillStyle = `rgb(${brightness},${brightness},${brightness})`;
      ctx.globalAlpha = 0.08 + Math.random() * 0.12;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Wear streaks
    ctx.globalAlpha = 0.06;
    for (let i = 0; i < 12; i++) {
      const x1 = Math.random() * size;
      const y1 = Math.random() * size;
      ctx.strokeStyle = '#555';
      ctx.lineWidth = 1 + Math.random() * 3;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x1 + (Math.random() - 0.5) * 120, y1 + (Math.random() - 0.5) * 60);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(10, 10);
    return tex;
  }, []);

  // Roughness map
  const roughnessTexture = useMemo(() => {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#888';
    ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 6000; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const b = 100 + Math.random() * 100;
      ctx.fillStyle = `rgb(${b},${b},${b})`;
      ctx.globalAlpha = 0.15;
      ctx.fillRect(x, y, 2, 2);
    }
    ctx.globalAlpha = 1;
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(10, 10);
    return tex;
  }, []);

  // Machine zone box coords [cx, cz, w, d]
  const machineZones = [
    [-5, -4, 2.8, 2.8],
    [ 0, -4, 2.8, 2.8],
    [ 5, -4, 2.8, 2.8],
    [-5,  4, 2.8, 2.8],
    [ 0,  4, 2.8, 2.8],
    [ 5,  4, 2.8, 2.8],
  ];

  return (
    <>
      {/* Concrete floor plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[30, 30, 1, 1]} />
        <meshStandardMaterial
          map={concreteTexture}
          roughnessMap={roughnessTexture}
          roughness={0.88}
          metalness={0.04}
          color="#1e2228"
        />
      </mesh>

      {/* Subtle grid overlay */}
      <Grid
        position={[0, 0.003, 0]}
        args={[30, 30]}
        cellSize={1}
        cellThickness={0.3}
        cellColor="#1d2f47"
        sectionSize={5}
        sectionThickness={0.7}
        sectionColor="#1e3a5a"
        fadeDistance={28}
        fadeStrength={2}
        followCamera={false}
      />

      {/* Machine zone safety boxes (yellow outlines) */}
      {machineZones.map(([cx, cz, w, d], i) => (
        <SafetyBoxOutline key={i} cx={cx} cz={cz} w={w} d={d} />
      ))}

      {/* Central walkway lines */}
      {[-3, 3].map((z) => (
        <mesh key={`wh-${z}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, z]}>
          <planeGeometry args={[30, 0.08]} />
          <meshBasicMaterial color="#facc15" transparent opacity={0.55} depthWrite={false} />
        </mesh>
      ))}
      {[-3, 3].map((x) => (
        <mesh key={`wv-${x}`} rotation={[-Math.PI / 2, 0, Math.PI / 2]} position={[x, 0.005, 0]}>
          <planeGeometry args={[30, 0.08]} />
          <meshBasicMaterial color="#facc15" transparent opacity={0.55} depthWrite={false} />
        </mesh>
      ))}
    </>
  );
}

/** Yellow safety outline around each machine zone */
function SafetyBoxOutline({ cx, cz, w, d }) {
  const y   = 0.006;
  const t   = 0.09; // line thickness
  const color = '#facc15';
  const opacity = 0.7;

  const lines = [
    // top
    [cx, cz - d / 2, w, t, 0],
    // bottom
    [cx, cz + d / 2, w, t, 0],
    // left
    [cx - w / 2, cz, t, d, 0],
    // right
    [cx + w / 2, cz, t, d, 0],
  ];

  return (
    <>
      {lines.map(([lx, lz, lw, ld], i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[lx, y, lz]}>
          <planeGeometry args={[lw, ld]} />
          <meshBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} />
        </mesh>
      ))}
    </>
  );
}
