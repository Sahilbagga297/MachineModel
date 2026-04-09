import React, { useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Cpu, Activity, Home, LayoutDashboard, Zap } from 'lucide-react';

export default function Navbar() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const navRef    = useRef();
  const logoRef   = useRef();

  /* ── GSAP entrance on mount ─────────────────────────────────── */
  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(navRef.current,
      { y: -70, opacity: 0 },
      { y: 0,   opacity: 1, duration: 0.7, ease: 'power3.out' }
    ).fromTo(
      logoRef.current,
      { x: -20, opacity: 0 },
      { x: 0,   opacity: 1, duration: 0.5, ease: 'power2.out' },
      '-=0.3'
    );
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      ref={navRef}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 1000,
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        background: 'rgba(6, 14, 28, 0.92)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(56, 189, 248, 0.12)',
        boxShadow: '0 4px 40px rgba(0,0,0,0.5)',
      }}
    >
      {/* ── Logo ── */}
      <Link to="/" style={{ textDecoration: 'none' }}>
        <div ref={logoRef} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(14,165,233,0.4)',
          }}>
            <Cpu size={20} color="#fff" />
          </div>
          <div>
            <div style={{
              fontSize: 16, fontWeight: 800,
              background: 'linear-gradient(90deg, #38bdf8, #818cf8)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.3px',
            }}>
              SmartMaintain
            </div>
            <div style={{ fontSize: 9, color: '#475569', letterSpacing: '0.2em', fontFamily: 'monospace' }}>
              AI  PLATFORM
            </div>
          </div>
        </div>
      </Link>

      {/* ── Centre badge ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '4px 12px',
        background: 'rgba(34,197,94,0.1)',
        border: '1px solid rgba(34,197,94,0.25)',
        borderRadius: 20,
        fontSize: 11, color: '#22c55e', letterSpacing: '0.1em',
      }}>
        <div style={{
          width: 6, height: 6, borderRadius: '50%',
          background: '#22c55e', boxShadow: '0 0 8px #22c55e',
          animation: 'pulse 2s ease-in-out infinite',
        }} />
        SYSTEM ONLINE
      </div>

      {/* ── Nav links ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <NavLink to="/"          icon={<Home size={15} />}            label="Home"      active={isActive('/')} />
        <NavLink to="/dashboard" icon={<LayoutDashboard size={15} />} label="Dashboard" active={isActive('/dashboard')} />
      </div>
    </nav>
  );
}

function NavLink({ to, icon, label, active }) {
  const ref = useRef();
  return (
    <Link
      ref={ref}
      to={to}
      style={{
        display: 'flex', alignItems: 'center', gap: 7,
        padding: '8px 16px',
        borderRadius: 10,
        fontSize: 13, fontWeight: 600,
        textDecoration: 'none',
        color: active ? '#38bdf8' : '#94a3b8',
        background: active ? 'rgba(56,189,248,0.1)' : 'transparent',
        border: `1px solid ${active ? 'rgba(56,189,248,0.3)' : 'transparent'}`,
        transition: 'all 0.25s ease',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        if (!active) {
          gsap.to(e.currentTarget, { color: '#e2e8f0', background: 'rgba(255,255,255,0.05)', duration: 0.2 });
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          gsap.to(e.currentTarget, { color: '#94a3b8', background: 'transparent', duration: 0.2 });
        }
      }}
    >
      {icon}
      {label}
      {active && (
        <div style={{
          position: 'absolute', bottom: -1, left: '20%', right: '20%',
          height: 2, borderRadius: 2,
          background: 'linear-gradient(90deg, transparent, #38bdf8, transparent)',
        }} />
      )}
    </Link>
  );
}
