import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Code2, 
  GraduationCap, 
  Award, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  Layers, 
  BookOpen, 
  ShieldCheck, 
  Sparkles, 
  Send,
  ChevronDown 
} from 'lucide-react';
import CTA from '../sections/CTA';

export default function InternshipPage({ onStartProject, onBack }) {
  const [selectedTrack, setSelectedTrack] = useState('react');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    track: 'React JS Development',
    duration: '3 Months'
  });

  const tracks = [
    {
      id: 'marketing',
      title: 'Software Marketing',
      tag: 'GROWTH & SALES',
      duration: '3 to 6 Months',
      mode: 'In-Office / Hybrid',
      desc: 'Learn how to position enterprise software products, generate qualified B2B leads, execute digital advertising, and analyze marketing funnels.',
      image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
      curriculum: [
        'Enterprise Product Positioning & Messaging',
        'B2B Lead Generation & LinkedIn Outreach',
        'Google Ads & Meta Advertising for SaaS',
        'Email Campaign Automation & CRM Pipelines',
        'Conversion Rate Optimization (CRO) & Funnels'
      ],
      skills: ['Lead Generation', 'Product Positioning', 'Email Campaigns', 'Social Growth', 'B2B Sales', 'Google Analytics'],
      prerequisites: 'Basic understanding of digital platforms, strong communication skills, and passion for tech business growth.'
    },
    {
      id: 'react',
      title: 'React JS Development',
      tag: 'FRONTEND ARCHITECTURE',
      duration: '3 to 6 Months',
      mode: 'In-Office / Hybrid',
      desc: 'Master modern frontend engineering using React.js, component architecture, hooks, state management, REST API integration, and responsive UI design.',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
      curriculum: [
        'Modern ES6+ JavaScript & TypeScript Fundamentals',
        'React 18+ Component Life Cycle & Custom Hooks',
        'Global State Management (Zustand / Redux Toolkit / Context)',
        'RESTful API Integration & Async Data Handling',
        'Framer Motion Animations, Tailwind CSS & Production Bundling'
      ],
      skills: ['React 18+', 'Hooks & Context', 'REST APIs', 'Tailwind/Bootstrap', 'State Management', 'Vite & Webpack'],
      prerequisites: 'Familiarity with HTML5, CSS3, and modern JavaScript syntax.'
    },
    {
      id: 'php',
      title: 'PHP & Backend Development',
      tag: 'SYSTEMS & APIS',
      duration: '3 to 6 Months',
      mode: 'In-Office / Hybrid',
      desc: 'Gain real-world hands-on experience building secure backend architectures, MySQL database systems, MVC design patterns, and RESTful APIs.',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
      curriculum: [
        'PHP 8+ Object-Oriented Programming (OOP) & Design Patterns',
        'Relational Database Modeling & MySQL Optimization',
        'Building Secure RESTful Endpoints & Token Authentication (JWT)',
        'CRUD Architecture & Role-Based Access Control (RBAC)',
        'Server Deployment, Cron Jobs & Error Logging'
      ],
      skills: ['PHP 8+', 'MySQL Database', 'CRUD Architectures', 'Authentication & Security', 'API Development', 'MVC Patterns'],
      prerequisites: 'Basic knowledge of any programming language and relational databases.'
    },
    {
      id: 'uiux',
      title: 'HTML, CSS & UI Design',
      tag: 'INTERFACE DESIGN',
      duration: '3 to 6 Months',
      mode: 'In-Office / Hybrid',
      desc: 'Focus on building pixel-perfect, responsive, accessible web layouts using modern HTML5, CSS3, Flexbox/Grid, Bootstrap, and JavaScript micro-interactions.',
      image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
      curriculum: [
        'Semantic HTML5 Architecture & Web Accessibility (WCAG)',
        'Advanced CSS3: Flexbox, CSS Grid, Custom Properties & Animations',
        'Responsive Design Frameworks (Bootstrap 5 & Custom Systems)',
        'Figma to Pixel-Perfect Code Conversion',
        'DOM Manipulation & Vanilla JavaScript Interactivity'
      ],
      skills: ['HTML5 Semantics', 'CSS3 / Sass', 'Bootstrap 5', 'UI/UX Principles', 'JavaScript Basics', 'Figma Prototyping'],
      prerequisites: 'Creative mindset, eye for design details, and eagerness to learn web technologies.'
    }
  ];

  const currentTrack = tracks.find(t => t.id === selectedTrack) || tracks[1];

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        college: formData.college,
        track: formData.track || currentTrack.title,
        duration: formData.duration
      };

      const res = await fetch('http://localhost/techxpt-api/internship.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setFormSubmitted(true);
      } else {
        setSubmitError(data.message || 'Submission failed. Please try again.');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setFormSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-shell" style={{ paddingBottom: 'clamp(2.5rem, 5vw, 4rem)' }}>
      
      {/* Header & Back Bar */}
      <div className="container mb-8">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '0.85rem', marginBottom: '1.5rem' }}>
          <button
            onClick={onBack}
            className="btn-tech-outline"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.78rem' }}
          >
            <ArrowLeft size={14} />
            <span>BACK TO HOME</span>
          </button>

          <span style={{ fontFamily: 'var(--font-tech)', fontSize: '0.74rem', color: '#FF2424', fontWeight: 700, letterSpacing: '0.1em' }}>
            CAREER & INTERNSHIP // 2026 BATCH
          </span>
        </div>

        {/* Hero Title Card */}
        <div 
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            padding: 'clamp(1.75rem, 3.5vw, 2.75rem)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', backgroundColor: '#FF2424' }} />

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 10px', backgroundColor: 'var(--surface-hover)', border: '1px solid var(--border)', marginBottom: '1rem' }}>
            <span style={{ width: '6px', height: '6px', backgroundColor: '#FF2424', display: 'inline-block' }} />
            <span className="tech-label" style={{ color: '#FF2424', fontSize: '0.74rem' }}>
              INDUSTRY INTERNSHIP PROGRAM
            </span>
          </div>

          <h1 
            style={{ 
              fontFamily: 'var(--font-display)', 
              fontSize: 'clamp(1.85rem, 3.8vw, 3rem)', 
              fontWeight: 900, 
              textTransform: 'uppercase', 
              letterSpacing: '0.02em', 
              color: 'var(--text-primary)', 
              margin: '0 0 1rem 0', 
              lineHeight: 1.12 
            }}
          >
            Production-Level IT Engineering & Growth Internship
          </h1>

          <p style={{ fontSize: 'clamp(0.98rem, 1.3vw, 1.12rem)', color: 'var(--text-secondary)', maxWidth: '820px', lineHeight: 1.6, margin: 0 }}>
            At TECHXPT, we nurture emerging tech talent with practical, production-level engineering experience. Our Internship Program is crafted for students and aspiring developers looking for live project exposure in Software Marketing, PHP & MySQL Backend, React JS Frontend, and UI/UX Web Design.
          </p>
        </div>
      </div>

      {/* Track Selection Tabs */}
      <div className="container mb-8">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
          <span className="tech-label" style={{ color: '#FF2424', fontSize: '0.74rem' }}>
            SELECT INTERNSHIP TRACK
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
          {tracks.map((tr) => {
            const isSelected = tr.id === selectedTrack;
            return (
              <button
                key={tr.id}
                onClick={() => {
                  setSelectedTrack(tr.id);
                  setFormData(prev => ({ ...prev, track: tr.title }));
                }}
                style={{
                  padding: '1rem 1.25rem',
                  textAlign: 'left',
                  backgroundColor: isSelected ? 'var(--surface-hover)' : 'var(--surface)',
                  border: isSelected ? '2px solid #FF2424' : '1px solid var(--border)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-tech)', fontSize: '0.68rem', color: isSelected ? '#FF2424' : 'var(--text-muted)', fontWeight: 700 }}>
                    {tr.tag}
                  </span>
                  <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    {tr.duration}
                  </span>
                </div>

                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-primary)' }}>
                  {tr.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Track Deep Dive & Application Form */}
      <div className="container mb-12">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
          
          {/* Left: Track Overview & Curriculum Breakdown */}
          <div 
            style={{ 
              backgroundColor: 'var(--surface)', 
              border: '1px solid var(--border)', 
              padding: 'clamp(1.5rem, 3vw, 2rem)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{ backgroundColor: '#0F254B', color: '#FFFFFF', padding: '3px 10px', fontSize: '0.72rem', fontFamily: 'var(--font-tech)', fontWeight: 700, borderRadius: '4px' }}>
                  {currentTrack.duration} • {currentTrack.mode}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: '#FF2424', fontWeight: 700 }}>
                  LIVE CLIENT EXPOSURE
                </span>
              </div>

              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-primary)', margin: '0 0 0.75rem 0' }}>
                {currentTrack.title}
              </h2>

              <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                {currentTrack.desc}
              </p>
            </div>

            {/* Curriculum Modules */}
            <div>
              <h3 style={{ fontFamily: 'var(--font-tech)', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <BookOpen size={15} color="#FF2424" />
                <span>Curriculum Modules & Live Projects</span>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {currentTrack.curriculum.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '8px 10px', backgroundColor: 'var(--surface-hover)', border: '1px solid var(--border)' }}>
                    <CheckCircle2 size={15} color="#FF2424" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.45 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills & Technologies */}
            <div>
              <h3 style={{ fontFamily: 'var(--font-tech)', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Layers size={15} color="#FF2424" />
                <span>Technologies & Skills Mastered</span>
              </h3>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                {currentTrack.skills.map((sk, sIdx) => (
                  <span 
                    key={sIdx}
                    style={{ 
                      padding: '4px 9px', 
                      fontSize: '11px', 
                      fontFamily: 'var(--font-mono)', 
                      backgroundColor: 'var(--bg)', 
                      border: '1px solid var(--border)', 
                      color: 'var(--text-primary)' 
                    }}
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Prerequisites */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
              <span style={{ fontFamily: 'var(--font-tech)', fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '3px' }}>
                Prerequisites:
              </span>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                {currentTrack.prerequisites}
              </p>
            </div>
          </div>

          {/* Right: Application Submission Form */}
          <div 
            style={{ 
              backgroundColor: 'var(--surface)', 
              border: '1px solid var(--border)', 
              padding: 'clamp(1.5rem, 3vw, 2rem)',
              position: 'relative'
            }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '0.5rem' }}>
              <Sparkles size={16} color="#FF2424" />
              <span className="tech-label" style={{ color: '#FF2424', fontSize: '0.74rem' }}>
                ENROLLMENT APPLICATION
              </span>
            </div>

            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>
              Apply for {currentTrack.title}
            </h3>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 1.25rem 0' }}>
              Fill in your details below. Our technical team will review your profile and reach out within 24 hours.
            </p>

            {formSubmitted ? (
              <div style={{ padding: '2rem 1.5rem', textAlign: 'center', backgroundColor: 'var(--surface-hover)', border: '1px solid var(--border)' }}>
                <CheckCircle2 size={42} color="#22c55e" style={{ margin: '0 auto 1rem auto' }} />
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>
                  Application Received!
                </h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                  Thank you, <strong>{formData.name}</strong>. We have registered your application for the <strong>{formData.track}</strong> track. Our coordinator will contact you at {formData.phone || formData.email}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-tech)', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Full Name *
                  </label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    style={{ width: '100%', padding: '0.75rem 0.85rem', backgroundColor: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: '0.88rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-tech)', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Email Address *
                    </label>
                    <input 
                      type="email" 
                      required 
                      placeholder="name@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      style={{ width: '100%', padding: '0.75rem 0.85rem', backgroundColor: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: '0.88rem', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-tech)', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Phone / WhatsApp *
                    </label>
                    <input 
                      type="tel" 
                      required 
                      placeholder="+91 9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      style={{ width: '100%', padding: '0.75rem 0.85rem', backgroundColor: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: '0.88rem', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-tech)', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    College / Degree / Current Status
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. B.Tech CSE / MCA / Recent Graduate"
                    value={formData.college}
                    onChange={(e) => setFormData(prev => ({ ...prev, college: e.target.value }))}
                    style={{ width: '100%', padding: '0.75rem 0.85rem', backgroundColor: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: '0.88rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
                  {/* Select Track Dropdown */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-tech)', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Selected Track *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <select 
                        value={selectedTrack}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSelectedTrack(val);
                          const matched = tracks.find(t => t.id === val);
                          if (matched) {
                            setFormData(prev => ({ ...prev, track: matched.title }));
                          }
                        }}
                        style={{
                          width: '100%',
                          padding: '0.75rem 2rem 0.75rem 0.85rem',
                          backgroundColor: 'var(--bg)',
                          border: '1px solid var(--border)',
                          color: 'var(--text-primary)',
                          fontSize: '0.84rem',
                          fontFamily: 'var(--font-body)',
                          fontWeight: 600,
                          cursor: 'pointer',
                          appearance: 'none',
                          WebkitAppearance: 'none',
                          MozAppearance: 'none',
                          borderRadius: '2px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#FF2424'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                      >
                        {tracks.map((tr) => (
                          <option 
                            key={tr.id} 
                            value={tr.id}
                            style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)', padding: '8px' }}
                          >
                            {tr.title}
                          </option>
                        ))}
                      </select>
                      <div 
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          pointerEvents: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FF2424'
                        }}
                      >
                        <ChevronDown size={15} />
                      </div>
                    </div>
                  </div>

                  {/* Duration Dropdown */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-tech)', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Duration *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <select 
                        value={formData.duration}
                        onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '0.75rem 2rem 0.75rem 0.85rem',
                          backgroundColor: 'var(--bg)',
                          border: '1px solid var(--border)',
                          color: 'var(--text-primary)',
                          fontSize: '0.84rem',
                          fontFamily: 'var(--font-body)',
                          fontWeight: 600,
                          cursor: 'pointer',
                          appearance: 'none',
                          WebkitAppearance: 'none',
                          MozAppearance: 'none',
                          borderRadius: '2px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#FF2424'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                      >
                        <option value="3 Months" style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)', padding: '8px' }}>
                          3 Months (Standard)
                        </option>
                        <option value="6 Months" style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)', padding: '8px' }}>
                          6 Months (Advanced + Live Client Projects)
                        </option>
                      </select>
                      <div 
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          pointerEvents: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FF2424'
                        }}
                      >
                        <ChevronDown size={15} />
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-tech-accent"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '0.85rem 1.4rem',
                    marginTop: '0.5rem',
                    opacity: isSubmitting ? 0.7 : 1,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  <Send size={15} style={{ opacity: isSubmitting ? 0.5 : 1 }} />
                  <span>{isSubmitting ? 'TRANSMITTING APPLICATION...' : 'SUBMIT APPLICATION & GET SYLLABUS'}</span>
                </button>
              </form>
            )}
          </div>

        </div>
      </div>

      {/* CTA Footer */}
      <CTA onStartProject={onStartProject} />
    </div>
  );
}
