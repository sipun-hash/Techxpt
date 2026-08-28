import React from 'react';
import { motion } from 'framer-motion';

// Common sharp easing
const sharpEase = [0.16, 1, 0.3, 1];

/**
 * FadeUp - Smooth upward fade on scroll
 */
export function FadeUp({ children, delay = 0, duration = 0.6, className = "", style = {} }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration, delay, ease: sharpEase }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/**
 * ClipReveal - Editorial headline reveal with mask
 */
export function ClipReveal({ children, delay = 0, duration = 0.7, className = "", style = {} }) {
  return (
    <div style={{ overflow: 'hidden', display: 'block', ...style }} className={className}>
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration, delay, ease: sharpEase }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/**
 * LineReveal - Expanding horizontal 1px divider
 */
export function LineReveal({ delay = 0, color = "var(--border)", style = {} }) {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.8, delay, ease: sharpEase }}
      style={{
        width: '100%',
        height: '1px',
        backgroundColor: color,
        transformOrigin: 'left',
        ...style
      }}
    />
  );
}

/**
 * StaggerContainer - Orchestrates staggered children on scroll
 */
export function StaggerContainer({ children, staggerDelay = 0.08, delayChildren = 0.05, className = "", style = {} }) {
  const variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delayChildren
      }
    }
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/**
 * StaggerItem - Item to be used within StaggerContainer
 */
export function StaggerItem({ children, className = "", style = {} }) {
  const itemVariants = {
    hidden: { opacity: 0, y: 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        ease: sharpEase
      }
    }
  };

  return (
    <motion.div variants={itemVariants} className={className} style={style}>
      {children}
    </motion.div>
  );
}
