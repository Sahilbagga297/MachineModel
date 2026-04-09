import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function DashboardNavbar({ machineData }) {
  const healthy  = machineData.filter((m) => m.status === 'Healthy').length;
  const warning  = machineData.filter((m) => m.status === 'Warning').length;
  const critical = machineData.filter((m) => m.status === 'Critical').length;
  const total    = machineData.length;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 flex items-center px-5 gap-4"
      style={{
        height: 56,
        background: 'rgba(6,14,28,0.97)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #0f2a45',
        boxShadow: '0 1px 40px rgba(56,189,248,0.06)',
      }}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold"
          style={{
            background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
            boxShadow: '0 0 18px #0ea5e944',
          }}
        >⚡</div>
        <div className="leading-none">
          <div className="text-sm font-extrabold tracking-tight">
            <span className="text-white">SmartMaintain</span>
            <span style={{ color: '#38bdf8' }}> AI</span>
          </div>
          <div className="text-[10px] tracking-[0.18em] uppercase mt-0.5" style={{ color: '#2d5c7a' }}>
            Digital Twin v2.0
          </div>
        </div>
      </div>

      {/* Separator */}
      <div className="w-px h-7 bg-slate-800 mx-1 flex-shrink-0" />

      {/* Stats */}
      <div className="flex items-center gap-2 flex-1 overflow-x-auto">
        <NavStat label="Total"    value={total}    accent="#38bdf8" icon="🏭" />
        <NavStat label="Healthy"  value={healthy}  accent="#22c55e" icon="✅" />
        <NavStat label="Warning"  value={warning}  accent="#eab308" icon="⚠️"  pulse={warning > 0} />
        <NavStat label="Critical" value={critical} accent="#ef4444" icon="🔴" pulse={critical > 0} />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 flex-shrink-0 ml-auto">
        {/* Socket.io connection badge (placeholder) */}
        <div
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
          style={{ background: '#22c55e12', border: '1px solid #22c55e30', color: '#22c55e' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 blink" />
          LIVE
        </div>

        {/* Uptime */}
        <Uptime />

        {/* Clock */}
        <LiveClock />
      </div>
    </header>
  );
}

function NavStat({ label, value, accent, icon, pulse }) {
  const numRef = useRef();
  const prevVal = useRef(value);

  useEffect(() => {
    if (prevVal.current === value || !numRef.current) return;
    prevVal.current = value;
    gsap.fromTo(numRef.current,
      { opacity: 0.4, y: -8, scale: 0.8 },
      { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(2)' }
    );
  }, [value]);

  return (
    <div
      className="flex items-center gap-2 px-3 py-1.5 rounded-xl flex-shrink-0"
      style={{ background: `${accent}10`, border: `1px solid ${accent}28` }}
    >
      <span className={`text-sm ${pulse ? 'blink' : ''}`}>{icon}</span>
      <div className="leading-none">
        <span ref={numRef} className="text-base font-bold" style={{ color: accent }}>{value}</span>
        <span className="text-[10px] text-slate-600 ml-1.5 uppercase tracking-wider">{label}</span>
      </div>
    </div>
  );
}

function Uptime() {
  const [secs, setSecs] = React.useState(0);
  useEffect(() => {
    const t = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const hh = String(Math.floor(secs / 3600)).padStart(2, '0');
  const mm = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
  const ss = String(secs % 60).padStart(2, '0');
  return (
    <div className="text-xs font-mono text-slate-500">
      {hh}:{mm}:{ss}
    </div>
  );
}

function LiveClock() {
  const [time, setTime] = React.useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="text-xs font-mono text-slate-400">
      {time.toLocaleTimeString()}
    </div>
  );
}
