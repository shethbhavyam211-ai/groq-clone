import React from 'react';
import { MicroSlats } from './MicroSlats';

/**
 * Full-page ambient Micro Slats background that sits behind all content.
 * Renders the perspective wave animation with mouse interactivity from the 21st.dev video.
 * Uses pointer-events:none so it never blocks clicks on content above.
 */
export const AnimatedBackground: React.FC<{
  color?: string;
  glintColor?: string;
  preset?: 'swell' | 'wave' | 'pulse' | 'vortex' | 'ripple';
  opacity?: number;
}> = ({
  color = '#a855f7',
  glintColor = '#ffffff',
  preset = 'swell',
  opacity = 0.12,
}) => {
  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden"
      style={{ opacity, pointerEvents: 'none' }}
    >
      <MicroSlats
        preset={preset}
        color={color}
        glintColor={glintColor}
        backgroundColor="transparent"
        slatWidth={8}
        slatHeight={22}
        gap={3}
        speed={0.6}
        intensity={0.9}
        interactive={false}
      />
    </div>
  );
};

