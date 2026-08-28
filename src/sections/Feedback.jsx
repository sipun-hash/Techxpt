import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, Copy, Check, ExternalLink, Share2, Sparkles, Star, MessageSquare, ShieldCheck } from 'lucide-react';
import { FadeUp, ClipReveal } from '../components/ScrollReveal';

export default function Feedback({ onNavigate, theme }) {
  const [copied, setCopied] = useState(false);
  const [feedbackUrl, setFeedbackUrl] = useState('https://techxpt.com/feedback');

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
          title: 'TECHXPT — Submit Client & Visitor Feedback',
          text: 'Scan or open this link to share your feedback and experience with TECHXPT.',
          url: feedbackUrl
        });
      } catch (err) {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <section 
      style={{ 
        width: '100%', 
        backgroundColor: 'var(--bg)', 
        borderBottom: '1px solid var(--border)', 
        paddingTop: 'clamp(3.5rem, 5.5vw, 4.75rem)', 
        paddingBottom: 'clamp(3.5rem, 5.5vw, 4.75rem)' 
      }}
    >
      <div className="container">
        
        {/* Section Header */}
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-end', 
            marginBottom: '2.5rem', 
            paddingBottom: '1rem', 
            borderBottom: '1px solid var(--border)', 
            flexWrap: 'wrap', 
            gap: '1rem' 
          }}
        >
          <div>
            <FadeUp>
              <span className="tech-label" style={{ display: 'block', marginBottom: '0.35rem', color: '#FF2424' }}>
                CLIENT & VISITOR EXPERIENCE
              </span>
            </FadeUp>
            <ClipReveal delay={0.08}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-primary)', margin: 0, letterSpacing: '0.02em' }}>
                FEEDBACK & REVIEWS
              </h2>
            </ClipReveal>
          </div>

          <FadeUp delay={0.15}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', maxWidth: '340px', margin: 0, letterSpacing: '0.05em' }}>
              SCAN THE SECURE QR CODE TO SUBMIT FEEDBACK DIRECTLY FROM YOUR PHONE
            </p>
          </FadeUp>
        </div>

        {/* 2-Column Interactive Hub */}
        <div className="feedback-hub-grid">
          
          {/* Left Column: Cyber QR Code Card */}
          <FadeUp delay={0.1}>
            <div className="feedback-qr-card">
              <div className="feedback-qr-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '6px', height: '6px', backgroundColor: '#FF2424', display: 'inline-block' }} />
                  <span className="tech-label" style={{ color: '#FF2424', fontSize: '0.72rem' }}>
                    LIVE QR PROTOCOL // MOBILE ACCESS
                  </span>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  SCAN & SHARE
                </span>
              </div>

              {/* Scannable QR Frame with High-Tech Corner Markers */}
              <div className="feedback-qr-box">
                <div className="qr-corner top-left" />
                <div className="qr-corner top-right" />
                <div className="qr-corner bottom-left" />
                <div className="qr-corner bottom-right" />
                
                {/* Scanning Laser Animation Line */}
                <div className="qr-scan-line" />

                <div className="qr-inner-wrapper">
                  <QRCodeSVG 
                    value={feedbackUrl} 
                    size={175} 
                    level="H" 
                    bgColor="transparent" 
                    fgColor={theme === 'dark' ? '#FFFFFF' : '#0A0A0A'}
                    imageSettings={{
                      src: "/favicon.svg",
                      x: undefined,
                      y: undefined,
                      height: 28,
                      width: 28,
                      excavate: true,
                    }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="feedback-qr-actions">
                <button 
                  onClick={handleCopyLink} 
                  className="feedback-action-btn"
                >
                  {copied ? <Check size={14} color="#00FF66" /> : <Copy size={14} />}
                  <span>{copied ? 'LINK COPIED!' : 'COPY URL'}</span>
                </button>

                <button 
                  onClick={handleShare} 
                  className="feedback-action-btn primary"
                >
                  <Share2 size={14} />
                  <span>SHARE QR</span>
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '0.85rem' }}>
                <span style={{ width: '4px', height: '4px', backgroundColor: '#00FF66', borderRadius: '50%' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  DIRECT ROUTE: /feedback
                </span>
              </div>
            </div>
          </FadeUp>

          {/* Right Column: Portal Overview & Direct Access */}
          <FadeUp delay={0.2}>
            <div className="feedback-narrative-card">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', width: 'fit-content', padding: '4px 10px', backgroundColor: 'rgba(255, 36, 36, 0.1)', border: '1px solid rgba(255, 36, 36, 0.3)' }}>
                  <Sparkles size={13} color="#FF2424" />
                  <span style={{ fontFamily: 'var(--font-tech)', fontSize: '0.74rem', color: '#FF2424', fontWeight: 700, letterSpacing: '0.1em' }}>
                    TRANSPARENT CLIENT GOVERNANCE
                  </span>
                </div>

                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.35rem, 2.5vw, 1.9rem)', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-primary)', margin: 0, letterSpacing: '0.02em', lineHeight: 1.15 }}>
                  HELP US REFINE OUR ENGINEERING EXCELLENCE
                </h3>

                <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(0.9rem, 1.15vw, 1rem)', lineHeight: 1.6, margin: 0 }}>
                  Whether you're a prospective client partner, current collaborator, or engineering peer, your direct feedback helps us evolve our execution speed, design precision, and product architecture.
                </p>
              </div>

              {/* 4 Architectural Proof Points */}
              <div className="feedback-metrics-grid">
                <div className="feedback-metric-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#FF2424' }}>
                    <Star size={14} fill="#FF2424" />
                    <span style={{ fontFamily: 'var(--font-tech)', fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-primary)' }}>4.98 / 5.0</span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    OVERALL CLIENT RATING
                  </span>
                </div>

                <div className="feedback-metric-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#FF2424' }}>
                    <ShieldCheck size={14} />
                    <span style={{ fontFamily: 'var(--font-tech)', fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-primary)' }}>100%</span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    VERIFIED SUBMISSIONS
                  </span>
                </div>
              </div>

              {/* Direct Portal CTA */}
              <div className="feedback-cta-block">
                <button
                  onClick={() => onNavigate?.('feedback')}
                  className="feedback-portal-btn"
                >
                  <span>OPEN FEEDBACK FORM</span>
                  <ExternalLink size={15} />
                </button>

                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  Avg. completion time: &lt; 90 seconds
                </span>
              </div>
            </div>
          </FadeUp>

        </div>

      </div>
    </section>
  );
}
