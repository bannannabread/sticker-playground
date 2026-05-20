/* src/pages/Portfolio.tsx */
import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Star } from 'lucide-react';
import './portfolio.css';

interface PortfolioProps {
  onNavigateToCustomizer: () => void;
}

const ScrollReveal: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.08 });

    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ease-out transform ${
        visible ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.88]'
      } ${className}`}
    >
      {children}
    </div>
  );
};

export const Portfolio: React.FC<PortfolioProps> = ({ onNavigateToCustomizer }) => {
  // Cursor coordinate tracking
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [cursorColor, setCursorColor] = useState('#2D5BFF'); // Electric Blue (default)
  const [cursorHovered, setCursorHovered] = useState(false);

  // Staggered letters for hero "MEGAN" focus pull animation
  const nameLetters = 'MEGAN'.split('');

  useEffect(() => {
    const updateMouse = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updateMouse);
    return () => window.removeEventListener('mousemove', updateMouse);
  }, []);

  // Update cursor color based on scrolled section or active element
  const handleSectionHover = (color: string) => {
    setCursorColor(color);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const tickerSkills = [
    'React Native', 'Expo Router', 'TypeScript', 'SwiftUI', 'Figma', 
    'UI/UX Design', 'Mobile Architectures', 'Design Systems', 'WebGL Shaders', 
    'Framer Motion', 'Tailwind CSS v4'
  ];

  return (
    <div className="portfolio-container relative">
      
      {/* SVG Noise Film Grain Overlay */}
      <svg className="film-grain-overlay">
        <filter id="grainy-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.15 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grainy-noise)" />
      </svg>

      {/* Dynamic Cursor Ring & Trail Glow */}
      <div 
        className="cursor-dot hidden md:block" 
        style={{ left: mousePos.x, top: mousePos.y }} 
      />
      <div 
        className="cursor-ring hidden md:block" 
        style={{ 
          left: mousePos.x, 
          top: mousePos.y, 
          borderColor: cursorColor,
          transform: `translate(-50%, -50%) scale(${cursorHovered ? 1.5 : 1})`,
          backgroundColor: cursorHovered ? `${cursorColor}10` : 'transparent'
        }} 
      />
      <div 
        className="cursor-aura-glow hidden md:block" 
        style={{ 
          left: mousePos.x, 
          top: mousePos.y, 
          background: `radial-gradient(circle, ${cursorColor} 0%, rgba(0,0,0,0) 70%)` 
        }} 
      />

      {/* BACKGROUND AURA GRADIENT BLOBS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="morphing-blob blob-blue w-[45vw] h-[45vw] top-[10%] left-[5%]" />
        <div className="morphing-blob blob-orange w-[40vw] h-[40vw] top-[30%] right-[10%]" />
        <div className="morphing-blob blob-coral w-[35vw] h-[35vw] bottom-[25%] left-[20%]" />
        <div className="morphing-blob blob-yellow w-[30vw] h-[30vw] bottom-[5%] right-[25%]" />
      </div>

      {/* TOP NAVIGATION PILLS */}
      <nav className="fixed top-6 left-6 z-40 flex gap-2">
        <button 
          onClick={() => scrollToSection('work')}
          onMouseEnter={() => { setCursorHovered(true); handleSectionHover('#FF5C1A'); }}
          onMouseLeave={() => setCursorHovered(false)}
          className="px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase border border-black/10 bg-black text-white hover:bg-[#F5F0E8] hover:text-black hover:border-black/30 rounded-full transition-all"
        >
          [ work ]
        </button>
        <button 
          onClick={() => scrollToSection('about')}
          onMouseEnter={() => { setCursorHovered(true); handleSectionHover('#FF2D55'); }}
          onMouseLeave={() => setCursorHovered(false)}
          className="px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase border border-black/10 bg-black text-white hover:bg-[#F5F0E8] hover:text-black hover:border-black/30 rounded-full transition-all"
        >
          [ about ]
        </button>
        <button 
          onClick={() => scrollToSection('contact')}
          onMouseEnter={() => { setCursorHovered(true); handleSectionHover('#2D5BFF'); }}
          onMouseLeave={() => setCursorHovered(false)}
          className="px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase border border-black/10 bg-black text-white hover:bg-[#F5F0E8] hover:text-black hover:border-black/30 rounded-full transition-all"
        >
          [ contact ]
        </button>
      </nav>

      {/* HERO SECTION */}
      <header 
        className="min-h-screen flex flex-col justify-between p-6 md:p-12 relative z-10 select-none"
        onMouseEnter={() => handleSectionHover('#2D5BFF')}
      >
        <div /> {/* Spacer for flex-col distribution */}

        {/* Large Name Display */}
        <div className="w-full flex flex-col items-start mt-20">
          <h1 className="text-[18vw] leading-[0.8] tracking-tighter select-none font-extrabold flex">
            {nameLetters.map((char, index) => (
              <span
                key={index}
                className="focus-pull-char chrome-text"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                {char}
              </span>
            ))}
          </h1>
          
          {/* Subtitle / Tagline */}
          <div className="mt-8 flex flex-col md:flex-row md:items-center gap-4 text-left max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-widest leading-relaxed text-[#111111]/80">
              ui/ux engineer. cs @ uiuc. <span className="distressed-text font-syne not-italic text-sm tracking-normal uppercase">building things</span> that feel good to use.
            </p>
            {/* Playful organic touch Asterisk */}
            <div className="animate-spin duration-[10000ms] text-brand-hot-pink origin-center w-fit shrink-0">
              <Star className="w-5 h-5 fill-current" />
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="flex justify-between items-center text-[10px] font-mono tracking-widest text-[#111111]/60 uppercase pt-10">
          <span>PORTFOLIO v1.5</span>
          <button 
            onClick={() => scrollToSection('work')}
            className="flex items-center gap-1 hover:text-brand-hot-pink transition-colors font-bold"
          >
            SCROLL DOWN <ArrowRight className="w-3.5 h-3.5 animate-bounce-horizontal" />
          </button>
        </div>
      </header>

      {/* SELECTED WORK SECTION */}
      <section 
        id="work" 
        className="py-24 px-6 md:px-12 relative z-10 border-t border-black/10"
        onMouseEnter={() => handleSectionHover('#FF5C1A')}
      >
        <ScrollReveal className="mb-16">
          <div className="flex items-center gap-2">
            <span className="editorial-bracket">[</span>
            <span className="font-grotesk font-bold text-xs uppercase tracking-[0.25em] text-[#111111]/90">
              SELECTED WORK
            </span>
            <span className="editorial-bracket">]</span>
          </div>
        </ScrollReveal>

        {/* Asymmetric Cards layout */}
        <div className="flex flex-col gap-24 md:gap-32 w-full mt-10">
          
          {/* Row 1: Caterpillar (60% Width, Left aligned) */}
          <div className="w-full flex justify-start">
            <ScrollReveal className="w-full md:w-[62%]">
              <div 
                className="project-card p-6 md:p-8 flex flex-col justify-between aspect-video relative group select-none"
                onMouseEnter={() => { setCursorHovered(true); handleSectionHover('#FFD600'); }}
                onMouseLeave={() => setCursorHovered(false)}
              >
                {/* Custom Hover Aura */}
                <div 
                  className="project-card-aura" 
                  style={{ background: 'radial-gradient(circle, rgba(255,214,0,0.3) 0%, rgba(0,0,0,0) 70%)' }}
                />

                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#FFD600]">
                      PROJECT 01
                    </span>
                    <h3 className="font-syne font-extrabold text-2xl md:text-3xl uppercase tracking-tight mt-1">
                      Caterpillar AI Technicians App
                    </h3>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-[#FFD600] group-hover:text-black transition-all">
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                <div className="mt-12 flex flex-col gap-4">
                  <p className="font-mono text-xs text-[#F5F0E8]/70 leading-relaxed uppercase tracking-wider">
                    field inspection app — offline-first — react native / expo
                  </p>
                  
                  <div className="flex flex-wrap gap-2 pt-2">
                    <span className="px-2.5 py-1 border border-white/10 rounded-full text-[9px] font-mono uppercase tracking-wider text-[#F5F0E8]/80">
                      [ UI/UX Lead ]
                    </span>
                    <span className="px-2.5 py-1 border border-white/10 rounded-full text-[9px] font-mono uppercase tracking-wider text-[#F5F0E8]/80">
                      [ Design System ]
                    </span>
                    <span className="px-2.5 py-1 border border-white/10 rounded-full text-[9px] font-mono uppercase tracking-wider text-[#F5F0E8]/80">
                      [ Mobile ]
                    </span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Row 2: I-STUDY (35% Width, Offset Right, Offset Lower) */}
          <div className="w-full flex justify-end md:-mt-12">
            <ScrollReveal className="w-full md:w-[38%]">
              <div 
                className="project-card p-6 md:p-8 flex flex-col justify-between aspect-[3/4] relative group select-none"
                onMouseEnter={() => { setCursorHovered(true); handleSectionHover('#FF2D55'); }}
                onMouseLeave={() => setCursorHovered(false)}
              >
                <div 
                  className="project-card-aura" 
                  style={{ background: 'radial-gradient(circle, rgba(255,45,85,0.3) 0%, rgba(0,0,0,0) 70%)' }}
                />

                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-brand-hot-pink">
                      PROJECT 02
                    </span>
                    <h3 className="font-syne font-extrabold text-2xl md:text-3xl uppercase tracking-tight mt-1">
                      I-STUDY
                    </h3>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-brand-hot-pink group-hover:text-black transition-all">
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                <div className="mt-12 flex flex-col gap-4">
                  <p className="font-mono text-xs text-[#F5F0E8]/70 leading-relaxed uppercase tracking-wider">
                    study tool — AI-driven notes & spaced repetition organizer
                  </p>
                  
                  <div className="flex flex-wrap gap-2 pt-2">
                    <span className="px-2.5 py-1 border border-white/10 rounded-full text-[9px] font-mono uppercase tracking-wider text-[#F5F0E8]/80">
                      [ Mobile ]
                    </span>
                    <span className="px-2.5 py-1 border border-white/10 rounded-full text-[9px] font-mono uppercase tracking-wider text-[#F5F0E8]/80">
                      [ UI/UX ]
                    </span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Row 3: Frank Monkey Design System (Interactive Sandbox Showcase, 100% Width) */}
          <div className="w-full flex justify-center">
            <ScrollReveal className="w-full">
              <div 
                onClick={onNavigateToCustomizer}
                className="project-card p-8 md:p-12 flex flex-col justify-between min-h-[340px] relative group select-none border-2 border-brand-primary/20 hover:border-brand-primary/60 cursor-pointer"
                onMouseEnter={() => { setCursorHovered(true); handleSectionHover('#FFE033'); }}
                onMouseLeave={() => setCursorHovered(false)}
              >
                <div 
                  className="project-card-aura" 
                  style={{ background: 'radial-gradient(circle, rgba(255,224,51,0.2) 0%, rgba(0,0,0,0) 70%)' }}
                />

                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="px-2.5 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/30 text-brand-primary text-[8px] font-mono uppercase tracking-widest w-fit mb-2">
                      FEATURED PORTFOLIO EXPERIMENT
                    </span>
                    <h3 className="font-syne font-extrabold text-3xl md:text-5xl uppercase tracking-tighter mt-1 chrome-text">
                      Frank Monkey Design System
                    </h3>
                  </div>
                  <div className="px-4 py-2 rounded-full border border-brand-primary/40 bg-brand-primary/10 text-brand-primary group-hover:bg-brand-primary group-hover:text-black transition-all flex items-center gap-2 text-xs font-mono uppercase tracking-wider">
                    Enter Interactive Canvas <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="mt-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div className="max-w-xl">
                    <p className="font-mono text-xs text-[#F5F0E8]/70 leading-relaxed uppercase tracking-wider">
                      Interactive sandbox playground showcasing custom WebGL metallic refractions, physical 3D sticker maps, and modular CSS-first styling token variables.
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 shrink-0">
                    <span className="px-2.5 py-1 border border-brand-primary/30 rounded-full text-[9px] font-mono uppercase tracking-wider text-brand-primary">
                      [ Tech Lead ]
                    </span>
                    <span className="px-2.5 py-1 border border-brand-primary/30 rounded-full text-[9px] font-mono uppercase tracking-wider text-brand-primary">
                      [ WebGL Shaders ]
                    </span>
                    <span className="px-2.5 py-1 border border-brand-primary/30 rounded-full text-[9px] font-mono uppercase tracking-wider text-brand-primary">
                      [ Tailwind v4 ]
                    </span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

        </div>
      </section>

      {/* ABOUT SECTION */}
      <section 
        id="about" 
        className="py-32 px-6 md:px-12 relative z-10 border-t border-black/10 bg-[#111111] text-[#F5F0E8]"
        onMouseEnter={() => handleSectionHover('#FF2D55')}
      >
        {/* Editorial bracket layout */}
        <ScrollReveal className="mb-20 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="font-grotesk font-bold text-xs uppercase tracking-[0.25em] text-[#F5F0E8]/80">
              [ ABOUT ME ]
            </span>
          </div>
          <Star className="w-5 h-5 text-brand-primary animate-spin duration-[15000ms]" />
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-6 mt-10">
          {/* Left: Large Display Slogan */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <ScrollReveal>
              <h2 className="font-syne font-extrabold text-5xl md:text-7xl uppercase tracking-tighter leading-[0.9] text-[#F5F0E8]">
                FEEL IS <span className="distressed-blue-text">FUNCTION</span>.
              </h2>
            </ScrollReveal>
          </div>

          {/* Right: Monospace details */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <ScrollReveal>
              <div className="font-mono text-xs uppercase tracking-widest text-[#F5F0E8]/50 mb-4">
                BIOGRAPHY // MEGAN JACOB
              </div>
              <p className="font-mono text-sm text-[#F5F0E8]/85 leading-relaxed tracking-wider">
                I'm Megan — a UI/UX engineer and CS student at UIUC. I build mobile and frontend interfaces that prioritize feel as much as function. Currently focusing on modular design systems, offline-first architectures, and WebGL shader graphics.
              </p>
              <p className="font-mono text-sm text-[#F5F0E8]/85 leading-relaxed tracking-wider mt-4">
                Building products with custom tactile interactions that push the browser environment to its absolute limits.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CONTACT / FOOTER SECTION */}
      <footer 
        id="contact" 
        className="relative z-10 bg-black text-[#F5F0E8] select-none"
        onMouseEnter={() => handleSectionHover('#2D5BFF')}
      >
        <div className="p-12 md:p-24 flex flex-col items-center text-center border-t border-white/5">
          <ScrollReveal>
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#F5F0E8]/40 block mb-4">
              READY TO COLLABORATE?
            </span>
            <a 
              href="mailto:mjacob@uiuc.edu"
              onMouseEnter={() => setCursorHovered(true)}
              onMouseLeave={() => setCursorHovered(false)}
              className="font-syne font-extrabold text-4xl md:text-7xl uppercase tracking-tight text-white hover:text-brand-primary transition-colors duration-300"
            >
              LET'S BUILD →
            </a>
          </ScrollReveal>
        </div>

        {/* Infinite looping horizontal ticker */}
        <div className="ticker-wrap">
          <div className="ticker">
            {/* Render ticker twice to support infinite loop spacing */}
            {Array(4).fill(tickerSkills).flat().map((skill, index) => (
              <span key={index} className="ticker-item flex items-center gap-2">
                <span>·</span> {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Copyright strip */}
        <div className="p-6 flex justify-between items-center text-[10px] font-mono tracking-widest text-[#F5F0E8]/35 uppercase border-t border-white/5 bg-[#111111]">
          <span>MEGAN © 2026</span>
          <span>URBANA-CHAMPAIGN, IL</span>
        </div>
      </footer>

    </div>
  );
};
export default Portfolio;
