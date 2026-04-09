import React, { useState, useEffect, useCallback, useRef } from 'react';
import FactoryScene    from './components/FactoryScene';
import ControlPanel    from './components/ControlPanel';
import AlertSystem     from './components/AlertSystem';
import DashboardNavbar from './components/DashboardNavbar';
import AnalyticsPanel  from './components/AnalyticsPanel';
import { MACHINE_CONFIGS, generateTelemetry, onMachineUpdate, STATUS_COLORS } from './store/machineStore';

const initialData = generateTelemetry([], null);

export default function App() {
  const [machineData, setMachineData]       = useState(initialData);
  const [selectedId,  setSelectedId]        = useState(null);
  const [criticalTarget, setCriticalTarget] = useState(null);
  const cycleRef = useRef(0);

  // ── Simulation engine ────────────────────────────────────────────
  useEffect(() => {
    const iv = setInterval(() => {
      cycleRef.current++;
      if (cycleRef.current % 5 === 0) {
        const pick = MACHINE_CONFIGS[Math.floor(Math.random() * MACHINE_CONFIGS.length)].id;
        setCriticalTarget(pick);
      }
      setMachineData((prev) => {
        const next = generateTelemetry(prev, criticalTarget);
        next.forEach(onMachineUpdate);
        return next;
      });
    }, 800);
    return () => clearInterval(iv);
  }, [criticalTarget]);

  const handleSelect  = useCallback((id) => setSelectedId((p) => (p === id ? null : id)), []);
  const handleClose   = useCallback(() => setSelectedId(null), []);
  const selectedMachine = machineData.find((m) => m.id === selectedId) ?? null;

  return (
    <div className="w-full h-full relative overflow-hidden" style={{ background: '#060e1c' }}>
      {/* Top bar */}
      <DashboardNavbar machineData={machineData} />

      {/* 3-D canvas */}
      <div className="absolute" style={{ top: 56, left: 64, right: selectedId ? 300 : 0, bottom: 210 }}>
        <FactoryScene
          machineData={machineData}
          selectedMachineId={selectedId}
          onMachineSelect={handleSelect}
        />
      </div>

      {/* Left machine list sidebar */}
      <MachineSidebar machineData={machineData} selectedId={selectedId} onSelect={handleSelect} />

      {/* Right detail panel */}
      <ControlPanel machine={selectedMachine} onClose={handleClose} />

      {/* Alerts */}
      <AlertSystem machineData={machineData} />

      {/* Bottom charts */}
      <AnalyticsPanel machineData={machineData} selectedId={selectedId} />
    </div>
  );
}

// ── Left compact sidebar ──────────────────────────────────────────────────
function MachineSidebar({ machineData, selectedId, onSelect }) {
  const STATUS_COLOR = { Healthy: '#22c55e', Warning: '#eab308', Critical: '#ef4444' };

  return (
    <div
      className="fixed left-0 z-30 flex flex-col gap-1.5 py-3 px-1.5 overflow-y-auto"
      style={{
        top: 56, bottom: 210, width: 64,
        background: 'rgba(6,14,28,0.95)',
        backdropFilter: 'blur(16px)',
        borderRight: '1px solid #0f2a45',
      }}
    >
      {machineData.map((m) => {
        const active = m.id === selectedId;
        const c = STATUS_COLOR[m.status];
        const isCritical = m.status === 'Critical';

        return (
          <button
            key={m.id}
            onClick={() => onSelect(m.id)}
            title={m.label}
            className="flex flex-col items-center gap-1 py-2 px-1 rounded-xl transition-all"
            style={{
              background: active ? `${c}18` : 'transparent',
              border: `1px solid ${active ? c + '55' : 'transparent'}`,
              boxShadow: active ? `0 0 12px ${c}20` : 'none',
            }}
          >
            {/* ID button */}
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-[11px] font-bold"
              style={{
                background: `${c}22`,
                color: c,
                boxShadow: isCritical ? `0 0 10px ${c}60` : 'none',
              }}
            >
              {m.id}
            </div>
            {/* Status dot */}
            <div
              className="w-2 h-2 rounded-full"
              style={{
                background: c,
                boxShadow: isCritical ? `0 0 6px ${c}` : 'none',
                animation: isCritical ? 'pulse 1.5s ease-in-out infinite' : 'none',
              }}
            />
            {/* Risk % tiny */}
            <span className="text-[8px] font-mono" style={{ color: c }}>
              {m.failureRisk}%
            </span>
          </button>
        );
      })}

      {/* Separator */}
      <div className="w-8 h-px mx-auto bg-slate-800 my-1" />

      {/* Add more hint */}
      <div className="flex items-center justify-center opacity-25 hover:opacity-40 transition-opacity cursor-default">
        <div className="w-9 h-9 rounded-xl border border-dashed border-slate-600 flex items-center justify-center text-slate-500 text-lg">+</div>
      </div>
    </div>
  );
}
