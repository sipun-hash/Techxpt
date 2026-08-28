import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SERVICES } from '../data/content';
import { ArrowRight, Check, Cpu, Layers } from 'lucide-react';

export default function ServicesPage({ onStartProject, selectedService }) {
  const [activeTab, setActiveTab] = useState(selectedService?.id || '01');
  const currentService = SERVICES.find(s => s.id === activeTab) || SERVICES[0];

  return (
    <div className="page-shell" style={{ paddingBottom: 'clamp(2.5rem, 4vw, 3.5rem)' }}>
      <div className="container">
        
        {/* Compact Hero Header */}
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-end', 
            borderBottom: '1px solid var(--border)', 
            paddingBottom: '1.25rem', 
            marginBottom: '1.75rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <span style={{ width: '6px', height: '6px', backgroundColor: '#FF2424', display: 'inline-block' }} />
              <span className="tech-label" style={{ color: '#FF2424', fontSize: '0.76rem' }}>
                ENGINEERING CAPABILITIES // ARCHITECTURE
              </span>
            </div>

            <h1 
              style={{ 
                fontFamily: 'var(--font-display)', 
                fontSize: 'clamp(1.8rem, 3.8vw, 2.75rem)', 
                fontWeight: 900, 
                textTransform: 'uppercase', 
                letterSpacing: '0.02em', 
                color: 'var(--text-primary)', 
                margin: 0, 
                lineHeight: 1.08 
              }}
            >
              WHAT WE DO
            </h1>
          </div>

          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', maxWidth: '480px', lineHeight: 1.5, margin: 0 }}>
            From dynamic web portals to enterprise cloud software, branding, and digital marketing, TECHXPT provides complete full-lifecycle technology services.
          </p>
        </div>

        {/* Compact Horizontal Capability Tabs */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1px',
            backgroundColor: 'var(--border)',
            border: '1px solid var(--border)',
            marginBottom: '1.75rem'
          }}
        >
          {SERVICES.map((srv) => {
            const isActive = activeTab === srv.id;
            return (
              <button
                key={srv.id}
                onClick={() => setActiveTab(srv.id)}
                style={{
                  padding: '0.9rem 1.25rem',
                  textAlign: 'left',
                  backgroundColor: isActive ? 'var(--surface-hover)' : 'var(--surface)',
                  border: 'none',
                  borderBottom: isActive ? '2px solid #FF2424' : '2px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px'
                }}
              >
                <span style={{ fontFamily: 'var(--font-tech)', fontSize: '0.68rem', fontWeight: 700, color: isActive ? '#FF2424' : 'var(--text-muted)', letterSpacing: '0.1em' }}>
                  {srv.id} //
                </span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-primary)', letterSpacing: '0.02em' }}>
                  {srv.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* High-Density Capability Console (Side-by-Side Split) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentService.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem',
              alignItems: 'stretch',
              marginBottom: '2rem'
            }}
          >
            
            {/* Left Console Column: Narrative & Standardized Deliverables */}
            <div 
              style={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                padding: 'clamp(1.5rem, 2.5vw, 2rem)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1.25rem'
              }}
            >
              <div>
                <span className="tech-label" style={{ color: '#FF2424', fontSize: '0.74rem', display: 'block', marginBottom: '0.35rem' }}>
                  {currentService.id} // CORE CAPABILITY ARCHITECTURE
                </span>

                <h2 
                  style={{ 
                    fontFamily: 'var(--font-display)', 
                    fontSize: 'clamp(1.35rem, 2.5vw, 1.85rem)', 
                    fontWeight: 900, 
                    textTransform: 'uppercase', 
                    color: 'var(--text-primary)', 
                    margin: '0 0 0.5rem 0',
                    letterSpacing: '0.02em',
                    lineHeight: 1.15
                  }}
                >
                  {currentService.title}
                </h2>

                <p style={{ fontSize: '0.98rem', color: 'var(--text-primary)', fontWeight: 600, margin: '0 0 0.5rem 0', lineHeight: 1.5 }}>
                  {currentService.subtitle}
                </p>

                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
                  {currentService.description}
                </p>
              </div>

              {/* Standardized Deliverables Checklist (Compact 2-Column Grid) */}
              <div 
                style={{
                  padding: '1.15rem 1.25rem',
                  backgroundColor: 'var(--bg)',
                  border: '1px solid var(--border)'
                }}
              >
                <span className="tech-label" style={{ color: 'var(--text-primary)', fontSize: '0.72rem', display: 'block', marginBottom: '0.75rem' }}>
                  STANDARDIZED DELIVERABLES
                </span>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.6rem' }}>
                  {currentService.deliverables.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div 
                        style={{
                          width: '18px',
                          height: '18px',
                          backgroundColor: 'var(--surface-hover)',
                          border: '1px solid var(--border)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FF2424',
                          flexShrink: 0
                        }}
                      >
                        <Check size={11} strokeWidth={3} />
                      </div>
                      <span style={{ fontFamily: 'var(--font-tech)', fontSize: '0.76rem', color: 'var(--text-secondary)', letterSpacing: '0.04em' }}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div>
                <button 
                  onClick={onStartProject} 
                  className="btn-tech-accent" 
                  style={{ width: '100%', justifyContent: 'center', padding: '0.85rem 1.4rem', fontSize: '0.82rem' }}
                >
                  <span>INQUIRE ABOUT {currentService.title}</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>

            {/* Right Console Column: Media Preview & Engineered Stack */}
            <div 
              style={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ position: 'relative', width: '100%', height: 'clamp(200px, 24vw, 280px)', overflow: 'hidden', backgroundColor: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                <img 
                  src={currentService.image} 
                  alt={currentService.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'contrast(105%)'
                  }}
                />
              </div>

              {/* Tech Stack & Ecosystem */}
              <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Cpu size={14} color="#FF2424" />
                  <span className="tech-label" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    PRODUCTION ECOSYSTEM & STACK
                  </span>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                  {currentService.tags.map(t => (
                    <span 
                      key={t} 
                      style={{
                        padding: '4px 10px',
                        fontSize: '0.74rem',
                        fontFamily: 'var(--font-tech)',
                        fontWeight: 600,
                        backgroundColor: 'var(--surface-hover)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-primary)',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase'
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </motion.div>
        </AnimatePresence>

        {/* Compact Integrated Bottom Initiation Strip */}
        <div 
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            padding: '1.25rem 1.75rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div>
            <span className="tech-label" style={{ color: '#FF2424', fontSize: '0.72rem', display: 'block' }}>
              NEED CUSTOM ARCHITECTURAL CONSULTING?
            </span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-primary)' }}>
              Let's scope your technical roadmap together.
            </span>
          </div>

          <button 
            onClick={onStartProject}
            className="btn-tech-outline"
            style={{ padding: '0.65rem 1.3rem', fontSize: '0.78rem' }}
          >
            <span>TALK TO LEAD ARCHITECT</span>
            <ArrowRight size={14} color="#FF2424" />
          </button>
        </div>

      </div>
    </div>
  );
}

