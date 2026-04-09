import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
} from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

import MachineDigitalTwin    from './MachineDigitalTwin';
import FactoryFloor          from './FactoryFloor';
import FactoryWalls          from './FactoryWalls';
import FactoryCeiling        from './FactoryCeiling';
import FactoryLighting       from './FactoryLighting';
import IndustrialProps       from './IndustrialProps';
import FactoryRoof           from './FactoryRoof';
import FactoryEntranceFrame  from './FactoryEntranceFrame';
import FactorySignBoard      from './FactorySignBoard';
import RoofLighting          from './RoofLighting';
import { MACHINE_CONFIGS }   from '../store/machineStore';

export default function FactoryScene({ machineData, selectedMachineId, onMachineSelect }) {
  const cameraRef  = useRef();
  const controlRef = useRef();

  // ── Camera fly-to on selected machine ────────────────────────────
  useEffect(() => {
    const m = machineData.find((d) => d.id === selectedMachineId);
    if (!m || !cameraRef.current || !controlRef.current) return;
    const [tx, , tz] = m.position;

    gsap.to(cameraRef.current.position, {
      x: tx + 4, y: 5, z: tz + 8,
      duration: 1.6, ease: 'power3.inOut',
      onUpdate: () => controlRef.current?.update?.(),
    });
    gsap.to(controlRef.current.target, {
      x: tx, y: 1.0, z: tz,
      duration: 1.6, ease: 'power3.inOut',
    });
  }, [selectedMachineId]);

  return (
    <Canvas
      shadows={{ type: THREE.PCFShadowMap }}
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.NoToneMapping,
        toneMappingExposure: 1.0,
      }}
      style={{ background: '#0f172a' }}
    >
      {/* ── Camera – high and back to see full factory including machines ── */}
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[0, 8, 22]}
        fov={55}
        near={0.1}
        far={200}
      />

      {/* ── Controls – target machine floor level ── */}
      <OrbitControls
        ref={controlRef}
        target={[0, 1.5, 0]}
        minDistance={8}
        maxDistance={40}
        maxPolarAngle={Math.PI / 2.1}
        enableDamping
        dampingFactor={0.07}
      />

      {/* ── Atmospheric fog – pushed far out so machines stay clear ── */}
      <fog attach="fog" args={['#0f172a', 35, 80]} />

      {/* ── Environment for PBR metalness reflections only, low intensity ── */}
      <Environment preset="warehouse" environmentIntensity={0.3} />

      {/* ── Existing lighting system ── */}
      <FactoryLighting />

      {/* ── Additional under-roof ceiling lights ── */}
      <RoofLighting />

      {/* ── Factory structure (existing – unchanged) ── */}
      <FactoryFloor />
      <FactoryWalls />
      <FactoryCeiling />

      {/* ── Architectural finishing elements ── */}
      <FactoryRoof />
      <FactoryEntranceFrame />
      <FactorySignBoard />

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

