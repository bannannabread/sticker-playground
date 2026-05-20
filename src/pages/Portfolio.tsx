/* src/pages/Portfolio.tsx */
import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
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
      
      {/* SVG Noise Film Grain Overlay - 20% opacity fixed over everything */}
      <svg className="film-grain-overlay">
        <filter id="grainy-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.20 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grainy-noise)" />
      </svg>

      {/* SVG Distress / Degraded filter for text elements */}
      <svg className="hidden">
        <filter id="distress">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      {/* Visually Aggressive Custom Cursor - 12px, border 2px solid #FF0090, scales to 24px and lime green on hover */}
      <div 
        className={`cursor-ring hidden md:block ${cursorHovered ? 'cursor-ring-hovered' : ''}`}
        style={{ 
          left: mousePos.x, 
          top: mousePos.y 
        }} 
      />

      {/* BACKGROUND AURA GRADIENT BLOBS - Saturated Neon Spray-Paint */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Hero Section Blobs */}
        <div className="morphing-blob blob-pink top-[-100px] left-[-200px]" />
        <div className="morphing-blob blob-blue top-[100px] right-[-150px]" />
        
        {/* Work Section Area Blobs */}
        <div className="morphing-blob blob-magenta top-[35%] left-[-150px]" />
        <div className="morphing-blob blob-green top-[60%] right-[-180px]" />

        {/* Footer Area Blobs */}
        <div className="morphing-blob blob-pink bottom-[-150px] left-[-100px]" />
        <div className="morphing-blob blob-blue bottom-[100px] right-[-200px]" />
      </div>

      {/* TOP NAVIGATION PILLS - SOLID DARK #111111 */}
      <nav className="fixed top-6 left-6 z-40 flex gap-2">
        <button 
          onClick={() => scrollToSection('work')}
          onMouseEnter={() => setCursorHovered(true)}
          onMouseLeave={() => setCursorHovered(false)}
          className="nav-pill-btn px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase rounded-full cursor-pointer"
        >
          [ work ]
        </button>
        <button 
          onClick={() => scrollToSection('about')}
          onMouseEnter={() => setCursorHovered(true)}
          onMouseLeave={() => setCursorHovered(false)}
          className="nav-pill-btn px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase rounded-full cursor-pointer"
        >
          [ about ]
        </button>
        <button 
          onClick={() => scrollToSection('contact')}
          onMouseEnter={() => setCursorHovered(true)}
          onMouseLeave={() => setCursorHovered(false)}
          className="nav-pill-btn px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase rounded-full cursor-pointer"
        >
          [ contact ]
        </button>
      </nav>

      {/* HERO SECTION */}
      <header className="min-h-screen flex flex-col justify-between p-6 md:p-12 relative z-10 select-none">
        <div /> {/* Spacer for flex-col distribution */}

        {/* Large Name Display */}
        <div className="w-full flex flex-col items-start mt-20">
          <h1 className="text-[18vw] leading-[0.8] tracking-tighter select-none font-black flex">
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
            <p className="font-mono text-xs uppercase tracking-widest leading-relaxed text-[#FFFFFF]/90">
              ui/ux engineer. cs @ uiuc. <span className="building-things-gradient">building things</span> that feel good to use.
            </p>
            {/* Playful Y2K ✦ pink star motif */}
            <span className="text-[#FF0090] text-2xl animate-spin duration-[10000ms] select-none shrink-0 inline-block font-sans">✦</span>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="flex justify-between items-center text-[10px] font-mono tracking-widest text-[#FFFFFF]/70 uppercase pt-10">
          <span>PORTFOLIO v1.5</span>
          <button 
            onClick={() => scrollToSection('work')}
            className="flex items-center gap-1 hover:text-[#FF0090] transition-colors font-bold cursor-pointer text-[#FFFFFF]"
            onMouseEnter={() => setCursorHovered(true)}
            onMouseLeave={() => setCursorHovered(false)}
          >
            SCROLL DOWN <ArrowRight className="w-3.5 h-3.5 animate-bounce-horizontal" />
          </button>
        </div>
      </header>

      {/* SECTION DIVIDER - BRACKET NOTATION [ ✦ ] */}
      <div className="w-full flex justify-center py-20 text-[#FF0090] font-mono text-base tracking-widest font-bold">
        [  ✦  ]
      </div>

      {/* SELECTED WORK SECTION */}
      <section 
        id="work" 
        className="py-12 px-6 md:px-12 relative z-10"
      >
        <ScrollReveal className="mb-16">
          <div className="flex items-center gap-2">
            <span className="editorial-bracket">[</span>
            <span className="font-grotesk font-bold text-xs uppercase tracking-[0.25em] text-[#FFFFFF]/90 distressed-text">
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
                className="project-card p-6 md:p-8 flex flex-col justify-between aspect-video relative group select-none cursor-pointer"
                onMouseEnter={() => setCursorHovered(true)}
                onMouseLeave={() => setCursorHovered(false)}
              >
                {/* Visual hover overlay flood */}
                <div className="project-card-wash" />

                <div className="flex justify-between items-start relative z-10">
                  <div className="flex flex-col">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#FF0090] group-hover:text-black transition-colors">
                      PROJECT 01
                    </span>
                    <h3 className="project-card-title font-syne font-extrabold text-2xl md:text-3xl uppercase tracking-tight mt-1 distressed-text transition-colors">
                      Caterpillar AI Technicians App
                    </h3>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-white/20 group-hover:border-black flex items-center justify-center group-hover:bg-[#FF0090] group-hover:text-black text-white transition-all">
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                <div className="mt-12 flex flex-col gap-4 relative z-10">
                  <p className="font-mono text-xs text-[#AAAAAA] group-hover:text-black/80 leading-relaxed uppercase tracking-wider transition-colors">
                    field inspection app — offline-first — react native / expo
                  </p>
                  
                  <div className="flex flex-wrap gap-2 pt-2">
                    <span className="px-2.5 py-1 border border-white/10 group-hover:border-black/20 rounded-full text-[9px] font-mono uppercase tracking-wider text-[#FFFFFF] group-hover:text-black transition-colors">
                      [ UI/UX Lead ]
                    </span>
                    <span className="px-2.5 py-1 border border-white/10 group-hover:border-black/20 rounded-full text-[9px] font-mono uppercase tracking-wider text-[#FFFFFF] group-hover:text-black transition-colors">
                      [ Design System ]
                    </span>
                    <span className="px-2.5 py-1 border border-white/10 group-hover:border-black/20 rounded-full text-[9px] font-mono uppercase tracking-wider text-[#FFFFFF] group-hover:text-black transition-colors">
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
                className="project-card p-6 md:p-8 flex flex-col justify-between aspect-[3/4] relative group select-none cursor-pointer"
                onMouseEnter={() => setCursorHovered(true)}
                onMouseLeave={() => setCursorHovered(false)}
              >
                <div className="project-card-wash" />
                
                <div className="flex justify-between items-start relative z-10">
                  <div className="flex flex-col">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#FF0090] group-hover:text-black transition-colors">
                      PROJECT 02
                    </span>
                    <h3 className="project-card-title font-syne font-extrabold text-2xl md:text-3xl uppercase tracking-tight mt-1 distressed-text transition-colors">
                      I-STUDY
                    </h3>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-white/20 group-hover:border-black flex items-center justify-center group-hover:bg-[#FF0090] group-hover:text-black text-white transition-all">
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                <div className="mt-12 flex flex-col gap-4 relative z-10">
                  <p className="font-mono text-xs text-[#AAAAAA] group-hover:text-black/80 leading-relaxed uppercase tracking-wider transition-colors">
                    study tool — AI-driven notes & spaced repetition organizer
                  </p>
                  
                  <div className="flex flex-wrap gap-2 pt-2">
                    <span className="px-2.5 py-1 border border-white/10 group-hover:border-black/20 rounded-full text-[9px] font-mono uppercase tracking-wider text-[#FFFFFF] group-hover:text-black transition-colors">
                      [ Mobile ]
                    </span>
                    <span className="px-2.5 py-1 border border-white/10 group-hover:border-black/20 rounded-full text-[9px] font-mono uppercase tracking-wider text-[#FFFFFF] group-hover:text-black transition-colors">
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
                className="project-card p-8 md:p-12 flex flex-col justify-between min-h-[340px] relative group select-none border border-[#333333] hover:border-[#FF0090] cursor-pointer"
                onMouseEnter={() => setCursorHovered(true)}
                onMouseLeave={() => setCursorHovered(false)}
              >
                <div className="project-card-wash" />
                
                <div className="flex justify-between items-start relative z-10">
                  <div className="flex flex-col">
                    <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/15 text-[#FFFFFF] text-[8px] font-mono uppercase tracking-widest w-fit mb-2 group-hover:bg-black/10 group-hover:text-black group-hover:border-black/20 transition-all">
                      FEATURED PORTFOLIO EXPERIMENT
                    </span>
                    <h3 className="project-card-title font-syne font-extrabold text-3xl md:text-5xl uppercase tracking-tighter mt-1 distressed-text transition-colors">
                      Frank Monkey Design System
                    </h3>
                  </div>
                  <div className="px-4 py-2 rounded-full border border-white/20 group-hover:border-black bg-white/5 text-[#FFFFFF] group-hover:bg-black group-hover:text-white transition-all flex items-center gap-2 text-xs font-mono uppercase tracking-wider">
                    Enter Interactive Canvas <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="mt-16 flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
                  <div className="max-w-xl">
                    <p className="font-mono text-xs text-[#AAAAAA] group-hover:text-black/85 leading-relaxed uppercase tracking-wider transition-colors">
                      Interactive sandbox playground showcasing custom WebGL metallic refractions, physical 3D sticker maps, and modular CSS-first styling token variables.
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 shrink-0">
                    <span className="px-2.5 py-1 border border-white/15 group-hover:border-black/30 rounded-full text-[9px] font-mono uppercase tracking-wider text-white group-hover:text-black transition-colors font-bold">
                      [ Tech Lead ]
                    </span>
                    <span className="px-2.5 py-1 border border-white/15 group-hover:border-black/30 rounded-full text-[9px] font-mono uppercase tracking-wider text-white group-hover:text-black transition-colors font-bold">
                      [ WebGL Shaders ]
                    </span>
                    <span className="px-2.5 py-1 border border-white/15 group-hover:border-black/30 rounded-full text-[9px] font-mono uppercase tracking-wider text-white group-hover:text-black transition-colors font-bold">
                      [ Tailwind v4 ]
                    </span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

        </div>
      </section>

      {/* SECTION DIVIDER - BRACKET NOTATION [ ✦ ] */}
      <div className="w-full flex justify-center py-20 text-[#FF0090] font-mono text-base tracking-widest font-bold">
        [  ✦  ]
      </div>

      {/* ABOUT SECTION */}
      <section 
        id="about" 
        className="py-32 px-6 md:px-12 relative z-10 bg-[#111111] text-[#FFFFFF]"
      >
        {/* Editorial bracket layout */}
        <ScrollReveal className="mb-20 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="font-grotesk font-bold text-xs uppercase tracking-[0.25em] text-[#FFFFFF]/90 distressed-text">
              [ ABOUT ME ]
            </span>
          </div>
          <span className="text-[#AAFF00] text-2xl animate-spin duration-[15000ms] select-none font-sans">✦</span>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-6 mt-10">
          {/* Left: Large Display Slogan */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <ScrollReveal>
              <h2 className="font-syne font-extrabold text-5xl md:text-7xl uppercase tracking-tighter leading-[0.9] text-[#FFFFFF] distressed-text">
                FEEL IS <span className="building-things-gradient">FUNCTION</span>.
              </h2>
            </ScrollReveal>
          </div>

          {/* Right: Monospace details */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <ScrollReveal>
              <div className="font-mono text-xs uppercase tracking-widest text-[#FFFFFF]/50 mb-4 font-bold">
                BIOGRAPHY // MEGAN JACOB
              </div>
              <p className="font-mono text-sm text-[#F0F0F0] leading-relaxed tracking-wider font-bold">
                I'm Megan — a UI/UX engineer and CS student at UIUC. I build mobile and frontend interfaces that prioritize feel as much as function. Currently focusing on modular design systems, offline-first architectures, and WebGL shader graphics.
              </p>
              <p className="font-mono text-sm text-[#F0F0F0] leading-relaxed tracking-wider mt-4 font-bold">
                Building products with custom tactile interactions that push the browser environment to its absolute limits.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* SECTION DIVIDER - BRACKET NOTATION [ ✦ ] */}
      <div className="w-full flex justify-center py-20 text-[#FF0090] font-mono text-base tracking-widest font-bold bg-black">
        [  ✦  ]
      </div>

      {/* CONTACT / FOOTER SECTION */}
      <footer 
        id="contact" 
        className="relative z-10 bg-black text-[#FFFFFF] select-none"
      >
        <div className="p-12 md:p-24 flex flex-col items-center text-center border-t border-white/5">
          <ScrollReveal>
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#FFFFFF]/40 block mb-4 font-bold">
              READY TO COLLABORATE?
            </span>
            <a 
              href="mailto:mjacob@uiuc.edu"
              onMouseEnter={() => setCursorHovered(true)}
              onMouseLeave={() => setCursorHovered(false)}
              className="font-syne font-extrabold text-4xl md:text-7xl uppercase tracking-tight text-white hover:text-[#AAFF00] transition-colors duration-300 distressed-text cursor-pointer"
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
        <div className="p-6 flex justify-between items-center text-[10px] font-mono tracking-widest text-[#FFFFFF]/35 uppercase border-t border-white/5 bg-[#111111]">
          <span>MEGAN © 2026</span>
          <span>URBANA-CHAMPAIGN, IL</span>
        </div>
      </footer>

    </div>
  );
};
export default Portfolio;
