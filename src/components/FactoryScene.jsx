import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
} from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

import MachineDigitalTwin from './MachineDigitalTwin';
import FactoryFloor       from './FactoryFloor';
import FactoryWalls       from './FactoryWalls';
import FactoryCeiling     from './FactoryCeiling';
import FactoryLighting    from './FactoryLighting';
import IndustrialProps    from './IndustrialProps';
import { MACHINE_CONFIGS } from '../store/machineStore';

export default function FactoryScene({ machineData, selectedMachineId, onMachineSelect }) {
  const cameraRef  = useRef();
  const controlRef = useRef();

  // ── Camera fly-to on selected machine ────────────────────────────
  useEffect(() => {
    const m = machineData.find((d) => d.id === selectedMachineId);
    if (!m || !cameraRef.current || !controlRef.current) return;
    const [tx, , tz] = m.position;

    gsap.to(cameraRef.current.position, {
      x: tx + 4, y: 7, z: tz + 9,
      duration: 1.6, ease: 'power3.inOut',
      onUpdate: () => controlRef.current?.update?.(),
    });
    gsap.to(controlRef.current.target, {
      x: tx, y: 0.5, z: tz,
      duration: 1.6, ease: 'power3.inOut',
    });
  }, [selectedMachineId]);

  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.0,
      }}
      style={{ background: '#0f172a' }}
    >
      {/* ── Camera ── */}
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[0, 12, 22]}
        fov={52}
        near={0.1}
        far={200}
      />

      {/* ── Controls ── */}
      <OrbitControls
        ref={controlRef}
        minDistance={6}
        maxDistance={30}
        maxPolarAngle={Math.PI / 2.1}
        enableDamping
        dampingFactor={0.07}
      />

      {/* ── Atmospheric fog ── */}
      <fog attach="fog" args={['#0f172a', 15, 45]} />

      {/* ── HDR environment for reflections ── */}
      <Environment preset="warehouse" />

      {/* ── Lighting system ── */}
      <FactoryLighting />

      {/* ── Factory structure ── */}
      <FactoryFloor />
      <FactoryWalls />
      <FactoryCeiling />

      {/* ── Industrial props / set dressing ── */}
      <IndustrialProps />

      {/* ── Machines (unchanged) ── */}
      {MACHINE_CONFIGS.map((cfg) => (
        <MachineDigitalTwin
          key={cfg.id}
          id={cfg.id}
          label={cfg.label}
          position={cfg.position}
          data={machineData.find((d) => d.id === cfg.id)}
          isSelected={selectedMachineId === cfg.id}
          onSelect={onMachineSelect}
        />
      ))}
    </Canvas>
  );
}
