/* src/pages/Customizer.tsx */
import React, { useState, useEffect, useRef } from 'react';
import { HoloSticker } from '../components/HoloSticker/HoloSticker';
import { 
  Plus, 
  Trash2, 
  Layers, 
  RotateCw, 
  Download, 
  Grid, 
  Upload, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface ActiveSticker {
  id: string;
  imageSrc?: string;
  title?: string;
  subtitle?: string;
  badgeText?: string;
  stickerType: 'graphic' | 'label' | 'badge';
  colorTheme: 'yellow' | 'pink' | 'blue' | 'purple' | 'cream' | 'ink';
  size: 'sm' | 'md' | 'lg';
  x: number; // relative to canvas width
  y: number; // relative to canvas height
  rotation: number; // degrees
  scale: number; // multiplier
  zIndex: number;
}

// Preset library stickers
const PRESET_STICKERS = [
  {
    id: 'preset-monkey',
    imageSrc: '/assets/frank_monkey.png',
    title: 'Frank Monkey',
    badgeText: 'ORIGINAL',
    stickerType: 'graphic' as const,
    colorTheme: 'yellow' as const,
    size: 'md' as const,
  },
  {
    id: 'preset-cassette',
    imageSrc: '/assets/cassette.png',
    title: 'Mix Tape',
    badgeText: 'VAPORWAVE',
    stickerType: 'graphic' as const,
    colorTheme: 'pink' as const,
    size: 'md' as const,
  },
  {
    id: 'preset-rocket',
    imageSrc: '/assets/rocket.png',
    title: 'Blast Off',
    badgeText: 'PORTFOLIO',
    stickerType: 'graphic' as const,
    colorTheme: 'blue' as const,
    size: 'md' as const,
  },
  {
    id: 'preset-coffee',
    imageSrc: '/assets/coffee.png',
    title: 'Code Juice',
    badgeText: 'DEV ONLY',
    stickerType: 'graphic' as const,
    colorTheme: 'purple' as const,
    size: 'md' as const,
  },
];

export const Customizer: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [stickers, setStickers] = useState<ActiveSticker[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Custom Sticker Creator Form State
  const [newTitle, setNewTitle] = useState('FRANK DESIGN');
  const [newSubtitle, setNewSubtitle] = useState('SYSTEM V4');
  const [newBadgeText, setNewBadgeText] = useState('NEW');
  const [newStickerType, setNewStickerType] = useState<'graphic' | 'label' | 'badge'>('label');
  const [newColorTheme, setNewColorTheme] = useState<'yellow' | 'pink' | 'blue' | 'purple' | 'cream' | 'ink'>('yellow');
  const [newSize, setNewSize] = useState<'sm' | 'md' | 'lg'>('md');

  // Board settings
  const [boardTheme, setBoardTheme] = useState<'mesh' | 'ink' | 'cream' | 'grid'>('mesh');
  const [showGridLines, setShowGridLines] = useState(true);

  // Load from localstorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('frank-monkey-stickers');
    if (saved) {
      try {
        setStickers(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved stickers', e);
      }
    } else {
      // Add default stickers
      setStickers([
        {
          id: 'default-1',
          imageSrc: '/assets/frank_monkey.png',
          title: 'Frank Monkey',
          badgeText: 'ORIGINAL',
          stickerType: 'graphic',
          colorTheme: 'yellow',
          size: 'lg',
          x: 100,
          y: 80,
          rotation: -10,
          scale: 1,
          zIndex: 1,
        },
        {
          id: 'default-2',
          imageSrc: '/assets/cassette.png',
          title: 'Mix Tape',
          badgeText: 'VAPORWAVE',
          stickerType: 'graphic',
          colorTheme: 'pink',
          size: 'md',
          x: 420,
          y: 50,
          rotation: 12,
          scale: 1,
          zIndex: 2,
        },
        {
          id: 'default-3',
          stickerType: 'label',
          title: 'Tailwind v4',
          subtitle: 'Pure CSS Power',
          colorTheme: 'blue',
          size: 'md',
          x: 200,
          y: 300,
          rotation: 5,
          scale: 1.1,
          zIndex: 3,
        }
      ]);
    }
  }, []);

  // Save to localstorage when stickers change
  const saveToLocalStorage = (newStickers: ActiveSticker[]) => {
    localStorage.setItem('frank-monkey-stickers', JSON.stringify(newStickers));
  };

  const updateStickersAndSave = (updated: ActiveSticker[]) => {
    setStickers(updated);
    saveToLocalStorage(updated);
  };

  // Add sticker to canvas
  const addPresetSticker = (preset: typeof PRESET_STICKERS[0]) => {
    const canvas = canvasRef.current;
    const initialX = canvas ? canvas.clientWidth / 2 - 100 + Math.random() * 40 : 150;
    const initialY = canvas ? canvas.clientHeight / 2 - 100 + Math.random() * 40 : 150;

    const maxZ = stickers.length > 0 ? Math.max(...stickers.map(s => s.zIndex)) : 0;

    const newSticker: ActiveSticker = {
      ...preset,
      id: `sticker-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      x: initialX,
      y: initialY,
      rotation: Math.floor(Math.random() * 30) - 15,
      scale: 1,
      zIndex: maxZ + 1,
    };

    const updated = [...stickers, newSticker];
    updateStickersAndSave(updated);
    setSelectedId(newSticker.id);
  };

  const addCustomSticker = () => {
    const canvas = canvasRef.current;
    const initialX = canvas ? canvas.clientWidth / 2 - 100 + Math.random() * 40 : 150;
    const initialY = canvas ? canvas.clientHeight / 2 - 100 + Math.random() * 40 : 150;

    const maxZ = stickers.length > 0 ? Math.max(...stickers.map(s => s.zIndex)) : 0;

    const newSticker: ActiveSticker = {
      id: `sticker-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      title: newTitle,
      subtitle: newStickerType === 'label' ? newSubtitle : undefined,
      badgeText: newStickerType === 'graphic' ? newBadgeText : undefined,
      stickerType: newStickerType,
      colorTheme: newColorTheme,
      size: newSize,
      x: initialX,
      y: initialY,
      rotation: Math.floor(Math.random() * 30) - 15,
      scale: 1,
      zIndex: maxZ + 1,
    };

    const updated = [...stickers, newSticker];
    updateStickersAndSave(updated);
    setSelectedId(newSticker.id);
  };

  // Image Upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      
      const canvas = canvasRef.current;
      const initialX = canvas ? canvas.clientWidth / 2 - 100 + Math.random() * 40 : 150;
      const initialY = canvas ? canvas.clientHeight / 2 - 100 + Math.random() * 40 : 150;
      const maxZ = stickers.length > 0 ? Math.max(...stickers.map(s => s.zIndex)) : 0;

      const newSticker: ActiveSticker = {
        id: `sticker-${Date.now()}`,
        imageSrc: result,
        title: file.name.split('.')[0].substring(0, 15),
        badgeText: 'UPLOAD',
        stickerType: 'graphic',
        colorTheme: 'cream',
        size: 'md',
        x: initialX,
        y: initialY,
        rotation: 0,
        scale: 1,
        zIndex: maxZ + 1,
      };

      const updated = [...stickers, newSticker];
      updateStickersAndSave(updated);
      setSelectedId(newSticker.id);
    };
    reader.readAsDataURL(file);
  };

  // Drag and drop event handlers
  const handleStickerMouseDown = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedId(id);
    setDraggedId(id);

    const sticker = stickers.find(s => s.id === id);
    if (sticker) {
      setDragOffset({
        x: e.clientX - sticker.x,
        y: e.clientY - sticker.y,
      });
    }

    // Bring clicked sticker to front dynamically
    const maxZ = Math.max(...stickers.map(s => s.zIndex), 0);
    const updated = stickers.map(s => {
      if (s.id === id) {
        return { ...s, zIndex: maxZ + 1 };
      }
      return s;
    });
    setStickers(updated);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!draggedId) return;

    const updated = stickers.map(s => {
      if (s.id === draggedId) {
        return {
          ...s,
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        };
      }
      return s;
    });
    setStickers(updated);
  };

  const handleCanvasMouseUp = () => {
    if (draggedId) {
      setDraggedId(null);
      saveToLocalStorage(stickers);
    }
  };

  // Delete selected sticker
  const deleteSelected = () => {
    if (!selectedId) return;
    const updated = stickers.filter(s => s.id !== selectedId);
    updateStickersAndSave(updated);
    setSelectedId(null);
  };

  // Clear all stickers
  const clearAll = () => {
    if (window.confirm('Are you sure you want to clear your sticker board?')) {
      updateStickersAndSave([]);
      setSelectedId(null);
    }
  };

  // Adjust properties of selected sticker
  const adjustRotation = (amount: number) => {
    if (!selectedId) return;
    const updated = stickers.map(s => {
      if (s.id === selectedId) {
        return { ...s, rotation: (s.rotation + amount) % 360 };
      }
      return s;
    });
    updateStickersAndSave(updated);
  };

  const adjustScale = (factor: number) => {
    if (!selectedId) return;
    const updated = stickers.map(s => {
      if (s.id === selectedId) {
        // Clamp scale between 0.3 and 3
        const newScale = Math.max(0.3, Math.min(3, s.scale + factor));
        return { ...s, scale: newScale };
      }
      return s;
    });
    updateStickersAndSave(updated);
  };

  const adjustLayer = (direction: 'front' | 'back') => {
    if (!selectedId) return;
    const target = stickers.find(s => s.id === selectedId);
    if (!target) return;

    const currentZIndexes = stickers.map(s => s.zIndex).sort((a, b) => a - b);
    const minZ = currentZIndexes[0] || 0;
    const maxZ = currentZIndexes[currentZIndexes.length - 1] || 0;

    const updated = stickers.map(s => {
      if (s.id === selectedId) {
        return { ...s, zIndex: direction === 'front' ? maxZ + 1 : Math.max(1, minZ - 1) };
      }
      return s;
    });
    updateStickersAndSave(updated);
  };

  // Export HTML5 Canvas PNG representation
  const exportCanvasAsPNG = async () => {
    const canvasEl = document.createElement('canvas');
    const board = canvasRef.current;
    if (!board) return;

    const width = board.clientWidth;
    const height = board.clientHeight;
    canvasEl.width = width * 2; // high res
    canvasEl.height = height * 2;
    const ctx = canvasEl.getContext('2d');
    if (!ctx) return;

    ctx.scale(2, 2);

    // 1. Draw Background
    if (boardTheme === 'ink') {
      ctx.fillStyle = '#1A1A2E';
      ctx.fillRect(0, 0, width, height);
    } else if (boardTheme === 'cream') {
      ctx.fillStyle = '#F5F0E8';
      ctx.fillRect(0, 0, width, height);
    } else {
      // Mesh gradient fallback
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#1A1A2E');
      grad.addColorStop(0.5, '#2D1B4E');
      grad.addColorStop(1, '#1A1A2E');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }

    // Draw grid lines if active
    if (showGridLines) {
      ctx.strokeStyle = boardTheme === 'cream' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }

    // Helper to load image
    const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });
    };

    // Sort stickers by zIndex before drawing
    const sortedStickers = [...stickers].sort((a, b) => a.zIndex - b.zIndex);

    // 2. Draw each sticker
    for (const sticker of sortedStickers) {
      ctx.save();

      // Sizing mapping (matches CSS width/height)
      let stickerWidth = 192; // md: w-48
      let stickerHeight = 192;
      if (sticker.size === 'sm') {
        stickerWidth = 144; // w-36
        stickerHeight = 144;
      } else if (sticker.size === 'lg') {
        stickerWidth = 256; // w-64
        stickerHeight = 256;
      }

      // Apply scale
      stickerWidth *= sticker.scale;
      stickerHeight *= sticker.scale;

      // Center rotation point at sticker center
      const centerX = sticker.x + stickerWidth / 2;
      const centerY = sticker.y + stickerHeight / 2;

      ctx.translate(centerX, centerY);
      ctx.rotate((sticker.rotation * Math.PI) / 180);

      // Draw background sticker base card
      ctx.fillStyle = 
        sticker.colorTheme === 'yellow' ? '#FFE033' :
        sticker.colorTheme === 'pink' ? '#FF2D78' :
        sticker.colorTheme === 'blue' ? '#1B8FFF' :
        sticker.colorTheme === 'purple' ? '#9B5FFF' :
        sticker.colorTheme === 'cream' ? '#F5F0E8' : '#1A1A2E';

      ctx.strokeStyle = '#1A1A2E';
      ctx.lineWidth = 4;
      
      // Draw border box with rounded corners
      const r = 16; // radius
      const x = -stickerWidth / 2;
      const y = -stickerHeight / 2;
      const w = stickerWidth;
      const h = stickerHeight;

      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h - r);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // If sticker type is badge, draw dashed inner border
      if (sticker.stickerType === 'badge') {
        ctx.strokeStyle = '#1A1A2E';
        ctx.lineWidth = 3;
        ctx.setLineDash([6, 6]);
        const innerOffset = 12;
        const ir = 10;
        const ix = x + innerOffset;
        const iy = y + innerOffset;
        const iw = w - innerOffset * 2;
        const ih = h - innerOffset * 2;

        ctx.beginPath();
        ctx.moveTo(ix + ir, iy);
        ctx.lineTo(ix + iw - ir, iy);
        ctx.quadraticCurveTo(ix + iw, iy, ix + iw, iy + ir);
        ctx.lineTo(ix + iw, iy + ih - ir);
        ctx.quadraticCurveTo(ix + iw, iy + ih, ix + iw - ir, iy + ih);
        ctx.lineTo(ix + ir, iy + ih - ir);
        ctx.quadraticCurveTo(ix, iy + ih, ix, iy + ih - ir);
        ctx.lineTo(ix, iy + ir);
        ctx.quadraticCurveTo(ix, iy, ix + ir, iy);
        ctx.closePath();
        ctx.stroke();
        ctx.setLineDash([]); // reset
      }

      // Draw image graphic if present
      if (sticker.stickerType === 'graphic' && sticker.imageSrc) {
        try {
          const img = await loadImage(sticker.imageSrc);
          const imgSize = stickerWidth * 0.65;
          ctx.drawImage(img, -imgSize / 2, -imgSize / 2 - 10, imgSize, imgSize);
        } catch (e) {
          // Draw fallback emoji if image fails to load in canvas
          ctx.fillStyle = '#1A1A2E';
          ctx.font = `${stickerWidth * 0.25}px sans-serif`;
          ctx.textBaseline = 'middle';
          ctx.textAlign = 'center';
          ctx.fillText('🐵', 0, -10);
        }
      } else if (sticker.stickerType === 'graphic') {
        ctx.fillStyle = '#1A1A2E';
        ctx.font = `${stickerWidth * 0.25}px sans-serif`;
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillText('🐵', 0, -10);
      }

      // Draw text values
      ctx.fillStyle = 
        sticker.colorTheme === 'yellow' || sticker.colorTheme === 'cream' ? '#1A1A2E' : '#F5F0E8';
      ctx.textAlign = 'center';

      if (sticker.stickerType === 'graphic') {
        // Bottom Title
        ctx.font = `black ${Math.max(12, stickerWidth * 0.08)}px "Outfit", sans-serif`;
        ctx.fillText((sticker.title || '').toUpperCase(), 0, stickerHeight / 2 - 24);
      } else if (sticker.stickerType === 'label') {
        // Label header & subtext
        ctx.font = `black italic ${Math.max(14, stickerWidth * 0.11)}px "Outfit", sans-serif`;
        ctx.fillText((sticker.title || '').toUpperCase(), 0, -5);

        ctx.fillStyle = sticker.colorTheme === 'yellow' || sticker.colorTheme === 'cream' ? 'rgba(26,26,46,0.8)' : 'rgba(245,240,232,0.8)';
        ctx.font = `bold ${Math.max(8, stickerWidth * 0.05)}px "Inter", sans-serif`;
        ctx.fillText((sticker.subtitle || '').toUpperCase(), 0, stickerHeight / 2 - 50);
      } else if (sticker.stickerType === 'badge') {
        // Simple badge centered text
        ctx.font = `black ${Math.max(14, stickerWidth * 0.1)}px "Outfit", sans-serif`;
        ctx.fillText((sticker.title || 'FRANK MONKEY').toUpperCase(), 0, 5);
      }

      ctx.restore();
    }

    // Trigger download
    const url = canvasEl.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `frank-monkey-playground-${Date.now()}.png`;
    link.href = url;
    link.click();
  };

  const selectedSticker = stickers.find(s => s.id === selectedId);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full bg-brand-ink-black text-brand-cream overflow-hidden">
      
      {/* LEFT DRAWER PANEL: Sticker drawer & creators */}
      <div className="w-full lg:w-96 glass-panel border-r border-white/10 flex flex-col h-auto lg:h-screen shrink-0 overflow-y-auto">
        
        {/* Brand Banner */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center font-display font-black text-brand-ink-black text-xl rotate-6 shadow-lg shadow-brand-primary/20">
              F
            </div>
            <div>
              <h1 className="text-xl font-display font-black tracking-tight leading-none uppercase text-brand-primary">
                Frank Monkey
              </h1>
              <p className="text-[10px] font-sans tracking-widest font-bold text-brand-cream/60 uppercase mt-1">
                Design System v4
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-brand-hot-pink/10 border border-brand-hot-pink/20 text-brand-hot-pink text-[9px] font-display font-black tracking-wider uppercase">
            Project 1
          </span>
        </div>

        {/* Sticker Library Shelf */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-brand-primary" />
            <h2 className="font-display font-black uppercase text-sm tracking-wider">
              Sticker Catalog
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {PRESET_STICKERS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => addPresetSticker(preset)}
                className="group relative flex flex-col items-center justify-center p-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-brand-primary/30 transition-all text-center focus:outline-none"
              >
                <img
                  src={preset.imageSrc}
                  alt={preset.title}
                  className="w-16 h-16 object-contain group-hover:scale-110 transition-transform pointer-events-none drop-shadow-md"
                />
                <span className="text-[10px] font-display font-black uppercase tracking-tight text-brand-cream/80 group-hover:text-brand-primary mt-2">
                  {preset.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Sticker Creator Form */}
        <div className="p-6 border-b border-white/10 flex-grow">
          <div className="flex items-center gap-2 mb-4">
            <Plus className="w-4 h-4 text-brand-primary" />
            <h2 className="font-display font-black uppercase text-sm tracking-wider">
              Custom Sticker Builder
            </h2>
          </div>

          <div className="space-y-4">
            {/* Sticker Type Select */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-brand-cream/55 block mb-1.5">
                Sticker Format
              </label>
              <div className="grid grid-cols-3 gap-1 p-1 bg-brand-ink-black border border-white/10 rounded-lg">
                {(['label', 'graphic', 'badge'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setNewStickerType(type)}
                    className={`py-1.5 rounded-md text-[10px] font-display font-black uppercase tracking-wide transition-all ${
                      newStickerType === type 
                        ? 'bg-brand-primary text-brand-ink-black shadow-sm' 
                        : 'text-brand-cream/60 hover:text-brand-cream'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs based on type */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-brand-cream/55 block mb-1">
                Main Headline
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                maxLength={20}
                className="w-full bg-brand-ink-black border border-white/10 rounded-lg px-3 py-2 text-xs font-display uppercase tracking-wide text-brand-cream focus:outline-none focus:border-brand-primary"
              />
            </div>

            {newStickerType === 'label' && (
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-brand-cream/55 block mb-1">
                  Subtitle Details
                </label>
                <input
                  type="text"
                  value={newSubtitle}
                  onChange={(e) => setNewSubtitle(e.target.value)}
                  maxLength={25}
                  className="w-full bg-brand-ink-black border border-white/10 rounded-lg px-3 py-2 text-xs font-sans text-brand-cream focus:outline-none focus:border-brand-primary"
                />
              </div>
            )}

            {newStickerType === 'graphic' && (
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-brand-cream/55 block mb-1">
                  Ribbon Badge Text
                </label>
                <input
                  type="text"
                  value={newBadgeText}
                  onChange={(e) => setNewBadgeText(e.target.value)}
                  maxLength={10}
                  className="w-full bg-brand-ink-black border border-white/10 rounded-lg px-3 py-2 text-[10px] font-display uppercase tracking-widest text-brand-cream focus:outline-none focus:border-brand-primary"
                />
              </div>
            )}

            {/* Sticker Color Theme Select */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-brand-cream/55 block mb-1.5">
                Sticker Color Fill
              </label>
              <div className="grid grid-cols-6 gap-2">
                {([
                  { key: 'yellow', hex: '#FFE033' },
                  { key: 'pink', hex: '#FF2D78' },
                  { key: 'blue', hex: '#1B8FFF' },
                  { key: 'purple', hex: '#9B5FFF' },
                  { key: 'cream', hex: '#F5F0E8' },
                  { key: 'ink', hex: '#1A1A2E' },
                ] as const).map((theme) => (
                  <button
                    key={theme.key}
                    onClick={() => setNewColorTheme(theme.key)}
                    className={`w-full aspect-square rounded-lg border-2 flex items-center justify-center transition-all ${
                      newColorTheme === theme.key 
                        ? 'border-brand-cream scale-110 shadow-lg' 
                        : 'border-white/10 hover:border-white/30'
                    }`}
                    style={{ backgroundColor: theme.hex }}
                    title={theme.key}
                  >
                    {newColorTheme === theme.key && (
                      <span className={`w-2 h-2 rounded-full ${
                        theme.key === 'yellow' || theme.key === 'cream' ? 'bg-black' : 'bg-white'
                      }`} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Sticker Size select */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-brand-cream/55 block mb-1.5">
                Sticker Size Scale
              </label>
              <div className="grid grid-cols-3 gap-1 p-1 bg-brand-ink-black border border-white/10 rounded-lg">
                {(['sm', 'md', 'lg'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => setNewSize(size)}
                    className={`py-1 rounded-md text-[10px] font-display font-black uppercase transition-all ${
                      newSize === size 
                        ? 'bg-brand-primary text-brand-ink-black shadow-sm' 
                        : 'text-brand-cream/60 hover:text-brand-cream'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={addCustomSticker}
              className="w-full mt-2 py-3 rounded-xl bg-brand-primary text-brand-ink-black font-display font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-brand-primary/20"
            >
              <Plus className="w-4 h-4" /> Add Sticker to Board
            </button>
          </div>
        </div>

        {/* Custom Image Upload Drawer */}
        <div className="p-6 bg-black/25">
          <div className="flex items-center gap-2 mb-3">
            <Upload className="w-4 h-4 text-brand-primary" />
            <h2 className="font-display font-black uppercase text-sm tracking-wider">
              Upload Own Sticker Image
            </h2>
          </div>
          <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-white/10 hover:border-brand-primary/40 hover:bg-white/5 transition-all rounded-xl cursor-pointer">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-6 h-6 text-brand-cream/40 mb-2" />
              <p className="text-[10px] font-bold text-brand-cream/60 uppercase">
                Drop PNG/JPG or Browse
              </p>
            </div>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleImageUpload} 
            />
          </label>
        </div>

      </div>

      {/* CENTRAL AREA: Playground Canvas Board */}
      <div className="flex-grow flex flex-col h-screen overflow-hidden relative">
        
        {/* Workspace Toolbar Controls */}
        <div className="w-full h-16 glass-panel border-b border-white/10 flex items-center justify-between px-6 z-20 shrink-0">
          
          {/* Backdrop Board style selection */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-cream/55 mr-2">
              Board Backdrop:
            </span>
            <div className="flex bg-brand-ink-black border border-white/10 p-0.5 rounded-lg">
              {([
                { key: 'mesh', label: 'Holo Mesh' },
                { key: 'ink', label: 'Ink Black' },
                { key: 'cream', label: 'Cream Board' },
              ] as const).map((theme) => (
                <button
                  key={theme.key}
                  onClick={() => setBoardTheme(theme.key)}
                  className={`px-3 py-1 rounded-md text-[10px] font-display font-black uppercase tracking-wide transition-all ${
                    boardTheme === theme.key 
                      ? 'bg-white/10 text-brand-primary' 
                      : 'text-brand-cream/50 hover:text-brand-cream'
                  }`}
                >
                  {theme.label}
                </button>
              ))}
            </div>

            {/* Grid toggle */}
            <button
              onClick={() => setShowGridLines(!showGridLines)}
              className={`p-1.5 rounded-lg border transition-all ${
                showGridLines 
                  ? 'border-brand-primary text-brand-primary bg-brand-primary/5' 
                  : 'border-white/10 text-brand-cream/50 hover:text-brand-cream'
              }`}
              title="Toggle Grid Lines"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>

          {/* Export & Reset Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={clearAll}
              className="px-4 py-2 border border-white/10 rounded-xl text-xs font-display font-black uppercase tracking-wider text-brand-cream/70 hover:text-brand-hot-pink hover:border-brand-hot-pink/30 hover:bg-brand-hot-pink/5 transition-all"
            >
              Clear Board
            </button>
            <button
              onClick={exportCanvasAsPNG}
              className="px-4 py-2 rounded-xl bg-brand-cream text-brand-ink-black font-display font-black uppercase tracking-wider text-xs flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
            >
              <Download className="w-4 h-4" /> Export Board (.PNG)
            </button>
          </div>

        </div>

        {/* The Sticker Workspace Board */}
        <div 
          ref={canvasRef}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
          className={`flex-grow w-full relative overflow-hidden transition-all select-none ${
            boardTheme === 'mesh' ? 'bg-gradient-to-tr from-[#1A1A2E] via-[#241A3E] to-[#121226]' :
            boardTheme === 'ink' ? 'bg-[#1A1A2E]' : 'bg-[#F5F0E8]'
          }`}
        >
          {/* Holo Mesh background details if active */}
          {boardTheme === 'mesh' && (
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-hot-pink via-brand-holo-violet to-transparent" />
          )}

          {/* Grid Layout Overlay */}
          {showGridLines && (
            <div 
              className="absolute inset-0 pointer-events-none opacity-[0.03]" 
              style={{
                backgroundImage: boardTheme === 'cream' 
                  ? 'radial-gradient(circle, #000 1px, transparent 1px)' 
                  : 'radial-gradient(circle, #fff 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }}
            />
          )}

          {/* Render Active Stickers */}
          {stickers.map((sticker) => (
            <div
              key={sticker.id}
              style={{
                position: 'absolute',
                left: sticker.x,
                top: sticker.y,
                zIndex: sticker.zIndex,
                transform: `scale(${sticker.scale}) rotate(${sticker.rotation}deg)`,
                transformOrigin: 'center center',
              }}
              onMouseDown={(e) => handleStickerMouseDown(sticker.id, e)}
              className={`absolute group cursor-move select-none p-1 rounded-2xl ${
                selectedId === sticker.id ? 'ring-2 ring-brand-primary shadow-2xl ring-offset-4 ring-offset-brand-ink-black' : ''
              }`}
            >
              <HoloSticker
                stickerType={sticker.stickerType}
                imageSrc={sticker.imageSrc}
                title={sticker.title}
                subtitle={sticker.subtitle}
                badgeText={sticker.badgeText}
                colorTheme={sticker.colorTheme}
                size={sticker.size}
              />
            </div>
          ))}

          {stickers.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none p-6">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-brand-primary animate-pulse mb-4">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="font-display font-black text-xl uppercase tracking-wider text-brand-primary">
                Canvas Empty
              </h3>
              <p className="text-xs text-brand-cream/40 uppercase tracking-widest mt-1">
                Select or build stickers in the side menu to design
              </p>
            </div>
          )}

        </div>

        {/* Selected Sticker Interaction Panel */}
        {selectedSticker && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 glass-panel border border-white/15 px-6 py-4 rounded-2xl shadow-2xl z-30 flex items-center gap-6 animate-in slide-in-from-bottom duration-200">
            
            <div className="flex flex-col">
              <span className="text-[9px] font-bold uppercase tracking-widest text-brand-cream/50">
                Sticker Selected:
              </span>
              <span className="text-xs font-display font-black text-brand-primary uppercase truncate max-w-[120px]">
                {selectedSticker.title || 'Custom Label'}
              </span>
            </div>

            <div className="h-8 w-px bg-white/10" />

            {/* Transform Controls: Rotation */}
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold uppercase tracking-wider text-brand-cream/55">
                Rotate:
              </span>
              <button
                onClick={() => adjustRotation(-15)}
                className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:text-brand-primary transition-all"
                title="Rotate Left"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => adjustRotation(15)}
                className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:text-brand-primary transition-all"
                title="Rotate Right"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="h-8 w-px bg-white/10" />

            {/* Transform Controls: Scale */}
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold uppercase tracking-wider text-brand-cream/55">
                Scale:
              </span>
              <button
                onClick={() => adjustScale(-0.1)}
                className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:text-brand-primary text-xs font-bold font-display"
                title="Shrink"
              >
                -
              </button>
              <button
                onClick={() => adjustScale(0.1)}
                className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:text-brand-primary text-xs font-bold font-display"
                title="Grow"
              >
                +
              </button>
            </div>

            <div className="h-8 w-px bg-white/10" />

            {/* Layer arrangement */}
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold uppercase tracking-wider text-brand-cream/55">
                Layer:
              </span>
              <button
                onClick={() => adjustLayer('front')}
                className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:text-brand-primary transition-all flex items-center gap-1 text-[10px] font-bold font-display uppercase"
                title="Bring to Front"
              >
                <Layers className="w-3.5 h-3.5" /> Front
              </button>
              <button
                onClick={() => adjustLayer('back')}
                className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:text-brand-primary transition-all flex items-center gap-1 text-[10px] font-bold font-display uppercase"
                title="Send to Back"
              >
                <Layers className="w-3.5 h-3.5" /> Back
              </button>
            </div>

            <div className="h-8 w-px bg-white/10" />

            {/* Delete button */}
            <button
              onClick={deleteSelected}
              className="p-1.5 rounded-lg bg-brand-hot-pink/10 border border-brand-hot-pink/20 text-brand-hot-pink hover:bg-brand-hot-pink/20 hover:scale-105 active:scale-95 transition-all"
              title="Delete Sticker"
            >
              <Trash2 className="w-4 h-4" />
            </button>

          </div>
        )}

      </div>

    </div>
  );
};
