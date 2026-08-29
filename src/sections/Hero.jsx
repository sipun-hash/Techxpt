import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowDown } from 'lucide-react';
import HeroQuantumEngine from '../components/HeroQuantumEngine';
import MagneticButton from '../components/MagneticButton';
import HeroGridBackground from '../components/HeroGridBackground';

export default function Hero({ onStartProject, onExploreWork }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05
      }
    }
  };

  const lineVariants = {
    hidden: { y: '100%', opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <section 
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingTop: 'calc(var(--nav-height) + var(--banner-offset, 0px) + 2.75rem)',
        paddingBottom: '3rem',
        borderBottom: '1px solid var(--border)',
        overflow: 'hidden',
        backgroundColor: 'var(--bg)',
        boxSizing: 'border-box'
      }}
    >
      {/* High-Aesthetic Interactive Grid & Spotlight Canvas */}
      <HeroGridBackground />

      <div className="container" style={{ position: 'relative', zIndex: 10, width: '100%' }}>
        
        {/* Top Tag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.1rem' }}>
          <span style={{ width: '6px', height: '6px', backgroundColor: '#FF2424', display: 'inline-block' }} />
          <span className="tech-label tech-label-accent">
            TECHNOLOGY / DESIGN / SOFTWARE
          </span>
        </div>

        {/* 2-Column Hero Structure */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'clamp(1.75rem, 4vw, 3.5rem)',
            alignItems: 'center'
          }}
        >
          
          {/* Left: Headline & Actions */}
          <div style={{ maxWidth: '640px' }}>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}
            >
              {/* Line 1 */}
              <div className="clip-text-wrap">
                <motion.h1 
                  variants={lineVariants}
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2.1rem, 4vw, 3.65rem)',
                    fontWeight: 900,
                    letterSpacing: '0.02em',
                    lineHeight: 1.08,
                    color: 'var(--text-primary)',
                    margin: 0
                  }}
                >
                  WE BUILD
                </motion.h1>
              </div>

              {/* Line 2 */}
              <div className="clip-text-wrap">
                <motion.h1 
                  variants={lineVariants}
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2.1rem, 4vw, 3.65rem)',
                    fontWeight: 900,
                    letterSpacing: '0.02em',
                    lineHeight: 1.08,
                    color: 'var(--text-primary)',
                    margin: 0
                  }}
                >
                  DIGITAL PRODUCTS
                </motion.h1>
              </div>

              {/* Line 3 with Red Accent */}
              <div className="clip-text-wrap">
                <motion.h1 
                  variants={lineVariants}
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2.1rem, 4vw, 3.65rem)',
                    fontWeight: 900,
                    letterSpacing: '0.02em',
                    lineHeight: 1.08,
                    color: 'var(--accent)',
                    margin: 0
                  }}
                >
                  THAT MATTER.
                </motion.h1>
              </div>
            </motion.div>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              style={{
                fontSize: 'clamp(0.98rem, 1.2vw, 1.12rem)',
                color: 'var(--text-secondary)',
                maxWidth: '520px',
                marginTop: '1.35rem',
                marginBottom: '1.85rem',
                lineHeight: 1.6
              }}
            >
              We design and build fast websites, custom software, and smart AI tools to help your business grow.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem' }}
            >
              <MagneticButton onClick={onStartProject} variant="accent">
                <span>START A PROJECT</span>
                <ArrowRight size={16} />
              </MagneticButton>

              <MagneticButton onClick={onExploreWork} variant="outline">
                <span>EXPLORE WORK</span>
                <ArrowDown size={16} />
              </MagneticButton>
            </motion.div>
          </div>

          {/* Right: Interactive 3D Quantum Hologram Engine */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
            >
              <HeroQuantumEngine onStartProject={onStartProject} />
            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
}
