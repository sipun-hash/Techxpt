import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Mail } from 'lucide-react';
import { BRAND } from '../data/content';
import MagneticButton from '../components/MagneticButton';
import { FadeUp, ClipReveal } from '../components/ScrollReveal';

export default function CTA({ onStartProject }) {
  return (
    <section 
      style={{
        width: '100%',
        backgroundColor: 'var(--bg)',
        paddingTop: 'clamp(5rem, 10vw, 8rem)',
        paddingBottom: 'clamp(5rem, 10vw, 8rem)',
        borderBottom: '1px solid var(--border)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Subtle Tech Line */}
      <div className="absolute inset-0 tech-grid-bg" style={{ opacity: 0.6, pointerEvents: 'none' }} />

      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        
        <div style={{ maxWidth: '960px' }}>
          <FadeUp>
            <span className="tech-label" style={{ display: 'block', marginBottom: '1.25rem', color: '#FF2424' }}>
              GET IN TOUCH
            </span>
          </FadeUp>

          <ClipReveal delay={0.08}>
            <h2 
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 4.8vw, 3.8rem)',
                fontWeight: 900,
                textTransform: 'uppercase',
                color: 'var(--text-primary)',
                lineHeight: 1.04,
                letterSpacing: '0.02em',
                margin: '0 0 0.5rem 0'
              }}
            >
              HAVE AN IDEA?
            </h2>
          </ClipReveal>

          <ClipReveal delay={0.16}>
            <h2 
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 4.8vw, 3.8rem)',
                fontWeight: 900,
                textTransform: 'uppercase',
                color: 'var(--accent)',
                lineHeight: 1.04,
                letterSpacing: '0.02em',
                margin: '0 0 2rem 0'
              }}
            >
              LET'S BUILD IT.
            </h2>
          </ClipReveal>

          <FadeUp delay={0.25}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.25rem', paddingTop: '0.5rem' }}>
              <MagneticButton onClick={onStartProject} variant="accent">
                <span>START A PROJECT</span>
                <ArrowRight size={16} />
              </MagneticButton>

              <a 
                href={`mailto:${BRAND.email}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  fontFamily: 'var(--font-tech)',
                  fontSize: '0.82rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--text-secondary)',
                  padding: '0.85rem 1.4rem',
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-focus)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                <Mail size={16} color="#FF2424" />
                <span>{BRAND.email}</span>
              </a>
            </div>
          </FadeUp>

        </div>

      </div>
    </section>
  );
}
