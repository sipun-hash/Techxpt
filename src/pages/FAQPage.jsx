import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight, HelpCircle, Mail, MessageSquare } from 'lucide-react';
import { FAQS, BRAND } from '../data/content';
import CTA from '../sections/CTA';

export default function FAQPage({ onStartProject }) {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [openId, setOpenId] = useState(FAQS[0]?.id || null);

  const categories = ['ALL', 'SERVICES', 'TIMELINE', 'PROCESS', 'OWNERSHIP', 'SUPPORT', 'AI & TECH'];

  const filteredFaqs = activeCategory === 'ALL'
    ? FAQS
    : FAQS.filter(f => f.category.toUpperCase() === activeCategory);

  const toggleFaq = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="page-shell">
      <div className="container">
        
        {/* Header Title */}
        <div style={{ width: '100%', marginBottom: '2.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <span style={{ width: '6px', height: '6px', backgroundColor: '#FF2424', display: 'inline-block' }} />
            <span className="tech-label tech-label-accent">KNOWLEDGE BASE // FAQ</span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
              fontWeight: 900,
              textTransform: 'uppercase',
              lineHeight: 1.05,
              letterSpacing: '0.02em',
              color: 'var(--text-primary)',
              margin: '0 0 1rem 0'
            }}
          >
            FREQUENTLY ASKED QUESTIONS
          </h1>

          <p style={{ fontSize: 'clamp(0.95rem, 1.3vw, 1.15rem)', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0, maxWidth: '720px' }}>
            Everything you need to know about our custom engineering services, project timelines, code ownership, and support.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
          {categories.map((cat) => {
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '7px 14px',
                  fontFamily: 'var(--font-tech)',
                  fontSize: '0.76rem',
                  fontWeight: isSelected ? 700 : 500,
                  backgroundColor: isSelected ? '#FF2424' : 'var(--surface)',
                  color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                  border: isSelected ? '1px solid #FF2424' : '1px solid var(--border)',
                  cursor: 'pointer',
                  letterSpacing: '0.06em',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* FAQ Accordion List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '4rem' }}>
          {filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <div
                key={faq.id}
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
                    padding: '1.25rem 1.5rem',
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
                    <div>
                      <span className="tech-label" style={{ display: 'inline-block', fontSize: '0.68rem', color: '#FF2424', marginBottom: '0.2rem' }}>
                        {faq.category}
                      </span>
                      <h3 
                        style={{ 
                          fontFamily: 'var(--font-display)', 
                          fontSize: 'clamp(1rem, 1.4vw, 1.15rem)', 
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
                  </div>

                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ color: isOpen ? '#FF2424' : 'var(--text-muted)', flexShrink: 0 }}
                  >
                    <ChevronDown size={20} />
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
                          padding: '0 1.5rem 1.5rem 2.5rem', 
                          color: 'var(--text-secondary)', 
                          fontSize: '0.96rem', 
                          lineHeight: 1.65,
                          borderTop: '1px solid var(--border)',
                          paddingTop: '1rem'
                        }}
                      >
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>

      {/* CTA */}
      <CTA onStartProject={onStartProject} />
    </div>
  );
}
