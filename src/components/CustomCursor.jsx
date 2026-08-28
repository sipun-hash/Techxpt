import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor({ cursorMode = 'default', cursorText = '' }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [ripples, setRipples] = useState([]);

  const canvasRef = useRef(null);
  const mousePos = useRef({ x: -100, y: -100 });
  const prevMousePos = useRef({ x: -100, y: -100 });

  // Direct GPU motion values for zero-lag pinpoint tracking
  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);

  // Organic smooth spring for the outer ghost ring and HUD badges
  const springX = useSpring(rawX, { damping: 28, stiffness: 380, mass: 0.2 });
  const springY = useSpring(rawY, { damping: 28, stiffness: 380, mass: 0.2 });

  // Micro ghost trail particles (clean stardust, no blurry smudges)
  const particles = useRef([]);

  useEffect(() => {
    // Detect touch device
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouch(true);
      return;
    }

    const handleMouseMove = (e) => {
      const { clientX: x, clientY: y } = e;
      prevMousePos.current = { ...mousePos.current };
      mousePos.current = { x, y };

      rawX.set(x);
      rawY.set(y);

      if (!isVisible) setIsVisible(true);

      // Emit subtle, crisp micro-sparks on motion
      const dx = x - prevMousePos.current.x;
      const dy = y - prevMousePos.current.y;
      const speed = Math.hypot(dx, dy);

      if (speed > 4 && particles.current.length < 24) {
        particles.current.push({
          x: x + (Math.random() - 0.5) * 4,
          y: y + (Math.random() - 0.5) * 4,
          vx: (Math.random() - 0.5) * 0.8 - dx * 0.04,
          vy: (Math.random() - 0.5) * 0.8 - dy * 0.04,
          size: Math.random() * 1.5 + 0.8,
          alpha: 0.65,
          decay: Math.random() * 0.035 + 0.025,
          color: Math.random() > 0.4 ? '#FF2424' : '#FFFFFF'
        });
        }
    };

    const handleMouseDown = (e) => {
      const newRipple = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY
      };
      setRipples((prev) => [...prev.slice(-2), newRipple]);
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      const isInteractive = target.closest('a, button, [role="button"], input, textarea, select, .interactive-hover');
      setIsHovered(!!isInteractive);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Setup Canvas animation loop for micro-particles
    let animationFrameId;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const render = () => {
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw crisp micro-particles
        for (let i = particles.current.length - 1; i >= 0; i--) {
          const p = particles.current[i];
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= p.decay;

          if (p.alpha <= 0) {
            particles.current.splice(i, 1);
            continue;
          }

          ctx.fillStyle = p.color === '#FF2424' 
            ? `rgba(255, 36, 36, ${p.alpha})`
            : `rgba(255, 255, 255, ${p.alpha * 0.75})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible, rawX, rawY]);

  const removeRipple = (id) => {
    setRipples((prev) => prev.filter((r) => r.id !== id));
  };

  if (isTouch || !isVisible) return null;

  const isTextMode = cursorMode === 'project' || cursorMode === 'service' || cursorMode === 'explore' || !!cursorText;
  const isInteractiveState = isHovered || cursorMode === 'button';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 99999,
        overflow: 'hidden'
      }}
    >
      {/* 1. Ghost Trail Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }}
      />

      {/* 2. Ghost Click Shockwaves */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            initial={{ scale: 0.2, opacity: 0.8 }}
            animate={{ scale: 2.8, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            onAnimationComplete={() => removeRipple(ripple.id)}
            style={{
              position: 'absolute',
              left: ripple.x,
              top: ripple.y,
              width: 28,
              height: 28,
              marginLeft: -14,
              marginTop: -14,
              borderRadius: '50%',
              border: '1px solid #FF2424',
              pointerEvents: 'none'
            }}
          />
        ))}
      </AnimatePresence>

      {/* 3. Precision Pointer Center Dot (Exact, Sharp, Clean Circle) */}
      {!isTextMode && (
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            x: rawX,
            y: rawY,
            translateX: '-50%',
            translateY: '-50%',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div
            style={{
              width: isInteractiveState ? '5px' : '4px',
              height: isInteractiveState ? '5px' : '4px',
              backgroundColor: '#FF2424',
              borderRadius: '50%',
              transition: 'width 0.15s, height 0.15s'
            }}
          />
        </motion.div>
      )}

      {/* 4. Elegant Minimal Ghost Ring (Follows with gentle spring lag) */}
      {!isTextMode && (
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            x: springX,
            y: springY,
            translateX: '-50%',
            translateY: '-50%',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <motion.div
            animate={{
              width: isInteractiveState ? 34 : 20,
              height: isInteractiveState ? 34 : 20,
              scale: isInteractiveState ? 1.05 : 1
            }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              borderRadius: '50%',
              border: isInteractiveState 
                ? '1px solid rgba(255, 36, 36, 0.85)' 
                : '1px solid rgba(255, 36, 36, 0.45)',
              backgroundColor: isInteractiveState 
                ? 'rgba(255, 36, 36, 0.05)' 
                : 'transparent'
            }}
          />
        </motion.div>
      )}

      {/* 5. Clean Cyber HUD Badge (For Projects, Services & Action Hover) */}
      <AnimatePresence>
        {isTextMode && (
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              x: springX,
              y: springY,
              translateX: '-50%',
              translateY: '-50%',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              backgroundColor: '#0A0A0A',
              border: '1px solid #FF2424',
              borderRadius: '2px',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35)'
            }}
          >
            {/* Pulsing indicator */}
            <span
              style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                backgroundColor: '#FF2424',
                display: 'inline-block'
              }}
            />

            {/* Label Text */}
            <span
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: '#FFFFFF',
                textTransform: 'uppercase'
              }}
            >
              {cursorText || (cursorMode === 'project' ? 'VIEW CASE ↗' : cursorMode === 'service' ? 'EXPLORE ↗' : 'DISCOVER ↗')}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
