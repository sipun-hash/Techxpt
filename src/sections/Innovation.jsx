import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { INNOVATIONS } from '../data/content';
import { ArrowRight, Cpu } from 'lucide-react';
import { FadeUp, ClipReveal } from '../components/ScrollReveal';

export default function Innovation({ onStartProject }) {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <section style={{ width: '100%', backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', paddingTop: 'clamp(4rem, 8vw, 6.5rem)', paddingBottom: 'clamp(4rem, 8vw, 6.5rem)' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border)', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <FadeUp>
              <span className="tech-label" style={{ display: 'block', marginBottom: '0.4rem', color: '#FF2424' }}>
                06 // WHAT'S NEXT
              </span>
            </FadeUp>
            <ClipReveal delay={0.08}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-primary)', margin: 0 }}>
                EXPLORING WHAT'S NEXT.
              </h2>
            </ClipReveal>
          </div>

          <FadeUp delay={0.15}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase', maxWidth: '300px', margin: 0 }}>
              EMERGING PARADIGMS SHAPING THE NEXT DECADE OF COMPUTING
            </p>
          </FadeUp>
        </div>

        {/* 2-Column Innovation Explorer with Staggered Scroll Motion */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem', alignItems: 'stretch' }}>
          
          {/* Interactive Innovation Topics */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {INNOVATIONS.map((item, idx) => {
              const isActive = activeIdx === idx;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-20px' }}
                  transition={{ duration: 0.45, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => setActiveIdx(idx)}
                  onMouseEnter={() => setActiveIdx(idx)}
                  style={{
                    padding: '1.25rem 1.5rem',
                    border: isActive ? '1px solid #FF2424' : '1px solid var(--border)',
                    backgroundColor: isActive ? 'var(--surface-hover)' : 'var(--surface)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#FF2424', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.08em' }}>
                      {item.tag}
                    </span>
                    {isActive && <span style={{ width: '7px', height: '7px', backgroundColor: '#FF2424', display: 'inline-block' }} />}
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-primary)', marginTop: '0.4rem', margin: '0.4rem 0 0 0' }}>
                    {item.title}
                  </h3>
                </motion.div>
              );
            })}
          </div>

          {/* Deep Insight Display */}
          <FadeUp delay={0.2}>
            <div 
              style={{
                border: '1px solid var(--border)',
                backgroundColor: 'var(--surface)',
                padding: 'clamp(1.5rem, 4vw, 2.5rem)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxSizing: 'border-box'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.85rem', marginBottom: '1.25rem' }}>
                  <Cpu size={15} color="#FF2424" />
                  <span>APPLIED RESEARCH MODULE // 0{activeIdx + 1}</span>
                </div>

                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-primary)', margin: '0 0 1.25rem 0' }}>
                  {INNOVATIONS[activeIdx].title}
                </h3>

                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, margin: '0 0 1.75rem 0' }}>
                  {INNOVATIONS[activeIdx].description}
                </p>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
                <button 
                  onClick={onStartProject}
                  className="btn-tech-primary"
                >
                  <span>CO-BUILD NEXT-GEN SYSTEM</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </FadeUp>

        </div>

      </div>
    </section>
  );
}
