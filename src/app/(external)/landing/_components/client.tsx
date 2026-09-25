'use client';

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Tooltip } from 'radix-ui';
import { translations, Language } from '@/translate/language-data';

// Client data with added 'url' properties
const BLOB_BASE = "https://zrag0isxqbcebeen.public.blob.vercel-storage.com";

const clients = [
  {
    name: 'PLN Indonesia Power',
    logo: `${BLOB_BASE}/client/ip.png`,
    url:  'https://www.plnindonesiapower.co.id/'
  },
  {
    name: 'PT Sandesign Cipta Teknika',
    logo: `${BLOB_BASE}/client/sandi.png`,
    url:  'https://www.linkedin.com/in/sandesign-ct-27aa45308/?locale=en'
  },
  {
    name: 'LPP Agro Nusantara',
    logo: `${BLOB_BASE}/client/lpp.png`,
    url:  'https://lpp.co.id/'
  },
  {
    name: 'PT Tensor Sinergi Indonesia',
    logo: `${BLOB_BASE}/client/tensor.png`,
    url:  'https://pttensor.com/'
  },
];

export const OurClients: React.FC = () => {
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
    <section className="py-20 bg-emerald-800 relative border-t border-white/10" id="clients">
      {/* Background subtle glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-[radial-gradient(ellipse,rgba(244,63,94,0.25)_0%,transparent_70%)] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-[1px] bg-primary"></div>
            <span className="text-[11px] font-bold tracking-widest uppercase text-white/60">
              {t.clientTag}
            </span>
            <div className="w-8 h-[1px] bg-primary"></div>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl text-white tracking-tight">
            {t.titlePrefix}<span className="italic text-chart-3">{t.titleHighlight}</span>
          </h2>
        </div>

        {/* Client Logos Flex Container - Always centered regardless of count */}

        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 lg:gap-16">
          {clients.map((client, idx) => (
            <Tooltip.Provider key={idx}>
              <Tooltip.Root>
                <Tooltip.Trigger>
                  <a
                    href={client.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${client.name} website`}
                    className="flex items-center justify-center group h-24 md:h-28 px-4 cursor-pointer transition-all duration-300"
                  >
                    {/* Logo: Increased size constraints */}
                    <img
                      src={client.logo}
                      alt={`${client.name} logo`}
                      className="max-h-16 md:max-h-20 w-auto max-w-[160px] md:max-w-[200px] object-contain opacity-60 grayscale transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-110"
                    />
                  </a>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content className="TooltipContent bg-gold/50 rounded-sm p-1" sideOffset={2}>
                    {client.name}
                    <Tooltip.Arrow className="bg-primary fill-primary" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          ))}
        </div>

        {/* Optional text or link below logos */}
        <div className="mt-12 text-center">
          <p className="text-sm text-white/40">
            {t.footerText}
          </p>
        </div>
      </div>
    </section>
  );
};