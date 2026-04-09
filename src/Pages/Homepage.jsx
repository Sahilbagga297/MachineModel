import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  AlertTriangle, DollarSign, Clock, ArrowRight, Cpu, Wifi,
  Database, Brain, Bell, BarChart2, Shield, Zap, Settings,
  TrendingDown, Activity, ChevronRight, Monitor,
} from 'lucide-react';
import Navbar from '../components/Navbar.jsx';

gsap.registerPlugin(ScrollTrigger);

/* ── Reusable styled helpers ─────────────────────────────────── */
const S = {
  section: {
    padding: '100px 0',
    position: 'relative',
  },
  container: {
    maxWidth: 1140,
    margin: '0 auto',
    padding: '0 32px',
  },
  badge: (color = '#38bdf8') => ({
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '6px 14px',
    background: `${color}15`,
    border: `1px solid ${color}35`,
    borderRadius: 20,
    fontSize: 11, fontWeight: 600, color,
    letterSpacing: '0.18em', textTransform: 'uppercase',
    marginBottom: 20,
  }),
  h2: {
    fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800,
    color: '#f1f5f9', letterSpacing: '-0.5px', margin: '0 0 16px',
  },
  sub: {
    fontSize: 17, color: '#64748b', lineHeight: 1.7, margin: '0 0 48px',
  },
  card: (glowColor = '#38bdf8') => ({
    background: 'rgba(13,22,38,0.85)',
    border: `1px solid rgba(56,189,248,0.1)`,
    borderRadius: 20,
    padding: 28,
    transition: 'all 0.35s ease',
    cursor: 'default',
    position: 'relative',
    overflow: 'hidden',
  }),
};

/* ── Animated Section Wrapper ─────────────────────────────────── */
function AnimSection({ children, id, style }) {
  const ref = useRef();
  useEffect(() => {
    const el = ref.current;
    gsap.fromTo(el,
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 82%', once: true },
      }
    );
    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);
  return <section ref={ref} id={id} style={{ opacity: 0, ...S.section, ...style }}>{children}</section>;
}

/* ② Problem cards data */
const PROBLEMS = [
  { icon: <Clock size={28} />,         color: '#ef4444', title: 'Unexpected Downtime',   desc: 'Unplanned outages cost manufacturers an average of $260,000 per hour in lost production and recovery time.' },
  { icon: <DollarSign size={28} />,    color: '#eab308', title: 'Skyrocketing Costs',    desc: 'Reactive maintenance costs 3–9× more than planned maintenance, draining capital and eroding profit margins.' },
  { icon: <AlertTriangle size={28} />, color: '#f97316', title: 'Cascade Failures',      desc: 'One failing machine triggers chain reactions across the entire production line, multiplying damage exponentially.' },
];

/* ③ Flowchart steps */
const FLOW = [
  { icon: <Wifi size={22} />,     color: '#06b6d4', label: 'IoT Sensors',          desc: 'Vibration, temp, RPM, humidity' },
  { icon: <Database size={22} />, color: '#8b5cf6', label: 'Data Collection',       desc: 'Real-time ingestion pipeline' },
  { icon: <Brain size={22} />,    color: '#ec4899', label: 'AI Model',              desc: 'LSTM anomaly detection' },
  { icon: <Zap size={22} />,      color: '#f59e0b', label: 'Failure Prediction',    desc: 'Risk score & root cause' },
  { icon: <Bell size={22} />,     color: '#22c55e', label: 'Alert & Schedule',      desc: 'Auto maintenance ticket' },
];

/* ④ Stats */
const STATS = [
  { value: '45%',    label: 'Downtime Reduction',   color: '#22c55e', icon: <TrendingDown size={20} /> },
  { value: '25%',    label: 'Maintenance Cost Saved', color: '#38bdf8', icon: <DollarSign size={20} /> },
  { value: '83%',    label: 'Failures Prevented',    color: '#a78bfa', icon: <Shield size={20} /> },
  { value: '3.7×',   label: 'ROI Multiplier',        color: '#f97316', icon: <BarChart2 size={20} /> },
];

/* ⑤ Architecture nodes */
const ARCH = [
  { icon: <Wifi size={20} />,     color: '#06b6d4', label: 'IoT Sensors',    sub: '6+ sensor types' },
  { icon: <Database size={20} />, color: '#8b5cf6', label: 'Backend API',    sub: 'Node.js / FastAPI' },
  { icon: <Brain size={20} />,    color: '#ec4899', label: 'ML Engine',      sub: 'TensorFlow / PyTorch' },
  { icon: <Monitor size={20} />,  color: '#38bdf8', label: '3D Dashboard',   sub: 'React Three Fiber' },
  { icon: <Bell size={20} />,     color: '#22c55e', label: 'Alert System',   sub: 'GSAP + Socket.io' },
];

