import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Cpu, Shield, Zap, Globe, Sparkles, Terminal, Activity, Radio } from 'lucide-react';

const TECH_NODES = [
  {
    id: 'ai',
    title: 'AI & NEURAL PIPELINES',
    metric: '10x VELOCITY',
    detail: 'Autonomous LLM Agents, Neural Workflows & Generative Tooling',
    icon: Cpu,
    top: '8%',
    left: '12%',
    delay: 0.1
  },
  {
    id: 'cloud',
    title: 'CLOUD INFRASTRUCTURE',
    metric: '99.99% UPTIME',
    detail: 'Edge-Rendered Microservices, Serverless & Sub-50ms Latency',
    icon: Globe,
    top: '8%',
    right: '10%',
    delay: 0.2
  },
  {
    id: 'cyber',
    title: 'ZERO-TRUST SECURITY',
    metric: 'AES-256 ENCRYPTED',
    detail: 'Enterprise Penetration Hardening & Automated DevSecOps',
    icon: Shield,
    bottom: '12%',
    left: '10%',
    delay: 0.3
  },
  {
    id: 'speed',
    title: 'HIGH-PERFORMANCE UI',
    metric: '60 FPS FLUID',
    detail: 'React 18 Architecture, Next-Gen Animation & WebGL Rendering',
    icon: Zap,
    bottom: '12%',
    right: '12%',
    delay: 0.4
  }
];

