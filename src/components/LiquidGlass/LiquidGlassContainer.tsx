import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { Container } from '../../lib/liquid-glass/LiquidGlass';
import type { ContainerOptions } from '../../lib/liquid-glass/LiquidGlass';
import '../../lib/liquid-glass/glass.css';

export const LiquidGlassContext = React.createContext<Container | null>(null);

interface LiquidGlassContainerProps extends ContainerOptions {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const LiquidGlassContainer: React.FC<LiquidGlassContainerProps> = ({
  children,
  borderRadius = 48,
  type = 'rounded',
  tintOpacity = 0.2,
  className = '',
  style = {},
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [container, setContainer] = useState<Container | null>(null);

  useEffect(() => {
    const instance = new Container({
      borderRadius,
      type,
      tintOpacity,
    });
    setContainer(instance);

    if (containerRef.current) {
      containerRef.current.appendChild(instance.element);
    }

    return () => {
      if (containerRef.current && instance.element && containerRef.current.contains(instance.element)) {
        containerRef.current.removeChild(instance.element);
      }
      const index = Container.instances.indexOf(instance);
      if (index > -1) {
        Container.instances.splice(index, 1);
      }
    };
  }, [borderRadius, type, tintOpacity]);

  return (
    <div ref={containerRef} className={`relative ${className}`} style={style}>
      {container && (
        <LiquidGlassContext.Provider value={container}>
          {ReactDOM.createPortal(children, container.element)}
        </LiquidGlassContext.Provider>
      )}
    </div>
  );
};
