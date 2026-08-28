import React, { useState, useRef } from 'react';

export default function InteractiveGrid() {
  const containerRef = useRef(null);
  const [activeCell, setActiveCell] = useState(5);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    // 4x4 matrix
    const col = Math.min(3, Math.max(0, Math.floor((x / rect.width) * 4)));
    const row = Math.min(3, Math.max(0, Math.floor((y / rect.height) * 4)));
    setActiveCell(row * 4 + col);
  };

  const matrixLabels = [
    "WEB", "API", "CLOUD", "AI",
    "CORE", "DATA", "SCALE", "DEV",
    "UI", "SEC", "FLOW", "OPS",
    "R&D", "ARCH", "SYS", "SYNC"
  ];

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: '380px',
        boxSizing: 'border-box'
      }}
    >
      {/* Clean Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ width: '6px', height: '6px', backgroundColor: '#FF2424', display: 'inline-block' }}></span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 700, letterSpacing: '0.12em' }}>INTERACTIVE SYSTEM MATRIX</span>
        </div>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>4 × 4 ARCHITECTURE</span>
      </div>

      {/* 4x4 Architecture Matrix Grid */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gridTemplateRows: 'repeat(4, 1fr)', 
          gap: '1px', 
          backgroundColor: 'var(--border)', 
          border: '1px solid var(--border)',
          margin: '1.25rem 0',
          aspectRatio: '1 / 1'
        }}
      >
        {Array.from({ length: 16 }).map((_, index) => {
          const isActive = activeCell === index;
          const isAdjacent = Math.abs(activeCell - index) === 1 || Math.abs(activeCell - index) === 4;

          return (
            <div
              key={index}
              style={{
                backgroundColor: isActive 
                  ? 'var(--surface-active)' 
                  : isAdjacent 
                    ? 'var(--surface-hover)' 
                    : 'var(--matrix-cell-bg)',
                border: isActive ? '1px solid #FF2424' : '1px solid transparent',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                padding: '0.5rem'
              }}
            >
              {/* Corner mark */}
              <span style={{ position: 'absolute', top: '4px', left: '4px', fontSize: '8px', fontFamily: 'var(--font-mono)', color: 'var(--border-focus)' }}>
                +
              </span>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <span 
                  style={{ 
                    color: isActive ? '#FF2424' : 'var(--text-primary)', 
                    fontFamily: 'var(--font-mono)', 
                    fontSize: '0.75rem', 
                    fontWeight: 700,
                    letterSpacing: '0.05em'
                  }}
                >
                  {matrixLabels[index]}
                </span>
                <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', marginTop: '2px' }}>
                  {index < 9 ? `0${index + 1}` : index + 1}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Clean Footer Telemetry */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>ACTIVE MODULE:</span>
          <strong style={{ color: '#FF2424' }}>{matrixLabels[activeCell]}</strong>
        </div>
        <span style={{ color: 'var(--text-secondary)' }}>TECHXPT LABS</span>
      </div>
    </div>
  );
}
