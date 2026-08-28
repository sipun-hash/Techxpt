import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowUpRight } from 'lucide-react';

export default function ProjectModal({ project, onClose, onStartProject }) {
  if (!project) return null;

  return (
    <AnimatePresence>
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'none',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '1.5rem',
          overflowY: 'auto'
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.25 }}
          style={{
            backgroundColor: 'var(--bg)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            width: '100%',
            maxWidth: '900px',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative',
            padding: '2.5rem'
          }}
        >
          {/* Top Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#FF2424', fontWeight: 700, letterSpacing: '0.1em' }}>{project.number} // CASE STUDY</span>
              <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase' }}>{project.category}</span>
            </div>
            <button
              onClick={onClose}
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', cursor: 'pointer', color: 'var(--text-primary)', padding: '6px' }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Project Title */}
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1, marginBottom: '1rem', color: 'var(--text-primary)' }}>
            {project.title}
          </h2>

          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            {project.summary}
          </p>

          {/* Hero Project Image */}
          <div style={{ border: '1px solid var(--border)', marginBottom: '2rem', overflow: 'hidden' }}>
            <img 
              src={project.image} 
              alt={project.title} 
              style={{ width: '100%', height: '360px', objectFit: 'cover', display: 'block' }}
            />
          </div>

          {/* Metrics Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '1.5rem 0', marginBottom: '2rem' }}>
            {project.metrics?.map((m, idx) => (
              <div key={idx}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 900, color: '#FF2424' }}>
                  {m.value}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: '4px', letterSpacing: '0.1em' }}>
                  {m.label}
                </div>
              </div>
            ))}
          </div>

          {/* Architecture Breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
            <div>
              <h4 className="tech-label" style={{ color: '#FF2424', marginBottom: '0.5rem' }}>THE CHALLENGE</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.65 }}>{project.challenge}</p>
            </div>
            <div>
              <h4 className="tech-label" style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>THE ARCHITECTURE & SOLUTION</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.65 }}>{project.solution}</p>
            </div>
          </div>

          {/* Tech Stack Chips */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 className="tech-label" style={{ marginBottom: '0.75rem' }}>ENGINEERING STACK</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {project.techStack?.map((tech) => (
                <span 
                  key={tech}
                  style={{
                    padding: '4px 10px',
                    backgroundColor: 'var(--surface)',
                    border: '1px solid var(--border)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)',
                    textTransform: 'uppercase'
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Action CTA */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              CLIENT: <strong style={{ color: 'var(--text-primary)' }}>{project.client}</strong> // {project.year}
            </div>
            <button
              onClick={() => {
                onClose();
                onStartProject();
              }}
              className="btn-tech-accent"
              style={{ padding: '0.75rem 1.5rem', fontSize: '0.85rem' }}
            >
              BUILD A SIMILAR PLATFORM <ArrowUpRight size={16} />
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
