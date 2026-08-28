import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, CheckCircle2, Send, Mail, MapPin } from 'lucide-react';
import { BRAND } from '../data/content';

export default function ContactModal({ isOpen, onClose }) {
  const [selectedServices, setSelectedServices] = useState(['Web Development']);
  const [selectedBudget, setSelectedBudget] = useState('₹3L - ₹10L');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  // Smooth scroll locking without layout jump
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflowY = 'scroll';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflowY = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflowY = '';
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const servicesList = [
    'Web Development',
    'Custom Software',
    'AI & Automation',
    'Digital Product Design',
    'Cloud & Infrastructure'
  ];

  const budgetTiers = [
    '< ₹3 Lakhs',
    '₹3L - ₹10L',
    '₹10L - ₹25L',
    '₹25L+'
  ];

  const toggleService = (srv) => {
    if (selectedServices.includes(srv)) {
      if (selectedServices.length > 1) {
        setSelectedServices(selectedServices.filter(s => s !== srv));
      }
    } else {
      setSelectedServices([...selectedServices, srv]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const resetAndClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          key="contact-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10000,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            display: 'flex',
            justifyContent: 'flex-end',
            overflow: 'hidden'
          }}
        >
          {/* Sliding Panel */}
          <motion.div
            key="contact-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: '100%',
              maxWidth: '580px',
              height: '100%',
              backgroundColor: 'var(--bg)',
              color: 'var(--text-primary)',
              borderLeft: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              boxShadow: '-8px 0 32px rgba(0, 0, 0, 0.45)',
              overflow: 'hidden'
            }}
          >
            {/* 1. Header with interactive Close */}
            <div 
              style={{
                flexShrink: 0,
                padding: '1.15rem 1.75rem',
                borderBottom: '1px solid var(--border)',
                backgroundColor: 'var(--surface)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#FF2424' }}></span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-primary)', fontWeight: 700 }}>
                  INITIATE PROJECT // TECHXPT
                </span>
              </div>
              
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={resetAndClose}
                title="Close Panel (Esc)"
                style={{
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  cursor: 'pointer',
                  color: 'var(--text-primary)',
                  padding: '6px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  transition: 'all 0.15s ease',
                  flexShrink: 0
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#FF2424';
                  e.currentTarget.style.color = '#FF2424';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
              >
                <span>ESC</span>
                <X size={15} />
              </motion.button>
            </div>

            {/* 2. Scrollable Body with Staggered Interactive Fields */}
            <div 
              style={{
                flexGrow: 1,
                overflowY: 'auto',
                padding: 'clamp(1.25rem, 4vw, 2rem)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{ textAlign: 'center', padding: '3rem 1rem', margin: 'auto 0' }}
                >
                  <CheckCircle2 size={52} style={{ color: '#FF2424', margin: '0 auto 1.25rem auto' }} />
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.85rem', fontWeight: 900, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                    TRANSMISSION RECEIVED
                  </h2>
                  <p style={{ maxWidth: '400px', margin: '0 auto', color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                    Thank you, <strong>{formData.name || 'Partner'}</strong>. Our engineering team is reviewing your project brief and will respond within 24 hours.
                  </p>
                  <div style={{ paddingTop: '1.75rem' }}>
                    <button onClick={resetAndClose} className="btn-tech-primary">
                      RETURN TO OVERVIEW <ArrowRight size={15} />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  
                  {/* Title */}
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, duration: 0.3 }}>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.65rem', fontWeight: 900, lineHeight: 1.1, textTransform: 'uppercase', color: 'var(--text-primary)', margin: 0 }}>
                      LET'S BUILD SOMETHING <span style={{ color: 'var(--accent)' }}>EXCEPTIONAL</span>.
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.4rem', margin: '0.4rem 0 0 0' }}>
                      Direct transmission to <a href={`mailto:${BRAND.email}`} style={{ color: 'var(--text-primary)', fontWeight: 600, textDecoration: 'underline' }}>{BRAND.email}</a>
                    </p>
                  </motion.div>

                  {/* Capabilities */}
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.3 }}>
                    <label className="tech-label" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                      01 // REQUIRED CAPABILITIES
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                      {servicesList.map(srv => {
                        const selected = selectedServices.includes(srv);
                        return (
                          <motion.button
                            key={srv}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={() => toggleService(srv)}
                            style={{
                              padding: '0.5rem 0.75rem',
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.72rem',
                              textTransform: 'uppercase',
                              letterSpacing: '0.04em',
                              fontWeight: selected ? 700 : 500,
                              backgroundColor: selected ? 'var(--accent)' : 'var(--surface)',
                              color: selected ? '#FFFFFF' : 'var(--text-secondary)',
                              border: selected ? '1px solid var(--accent)' : '1px solid var(--border)',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            {srv}
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>

                  {/* Budget */}
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.3 }}>
                    <label className="tech-label" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                      02 // ESTIMATED BUDGET (INR / ₹)
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '0.4rem' }}>
                      {budgetTiers.map(tier => {
                        const selected = selectedBudget === tier;
                        return (
                          <motion.button
                            key={tier}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={() => setSelectedBudget(tier)}
                            style={{
                              padding: '0.5rem 0.25rem',
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.72rem',
                              textAlign: 'center',
                              fontWeight: selected ? 700 : 500,
                              backgroundColor: selected ? 'var(--button-bg-invert)' : 'var(--surface)',
                              color: selected ? 'var(--button-text-invert)' : 'var(--text-secondary)',
                              border: selected ? '1px solid var(--button-bg-invert)' : '1px solid var(--border)',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            {tier}
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>

                  {/* Form Inputs */}
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.3 }} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <label className="tech-label" style={{ display: 'block', color: 'var(--text-muted)' }}>
                      03 // CONTACT PARTICULARS
                    </label>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.65rem' }}>
                      <input
                        type="text"
                        required
                        placeholder="Your Name *"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        style={{
                          width: '100%',
                          backgroundColor: 'var(--surface)',
                          border: '1px solid var(--border)',
                          color: 'var(--text-primary)',
                          padding: '0.7rem 0.8rem',
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.85rem',
                          outline: 'none'
                        }}
                      />
                      <input
                        type="email"
                        required
                        placeholder="Work Email *"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        style={{
                          width: '100%',
                          backgroundColor: 'var(--surface)',
                          border: '1px solid var(--border)',
                          color: 'var(--text-primary)',
                          padding: '0.7rem 0.8rem',
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.85rem',
                          outline: 'none'
                        }}
                      />
                    </div>

                    <input
                      type="text"
                      placeholder="Company / Organization Name"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      style={{
                        width: '100%',
                        backgroundColor: 'var(--surface)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-primary)',
                        padding: '0.7rem 0.8rem',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.85rem',
                        outline: 'none'
                      }}
                    />

                    <textarea
                      rows={3}
                      required
                      placeholder="Describe your project, objectives, and timeline *"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      style={{
                        width: '100%',
                        backgroundColor: 'var(--surface)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-primary)',
                        padding: '0.7rem 0.8rem',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.85rem',
                        outline: 'none',
                        resize: 'none'
                      }}
                    />
                  </motion.div>

                  {/* Submit Button */}
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.3 }}>
                    <button
                      type="submit"
                      className="btn-tech-accent"
                      style={{ width: '100%', justifyContent: 'center', display: 'flex', padding: '0.8rem 1.25rem' }}
                    >
                      TRANSMIT PROJECT BRIEF <Send size={15} />
                    </button>
                  </motion.div>
                </form>
              )}
            </div>

            {/* 3. Footer */}
            <div 
              style={{
                flexShrink: 0,
                padding: '0.85rem 1.75rem',
                borderTop: '1px solid var(--border)',
                backgroundColor: 'var(--surface)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Mail size={13} color="#FF2424" />
                <span>{BRAND.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MapPin size={13} color="#FF2424" />
                <span>{BRAND.location}</span>
              </div>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
