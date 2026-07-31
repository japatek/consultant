'use client'
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { translations, Language } from '@/translate/language-data';

export const AboutUs: React.FC = () => {
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

  // Fetch the dictionary for the active language
  const t = translations[lang];

  return (
    <section className="py-24 bg-background" id="about">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          {/* Left Column: Text & Features */}
          <div>
            <div className="text-[11px] font-bold tracking-widest uppercase text-vertex-primary mb-3.5">
              {t.aboutTagline}
            </div>
            
            <h2 className="font-serif text-3xl md:text-5xl text-vertex-fg tracking-tight leading-[1.08] mb-5">
              {t.aboutTitleLine1}<br />{t.aboutTitleLine2}
            </h2>
            
            <p className="text-[15px] text-vertex-muted-fg leading-relaxed mb-10 max-w-lg">
              {t.aboutDescText}
            </p>
            
            <div className="flex flex-col">
              {t.aboutFeatures.map((feat, i) => (
                <div key={i} className="flex gap-4 py-6 border-b border-vertex-border first:pt-0 last:border-b-0 last:pb-0">
                  <div className="w-10 h-10 rounded-lg bg-[oklch(0.488_0.243_264.376_/_0.1)] text-vertex-primary flex items-center justify-center flex-shrink-0">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="9" cy="9" r="7"/>
                      <path d="M6 9l2 2 4-4"/>
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-[15px] text-vertex-fg mb-1">
                      {feat.title}
                    </div>
                    <div className="text-[13px] text-vertex-muted-fg leading-relaxed">
                      {feat.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right Column: Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {t.aboutStats.map((box, i) => (
              <div key={i} className="bg-white border border-vertex-border rounded-2xl p-[30px] relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-gradient-to-r before:from-vertex-primary before:to-[oklch(0.623_0.214_259.815)]">
                <div className="text-[44px] font-extrabold text-vertex-primary tracking-tighter leading-none">
                  {box.val}
                </div>
                <div className="text-[12px] text-vertex-muted-fg font-semibold uppercase tracking-wider mt-2">
                  {box.lbl}
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </div>
    </section>
  );
};