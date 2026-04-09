import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function AlertSystem({ machineData }) {
  const [alerts, setAlerts] = React.useState([]);
  const seenRef = useRef(new Set());

  useEffect(() => {
    machineData.forEach((m) => {
      const bucket = Math.floor(m.failureRisk / 5);
      const key    = `${m.id}-${bucket}`;
      if (m.failureRisk > 70 && !seenRef.current.has(key)) {
        seenRef.current.add(key);
        const alert = {
          id:        `${m.id}-${Date.now()}`,
          machineId: m.id,
          label:     m.label,
          risk:      m.failureRisk,
          ts:        new Date().toLocaleTimeString(),
        };
        setAlerts((prev) => [alert, ...prev].slice(0, 5));
        setTimeout(() => {
          setAlerts((prev) => prev.filter((a) => a.id !== alert.id));
        }, 7000);
      }
    });
  }, [machineData]);

  return (
    <div
      className="fixed z-50 flex flex-col gap-2 pointer-events-none"
      style={{ top: 68, right: 8, width: 296 }}
    >
      {alerts.map((alert) => (
        <AlertToast
          key={alert.id}
          alert={alert}
          onDismiss={(id) => setAlerts((prev) => prev.filter((a) => a.id !== id))}
        />
      ))}
    </div>
  );
}

function AlertToast({ alert, onDismiss }) {
  const ref = useRef();

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(ref.current,
      { x: 320, opacity: 0, scale: 0.9 },
      { x: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.4)' }
    );
  }, []);

  const dismiss = () => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      x: 320, opacity: 0, scale: 0.8, duration: 0.35, ease: 'power3.in',
      onComplete: () => onDismiss(alert.id),
    });
  };

  return (
    <div
      ref={ref}
      className="pointer-events-auto rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(10,15,28,0.97)',
        border: '1px solid #ef444455',
        boxShadow: '0 0 40px #ef444430, 0 8px 32px rgba(0,0,0,0.6)',
      }}
    >
      {/* Top gradient bar */}
      <div className="h-0.5" style={{ background: 'linear-gradient(90deg, #ef4444, #f97316, #ef4444)' }} />

      <div className="p-3.5 flex gap-3 items-start">
        {/* Animated icon */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: '#ef444420', border: '1px solid #ef444440' }}
        >
          ⚠️
        </div>

        {/* Body */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xs font-bold text-red-400 uppercase tracking-widest">Critical Alert</span>
            <span className="text-[10px] text-slate-600 ml-auto">{alert.ts}</span>
          </div>
          <p className="text-sm font-semibold text-white leading-tight">{alert.label}</p>
          <p className="text-xs text-slate-400 mt-1">
            Failure risk: <span className="text-red-400 font-bold">{alert.risk}%</span>
          </p>
          <p className="text-xs text-slate-600 mt-0.5">Immediate maintenance required</p>
        </div>

        <button
          onClick={dismiss}
          className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded text-slate-600 hover:text-white hover:bg-slate-700 transition-all text-xs mt-0.5"
        >✕</button>
      </div>

      {/* Timer progress bar */}
      <TimerBar color="#ef4444" duration={7000} />
    </div>
  );
}

function TimerBar({ color, duration }) {
  const ref = useRef();
  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(ref.current,
      { scaleX: 1, transformOrigin: 'left center' },
      { scaleX: 0, duration: duration / 1000, ease: 'none' }
    );
  }, []);

  return (
    <div className="h-0.5 mx-3.5 mb-3 rounded-full" style={{ background: '#1e293b' }}>
      <div ref={ref} className="h-full rounded-full" style={{ background: color, opacity: 0.5 }} />
    </div>
  );
}
