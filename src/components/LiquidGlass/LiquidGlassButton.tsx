import React, { useEffect, useRef, useState, useContext } from 'react';
import { Button } from '../../lib/liquid-glass/LiquidGlass';
import type { ButtonOptions } from '../../lib/liquid-glass/LiquidGlass';
import { LiquidGlassContext } from './LiquidGlassContainer';
import '../../lib/liquid-glass/glass.css';

interface LiquidGlassButtonProps extends ButtonOptions {
  className?: string;
  style?: React.CSSProperties;
}

export const LiquidGlassButton: React.FC<LiquidGlassButtonProps> = ({
  text = 'Button',
  size = 32,
  type = 'rounded',
  onClick,
  warp = false,
  tintOpacity = 0.2,
  className = '',
  style = {},
}) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const parentContainer = useContext(LiquidGlassContext);
  const [, setButtonInstance] = useState<Button | null>(null);

  useEffect(() => {
    const btn = new Button({
      text,
      size,
      type,
      onClick,
      warp,
      tintOpacity,
    });
    setButtonInstance(btn);

    if (parentContainer) {
      parentContainer.addChild(btn);
    } else if (buttonRef.current) {
      buttonRef.current.appendChild(btn.element);
    }

    return () => {
      if (parentContainer) {
        parentContainer.removeChild(btn);
      } else if (buttonRef.current && btn.element && buttonRef.current.contains(btn.element)) {
        buttonRef.current.removeChild(btn.element);
      }
      const index = Button.instances.indexOf(btn);
      if (index > -1) {
        Button.instances.splice(index, 1);
      }
    };
  }, [text, size, type, onClick, warp, tintOpacity, parentContainer]);

  return <div ref={buttonRef} className={className} style={style} />;
};
export default LiquidGlassButton;
