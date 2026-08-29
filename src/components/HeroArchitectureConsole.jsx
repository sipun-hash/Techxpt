import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Cpu, ShieldCheck, Zap, Globe, Layers, ArrowUpRight, Play, CheckCircle2 } from 'lucide-react';

const CONSOLE_TABS = [
  {
    id: 'architecture',
    label: 'SYSTEM ARCH',
    icon: Layers,
    title: 'DISTRIBUTED EDGE ENGINE',
    subtitle: 'Global multi-region routing with sub-30ms dynamic edge compute.',
    metrics: [
      { label: 'EDGE LATENCY', value: '< 24ms', highlight: true },
      { label: 'AVAILABILITY', value: '99.99%', highlight: false },
      { label: 'GLOBAL POPS', value: '310+ Nodes', highlight: false }
    ],
    logs: [
      'POST /v1/edge/dispatch ➔ HTTP 200 (14ms)',
      'TLS 1.3 Handshake ➔ AES-GCM-256 Verified',
      'Worker thread active ➔ 0ms cold start'
    ]
  },
  {
    id: 'ai',
    label: 'NEURAL AI',
    icon: Cpu,
    title: 'AUTONOMOUS AGENT PIPELINE',
    subtitle: 'Enterprise LLM orchestration with context compression & vector indexing.',
    metrics: [
      { label: 'INFERENCE SPEED', value: '142 tok/s', highlight: true },
      { label: 'ACCURACY', value: '99.4%', highlight: false },
      { label: 'MODELS', value: 'GPT-4o / Claude', highlight: false }
    ],
    logs: [
      'Embedding generated ➔ cosine similarity: 0.984',
      'Neural agent executed ➔ task completed in 420ms',
      'Context token cache hit ➔ 94% cost reduction'
    ]
  },
  {
    id: 'security',
    label: 'ZERO-TRUST',
    icon: ShieldCheck,
    title: 'ENTERPRISE SECURITY SUITE',
    subtitle: 'Automated threat containment, end-to-end encryption & ISO compliance.',
    metrics: [
      { label: 'ENCRYPTION', value: 'AES-256', highlight: true },
      { label: 'WAF FIREWALL', value: 'ACTIVE', highlight: false },
      { label: 'AUDIT STATUS', value: 'ISO 27001', highlight: false }
    ],
    logs: [
      'Zero-Trust token validated ➔ JWT Ed25519',
      'DDoS rate limiter ➔ 0 malicious anomalies',
      'Penetration scan status ➔ Grade A+ Certified'
    ]
  }
];

