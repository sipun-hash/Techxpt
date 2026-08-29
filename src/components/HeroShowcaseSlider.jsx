import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, Shield, Cpu, Globe } from 'lucide-react';

const SHOWCASE_SLIDES = [
  {
    id: '01',
    tag: 'FLAGSHIP CAPABILITY',
    title: 'ENTERPRISE WEB PLATFORMS',
    subtitle: 'High-performance web applications engineered for speed, conversion, and global scale.',
    icon: Globe,
    stats: [
      { label: 'PERFORMANCE', value: '100 / 100' },
      { label: 'GLOBAL LATENCY', value: '< 45ms' }
    ],
    accent: '#FF2424'
  },
  {
    id: '02',
    tag: 'SMART INTELLIGENCE',
    title: 'AI & WORKFLOW AUTOMATION',
    subtitle: 'Custom generative AI agents, neural pipelines, and automated intelligence engines.',
    icon: Cpu,
    stats: [
      { label: 'EFFICIENCY BOOST', value: '10x' },
      { label: 'INTELLIGENCE', value: 'GPT-4o & Claude' }
    ],
    accent: '#FF2424'
  },
  {
    id: '03',
    tag: 'MISSION CRITICAL',
    title: 'CLOUD INFRASTRUCTURE & APIS',
    subtitle: 'Ultra-reliable backend systems, distributed microservices, and serverless architectures.',
    icon: Sparkles,
    stats: [
      { label: 'UPTIME SLA', value: '99.99%' },
      { label: 'THROUGHPUT', value: '100k+ req/s' }
    ],
    accent: '#FF2424'
  },
  {
    id: '04',
    tag: 'HARDENED SECURITY',
    title: 'ENTERPRISE CYBERSECURITY',
    subtitle: 'Zero-trust architecture, automated threat detection, and continuous DevSecOps protocols.',
    icon: Shield,
    stats: [
      { label: 'ENCRYPTION', value: 'AES-256' },
      { label: 'COMPLIANCE', value: 'GDPR / ISO' }
    ],
    accent: '#FF2424'
  }
];

export default function HeroShowcaseSlider({ onStartProject }) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SHOWCASE_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const slide = SHOWCASE_SLIDES[current];
  const IconComponent = slide.icon;

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % SHOWCASE_SLIDES.length);
  };

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + SHOWCASE_SLIDES.length) % SHOWCASE_SLIDES.length);
  };

  return (
    <div 
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{
        width: '100%',
        maxWidth: '480px',
        backgroundColor: 'var(--surface, #121212)',
        border: '1px solid var(--border, #262626)',
        position: 'relative',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
        boxSizing: 'border-box'
      }}
    >
      {/* Top Red Architectural Accent Line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', backgroundColor: '#FF2424' }} />

      {/* Header Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.85rem 1.25rem',
        borderBottom: '1px solid var(--border, #262626)',
        backgroundColor: 'var(--bg, #0A0A0A)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ width: '6px', height: '6px', backgroundColor: '#FF2424', display: 'inline-block' }} />
          <span style={{
            fontSize: '0.72rem',
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--text-secondary, #A3A3A3)'
          }}>
            TECHXPT // SHOWCASE {slide.id} / 04
          </span>
        </div>

        {/* Carousel Navigation Buttons */}
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={handlePrev}
            aria-label="Previous Slide"
            style={{
              background: 'transparent',
              border: '1px solid var(--border, #262626)',
              color: 'var(--text-primary, #FFFFFF)',
              padding: '0.25rem 0.45rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next Slide"
            style={{
              background: 'transparent',
              border: '1px solid var(--border, #262626)',
              color: 'var(--text-primary, #FFFFFF)',
              padding: '0.25rem 0.45rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Slide Content with Fluid Motion */}
      <div style={{ padding: 'clamp(1.25rem, 3vw, 1.75rem)', minHeight: '270px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Tag Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.25rem 0.65rem',
              backgroundColor: 'rgba(255, 36, 36, 0.1)',
              border: '1px solid rgba(255, 36, 36, 0.3)',
              color: '#FF2424',
              fontSize: '0.7rem',
              fontWeight: 800,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: '0.85rem'
            }}>
              <IconComponent size={12} color="#FF2424" />
              <span>{slide.tag}</span>
            </div>

            {/* Slide Title */}
            <h3 style={{
              fontSize: 'clamp(1.15rem, 2.5vw, 1.45rem)',
              fontWeight: 900,
              letterSpacing: '0.01em',
              color: 'var(--text-primary, #FFFFFF)',
              marginBottom: '0.5rem',
              lineHeight: 1.2,
              textTransform: 'uppercase'
            }}>
              {slide.title}
            </h3>

            {/* Slide Description */}
            <p style={{
              fontSize: '0.88rem',
              color: 'var(--text-secondary, #A3A3A3)',
              lineHeight: 1.5,
              marginBottom: '1.25rem'
            }}>
              {slide.subtitle}
            </p>

            {/* Live Metrics Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.75rem',
              padding: '0.85rem',
              backgroundColor: 'var(--bg, #0A0A0A)',
              border: '1px solid var(--border, #262626)',
              marginBottom: '1.25rem'
            }}>
              {slide.stats.map((stat, idx) => (
                <div key={idx}>
                  <div style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    color: 'var(--text-muted, #737373)',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    marginBottom: '2px'
                  }}>
                    {stat.label}
                  </div>
                  <div style={{
                    fontSize: '1rem',
                    fontWeight: 900,
                    color: '#FF2424',
                    letterSpacing: '0.02em'
                  }}>
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom CTA & Progress Dots */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid var(--border, #262626)',
          paddingTop: '0.85rem'
        }}>
          {/* Progress Indicator Dots */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {SHOWCASE_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                style={{
                  width: current === idx ? '24px' : '8px',
                  height: '4px',
                  backgroundColor: current === idx ? '#FF2424' : 'var(--border, #404040)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>

          {/* Quick Action Button */}
          <button
            onClick={onStartProject}
            style={{
              background: 'none',
              border: 'none',
              color: '#FF2424',
              fontSize: '0.78rem',
              fontWeight: 800,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: 0
            }}
          >
            <span>START BRIEF</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
