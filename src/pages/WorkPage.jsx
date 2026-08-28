import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PROJECTS } from '../data/content';
import { ArrowUpRight, ArrowRight, Filter, Sparkles, Layers } from 'lucide-react';

export default function WorkPage({ onSelectProject, onStartProject, setCursorMode, setCursorText }) {
  const [activeFilter, setActiveFilter] = useState('ALL');

  const categories = ['ALL', 'WEB APPLICATION', 'AI & AUTOMATION', 'SOFTWARE', 'DIGITAL PRODUCTS'];

  const filteredProjects = activeFilter === 'ALL'
    ? PROJECTS
    : PROJECTS.filter(p => p.category.toUpperCase().includes(activeFilter));

  return (
    <div className="page-shell" style={{ paddingBottom: 'clamp(2.5rem, 4vw, 3.5rem)' }}>
      <div className="container">
        
        {/* Compact Architectural Header & Integrated Filter Bar */}
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-end', 
            borderBottom: '1px solid var(--border)', 
            paddingBottom: '1.25rem', 
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1.25rem'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <span style={{ width: '6px', height: '6px', backgroundColor: '#FF2424', display: 'inline-block' }} />
              <span className="tech-label" style={{ color: '#FF2424', fontSize: '0.76rem' }}>
                PORTFOLIO ARCHIVE // PRODUCTION INDEX
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
              SELECTED WORK
            </h1>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
            <span style={{ fontFamily: 'var(--font-tech)', fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.12em', marginRight: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Filter size={11} /> FILTER:
            </span>
            {categories.map((cat) => {
              const isActive = activeFilter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  style={{
                    padding: '6px 12px',
                    fontFamily: 'var(--font-tech)',
                    fontSize: '0.72rem',
                    fontWeight: isActive ? 700 : 500,
                    letterSpacing: '0.1em',
                    backgroundColor: isActive ? '#FF2424' : 'var(--surface)',
                    color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                    border: isActive ? '1px solid #FF2424' : '1px solid var(--border)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* High-Density Portfolio Grid */}
        <motion.div 
          layout
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2.5rem'
          }}
        >
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
                onClick={() => onSelectProject(project)}
                onMouseEnter={() => {
                  setCursorMode?.('project');
                  setCursorText?.('VIEW CASE →');
                }}
                onMouseLeave={() => {
                  setCursorMode?.('default');
                  setCursorText?.('');
                }}
                style={{
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  position: 'relative',
                  transition: 'border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = '#FF2424';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.15)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Media Frame */}
                <div 
                  style={{ 
                    position: 'relative', 
                    height: '210px', 
                    width: '100%', 
                    backgroundColor: 'var(--bg)',
                    overflow: 'hidden',
                    borderBottom: '1px solid var(--border)'
                  }}
                >
                  {/* Top Badge: Index & Year */}
                  <div 
                    style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      zIndex: 10,
                      padding: '3px 8px',
                      backgroundColor: 'rgba(0, 0, 0, 0.75)',
                      backdropFilter: 'blur(4px)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#FFFFFF',
                      fontFamily: 'var(--font-tech)',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <span style={{ width: '4px', height: '4px', backgroundColor: '#FF2424', display: 'inline-block' }} />
                    <span>{project.number} // {project.year}</span>
                  </div>

                  {/* Category Pill Tag */}
                  <div 
                    style={{
                      position: 'absolute',
                      bottom: '10px',
                      left: '10px',
                      zIndex: 10,
                      padding: '2px 7px',
                      backgroundColor: '#FF2424',
                      color: '#FFFFFF',
                      fontFamily: 'var(--font-tech)',
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase'
                    }}
                  >
                    {project.category}
                  </div>

                  <img 
                    src={project.image} 
                    alt={project.title}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: 'contrast(105%)',
                      transition: 'transform 0.4s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.06)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />
                </div>

                {/* Content Details */}
                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <h3 
                        style={{ 
                          fontFamily: 'var(--font-display)', 
                          fontSize: '1.15rem', 
                          fontWeight: 900, 
                          textTransform: 'uppercase', 
                          color: 'var(--text-primary)', 
                          margin: 0, 
                          letterSpacing: '0.02em', 
                          lineHeight: 1.2 
                        }}
                      >
                        {project.title}
                      </h3>

                      <div 
                        style={{
                          width: '28px',
                          height: '28px',
                          border: '1px solid var(--border)',
                          backgroundColor: 'var(--surface-hover)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          color: '#FF2424'
                        }}
                      >
                        <ArrowUpRight size={14} />
                      </div>
                    </div>

                    <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
                      {project.summary}
                    </p>
                  </div>

                  {/* Production Stack Strip */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                    {project.techStack?.slice(0, 4).map((t) => (
                      <span 
                        key={t} 
                        style={{
                          padding: '2px 7px',
                          fontSize: '0.68rem',
                          fontFamily: 'var(--font-tech)',
                          fontWeight: 600,
                          backgroundColor: 'var(--surface-hover)',
                          border: '1px solid var(--border)',
                          color: 'var(--text-muted)',
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase'
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Compact Integrated Initiation Strip */}
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
              HAVE A BESPOKE SYSTEM REQUIREMENT?
            </span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-primary)' }}>
              Let's engineer your technical solution together.
            </span>
          </div>

          <button 
            onClick={onStartProject}
            className="btn-tech-accent"
            style={{ padding: '0.65rem 1.3rem', fontSize: '0.78rem' }}
          >
            <span>START A PROJECT</span>
            <ArrowRight size={14} />
          </button>
        </div>

      </div>
    </div>
  );
}

