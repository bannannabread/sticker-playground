/* src/components/HoloSticker/HoloSticker.tsx */
import React from 'react';
import { useMouseTilt } from '../../hooks/useMouseTilt';
import { LiquidMetal } from '@paper-design/shaders-react';
import './holo.css';

export interface HoloStickerProps {
  imageSrc?: string;
  title?: string;
  subtitle?: string;
  badgeText?: string;
  stickerType?: 'graphic' | 'label' | 'badge';
  colorTheme?: 'yellow' | 'pink' | 'blue' | 'purple' | 'cream' | 'ink';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  liquidMetal?: boolean;
}

export const HoloSticker: React.FC<HoloStickerProps> = ({
  imageSrc,
  title,
  subtitle,
  badgeText,
  stickerType = 'graphic',
  colorTheme = 'yellow',
  size = 'md',
  className = '',
  onClick,
  style: customStyle,
  liquidMetal = false,
}) => {
  const { ref, style: tiltStyle } = useMouseTilt(15);

  // Size styles
  const sizeClasses = {
    sm: 'w-36 h-36 p-3 text-xs',
    md: 'w-48 h-48 p-4 text-sm',
    lg: 'w-64 h-64 p-6 text-base',
  };

  // Theme styles for borders & inner details
  const themeClasses = {
    yellow: 'bg-brand-primary text-brand-ink-black',
    pink: 'bg-brand-hot-pink text-brand-cream',
    blue: 'bg-brand-electric-blue text-brand-cream',
    purple: 'bg-brand-holo-violet text-brand-cream',
    cream: 'bg-brand-cream text-brand-ink-black',
    ink: 'bg-brand-ink-black text-brand-cream border-2 border-brand-cream',
  };

  // Color hex codes for the liquid metal tint
  const colors = {
    yellow: '#FFE033',
    pink: '#FF2D78',
    blue: '#1B8FFF',
    purple: '#9B5FFF',
    cream: '#F5F0E8',
    ink: '#1A1A2E',
  };
  const themeColor = colors[colorTheme] || colors.yellow;

  return (
    <div
      ref={ref}
      style={{ ...tiltStyle, ...customStyle }}
      className={`holo-sticker-wrapper cursor-pointer active:scale-95 transition-transform duration-100 ${className}`}
      onClick={onClick}
    >
      <div 
        className={`holo-sticker-card ${sizeClasses[size]} ${
          liquidMetal ? 'bg-brand-ink-black text-brand-cream overflow-hidden border-2 border-white/10' : themeClasses[colorTheme]
        }`}
      >
        {liquidMetal ? (
          <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
            <LiquidMetal
              image={stickerType === 'graphic' && imageSrc ? imageSrc : undefined}
              shape={stickerType === 'graphic' && imageSrc ? "none" : "circle"}
              colorBack="#1A1A2E"
              colorTint={themeColor}
              speed={0.4}
              repetition={4}
              softness={0.2}
              distortion={0.5}
              contour={0.8}
              shiftRed={0.06}
              shiftBlue={-0.06}
              style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
            />
          </div>
        ) : (
          <>
            {/* Holographic reflection sheen */}
            <div className="holo-sticker-sheen" />
            
            {/* Metallic surface highlights */}
            <div className="holo-sticker-metallic" />
          </>
        )}

        {/* Content container raised in 3D */}
        <div 
          className={`holo-sticker-content flex flex-col items-center justify-between h-full w-full select-none text-center z-10 ${
            liquidMetal ? 'mix-blend-difference text-white' : ''
          }`}
        >
          
          {/* Badge top-bar */}
          {badgeText && (
            <div className="absolute top-0 px-2 py-0.5 bg-brand-ink-black text-brand-primary text-[10px] font-display font-black tracking-widest uppercase rounded-full border border-brand-primary transform -translate-y-1 scale-90">
              {badgeText}
            </div>
          )}

          {/* Core Graphic Sticker type */}
          {stickerType === 'graphic' && (
            <div className="flex flex-col items-center justify-center flex-grow w-full">
              {imageSrc ? (
                // Only render transparent image if NOT liquid metal (since LiquidMetal shader handles the image representation itself)
                !liquidMetal && (
                  <img
                    src={imageSrc}
                    alt={title || "Frank Monkey Sticker"}
                    className="w-[70%] h-[70%] object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] transform translateZ(10px) pointer-events-none"
                  />
                )
              ) : (
                /* Default quirky monkey doodle fallback */
                !liquidMetal && (
                  <div className="text-4xl filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)] transform translateZ(10px)">
                    🐵
                  </div>
                )
              )}
              {title && (
                <h3 className="font-display font-black tracking-tight text-center uppercase leading-none mt-3 text-lg transform translateZ(15px)">
                  {title}
                </h3>
              )}
            </div>
          )}

          {/* Text/Label Sticker type */}
          {stickerType === 'label' && (
            <div className="flex flex-col items-center justify-center h-full w-full py-2">
              <h2 className="font-display font-black tracking-tight text-2xl uppercase italic leading-none transform translateZ(15px) border-b-4 border-brand-ink-black pb-1 mb-2">
                {title || 'STICKER'}
              </h2>
              {subtitle && (
                <p className="font-sans font-medium tracking-wide uppercase text-[10px] opacity-90 transform translateZ(10px)">
                  {subtitle}
                </p>
              )}
            </div>
          )}

          {/* Simple Badge Type */}
          {stickerType === 'badge' && (
            <div className="flex items-center justify-center h-full w-full">
              <div className="border-4 border-dashed border-brand-ink-black rounded-xl p-3 w-full h-full flex items-center justify-center">
                <span className="font-display font-black tracking-wider text-xl uppercase transform translateZ(15px)">
                  {title || 'FRANK MONKEY'}
                </span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