export default function HeroArchitectureConsole({ onStartProject }) {
  const [activeTab, setActiveTab] = useState(CONSOLE_TABS[0]);
  const [activeLogIndex, setActiveLogIndex] = useState(0);

  // Cycle log highlight
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveLogIndex((prev) => (prev + 1) % 3);
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '520px',
        backgroundColor: 'var(--surface, #121212)',
        border: '1px solid var(--border, #262626)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.4)',
        position: 'relative',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}
    >
      {/* Top Red Architectural Accent Line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', backgroundColor: '#FF2424' }} />

      {/* Console Top Window Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.8rem 1.15rem',
          backgroundColor: 'var(--bg, #0A0A0A)',
          borderBottom: '1px solid var(--border, #262626)'
        }}
      >
        {/* Left: Window Dots + Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '5px' }}>
            <span style={{ width: '8px', height: '8px', backgroundColor: '#FF2424', display: 'inline-block' }} />
            <span style={{ width: '8px', height: '8px', backgroundColor: 'var(--border, #333333)', display: 'inline-block' }} />
            <span style={{ width: '8px', height: '8px', backgroundColor: 'var(--border, #333333)', display: 'inline-block' }} />
          </div>
          <span style={{
            fontSize: '0.72rem',
            fontWeight: 800,
            letterSpacing: '0.08em',
            color: 'var(--text-secondary, #A3A3A3)',
            textTransform: 'uppercase',
            marginLeft: '4px'
          }}>
            TECHXPT // CORE CONSOLE
          </span>
        </div>

        {/* Right: Live Status Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '2px 8px',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          border: '1px solid rgba(34, 197, 94, 0.3)'
        }}>
          <span style={{ width: '5px', height: '5px', backgroundColor: '#22C55E', display: 'inline-block' }} />
          <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#22C55E', letterSpacing: '0.06em' }}>
            LIVE SYSTEM 100%
          </span>
        </div>
      </div>

      {/* Segmented Architecture Tabs */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        borderBottom: '1px solid var(--border, #262626)',
        backgroundColor: 'var(--bg, #0A0A0A)'
      }}>
        {CONSOLE_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab.id === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '0.75rem 0.5rem',
                backgroundColor: isActive ? 'var(--surface, #121212)' : 'transparent',
                border: 'none',
                borderBottom: isActive ? '2px solid #FF2424' : '2px solid transparent',
                borderRight: '1px solid var(--border, #262626)',
                color: isActive ? '#FF2424' : 'var(--text-secondary, #A3A3A3)',
                fontSize: '0.72rem',
                fontWeight: 800,
                letterSpacing: '0.06em',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textTransform: 'uppercase'
              }}
            >
              <Icon size={12} color={isActive ? '#FF2424' : 'var(--text-muted)'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Content Area */}
      <div style={{ padding: '1.25rem 1.4rem' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header Title */}
            <div style={{ marginBottom: '1.15rem' }}>
              <div style={{
                fontSize: '1.15rem',
                fontWeight: 900,
                letterSpacing: '0.02em',
                color: 'var(--text-primary, #FFFFFF)',
                textTransform: 'uppercase',
                marginBottom: '4px'
              }}>
                {activeTab.title}
              </div>
              <div style={{
                fontSize: '0.82rem',
                color: 'var(--text-secondary, #A3A3A3)',
                lineHeight: 1.45
              }}>
                {activeTab.subtitle}
              </div>
            </div>

            {/* 3 Metric Cards Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px',
              marginBottom: '1.15rem'
            }}>
              {activeTab.metrics.map((m, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: 'var(--bg, #0A0A0A)',
                    border: '1px solid var(--border, #262626)',
                    padding: '0.65rem 0.75rem',
                    borderLeft: m.highlight ? '2px solid #FF2424' : '1px solid var(--border, #262626)'
                  }}
                >
                  <div style={{
                    fontSize: '0.62rem',
                    fontWeight: 800,
                    color: 'var(--text-muted, #737373)',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    marginBottom: '3px'
                  }}>
                    {m.label}
                  </div>
                  <div style={{
                    fontSize: '0.98rem',
                    fontWeight: 900,
                    color: m.highlight ? '#FF2424' : 'var(--text-primary, #FFFFFF)',
                    letterSpacing: '0.02em'
                  }}>
                    {m.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Live Terminal Log Stream */}
            <div style={{
              backgroundColor: 'var(--bg, #0A0A0A)',
              border: '1px solid var(--border, #262626)',
              padding: '0.75rem 0.95rem',
              fontFamily: 'monospace',
              fontSize: '0.72rem',
              marginBottom: '1.15rem'
            }}>
              <div style={{
                fontSize: '0.62rem',
                fontWeight: 800,
                color: 'var(--text-muted, #737373)',
                letterSpacing: '0.08em',
                marginBottom: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <Terminal size={11} color="#FF2424" />
                <span>REAL-TIME TELEMETRY FEED</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {activeTab.logs.map((log, lIdx) => (
                  <div
                    key={lIdx}
                    style={{
                      color: lIdx === activeLogIndex ? '#FF2424' : 'var(--text-secondary, #888888)',
                      transition: 'color 0.25s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    <span style={{ color: lIdx === activeLogIndex ? '#FF2424' : 'var(--text-muted)' }}>&gt;</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom CTA Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid var(--border, #262626)',
          paddingTop: '0.85rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={12} color="#22C55E" />
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              color: 'var(--text-muted, #737373)',
              letterSpacing: '0.04em'
            }}>
              READY FOR PRODUCTION
            </span>
          </div>

          <button
            onClick={onStartProject}
            style={{
              backgroundColor: '#FF2424',
              color: '#FFFFFF',
              border: 'none',
              padding: '0.45rem 0.95rem',
              fontSize: '0.74rem',
              fontWeight: 900,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#E01818')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FF2424')}
          >
            <span>START A PROJECT</span>
            <ArrowUpRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
