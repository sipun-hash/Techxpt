import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Navigation, 
  ExternalLink, 
  RotateCw, 
  Compass,
  ArrowLeft
} from 'lucide-react';
import { OFFICE_BRANCHES } from '../data/content';
import { FadeUp, ClipReveal } from '../components/ScrollReveal';

export default function Branches() {
  // Flip state for each card: { [branchId]: boolean }
  const [flippedCards, setFlippedCards] = useState({});

  // Mobile Slider state & scroll ref
  const [activeSlide, setActiveSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const scrollContainerRef = useRef(null);

  // Check if any card is currently flipped to map view
  const isAnyCardFlipped = Object.values(flippedCards).some(Boolean);

  // Auto slide on mobile every 3.5s only when not hovered and no cards are flipped
  useEffect(() => {
    if (isHovered || isAnyCardFlipped) return;

    const timer = setInterval(() => {
      if (scrollContainerRef.current && window.innerWidth <= 768) {
        const nextIndex = (activeSlide + 1) % OFFICE_BRANCHES.length;
        const container = scrollContainerRef.current;
        const cardWidth = container.offsetWidth * 0.88;
        container.scrollTo({
          left: nextIndex * cardWidth,
          behavior: 'smooth'
        });
        setActiveSlide(nextIndex);
      }
    }, 3500);

    return () => clearInterval(timer);
  }, [isHovered, isAnyCardFlipped, activeSlide]);

  // Handle native touch swipe scroll
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const cardWidth = container.offsetWidth * 0.85;
    const newIndex = Math.round(scrollLeft / cardWidth);
    if (newIndex >= 0 && newIndex < OFFICE_BRANCHES.length && newIndex !== activeSlide) {
      setActiveSlide(newIndex);
    }
  };

  const scrollToSlide = (index) => {
    setActiveSlide(index);
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = container.offsetWidth * 0.88;
      container.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth'
      });
    }
  };

  const toggleFlip = (id, index, e) => {
    e?.stopPropagation();
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));

    if (typeof index === 'number') {
      setActiveSlide(index);
    }
  };

  return (
    <section 
      id="branches-section"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setTimeout(() => setIsHovered(false), 2000)}
      style={{ 
        width: '100%', 
        backgroundColor: 'var(--bg)', 
        borderBottom: '1px solid var(--border)', 
        paddingTop: 'clamp(2.5rem, 4vw, 3.5rem)', 
        paddingBottom: 'clamp(2.5rem, 4vw, 3.5rem)' 
      }}
    >
      <div className="container">
        
        {/* Section Header */}
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-end', 
            marginBottom: '1.5rem', 
            paddingBottom: '0.85rem', 
            borderBottom: '1px solid var(--border)', 
            flexWrap: 'wrap', 
            gap: '0.85rem' 
          }}
        >
          <div>
            <FadeUp>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '0.25rem' }}>
                <span style={{ width: '6px', height: '6px', backgroundColor: '#FF2424', display: 'inline-block' }} />
                <span className="tech-label" style={{ color: '#FF2424', fontSize: '0.74rem' }}>
                  REGIONAL HUBS & OFFICES
                </span>
              </div>
            </FadeUp>
            <ClipReveal delay={0.08}>
              <h2 
                style={{ 
                  fontFamily: 'var(--font-display)', 
                  fontSize: 'clamp(1.6rem, 3.2vw, 2.25rem)', 
                  fontWeight: 900, 
                  textTransform: 'uppercase', 
                  color: 'var(--text-primary)', 
                  margin: 0, 
                  letterSpacing: '0.02em',
                  lineHeight: 1.15
                }}
              >
                OUR OFFICE LOCATIONS
              </h2>
            </ClipReveal>
          </div>

          {/* Subtitle / Active Counter */}
          <FadeUp delay={0.15}>
            <p 
              style={{ 
                fontFamily: 'var(--font-mono)', 
                fontSize: '0.74rem', 
                color: 'var(--text-muted)', 
                textTransform: 'uppercase', 
                margin: 0, 
                letterSpacing: '0.04em' 
              }}
            >
              <span className="hidden-mobile">PHYSICAL PRESENCE & TECHNICAL HUBS ACROSS INDIA</span>
              <span className="visible-mobile" style={{ color: '#FF2424', fontWeight: 700 }}>
                SWIPE TO EXPLORE // 0{activeSlide + 1} OF 0{OFFICE_BRANCHES.length}
              </span>
            </p>
          </FadeUp>
        </div>

        {/* 3D Flip Cards Grid / Mobile Swipeable Carousel */}
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="branches-deck-container"
        >
          {OFFICE_BRANCHES.map((branch, index) => {
            const isFlipped = !!flippedCards[branch.id];

            return (
              <div 
                key={branch.id} 
                className="branch-card-3d-wrapper"
              >
                <div className={`branch-card-3d-inner ${isFlipped ? 'is-flipped' : ''}`}>
                  
                  {/* ================= CARD FRONT (DETAILS) ================= */}
                  <div className="branch-card-face branch-card-front">
                    {/* Top Image Banner - Clean without top tag */}
                    <div className="branch-banner-wrapper">
                      <img 
                        src={branch.image} 
                        alt={`${branch.city} Office`}
                        className="branch-banner-img"
                      />
                      <div className="branch-banner-gradient" />
                      
                      {/* HQ Badge only if HQ */}
                      {branch.isHQ && (
                        <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 2 }}>
                          <span className="branch-banner-badge">HQ</span>
                        </div>
                      )}

                      {/* City Name Anchored on Banner */}
                      <div className="branch-banner-title-box">
                        <h3 className="branch-banner-city">
                          {branch.city}
                        </h3>
                      </div>
                    </div>

                    {/* Card Body - Tight with No Extra Space */}
                    <div className="branch-card-body">
                      {/* Single Row for Phone & Email */}
                      <div className="branch-contacts-single-row">
                        <a 
                          href={`tel:${branch.phone.replace(/[^+\d]/g, '')}`}
                          className="branch-contact-pill-half"
                        >
                          <div className="branch-pill-icon">
                            <Phone size={11} />
                          </div>
                          <span className="branch-pill-text">{branch.phone}</span>
                        </a>

                        <a 
                          href={`mailto:${branch.email}`}
                          className="branch-contact-pill-half"
                        >
                          <div className="branch-pill-icon">
                            <Mail size={11} />
                          </div>
                          <span className="branch-pill-text">{branch.email}</span>
                        </a>
                      </div>

                      {/* Address Row */}
                      <div className="branch-address-block">
                        <MapPin size={12} color="#FF2424" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span className="branch-address-text">
                          {branch.address}
                        </span>
                      </div>

                      {/* View Map Button directly under address */}
                      <button 
                        onClick={(e) => toggleFlip(branch.id, index, e)}
                        className="branch-flip-trigger-btn"
                      >
                        <Compass size={13} color="#FF2424" />
                        <span>VIEW MAP</span>
                        <RotateCw size={12} style={{ marginLeft: 'auto' }} />
                      </button>
                    </div>
                  </div>

                  {/* ================= CARD BACK (INTERACTIVE MAP) ================= */}
                  <div className="branch-card-face branch-card-back">
                    {/* Back Header */}
                    <div className="branch-back-header">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '6px', height: '6px', backgroundColor: '#FF2424', display: 'inline-block' }} />
                        <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.88rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0, textTransform: 'uppercase' }}>
                          {branch.city} // MAP
                        </h4>
                      </div>

                      {/* Flip Back Button */}
                      <button 
                        onClick={(e) => toggleFlip(branch.id, index, e)}
                        className="branch-back-close-btn"
                        title="Back to details"
                      >
                        <ArrowLeft size={12} />
                        <span>BACK</span>
                      </button>
                    </div>

                    {/* Google Map Embed Frame */}
                    <div className="branch-map-embed-container">
                      <iframe
                        title={`${branch.city} Map`}
                        src={branch.mapUrl}
                        className="branch-map-iframe"
                        loading="lazy"
                        allowFullScreen=""
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>

                    {/* Back Footer Map View Controls */}
                    <div className="branch-back-footer">
                      <a 
                        href={branch.directionsUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="branch-map-ctrl-btn primary"
                      >
                        <Navigation size={12} />
                        <span>DIRECTIONS</span>
                      </a>

                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.address)}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="branch-map-ctrl-btn"
                      >
                        <span>FULL MAP</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Pagination Indicator Dots (Interactive) */}
        <div className="branches-mobile-dots">
          {OFFICE_BRANCHES.map((_, i) => (
            <span 
              key={i}
              onClick={() => scrollToSlide(i)}
              className={`branch-mobile-dot ${activeSlide === i ? 'active' : ''}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

