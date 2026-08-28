import React from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Shield, Zap, CheckCircle2, Cpu } from 'lucide-react';
import { PROJECTS } from '../data/content';

export default function ProjectDetailPage({ project, onBack, onStartProject, onSelectOtherProject }) {
  if (!project) {
    return (
      <div className="page-shell">
        <div className="container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', marginBottom: '1.25rem' }}>
            PROJECT NOT FOUND
          </h2>
          <button onClick={onBack} className="btn-tech-accent">
            <ArrowLeft size={16} /> RETURN TO WORK ARCHIVE
          </button>
        </div>
      </div>
    );
  }

  const otherProjects = PROJECTS.filter(p => p.id !== project.id).slice(0, 2);

  return (
    <div className="page-shell" style={{ paddingBottom: 'clamp(2.5rem, 4vw, 3.5rem)' }}>
      <div className="container">
        
        {/* Navigation & Status Header */}
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            borderBottom: '1px solid var(--border)', 
            paddingBottom: '0.85rem', 
            marginBottom: '1.75rem',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}
        >
          <button
            onClick={onBack}
            className="btn-tech-outline"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.78rem' }}
          >
            <ArrowLeft size={14} />
            <span>BACK TO ALL PROJECTS</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontFamily: 'var(--font-tech)', fontSize: '0.76rem', letterSpacing: '0.12em' }}>
            <span style={{ color: '#FF2424', fontWeight: 700 }}>{project.number} // CASE STUDY</span>
            <span style={{ color: 'var(--text-muted)' }}>|</span>
            <span style={{ color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{project.category}</span>
          </div>
        </div>

        {/* Core Hero Split Architecture: Left Media & Telemetry + Right Narrative & Stack */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
            gap: 'clamp(1.5rem, 3vw, 2.5rem)', 
            alignItems: 'start',
            marginBottom: '2.5rem'
          }}
        >
          
          {/* Left Column: Media Showcase + Product Specifications */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Image Frame */}
            <div 
              style={{
                position: 'relative',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--surface)',
                overflow: 'hidden',
                maxHeight: '380px'
              }}
            >
              {/* Corner Tag */}
              <div 
                style={{
                  position: 'absolute',
                  top: '0.75rem',
                  left: '0.75rem',
                  zIndex: 10,
                  backgroundColor: 'rgba(10, 10, 10, 0.85)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  padding: '3px 9px',
                  fontSize: '11px',
                  fontFamily: 'var(--font-tech)',
                  color: '#FFFFFF',
                  letterSpacing: '0.1em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <span style={{ width: '5px', height: '5px', backgroundColor: '#FF2424', display: 'inline-block' }} />
                <span>{project.number} // {project.year}</span>
              </div>

              <img 
                src={project.image} 
                alt={project.title} 
                style={{
                  width: '100%',
                  height: 'clamp(220px, 28vw, 360px)',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            </div>

            {/* Product Specifications Block */}
            {project.specifications && (
              <div 
                style={{
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem'
                }}
              >
                <span className="tech-label" style={{ color: '#FF2424', fontSize: '0.74rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Shield size={14} />
                  PRODUCT SPECIFICATIONS
                </span>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem', fontFamily: 'var(--font-body)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.4rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Industry:</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{project.specifications.industry}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.4rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Application Type:</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{project.specifications.appType}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.4rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Scale / Capacity:</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{project.specifications.scale}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.2rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Deployment:</span>
                    <span style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)', color: '#22c55e', border: '1px solid rgba(34, 197, 94, 0.3)', padding: '2px 8px', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                      {project.specifications.deployment}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Title, Narrative Summary, Features & Action */}
          <div 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              padding: 'clamp(1.5rem, 2.5vw, 2rem)',
              height: '100%',
              boxSizing: 'border-box',
              gap: '1.25rem'
            }}
          >
            <div>
              {/* Badges Row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                {project.badge && (
                  <span style={{ backgroundColor: '#0B2046', color: '#FFFFFF', padding: '3px 10px', fontSize: '0.72rem', fontFamily: 'var(--font-tech)', fontWeight: 700, letterSpacing: '0.08em' }}>
                    {project.badge}
                  </span>
                )}
                {project.customizableBadge && (
                  <span style={{ backgroundColor: 'var(--surface-hover)', border: '1px solid var(--border)', color: 'var(--text-secondary)', padding: '3px 10px', fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>
                    {project.customizableBadge}
                  </span>
                )}
              </div>

              <h1
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.6rem, 3.2vw, 2.5rem)',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  lineHeight: 1.1,
                  letterSpacing: '0.02em',
                  color: 'var(--text-primary)',
                  margin: '0 0 0.5rem 0'
                }}
              >
                {project.title}
              </h1>

              {project.subtitle && (
                <h3 style={{ fontFamily: 'var(--font-tech)', fontSize: '0.95rem', color: '#FF2424', margin: '0 0 1rem 0', fontWeight: 700 }}>
                  {project.subtitle}
                </h3>
              )}

              <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 1.25rem 0' }}>
                {project.summary}
              </p>

              {/* Included Modules & Features */}
              {project.features && project.features.length > 0 && (
                <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.85rem' }}>
                    <CheckCircle2 size={15} color="#FF2424" />
                    <span className="tech-label" style={{ fontSize: '0.74rem', color: 'var(--text-primary)' }}>
                      INCLUDED MODULES & FEATURES
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
                    {project.features.map((feature, fIdx) => (
                      <div 
                        key={fIdx} 
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '6px 10px',
                          backgroundColor: 'var(--surface-hover)',
                          border: '1px solid var(--border)',
                          fontSize: '0.78rem',
                          fontFamily: 'var(--font-body)',
                          color: 'var(--text-primary)'
                        }}
                      >
                        <CheckCircle2 size={12} color="#FF2424" style={{ flexShrink: 0 }} />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Direct Action Quote Button */}
            <div style={{ marginTop: '1.5rem' }}>
              <button 
                onClick={onStartProject} 
                className="btn-tech-accent" 
                style={{ width: '100%', justifyContent: 'center', padding: '0.85rem 1.4rem' }}
              >
                <span>REQUEST LIVE DEMO / CUSTOM QUOTATION</span>
                <ArrowRight size={16} />
              </button>
            </div>

          </div>

        </div>

        {/* Compact Other Work Bar */}
        {otherProjects.length > 0 && (
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span className="tech-label" style={{ color: 'var(--text-muted)', fontSize: '0.74rem' }}>
                EXPLORE MORE CASE STUDIES
              </span>
              <button 
                onClick={onBack} 
                style={{ fontFamily: 'var(--font-tech)', fontSize: '0.76rem', color: '#FF2424', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, letterSpacing: '0.08em' }}
              >
                VIEW ALL WORK →
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              {otherProjects.map((op) => (
                <div
                  key={op.id}
                  onClick={() => onSelectOtherProject(op)}
                  style={{
                    backgroundColor: 'var(--surface)',
                    border: '1px solid var(--border)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.85rem',
                    transition: 'border-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <img src={op.image} alt={op.title} style={{ width: '80px', height: '60px', objectFit: 'cover', flexShrink: 0 }} />
                  <div style={{ overflow: 'hidden' }}>
                    <span style={{ fontFamily: 'var(--font-tech)', fontSize: '0.68rem', color: '#FF2424', display: 'block' }}>
                      {op.number} // {op.category}
                    </span>
                    <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 800, margin: '2px 0 0 0', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {op.title}
                    </h4>
                  </div>
                  <ArrowUpRight size={15} color="var(--text-muted)" style={{ marginLeft: 'auto', flexShrink: 0 }} />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

