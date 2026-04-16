import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import {
  AlertTriangle, DollarSign, Clock, ArrowRight, Cpu, Wifi,
  Database, Brain, Bell, BarChart2, Shield, Zap, Settings,
  TrendingDown, Activity, ChevronRight, Monitor, ChevronDown,
} from 'lucide-react';
import Navbar from '../components/Navbar.jsx';

gsap.registerPlugin(ScrollTrigger);

/* ── Color palette ─────────────────────────────────────────────── */
const C = {
  primary: '#2563EB',
  primaryLight: '#3B82F6',
  cyan: '#06B6D4',
  green: '#22C55E',
  amber: '#F59E0B',
  red: '#EF4444',
  purple: '#8B5CF6',
  pink: '#EC4899',
  orange: '#F97316',
  dark: '#0F172A',
  body: '#334155',
  muted: '#64748B',
  light: '#F8FAFC',
  white: '#FFFFFF',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
};

/* ── Reusable styled helpers ─────────────────────────────────── */
const S = {
  section: {
    padding: '140px 0',
    position: 'relative',
    overflow: 'hidden',
  },
  container: {
    maxWidth: 1180,
    margin: '0 auto',
    padding: '0 36px',
  },
  badge: (color = C.primary) => ({
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '8px 18px',
    background: `${color}0D`,
    border: `1px solid ${color}25`,
    borderRadius: 24,
    fontSize: 11, fontWeight: 700, color,
    letterSpacing: '0.16em', textTransform: 'uppercase',
    marginBottom: 24,
    fontFamily: "'Inter', sans-serif",
  }),
  h2: {
    fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800,
    color: C.dark, letterSpacing: '-0.5px', margin: '0 0 16px',
    lineHeight: 1.2,
    fontFamily: "'Poppins', 'Inter', sans-serif",
  },
  sub: {
    fontSize: 18, color: C.muted, lineHeight: 1.8, margin: '0 0 56px',
    fontFamily: "'Inter', sans-serif",
  },
  card: {
    background: C.white,
    border: `1px solid ${C.border}`,
    borderRadius: 16,
    padding: 32,
    transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    cursor: 'default',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)',
  },
};

/* ── AnimSection — scroll-triggered reveal ───────────────────── */
function AnimSection({ children, id, style, className }) {
  const ref = useRef();
  useEffect(() => {
    const el = ref.current;
    const children = el.querySelectorAll('.anim-child');

    gsap.fromTo(el,
      { opacity: 0 },
      {
        opacity: 1, duration: 0.5, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      }
    );

    if (children.length) {
      gsap.fromTo(children,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: { trigger: el, start: 'top 78%', once: true },
        }
      );
    }
  }, []);
  return (
    <section ref={ref} id={id} style={{ opacity: 0, ...S.section, ...style }} className={className}>
      {children}
    </section>
  );
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
  { value: '45%',    label: 'Downtime Reduction',   color: '#22c55e', icon: <TrendingDown size={22} /> },
  { value: '25%',    label: 'Maintenance Cost Saved', color: '#2563EB', icon: <DollarSign size={22} /> },
  { value: '83%',    label: 'Failures Prevented',    color: '#8b5cf6', icon: <Shield size={22} /> },
  { value: '3.7×',   label: 'ROI Multiplier',        color: '#f97316', icon: <BarChart2 size={22} /> },
];

/* ⑤ Architecture nodes */
const ARCH = [
  { icon: <Wifi size={20} />,     color: '#06b6d4', label: 'IoT Sensors',    sub: '6+ sensor types' },
  { icon: <Database size={20} />, color: '#8b5cf6', label: 'Backend API',    sub: 'Node.js / FastAPI' },
  { icon: <Brain size={20} />,    color: '#ec4899', label: 'ML Engine',      sub: 'TensorFlow / PyTorch' },
  { icon: <Monitor size={20} />,  color: '#2563EB', label: '3D Dashboard',   sub: 'React Three Fiber' },
  { icon: <Bell size={20} />,     color: '#22c55e', label: 'Alert System',   sub: 'GSAP + Socket.io' },
];

