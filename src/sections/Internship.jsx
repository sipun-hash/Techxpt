import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Code2, Globe, Cpu, Layers } from 'lucide-react';
import { FadeUp, ClipReveal } from '../components/ScrollReveal';

export default function Internship({ onApply, onViewDetails }) {
  const [hoveredTrack, setHoveredTrack] = useState(null);

  const internshipPrograms = [
    {
      id: 'marketing',
      num: '01',
      tag: 'GROWTH & B2B',
      title: 'Software Marketing',
      subtitle: 'INTERNSHIP PROGRAM',
      image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
      highlights: ['B2B Sales', 'Lead Generation', 'Ad Campaigns']
    },
    {
      id: 'react',
      num: '02',
      tag: 'FRONTEND ARCHITECTURE',
      title: 'React JS Development',
      subtitle: 'INTERNSHIP PROGRAM',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
      highlights: ['React 18+', 'Custom Hooks', 'REST APIs']
    },
    {
      id: 'php',
      num: '03',
      tag: 'BACKEND & DATABASE',
      title: 'PHP & Backend Dev',
      subtitle: 'INTERNSHIP PROGRAM',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
      highlights: ['PHP 8+ OOP', 'MySQL DB', 'Auth & JWT']
    },
    {
      id: 'uiux',
      num: '04',
      tag: 'UI/UX & WEBSITES',
      title: 'HTML, CSS & UI Design',
      subtitle: 'INTERNSHIP PROGRAM',
      image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
      highlights: ['CSS Grid & Flex', 'Bootstrap 5', 'Micro-UI']
    }
  ];

  return (
    <section 
      style={{ 
        width: '100%', 
        backgroundColor: 'var(--bg)', 
        borderBottom: '1px solid var(--border)', 
        paddingTop: 'clamp(2.5rem, 4vw, 4rem)', 
        paddingBottom: 'clamp(2.5rem, 4vw, 4rem)',
        overflow: 'hidden'
      }}
    >
      <div className="container">
        
        {/* Top Header Block - High Density */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto clamp(1.5rem, 3vw, 2.5rem) auto' }}>
          <FadeUp>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
              <span style={{ width: '22px', height: '2px', backgroundColor: '#FF2424' }} />
              <span className="tech-label" style={{ color: '#FF2424', fontSize: '0.74rem', letterSpacing: '0.14em' }}>
                EXPERIENCE & CAREER
              </span>
              <span style={{ width: '22px', height: '2px', backgroundColor: '#FF2424' }} />
            </div>
          </FadeUp>

          <ClipReveal delay={0.06}>
            <h2 
              style={{ 
                fontFamily: 'var(--font-display)', 
                fontSize: 'clamp(1.6rem, 3.2vw, 2.6rem)', 
                fontWeight: 900, 
                textTransform: 'uppercase', 
                color: 'var(--text-primary)', 
                margin: '0 0 0.65rem 0',
                letterSpacing: '0.02em',
                lineHeight: 1.12
              }}
            >
              Industry Internship Program
            </h2>
          </ClipReveal>

          <FadeUp delay={0.1}>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(0.85rem, 1.2vw, 0.95rem)', lineHeight: 1.55, margin: 0 }}>
              Practical, production-level engineering experience in Software Marketing, PHP & MySQL Backend, React JS Frontend, and UI/UX Web Design with live client project exposure.
            </p>
          </FadeUp>
        </div>

        {/* Desktop Interactive Grid / Mobile Compact Horizontal Scroller */}
        <div 
          className="internship-cards-container"
          style={{
            marginBottom: 'clamp(1.5rem, 2.5vw, 2.5rem)'
          }}
        >
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1rem'
            }}
            className="internship-grid-responsive"
          >
            {internshipPrograms.map((prog, idx) => {
              const isHovered = hoveredTrack === prog.id;

              return (
                <div
                  key={prog.id}
                  onClick={onViewDetails}
                  onMouseEnter={() => setHoveredTrack(prog.id)}
                  onMouseLeave={() => setHoveredTrack(null)}
                  style={{
                    position: 'relative',
                    height: 'clamp(160px, 22vw, 250px)',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    border: isHovered ? '1px solid #FF2424' : '1px solid var(--border)',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                    boxShadow: isHovered ? '0 10px 24px rgba(255, 36, 36, 0.18)' : '0 2px 8px rgba(0,0,0,0.06)'
                  }}
                  className="internship-card-item"
                >
                  {/* Card Background Image with zoom */}
                  <img 
                    src={prog.image} 
                    alt={prog.title} 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      filter: 'brightness(0.68) contrast(1.15)',
                      transform: isHovered ? 'scale(1.06)' : 'scale(1)',
                      transition: 'transform 0.5s ease'
                    }} 
                  />

                  {/* Gradient Overlay */}
                  <div 
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(5, 5, 5, 0.95) 0%, rgba(5, 5, 5, 0.55) 55%, rgba(0, 0, 0, 0.25) 100%)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      padding: 'clamp(0.85rem, 1.5vw, 1.25rem)'
                    }}
                  >
                    {/* Top Index & Tag */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span 
                        style={{ 
                          fontFamily: 'var(--font-mono)', 
                          fontSize: '0.65rem', 
                          fontWeight: 800, 
                          color: '#FF2424',
                          backgroundColor: 'rgba(0, 0, 0, 0.6)',
                          padding: '2px 6px',
                          border: '1px solid rgba(255, 36, 36, 0.3)',
                          borderRadius: '2px'
                        }}
                      >
                        {prog.num} // {prog.tag}
                      </span>
                      
                      <div 
                        style={{ 
                          width: '24px', 
                          height: '24px', 
                          borderRadius: '50%', 
                          backgroundColor: isHovered ? '#FF2424' : 'rgba(255, 255, 255, 0.1)', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <ArrowRight size={12} color="#FFFFFF" />
                      </div>
                    </div>

                    {/* Bottom Title & Highlight Badges */}
                    <div>
                      <h3 
                        style={{ 
                          fontFamily: 'var(--font-display)', 
                          fontSize: 'clamp(0.95rem, 1.4vw, 1.2rem)', 
                          fontWeight: 900, 
                          color: '#FFFFFF', 
                          margin: '0 0 2px 0',
                          textTransform: 'uppercase',
                          lineHeight: 1.15,
                          letterSpacing: '0.02em'
                        }}
                      >
                        {prog.title}
                      </h3>
                      
                      <span 
                        style={{ 
                          fontFamily: 'var(--font-tech)', 
                          fontSize: '0.65rem', 
                          fontWeight: 700, 
                          color: '#FF2424', 
                          letterSpacing: '0.1em',
                          display: 'block',
                          marginBottom: '6px'
                        }}
                      >
                        {prog.subtitle}
                      </span>

                      {/* Desktop Skills Strip (hidden or condensed on small screens) */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }} className="hidden sm:flex">
                        {prog.highlights.map((h, hIdx) => (
                          <span 
                            key={hIdx}
                            style={{ 
                              fontSize: '9px', 
                              fontFamily: 'var(--font-mono)', 
                              backgroundColor: 'rgba(255, 255, 255, 0.12)', 
                              color: '#E0E0E0', 
                              padding: '1px 5px',
                              borderRadius: '2px'
                            }}
                          >
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Compact Action Row */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={onViewDetails}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              backgroundColor: '#FF2424',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '999px',
              padding: '0.75rem 1.65rem',
              fontFamily: 'var(--font-tech)',
              fontSize: '0.8rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(255, 36, 36, 0.28)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E01E1E'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FF2424'}
          >
            <span>View All Program Details & Curriculum</span>
            <ArrowRight size={15} />
          </button>

          <button
            onClick={onApply}
            className="btn-tech-outline"
            style={{
              borderRadius: '999px',
              padding: '0.7rem 1.4rem',
              fontSize: '0.78rem'
            }}
          >
            <span>Direct Enrollment</span>
          </button>
        </div>

      </div>

      {/* Mobile-Friendly Media Query for Ultra-Compact Layout */}
      <style>{`
        @media (max-width: 640px) {
          .internship-grid-responsive {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.55rem !important;
          }
          .internship-card-item {
            height: 125px !important;
          }
        }
      `}</style>
    </section>
  );
}


