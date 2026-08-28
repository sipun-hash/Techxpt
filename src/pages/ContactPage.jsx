import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Send, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { BRAND } from '../data/content';
import { API_ENDPOINTS } from '../config/api';

export default function ContactPage({ onBack }) {
  const [selectedServices, setSelectedServices] = useState(['Web Development']);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        company: formData.company,
        phone: formData.company,
        service: selectedServices.join(', '),
        message: formData.message
      };

      const res = await fetch(API_ENDPOINTS.contact, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setSubmitted(true);
      } else {
        setSubmitError(data.message || 'Failed to submit. Please try again.');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-shell" style={{ paddingBottom: 'clamp(2.5rem, 4vw, 3.5rem)' }}>
      <div className="container">
        
        {/* Header Title (Compact) */}
        <div style={{ width: '100%', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <span style={{ width: '6px', height: '6px', backgroundColor: '#FF2424', display: 'inline-block' }} />
            <span className="tech-label tech-label-accent">PROJECT INITIATION // DIRECT LINE</span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              fontWeight: 900,
              textTransform: 'uppercase',
              lineHeight: 1.06,
              letterSpacing: '0.02em',
              color: 'var(--text-primary)',
              margin: '0 0 0.75rem 0'
            }}
          >
            LET'S BUILD SOMETHING EXTRAORDINARY.
          </h1>

          <p style={{ fontSize: 'clamp(0.92rem, 1.2vw, 1.05rem)', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0, maxWidth: '720px' }}>
            Tell us about your objectives, timeline, and architectural requirements. Our technical leadership team will respond within 24 business hours.
          </p>
        </div>

        {/* 2-Column Contact Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'start' }}>
          
          {/* Left Column: Interactive Project Inquiry Form */}
          <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', padding: 'clamp(1.25rem, 3vw, 2rem)' }}>
            {submitted ? (
              <div style={{ padding: '2.5rem 1rem', textAlign: 'center' }}>
                <div style={{ width: '56px', height: '56px', margin: '0 auto 1.25rem auto', backgroundColor: 'var(--surface-hover)', border: '1px solid #FF2424', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF2424' }}>
                  <CheckCircle2 size={28} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  INQUIRY TRANSMITTED
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '420px', margin: '0 auto 1.75rem auto', lineHeight: 1.6 }}>
                  Thank you, <strong>{formData.name || 'there'}</strong>. Your project specifications have been routed to our lead engineers. We will review and reach out at <strong>{formData.email}</strong> shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn-tech-outline"
                  style={{ padding: '0.65rem 1.4rem', fontSize: '0.8rem' }}
                >
                  TRANSMIT ANOTHER INQUIRY
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* 1. Services Selection */}
                <div>
                  <label className="tech-label" style={{ display: 'block', marginBottom: '0.65rem', color: 'var(--text-primary)', fontSize: '0.76rem' }}>
                    01 // SELECT DESIRED CAPABILITIES
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                    {servicesList.map((srv) => {
                      const isSelected = selectedServices.includes(srv);
                      return (
                        <button
                          type="button"
                          key={srv}
                          onClick={() => toggleService(srv)}
                          style={{
                            padding: '7px 12px',
                            fontFamily: 'var(--font-tech)',
                            fontSize: '0.76rem',
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

                {/* 2. Inputs */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label className="tech-label" style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.72rem' }}>YOUR NAME *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        backgroundColor: 'var(--bg)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.88rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label className="tech-label" style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.72rem' }}>WORK EMAIL *</label>
                    <input
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        backgroundColor: 'var(--bg)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.88rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="tech-label" style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.72rem' }}>COMPANY / ORGANIZATION</label>
                  <input
                    type="text"
                    placeholder="e.g. Acme Corp or Stealth Startup"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      backgroundColor: 'var(--bg)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.88rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label className="tech-label" style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.72rem' }}>PROJECT OVERVIEW & GOALS *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Tell us what you are aiming to build, key timeline requirements, or technical constraints..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      backgroundColor: 'var(--bg)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.88rem',
                      outline: 'none',
                      resize: 'vertical',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-tech-accent"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '0.9rem',
                    fontSize: '0.85rem',
                    opacity: isSubmitting ? 0.7 : 1,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  <span>{isSubmitting ? 'TRANSMITTING SPECIFICATIONS...' : 'SUBMIT SPECIFICATIONS'}</span>
                  <Send size={15} />
                </button>

              </form>
            )}
          </div>

          {/* Right Column: Studio Contact Info & Direct Telemetry */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', padding: '2.25rem' }}>
              <span className="tech-label" style={{ color: '#FF2424', display: 'block', marginBottom: '1rem' }}>
                DIRECT TRANSMISSION
              </span>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontFamily: 'var(--font-tech)', fontSize: '0.85rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', display: 'block', marginBottom: '2px', letterSpacing: '0.14em' }}>PRIMARY INBOX</span>
                  <a href={`mailto:${BRAND?.email || BRAND?.contact?.email}`} style={{ color: 'var(--text-primary)', fontWeight: 600, letterSpacing: '0.08em' }}>
                    {BRAND?.email || BRAND?.contact?.email}
                  </a>
                </div>

                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', display: 'block', marginBottom: '2px', letterSpacing: '0.14em' }}>TELEPHONE</span>
                  <a href={`tel:${BRAND?.phone || BRAND?.contact?.phone}`} style={{ color: 'var(--text-primary)', fontWeight: 600, letterSpacing: '0.08em' }}>
                    {BRAND?.phone || BRAND?.contact?.phone}
                  </a>
                </div>

                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', display: 'block', marginBottom: '2px', letterSpacing: '0.14em' }}>STUDIO LOCATION</span>
                  <span style={{ color: 'var(--text-primary)', letterSpacing: '0.05em' }}>{BRAND?.location || BRAND?.contact?.location}</span>
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', padding: '2.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <ShieldCheck size={18} color="#FF2424" />
                <span className="tech-label" style={{ color: 'var(--text-primary)', margin: 0 }}>CONFIDENTIALITY GUARANTEE</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.65, margin: 0 }}>
                All project inquiries and technical briefs are subject to strict non-disclosure protection. We do not distribute client information.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
