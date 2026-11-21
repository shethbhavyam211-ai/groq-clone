import React, { useEffect, useRef } from 'react';

export interface MicroSlatsProps {
  preset?: 'swell' | 'wave' | 'pulse' | 'vortex' | 'ripple';
  color?: string;
  glintColor?: string;
  backgroundColor?: string;
  slatWidth?: number;
  slatHeight?: number;
  gap?: number;
  interactive?: boolean;
  className?: string;
  speed?: number;
  intensity?: number;
}

export const MicroSlats: React.FC<MicroSlatsProps> = ({
  preset = 'swell',
  color = '#a855f7',
  glintColor = '#ffffff',
  backgroundColor = '#120f17',
  slatWidth = 10,
  slatHeight = 25,
  gap = 4,
  interactive = true,
  className = '',
  speed = 1.0,
  intensity = 1.0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean; radius: number }>({
    x: -1000,
    y: -1000,
    active: false,
    radius: 120,
  });

  // Helper to parse hex color to rgb
  const parseHex = (hex: string) => {
    let cleanHex = hex.replace('#', '');
    if (cleanHex.length === 3) {
      cleanHex = cleanHex.split('').map(c => c + c).join('');
    }
    const num = parseInt(cleanHex, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255,
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const baseRGB = parseHex(color);
    const glintRGB = parseHex(glintColor);

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      if (width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // Clear or draw background
      if (backgroundColor && backgroundColor !== 'transparent') {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);
      } else {
        ctx.clearRect(0, 0, width, height);
      }

      time += 0.025 * speed;

      const cellW = slatWidth + gap;
      const cellH = slatHeight + gap;
      const cols = Math.ceil(width / cellW) + 2;
      const rows = Math.ceil(height / cellH) + 2;

      const startX = (width - cols * cellW) / 2;
      const startY = (height - rows * cellH) / 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = startX + c * cellW;
          const y = startY + r * cellH;

          // Compute wave elevation based on preset
          let elevation = 0;
          const normX = c / cols;
          const normY = r / rows;

          if (preset === 'swell') {
            // Rolling ocean sea swell in diagonal perspective
            const wave1 = Math.sin(normX * 5.0 + normY * 3.5 - time * 1.8);
            const wave2 = Math.cos(normX * 3.0 - normY * 4.0 + time * 1.2);
            const wave3 = Math.sin(Math.sqrt((normX - 0.5) ** 2 + (normY - 0.5) ** 2) * 8.0 - time * 2.0);
            elevation = (wave1 * 0.45 + wave2 * 0.35 + wave3 * 0.2) * intensity;
          } else if (preset === 'wave') {
            // Horizontal rolling tide
            elevation = Math.sin(normX * 6.0 - time * 2.2 + Math.cos(normY * 4.0)) * intensity;
          } else if (preset === 'pulse') {
            // Radial pulsing waves from center
            const dist = Math.sqrt((normX - 0.5) ** 2 + (normY - 0.5) ** 2) * 12;
            elevation = Math.sin(dist - time * 3.0) * intensity;
          } else if (preset === 'vortex') {
            // Swirling spiral
            const angle = Math.atan2(normY - 0.5, normX - 0.5);
            const dist = Math.sqrt((normX - 0.5) ** 2 + (normY - 0.5) ** 2);
            elevation = Math.sin(angle * 3.0 + dist * 10.0 - time * 2.5) * intensity;
          } else {
            // Default gentle ripple
            elevation = (Math.sin(normX * 4 - time) * 0.5 + Math.cos(normY * 4 + time * 0.8) * 0.5) * intensity;
          }

          // Mouse interaction influence
          if (interactive && mouseRef.current.active) {
            const slatCenterX = x + slatWidth / 2;
            const slatCenterY = y + slatHeight / 2;
            const dx = slatCenterX - mouseRef.current.x;
            const dy = slatCenterY - mouseRef.current.y;
            const mouseDist = Math.sqrt(dx * dx + dy * dy);

            if (mouseDist < mouseRef.current.radius) {
              const factor = 1 - mouseDist / mouseRef.current.radius;
              elevation += factor * 1.8;
            }
          }

          // Normalize elevation to [0, 1] range for color & brightness
          // Elevation typical range -1 to 1, or higher with mouse
          const normalized = Math.max(0, Math.min(1.5, (elevation + 0.9) / 1.8));

          // Base alpha / brightness
          const alpha = 0.15 + Math.min(1.0, normalized * 0.75);

          // Glint crest calculation: peak crests shine towards pure glintColor
          const isGlint = normalized > 0.72;
          let rVal = baseRGB.r;
          let gVal = baseRGB.g;
          let bVal = baseRGB.b;

          if (isGlint) {
            const glintAmount = Math.min(1, (normalized - 0.72) / 0.55);
            rVal = Math.round(baseRGB.r + (glintRGB.r - baseRGB.r) * glintAmount);
            gVal = Math.round(baseRGB.g + (glintRGB.g - baseRGB.g) * glintAmount);
            bVal = Math.round(baseRGB.b + (glintRGB.b - baseRGB.b) * glintAmount);
          }

          // Slat perspective height / scale effect
          const scaleY = Math.max(0.65, Math.min(1.4, 0.8 + normalized * 0.45));
          const actualH = slatHeight * scaleY;
          const offsetY = (slatHeight - actualH) / 2;

          ctx.fillStyle = `rgba(${rVal}, ${gVal}, ${bVal}, ${Math.min(1, alpha)})`;

          // Draw rounded rectangle slat
          const radius = Math.min(slatWidth / 2, 4);
          const drawY = y + offsetY;

          ctx.beginPath();
          ctx.roundRect(x, drawY, slatWidth, actualH, radius);
          ctx.fill();

          // If glint crest, add subtle glow/bloom on top
          if (isGlint && normalized > 0.95) {
            ctx.shadowColor = `rgba(${glintRGB.r}, ${glintRGB.g}, ${glintRGB.b}, 0.6)`;
            ctx.shadowBlur = 8;
            ctx.fillStyle = `rgba(${glintRGB.r}, ${glintRGB.g}, ${glintRGB.b}, 0.4)`;
            ctx.fill();
            ctx.shadowBlur = 0; // reset
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [preset, color, glintColor, backgroundColor, slatWidth, slatHeight, gap, interactive, speed, intensity]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!interactive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
      radius: 140,
    };
  };

  const handleMouseLeave = () => {
    mouseRef.current.active = false;
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`w-full h-full block cursor-crosshair ${className}`}
    />
  );
};

