'use client'
import { ArrowRight } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { translations, Language } from "@/translate/language-data";
const slideImages = [
  { type: 'image', src: 'https://d2tbt8ofproiin.cloudfront.net/hero/main-1.jpg' },
  { type: 'video', src: 'https://d2tbt8ofproiin.cloudfront.net/pln-ip/pln-ip-video-1.mp4' },
  { type: 'image', src: 'https://d2tbt8ofproiin.cloudfront.net/ipal/ipal-3.jpg' }
]

import { Button } from '@/components/ui/button';
import { Construction } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';

export const Hero: React.FC = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [lang, setLang] = useState<Language>('en');
  const [open, setOpen] = useState(false);

  // Auto-play slideshow
  useEffect(() => {
    const currentLang = (Cookies.get("language") as Language) || 'en';
    setLang(currentLang);
    const handleLangChange = (e: any) => {
      if (e.detail) setLang(e.detail as Language);
    };
    window.addEventListener('languageChange', handleLangChange);
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % slideImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const t = translations[lang];

  return (
    <section className="min-h-screen bg-slate-950 relative overflow-hidden flex items-center" id="home">

      {/* 1. SLIDESHOW BACKGROUND */}
      <div className="absolute inset-0 z-0">
        {slideImages.map((item, index) => (
          <div
            key={item.src} 
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentImage ? 'opacity-100' : 'opacity-0'
              }`}
          >
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
                src={item.src} 
                alt={`Project Slide ${index + 1}`}
                className="object-cover w-full h-full select-none pointer-events-none"
              />
            )}

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
          {t.tagline}
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl text-white font-normal tracking-tight max-w-3xl mb-7 leading-[1.1] md:leading-[1.02] drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
          {t.title}<br />
          <em className="italic text-chart-1">{t.subtitle}</em>
        </h1>

        <p className="text-base sm:text-lg text-white/80 max-w-lg leading-relaxed mb-10 md:mb-11 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
          {t.desc}
        </p>

        <div className="flex flex-wrap items-center gap-4 mb-14">

          {/* ========================================================================= */}
          {/* OPTION A: FEATURE NOT READY (MODAL) */}
          {/* Comment out this block entirely when the feature is ready */}
          {/* ========================================================================= */}
          {/* <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button className="inline-flex items-center justify-center gap-2 bg-primary text-white rounded-lg px-7 py-3.5 text-sm font-semibold transition-all hover:opacity-90 hover:-translate-y-0.5 w-full sm:w-auto shadow-lg shadow-primary/20 cursor-pointer">
                {t.explore}
                <ArrowRight size={16} strokeWidth={2} />
              </button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[400px] text-center border-border bg-card p-6">
              <div className="flex flex-col items-center justify-center space-y-3 py-4">
                <div className="p-3 rounded-full bg-primary/10 text-primary mb-1">
                  <Construction className="size-8 animate-bounce" />
                </div>
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-foreground text-center">
                  {t.notReady}
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground text-center pt-2">
                    {t.notReadyDesc}
                  </DialogDescription>
                </DialogHeader>
              </div>

              <DialogFooter className="sm:justify-center pt-2">
                <Button 
                  className="w-full bg-primary text-white cursor-pointer" 
                  onClick={() => setOpen(false)}
                >
                  {t.yes}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog> */}

          {/* ========================================================================= */}
          {/* OPTION B: FEATURE IS READY (REDIRECT) */}
          {/* Uncomment this block when the feature is ready to redirect to /interface */}
          {/* ========================================================================= */}
          
          <a 
            href="/interface" 
            className="inline-flex items-center justify-center gap-2 bg-primary text-white rounded-lg px-7 py-3.5 text-sm font-semibold transition-all hover:opacity-90 hover:-translate-y-0.5 w-full sm:w-auto shadow-lg shadow-primary/20 cursor-pointer"
          >
            {t.explore}
            <ArrowRight size={16} strokeWidth={2} />
          </a>
         

          {/* Tombol Core Features */}
          <a 
            href="/landing/project" 
            className="inline-flex items-center justify-center gap-2 bg-white/5 backdrop-blur-sm text-white border border-white/25 rounded-lg px-7 py-3.5 text-sm font-medium transition-all hover:border-white/60 hover:bg-white/10 w-full sm:w-auto"
          >
            {t.core}
          </a>
        </div>

        {/* INTERACTIVE SLIDESHOW DOTS */}
        <div className="flex items-center gap-2.5 mb-4">
          {slideImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImage(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${idx === currentImage ? 'w-8 bg-white' : 'w-2 bg-white/30 hover:bg-white/50'
                }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        <hr className="border-t border-white/15 mb-0" />

        {/* STATS BORDERED GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 mt-8 overflow-hidden rounded-xl shadow-lg border border-white/10">
          {[
            { title: t.ourProjects, desc: '', bgColor: 'bg-[#6F59A8]/30', link: '/landing/project' },
            { title: t.ourMaterial, desc: '', bgColor: 'bg-[#8F445B]/30', link: '/landing/unavailable' },
            { title: t.ourServices, desc: '', bgColor: 'bg-[#804A16]/30', link: '/landing/services' },
            {
              title: t.aboutUs,
              desc: t.aboutDesc,
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
                {t.exploreLink}
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