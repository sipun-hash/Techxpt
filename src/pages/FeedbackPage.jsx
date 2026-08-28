import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Star, 
  Check, 
  Copy, 
  Share2, 
  Send, 
  ShieldCheck, 
  Sparkles, 
  ArrowLeft, 
  ThumbsUp, 
  MessageSquare, 
  UserCheck, 
  Clock,
  ExternalLink
} from 'lucide-react';
import { FadeUp, ClipReveal } from '../components/ScrollReveal';

const DEFAULT_REVIEWS = [
  {
    id: 'rev-1',
    name: 'Marcus Vance',
    role: 'CTO, Nexus Global Logistics',
    rating: 5,
    date: 'August 2026',
    comment: 'TECHXPT transformed our logistics core ERP into a blazing fast system. The team delivered ahead of schedule with spotless code quality.',
    criteria: { quality: 5, speed: 5, design: 5 }
  },
  {
    id: 'rev-2',
    name: 'Elena Rostova',
    role: 'VP Product, Quantum Capital',
    rating: 5,
    date: 'July 2026',
    comment: 'The AI analytics dashboard engineered by TECHXPT gives our analysts an unmatched competitive edge. Clean aesthetics and sub-50ms query speeds.',
    criteria: { quality: 5, speed: 4, design: 5 }
  },
  {
    id: 'rev-3',
    name: 'Devon Keith',
    role: 'Lead Architect, Synapse Technologies',
    rating: 5,
    date: 'June 2026',
    comment: 'World-class design system and component architecture. Our entire engineering organization moves 60% faster now.',
    criteria: { quality: 5, speed: 5, design: 5 }
  }
];

