import React from 'react';
import { motion } from 'framer-motion';
import { ClipReveal, LineReveal, FadeUp } from '../components/ScrollReveal';

export default function Statement() {
  const tickerItems = [
    "WEB DEVELOPMENT",
    "CUSTOM SOFTWARE",
    "AI & AUTOMATION",
    "DIGITAL PRODUCTS",
    "MOBILE & WEB APPS",
    "CLOUD HOSTING",
    "CLEAN UI/UX DESIGN",
    "FAST APIs"
  ];

  return (
    <section style={{ width: '100%', backgroundColor: 'var(--bg)', borderBottom: '1px solid var(--border)', overflow: 'hidden' }}>
      {/* Statement Block */}
      <div className="container" style={{ paddingTop: 'clamp(4rem, 8vw, 7rem)', paddingBottom: 'clamp(4rem, 8vw, 7rem)' }}>
        <div style={{ maxWidth: '980px' }}>
          <FadeUp>
            <span className="tech-label" style={{ color: 'var(--accent)', display: 'block', marginBottom: '1.25rem' }}>
              OUR STATEMENT
            </span>
          </FadeUp>

          <ClipReveal delay={0.1}>
            <h2 
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.5rem, 3.2vw, 2.75rem)',
                fontWeight: 900,
                textTransform: 'uppercase',
                color: 'var(--text-primary)',
                lineHeight: 1.1,
                letterSpacing: '0.02em',
                margin: 0
              }}
            >
              WE TURN COMPLEX IDEAS INTO <span style={{ color: 'var(--text-muted)' }}>SIMPLE</span>, POWERFUL DIGITAL EXPERIENCES.
            </h2>
          </ClipReveal>
        </div>
      </div>

      {/* Animated 1px Structural Divider */}
      <LineReveal />

      {/* Continuous Horizontal Ticker (Full Height Slider) */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        style={{
          height: '58px',
          backgroundColor: 'var(--surface)',
          overflow: 'hidden',
          borderBottom: '1px solid var(--border)',
          borderTop: '1px solid var(--border)',
          position: 'relative',
          userSelect: 'none',
          display: 'flex',
          alignItems: 'stretch'
        }}
      >
        <div className="marquee-track" style={{ height: '100%', display: 'flex', alignItems: 'stretch' }}>
          {[...tickerItems, ...tickerItems, ...tickerItems].map((item, index) => (
            <div key={index} className="ticker-fullheight-item">
              <span className="ticker-fill-bg" />
              <span className="ticker-dot" />
              <span className="ticker-text">{item}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
