'use client'
import { ArrowRight } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const slideImages = [
  { type: 'image', src: 'https://images.unsplash.com/photo-1542621334-a254cf47733d?q=80&w=1470&auto=format&fit=crop' },
  { type: 'video', src: 'https://media.istockphoto.com/id/480961036/id/video/skema.mp4?s=mp4-640x640-is&k=20&c=VKNdw1JtD9efX6R-s2PqMIEX8YUBnMDWgrFbBCvNhAs=' },
  { type: 'image', src: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=1920' }
]

export const Hero: React.FC = () => {
  const [currentImage, setCurrentImage] = useState(0);

  // Auto-play slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % slideImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="min-h-screen bg-slate-950 relative overflow-hidden flex items-center" id="home">

      {/* 1. SLIDESHOW BACKGROUND */}
      <div className="absolute inset-0 z-0">
        {slideImages.map((item, index) => (
          <div
            key={item.src} // PERBAIKAN: Menggunakan item.src (string) sebagai key unik
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentImage ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* PERBAIKAN: Deteksi kondisional untuk membedakan Image dan Video */}
            {item.type === 'video' ? (
              <video
                src={item.src}
                autoPlay
                muted
                loop
                playsInline
                className="object-cover w-full h-full select-none pointer-events-none"
              />
            ) : (
              <img
                src={item.src} // PERBAIKAN: Mengarahkan langsung ke string URL target
                alt={`Project Slide ${index + 1}`}
                className="object-cover w-full h-full select-none pointer-events-none"
              />
            )}
            
            {/* MODERN OVERLAY: Menjaga warna asli slideshow tetap hidup & teks kontras tinggi */}
            <div className="absolute inset-0 bg-gradient-to-r from-rose-950/80 via-slate-950/40 to-transparent mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-transparent to-slate-950/20" />
          </div>
        ))}
      </div>

      {/* 2. OVERLAY PATTERNS (Soft Grid) */}
      <div 
        aria-hidden
        className="absolute inset-0 pointer-events-none z-10 opacity-20"
        style={{
          backgroundImage: [
            'linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
            'linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
          ].join(', '),
          backgroundSize: '64px 64px',
        }}
      />

      {/* 3. HERO CONTENT */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-8 pt-36 pb-16 w-full">

        <div className="inline-flex items-center gap-2.5 bg-primary/20 border border-primary/40 backdrop-blur-sm rounded-full px-3.5 py-1.5 text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-chart-1 mb-7">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></div>
          Design &amp; Engineering Specialists
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl text-white font-normal tracking-tight max-w-3xl mb-7 leading-[1.1] md:leading-[1.02] drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
          AI-Driven Engineering.<br />
          <em className="italic text-chart-1">Instant Solutions.</em>
        </h1>

        <p className="text-base sm:text-lg text-white/80 max-w-lg leading-relaxed mb-10 md:mb-11 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
          Unlock next-generation capabilities. Experience JaPa’s advanced AI Tools and Agent to analyze, simulate, and optimize complex engineering challenges across industrial sectors in seconds.
        </p>
        
        {/* Tombol Aksi Utama untuk Mencoba AI */}
        <div className="flex flex-wrap items-center gap-4 mb-14">
          <a href="/tools" className="inline-flex items-center justify-center gap-2 bg-primary text-white rounded-lg px-7 py-3.5 text-sm font-semibold transition-all hover:opacity-90 hover:-translate-y-0.5 w-full sm:w-auto shadow-lg shadow-primary/20">
            Explore Our AI Tools
            <ArrowRight size={16} strokeWidth={2} />
          </a>
          <a href="#services" className="inline-flex items-center justify-center gap-2 bg-white/5 backdrop-blur-sm text-white border border-white/25 rounded-lg px-7 py-3.5 text-sm font-medium transition-all hover:border-white/60 hover:bg-white/10 w-full sm:w-auto">
            View Core Services
          </a>
        </div>

        {/* INTERACTIVE SLIDESHOW DOTS */}
        <div className="flex items-center gap-2.5 mb-4">
          {slideImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImage(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentImage ? 'w-8 bg-white' : 'w-2 bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        <hr className="border-t border-white/15 mb-0" />

        {/* STATS BORDERED GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 mt-8 overflow-hidden rounded-xl shadow-lg border border-white/10">
          {[
            { title: 'Our Projects', desc: '', bgColor: 'bg-[#6F59A8]/30', link: '/landing/project' },
            { title: 'Our Services', desc: '', bgColor: 'bg-[#8F445B]/30', link: '/landing/services' },
            { title: 'Our Sector', desc: '', bgColor: 'bg-[#804A16]/30', link: '/landing/sector' },
            {
              title: 'Why Us?',
              desc: 'Expert engineering solutions built on experience and precision.',
              bgColor: 'bg-[#2A6592]/30',
              link: '/landing/about'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className={`p-6 sm:p-8 flex flex-col justify-between min-h-[180px] sm:min-h-[200px] transition-all duration-300 hover:bg-opacity-40 backdrop-blur-xs border-r border-b border-white/5 last:border-0 ${item.bgColor}`}
            >
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight mb-2">
                  {item.title}
                </h3>
                {item.desc && (
                  <p className="text-xs sm:text-sm text-white/70 font-normal leading-relaxed mb-4">
                    {item.desc}
                  </p>
                )}
              </div>

              <a
                href={item.link}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-white/90 hover:text-white transition-colors group/btn w-fit mt-auto"
              >
                Explore
                <span className="transition-transform duration-200 group-hover/btn:translate-x-1">
                  -&gt;
                </span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};