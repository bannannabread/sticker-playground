/* src/hooks/useMouseTilt.ts */
import { useEffect, useRef, useState } from 'react';

interface MouseTiltStyle extends React.CSSProperties {
  '--mouse-x': string;
  '--mouse-y': string;
  '--tilt-x': string;
  '--tilt-y': string;
  '--mouse-active': string;
}

export const useMouseTilt = (maxTilt: number = 15) => {
  const ref = useRef<HTMLElement | null>(null);
  const [coords, setCoords] = useState({ x: 0.5, y: 0.5 });
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      
      // Calculate cursor position relative to element (0.0 to 1.0)
      const relX = (e.clientX - rect.left) / width;
      const relY = (e.clientY - rect.top) / height;

      // Clamp values between 0 and 1
      const x = Math.max(0, Math.min(1, relX));
      const y = Math.max(0, Math.min(1, relY));

      setCoords({ x, y });

      // Calculate tilt angles:
      // tiltX is rotation around X-axis (steered by Y deviation from center)
      // tiltY is rotation around Y-axis (steered by X deviation from center)
      const tiltX = (y - 0.5) * -2 * maxTilt;
      const tiltY = (x - 0.5) * 2 * maxTilt;

      setTilt({ x: tiltX, y: tiltY });
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      // Reset tilt and coordinates on leave
      setCoords({ x: 0.5, y: 0.5 });
      setTilt({ x: 0, y: 0 });
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseenter', handleMouseEnter);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [maxTilt]);

  const style: MouseTiltStyle = {
    '--mouse-x': coords.x.toFixed(3),
    '--mouse-y': coords.y.toFixed(3),
    '--tilt-x': `${tilt.x.toFixed(2)}deg`,
    '--tilt-y': `${tilt.y.toFixed(2)}deg`,
    '--mouse-active': isHovered ? '1' : '0',
  };

  // We typecast ref as any to make it flexible for various HTML elements
  return { ref: ref as any, style };
};
