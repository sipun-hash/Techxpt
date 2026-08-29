import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001
  });

  const [scrollPercent, setScrollPercent] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    return scrollYProgress.onChange((latest) => {
      const pct = Math.round(latest * 100);
      setScrollPercent(pct);
      setIsVisible(pct > 2);
    });
  }, [scrollYProgress]);

  return (
    <>
      {/* Top Laser Progress Bar */}
      <motion.div
        style={{
          scaleX,
          transformOrigin: '0%',
          position: 'fixed',
          top: 'var(--nav-height)',
          left: 0,
          right: 0,
          height: '2.5px',
          backgroundColor: '#FF2424',
          boxShadow: '0 0 10px rgba(255, 36, 36, 0.85)',
          zIndex: 999,
          pointerEvents: 'none'
        }}
      />

      {/* Right Edge Architectural HUD Reading Depth Indicator (Desktop Only) */}
      <div 
        className="hidden-mobile"
        style={{
          position: 'fixed',
          right: '12px',
          bottom: '24px',
          zIndex: 990,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '4px',
          pointerEvents: 'none',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.3s ease'
        }}
      >
        <div style={{
          backgroundColor: 'var(--surface, #121212)',
          border: '1px solid var(--border, #262626)',
          borderRight: '2px solid #FF2424',
          padding: '3px 7px',
          fontSize: '0.68rem',
          fontWeight: 800,
          letterSpacing: '0.08em',
          color: 'var(--text-primary, #FFFFFF)',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)',
          fontFamily: 'monospace'
        }}>
          DEPTH <span style={{ color: '#FF2424' }}>{scrollPercent}%</span>
        </div>
      </div>
    </>
  );
}
