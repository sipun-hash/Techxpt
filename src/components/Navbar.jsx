import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';
import { ArrowUpRight, Menu, X, Sun, Moon } from 'lucide-react';

export default function Navbar({ currentRoute, setCurrentRoute, onOpenContact, theme, onToggleTheme, isIntroRunning }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'HOME', route: 'home' },
    { label: 'WORK', route: 'work' },
    { label: 'SERVICES', route: 'services' },
    { label: 'ABOUT', route: 'about' },
    { label: 'INTERNSHIP', route: 'internship' },
    { label: 'FAQ', route: 'faq' },
    { label: 'FEEDBACK', route: 'feedback' }
  ];

  const handleNavClick = (route) => {
    setCurrentRoute(route);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          height: 'var(--nav-height)',
          backgroundColor: scrolled ? 'var(--nav-bg-scrolled)' : 'var(--nav-bg)',
          borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
          transition: 'background-color 0.25s ease, border-bottom 0.25s ease',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden'
        }}
      >
        <div 
          className="container" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            gap: '1rem',
            width: '100%',
            height: '100%'
          }}
        >
          
          {/* Brand Logo Anchor - Measured dynamically by IntroAnimation */}
          <div
            id="header-logo-anchor"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              flexShrink: 0
            }}
          >
            <motion.button 
              initial={{ opacity: 0 }}
              animate={{ opacity: isIntroRunning ? 0 : 1 }}
              transition={{ duration: 0.2 }}
            onClick={() => handleNavClick('home')}
            style={{ 
              cursor: 'pointer', 
              background: 'none', 
              border: 'none', 
              padding: 0, 
              display: 'flex', 
              alignItems: 'center',
                flexShrink: 0,
                opacity: isIntroRunning ? 0 : 1
            }}
          >
            <Logo size="small" showTagline={false} />
            </motion.button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden-mobile" style={{ display: 'flex', alignItems: 'stretch', height: '100%', gap: '0.25rem' }}>
            {navItems.map((item) => {
              const isActive = currentRoute === item.route;
              return (
                <button
                  key={item.route}
                  onClick={() => handleNavClick(item.route)}
                  className={`nav-link-btn ${isActive ? 'active' : ''}`}
                >
                  <span className="nav-fill-bg" />
                  <span className="nav-link-text">{item.label}</span>
                  {isActive && (
                    <motion.span 
                      layoutId="activeNavIndicator"
                      className="nav-link-indicator"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Desktop Right Actions: Theme Toggle + Let's Talk */}
          <div className="hidden-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.94 }}
              onClick={(e) => onToggleTheme(e)}
              className="theme-toggle-btn"
              aria-label="Toggle Theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={theme}
                  initial={{ rotate: -90, scale: 0.4, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: 90, scale: 0.4, opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  {theme === 'dark' ? (
                    <Sun size={14} color="#FF2424" />
                  ) : (
                    <Moon size={14} color="#FF2424" />
                  )}
                </motion.div>
              </AnimatePresence>
              <span style={{ position: 'relative', zIndex: 1 }}>
                {theme === 'dark' ? 'LIGHT' : 'DARK'}
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.94 }}
              onClick={onOpenContact}
              className="nav-action-btn"
            >
              <span>LET'S TALK</span>
              <ArrowUpRight size={16} />
            </motion.button>
          </div>

          {/* Mobile Right Controls: Always Single Horizontal Row */}
          <div 
            className="mobile-only" 
            style={{ 
              display: 'flex', 
              flexDirection: 'row',
              alignItems: 'center', 
              gap: '8px', 
              flexShrink: 0 
            }}
          >
            {/* Mobile Theme Toggle Button */}
            <motion.button
              whileHover={{ scale: 1.15, rotate: 15 }}
              whileTap={{ scale: 0.88 }}
              onClick={(e) => onToggleTheme(e)}
              className="mobile-theme-btn"
              aria-label="Toggle Theme"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={theme}
                  initial={{ rotate: -90, scale: 0.4, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: 90, scale: 0.4, opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {theme === 'dark' ? <Sun size={20} color="#FF2424" /> : <Moon size={20} color="#FF2424" />}
                </motion.div>
              </AnimatePresence>
            </motion.button>

            {/* Mobile Menu Trigger Button */}
            <motion.button
              whileHover={{ scale: 1.12, rotate: mobileMenuOpen ? -90 : 90 }}
              whileTap={{ scale: 0.88 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-menu-btn"
              aria-label="Toggle Navigation Menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={mobileMenuOpen ? 'open' : 'closed'}
                  initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {mobileMenuOpen ? <X size={22} color="#FF2424" /> : <Menu size={22} color="var(--text-primary)" />}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed',
              top: 'var(--nav-height)',
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'var(--bg)',
              zIndex: 999,
              borderTop: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '2rem 1.5rem',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {navItems.map((item, index) => (
                <motion.button
                  key={item.route}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.06 + 0.05, duration: 0.3 }}
                  onClick={() => handleNavClick(item.route)}
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.65rem',
                    fontWeight: 900,
                    color: currentRoute === item.route ? 'var(--accent)' : 'var(--text-primary)',
                    textAlign: 'left',
                    textTransform: 'uppercase',
                    borderBottom: '1px solid var(--border)',
                    paddingBottom: '0.85rem',
                    paddingTop: '0.35rem',
                    background: 'none',
                    borderTop: 'none',
                    borderLeft: 'none',
                    borderRight: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span>{item.label}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    0{index + 1}
                  </span>
                </motion.button>
              ))}
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.35 }}
              style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}
            >
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenContact();
                }}
                className="btn-tech-accent"
                style={{ width: '100%', justifyContent: 'center', display: 'flex' }}
              >
                START A PROJECT <ArrowUpRight size={16} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
