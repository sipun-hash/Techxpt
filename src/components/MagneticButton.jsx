import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function MagneticButton({ 
  children, 
  onClick, 
  variant = "primary", 
  className = "", 
  strength = 18,
  ...props 
}) {
  const ref = useRef(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 200, mass: 0.1 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    
    // Slight magnetic attraction pull
    x.set(distanceX / 6);
    y.set(distanceY / 6);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const getVariantClass = () => {
    switch (variant) {
      case 'accent':
        return 'btn-tech-accent';
      case 'outline':
        return 'btn-tech-outline';
      case 'primary':
      default:
        return 'btn-tech-primary';
    }
  };

  return (
    <motion.button
      ref={ref}
      style={{ x: smoothX, y: smoothY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`${getVariantClass()} ${className}`}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
