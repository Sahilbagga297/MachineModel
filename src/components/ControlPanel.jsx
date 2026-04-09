import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { STATUS_COLORS } from '../store/machineStore';

export default function ControlPanel({ machine, onClose }) {
  const panelRef = useRef();
  const prevMachineId = useRef(null);

  useEffect(() => {
    if (!panelRef.current) return;
    const isOpen = !!machine;
    gsap.to(panelRef.current, {
      x: isOpen ? '0%' : '105%',
      opacity: isOpen ? 1 : 0,
      duration: 0.5,
      ease: isOpen ? 'power3.out' : 'power3.in',
    });
  }, [machine]);

  // Animate values when machine changes
  useEffect(() => {
    prevMachineId.current = machine?.id ?? null;
  }, [machine?.id]);

  if (!machine) {
    return (
      <div
        ref={panelRef}
        style={{ transform: 'translateX(105%)', opacity: 0, position: 'fixed', top: 56, right: 0, width: 300, bottom: 220, zIndex: 30 }}
      />
    );
  }

  const color = STATUS_COLORS[machine.status];

  return (
    <div
      ref={panelRef}
      className="fixed z-30 flex flex-col overflow-y-auto"
      style={{
        top: 56, right: 0, width: 300, bottom: 220,
        background: 'rgba(8,15,28,0.96)',
        backdropFilter: 'blur(20px)',
        borderLeft: `1px solid ${color}30`,
        boxShadow: `-6px 0 40px rgba(0,0,0,0.5), inset -1px 0 0 ${color}20`,
      }}
    >
      {/* Accent top stripe */}
      <div className="h-1 w-full flex-shrink-0" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />

      <div className="flex flex-col gap-3 p-4 flex-1">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] mb-1" style={{ color: color }}>Machine Details</p>
            <h2 className="text-lg font-bold text-white leading-tight">{machine.label}</h2>
            <p className="text-xs text-slate-500 mt-0.5 font-mono">ID: {machine.id}</p>
          </div>
          <button
            onClick={onClose}
            className="mt-1 w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-white hover:bg-slate-700 transition-all text-sm"
          >✕</button>
        </div>

        {/* Status row */}
        <div
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
          style={{ background: `${color}15`, border: `1px solid ${color}40` }}
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: color }} />
            <span className="relative inline-flex rounded-full h-3 w-3" style={{ background: color }} />
          </span>
          <span className="text-sm font-semibold tracking-wide" style={{ color }}>{machine.status}</span>
          <span className="ml-auto text-xs text-slate-500">Live</span>
        </div>

        {/* Failure risk gauge */}
        <FailureRingGauge value={machine.failureRisk} color={color} />

        {/* 2×2 metrics */}
        <div className="grid grid-cols-2 gap-2">
          <AnimatedMetric label="Temperature" value={`${machine.temperature}°C`} icon="🌡️" color={color} />
          <AnimatedMetric label="Vibration"   value={`${machine.vibration} g`}   icon="📳" color={color} />
          <AnimatedMetric label="RPM"         value={machine.rpm.toLocaleString()} icon="⚙️" color={color} />
          <AnimatedMetric label="Humidity"    value={`${machine.humidity}%`}      icon="💧" color={color} />
        </div>

        {/* Sensor bars */}
        <div className="space-y-2.5">
          <p className="text-xs text-slate-600 uppercase tracking-widest">Sensor Levels</p>
          <GaugeBar label="Temp"     value={machine.temperature} min={40}  max={120}  color={color} unit="°C" />
          <GaugeBar label="Vibr"     value={machine.vibration}   min={0}   max={3}    color={color} unit="g" precision={2} />
          <GaugeBar label="RPM"      value={machine.rpm}         min={800} max={3500} color={color} unit="" />
          <GaugeBar label="Humidity" value={machine.humidity}    min={20}  max={90}   color={color} unit="%" />
        </div>

        {/* Maintenance hint */}
        <div
          className="rounded-xl p-3 text-xs"
          style={{ background: '#0f172a', border: '1px solid #1e3a5f' }}
        >
          <p className="text-slate-500 mb-1 uppercase tracking-widest text-[10px]">AI Recommendation</p>
          <p className="text-slate-300">
            {machine.status === 'Critical'
              ? '⚠️ Schedule immediate maintenance. Failure risk is dangerously high.'
              : machine.status === 'Warning'
              ? '🔧 Plan maintenance within 48 hours to prevent failure.'
              : '✅ Machine operating within normal parameters.'}
          </p>
        </div>
      </div>

      <div className="p-3 border-t border-slate-800 flex-shrink-0">
        <p className="text-[10px] text-slate-600 text-center tracking-wider">
          ● TELEMETRY LIVE · UPDATES EVERY 2s
        </p>
      </div>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────

