import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface StickerShowcase3DProps {
  imageSrc?: string;
  title?: string;
  subtitle?: string;
  badgeText?: string;
  stickerType?: 'graphic' | 'label' | 'badge';
  colorTheme?: 'yellow' | 'pink' | 'blue' | 'purple' | 'cream' | 'ink';
}

const StickerMesh: React.FC<{ texture: THREE.Texture }> = ({ texture }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  // Animate the sticker (slow rotation and react to pointer)
  useFrame((state) => {
    if (!meshRef.current) return;

    // Hover floating oscillation
    const time = state.clock.getElapsedTime();
    meshRef.current.position.y = Math.sin(time * 1.5) * 0.15;

    // Target rotation based on mouse hover position
    const targetX = (-state.pointer.y * Math.PI) / 5;
    const targetY = (state.pointer.x * Math.PI) / 5;

    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetX, 0.05);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      targetY + Math.sin(time * 0.5) * 0.1, // Add gentle auto rotation wobble
      0.05
    );

    // Light moves with pointer to create dynamic specular highlights
    if (lightRef.current) {
      lightRef.current.position.x = state.pointer.x * 5;
      lightRef.current.position.y = state.pointer.y * 5;
    }
  });

  return (
    <>
      <pointLight ref={lightRef} position={[2, 2, 4]} intensity={2.5} color="#ffffff" />
      <mesh ref={meshRef} castShadow receiveShadow>
        <planeGeometry args={[3.2, 3.2]} />
        <meshPhysicalMaterial
          map={texture}
          transparent={true}
          roughness={0.08}
          metalness={0.92}
          clearcoat={1.0}
          clearcoatRoughness={0.03}
          iridescence={1.0}
          iridescenceIOR={1.45}
          iridescenceThicknessRange={[100, 400]}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  );
};

export const StickerShowcase3D: React.FC<StickerShowcase3DProps> = ({
  imageSrc,
  title,
  subtitle,
  badgeText,
  stickerType = 'graphic',
  colorTheme = 'yellow',
}) => {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Color mapper
    const colors = {
      yellow: '#FFE033',
      pink: '#FF2D78',
      blue: '#1B8FFF',
      purple: '#9B5FFF',
      cream: '#F5F0E8',
      ink: '#1A1A2E',
    };
    const themeColor = colors[colorTheme] || colors.yellow;

    // Draw base card
    ctx.fillStyle = themeColor;
    ctx.strokeStyle = '#1A1A2E';
    ctx.lineWidth = 14;

    const r = 40;
    const x = 12;
    const y = 12;
    const w = 488;
    const h = 488;

    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // If badge, draw dashed inner border
    if (stickerType === 'badge') {
      ctx.strokeStyle = '#1A1A2E';
      ctx.lineWidth = 8;
      ctx.setLineDash([12, 12]);
      const offset = 32;
      const ir = 25;
      const ix = x + offset;
      const iy = y + offset;
      const iw = w - offset * 2;
      const ih = h - offset * 2;
      ctx.beginPath();
      ctx.moveTo(ix + ir, iy);
      ctx.lineTo(ix + iw - ir, iy);
      ctx.quadraticCurveTo(ix + iw, iy, ix + iw, iy + ir);
      ctx.lineTo(ix + iw, iy + ih - ir);
      ctx.quadraticCurveTo(ix + iw, iy + ih, ix + iw - ir, iy + ih);
      ctx.lineTo(ix + ir, iy + ih);
      ctx.quadraticCurveTo(ix, iy + ih, ix, iy + ih - ir);
      ctx.lineTo(ix, iy + ir);
      ctx.quadraticCurveTo(ix, iy, ix + ir, iy);
      ctx.closePath();
      ctx.stroke();
      ctx.setLineDash([]);
    }

    const drawTextAndCreateTexture = () => {
      ctx.fillStyle = colorTheme === 'yellow' || colorTheme === 'cream' ? '#1A1A2E' : '#F5F0E8';
      ctx.textAlign = 'center';

      if (stickerType === 'graphic') {
        if (title) {
          ctx.font = '900 32px "Outfit", sans-serif';
          ctx.fillText(title.toUpperCase(), 256, 420);
        }
      } else if (stickerType === 'label') {
        ctx.font = 'italic 900 48px "Outfit", sans-serif';
        ctx.fillText((title || 'STICKER').toUpperCase(), 256, 220);

        if (subtitle) {
          ctx.fillStyle = colorTheme === 'yellow' || colorTheme === 'cream' ? 'rgba(26,26,46,0.8)' : 'rgba(245,240,232,0.8)';
          ctx.font = 'bold 22px "Inter", sans-serif';
          ctx.fillText(subtitle.toUpperCase(), 256, 280);
        }
      } else if (stickerType === 'badge') {
        ctx.font = '900 38px "Outfit", sans-serif';
        ctx.fillText((title || 'FRANK MONKEY').toUpperCase(), 256, 266);
      }

      // Draw Badge top-bar if badgeText
      if (badgeText) {
        ctx.fillStyle = '#1A1A2E';
        ctx.beginPath();
        // Draw pill border/shape at top center
        ctx.arc(186, 32, 16, Math.PI / 2, (3 * Math.PI) / 2);
        ctx.lineTo(326, 16);
        ctx.arc(326, 32, 16, (3 * Math.PI) / 2, Math.PI / 2);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = themeColor;
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.fillStyle = themeColor;
        ctx.font = '900 13px "Outfit", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(badgeText.toUpperCase(), 256, 36);
      }

      const tex = new THREE.CanvasTexture(canvas);
      setTexture(tex);
    };

    if (stickerType === 'graphic' && imageSrc) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        ctx.drawImage(img, 128, 90, 256, 256);
        drawTextAndCreateTexture();
      };
      img.onerror = () => {
        ctx.font = '90px sans-serif';
        ctx.fillText('🐵', 256, 230);
        drawTextAndCreateTexture();
      };
      img.src = imageSrc;
    } else {
      if (stickerType === 'graphic') {
        ctx.font = '90px sans-serif';
        ctx.fillText('🐵', 256, 230);
      }
      drawTextAndCreateTexture();
    }
  }, [imageSrc, title, subtitle, badgeText, stickerType, colorTheme]);

  if (!texture) {
    return (
      <div className="w-full h-full flex items-center justify-center text-xs text-brand-cream/40 uppercase tracking-widest animate-pulse">
        Generating 3D Texture...
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-black/40 rounded-2xl border border-white/5 overflow-hidden">
      <Canvas camera={{ position: [0, 0, 4.5], fov: 50 }} shadows>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />
        <StickerMesh texture={texture} />
      </Canvas>
    </div>
  );
};
export default StickerShowcase3D;
