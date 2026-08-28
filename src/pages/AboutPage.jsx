import React from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  Globe, 
  Code2, 
  Sparkles, 
  Headphones, 
  ShieldCheck, 
  Smartphone, 
  Zap, 
  HeartHandshake, 
  Compass, 
  Cpu 
} from 'lucide-react';
import CTA from '../sections/CTA';

export default function AboutPage({ onStartProject }) {


  const whyChooseUs = [
    {
      num: "01",
      title: "Built for Your Business",
      desc: "We first understand your business, then build a website around your goals — never one-size-fits-all.",
      icon: <Compass size={18} color="#FF2424" />
    },
    {
      num: "02",
      title: "Simple & Easy to Use",
      desc: "We create clean websites that your customers can easily understand, browse, and navigate.",
      icon: <CheckCircle2 size={18} color="#FF2424" />
    },
    {
      num: "03",
      title: "Mobile First",
      desc: "Your website looks and works properly on the devices your customers use every single day.",
      icon: <Smartphone size={18} color="#FF2424" />
    },
    {
      num: "04",
      title: "Fast & Reliable",
      desc: "We focus on ultra-fast performance, airtight security, and a completely smooth user experience.",
      icon: <Zap size={18} color="#FF2424" />
    },
    {
      num: "05",
      title: "Support When You Need It",
      desc: "From minor tweaks to major feature improvements, we're here to help even after launch.",
      icon: <HeartHandshake size={18} color="#FF2424" />
    }
  ];

  const targetIndustries = [
    "Small Business",
    "Startups",
    "Schools & Colleges",
    "Hospitals & Healthcare",
    "Diagnostic Centres",
    "Specialty Clinics",
    "Service Providers",
    "Enterprises"
  ];

  return (
    <div className="page-shell" style={{ paddingBottom: 'clamp(2.5rem, 5vw, 4rem)' }}>
      
      {/* Hero Header Card */}
      <div className="container mb-8">
        <div 
          style={{
            position: 'relative',
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            padding: 'clamp(2rem, 4vw, 3rem)',
            overflow: 'hidden'
          }}
        >
          {/* Subtle Top Red Accent Line */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', backgroundColor: '#FF2424' }} />

          <div style={{ maxWidth: '880px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 10px', backgroundColor: 'var(--surface-hover)', border: '1px solid var(--border)', marginBottom: '1.25rem' }}>
              <span style={{ width: '6px', height: '6px', backgroundColor: '#FF2424', display: 'inline-block' }} />
              <span className="tech-label" style={{ color: '#FF2424', fontSize: '0.74rem' }}>
                ABOUT US // DIGITAL ENGINEERING STUDIO
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
              We Build Websites That Help Your Business Grow
            </h1>

            <p style={{ fontSize: 'clamp(1rem, 1.4vw, 1.15rem)', color: 'var(--text-secondary)', lineHeight: 1.65, margin: '0 0 1.25rem 0' }}>
              In today's digital world, your website is often the first place customers learn about your business. We help businesses turn their ideas into professional websites that are easy to use, fast, mobile-friendly, and built to create a strong online presence.
            </p>

            <div 
              style={{ 
                padding: '1rem 1.25rem', 
                backgroundColor: 'var(--bg)', 
                borderLeft: '3px solid #FF2424', 
                borderTop: '1px solid var(--border)',
                borderRight: '1px solid var(--border)',
                borderBottom: '1px solid var(--border)',
                marginBottom: '1.5rem'
              }}
            >
              <p style={{ fontSize: '0.92rem', color: 'var(--text-primary)', margin: '0 0 0.75rem 0', fontWeight: 600, lineHeight: 1.5 }}>
                Whether you're a small business, startup, school, hospital, diagnostic centre, service provider, or established company, we build websites according to your actual needs — not just ready-made templates.
              </p>

              {/* Target Industries Tag Cloud */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                {targetIndustries.map((ind) => (
                  <span 
                    key={ind}
                    style={{
                      padding: '3px 8px',
                      fontSize: '11px',
                      fontFamily: 'var(--font-mono)',
                      backgroundColor: 'var(--surface)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    + {ind}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* Section 2: Why Choose TECHXPT? (Asymmetric Value Grid) */}
      <div className="container mb-8">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
          <div>
            <span className="tech-label" style={{ color: '#FF2424', fontSize: '0.72rem', display: 'block', marginBottom: '2px' }}>
              OUR PROMISE
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 2.5vw, 1.85rem)', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-primary)', margin: 0 }}>
              Why Choose TECHXPT?
            </h2>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', alignItems: 'stretch' }}>
          
          {/* Left Brand Guarantee Card */}
          <div 
            style={{
              backgroundColor: '#0a0a0a',
              border: '1px solid var(--border)',
              padding: 'clamp(1.75rem, 3vw, 2.5rem)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1.5rem',
              color: '#FFFFFF'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                <ShieldCheck size={20} color="#FF2424" />
                <span style={{ fontFamily: 'var(--font-tech)', fontSize: '0.72rem', letterSpacing: '0.12em', color: '#FF2424', fontWeight: 800 }}>
                  THE TECHXPT DIFFERENCE
                </span>
              </div>

              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.35rem, 2.2vw, 1.85rem)', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1.15, margin: '0 0 1rem 0' }}>
                We don't sell templates. We engineer business tools.
              </h3>

              <p style={{ fontSize: '0.9rem', color: '#A0A0A0', lineHeight: 1.6, margin: 0 }}>
                Every website we deliver is built around your specific workflow, conversion targets, and audience preferences with full technical ownership.
              </p>
            </div>

            {/* Quick Badges */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.12)', paddingTop: '1.25rem' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 900, color: '#FF2424' }}>100%</div>
                <div style={{ fontFamily: 'var(--font-tech)', fontSize: '0.68rem', color: '#888', textTransform: 'uppercase' }}>Code Ownership</div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 900, color: '#FFFFFF' }}>0%</div>
                <div style={{ fontFamily: 'var(--font-tech)', fontSize: '0.68rem', color: '#888', textTransform: 'uppercase' }}>Vendor Lock-in</div>
              </div>
            </div>
          </div>

          {/* Right 5 Pillars List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {whyChooseUs.map((val) => (
              <div 
                key={val.num}
                style={{
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                  padding: '0.85rem 1.15rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.85rem',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#FF2424';
                  e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.backgroundColor = 'var(--surface)';
                }}
              >
                <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--surface-hover)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                  {val.icon}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-primary)', margin: 0 }}>
                      {val.title}
                    </h4>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#FF2424', fontWeight: 700 }}>
                      {val.num}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.45, margin: 0 }}>
                    {val.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Section 3: Story Banner */}
      <div className="container mb-8">
        <div 
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            padding: 'clamp(1.75rem, 3.5vw, 2.5rem)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem'
          }}
        >
          <div style={{ maxWidth: '600px' }}>
            <span className="tech-label" style={{ color: '#FF2424', fontSize: '0.72rem', display: 'block', marginBottom: '0.35rem' }}>
              YOUR DIGITAL FUTURE
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.35rem, 2.5vw, 1.85rem)', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-primary)', margin: '0 0 0.5rem 0', lineHeight: 1.15 }}>
              Your Business Has a Story. Let's Put It Online.
            </h2>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              Have an idea for your website? Let's discuss it and turn your idea into something real.
            </p>
          </div>

          <button 
            onClick={onStartProject}
            className="btn-tech-accent"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.85rem 1.6rem', fontSize: '0.82rem' }}
          >
            <span>START YOUR PROJECT</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* CTA Section */}
      <CTA onStartProject={onStartProject} />
    </div>
  );
}


