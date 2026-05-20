/* src/pages/Portfolio.tsx */
import React from 'react';
import './portfolio.css';

interface PortfolioProps {
  onNavigateToCustomizer: () => void;
}

export const Portfolio: React.FC<PortfolioProps> = ({ onNavigateToCustomizer }) => {
  React.useEffect(() => {
    if (false) {
      onNavigateToCustomizer();
    }
  }, [onNavigateToCustomizer]);

  return (
    <div className="portfolio-container min-h-screen flex flex-col font-sans relative">
      
      {/* SVG Noise Film Grain Overlay - 20% opacity fixed over everything */}
      <svg className="film-grain-overlay">
        <filter id="grainy-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.20 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grainy-noise)" />
      </svg>

      {/* TOP NAVIGATION BAR */}
      <header className="w-full flex justify-between items-center px-5 py-6 relative z-10">
        <div className="text-white text-base font-semibold tracking-wide">
          Megan Jacob
        </div>
        <div className="flex gap-6 text-white text-base font-semibold tracking-wide">
          <a href="#work" className="hover:opacity-80 transition-opacity">Projects</a>
          <a href="#skills" className="hover:opacity-80 transition-opacity">Skills</a>
          <a href="#contact" className="hover:opacity-80 transition-opacity">Connect</a>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="flex flex-col items-center justify-center pt-24 pb-16 px-5 relative z-10 w-full">
        <div className="relative inline-block select-none">
          <h1 className="text-[100px] sm:text-[120px] md:text-[140px] font-black text-white leading-none tracking-tight text-center hero-name-glow">
            Megan
          </h1>
          {/* Floating Stacked Info Block */}
          <div className="absolute right-0 top-[90%] text-right text-white font-sans text-xs sm:text-sm font-normal tracking-wide leading-tight mt-1 opacity-90">
            <div>Computer Science</div>
            <div>Information Science</div>
            <div>UI/UX</div>
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS SECTION */}
      <section id="work" className="py-12 px-5 relative z-10 max-w-4xl mx-auto w-full">
        <h2 className="text-white text-3xl font-extrabold tracking-wide mb-6">
          Featured Projects
        </h2>

        {/* 3-Column Glassmorphism Cards Row */}
        <div className="grid grid-cols-3 gap-3 md:gap-6 items-center">
          {/* Card 1: Left */}
          <div className="flex flex-col items-center">
            <div className="w-full h-[180px] sm:h-[200px] bg-white/35 backdrop-blur-[12px] rounded-[28px]" />
            <span className="mt-3 text-white text-sm font-sans tracking-wide text-center">I-Study</span>
          </div>

          {/* Card 2: Center (~10% Taller) */}
          <div className="flex flex-col items-center">
            <div className="w-full h-[200px] sm:h-[220px] bg-white/35 backdrop-blur-[12px] rounded-[28px]" />
            <span className="mt-3 text-white text-sm font-sans tracking-wide text-center">CAT AI App</span>
          </div>

          {/* Card 3: Right */}
          <div className="flex flex-col items-center">
            <div className="w-full h-[180px] sm:h-[200px] bg-white/35 backdrop-blur-[12px] rounded-[28px]" />
            <span className="mt-3 text-white text-sm font-sans tracking-wide text-center">FCN Stickers</span>
          </div>
        </div>
      </section>

      {/* ABOUT ME SECTION */}
      <section id="about" className="py-12 px-5 relative z-10 max-w-4xl mx-auto w-full">
        <h2 className="text-white text-3xl font-extrabold tracking-wide mb-6">
          About Me
        </h2>

        <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
          {/* Left Column (~55% width) */}
          <div className="w-full md:w-[55%] flex flex-col justify-center">
            <p className="text-white text-[15px] font-normal leading-relaxed tracking-wide mb-4">
              Hi! My name is Megan, and I am a junior at the University of Illinois Urbana-Champaign. I am currently pursuing a B.S. in Computer Science and a minor in Informatics. I have a passion for UI/UX and product design.
            </p>
            <a 
              href="mailto:mjacob@uiuc.edu"
              className="text-white text-[15px] font-semibold tracking-wide underline hover:opacity-80 transition-opacity flex items-center gap-1"
            >
              Connect With Me →
            </a>
          </div>

          {/* Right Column (~40% width) - Blank pink-tinted glass card */}
          <div className="w-full md:w-[40%] flex justify-center md:justify-end">
            <div className="w-full aspect-square max-w-[240px] rounded-[32px] bg-white/40 backdrop-blur-[12px]" style={{ backgroundColor: 'rgba(255, 230, 240, 0.4)' }} />
          </div>
        </div>
      </section>

      {/* SKILLS SECTION */}
      <section id="skills" className="py-12 px-5 relative z-10 max-w-4xl mx-auto w-full">
        <h2 className="text-white text-3xl font-extrabold tracking-wide mb-12">
          Skills
        </h2>
        {/* Empty space below - no tags, no grid, no content */}
      </section>

      {/* Spacer to push content above footer */}
      <div className="flex-grow py-8" />

      {/* FOOTER */}
      <footer id="contact" className="w-full bg-[#1A0A0A] mt-auto relative z-10">
        <div className="max-w-4xl mx-auto px-5 py-6 flex justify-between items-center text-white text-[15px] font-semibold tracking-wide">
          <span>Made with Love</span>
          <span>Quick Links</span>
        </div>
      </footer>

    </div>
  );
};

export default Portfolio;
