import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight, HelpCircle } from 'lucide-react';
import { FAQS } from '../data/content';
import { FadeUp, ClipReveal } from '../components/ScrollReveal';

export default function FAQ({ onStartProject, onViewAll }) {
  const [openId, setOpenId] = useState(FAQS[0]?.id || null);

  const toggleFaq = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section 
      style={{ 
        width: '100%', 
        backgroundColor: 'var(--bg)', 
        borderBottom: '1px solid var(--border)', 
        paddingTop: 'clamp(3.5rem, 6vw, 5.5rem)', 
        paddingBottom: 'clamp(3.5rem, 6vw, 5.5rem)' 
      }}
    >
      <div className="container">
        
        {/* Section Header */}
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-end', 
            marginBottom: '3rem', 
            paddingBottom: '1.25rem', 
            borderBottom: '1px solid var(--border)', 
            flexWrap: 'wrap', 
            gap: '1rem' 
          }}
        >
          <div>
            <FadeUp>
              <span className="tech-label" style={{ display: 'block', marginBottom: '0.4rem', color: '#FF2424' }}>
                FAQ & ANSWERS
              </span>
            </FadeUp>
            <ClipReveal delay={0.08}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 3.25rem)', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-primary)', margin: 0 }}>
                FREQUENTLY ASKED QUESTIONS
              </h2>
            </ClipReveal>
          </div>

          <FadeUp delay={0.15}>
            <button
              onClick={onViewAll}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                fontFamily: 'var(--font-tech)', 
                fontSize: '0.82rem', 
                textTransform: 'uppercase', 
                color: 'var(--text-secondary)', 
                letterSpacing: '0.1em',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <span style={{ color: 'var(--text-primary)' }}>VIEW ALL FAQS</span>
              <ArrowRight size={15} color="#FF2424" />
            </button>
          </FadeUp>
        </div>

        {/* 2-Column Responsive FAQ Accordion Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem', alignItems: 'start' }}>
          {FAQS.map((faq, idx) => {
            const isOpen = openId === faq.id;

            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                style={{
                  backgroundColor: isOpen ? 'var(--surface-hover)' : 'var(--surface)',
                  border: isOpen ? '1px solid #FF2424' : '1px solid var(--border)',
                  transition: 'border-color 0.2s ease, background-color 0.2s ease'
                }}
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  style={{
                    width: '100%',
                    padding: '1.25rem 1.4rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem',
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-primary)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ width: '6px', height: '6px', backgroundColor: isOpen ? '#FF2424' : 'var(--text-muted)', flexShrink: 0 }} />
                    <h3 
                      style={{ 
                        fontFamily: 'var(--font-display)', 
                        fontSize: 'clamp(0.92rem, 1.3vw, 1.05rem)', 
                        fontWeight: 800, 
                        textTransform: 'uppercase', 
                        margin: 0,
                        letterSpacing: '0.02em',
                        lineHeight: 1.3
                      }}
                    >
                      {faq.question}
                    </h3>
                  </div>

                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ color: isOpen ? '#FF2424' : 'var(--text-muted)', flexShrink: 0 }}
                  >
                    <ChevronDown size={18} />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div 
                        style={{ 
                          padding: '0 1.4rem 1.25rem 2.2rem', 
                          color: 'var(--text-secondary)', 
                          fontSize: '0.92rem', 
                          lineHeight: 1.6,
                          borderTop: '1px solid var(--border)',
                          paddingTop: '0.9rem'
                        }}
                      >
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