export default function HeroQuantumEngine({ onStartProject }) {
  const containerRef = useRef(null);
  const [activeNode, setActiveNode] = useState(TECH_NODES[0]);
  const [liveFps, setLiveFps] = useState(60);
  const [livePing, setLivePing] = useState(18);

  // Dynamic 3D Parallax Mouse Physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-12, 12]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Live Telemetry Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveFps(Math.floor(59 + Math.random() * 2));
      setLivePing(Math.floor(16 + Math.random() * 5));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        width: '100%',
        maxWidth: '560px',
        height: '460px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: '1200px',
        userSelect: 'none'
      }}
    >
      {/* 3D Holographic Perspective Container */}
      <motion.div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Background Laser Radar Grid */}
        <div style={{
          position: 'absolute',
          width: '380px',
          height: '380px',
          border: '1px solid rgba(255, 36, 36, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Laser Crosshairs */}
          <div style={{ position: 'absolute', top: 0, bottom: 0, width: '1px', backgroundColor: 'rgba(255, 36, 36, 0.2)' }} />
          <div style={{ position: 'absolute', left: 0, right: 0, height: '1px', backgroundColor: 'rgba(255, 36, 36, 0.2)' }} />
        </div>

        {/* Rotating Outer Geometric Ring 1 */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            width: '360px',
            height: '360px',
            border: '1px dashed rgba(255, 36, 36, 0.35)',
            boxSizing: 'border-box'
          }}
        />

        {/* Rotating Geometric Ring 2 (Counter Clockwise) */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            width: '270px',
            height: '270px',
            border: '1px solid var(--border)',
            borderTopColor: '#FF2424',
            borderBottomColor: '#FF2424',
            boxSizing: 'border-box'
          }}
        />

        {/* Pulsing Energy Core Circle */}
        <motion.div
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.6, 0.95, 0.6],
            boxShadow: [
              '0 0 20px rgba(255, 36, 36, 0.3)',
              '0 0 50px rgba(255, 36, 36, 0.7)',
              '0 0 20px rgba(255, 36, 36, 0.3)'
            ]
          }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            width: '130px',
            height: '130px',
            backgroundColor: 'var(--surface, #121212)',
            border: '2px solid #FF2424',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            cursor: 'pointer'
          }}
          onClick={onStartProject}
        >
          <Sparkles size={22} color="#FF2424" />
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.82rem',
            fontWeight: 900,
            color: 'var(--text-primary, #FFFFFF)',
            letterSpacing: '0.08em',
            marginTop: '4px'
          }}>
            TECH<span style={{ color: '#FF2424' }}>XPT</span>
          </span>
          <span style={{
            fontSize: '0.58rem',
            fontWeight: 800,
            color: '#FF2424',
            letterSpacing: '0.1em',
            textTransform: 'uppercase'
          }}>
            CORE ENGINE
          </span>
        </motion.div>

        {/* 4 Interactive Orbit Tech Nodes */}
        {TECH_NODES.map((node) => {
          const Icon = node.icon;
          const isSelected = activeNode.id === node.id;
          return (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: node.delay, duration: 0.5 }}
              whileHover={{ scale: 1.08 }}
              onClick={() => setActiveNode(node)}
              style={{
                position: 'absolute',
                top: node.top,
                bottom: node.bottom,
                left: node.left,
                right: node.right,
                backgroundColor: isSelected ? 'var(--surface, #121212)' : 'var(--bg, #0A0A0A)',
                border: isSelected ? '1px solid #FF2424' : '1px solid var(--border, #262626)',
                padding: '0.55rem 0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                zIndex: 20,
                boxShadow: isSelected ? '0 10px 25px rgba(255, 36, 36, 0.35)' : '0 4px 15px rgba(0, 0, 0, 0.4)',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{
                width: '24px',
                height: '24px',
                backgroundColor: isSelected ? '#FF2424' : 'rgba(255, 36, 36, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Icon size={13} color={isSelected ? '#FFFFFF' : '#FF2424'} />
              </div>

              <div>
                <div style={{
                  fontSize: '0.68rem',
                  fontWeight: 900,
                  color: isSelected ? '#FF2424' : 'var(--text-primary, #FFFFFF)',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap'
                }}>
                  {node.title}
                </div>
                <div style={{
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  color: 'var(--text-muted, #737373)',
                  letterSpacing: '0.06em'
                }}>
                  {node.metric}
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Live Active Node Spec HUD (Bottom Center) */}
        <div style={{
          position: 'absolute',
          bottom: '0px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90%',
          maxWidth: '460px',
          backgroundColor: 'var(--surface, #121212)',
          border: '1px solid var(--border, #262626)',
          borderLeft: '3px solid #FF2424',
          padding: '0.65rem 0.95rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          zIndex: 30,
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)'
        }}>
          <div style={{ minWidth: 0 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '2px'
            }}>
              <Radio size={10} color="#FF2424" />
              <span style={{
                fontSize: '0.65rem',
                fontWeight: 900,
                color: '#FF2424',
                letterSpacing: '0.08em',
                textTransform: 'uppercase'
              }}>
                ACTIVE SPECIFICATION: {activeNode.metric}
              </span>
            </div>
            <div style={{
              fontSize: '0.74rem',
              color: 'var(--text-secondary, #A3A3A3)',
              lineHeight: 1.3,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {activeNode.detail}
            </div>
          </div>

          {/* Quick Action Button */}
          <button
            onClick={onStartProject}
            style={{
              background: '#FF2424',
              color: '#FFFFFF',
              border: 'none',
              padding: '0.4rem 0.75rem',
              fontSize: '0.68rem',
              fontWeight: 900,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            INITIALIZE &rarr;
          </button>
        </div>

        {/* Real-Time Live Telemetry HUD Bar (Top Center) */}
        <div style={{
          position: 'absolute',
          top: '0px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '0.35rem 0.85rem',
          backgroundColor: 'var(--bg, #0A0A0A)',
          border: '1px solid var(--border, #262626)',
          zIndex: 30
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{
              width: '5px',
              height: '5px',
              backgroundColor: '#22C55E',
              boxShadow: '0 0 6px #22C55E'
            }} />
            <span style={{ fontSize: '0.62rem', fontWeight: 800, color: 'var(--text-muted, #737373)' }}>
              ENGINE: <span style={{ color: 'var(--text-primary, #FFFFFF)' }}>OPTIMAL</span>
            </span>
          </div>

          <div style={{ fontSize: '0.62rem', fontWeight: 800, color: 'var(--text-muted, #737373)' }}>
            FPS: <span style={{ color: '#FF2424' }}>{liveFps}</span>
          </div>

          <div style={{ fontSize: '0.62rem', fontWeight: 800, color: 'var(--text-muted, #737373)' }}>
            LATENCY: <span style={{ color: '#FF2424' }}>{livePing}ms</span>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