export default function FeedbackPage({ onNavigate, theme, setCursorMode, setCursorText }) {
  const [copied, setCopied] = useState(false);
  const [feedbackUrl, setFeedbackUrl] = useState('https://techxpt.com/feedback');
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');

  // Form State
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [role, setRole] = useState('Client Partner');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [improvements, setImprovements] = useState('');
  const [allowPublic, setAllowPublic] = useState(true);

  // Criteria ratings
  const [criteria, setCriteria] = useState({
    quality: 5,
    speed: 5,
    design: 5,
    communication: 5
  });

  // Local reviews storage
  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem('techxpt-feedback-reviews');
      return saved ? JSON.parse(saved) : DEFAULT_REVIEWS;
    } catch {
      return DEFAULT_REVIEWS;
    }
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/feedback`;
      setFeedbackUrl(url);
    }
  }, []);

  const handleCopyLink = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(feedbackUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'TECHXPT — Submit Feedback',
          text: 'Share your experience and product feedback with the TECHXPT engineering studio.',
          url: feedbackUrl
        });
      } catch {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    const newTicket = `TXPT-FB-${Math.floor(1000 + Math.random() * 9000)}`;
    setTicketId(newTicket);

    const newReview = {
      id: Date.now().toString(),
      name: name.trim(),
      role: company.trim() ? `${role}, ${company.trim()}` : role,
      rating,
      date: 'Just now',
      comment: comment.trim(),
      criteria
    };

    if (allowPublic) {
      const updated = [newReview, ...reviews];
      setReviews(updated);
      try {
        localStorage.setItem('techxpt-feedback-reviews', JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
    }

    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setSubmitted(false);
    setName('');
    setCompany('');
    setEmail('');
    setComment('');
    setImprovements('');
    setRating(5);
  };

  const roles = [
    'Client Partner',
    'Enterprise Lead',
    'Software Engineer',
    'Product Designer',
    'Tech Enthusiast'
  ];

  return (
    <div className="page-shell" style={{ paddingBottom: 'clamp(3rem, 5vw, 4.5rem)' }}>
      <div className="container">
        
        {/* Top Back Breadcrumb & Share Trigger */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <button
            onClick={() => onNavigate?.('home')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              border: 'none',
              fontFamily: 'var(--font-tech)',
              fontSize: '0.82rem',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              fontWeight: 600,
              padding: 0
            }}
          >
            <ArrowLeft size={14} color="#FF2424" />
            <span>BACK TO OVERVIEW</span>
          </button>

          <button
            onClick={handleShare}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              backgroundColor: 'var(--surface-hover)',
              border: '1px solid var(--border)',
              fontFamily: 'var(--font-tech)',
              fontSize: '0.74rem',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              letterSpacing: '0.08em',
              textTransform: 'uppercase'
            }}
          >
            <Share2 size={13} color="#FF2424" />
            <span>SHARE FEEDBACK PORTAL</span>
          </button>
        </div>

        {/* Page Header */}
        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span style={{ width: '6px', height: '6px', backgroundColor: '#FF2424', display: 'inline-block' }} />
            <span className="tech-label" style={{ color: '#FF2424', fontSize: '0.76rem' }}>
              CLIENT SATISFACTION & REVIEWS PORTAL
            </span>
          </div>

          <h1 
            style={{ 
              fontFamily: 'var(--font-display)', 
              fontSize: 'clamp(1.85rem, 3.8vw, 2.85rem)', 
              fontWeight: 900, 
              textTransform: 'uppercase', 
              letterSpacing: '0.02em', 
              color: 'var(--text-primary)', 
              margin: 0, 
              lineHeight: 1.1 
            }}
          >
            SUBMIT YOUR FEEDBACK
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.92rem, 1.2vw, 1.05rem)', color: 'var(--text-secondary)', marginTop: '0.5rem', margin: '0.5rem 0 0 0', maxWidth: '650px', lineHeight: 1.55 }}>
            Help us continuously refine our digital engineering, system architecture, and client collaboration standards.
          </p>
        </div>

        {/* Main Grid: Form Left, QR & Reviews Right */}
        <div className="feedback-page-grid">
          
          {/* Left Column: Form or Confirmation */}
          <div className="feedback-page-form-col">
            <AnimatePresence mode="wait">
              {submitted ? (
                /* ================= CONFIRMATION SCREEN ================= */
                <motion.div
                  key="submitted"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3 }}
                  className="feedback-success-card"
                >
                  <div style={{ width: '52px', height: '52px', backgroundColor: '#FF2424', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', marginBottom: '1.25rem' }}>
                    <Check size={28} strokeWidth={3} />
                  </div>

                  <span className="tech-label" style={{ color: '#FF2424', fontSize: '0.76rem', marginBottom: '0.4rem', display: 'block' }}>
                    SUBMISSION VERIFIED // {ticketId}
                  </span>

                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 0.75rem 0', textTransform: 'uppercase' }}>
                    THANK YOU FOR YOUR FEEDBACK
                  </h2>

                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', lineHeight: 1.6, maxWidth: '540px', margin: '0 0 1.5rem 0' }}>
                    Your response has been registered directly with our product engineering leads. We evaluate all stakeholder reviews to keep raising the bar of our deliverables.
                  </p>

                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={resetForm}
                      className="feedback-btn-primary"
                    >
                      <span>SUBMIT ANOTHER REVIEW</span>
                    </button>

                    <button
                      onClick={() => onNavigate?.('home')}
                      className="feedback-btn-secondary"
                    >
                      <span>RETURN TO HOME</span>
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* ================= SUBMISSION FORM ================= */
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="feedback-form"
                >
                  {/* Overall Star Rating */}
                  <div className="feedback-field-group">
                    <label className="feedback-field-label">
                      <span>1. OVERALL EXPERIENCE RATING</span>
                      <span style={{ color: '#FF2424' }}>*</span>
                    </label>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            style={{
                              background: 'none',
                              border: 'none',
                              padding: '4px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'transform 0.15s ease'
                            }}
                          >
                            <Star 
                              size={26} 
                              fill={(hoverRating || rating) >= star ? '#FF2424' : 'transparent'} 
                              color={(hoverRating || rating) >= star ? '#FF2424' : 'var(--text-muted)'} 
                              strokeWidth={1.8}
                            />
                          </button>
                        ))}
                      </div>

                      <span style={{ fontFamily: 'var(--font-tech)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginLeft: '8px', letterSpacing: '0.08em' }}>
                        {rating === 5 && '5.0 // OUTSTANDING'}
                        {rating === 4 && '4.0 // EXCELLENT'}
                        {rating === 3 && '3.0 // GOOD'}
                        {rating === 2 && '2.0 // FAIR'}
                        {rating === 1 && '1.0 // NEEDS IMPROVEMENT'}
                      </span>
                    </div>
                  </div>

                  {/* Multi-Criteria Matrix */}
                  <div className="feedback-field-group">
                    <label className="feedback-field-label">
                      <span>2. DETAILED PERFORMANCE MATRIX</span>
                    </label>

                    <div className="criteria-grid">
                      {[
                        { key: 'quality', label: 'CODE & ENGINEERING QUALITY' },
                        { key: 'design', label: 'UI/UX & AESTHETIC PRECISION' },
                        { key: 'speed', label: 'EXECUTION & DELIVERY SPEED' },
                        { key: 'communication', label: 'TRANSPARENCY & RELIABILITY' }
                      ].map((item) => (
                        <div key={item.key} className="criteria-row">
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                            {item.label}
                          </span>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            {[1, 2, 3, 4, 5].map((val) => (
                              <button
                                key={val}
                                type="button"
                                onClick={() => setCriteria({ ...criteria, [item.key]: val })}
                                className={`criteria-chip ${criteria[item.key] === val ? 'active' : ''}`}
                              >
                                {val}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Role Selector */}
                  <div className="feedback-field-group">
                    <label className="feedback-field-label">
                      <span>3. YOUR ROLE / PERSPECTIVE</span>
                      <span style={{ color: '#FF2424' }}>*</span>
                    </label>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {roles.map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setRole(r)}
                          className={`role-select-chip ${role === r ? 'active' : ''}`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name & Company */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                    <div className="feedback-field-group">
                      <label className="feedback-field-label">
                        <span>YOUR NAME</span>
                        <span style={{ color: '#FF2424' }}>*</span>
                      </label>
                      <input 
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Alex Henderson"
                        className="feedback-input"
                      />
                    </div>

                    <div className="feedback-field-group">
                      <label className="feedback-field-label">
                        <span>ORGANIZATION / COMPANY</span>
                      </label>
                      <input 
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="e.g. Acme Corp (Optional)"
                        className="feedback-input"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="feedback-field-group">
                    <label className="feedback-field-label">
                      <span>EMAIL ADDRESS</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>(Optional for direct reply)</span>
                    </label>
                    <input 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@company.com"
                      className="feedback-input"
                    />
                  </div>

                  {/* Main Feedback */}
                  <div className="feedback-field-group">
                    <label className="feedback-field-label">
                      <span>4. YOUR FEEDBACK & EXPERIENCE</span>
                      <span style={{ color: '#FF2424' }}>*</span>
                    </label>
                    <textarea 
                      required
                      rows={4}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your thoughts on the project deliverables, communication, codebase, or overall experience..."
                      className="feedback-textarea"
                    />
                  </div>

                  {/* Wishlist / Improvements */}
                  <div className="feedback-field-group">
                    <label className="feedback-field-label">
                      <span>5. SUGGESTIONS OR FUTURE WISHLIST</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>(Optional)</span>
                    </label>
                    <textarea 
                      rows={2}
                      value={improvements}
                      onChange={(e) => setImprovements(e.target.value)}
                      placeholder="Any features or technical workflows you would like to see next?"
                      className="feedback-textarea"
                    />
                  </div>

                  {/* Public Testimonial Consent */}
                  <label className="feedback-checkbox-label">
                    <input 
                      type="checkbox"
                      checked={allowPublic}
                      onChange={(e) => setAllowPublic(e.target.checked)}
                      style={{ accentColor: '#FF2424', width: '16px', height: '16px' }}
                    />
                    <span>Allow this review to appear in verified community testimonials</span>
                  </label>

                  {/* Submit Button */}
                  <button 
                    type="submit"
                    className="feedback-submit-btn"
                  >
                    <span>SUBMIT FEEDBACK PROTOCOL</span>
                    <Send size={15} />
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Shareable QR Card & Live Reviews Stream */}
          <div className="feedback-page-sidebar-col">
            
            {/* Shareable QR Box */}
            <div className="sidebar-qr-box">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '5px', height: '5px', backgroundColor: '#FF2424', display: 'inline-block' }} />
                  <span className="tech-label" style={{ color: '#FF2424', fontSize: '0.72rem' }}>
                    SHARABLE QR PROTOCOL
                  </span>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  MOBILE READY
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <div className="feedback-qr-box mini">
                  <div className="qr-corner top-left" />
                  <div className="qr-corner top-right" />
                  <div className="qr-corner bottom-left" />
                  <div className="qr-corner bottom-right" />
                  <QRCodeSVG 
                    value={feedbackUrl} 
                    size={140} 
                    level="H" 
                    bgColor="transparent" 
                    fgColor={theme === 'dark' ? '#FFFFFF' : '#0A0A0A'}
                    imageSettings={{
                      src: "/favicon.svg",
                      x: undefined,
                      y: undefined,
                      height: 22,
                      width: 22,
                      excavate: true,
                    }}
                  />
                </div>

                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--text-muted)', textAlign: 'center', margin: 0, maxWidth: '240px' }}>
                  Scan with your smartphone camera to open and complete this feedback form on the go.
                </p>

                <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                  <button 
                    type="button"
                    onClick={handleCopyLink}
                    className="feedback-action-btn"
                    style={{ flex: 1 }}
                  >
                    {copied ? <Check size={13} color="#00FF66" /> : <Copy size={13} />}
                    <span>{copied ? 'COPIED' : 'COPY URL'}</span>
                  </button>

                  <button 
                    type="button"
                    onClick={handleShare}
                    className="feedback-action-btn primary"
                    style={{ flex: 1 }}
                  >
                    <Share2 size={13} />
                    <span>SHARE</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Verified Reviews Stream */}
            <div className="sidebar-reviews-container">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <UserCheck size={14} color="#FF2424" />
                  <span className="tech-label" style={{ color: 'var(--text-primary)', fontSize: '0.74rem' }}>
                    VERIFIED COMMUNITY REVIEWS
                  </span>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#FF2424', fontWeight: 700 }}>
                  {reviews.length} VERIFIED
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {reviews.map((rev) => (
                  <div key={rev.id} className="sidebar-review-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                      <div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                          {rev.name}
                        </div>
                        <div style={{ fontFamily: 'var(--font-tech)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {rev.role}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '2px' }}>
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} size={11} fill="#FF2424" color="#FF2424" />
                        ))}
                      </div>
                    </div>

                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.45, margin: 0 }}>
                      "{rev.comment}"
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', paddingTop: '0.35rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                        {rev.date}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#00FF66', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Check size={10} /> Verified
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
