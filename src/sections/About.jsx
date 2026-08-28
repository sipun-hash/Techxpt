import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, Shield, Zap, Sparkles, Layers } from 'lucide-react';
import { ABOUT_STATS } from '../data/content';
import { FadeUp, ClipReveal } from '../components/ScrollReveal';

export default function About({ onLearnMore, onStartProject }) {
  const whyChooseUs = [
    { num: '01', title: 'Built for Your Business', desc: 'We understand your goals and build tailored solutions — not ready-made templates.' },
    { num: '02', title: 'Simple & Easy to Use', desc: 'Intuitive layouts that your customers and staff can easily navigate.' },
    { num: '03', title: 'Mobile First', desc: 'Flawless performance on phones, tablets, and desktops alike.' },
    { num: '04', title: 'Fast & Reliable', desc: 'Clean engineering focused on high speed, security, and uptime.' },
    { num: '05', title: 'Support When You Need It', desc: 'Direct assistance for changes and improvements even after launch.' }
  ];

  return (
    <section 
      style={{ 
        width: '100%', 
        backgroundColor: 'var(--bg)', 
        borderBottom: '1px solid var(--border)', 
        paddingTop: 'clamp(2.5rem, 4vw, 3.5rem)', 
        paddingBottom: 'clamp(2.5rem, 4vw, 3.5rem)' 
      }}
    >
      <div className="container">
        
        {/* Main High-Density Console Wrapper */}
        <div 
          style={{ 
            backgroundColor: 'var(--surface)', 
            border: '1px solid var(--border)',
            overflow: 'hidden'
          }}
        >
          {/* Top Split Panel (Left Story vs Right Why Choose Us) */}
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              alignItems: 'stretch'
            }}
          >
            
            {/* Left Narrative Column */}
            <div 
              style={{ 
                padding: 'clamp(1.5rem, 3vw, 2.25rem)', 
                borderRight: '1px solid var(--border)',
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                gap: '1.25rem'
              }}
            >
              <div>
                <FadeUp>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.4rem' }}>
                    <span style={{ width: '6px', height: '6px', backgroundColor: '#FF2424', display: 'inline-block' }} />
                    <span className="tech-label" style={{ color: '#FF2424', fontSize: '0.74rem' }}>
                      ABOUT US
                    </span>
                  </div>
                </FadeUp>

                <ClipReveal delay={0.06}>
                  <h2 
                    style={{ 
                      fontFamily: 'var(--font-display)', 
                      fontSize: 'clamp(1.45rem, 2.5vw, 1.95rem)', 
                      fontWeight: 900, 
                      textTransform: 'uppercase', 
                      color: 'var(--text-primary)', 
                      lineHeight: 1.15, 
                      margin: '0 0 0.85rem 0',
                      letterSpacing: '0.02em'
                    }}
                  >
                    We Build Websites That Help Your Business Grow
                  </h2>
                </ClipReveal>

                <FadeUp delay={0.12}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, margin: '0 0 1rem 0' }}>
                    In today's digital world, your website is often the first place customers learn about your business. We help businesses turn ideas into professional websites that are easy to use, fast, mobile-friendly, and built according to your actual needs — not generic templates.
                  </p>
                </FadeUp>

                {/* Industries / Audience Micro-Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.5rem' }}>
                  {['Small Business', 'Startups', 'Hospitals', 'Schools', 'Diagnostic Centres', 'Enterprises'].map((badge) => (
                    <span 
                      key={badge} 
                      style={{ 
                        padding: '2px 8px', 
                        fontSize: '11px', 
                        fontFamily: 'var(--font-mono)', 
                        backgroundColor: 'var(--surface-hover)', 
                        border: '1px solid var(--border)', 
                        color: 'var(--text-secondary)' 
                      }}
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div>
                <button
                  onClick={onLearnMore}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontFamily: 'var(--font-tech)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: '#FF2424',
                    letterSpacing: '0.08em',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  <span>EXPLORE OUR FULL STORY</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Right Why Choose Us Console */}
            <div 
              style={{ 
                display: 'flex', 
                flexDirection: 'column',
                backgroundColor: 'var(--bg)'
              }}
            >
              {/* Header Bar */}
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: '6px',
                  padding: '0.75rem 1.25rem',
                  borderBottom: '1px solid var(--border)',
                  backgroundColor: 'var(--surface)',
                  fontFamily: 'var(--font-tech)',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#FF2424'
                }}
              >
                <Shield size={13} />
                <span>WHY CHOOSE TECHXPT?</span>
              </div>

              {/* Advantages List */}
              <div style={{ padding: 'clamp(1rem, 2.5vw, 1.25rem)', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.5rem' }}>
                {whyChooseUs.map((val, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: 'var(--surface)',
                      border: '1px solid var(--border)',
                      padding: '0.65rem 0.85rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.65rem',
                      transition: 'border-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = '#FF2424'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                  >
                    <CheckCircle2 size={14} color="#FF2424" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                        {val.title}
                      </span>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginLeft: '6px', lineHeight: 1.35 }}>
                        — {val.desc}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Integrated Telemetry Bottom Strip */}
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
              borderTop: '1px solid var(--border)',
              backgroundColor: 'var(--surface-hover)'
            }}
          >
            {ABOUT_STATS.map((stat, idx) => (
              <div 
                key={idx} 
                style={{ 
                  padding: '0.75rem 1.25rem', 
                  borderRight: idx !== ABOUT_STATS.length - 1 ? '1px solid var(--border)' : 'none' 
                }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1 }}>
                  {stat.value}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', textTransform: 'uppercase', color: '#FF2424', fontWeight: 700, letterSpacing: '0.08em', marginTop: '2px' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}

