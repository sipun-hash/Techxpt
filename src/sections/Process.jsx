import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PROCESS_STEPS } from '../data/content';
import { FadeUp, ClipReveal } from '../components/ScrollReveal';

export default function Process() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const step = PROCESS_STEPS[activeStep];

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % PROCESS_STEPS.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [isPaused, activeStep]);

  const handleStepClick = (idx) => {
    setActiveStep(idx);
  };

  return (
    <section 
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{ 
        width: '100%', 
        backgroundColor: 'var(--bg)', 
        borderBottom: '1px solid var(--border)', 
        paddingTop: 'clamp(3.5rem, 5.5vw, 4.75rem)', 
        paddingBottom: 'clamp(3.5rem, 5.5vw, 4.75rem)' 
      }}
    >
      <div className="container">
        
        {/* Section Header */}
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-end', 
            marginBottom: '2rem', 
            paddingBottom: '1rem', 
            borderBottom: '1px solid var(--border)', 
            flexWrap: 'wrap', 
            gap: '1rem' 
          }}
        >
          <div>
            <FadeUp>
              <span className="tech-label" style={{ display: 'block', marginBottom: '0.35rem', color: '#FF2424' }}>
                METHODOLOGY
              </span>
            </FadeUp>
            <ClipReveal delay={0.08}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-primary)', margin: 0, letterSpacing: '0.02em' }}>
                HOW WE WORK
              </h2>
            </ClipReveal>
          </div>

          <FadeUp delay={0.15}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', maxWidth: '320px', margin: 0, letterSpacing: '0.05em' }}>
              DETERMINISTIC PHASES FROM DISCOVERY TO CONTINUOUS SCALE
            </p>
          </FadeUp>
        </div>

        {/* Process Horizontal Stepper Navigation */}
        <div className="process-tabs-container">
          {PROCESS_STEPS.map((s, idx) => {
            const isActive = activeStep === idx;
            return (
              <button
                key={s.number}
                onClick={() => handleStepClick(idx)}
                className={`process-tab-btn ${isActive ? 'active' : ''}`}
              >
                {isActive ? (
                  <motion.div 
                    key={activeStep}
                    className="process-tab-indicator-active"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2, ease: 'linear' }}
                  />
                ) : (
                  <div className="process-tab-indicator" />
                )}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '6px' }}>
                  <span className="process-tab-number">{s.number}</span>
                  {isActive && <span className="process-tab-dot" />}
                </div>
                <div className="process-tab-title">{s.title}</div>
                <div className="process-tab-sub">{s.subtitle.split(',')[0]}</div>
              </button>
            );
          })}
        </div>

        {/* Active Phase Panel */}
        <div className="process-detail-panel">
          <AnimatePresence mode="wait">
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="process-detail-grid"
            >
              {/* Left Column: Phase Description */}
              <div className="process-detail-main">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.65rem' }}>
                  <span 
                    style={{ 
                      backgroundColor: 'rgba(255, 36, 36, 0.12)', 
                      color: '#FF2424', 
                      fontFamily: 'var(--font-tech)', 
                      fontSize: '0.72rem', 
                      fontWeight: 700, 
                      padding: '3px 8px', 
                      letterSpacing: '0.1em' 
                    }}
                  >
                    PHASE {step.number} / 05
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    EXECUTION FRAMEWORK
                  </span>
                </div>

                <h3 
                  style={{ 
                    fontFamily: 'var(--font-display)', 
                    fontSize: 'clamp(1.35rem, 2.3vw, 1.85rem)', 
                    fontWeight: 900, 
                    textTransform: 'uppercase', 
                    color: 'var(--text-primary)', 
                    margin: '0 0 0.65rem 0',
                    letterSpacing: '0.02em'
                  }}
                >
                  {step.title}
                </h3>

                <p 
                  style={{ 
                    color: 'var(--text-secondary)', 
                    fontSize: 'clamp(0.9rem, 1.15vw, 1.02rem)', 
                    lineHeight: 1.6, 
                    margin: 0,
                    maxWidth: '680px' 
                  }}
                >
                  {step.description}
                </p>
              </div>

              {/* Right Column: Standardized Deliverables */}
              <div className="process-detail-deliverables">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.45rem' }}>
                  <span className="tech-label" style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                    STANDARDIZED DELIVERABLES
                  </span>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    {PROCESS_STEPS.map((_, i) => (
                      <span 
                        key={i} 
                        onClick={() => setActiveStep(i)}
                        style={{ 
                          width: '7px', 
                          height: '7px', 
                          cursor: 'pointer',
                          backgroundColor: activeStep === i ? '#FF2424' : 'var(--border)',
                          transition: 'background-color 0.2s ease'
                        }} 
                      />
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  {step.deliverables.map((item, i) => (
                    <div 
                      key={i} 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.55rem', 
                        fontFamily: 'var(--font-tech)', 
                        fontSize: '0.82rem', 
                        color: 'var(--text-primary)',
                        padding: '6px 10px',
                        backgroundColor: 'var(--surface-hover)',
                        border: '1px solid var(--border)'
                      }}
                    >
                      <span style={{ color: '#FF2424', fontWeight: 800 }}>+</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}

