import React, { useEffect, useRef } from 'react';

export default function HeroGridBackground() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000, active: false });
  const animFrameId = useRef(null);
  const isRunning = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement.offsetHeight || window.innerHeight);

    const parent = canvas.parentElement;
    const GRID_SIZE = 64; // Architectural grid spacing
    const SPOTLIGHT_RADIUS = 120; // Focused, tight highlight radius

    let currentOpacity = 0;

    const drawGrid = () => {
      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const baseLineColor = isDark ? 'rgba(255, 255, 255, 0.015)' : 'rgba(0, 0, 0, 0.015)';
      const crosshairFadedColor = isDark ? 'rgba(255, 255, 255, 0.035)' : 'rgba(0, 0, 0, 0.035)';

      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;

      // 1. Draw Base Grid Lines
      ctx.lineWidth = 1;
      ctx.strokeStyle = baseLineColor;
      ctx.beginPath();
      for (let x = 0; x <= width; x += GRID_SIZE) {
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, height);
      }
      for (let y = 0; y <= height; y += GRID_SIZE) {
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(width, y + 0.5);
      }
      ctx.stroke();

      // 2. Draw Highlighted Laser Lines ONLY in Spotlight Area
      if (currentOpacity > 0.01 && mouseX > -200) {
        const minGridX = Math.max(0, Math.floor((mouseX - SPOTLIGHT_RADIUS) / GRID_SIZE) * GRID_SIZE);
        const maxGridX = Math.min(width, Math.ceil((mouseX + SPOTLIGHT_RADIUS) / GRID_SIZE) * GRID_SIZE);
        const minGridY = Math.max(0, Math.floor((mouseY - SPOTLIGHT_RADIUS) / GRID_SIZE) * GRID_SIZE);
        const maxGridY = Math.min(height, Math.ceil((mouseY + SPOTLIGHT_RADIUS) / GRID_SIZE) * GRID_SIZE);

        for (let x = minGridX; x <= maxGridX; x += GRID_SIZE) {
          const distToX = Math.abs(mouseX - x);
          if (distToX < SPOTLIGHT_RADIUS) {
            const span = Math.sqrt(SPOTLIGHT_RADIUS * SPOTLIGHT_RADIUS - distToX * distToX);
            const y1 = Math.max(0, mouseY - span);
            const y2 = Math.min(height, mouseY + span);

            const lineGrad = ctx.createLinearGradient(x, y1, x, y2);
            const peakAlpha = (1 - distToX / SPOTLIGHT_RADIUS) * 0.45 * currentOpacity;
            const lineColor = isDark ? `255, 60, 60` : `255, 36, 36`;

            lineGrad.addColorStop(0, `rgba(${lineColor}, 0)`);
            lineGrad.addColorStop(0.5, `rgba(${lineColor}, ${peakAlpha})`);
            lineGrad.addColorStop(1, `rgba(${lineColor}, 0)`);

            ctx.strokeStyle = lineGrad;
            ctx.beginPath();
            ctx.moveTo(x + 0.5, y1);
            ctx.lineTo(x + 0.5, y2);
            ctx.stroke();
          }
        }

        for (let y = minGridY; y <= maxGridY; y += GRID_SIZE) {
          const distToY = Math.abs(mouseY - y);
          if (distToY < SPOTLIGHT_RADIUS) {
            const span = Math.sqrt(SPOTLIGHT_RADIUS * SPOTLIGHT_RADIUS - distToY * distToY);
            const x1 = Math.max(0, mouseX - span);
            const x2 = Math.min(width, mouseX + span);

            const lineGrad = ctx.createLinearGradient(x1, y, x2, y);
            const peakAlpha = (1 - distToY / SPOTLIGHT_RADIUS) * 0.45 * currentOpacity;
            const lineColor = isDark ? `255, 60, 60` : `255, 36, 36`;

            lineGrad.addColorStop(0, `rgba(${lineColor}, 0)`);
            lineGrad.addColorStop(0.5, `rgba(${lineColor}, ${peakAlpha})`);
            lineGrad.addColorStop(1, `rgba(${lineColor}, 0)`);

            ctx.strokeStyle = lineGrad;
            ctx.beginPath();
            ctx.moveTo(x1, y + 0.5);
            ctx.lineTo(x2, y + 0.5);
            ctx.stroke();
          }
        }
      }

      // 3. Draw Crosshairs
      for (let x = 0; x <= width; x += GRID_SIZE) {
        for (let y = 0; y <= height; y += GRID_SIZE) {
          const dist = Math.hypot(mouseX - x, mouseY - y);
          const isNear = dist < SPOTLIGHT_RADIUS && currentOpacity > 0.01;

          let crossSize = 3;
          let color = crosshairFadedColor;
          let lineWidth = 0.75;

          if (isNear) {
            const proximity = 1 - dist / SPOTLIGHT_RADIUS;
            const ease = proximity * proximity;
            crossSize = 3 + ease * 2;
            lineWidth = 1;

            if (proximity > 0.4) {
              const alpha = Math.min(0.85, (0.3 + ease * 0.55) * currentOpacity);
              color = `rgba(255, 36, 36, ${alpha})`;
            } else {
              const alpha = Math.min(0.5, (0.1 + ease * 0.4) * currentOpacity);
              color = isDark ? `rgba(255, 255, 255, ${alpha})` : `rgba(10, 10, 10, ${alpha})`;
            }
          }

          ctx.strokeStyle = color;
          ctx.lineWidth = lineWidth;
          ctx.beginPath();
          ctx.moveTo(x - crossSize + 0.5, y + 0.5);
          ctx.lineTo(x + crossSize + 0.5, y + 0.5);
          ctx.moveTo(x + 0.5, y - crossSize + 0.5);
          ctx.lineTo(x + 0.5, y + crossSize + 0.5);
          ctx.stroke();
        }
      }
    };

    const render = () => {
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.15;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.15;

      const targetOpacity = mouseRef.current.active ? 1 : 0;
      currentOpacity += (targetOpacity - currentOpacity) * 0.08;

      drawGrid();

      // If inactive and opacity settled to 0, stop continuous loop to save mobile GPU/CPU
      if (!mouseRef.current.active && currentOpacity < 0.005) {
        currentOpacity = 0;
        drawGrid();
        isRunning.current = false;
        return;
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    const startLoop = () => {
      if (!isRunning.current) {
        isRunning.current = true;
        animFrameId.current = requestAnimationFrame(render);
      }
    };

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
      drawGrid();
    };

    const handleMouseMove = (e) => {
      const rect = parent.getBoundingClientRect();
      mouseRef.current.targetX = e.clientX - rect.left;
      mouseRef.current.targetY = e.clientY - rect.top;
      mouseRef.current.active = true;
      startLoop();
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('resize', handleResize, { passive: true });
    parent.addEventListener('mousemove', handleMouseMove, { passive: true });
    parent.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    // Initial static draw (zero loop until interaction)
    drawGrid();

    return () => {
      window.removeEventListener('resize', handleResize);
      parent.removeEventListener('mousemove', handleMouseMove);
      parent.removeEventListener('mouseleave', handleMouseLeave);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0
      }}
    />
  );
}
