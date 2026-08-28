import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function IntroAnimation({ onComplete }) {
  const [stage, setStage] = useState('drawing'); // 'drawing' -> 'filling' -> 'typing' -> 'ready_to_fly' -> 'flying' -> 'finished'
  const [typedText, setTypedText] = useState('');
  const [targetRect, setTargetRect] = useState(null);
  const logoRef = useRef(null);

  const fullTagline = "PARTNER FOR YOUR FUTURE";

  const measureTarget = () => {
    const el = document.getElementById('header-logo-anchor');
    if (el) {
      const rect = el.getBoundingClientRect();
      setTargetRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
      });
    }
  };

  useEffect(() => {
    measureTarget();
    window.addEventListener('resize', measureTarget);

    // 1. Draw strokes (0 - 900ms)
    // 2. Smooth fill (900ms - 1500ms)
    const fillTimer = setTimeout(() => {
      setStage('filling');
    }, 900);

    // 3. Typewriter tagline (1500ms - 2400ms)
    const typeTimer = setTimeout(() => {
      setStage('typing');
      let idx = 0;
      const interval = setInterval(() => {
        idx++;
        setTypedText(fullTagline.slice(0, idx));
        if (idx >= fullTagline.length) {
          clearInterval(interval);
        }
      }, 30);
    }, 1500);

    // 4. Prepare for flight & measure target (2500ms)
    const readyTimer = setTimeout(() => {
      measureTarget();
      setStage('ready_to_fly');
    }, 2500);

    // 5. Start flight animation (2700ms)
    const flightTimer = setTimeout(() => {
      measureTarget();
      setStage('flying');
    }, 2700);

    // 6. Flight completes and lands precisely in header (3800ms)
    const finishTimer = setTimeout(() => {
      setStage('finished');
      if (onComplete) onComplete();
    }, 3800);

    return () => {
      window.removeEventListener('resize', measureTarget);
      clearTimeout(fillTimer);
      clearTimeout(typeTimer);
      clearTimeout(readyTimer);
      clearTimeout(flightTimer);
      clearTimeout(finishTimer);
    };
  }, [onComplete]);

  if (stage === 'finished') return null;

  const isDrawing = stage === 'drawing';
  const isFilled = stage !== 'drawing';
  const isFlying = stage === 'flying';

  // Calculate pixel-perfect flight translation & scale
  let flightX = 0;
  let flightY = 0;
  let flightScale = 0.277; // 92px / 332px

  if (targetRect && typeof window !== 'undefined') {
    const screenCenterX = window.innerWidth / 2;
    const screenCenterY = window.innerHeight / 2;

    const targetCenterX = targetRect.left + (targetRect.width / 2);
    const targetCenterY = targetRect.top + (targetRect.height / 2);

    flightX = targetCenterX - screenCenterX;
    flightY = targetCenterY - screenCenterY;
    
    // Exact scale to match header logo width
    if (targetRect.width > 0) {
      flightScale = targetRect.width / 332;
    }
  }

  return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99999,
        pointerEvents: isFlying ? 'none' : 'auto',
          overflow: 'hidden'
        }}
      >
      {/* 1. Backdrop Overlay (Fades out during flight so page reveals underneath, while logo stays 100% visible!) */}
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: isFlying ? 0 : 1 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'var(--bg)',
          zIndex: 1
          }}
        >
          <div 
            className="absolute inset-0 tech-grid-bg" 
            style={{ opacity: 0.5, pointerEvents: 'none' }} 
          />

        {/* Center Glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: isFilled ? 0.3 : 0.08, scale: isFilled ? 1.2 : 0.9 }}
            transition={{ duration: 0.8 }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            width: '400px',
            height: '400px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 36, 36, 0.15)',
              filter: 'blur(80px)',
              pointerEvents: 'none'
            }}
          />
        </motion.div>

      {/* 2. Flying Logo Element (Always 100% Solid Opacity - Never Faded!) */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
          pointerEvents: 'none'
        }}
      >
        <motion.div
          ref={logoRef}
          initial={{ x: 0, y: 0, scale: 1.0, opacity: 1 }}
          animate={
            !isFlying
              ? {
                  x: 0,
                  y: 0,
                  scale: 1.0,
                  opacity: 1,
                  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
                }
              : {
                  x: flightX,
                  y: flightY,
                  scale: flightScale,
                  opacity: 1, // KEPT 100% SOLID - NEVER FADED
                  transition: {
                    duration: 1.05,
                    ease: [0.22, 1, 0.36, 1] // Luxurious smooth glide
                  }
                }
          }
          style={{
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            transformOrigin: 'center center'
          }}
        >
          {/* Logo SVG */}
          <svg 
            version="1.0" 
            xmlns="http://www.w3.org/2000/svg"
            width="332"
            height="160"
            viewBox="0 0 332.000000 160.000000" 
            preserveAspectRatio="xMidYMid meet"
            style={{ overflow: 'visible', display: 'block' }}
          >
            <g 
              transform="translate(0.000000,160.000000) scale(0.100000,-0.100000)" 
            >
              {/* 1. T Monogram */}
              <motion.path 
                initial={{ pathLength: 0, fillOpacity: 0 }}
                animate={{ 
                  pathLength: 1, 
                  fillOpacity: isDrawing ? 0 : 1 
                }}
                transition={{
                  pathLength: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
                  fillOpacity: { duration: 0.5, ease: 'easeOut' }
                }}
                d="M627 1318 c-52 -68 -93 -124 -92 -126 2 -2 91 -3 199 -2 l196 1 0 -376 0 -375 150 0 150 0 2 373 3 372 162 2 161 2 118 -120 c65 -65 121 -119 124 -119 4 0 47 44 98 98 l91 99 -141 146 -140 147 -493 0 -494 0 -94 -122z"
                fill="#FF2424"
                stroke="#FF2424"
                strokeWidth={isDrawing ? 22 : 0}
              />

              {/* 2. Speed stripe 1 (Red) */}
              <motion.path 
                initial={{ pathLength: 0, fillOpacity: 0 }}
                animate={{ 
                  pathLength: 1, 
                  fillOpacity: isDrawing ? 0 : 1 
                }}
                transition={{
                  pathLength: { duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] },
                  fillOpacity: { duration: 0.5, ease: 'easeOut' }
                }}
                d="M2299 1153 c-234 -238 -335 -347 -483 -523 -147 -175 326 308 537 548 97 111 176 202 174 202 -2 0 -104 -102 -228 -227z"
                fill="#FF2424"
                stroke="#FF2424"
                strokeWidth={isDrawing ? 22 : 0}
              />

              {/* 3. Speed stripe 2 (Theme text color) */}
              <motion.path 
                initial={{ pathLength: 0, fillOpacity: 0 }}
                animate={{ 
                  pathLength: 1, 
                  fillOpacity: isDrawing ? 0 : 1 
                }}
                transition={{
                  pathLength: { duration: 0.8, delay: 0.18, ease: [0.16, 1, 0.3, 1] },
                  fillOpacity: { duration: 0.5, ease: 'easeOut' }
                }}
                d="M2178 1183 c-149 -151 -457 -492 -572 -634 -26 -32 102 99 339 347 157 164 433 474 422 474 -2 0 -87 -84 -189 -187z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth={isDrawing ? 22 : 0}
                style={{ color: 'var(--text-primary)' }}
              />

              {/* 4. X Right Leg */}
              <motion.path 
                initial={{ pathLength: 0, fillOpacity: 0 }}
                animate={{ 
                  pathLength: 1, 
                  fillOpacity: isDrawing ? 0 : 1 
                }}
                transition={{
                  pathLength: { duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] },
                  fillOpacity: { duration: 0.5, ease: 'easeOut' }
                }}
                d="M2225 904 c-417 -449 -441 -477 -271 -322 l139 127 131 -135 131 -135 192 3 192 3 -224 230 c-123 127 -224 235 -224 242 -1 9 168 223 257 326 8 9 13 17 11 17 -2 0 -152 -160 -334 -356z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth={isDrawing ? 22 : 0}
                style={{ color: 'var(--text-primary)' }}
              />

              {/* 5-11. TECH XPT Wordmark paths */}
              {[
                { d: "M116 338 l-26 -33 67 -5 67 -5 1 -115 0 -115 43 -3 42 -3 0 120 0 121 58 0 c54 0 58 2 80 35 l22 35 -164 0 -165 0 -25 -32z", delay: 0.22 },
                { d: "M510 215 l0 -155 143 0 144 0 27 38 26 37 -125 3 -125 3 0 24 c0 25 1 25 94 25 94 0 95 0 116 30 l21 30 -115 0 -116 0 0 25 c0 25 0 25 99 25 l99 0 26 35 27 35 -170 0 -171 0 0 -155z", delay: 0.27 },
                { d: "M975 356 c-17 -7 -44 -28 -59 -47 -26 -30 -28 -39 -24 -96 3 -49 9 -68 28 -89 43 -45 78 -57 185 -62 l101 -4 27 35 c15 20 27 38 27 41 0 3 -54 6 -120 6 -115 0 -122 1 -145 25 -32 31 -32 66 -1 102 23 27 29 28 122 32 101 3 106 5 135 54 9 16 1 17 -118 17 -84 -1 -139 -5 -158 -14z", delay: 0.32 },
                { d: "M1310 214 l0 -155 42 3 41 3 1 60 1 60 93 3 92 3 0 -66 0 -66 43 3 42 3 3 153 3 152 -46 0 -45 0 0 -55 0 -56 -92 3 -93 3 0 53 1 52 -43 0 -43 0 0 -156z", delay: 0.37 },
                { d: "M1970 295 l75 -75 -80 -80 -80 -80 51 0 c47 0 53 3 99 50 27 27 54 50 60 50 6 0 33 -22 60 -50 48 -49 50 -50 109 -50 l61 0 -83 83 -83 83 78 72 78 71 -55 1 c-52 0 -57 -2 -102 -47 l-48 -47 -48 47 c-46 45 -50 47 -107 47 l-59 0 74 -75z", delay: 0.42 },
                { d: "M2402 340 c-12 -16 -22 -32 -22 -35 0 -3 57 -5 126 -5 129 0 164 -8 164 -38 0 -37 -20 -42 -162 -42 l-138 0 0 -80 0 -80 39 0 c39 0 40 1 43 40 l3 41 105 2 c122 3 156 15 185 69 18 35 19 40 5 80 -23 65 -56 78 -206 78 l-120 0 -22 -30z", delay: 0.47 },
                { d: "M2816 338 l-26 -33 67 -5 67 -5 1 -115 0 -115 43 -3 42 -3 0 120 0 121 58 0 c54 0 58 2 80 35 l22 35 -164 0 -165 0 -25 -32z", delay: 0.52 }
              ].map((item, i) => (
                <motion.path 
                  key={i}
                  initial={{ pathLength: 0, fillOpacity: 0 }}
                  animate={{ 
                    pathLength: 1, 
                    fillOpacity: isDrawing ? 0 : 1 
                  }}
                  transition={{
                    pathLength: { duration: 0.75, delay: item.delay, ease: [0.16, 1, 0.3, 1] },
                    fillOpacity: { duration: 0.5, ease: 'easeOut' }
                  }}
                  d={item.d}
                  fill="#FF2424"
                  stroke="#FF2424"
                  strokeWidth={isDrawing ? 22 : 0}
                />
              ))}
            </g>
          </svg>

          {/* Typewriter Tagline (Fades out cleanly as logo initiates flight to header) */}
          <motion.div 
            animate={{ opacity: isFlying ? 0 : 1, height: isFlying ? 0 : 'auto' }}
            transition={{ duration: 0.25 }}
            style={{ 
              minHeight: isFlying ? '0px' : '22px', 
              marginTop: isFlying ? '0px' : '8px', 
              display: 'flex',
              alignItems: 'center',
              overflow: 'hidden'
            }}
          >
            <span 
              style={{
                fontFamily: 'var(--font-tech)',
                fontSize: '11px',
                color: 'var(--text-primary)',
                fontWeight: 400,
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap'
              }}
            >
              {typedText}
            </span>
            {typedText.length < fullTagline.length && stage !== 'drawing' && !isFlying && (
              <span style={{ color: '#FF2424', marginLeft: '3px', fontWeight: 900 }}>_</span>
            )}
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}
