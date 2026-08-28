import React from 'react';
import Logo from './Logo';
import { ArrowUpRight } from 'lucide-react';
import { BRAND } from '../data/content';

export default function Footer({ onNavigate, onOpenContact }) {
  return (
    <footer style={{ width: '100%', backgroundColor: 'var(--bg)', borderTop: '1px solid var(--border)', color: 'var(--text-primary)', paddingTop: '4rem', paddingBottom: '3rem' }}>
      <div className="container">
        
        {/* Top Tier: Logo & Navigation */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2.5rem', paddingBottom: '3.5rem', borderBottom: '1px solid var(--border)' }}>
          
          {/* Brand Col */}
          <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <Logo size="default" showTagline={true} />
            <p style={{ color: 'var(--text-secondary)', maxWidth: '380px', fontSize: '0.85rem', lineHeight: 1.6, fontFamily: 'var(--font-body)', margin: 0 }}>
              Engineering resilient digital systems, custom software, and modern web experiences for ambitious enterprises.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              <span style={{ width: '6px', height: '6px', backgroundColor: '#FF2424', display: 'inline-block' }}></span>
              <span>{BRAND.location}</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <span className="tech-label" style={{ color: '#FF2424', display: 'block' }}>NAVIGATION</span>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', textTransform: 'uppercase' }}>
              {['WORK', 'SERVICES', 'ABOUT', 'INTERNSHIP', 'FAQ', 'FEEDBACK'].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => {
                      onNavigate(item.toLowerCase());
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    style={{ color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, transition: 'color 0.2s ease' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#FF2424'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <span className="tech-label" style={{ color: '#FF2424', display: 'block' }}>CONNECT</span>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', textTransform: 'uppercase' }}>
              {[
                { name: 'EMAIL', href: `mailto:${BRAND.email}` },
                { name: 'LINKEDIN', href: 'https://linkedin.com' },
                { name: 'GITHUB', href: 'https://github.com' },
                { name: 'INSTAGRAM', href: 'https://instagram.com' }
              ].map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', transition: 'color 0.2s ease' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#FF2424'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                  >
                    <span>{link.name}</span>
                    <ArrowUpRight size={14} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Tier: Copyright & Legal */}
        <div style={{ paddingTop: '1.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', gap: '1rem' }}>
          <div>
            © {BRAND.year} {BRAND.name}. ALL RIGHTS RESERVED.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span style={{ cursor: 'pointer' }}>PRIVACY POLICY</span>
            <span style={{ cursor: 'pointer' }}>TERMS OF SERVICE</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