/* ⑥ Features */
const FEATURES = [
  { icon: <Activity size={22} />,   color: '#38bdf8', title: 'Real-Time Monitoring',    desc: 'Live telemetry streams from all machines with sub-second latency updates.' },
  { icon: <Brain size={22} />,      color: '#8b5cf6', title: 'AI Failure Prediction',   desc: 'LSTM neural networks predict failures 72+ hours in advance with high accuracy.' },
  { icon: <AlertTriangle size={22}/>,color: '#f97316', title: 'Root Cause Detection',   desc: 'Pinpoints the exact sensor anomaly triggering risk escalation automatically.' },
  { icon: <Bell size={22} />,       color: '#22c55e', title: 'Priority Scheduling',     desc: 'Auto-generate maintenance work orders ranked by urgency and impact.' },
  { icon: <Settings size={22} />,   color: '#ec4899', title: 'Multi-Machine Control',   desc: 'Monitor and manage an entire factory floor from a single 3D dashboard.' },
  { icon: <Cpu size={22} />,        color: '#f59e0b', title: 'Digital Twin Engine',     desc: 'Full 3D replica of factory floor with real-time status overlays per machine.' },
];

/* ── Component ──────────────────────────────────────────────────── */
export default function Homepage() {
  const navigate   = useNavigate();
  const heroRef    = useRef();
  const titleRef   = useRef();
  const subRef     = useRef();
  const btnRef     = useRef();
  const gridRef    = useRef();

  /* Hero GSAP entrance */
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo(gridRef.current,  { opacity: 0 }, { opacity: 1, duration: 1.5 })
      .fromTo(titleRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.9 }, '-=1')
      .fromTo(subRef.current,   { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
      .fromTo(btnRef.current,   { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.5 }, '-=0.3');

    /* Stat counters */
    document.querySelectorAll('[data-count]').forEach(el => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          const target = el.getAttribute('data-count');
          const isFloat = target.includes('.');
          const num = parseFloat(target);
          gsap.fromTo({ v: 0 }, { v: num }, {
            duration: 1.8, ease: 'power2.out',
            onUpdate: function () { el.textContent = isFloat ? this.targets()[0].v.toFixed(1) + '×' : Math.round(this.targets()[0].v) + (target.endsWith('%') ? '%' : ''); }
          });
        }
      });
    });
  }, []);

  const goToDashboard = () => navigate('/dashboard');

  return (
    <div style={{
      background: '#060e1c',
      minHeight: '100vh',
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      color: '#f1f5f9',
      overflowX: 'hidden',
    }}>
      <Navbar />

      {/* ════════════════════════ ① HERO ════════════════════════ */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        position: 'relative', overflow: 'hidden', paddingTop: 64,
      }}>
        {/* Grid bg */}
        <div ref={gridRef} style={{
          position: 'absolute', inset: 0, opacity: 0,
          backgroundImage:
            'linear-gradient(rgba(56,189,248,0.04) 1px, transparent 1px),' +
            'linear-gradient(90deg, rgba(56,189,248,0.04) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        {/* Glow orbs */}
        <div style={{
          position: 'absolute', top: '20%', left: '15%',
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '20%', right: '10%',
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ ...S.container, zIndex: 1, textAlign: 'center', width: '100%' }}>
          <div style={S.badge()}>
            <Cpu size={12} />  AI-Powered Industrial Platform
          </div>

          <h1 ref={titleRef} style={{
            fontSize: 'clamp(36px, 6vw, 76px)', fontWeight: 900,
            letterSpacing: '-2px', lineHeight: 1.05,
            margin: '0 auto 24px', maxWidth: 900,
            background: 'linear-gradient(135deg, #f1f5f9 30%, #38bdf8 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            opacity: 0,
          }}>
            AI-Powered Predictive<br />Maintenance System
          </h1>

          <p ref={subRef} style={{
            fontSize: 'clamp(16px, 2vw, 20px)', color: '#64748b',
            maxWidth: 600, margin: '0 auto 48px', lineHeight: 1.7, opacity: 0,
          }}>
            Prevent machine failures before they happen. Monitor your factory floor in real-time with a full 3D digital twin powered by AI prediction models.
          </p>

          <div ref={btnRef} style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', opacity: 0 }}>
            <HeroButton onClick={goToDashboard} primary>
              <LayoutDashboardIcon /> Open Dashboard <ArrowRight size={18} />
            </HeroButton>
            <HeroButton onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
              How It Works
            </HeroButton>
          </div>

          {/* Floating metric badges */}
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 64, flexWrap: 'wrap' }}>
            {[
              { label: 'Machines Monitored', value: '6', color: '#38bdf8' },
              { label: 'Update Frequency',   value: '800ms', color: '#22c55e' },
              { label: 'AI Accuracy',        value: '96.2%', color: '#a78bfa' },
            ].map((item) => (
              <div key={item.label} style={{
                padding: '12px 24px',
                background: 'rgba(13,22,38,0.85)',
                border: `1px solid ${item.color}25`,
                borderRadius: 14, textAlign: 'center',
                backdropFilter: 'blur(10px)',
              }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: item.color, fontFamily: 'monospace' }}>{item.value}</div>
                <div style={{ fontSize: 11, color: '#475569', letterSpacing: '0.1em' }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          color: '#1e3a5f', fontSize: 10, letterSpacing: '0.2em',
          animation: 'float 2s ease-in-out infinite',
        }}>
          <span>SCROLL</span>
          <ChevronRight size={16} style={{ transform: 'rotate(90deg)' }} />
        </div>
      </section>

      {/* ════════════════════ ② PROBLEM STATEMENT ════════════════════ */}
      <AnimSection style={{ background: 'rgba(255,255,255,0.01)' }}>
        <div style={S.container}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={S.badge('#ef4444')}>⚠ The Problem</div>
            <h2 style={S.h2}>Manufacturing is Plagued by Reactive Maintenance</h2>
            <p style={{ ...S.sub, maxWidth: 580, margin: '0 auto' }}>
              Every minute of unplanned downtime costs manufacturers thousands. Reactive strategies are broken.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {PROBLEMS.map((p) => (
              <ProblemCard key={p.title} {...p} />
            ))}
          </div>
        </div>
      </AnimSection>

      {/* ════════════════════ ③ HOW IT WORKS ════════════════════════ */}
      <AnimSection id="how-it-works">
        <div style={S.container}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={S.badge('#8b5cf6')}>⚙ Process Flow</div>
            <h2 style={S.h2}>How SmartMaintain Works</h2>
            <p style={{ ...S.sub, maxWidth: 560, margin: '0 auto' }}>
              Five automated steps from raw sensor data to actionable maintenance alerts.
            </p>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center',
            gap: 0, overflowX: 'auto', paddingBottom: 16,
            flexWrap: 'wrap', justifyContent: 'center',
          }}>
            {FLOW.map((step, i) => (
              <React.Fragment key={step.label}>
                <FlowCard {...step} index={i + 1} />
                {i < FLOW.length - 1 && (
                  <div style={{ color: '#1e3a5f', fontSize: 24, flexShrink: 0, margin: '0 4px' }}>→</div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </AnimSection>

      {/* ════════════════════ ④ INDUSTRY FACTS ══════════════════════ */}
      <AnimSection style={{ background: 'rgba(56,189,248,0.02)' }}>
        <div style={S.container}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={S.badge('#22c55e')}>📈 By the Numbers</div>
            <h2 style={S.h2}>Proven Industry Impact</h2>
            <p style={{ ...S.sub, maxWidth: 540, margin: '0 auto' }}>
              Predictive maintenance is reshaping the economics of manufacturing worldwide.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
            {STATS.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>
        </div>
      </AnimSection>

      {/* ════════════════════ ⑤ ARCHITECTURE ════════════════════════ */}
      <AnimSection>
        <div style={S.container}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={S.badge('#06b6d4')}>🏗 System Design</div>
            <h2 style={S.h2}>System Architecture</h2>
            <p style={{ ...S.sub, maxWidth: 560, margin: '0 auto' }}>
              End-to-end data pipeline from edge sensors through AI to the live 3D dashboard.
            </p>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center',
            gap: 0, flexWrap: 'wrap', justifyContent: 'center',
          }}>
            {ARCH.map((node, i) => (
              <React.Fragment key={node.label}>
                <ArchNode {...node} />
                {i < ARCH.length - 1 && (
                  <ArrowConnector />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </AnimSection>

      {/* ════════════════════ ⑥ FEATURES ════════════════════════════ */}
      <AnimSection style={{ background: 'rgba(255,255,255,0.01)' }}>
        <div style={S.container}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={S.badge('#f59e0b')}>✦ Features</div>
            <h2 style={S.h2}>Built for Industrial Scale</h2>
            <p style={{ ...S.sub, maxWidth: 540, margin: '0 auto' }}>
              Every feature designed to give maintenance teams an unfair advantage.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            {FEATURES.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </AnimSection>

      {/* ════════════════════ ⑦ CTA ══════════════════════════════════ */}
      <AnimSection style={{ textAlign: 'center' }}>
        <div style={S.container}>
          <div style={S.badge('#38bdf8')}>🚀 Ready to Launch</div>
          <h2 style={{ ...S.h2, maxWidth: 700, margin: '0 auto 20px' }}>
            Experience Your Factory in Real-Time 3D
          </h2>
          <p style={{ ...S.sub, maxWidth: 500, margin: '0 auto 48px' }}>
            Step into your live digital twin. Six machines, live telemetry, AI alerts — all in one view.
          </p>
          <CTAButton onClick={goToDashboard} />
        </div>
      </AnimSection>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(56,189,248,0.08)',
        padding: '32px 0',
        textAlign: 'center',
        color: '#1e3a5f', fontSize: 12, letterSpacing: '0.1em',
      }}>
        <div style={S.container}>
          SmartMaintain AI &nbsp;·&nbsp; Industrial Predictive Maintenance Platform &nbsp;·&nbsp; React Three Fiber + GSAP
        </div>
      </footer>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50%       { transform: translateX(-50%) translateY(-8px); }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 30px rgba(56,189,248,0.3), 0 0 60px rgba(56,189,248,0.1); }
          50%       { box-shadow: 0 0 50px rgba(56,189,248,0.5), 0 0 100px rgba(56,189,248,0.2); }
        }
      `}</style>
    </div>
  );
}

/* ── Sub-components ────────────────────────────────────────────── */

function LayoutDashboardIcon() {
  return <span style={{ display: 'flex', alignItems: 'center' }}><Monitor size={18} /></span>;
}

function HeroButton({ children, onClick, primary }) {
  const ref = useRef();
  return (
    <button
      ref={ref}
      onClick={onClick}
      onMouseEnter={() => gsap.to(ref.current, { scale: 1.05, duration: 0.2 })}
      onMouseLeave={() => gsap.to(ref.current, { scale: 1.0, duration: 0.2 })}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '15px 32px',
        borderRadius: 14, fontSize: 15, fontWeight: 700,
        cursor: 'pointer', border: 'none', outline: 'none',
        ...(primary ? {
          background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
          color: '#fff',
          boxShadow: '0 0 30px rgba(14,165,233,0.35)',
          animation: 'glowPulse 3s ease-in-out infinite',
        } : {
          background: 'transparent',
          color: '#94a3b8',
          border: '1px solid rgba(255,255,255,0.12)',
        }),
      }}
    >
      {children}
    </button>
  );
}

function ProblemCard({ icon, color, title, desc }) {
  const ref = useRef();
  return (
    <div
      ref={ref}
      onMouseEnter={() => gsap.to(ref.current, { y: -6, boxShadow: `0 20px 60px ${color}18`, duration: 0.3 })}
      onMouseLeave={() => gsap.to(ref.current, { y: 0, boxShadow: 'none', duration: 0.3 })}
      style={{
        ...S.card(), border: `1px solid ${color}25`,
        transition: 'border-color 0.3s',
      }}
    >
      <div style={{
        width: 52, height: 52,
        background: `${color}15`, border: `1px solid ${color}35`,
        borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
        color, marginBottom: 20,
      }}>
        {icon}
      </div>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', margin: '0 0 10px' }}>{title}</h3>
      <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.7, margin: 0 }}>{desc}</p>
    </div>
  );
}

function FlowCard({ icon, color, label, desc, index }) {
  const ref = useRef();
  return (
    <div
      ref={ref}
      onMouseEnter={() => gsap.to(ref.current, { scale: 1.05, y: -4, duration: 0.25 })}
      onMouseLeave={() => gsap.to(ref.current, { scale: 1.0, y: 0, duration: 0.25 })}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '24px 20px', gap: 12, width: 160, flexShrink: 0,
        background: 'rgba(13,22,38,0.9)',
        border: `1px solid ${color}25`,
        borderRadius: 18,
        textAlign: 'center', cursor: 'default',
      }}
    >
      <div style={{
        fontSize: 10, fontFamily: 'monospace', letterSpacing: '0.2em',
        color: `${color}80`, marginBottom: -4,
      }}>
        STEP {String(index).padStart(2, '0')}
      </div>
      <div style={{
        width: 48, height: 48,
        background: `${color}18`, border: `1px solid ${color}40`,
        borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
        color, boxShadow: `0 0 20px ${color}25`,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontWeight: 700, fontSize: 13, color: '#f1f5f9', marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: 11, color: '#475569' }}>{desc}</div>
      </div>
    </div>
  );
}

function StatCard({ value, label, color, icon }) {
  const numStr = value.replace(/[^0-9.]/g, '');
  const suffix = value.replace(/[0-9.]/g, '');
  const ref = useRef();
  return (
    <div
      ref={ref}
      onMouseEnter={() => gsap.to(ref.current, { y: -6, duration: 0.25 })}
      onMouseLeave={() => gsap.to(ref.current, { y: 0, duration: 0.25 })}
      style={{
        ...S.card(),
        border: `1px solid ${color}25`,
        textAlign: 'center', padding: 36,
      }}
    >
      <div style={{ color, opacity: 0.7, marginBottom: 16, display: 'flex', justifyContent: 'center' }}>{icon}</div>
      <div style={{ fontSize: 52, fontWeight: 900, color, fontFamily: 'monospace', lineHeight: 1, marginBottom: 12 }}>
        <span data-count={numStr}>{numStr}</span>{suffix}
      </div>
      <div style={{ fontSize: 13, color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</div>
    </div>
  );
}

function ArchNode({ icon, color, label, sub }) {
  const ref = useRef();
  return (
    <div
      ref={ref}
      onMouseEnter={() => gsap.to(ref.current, { scale: 1.08, duration: 0.2 })}
      onMouseLeave={() => gsap.to(ref.current, { scale: 1.0, duration: 0.2 })}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '20px 16px', gap: 10, width: 130,
        background: 'rgba(13,22,38,0.9)',
        border: `1px solid ${color}30`,
        borderRadius: 16, textAlign: 'center', cursor: 'default',
        boxShadow: `0 0 30px ${color}10`,
      }}
    >
      <div style={{
        width: 44, height: 44,
        background: `${color}18`, border: `1px solid ${color}40`,
        borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color,
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0', marginBottom: 3 }}>{label}</div>
        <div style={{ fontSize: 10, color: '#475569' }}>{sub}</div>
      </div>
    </div>
  );
}

function ArrowConnector() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', padding: '0 8px', color: '#1e3a5f',
      flexShrink: 0,
    }}>
      <div style={{ width: 30, height: 1, background: 'linear-gradient(90deg, #1e3a5f, #38bdf8)' }} />
      <ChevronRight size={14} color="#38bdf8" />
    </div>
  );
}

function FeatureCard({ icon, color, title, desc }) {
  const ref = useRef();
  return (
    <div
      ref={ref}
      onMouseEnter={() => gsap.to(ref.current, { y: -6, borderColor: `${color}50`, duration: 0.3 })}
      onMouseLeave={() => gsap.to(ref.current, { y: 0, borderColor: `${color}15`, duration: 0.3 })}
      style={{
        ...S.card(),
        border: `1px solid ${color}15`,
        display: 'flex', gap: 18, alignItems: 'flex-start', padding: 24,
      }}
    >
      <div style={{
        width: 48, height: 48, flexShrink: 0,
        background: `${color}15`, border: `1px solid ${color}35`,
        borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color,
      }}>
        {icon}
      </div>
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', margin: '4px 0 8px' }}>{title}</h3>
        <p style={{ color: '#64748b', fontSize: 13, lineHeight: 1.65, margin: 0 }}>{desc}</p>
      </div>
    </div>
  );
}

function CTAButton({ onClick }) {
  const ref = useRef();
  return (
    <button
      ref={ref}
      onClick={onClick}
      onMouseEnter={() => gsap.to(ref.current, { scale: 1.06, duration: 0.2 })}
      onMouseLeave={() => gsap.to(ref.current, { scale: 1.0, duration: 0.2 })}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 12,
        padding: '18px 48px',
        background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
        color: '#fff', border: 'none', borderRadius: 16,
        fontSize: 16, fontWeight: 800, cursor: 'pointer',
        boxShadow: '0 0 60px rgba(14,165,233,0.35), 0 0 120px rgba(99,102,241,0.15)',
        animation: 'glowPulse 3s ease-in-out infinite',
        letterSpacing: '-0.3px',
      }}
    >
      <Monitor size={20} />
      Launch Factory Dashboard
      <ArrowRight size={20} />
    </button>
  );
}
