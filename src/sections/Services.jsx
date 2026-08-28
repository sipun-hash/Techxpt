import React, { useState, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { SERVICES } from '../data/content';
import { FadeUp, ClipReveal, LineReveal } from '../components/ScrollReveal';

export default function Services({ onSelectService }) {
  const [hoveredService, setHoveredService] = useState(null);
  const containerRef = useRef(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 250, mass: 0.2 };
  const imageX = useSpring(mouseX, springConfig);
  const imageY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      style={{
        position: 'relative',
        width: '100%',
        backgroundColor: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
        paddingTop: 'clamp(4rem, 8vw, 6.5rem)',
        paddingBottom: 'clamp(4rem, 8vw, 6.5rem)',
        overflow: 'hidden'
      }}
    >
      <div className="container">
        
        {/* Section Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border)', gap: '1rem' }}>
          <div>
            <FadeUp>
              <span className="tech-label" style={{ display: 'block', marginBottom: '0.4rem', color: '#FF2424' }}>
                CAPABILITIES
              </span>
            </FadeUp>
            <ClipReveal delay={0.08}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.65rem, 3vw, 2.4rem)', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-primary)', margin: 0, letterSpacing: '0.02em' }}>
                WHAT WE DO
              </h2>
            </ClipReveal>
          </div>
          
          <FadeUp delay={0.15}>
            <p style={{ fontFamily: 'var(--font-tech)', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', maxWidth: '300px', margin: 0, letterSpacing: '0.18em', fontWeight: 400 }}>
              FULL-CYCLE DIGITAL PRODUCT ENGINEERING & ARCHITECTURE
            </p>
          </FadeUp>
        </div>

        {/* Full-Width Numbered List with Scroll Reveal */}
        <div>
          {SERVICES.map((service, index) => {
            const isHovered = hoveredService?.id === service.id;

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.45, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => setHoveredService(service)}
                onMouseLeave={() => setHoveredService(null)}
                onClick={() => onSelectService(service)}
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  borderBottom: '1px solid var(--border)',
                  padding: 'clamp(1.2rem, 2.5vw, 1.85rem) 1rem',
                  cursor: 'pointer'
                }}
              >
                {/* Red Bottom-to-Top Fill Layer */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: '#FF2424',
                    transform: isHovered ? 'translateY(0%)' : 'translateY(100%)',
                    transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                    zIndex: 0,
                    pointerEvents: 'none'
                  }}
                />

                <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.25rem' }}>
                  
                  {/* Left: Number & Title */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'clamp(1rem, 2.5vw, 1.75rem)' }}>
                    <span 
                      style={{
                        fontFamily: 'var(--font-tech)',
                        fontSize: 'clamp(0.95rem, 1.4vw, 1.15rem)',
                        fontWeight: 700,
                        letterSpacing: '0.12em',
                        color: isHovered ? '#FFFFFF' : 'var(--text-muted)',
                        transition: 'color 0.25s ease',
                        minWidth: '28px',
                        marginTop: '2px'
                      }}
                    >
                      {service.id}
                    </span>
                    
                    <div>
                      <h3 
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: 'clamp(1.15rem, 2vw, 1.65rem)',
                          fontWeight: 900,
                          textTransform: 'uppercase',
                          color: isHovered ? '#FFFFFF' : 'var(--text-primary)',
                          margin: 0,
                          letterSpacing: '0.02em',
                          transform: isHovered ? 'translateX(6px)' : 'none',
                          transition: 'transform 0.25s ease, color 0.25s ease'
                        }}
                      >
                        {service.title}
                      </h3>
                      <p style={{ color: isHovered ? 'rgba(255, 255, 255, 0.92)' : 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '0.35rem', margin: '0.35rem 0 0 0', lineHeight: 1.5, transition: 'color 0.25s ease' }}>
                        {service.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Right: Tags & Arrow */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div className="hidden-mobile" style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {service.tags.slice(0, 2).map((tag, i) => (
                        <span 
                          key={i} 
                          style={{
                            padding: '3px 8px',
                            fontSize: '10px',
                            fontFamily: 'var(--font-mono)',
                            textTransform: 'uppercase',
                            backgroundColor: isHovered ? 'rgba(0, 0, 0, 0.25)' : 'var(--surface)',
                            border: isHovered ? '1px solid rgba(255, 255, 255, 0.35)' : '1px solid var(--border)',
                            color: isHovered ? '#FFFFFF' : 'var(--text-secondary)',
                            transition: 'all 0.25s ease'
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div 
                      style={{
                        width: '42px',
                        height: '42px',
                        border: isHovered ? '1px solid #FFFFFF' : '1px solid var(--border)',
                        backgroundColor: isHovered ? '#FFFFFF' : 'var(--surface)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.25s ease',
                        flexShrink: 0
                      }}
                    >
                      <ArrowUpRight 
                        size={18} 
                        style={{
                          color: isHovered ? '#FF2424' : 'var(--text-secondary)',
                          transform: isHovered ? 'translate(2px, -2px)' : 'none',
                          transition: 'transform 0.25s ease, color 0.25s ease'
                        }} 
                      />
                    </div>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* Floating Image Follower on Desktop */}
      {hoveredService && (
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            x: imageX,
            y: imageY,
            translateX: '-50%',
            translateY: '-50%',
            pointerEvents: 'none',
            zIndex: 50,
            width: '300px',
            height: '190px',
            border: '1px solid #FF2424',
            backgroundColor: 'var(--bg)',
            overflow: 'hidden'
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
        >
          <img 
            src={hoveredService.image} 
            alt={hoveredService.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', bottom: '8px', left: '8px', backgroundColor: 'var(--bg)', padding: '3px 7px', border: '1px solid var(--border)', fontSize: '9px', fontFamily: 'var(--font-mono)', color: '#FF2424', fontWeight: 700 }}>
            TX // {hoveredService.title}
          </div>
        </motion.div>
      )}

    </section>
  );
}
