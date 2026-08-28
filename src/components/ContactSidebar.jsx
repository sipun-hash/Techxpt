import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2, ShieldCheck, Mail, Phone } from 'lucide-react';
import { BRAND } from '../data/content';

export default function ContactSidebar({ isOpen, onClose }) {
  const [selectedServices, setSelectedServices] = useState(['Web Development']);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const servicesList = [
    'Web Development',
    'Custom Software',
    'AI & Automation',
    'Digital Product Design',
    'Cloud & Infrastructure'
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', justifyContent: 'flex-end' }}>
          
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(5px)',
              cursor: 'pointer'
            }}
          />

          {/* Slide-over Sidebar Drawer (Low Vertical Footprint & Responsive) */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'relative',
              zIndex: 10,
              width: '100%',
              maxWidth: 'min(580px, 100vw)',
              height: '100%',
              backgroundColor: 'var(--bg)',
              borderLeft: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.4)',
              overflowY: 'auto',
              boxSizing: 'border-box'
            }}
          >
            {/* Top Header Bar */}
            <div 
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '0.9rem 1.25rem', 
                borderBottom: '1px solid var(--border)',
                backgroundColor: 'var(--surface)',
                position: 'sticky',
                top: 0,
                zIndex: 20
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '6px', height: '6px', backgroundColor: '#FF2424', display: 'inline-block' }} />
                <span className="tech-label" style={{ color: '#FF2424', fontSize: '0.74rem', letterSpacing: '0.12em' }}>
                  LET'S TALK // DIRECT TRANSMISSION
                </span>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                aria-label="Close sidebar"
                style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: 'var(--surface-hover)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#FF2424';
                  e.currentTarget.style.color = '#FFFFFF';
                  e.currentTarget.style.borderColor = '#FF2424';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                  e.currentTarget.style.borderColor = 'var(--border)';
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Compact Body Content */}
            <div style={{ padding: 'clamp(1.1rem, 2.5vw, 1.6rem)', display: 'flex', flexDirection: 'column', gap: '1.25rem', flex: 1 }}>
              
              {/* Headline */}
              <div>
                <h2 
                  style={{ 
                    fontFamily: 'var(--font-display)', 
                    fontSize: 'clamp(1.35rem, 3vw, 1.75rem)', 
                    fontWeight: 900, 
                    textTransform: 'uppercase', 
                    color: 'var(--text-primary)', 
                    margin: '0 0 0.25rem 0',
                    lineHeight: 1.15,
                    letterSpacing: '0.02em'
                  }}
                >
                  START A PROJECT
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', lineHeight: 1.45, margin: 0 }}>
                  Share your objectives, timeline, and architectural requirements. Response within 24 business hours.
                </p>
              </div>

              {/* Inquiry Form */}
              {submitted ? (
                <div style={{ padding: '2rem 1rem', textAlign: 'center', backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
                  <div style={{ width: '48px', height: '48px', margin: '0 auto 1rem auto', backgroundColor: 'var(--surface-hover)', border: '1px solid #FF2424', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF2424' }}>
                    <CheckCircle2 size={24} />
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                    INQUIRY TRANSMITTED
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: '380px', margin: '0 auto 1.5rem auto', lineHeight: 1.5 }}>
                    Thank you, <strong>{formData.name || 'there'}</strong>. We have routed your specs to our lead engineer and will reach out at <strong>{formData.email}</strong> shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="btn-tech-outline"
                    style={{ padding: '0.55rem 1.2rem', fontSize: '0.76rem' }}
                  >
                    SUBMIT ANOTHER INQUIRY
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                  
                  {/* 1. Capabilities Pill Bar */}
                  <div>
                    <label className="tech-label" style={{ display: 'block', marginBottom: '0.45rem', color: 'var(--text-primary)', fontSize: '0.72rem' }}>
                      01 // DESIRED CAPABILITIES
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {servicesList.map((srv) => {
                        const isSelected = selectedServices.includes(srv);
                        return (
                          <button
                            type="button"
                            key={srv}
                            onClick={() => toggleService(srv)}
                            style={{
                              padding: '5px 10px',
                              fontFamily: 'var(--font-tech)',
                              fontSize: '0.72rem',
                              fontWeight: isSelected ? 700 : 500,
                              backgroundColor: isSelected ? '#FF2424' : 'var(--surface-hover)',
                              color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                              border: isSelected ? '1px solid #FF2424' : '1px solid var(--border)',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            {isSelected && '✓ '} {srv}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Inputs in Responsive Layout */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                      <div>
                        <label className="tech-label" style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.68rem' }}>YOUR NAME *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Rahul Sharma"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '8px 10px',
                            backgroundColor: 'var(--surface)',
                            border: '1px solid var(--border)',
                            color: 'var(--text-primary)',
                            fontFamily: 'var(--font-body)',
                            fontSize: '0.85rem',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>

                      <div>
                        <label className="tech-label" style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.68rem' }}>WORK EMAIL *</label>
                        <input
                          type="email"
                          required
                          placeholder="name@company.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '8px 10px',
                            backgroundColor: 'var(--surface)',
                            border: '1px solid var(--border)',
                            color: 'var(--text-primary)',
                            fontFamily: 'var(--font-body)',
                            fontSize: '0.85rem',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="tech-label" style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.68rem' }}>COMPANY / ORGANIZATION</label>
                      <input
                        type="text"
                        placeholder="e.g. Acme Corp or Stealth Startup"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          backgroundColor: 'var(--surface)',
                          border: '1px solid var(--border)',
                          color: 'var(--text-primary)',
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.85rem',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div>
                      <label className="tech-label" style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.68rem' }}>PROJECT OVERVIEW & GOALS *</label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Tell us what you are aiming to build, key timeline requirements, or technical constraints..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          backgroundColor: 'var(--surface)',
                          border: '1px solid var(--border)',
                          color: 'var(--text-primary)',
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.85rem',
                          outline: 'none',
                          resize: 'vertical',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn-tech-accent"
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      padding: '0.8rem',
                      fontSize: '0.82rem'
                    }}
                  >
                    <span>TRANSMIT SPECIFICATIONS</span>
                    <Send size={14} />
                  </button>

                </form>
              )}

              {/* Direct Channels & Guarantee (Single Compact Row) */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', fontFamily: 'var(--font-tech)', fontSize: '0.74rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem', display: 'block', letterSpacing: '0.1em' }}>DIRECT INBOX</span>
                    <a href={`mailto:${BRAND?.email || BRAND?.contact?.email}`} style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                      {BRAND?.email || BRAND?.contact?.email}
                    </a>
                  </div>

                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem', display: 'block', letterSpacing: '0.1em' }}>PHONE</span>
                    <a href={`tel:${BRAND?.phone || BRAND?.contact?.phone}`} style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                      {BRAND?.phone || BRAND?.contact?.phone}
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 0.75rem', backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
                  <ShieldCheck size={14} color="#FF2424" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
                    Strict NDA & confidentiality protection applies to all project briefs.
                  </span>
                </div>
              </div>

            </div>

          </motion.div>

        </div>
      )}
    </AnimatePresence>
  );
}
