/**
 * machineStore.js
 * Central state and simulation engine for the Digital Twin dashboard.
 * Includes Socket.io-client placeholder for real-time data integration.
 */

// ─── Socket.io Placeholder ──────────────────────────────────────────────
// import { io } from 'socket.io-client';
// const socket = io('http://localhost:3001');
// socket.on('machine:update', (data) => onMachineUpdate(data));
// ────────────────────────────────────────────────────────────────────────

export const MACHINE_CONFIGS = [
  { id: 'M1', label: 'CNC Lathe #1',     position: [-5, 0.5, -4] },
  { id: 'M2', label: 'Press Unit #2',    position: [ 0, 0.5, -4] },
  { id: 'M3', label: 'Welding Bot #3',   position: [ 5, 0.5, -4] },
  { id: 'M4', label: 'Conveyor #4',      position: [-5, 0.5,  4] },
  { id: 'M5', label: 'Drill Station #5', position: [ 0, 0.5,  4] },
  { id: 'M6', label: 'Assembly #6',      position: [ 5, 0.5,  4] },
];

/** Derive status from failure risk */
export function getStatus(failureRisk) {
  if (failureRisk <= 30) return 'Healthy';
  if (failureRisk <= 80) return 'Warning';
  return 'Critical';
}

/** Status colour map */
export const STATUS_COLORS = {
  Healthy:  '#22c55e',
  Warning:  '#eab308',
  Critical: '#ef4444',
};

/** Hex → normalised [r, g, b] for Three.js Color */
export function hexToArray(hex) {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) / 255, ((n >> 8) & 0xff) / 255, (n & 0xff) / 255];
}

/** Generate one random telemetry snapshot */
export function generateTelemetry(prevData, criticalId) {
  return MACHINE_CONFIGS.map((cfg) => {
    const prev = prevData.find((d) => d.id === cfg.id);
    const isCritical = cfg.id === criticalId;

    const temp      = clamp((prev?.temperature ?? 65)  + rand(-6, 8),   40, 120);
    const vibration = clamp((prev?.vibration   ?? 0.5) + rand(-0.15, 0.2), 0, 3);
    const rpm       = clamp((prev?.rpm         ?? 1500)+ rand(-120, 150), 800, 3500);
    const humidity  = clamp((prev?.humidity    ?? 50)  + rand(-4, 4),   20, 90);

    let failureRisk = prev?.failureRisk ?? Math.floor(Math.random() * 30);
    if (isCritical) {
      failureRisk = clamp(failureRisk + rand(8, 18), 0, 100);
    } else {
      failureRisk = clamp(failureRisk + rand(-8, 10), 0, 90);
    }

    return {
      id: cfg.id,
      label: cfg.label,
      position: cfg.position,
      temperature: +temp.toFixed(1),
      vibration:   +vibration.toFixed(3),
      rpm:         Math.round(rpm),
      humidity:    +humidity.toFixed(1),
      failureRisk: Math.round(failureRisk),
      status:      getStatus(failureRisk),
    };
  });
}

/** Placeholder hook called when any machine data updates */
export function onMachineUpdate(machineData) {
  // Future: push to backend / socket
  // socket.emit('machine:ack', { id: machineData.id, ts: Date.now() });
  console.debug('[onMachineUpdate]', machineData);
}

// ─── Helpers ──────────────────────────────────────────────────────────────
function rand(min, max) { return Math.random() * (max - min) + min; }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