/* ⑥ Features */
const FEATURES = [
  { icon: <Activity size={22} />,   color: '#2563EB', title: 'Real-Time Monitoring',    desc: 'Live telemetry streams from all machines with sub-second latency updates.' },
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
  const blob1Ref   = useRef();
  const blob2Ref   = useRef();
  const blob3Ref   = useRef();
  const badgesRef  = useRef();
  const flowLineRef = useRef();

  /* Hero GSAP entrance */
  useEffect(() => {
    /* Enable smooth scroll on homepage */
    if (window.__lenis) window.__lenis.start();

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo(titleRef.current, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1.0 }, 0.3)
      .fromTo(subRef.current,   { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8 }, 0.6)
      .fromTo(btnRef.current,   { opacity: 0, y: 30, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.6 }, 0.85)
      .fromTo(badgesRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, 1.1);

    /* Parallax blobs on scroll */
    [blob1Ref, blob2Ref, blob3Ref].forEach((ref, i) => {
      if (ref.current) {
        gsap.to(ref.current, {
          y: -(80 + i * 40),
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
      }
    });

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
            duration: 2.2, ease: 'power2.out',
            onUpdate: function () { el.textContent = isFloat ? this.targets()[0].v.toFixed(1) + '×' : Math.round(this.targets()[0].v) + (target.endsWith('%') ? '%' : ''); }
          });
        }
      });
    });

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  const goToDashboard = () => navigate('/dashboard');

  return (
    <div style={{
      background: C.light,
      minHeight: '100vh',
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      color: C.body,
      overflowX: 'hidden',
    }}>
      <Navbar />

      {/* ════════════════════════ ① HERO ════════════════════════ */}
      <section ref={heroRef} style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        position: 'relative', overflow: 'hidden', paddingTop: 64,
        background: `linear-gradient(180deg, ${C.white} 0%, ${C.light} 100%)`,
      }}>
        {/* Floating gradient blobs */}
        <div ref={blob1Ref} style={{
          position: 'absolute', top: '-5%', left: '-8%',
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'floatBlob1 20s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
        <div ref={blob2Ref} style={{
          position: 'absolute', top: '30%', right: '-5%',
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'floatBlob2 25s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
        <div ref={blob3Ref} style={{
          position: 'absolute', bottom: '10%', left: '30%',
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'floatBlob3 22s ease-in-out infinite',
          pointerEvents: 'none',
        }} />

        {/* Subtle grid */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.4,
          backgroundImage:
            'linear-gradient(rgba(37,99,235,0.03) 1px, transparent 1px),' +
            'linear-gradient(90deg, rgba(37,99,235,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          pointerEvents: 'none',
        }} />

        <div style={{ ...S.container, zIndex: 1, textAlign: 'center', width: '100%' }}>
          <div style={S.badge(C.primary)}>
            <Cpu size={13} />  AI-Powered Industrial Platform
          </div>

          <h1 ref={titleRef} style={{
            fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 900,
            letterSpacing: '-2.5px', lineHeight: 1.08,
            margin: '0 auto 28px', maxWidth: 860,
            color: C.dark,
            fontFamily: "'Montserrat', 'Inter', sans-serif",
            opacity: 0,
          }}>
            AI-Powered Predictive<br />Maintenance System
          </h1>

          <p ref={subRef} style={{
            fontSize: 'clamp(16px, 2vw, 20px)', color: C.muted,
            maxWidth: 620, margin: '0 auto 52px', lineHeight: 1.8, opacity: 0,
            fontFamily: "'Inter', sans-serif",
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
          <div ref={badgesRef} style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 72, flexWrap: 'wrap', opacity: 0 }}>
            {[
              { label: 'Machines Monitored', value: '6', color: C.primary },
              { label: 'Update Frequency',   value: '800ms', color: C.green },
              { label: 'AI Accuracy',        value: '96.2%', color: C.purple },
            ].map((item) => (
              <motion.div
                key={item.label}
                whileHover={{ y: -4, boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                style={{
                  padding: '16px 28px',
                  background: C.white,
                  border: `1px solid ${C.border}`,
                  borderRadius: 14,
                  textAlign: 'center',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                }}
              >
                <div style={{ fontSize: 24, fontWeight: 800, color: item.color, fontFamily: "'Montserrat', monospace" }}>{item.value}</div>
                <div style={{ fontSize: 11, color: C.muted, letterSpacing: '0.1em', marginTop: 4 }}>{item.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          color: C.muted, fontSize: 10, letterSpacing: '0.2em',
        }}>
          <span style={{ fontWeight: 600 }}>SCROLL</span>
          <ChevronDown size={18} style={{ animation: 'scrollBounce 2s ease-in-out infinite' }} />
        </div>
      </section>

      {/* ════════════════════ ② PROBLEM STATEMENT ════════════════════ */}
      <AnimSection style={{ background: '#FFFBF5' }}>
        <div style={S.container}>
          <div style={{ textAlign: 'center', marginBottom: 64 }} className="anim-child">
            <div style={S.badge(C.red)}>⚠ The Problem</div>
            <h2 style={S.h2}>Manufacturing is Plagued by Reactive Maintenance</h2>
            <p style={{ ...S.sub, maxWidth: 600, margin: '0 auto' }}>
              Every minute of unplanned downtime costs manufacturers thousands. Reactive strategies are broken.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 28 }}>
            {PROBLEMS.map((p, i) => (
              <ProblemCard key={p.title} {...p} index={i} />
            ))}
          </div>
        </div>
      </AnimSection>

      {/* ════════════════════ ③ HOW IT WORKS ════════════════════════ */}
      <AnimSection id="how-it-works" style={{ background: C.white }}>
        <div style={S.container}>
          <div style={{ textAlign: 'center', marginBottom: 64 }} className="anim-child">
            <div style={S.badge(C.purple)}>⚙ Process Flow</div>
            <h2 style={S.h2}>How SmartMaintain Works</h2>
            <p style={{ ...S.sub, maxWidth: 580, margin: '0 auto' }}>
              Five automated steps from raw sensor data to actionable maintenance alerts.
            </p>
          </div>
          <ProcessFlow steps={FLOW} />
        </div>
      </AnimSection>

      {/* ════════════════════ ④ INDUSTRY FACTS ══════════════════════ */}
      <AnimSection style={{ background: '#F1F5F9' }}>
        <div style={S.container}>
          <div style={{ textAlign: 'center', marginBottom: 64 }} className="anim-child">
            <div style={S.badge(C.green)}>📈 By the Numbers</div>
            <h2 style={S.h2}>Proven Industry Impact</h2>
            <p style={{ ...S.sub, maxWidth: 560, margin: '0 auto' }}>
              Predictive maintenance is reshaping the economics of manufacturing worldwide.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 28 }}>
            {STATS.map((s, i) => (
              <StatCard key={s.label} {...s} index={i} />
            ))}
          </div>
        </div>
      </AnimSection>

      {/* ════════════════════ ⑤ ARCHITECTURE ════════════════════════ */}
      <AnimSection style={{ background: C.white }}>
        <div style={S.container}>
          <div style={{ textAlign: 'center', marginBottom: 64 }} className="anim-child">
            <div style={S.badge(C.cyan)}>🏗 System Design</div>
            <h2 style={S.h2}>System Architecture</h2>
            <p style={{ ...S.sub, maxWidth: 580, margin: '0 auto' }}>
              End-to-end data pipeline from edge sensors through AI to the live 3D dashboard.
            </p>
          </div>
          <ArchitectureFlow nodes={ARCH} />
        </div>
      </AnimSection>

      {/* ════════════════════ ⑥ FEATURES ════════════════════════════ */}
      <AnimSection style={{ background: '#F0F9FF' }}>
        <div style={S.container}>
          <div style={{ textAlign: 'center', marginBottom: 64 }} className="anim-child">
            <div style={S.badge(C.amber)}>✦ Features</div>
            <h2 style={S.h2}>Built for Industrial Scale</h2>
            <p style={{ ...S.sub, maxWidth: 560, margin: '0 auto' }}>
              Every feature designed to give maintenance teams an unfair advantage.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>
            {FEATURES.map((f, i) => (
              <FeatureCard key={f.title} {...f} index={i} />
            ))}
          </div>
        </div>
      </AnimSection>

      {/* ════════════════════ ⑦ CTA ══════════════════════════════════ */}
      <AnimSection style={{
        textAlign: 'center',
        background: `linear-gradient(180deg, ${C.white} 0%, #EFF6FF 50%, #DBEAFE 100%)`,
        paddingBottom: 160,
      }}>
        <div style={S.container}>
          <div className="anim-child">
            <div style={S.badge(C.primary)}>🚀 Ready to Launch</div>
          </div>
          <h2 className="anim-child" style={{ ...S.h2, maxWidth: 700, margin: '0 auto 20px' }}>
            Experience Your Factory in Real-Time 3D
          </h2>
          <p className="anim-child" style={{ ...S.sub, maxWidth: 520, margin: '0 auto 56px' }}>
            Step into your live digital twin. Six machines, live telemetry, AI alerts — all in one view.
          </p>
          <div className="anim-child">
            <CTAButton onClick={goToDashboard} />
          </div>
        </div>
      </AnimSection>

      {/* Footer */}
      <footer style={{
        borderTop: `1px solid ${C.border}`,
        padding: '36px 0',
        textAlign: 'center',
        color: C.muted, fontSize: 13, letterSpacing: '0.05em',
        background: C.white,
      }}>
        <div style={S.container}>
          SmartMaintain AI &nbsp;·&nbsp; Industrial Predictive Maintenance Platform &nbsp;·&nbsp; React Three Fiber + GSAP
        </div>
      </footer>
    </div>
  );
}

/* ── Sub-components ────────────────────────────────────────────── */

function LayoutDashboardIcon() {
  return <span style={{ display: 'flex', alignItems: 'center' }}><Monitor size={18} /></span>;
}

function HeroButton({ children, onClick, primary }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '16px 36px',
        borderRadius: 14, fontSize: 15, fontWeight: 700,
        cursor: 'pointer', border: 'none', outline: 'none',
        fontFamily: "'Inter', sans-serif",
        ...(primary ? {
          background: `linear-gradient(135deg, ${C.primary}, #4F46E5)`,
          color: '#fff',
          boxShadow: '0 4px 20px rgba(37,99,235,0.3), 0 1px 3px rgba(0,0,0,0.1)',
        } : {
          background: 'transparent',
          color: C.body,
          border: `1.5px solid ${C.border}`,
        }),
      }}
    >
      {children}
    </motion.button>
  );
}

