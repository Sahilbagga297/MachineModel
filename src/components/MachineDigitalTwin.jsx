import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Box, Cylinder, Torus } from '@react-three/drei';
import { Color } from 'three';
import gsap from 'gsap';
import { STATUS_COLORS } from '../store/machineStore';

/**
 * MachineDigitalTwin — detailed industrial machine with pipes, panels, and status lighting.
 */
export default function MachineDigitalTwin({ id, label, position, data, isSelected, onSelect }) {
  const groupRef    = useRef();
  const bodyMatRef  = useRef();
  const glowRingRef = useRef();
  const pulseRef    = useRef(null);
  const [hovered, setHovered] = useState(false);

  const status      = data?.status      ?? 'Healthy';
  const failureRisk = data?.failureRisk ?? 0;
  const statusColor = STATUS_COLORS[status];

  // ── Colour transition ─────────────────────────────────────────────
  useEffect(() => {
    if (!bodyMatRef.current) return;
    const tc = new Color(statusColor);

    // Body tint — keep it metallic, just tint slightly
    gsap.to(bodyMatRef.current.color, {
      r: 0.12 + tc.r * 0.15,
      g: 0.12 + tc.g * 0.15,
      b: 0.12 + tc.b * 0.15,
      duration: 1.2, ease: 'power2.out',
    });

    // Emissive glow (visible contribution)
    const emIntensity = status === 'Critical' ? 0.55 : status === 'Warning' ? 0.25 : 0.0;
    gsap.to(bodyMatRef.current.emissive, {
      r: tc.r * emIntensity,
      g: tc.g * emIntensity,
      b: tc.b * emIntensity,
      duration: 1.2, ease: 'power2.out',
    });
  }, [status, statusColor]);

  // ── GSAP critical pulse ───────────────────────────────────────────
  useEffect(() => {
    if (!groupRef.current) return;
    if (pulseRef.current) { pulseRef.current.kill(); pulseRef.current = null; }

    if (status === 'Critical') {
      pulseRef.current = gsap.to(groupRef.current.scale, {
        x: 1.05, y: 1.08, z: 1.05,
        duration: 0.55, ease: 'sine.inOut',
        yoyo: true, repeat: -1,
      });
    } else {
      gsap.to(groupRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.5, ease: 'back.out(2)' });
    }
    return () => pulseRef.current?.kill();
  }, [status]);

  // ── Cursor & hover glow ───────────────────────────────────────────
  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
    if (!glowRingRef.current) return;
    gsap.to(glowRingRef.current, { opacity: hovered ? 0.7 : 0, duration: 0.25 });
  }, [hovered]);

  // ── Idle Y-bob ────────────────────────────────────────────────────
  useFrame(({ clock }) => {
    if (!groupRef.current || status === 'Critical') return;
    groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.7 + position[0]) * 0.025;
  });

  const isWarning  = status === 'Warning';
  const isCritical = status === 'Critical';

  return (
    <group position={position}>
      <group ref={groupRef}>
        {/* ── Base platform ── */}
        <RoundedBox args={[2.2, 0.15, 2.2]} position={[0, -0.43, 0]} radius={0.04} castShadow receiveShadow>
          <meshStandardMaterial color="#0d1a2e" roughness={0.7} metalness={0.5} />
        </RoundedBox>

        {/* ── Main body ── */}
        <RoundedBox
          args={[1.9, 0.85, 1.9]}
          position={[0, 0, 0]}
          radius={0.07}
          smoothness={4}
          castShadow
          receiveShadow
          onClick={(e) => { e.stopPropagation(); onSelect(id); }}
          onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
          onPointerOut={() => setHovered(false)}
        >
          <meshStandardMaterial
            ref={bodyMatRef}
            color="#1e2a3a"
            roughness={0.3}
            metalness={0.8}
            envMapIntensity={1.2}
          />
        </RoundedBox>

        {/* ── Top control panel ── */}
        <RoundedBox args={[1.5, 0.18, 1.2]} position={[0, 0.51, -0.2]} radius={0.04} castShadow>
          <meshStandardMaterial color="#0a151f" roughness={0.5} metalness={0.6} />
        </RoundedBox>

        {/* ── Status light cluster ── */}
        <StatusLights status={status} statusColor={statusColor} />

        {/* ── Side pipes ── */}
        <Pipe position={[-1.05, -0.1, 0.3]} />
        <Pipe position={[ 1.05, -0.1, 0.3]} />

        {/* ── Front vent grill ── */}
        {[-0.4, 0, 0.4].map((x, i) => (
          <Box key={i} args={[0.06, 0.5, 0.015]} position={[x, -0.05, 0.96]}>
            <meshStandardMaterial color="#0a1520" roughness={0.8} metalness={0.3} />
          </Box>
        ))}

        {/* ── Spinning rotor (visible for warning/critical) ── */}
        {(isWarning || isCritical) && (
          <RotorDisc color={statusColor} />
        )}

        {/* ── Hover / select glow ring ── */}
        <mesh ref={glowRingRef} position={[0, -0.35, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.1, 1.45, 32]} />
          <meshBasicMaterial color={statusColor} transparent opacity={0} depthWrite={false} />
        </mesh>

        {/* ── Selection ring ── */}
        {isSelected && (
          <mesh position={[0, -0.34, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.15, 1.28, 48]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.95} depthWrite={false} />
          </mesh>
        )}
      </group>

      {/* ── Per-machine environment light ── */}
      <pointLight
        position={[0, 4, 0]}
        color={statusColor}
        intensity={isCritical ? 3.5 : isWarning ? 1.5 : 0.6}
        distance={6}
      />
    </group>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────

function StatusLights({ status, statusColor }) {
  const dotRef = useRef();

  useFrame(({ clock }) => {
    if (!dotRef.current) return;
    if (status === 'Critical') {
      dotRef.current.material.emissiveIntensity = 2.5 + Math.sin(clock.getElapsedTime() * 6) * 1.5;
    } else if (status === 'Warning') {
      dotRef.current.material.emissiveIntensity = 1.5 + Math.sin(clock.getElapsedTime() * 3) * 0.5;
    } else {
      dotRef.current.material.emissiveIntensity = 1.2;
    }
  });

  return (
    <>
      {/* Main indicator dome */}
      <mesh ref={dotRef} position={[0.5, 0.68, -0.55]}>
        <sphereGeometry args={[0.075, 16, 16]} />
        <meshStandardMaterial
          color={statusColor}
          emissive={statusColor}
          emissiveIntensity={1.5}
          roughness={0}
          metalness={0}
        />
      </mesh>
      {/* Small row of indicator LEDs */}
      {[0, 0.15, 0.30].map((offset, i) => (
        <mesh key={i} position={[-0.45 + offset, 0.63, -0.56]}>
          <boxGeometry args={[0.07, 0.04, 0.02]} />
          <meshStandardMaterial
            color={i === 0 ? '#22c55e' : i === 1 ? '#eab308' : '#ef4444'}
            emissive={i === 0 ? '#22c55e' : i === 1 ? '#eab308' : '#ef4444'}
            emissiveIntensity={
              i === 0 && status === 'Healthy' ? 2 :
              i === 1 && status === 'Warning'  ? 2 :
              i === 2 && status === 'Critical' ? 2 : 0.2
            }
          />
        </mesh>
      ))}
    </>
  );
}

function Pipe({ position }) {
  return (
    <group position={position}>
      <Cylinder args={[0.055, 0.055, 0.7, 8]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#1a2535" roughness={0.4} metalness={0.9} />
      </Cylinder>
      {/* Pipe collar */}
      <Torus args={[0.065, 0.025, 8, 16]} position={[0, 0, 0.18]}>
        <meshStandardMaterial color="#0f1e30" roughness={0.5} metalness={0.7} />
      </Torus>
    </group>
  );
}

function RotorDisc({ color }) {
  const ref = useRef();
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 2.5;
  });
  return (
    <group ref={ref} position={[0, 0.56, 0]}>
      <Cylinder args={[0.28, 0.28, 0.05, 6]} castShadow>
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.9} emissive={color} emissiveIntensity={0.3} />
      </Cylinder>
    </group>
  );
}
