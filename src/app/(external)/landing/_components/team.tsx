'use client'
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { translations, Language } from '@/translate/language-data';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const teamImages = [
  { id: 1, src: "https://uwtzrtpvr9dcj5x7.private.blob.vercel-storage.com/about/003.jpg?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfVVdUWlJUUHZyOURjSjV4NyIsIm93bmVySWQiOiJ0ZWFtX3AydEpzYVEzbGtIRXplR0Mya2p0VTVGdCIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzkwMzQ5OTkxMTE3LCJpYXQiOjE3OTAzMDY3OTEyNTN9.F9tX9W34qskrPMnEVkFIoL2Psr9YBxmALrnNJkTvVl8&vercel-blob-signature=iKimE3z7keHCfGX6wz8iE0uJuMSrR7oTj_Rlsj1UZ_Q", alt: "Taem Working_2" },
  { id: 2, src: "https://uwtzrtpvr9dcj5x7.private.blob.vercel-storage.com/about/002.jpg?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfVVdUWlJUUHZyOURjSjV4NyIsIm93bmVySWQiOiJ0ZWFtX3AydEpzYVEzbGtIRXplR0Mya2p0VTVGdCIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzkwMzQ5OTcwNzE2LCJpYXQiOjE3OTAzMDY3NzA4NTR9.sXY5UNndtt5bWdKBLuBb-INZ-fpmrnq3Bq0sRsPxvs0&vercel-blob-signature=ZHLuB-m7pRueUTyAwWCVh26wov40hBEha53wG5dCcCY", alt: "Team Working" },
  { id: 3, src: "https://uwtzrtpvr9dcj5x7.private.blob.vercel-storage.com/about/001.jpg?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfVVdUWlJUUHZyOURjSjV4NyIsIm93bmVySWQiOiJ0ZWFtX3AydEpzYVEzbGtIRXplR0Mya2p0VTVGdCIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzkwMzQ5OTM5NDE1LCJpYXQiOjE3OTAzMDY3Mzk1NDV9.wIfpjOyIj1igN569ljVr1ugLHF6MS8GyyXmDRKDbnU0&vercel-blob-signature=400u6vSJBMLSHt1zpSbcyfK_6Y5qixlzCaevRTxsAT4", alt: "Team Member" }
];

export const Team: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');
  const [api, setApi] = useState<any>();

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
    <section className="py-24 bg-background" id="team">
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
          
          {/* Right Column: Shadcn Carousel with Tooltip */}
          <div className="w-full relative px-4 sm:px-12">
            <TooltipProvider>
              <Carousel 
                setApi={setApi}
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent>
                  {teamImages.map((img) => (
                    <CarouselItem key={img.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div 
                            className="relative aspect-[4/3] sm:aspect-square overflow-hidden rounded-2xl border border-vertex-border shadow-sm cursor-pointer"
                            onClick={() => api?.scrollNext()}
                          >
                            <img 
                              src={img.src} 
                              alt={img.alt} 
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                            />
                            {/* Optional gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className='bg-gold/10'>
                          <p>Click to see next image</p>
                        </TooltipContent>
                      </Tooltip>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden sm:flex -left-4 md:-left-6 lg:-left-10 cursor-pointer" />
                <CarouselNext className="hidden sm:flex -right-4 md:-right-6 lg:-right-10 cursor-pointer" />
              </Carousel>
            </TooltipProvider>
          </div>
          
        </div>
      </div>
    </section>
  );
};