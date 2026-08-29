import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight, Sparkles, Layers, Cpu, Shield, Globe, Zap } from 'lucide-react';

const BLOCKS = [
  // Red Elevated Hero Blocks
  { id: 'b1', row: 1, col: 1, w: 2, h: 2, depth: 36, color: '#FF2424', text: 'TECH', sub: 'CORE 01', isRed: true },
  { id: 'b2', row: 2, col: 3, w: 1, h: 1, depth: 28, color: '#FF2424', text: 'AI', isRed: true },
  { id: 'b3', row: 3, col: 1, w: 2, h: 1, depth: 32, color: '#FF2424', text: 'SCALE', isRed: true },
  { id: 'b4', row: 5, col: 5, w: 1, h: 1, depth: 22, color: '#FF2424', text: 'SEC', isRed: true },

  // White / Surface Monolithic Elevated Blocks
  { id: 'b5', row: 2, col: 4, w: 2, h: 2, depth: 44, color: 'var(--surface-high)', text: 'XPT', sub: 'SYSTEM 02' },
  { id: 'b6', row: 4, col: 3, w: 2, h: 2, depth: 40, color: 'var(--surface-high)', text: 'ARCH', sub: 'NODE 03' },
  { id: 'b7', row: 3, col: 5, w: 2, h: 1, depth: 26, color: 'var(--surface-high)', text: 'CLOUD' },
  { id: 'b8', row: 5, col: 2, w: 2, h: 2, depth: 34, color: 'var(--surface-high)', text: 'ENGINE', sub: 'v4.8' },

  // Tiny Accent Micro Blocks
  { id: 'b9', row: 1, col: 5, w: 1, h: 1, depth: 16, color: '#FF2424', text: '>>', isRed: true },
  { id: 'b10', row: 4, col: 1, w: 1, h: 1, depth: 18, color: 'var(--surface-high)', text: '04' },
  { id: 'b11', row: 4, col: 5, w: 1, h: 1, depth: 14, color: '#FF2424', text: '■', isRed: true },
  { id: 'b12', row: 6, col: 4, w: 1, h: 1, depth: 16, color: 'var(--surface-high)', text: '99' }
];

