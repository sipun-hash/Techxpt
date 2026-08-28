import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TECHNOLOGIES } from '../data/content';
import { FadeUp, ClipReveal } from '../components/ScrollReveal';

export default function Technology() {
  const [hoveredTech, setHoveredTech] = useState(null);

  return (
    <section style={{ width: '100%', backgroundColor: 'var(--bg)', borderBottom: '1px solid var(--border)', paddingTop: 'clamp(4rem, 8vw, 6.5rem)', paddingBottom: 'clamp(4rem, 8vw, 6.5rem)' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ maxWidth: '780px', marginBottom: '3rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border)' }}>
          <FadeUp>
            <span className="tech-label" style={{ display: 'block', marginBottom: '0.4rem', color: '#FF2424' }}>
              05 // STACK
            </span>
          </FadeUp>
          <ClipReveal delay={0.08}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 3.2vw, 2.5rem)', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-primary)', margin: 0, letterSpacing: '0.02em' }}>
              BUILT WITH THE RIGHT TOOLS.
            </h2>
          </ClipReveal>
          <FadeUp delay={0.15}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.75rem', lineHeight: 1.6, maxWidth: '580px' }}>
              We pick uncompromised, battle-tested technologies engineered for performance, safety, and rapid scalability.
            </p>
          </FadeUp>
        </div>

        {/* Large Interactive Typographic Tech List */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
          
          {/* Left: Dynamic Stack Cloud with Staggered Scroll Motion */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem 1.25rem', alignItems: 'center' }}>
            {TECHNOLOGIES.map((tech, idx) => {
              const isHovered = hoveredTech?.name === tech.name;
              const isAnyHovered = hoveredTech !== null;

              return (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-20px' }}
                  transition={{ duration: 0.35, delay: idx * 0.04, ease: [0.16, 1, 0.3, 1] }}
                  onMouseEnter={() => setHoveredTech(tech)}
                  onMouseLeave={() => setHoveredTech(null)}
                  style={{ cursor: 'pointer', userSelect: 'none', display: 'inline-flex', alignItems: 'center' }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(1.2rem, 1.85vw, 1.65rem)',
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      letterSpacing: '0.02em',
                      color: isHovered ? '#FF2424' : isAnyHovered ? 'var(--border-focus)' : 'var(--text-primary)',
                      transform: isHovered ? 'translateY(-2px)' : 'none',
                      transition: 'all 0.2s ease',
                      display: 'inline-block'
                    }}
                  >
                    {tech.name}
                  </span>
                  <span style={{ color: 'var(--border)', fontSize: '1.2rem', marginLeft: '0.75rem', fontFamily: 'var(--font-mono)' }}>/</span>
                </motion.div>
              );
            })}
          </div>

          {/* Right: Dynamic Focus Preview Box */}
          <FadeUp delay={0.25}>
            <div 
              style={{
                border: '1px solid var(--border)',
                backgroundColor: 'var(--surface)',
                padding: '1.75rem',
                minHeight: '220px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '0.65rem', marginBottom: '0.85rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#FF2424', fontWeight: 700 }}>
                    TECH // {hoveredTech ? hoveredTech.category : 'ENGINEERING'}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>SPECIFICATION</span>
                </div>
                
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-primary)', margin: '0 0 0.4rem 0' }}>
                  {hoveredTech ? hoveredTech.name : 'HOVER ANY STACK ITEM'}
                </h3>
                
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.55, margin: 0 }}>
                  {hoveredTech 
                    ? hoveredTech.description 
                    : 'Hover over any technology on the left to inspect our architectural rationale and domain implementation.'
                  }
                </p>
              </div>

              <div style={{ paddingTop: '0.85rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                <span>PRODUCTION GRADE</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>100% TYPED</span>
              </div>
            </div>
          </FadeUp>

        </div>

      </div>
    </section>
  );
}
