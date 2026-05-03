import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Cpu, Activity, Home, LayoutDashboard, Zap } from 'lucide-react';

export default function Navbar() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const navRef    = useRef();
  const logoRef   = useRef();
  const isHome    = location.pathname === '/';
  const [scrolled, setScrolled] = useState(false);

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

  /* ── Track scroll for homepage glass effect ──────────────────── */
  useEffect(() => {
    if (!isHome) { setScrolled(true); return; }
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  const isActive = (path) => location.pathname === path;

  /* ── Style variants ──────────────────────────────────────────── */
  const isDark = !isHome;
  const bg = isDark
    ? 'rgba(6, 14, 28, 0.92)'
    : scrolled
      ? 'rgba(255, 255, 255)'
      : 'rgba(255, 255, 255, 0.6)';

  const borderColor = isDark
    ? 'rgba(56, 189, 248, 0.12)'
    : scrolled
      ? 'rgba(226, 232, 240, 0.9)'
      : 'rgba(226, 232, 240, 0.4)';

  const shadow = isDark
    ? '0 4px 40px rgba(0,0,0,0.5)'
    : scrolled
      ? '0 1px 8px rgba(0,0,0,0.06), 0 4px 24px rgba(0,0,0,0.04)'
      : 'none';

  const logoGradient = isDark
    ? 'linear-gradient(90deg, #38bdf8, #818cf8)'
    : 'linear-gradient(90deg, #2563EB, #7C3AED)';

  const logoSubColor = isDark ? '#475569' : '#94A3B8';
  const statusBg = isDark ? 'rgba(34,197,94,0.1)' : 'rgba(34,197,94,0.08)';
  const statusBorder = isDark ? 'rgba(34,197,94,0.25)' : 'rgba(34,197,94,0.2)';

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
        background: bg,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${borderColor}`,
        boxShadow: shadow,
        transition: 'background 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease',
      }}
    >
      {/* ── Logo ── */}
      <Link to="/" style={{ textDecoration: 'none' }}>
        <div ref={logoRef} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 12px rgba(37,99,235,0.3)',
          }}>
            <Cpu size={20} color="#fff" />
          </div>
          <div>
            <div style={{
              fontSize: 16, fontWeight: 800,
              background: logoGradient,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.3px',
            }}>
              SmartMaintain
            </div>
            <div style={{ fontSize: 10, color: logoSubColor, letterSpacing: '0.2em', fontFamily: 'monospace' }}>
              AI PLATFORM
            </div>
          </div>
        </div>
      </Link>

      {/* ── Centre badge ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '4px 12px',
        background: statusBg,
        border: `1px solid ${statusBorder}`,
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
        <NavLink to="/"          icon={<Home size={15} />}            label="Home"      active={isActive('/')}          isDark={isDark} />
        <NavLink to="/dashboard" icon={<LayoutDashboard size={15} />} label="Dashboard" active={isActive('/dashboard')} isDark={isDark} />
      </div>
    </nav>
  );
}

function NavLink({ to, icon, label, active, isDark }) {
  const ref = useRef();

  const activeColor   = isDark ? '#38bdf8' : '#2563EB';
  const inactiveColor = isDark ? '#94a3b8' : '#64748B';
  const hoverColor    = isDark ? '#e2e8f0' : '#0F172A';
  const activeBg      = isDark ? 'rgba(56,189,248,0.1)' : 'rgba(37,99,235,0.08)';
  const activeBorder  = isDark ? 'rgba(56,189,248,0.3)' : 'rgba(37,99,235,0.2)';
  const hoverBg       = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';

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
        color: active ? activeColor : inactiveColor,
        background: active ? activeBg : 'transparent',
        border: `1px solid ${active ? activeBorder : 'transparent'}`,
        transition: 'all 0.25s ease',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        if (!active) {
          gsap.to(e.currentTarget, { color: hoverColor, background: hoverBg, duration: 0.2 });
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          gsap.to(e.currentTarget, { color: inactiveColor, background: 'transparent', duration: 0.2 });
        }
      }}
    >
      {icon}
      {label}
      {active && (
        <div style={{
          position: 'absolute', bottom: -1, left: '20%', right: '20%',
          height: 2, borderRadius: 2,
          background: `linear-gradient(90deg, transparent, ${activeColor}, transparent)`,
        }} />
      )}
    </Link>
  );
}
