import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Cpu, Wifi, Database, Brain, Activity } from 'lucide-react';

const STATUS_MESSAGES = [
  'Initializing factory sensors...',
  'Loading 3D model assets...',
  'Connecting to telemetry streams...',
  'Calibrating AI prediction models...',
  'Establishing real-time data pipeline...',
  'Rendering digital twin environment...',
  'Dashboard ready.',
];

export default function LoadingScreen({ onComplete }) {
  const containerRef  = useRef();
  const barFillRef    = useRef();
  const percentRef    = useRef();
  const msgRef        = useRef();
  const spinnerRef    = useRef();
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const counter  = { val: 0 };
    const msgTimes = [0, 0.5, 1.0, 1.6, 2.2, 2.9, 3.4];
    const duration = 3.6;

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(containerRef.current, {
          opacity: 0, scale: 1.03, duration: 0.5, ease: 'power2.in',
          onComplete: onComplete,
        });
      },
    });

    /* entrance */
    tl.fromTo(containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: 'power2.out' }
    );

    /* progress bar fill */
    tl.to(barFillRef.current, {
      scaleX: 1, duration, ease: 'power1.inOut', transformOrigin: 'left center',
    }, '+=0.1');

    /* counter 0 → 100 */
    tl.to(counter, {
      val: 100, duration, ease: 'power1.inOut',
      onUpdate: () => {
        if (percentRef.current) percentRef.current.textContent = `${Math.round(counter.val)}%`;
      },
    }, '<');

    /* cycling status messages */
    msgTimes.forEach((t, i) => {
      tl.call(() => {
        setMsgIndex(i);
        if (msgRef.current) {
          gsap.fromTo(msgRef.current,
            { opacity: 0, y: 8 },
            { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
          );
        }
      }, null, t);
    });

    /* spinner */
    gsap.to(spinnerRef.current, {
      rotation: 360, duration: 2, ease: 'none', repeat: -1,
    });

    return () => { tl.kill(); gsap.killTweensOf(spinnerRef.current); };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: '#060e1c',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Inter', sans-serif",
        overflow: 'hidden',
      }}
    >
      {/* Animated grid overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage:
          'linear-gradient(rgba(56,189,248,0.03) 1px, transparent 1px),' +
          'linear-gradient(90deg, rgba(56,189,248,0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
      }} />

      {/* Scanline sweep */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, transparent 0%, rgba(56,189,248,0.04) 50%, transparent 100%)',
        animation: 'scanMove 3s linear infinite',
        pointerEvents: 'none',
      }} />

      {/* Corner decorations */}
      {[
        { top: 24, left: 24, borderTop: true, borderLeft: true },
        { top: 24, right: 24, borderTop: true, borderRight: true },
        { bottom: 24, left: 24, borderBottom: true, borderLeft: true },
        { bottom: 24, right: 24, borderBottom: true, borderRight: true },
      ].map((style, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: 40, height: 40,
          ...style,
          borderTopWidth:    style.borderTop    ? 2 : 0,
          borderLeftWidth:   style.borderLeft   ? 2 : 0,
          borderRightWidth:  style.borderRight  ? 2 : 0,
          borderBottomWidth: style.borderBottom ? 2 : 0,
          borderStyle: 'solid',
          borderColor: 'rgba(56,189,248,0.3)',
          borderRadius: style.borderTop && style.borderLeft ? '8px 0 0 0'
                      : style.borderTop && style.borderRight ? '0 8px 0 0'
                      : style.borderBottom && style.borderLeft ? '0 0 0 8px'
                      : '0 0 8px 0',
        }} />
      ))}

      {/* Main content */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32, zIndex: 1, width: '100%', maxWidth: 480 }}>

        {/* Logo + Spinner */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Spinner ring */}
          <div ref={spinnerRef} style={{
            position: 'absolute',
            width: 90, height: 90,
            borderRadius: '50%',
            border: '2px solid transparent',
            borderTopColor: '#38bdf8',
            borderRightColor: 'rgba(56,189,248,0.3)',
          }} />
          <div style={{
            width: 70, height: 70,
            background: 'linear-gradient(135deg, rgba(14,165,233,0.2), rgba(99,102,241,0.2))',
            border: '1px solid rgba(56,189,248,0.3)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(10px)',
          }}>
            <Cpu size={32} color="#38bdf8" />
          </div>
        </div>

        {/* Title */}
        <div style={{ textAlign: 'center' }}>
          <h1 style={{
            fontSize: 28, fontWeight: 800, margin: 0,
            background: 'linear-gradient(90deg, #38bdf8, #818cf8)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.5px',
          }}>
            SmartMaintain AI
          </h1>
          <p style={{ color: '#334155', fontSize: 12, letterSpacing: '0.3em', margin: '6px 0 0', fontFamily: 'monospace' }}>
            DIGITAL TWIN DASHBOARD
          </p>
        </div>

        {/* Status icons row */}
        <div style={{ display: 'flex', gap: 20 }}>
          {[Wifi, Database, Brain, Activity].map((Icon, i) => (
            <div key={i} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            }}>
              <div style={{
                width: 40, height: 40,
                background: 'rgba(56,189,248,0.08)',
                border: '1px solid rgba(56,189,248,0.2)',
                borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                animation: `iconPulse ${1.5 + i * 0.3}s ease-in-out infinite`,
              }}>
                <Icon size={18} color="#38bdf8" />
              </div>
            </div>
          ))}
        </div>

        {/* Progress section */}
        <div style={{ width: '100%', padding: '0 24px' }}>
          {/* Percentage */}
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            marginBottom: 10, alignItems: 'baseline',
          }}>
            <span style={{ color: '#475569', fontSize: 11, letterSpacing: '0.2em', fontFamily: 'monospace' }}>
              LOADING
            </span>
            <span ref={percentRef} style={{
              fontSize: 28, fontWeight: 800, color: '#38bdf8',
              fontFamily: 'monospace', letterSpacing: '-1px',
            }}>
              0%
            </span>
          </div>

          {/* Track */}
          <div style={{
            height: 6, borderRadius: 4,
            background: 'rgba(56,189,248,0.1)',
            border: '1px solid rgba(56,189,248,0.15)',
            overflow: 'hidden', position: 'relative',
          }}>
            <div ref={barFillRef} style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(90deg, #0ea5e9, #6366f1)',
              boxShadow: '0 0 20px rgba(56,189,248,0.5)',
              transform: 'scaleX(0)',
              transformOrigin: 'left',
            }} />
          </div>

          {/* Status message */}
          <p ref={msgRef} style={{
            marginTop: 16,
            color: '#64748b', fontSize: 13,
            textAlign: 'center', fontFamily: 'monospace',
            letterSpacing: '0.05em', minHeight: 20,
          }}>
            {STATUS_MESSAGES[msgIndex]}
          </p>
        </div>
      </div>

      {/* Bottom system info */}
      <div style={{
        position: 'absolute', bottom: 24,
        display: 'flex', gap: 32, color: '#1e3a5f', fontSize: 10, fontFamily: 'monospace', letterSpacing: '0.15em',
      }}>
        <span>v2.4.1</span>
        <span>REACT THREE FIBER</span>
        <span>ML ENGINE READY</span>
      </div>

      <style>{`
        @keyframes scanMove {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
        @keyframes iconPulse {
          0%, 100% { opacity: 0.5; transform: scale(1);    }
          50%       { opacity: 1;   transform: scale(1.08); }
        }
      `}</style>
    </div>
  );
}