function AnimatedMetric({ label, value, icon, color }) {
  const valRef = useRef();
  useEffect(() => {
    if (!valRef.current) return;
    gsap.fromTo(valRef.current, { opacity: 0.3, y: -5 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
  }, [value]);

  return (
    <div className="rounded-xl p-3 flex flex-col gap-1" style={{ background: '#0d1626', border: '1px solid #1e3a5f' }}>
      <div className="flex items-center justify-between">
        <span className="text-base">{icon}</span>
        <span ref={valRef} className="text-sm font-bold" style={{ color }}>{value}</span>
      </div>
      <p className="text-[10px] text-slate-600 uppercase tracking-wider">{label}</p>
    </div>
  );
}

function GaugeBar({ label, value, min, max, color, unit, precision }) {
  const pct    = Math.round(((value - min) / (max - min)) * 100);
  const fillRef = useRef();

  useEffect(() => {
    if (!fillRef.current) return;
    gsap.to(fillRef.current, { width: `${Math.min(pct, 100)}%`, duration: 0.9, ease: 'power2.out' });
  }, [pct]);

  const displayVal = precision != null ? value.toFixed(precision) : value;

  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-500">{label}</span>
        <span className="text-slate-300 font-medium">{displayVal}{unit}</span>
      </div>
      <div className="h-1.5 rounded-full w-full" style={{ background: '#1e3a5f' }}>
        <div
          ref={fillRef}
          className="h-1.5 rounded-full"
          style={{ width: '0%', background: `linear-gradient(90deg, ${color}aa, ${color})`, boxShadow: `0 0 8px ${color}66` }}
        />
      </div>
    </div>
  );
}

function FailureRingGauge({ value, color }) {
  const R    = 44;
  const circ = 2 * Math.PI * R;
  const ref  = useRef();

  useEffect(() => {
    if (!ref.current) return;
    const target = circ - (Math.min(value, 100) / 100) * circ;
    gsap.to(ref.current, { strokeDashoffset: target, duration: 1.2, ease: 'power2.out' });
  }, [value, circ]);

  // background arc gradient based on risk
  const bgColor = value > 70 ? '#ef444420' : value > 30 ? '#eab30820' : '#22c55e20';

  return (
    <div className="flex flex-col items-center py-1">
      <svg width={108} height={108} viewBox="0 0 108 108">
        <circle cx={54} cy={54} r={R} fill="none" stroke="#0f1e30" strokeWidth={11} />
        <circle cx={54} cy={54} r={R} fill="none" stroke={bgColor} strokeWidth={11} />
        <circle
          ref={ref}
          cx={54} cy={54} r={R}
          fill="none"
          stroke={color}
          strokeWidth={11}
          strokeLinecap="round"
          strokeDasharray={`${circ}`}
          strokeDashoffset={`${circ}`}
          transform="rotate(-90 54 54)"
          style={{ filter: `drop-shadow(0 0 8px ${color})`, transition: 'none' }}
        />
        <text x={54} y={49} textAnchor="middle" fill="white" fontSize={20} fontWeight="700" fontFamily="Inter, sans-serif">
          {value}%
        </text>
        <text x={54} y={64} textAnchor="middle" fill="#64748b" fontSize={9} letterSpacing={1.5}>
          FAILURE RISK
        </text>
      </svg>
    </div>
  );
}