export default function HeroIsometricGrid({ onStartProject }) {
  const containerRef = useRef(null);
  const [hoveredBlock, setHoveredBlock] = useState(null);

  // Smooth 3D Parallax Mouse Physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 160 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [14, -14]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-14, 14]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setHoveredBlock(null);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        width: '100%',
        maxWidth: '540px',
        aspectRatio: '1 / 1',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: '1200px',
        userSelect: 'none',
        padding: '1rem',
        boxSizing: 'border-box'
      }}
    >
      {/* 3D Depth Viewport Canvas */}
      <motion.div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          backgroundColor: 'var(--bg)',
          border: '1px solid var(--border)',
          boxShadow: '0 30px 70px rgba(0, 0, 0, 0.2)',
          boxSizing: 'border-box',
          overflow: 'hidden'
        }}
      >
        {/* Architectural Background Grid Canvas */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gridTemplateRows: 'repeat(6, 1fr)',
            borderCollapse: 'collapse',
            pointerEvents: 'none'
          }}
        >
          {Array.from({ length: 36 }).map((_, i) => (
            <div
              key={i}
              style={{
                borderRight: '1px solid var(--border)',
                borderBottom: '1px solid var(--border)',
                boxSizing: 'border-box'
              }}
            />
          ))}
        </div>

        {/* Diagonal Split Red/White Contrast Baseline (Reflected from Design) */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '45%',
            backgroundColor: 'rgba(255, 36, 36, 0.08)',
            borderTop: '1px solid rgba(255, 36, 36, 0.25)',
            pointerEvents: 'none'
          }}
        />

        {/* Typographic Micro-Coordinates & Design Details */}
        <div style={{ position: 'absolute', top: '14px', left: '16px', zIndex: 5, pointerEvents: 'none' }}>
          <span style={{ fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.12em', color: '#FF2424', textTransform: 'uppercase' }}>
            TECHXPT // MODULAR ARCHITECTURE
          </span>
        </div>

        <div style={{ position: 'absolute', top: '14px', right: '16px', zIndex: 5, pointerEvents: 'none' }}>
          <span style={{ fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
            SYS.GRID // 06×06
          </span>
        </div>

        {/* Decorative Graphic Chevron Marks */}
        <div style={{ position: 'absolute', top: '22%', right: '18%', zIndex: 5, pointerEvents: 'none', display: 'flex', gap: '3px' }}>
          {[1, 2, 3, 4].map((n) => (
            <span key={n} style={{ color: '#FF2424', fontSize: '0.75rem', fontWeight: 900, opacity: 0.8 }}>
              ›
            </span>
          ))}
        </div>

        {/* Dot Matrix Pattern Accent */}
        <div
          style={{
            position: 'absolute',
            bottom: '24%',
            left: '36%',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 5px)',
            gap: '6px',
            zIndex: 5,
            pointerEvents: 'none'
          }}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} style={{ width: '4px', height: '4px', backgroundColor: '#FF2424', opacity: 0.5, display: 'inline-block' }} />
          ))}
        </div>

        {/* Big Bold Headline in Background Layer */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            right: '16px',
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.4rem, 3.5vw, 2.2rem)',
            fontWeight: 900,
            letterSpacing: '0.04em',
            color: 'var(--text-primary)',
            opacity: 0.85,
            zIndex: 6,
            pointerEvents: 'none'
          }}
        >
          DIGITAL ARCH
        </div>

        {/* 3D Extruded Relief Blocks System */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gridTemplateRows: 'repeat(6, 1fr)',
            padding: '1px',
            boxSizing: 'border-box'
          }}
        >
          {BLOCKS.map((block) => {
            const isHovered = hoveredBlock === block.id;
            const elevation = isHovered ? block.depth + 14 : block.depth;

            return (
              <motion.div
                key={block.id}
                onMouseEnter={() => setHoveredBlock(block.id)}
                onMouseLeave={() => setHoveredBlock(null)}
                onClick={onStartProject}
                whileHover={{ scale: 1.02 }}
                style={{
                  gridColumn: `${block.col} / span ${block.w}`,
                  gridRow: `${block.row} / span ${block.h}`,
                  position: 'relative',
                  zIndex: Math.floor(elevation),
                  margin: '3px',
                  backgroundColor: block.isRed ? '#FF2424' : 'var(--surface)',
                  color: block.isRed ? '#FFFFFF' : 'var(--text-primary)',
                  border: block.isRed ? '1px solid #FF4D4D' : '1px solid var(--border)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: 'clamp(0.4rem, 1.2vw, 0.75rem)',
                  boxSizing: 'border-box',
                  // Realistic 3D Cast Shadow & Depth
                  boxShadow: block.isRed
                    ? `12px 14px ${elevation * 0.9}px rgba(255, 36, 36, 0.45), 4px 4px 0px rgba(0,0,0,0.25)`
                    : `14px 16px ${elevation * 0.9}px rgba(0, 0, 0, 0.35), 4px 4px 0px rgba(0,0,0,0.15)`,
                  transform: `translateZ(${elevation}px)`,
                  transition: 'box-shadow 0.25s ease, transform 0.25s ease, background-color 0.25s ease'
                }}
              >
                {/* 3D Top Light Edge Highlight */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    backgroundColor: block.isRed ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.75)'
                  }}
                />

                {/* Block Content */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span
                    style={{
                      fontSize: 'clamp(0.65rem, 1.2vw, 0.85rem)',
                      fontWeight: 900,
                      fontFamily: 'var(--font-display)',
                      letterSpacing: '0.04em'
                    }}
                  >
                    {block.text}
                  </span>
                  {block.w > 1 && (
                    <ArrowUpRight size={13} color={block.isRed ? '#FFFFFF' : '#FF2424'} />
                  )}
                </div>

                {block.sub && (
                  <span
                    style={{
                      fontSize: '0.58rem',
                      fontWeight: 800,
                      letterSpacing: '0.08em',
                      opacity: block.isRed ? 0.9 : 0.6,
                      textTransform: 'uppercase'
                    }}
                  >
                    {block.sub}
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>

      </motion.div>
    </div>
  );
}