function ProblemCard({ icon, color, title, desc, index }) {
  return (
    <motion.div
      className="anim-child"
      whileHover={{
        y: -8,
        boxShadow: `0 12px 40px ${color}12, 0 4px 16px rgba(0,0,0,0.06)`,
        borderColor: `${color}40`,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      style={{
        ...S.card,
        borderLeft: `3px solid ${color}30`,
      }}
    >
      <div style={{
        width: 56, height: 56,
        background: `${color}0D`,
        border: `1px solid ${color}20`,
        borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
        color, marginBottom: 24,
      }}>
        {icon}
      </div>
      <h3 style={{ fontSize: 19, fontWeight: 700, color: C.dark, margin: '0 0 12px', fontFamily: "'Poppins', sans-serif" }}>{title}</h3>
      <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.75, margin: 0 }}>{desc}</p>
    </motion.div>
  );
}

/* ── Process Flow — with animated SVG connectors ─────────────── */
function ProcessFlow({ steps }) {
  const containerRef = useRef();

  useEffect(() => {
    const cards = containerRef.current?.querySelectorAll('.flow-step');
    if (cards?.length) {
      gsap.fromTo(cards,
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.6, ease: 'power3.out',
          stagger: 0.18,
          scrollTrigger: { trigger: containerRef.current, start: 'top 80%', once: true },
        }
      );
    }

    const connectors = containerRef.current?.querySelectorAll('.flow-connector');
    if (connectors?.length) {
      gsap.fromTo(connectors,
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1, opacity: 1,
          duration: 0.5, ease: 'power2.out',
          stagger: 0.18,
          scrollTrigger: { trigger: containerRef.current, start: 'top 78%', once: true },
          delay: 0.3,
        }
      );
    }
  }, []);

  return (
    <div ref={containerRef} style={{
      display: 'flex', alignItems: 'center',
      gap: 0, overflowX: 'auto', paddingBottom: 16,
      flexWrap: 'wrap', justifyContent: 'center',
    }}>
      {steps.map((step, i) => (
        <React.Fragment key={step.label}>
          <FlowCard {...step} index={i + 1} />
          {i < steps.length - 1 && (
            <div className="flow-connector" style={{
              display: 'flex', alignItems: 'center', padding: '0 6px',
              flexShrink: 0, transformOrigin: 'left center',
            }}>
              <div style={{
                width: 36, height: 2, borderRadius: 2,
                background: `linear-gradient(90deg, ${step.color}50, ${steps[i+1].color}50)`,
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', inset: 0,
                  background: `linear-gradient(90deg, transparent, ${step.color}, transparent)`,
                  animation: 'dataFlow 2s linear infinite',
                  animationDelay: `${i * 0.4}s`,
                }} />
              </div>
              <ChevronRight size={14} color={steps[i+1].color} style={{ opacity: 0.6 }} />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function FlowCard({ icon, color, label, desc, index }) {
  return (
    <motion.div
      className="flow-step"
      whileHover={{ scale: 1.06, y: -6 }}
      transition={{ type: 'spring', stiffness: 350, damping: 20 }}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '28px 22px', gap: 14, width: 168, flexShrink: 0,
        background: C.white,
        border: `1px solid ${color}20`,
        borderRadius: 18,
        textAlign: 'center', cursor: 'default',
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        opacity: 0,
      }}
    >
      <div style={{
        fontSize: 10, fontFamily: "'Inter', monospace", letterSpacing: '0.2em',
        color: `${color}90`, fontWeight: 700,
      }}>
        STEP {String(index).padStart(2, '0')}
      </div>
      <div style={{
        width: 52, height: 52,
        background: `${color}0F`,
        border: `1px solid ${color}25`,
        borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
        color,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontWeight: 700, fontSize: 14, color: C.dark, marginBottom: 4, fontFamily: "'Poppins', sans-serif" }}>{label}</div>
        <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>{desc}</div>
      </div>
    </motion.div>
  );
}

function StatCard({ value, label, color, icon, index }) {
  const numStr = value.replace(/[^0-9.]/g, '');
  const suffix = value.replace(/[0-9.]/g, '');
  return (
    <motion.div
      className="anim-child"
      whileHover={{ y: -6, boxShadow: `0 12px 40px ${color}10, 0 4px 16px rgba(0,0,0,0.06)` }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      style={{
        ...S.card,
        textAlign: 'center', padding: 40,
        borderTop: `3px solid ${color}30`,
      }}
    >
      <div style={{
        color, opacity: 0.8, marginBottom: 20, display: 'flex', justifyContent: 'center',
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: `${color}0D`, border: `1px solid ${color}18`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {icon}
        </div>
      </div>
      <div style={{
        fontSize: 52, fontWeight: 900, color, fontFamily: "'Montserrat', monospace",
        lineHeight: 1, marginBottom: 16, letterSpacing: '-2px',
      }}>
        <span data-count={numStr}>{numStr}</span>{suffix}
      </div>
      <div style={{
        fontSize: 13, color: C.muted, letterSpacing: '0.1em', textTransform: 'uppercase',
        fontWeight: 600,
      }}>
        {label}
      </div>
    </motion.div>
  );
}

/* ── Architecture flow — with animated data pulses ───────────── */
function ArchitectureFlow({ nodes }) {
  const containerRef = useRef();

  useEffect(() => {
    const items = containerRef.current?.querySelectorAll('.arch-node');
    if (items?.length) {
      gsap.fromTo(items,
        { opacity: 0, y: 30, scale: 0.9 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.5, ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: { trigger: containerRef.current, start: 'top 80%', once: true },
        }
      );
    }

    const connectors = containerRef.current?.querySelectorAll('.arch-connector');
    if (connectors?.length) {
      gsap.fromTo(connectors,
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1, opacity: 1,
          duration: 0.4, ease: 'power2.out',
          stagger: 0.15,
          scrollTrigger: { trigger: containerRef.current, start: 'top 78%', once: true },
          delay: 0.25,
        }
      );
    }
  }, []);

  return (
    <div ref={containerRef} style={{
      display: 'flex', alignItems: 'center',
      gap: 0, flexWrap: 'wrap', justifyContent: 'center',
    }}>
      {nodes.map((node, i) => (
        <React.Fragment key={node.label}>
          <ArchNode {...node} />
          {i < nodes.length - 1 && (
            <div className="arch-connector" style={{
              display: 'flex', alignItems: 'center', padding: '0 10px',
              flexShrink: 0, transformOrigin: 'left center',
            }}>
              <div style={{
                width: 36, height: 2,
                background: `linear-gradient(90deg, ${node.color}40, ${nodes[i+1].color}40)`,
                borderRadius: 2, position: 'relative', overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', inset: 0,
                  background: `linear-gradient(90deg, transparent, ${node.color}90, transparent)`,
                  animation: 'dataFlow 2.5s linear infinite',
                  animationDelay: `${i * 0.5}s`,
                }} />
              </div>
              <ChevronRight size={14} color={`${nodes[i+1].color}80`} />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function ArchNode({ icon, color, label, sub }) {
  return (
    <motion.div
      className="arch-node"
      whileHover={{ scale: 1.08, y: -4 }}
      transition={{ type: 'spring', stiffness: 350, damping: 22 }}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '24px 20px', gap: 12, width: 140,
        background: C.white,
        border: `1px solid ${color}20`,
        borderRadius: 16, textAlign: 'center', cursor: 'default',
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        opacity: 0,
      }}
    >
      <div style={{
        width: 48, height: 48,
        background: `${color}0F`, border: `1px solid ${color}25`,
        borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', color,
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.dark, marginBottom: 4, fontFamily: "'Poppins', sans-serif" }}>{label}</div>
        <div style={{ fontSize: 11, color: C.muted }}>{sub}</div>
      </div>
    </motion.div>
  );
}

function FeatureCard({ icon, color, title, desc, index }) {
  return (
    <motion.div
      className="anim-child"
      whileHover={{
        y: -8,
        boxShadow: `0 12px 40px ${color}10, 0 4px 16px rgba(0,0,0,0.06)`,
        borderColor: `${color}30`,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      style={{
        ...S.card,
        display: 'flex', gap: 20, alignItems: 'flex-start', padding: 28,
      }}
    >
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        style={{
          width: 52, height: 52, flexShrink: 0,
          background: `${color}0D`, border: `1px solid ${color}20`,
          borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', color,
        }}
      >
        {icon}
      </motion.div>
      <div>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: C.dark, margin: '4px 0 10px', fontFamily: "'Poppins', sans-serif" }}>{title}</h3>
        <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.75, margin: 0 }}>{desc}</p>
      </div>
    </motion.div>
  );
}

function CTAButton({ onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05, y: -3 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      style={{
        position: 'relative',
        display: 'inline-flex', alignItems: 'center', gap: 14,
        padding: '20px 52px',
        background: `linear-gradient(135deg, ${C.primary}, #4F46E5)`,
        color: '#fff', border: 'none', borderRadius: 16,
        fontSize: 17, fontWeight: 800, cursor: 'pointer',
        boxShadow: '0 4px 24px rgba(37,99,235,0.35), 0 12px 48px rgba(79,70,229,0.15)',
        letterSpacing: '-0.3px',
        fontFamily: "'Inter', sans-serif",
        overflow: 'hidden',
      }}
    >
      {/* Shimmer effect */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 3s ease-in-out infinite',
      }} />
      <Monitor size={20} style={{ position: 'relative', zIndex: 1 }} />
      <span style={{ position: 'relative', zIndex: 1 }}>Launch Factory Dashboard</span>
      <ArrowRight size={20} style={{ position: 'relative', zIndex: 1 }} />
    </motion.button>
  );
}
