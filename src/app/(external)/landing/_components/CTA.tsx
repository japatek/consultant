'use client'
import React, { useState, useEffect } from 'react';
import { translations, Language } from "@/translate/language-data";
import Cookies from 'js-cookie';


export const CTA: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');
   useEffect(() => {
    const currentLang = (Cookies.get("language") as Language) || 'en';
    setLang(currentLang);
    
    const handleLangChange = (e: any) => {
      if (e.detail) setLang(e.detail as Language);
    };

    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

    const t = translations[lang];
  return (
    <section className="bg-background py-28 relative overflow-hidden" id="contact">
      <div className="absolute inset-0 bg-[linear-gradient(oklch(0.488_0.243_264.376_/_0.07)_1px,transparent_1px),linear-gradient(90deg,oklch(0.488_0.243_264.376_/_0.07)_1px,transparent_1px)] bg-[size:44px_44px] pointer-events-none"></div>

      <div className="relative z-10 text-center max-w-2xl mx-auto px-6">
        <div className="text-[11px] font-bold tracking-widest uppercase text-chart-2 mb-3.5">{t.ctaTag}</div>
        <h2 className="font-serif text-3xl md:text-5xl text-foreground tracking-tight leading-[1.08] mb-5">{t.ctaTitleLine1}<br />{t.ctaTitleLine2}</h2>
        <p className="text-foreground/55 text-md leading-relaxed mb-10">
          {t.ctaDesc}
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <a href="mailto:contact@JaPaTek.com?cc=riefkyiqbalm@gmail.com&bcc=riefky.iqbal19@gmail.com&subject=Hello%20JaPa" className="inline-flex items-center gap-2 bg-primary text-white rounded-lg px-8 py-4 text-base font-semibold transition-all hover:bg-primary-light hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-glow">
            {t.contact}
            <svg viewBox="0 0 14 14" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M2 7h10M8 3l4 4-4 4" /></svg>
          </a>
        </div>
      </div>
    </section>
  );
};