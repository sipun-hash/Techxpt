import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Plus } from 'lucide-react';
import { PROJECTS } from '../data/content';
import { FadeUp, ClipReveal } from '../components/ScrollReveal';

export default function Projects({ onSelectProject, onViewAll, setCursorMode, setCursorText }) {
  const [activeId, setActiveId] = useState(PROJECTS[0]?.id || null);

  return (
    <section 
      style={{ 
        width: '100%', 
        backgroundColor: 'var(--bg)', 
        borderBottom: '1px solid var(--border)', 
        paddingTop: 'clamp(2.75rem, 4.5vw, 4rem)', 
        paddingBottom: 'clamp(2.75rem, 4.5vw, 4rem)' 
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
                SELECTED WORK
              </span>
            </FadeUp>
            <ClipReveal delay={0.08}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-primary)', margin: 0, letterSpacing: '0.02em' }}>
                SELECTED WORK
              </h2>
            </ClipReveal>
          </div>
          
          <FadeUp delay={0.15}>
            <button
              onClick={onViewAll}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-tech)', fontSize: '0.82rem', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.12em', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <span style={{ color: 'var(--text-primary)' }}>VIEW ALL PROJECTS</span>
              <ArrowRight size={15} color="#FF2424" />
            </button>
          </FadeUp>
        </div>

        {/* Expandable Card Slices (Responsive Horizontal Desktop / Vertical Mobile Accordion) */}
        <div className="projects-accordion-container">
          {PROJECTS.map((project) => {
            const isExpanded = activeId === project.id;

            return (
              <motion.div
                key={project.id}
                layout
                onClick={() => {
                  if (isExpanded) {
                    onSelectProject(project);
                  } else {
                    setActiveId(project.id);
                  }
                }}
                onMouseEnter={() => {
                  setActiveId(project.id);
                  setCursorMode?.('project');
                  setCursorText?.(isExpanded ? 'OPEN' : 'EXPAND');
                }}
                onMouseLeave={() => {
                  setCursorMode?.('default');
                  setCursorText?.('');
                }}
                transition={{
                  layout: { duration: 0.45, ease: [0.16, 1, 0.3, 1] }
                }}
                className={`project-slice-card ${isExpanded ? 'expanded' : 'collapsed'}`}
                style={{
                  border: isExpanded ? '1px solid var(--accent)' : '1px solid var(--border)'
                }}
              >
                {/* Background Image Layer with Cinematic Gradient Veil */}
                <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                  <img
                    src={project.image}
                    alt={project.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: isExpanded 
                        ? 'brightness(0.85) contrast(105%)' 
                        : 'brightness(0.28) contrast(120%) grayscale(70%)',
                      transform: isExpanded ? 'scale(1.04)' : 'scale(1)',
                      transition: 'filter 0.55s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: isExpanded
                        ? 'linear-gradient(to top, rgba(6, 6, 6, 0.98) 0%, rgba(6, 6, 6, 0.9) 30%, rgba(6, 6, 6, 0.15) 55%, rgba(6, 6, 6, 0.45) 100%)'
                        : 'linear-gradient(to top, rgba(10, 10, 10, 0.88) 0%, rgba(10, 10, 10, 0.5) 100%)',
                      transition: 'background 0.5s ease'
                    }}
                  />
                </div>

                {/* Content Overlay */}
                {isExpanded ? (
                  /* ================= EXPANDED CARD VIEW ================= */
                  <div 
                    className="project-expanded-content"
                    style={{ 
                      position: 'relative', 
                      zIndex: 2, 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      justifyContent: 'space-between'
                    }}
                  >
                    {/* Top Meta Pill */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', width: '100%' }}>
                      <div 
                        style={{
                          backgroundColor: 'rgba(10, 10, 10, 0.82)',
                          backdropFilter: 'blur(8px)',
                          border: '1px solid rgba(255, 255, 255, 0.18)',
                          padding: '3px 10px',
                          fontSize: '10px',
                          fontFamily: 'var(--font-tech)',
                          color: '#FFFFFF',
                          letterSpacing: '0.12em',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <span style={{ width: '5px', height: '5px', backgroundColor: '#FF2424', display: 'inline-block' }} />
                        <span>{project.number} // {project.year}</span>
                      </div>

                      <span 
                        style={{ 
                          fontFamily: 'var(--font-tech)', 
                          fontSize: '0.74rem', 
                          color: '#FF2424', 
                          letterSpacing: '0.12em', 
                          textTransform: 'uppercase',
                          fontWeight: 700,
                          backgroundColor: 'rgba(10, 10, 10, 0.75)',
                          backdropFilter: 'blur(8px)',
                          padding: '3px 8px',
                          border: '1px solid rgba(255, 36, 36, 0.35)'
                        }}
                      >
                        {project.category}
                      </span>
                    </div>

                    {/* Bottom Expanded Narrative - Restricted strictly to the lower 40% area */}
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.08 }}
                      className="project-expanded-bottom"
                      style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '0.6rem',
                        marginTop: 'auto',
                        width: '100%'
                      }}
                    >
                      <h3 
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: 'clamp(1.15rem, 2.2vw, 1.9rem)',
                          fontWeight: 900,
                          textTransform: 'uppercase',
                          color: '#FFFFFF',
                          margin: 0,
                          letterSpacing: '0.02em',
                          lineHeight: 1.15
                        }}
                      >
                        {project.title}
                      </h3>

                      <p 
                        className="project-summary-text"
                        style={{ 
                          fontSize: 'clamp(0.8rem, 1.1vw, 0.92rem)', 
                          color: 'rgba(255, 255, 255, 0.85)', 
                          lineHeight: 1.45,
                          margin: 0,
                          maxWidth: '680px'
                        }}
                      >
                        {project.summary}
                      </p>

                      {/* Meta Footer & Action */}
                      <div 
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                          paddingTop: '0.6rem',
                          marginTop: '0.15rem',
                          flexWrap: 'wrap',
                          gap: '0.5rem'
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ fontFamily: 'var(--font-tech)', fontSize: '0.62rem', color: 'rgba(255, 255, 255, 0.55)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                            CLIENT PARTNER
                          </span>
                          <span style={{ fontFamily: 'var(--font-tech)', fontSize: '0.82rem', color: '#FFFFFF', fontWeight: 600, letterSpacing: '0.05em' }}>
                            {project.client}
                          </span>
                        </div>

                        <div 
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectProject(project);
                          }}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.45rem',
                            padding: '7px 14px',
                            backgroundColor: '#FF2424',
                            color: '#FFFFFF',
                            fontFamily: 'var(--font-tech)',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            border: '1px solid #FF2424',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <span>EXPLORE CASE STUDY</span>
                          <ArrowUpRight size={14} />
                        </div>
                      </div>

                    </motion.div>
                  </div>
                ) : (
                  /* ================= COLLAPSED NARROW SLICE VIEW ================= */
                  <>
                    {/* Desktop Collapsed View (Vertical Column) */}
                    <div className="collapsed-title-desktop">
                      {/* Top Number */}
                      <div 
                        style={{
                          fontFamily: 'var(--font-tech)',
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          color: '#FFFFFF',
                          letterSpacing: '0.12em',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <span style={{ width: '5px', height: '5px', backgroundColor: '#FF2424', display: 'inline-block' }} />
                        <span>{project.number}</span>
                      </div>

                      {/* Rotated Vertical Title */}
                      <div 
                        style={{
                          writingMode: 'vertical-rl',
                          transform: 'rotate(180deg)',
                          fontFamily: 'var(--font-display)',
                          fontSize: 'clamp(0.95rem, 1.3vw, 1.15rem)',
                          fontWeight: 700,
                          letterSpacing: '0.12em',
                          color: '#FFFFFF',
                          textTransform: 'uppercase',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {project.title}
                      </div>

                      {/* Bottom Plus Accent */}
                      <div 
                        style={{
                          width: '26px',
                          height: '26px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          backgroundColor: 'rgba(10, 10, 10, 0.6)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFFFFF'
                        }}
                      >
                        <Plus size={13} />
                      </div>
                    </div>

                    {/* Mobile Collapsed View (Horizontal Row) */}
                    <div className="collapsed-title-mobile">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontFamily: 'var(--font-tech)', fontSize: '0.78rem', color: '#FF2424', fontWeight: 800 }}>
                          {project.number} //
                        </span>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', color: '#FFFFFF', fontWeight: 800, letterSpacing: '0.02em' }}>
                          {project.title}
                        </span>
                      </div>

                      <div 
                        style={{
                          width: '26px',
                          height: '26px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          backgroundColor: 'rgba(10, 10, 10, 0.6)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFFFFF',
                          flexShrink: 0
                        }}
                      >
                        <Plus size={13} />
                      </div>
                    </div>
                  </>
                )}

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}



