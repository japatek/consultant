'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { 
  Fuel, 
  Pickaxe, 
  Droplet, 
  Settings, 
  Construction, 
  ArrowRight, 
  StrikethroughIcon,
  EllipseIcon,
  Ellipsis
} from 'lucide-react';

import { servicesData } from '../_lib/services-data';
import { translations, Language } from '@/translate/language-data';

const servicesIcons: Record<string, React.ReactNode> = {
  'heavy-machinery': <Fuel size={16} strokeWidth={1.5} />, // Fixed key to match your slug!
  'robotics': <Settings size={16} strokeWidth={1.5} />, // Fixed key to match your slug!
  'structural': <Construction size={16} strokeWidth={1.5}/>,
  'others':<Ellipsis size={16} strokeWidth={1.5}/>
};

export const Services: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [lang, setLang] = useState<Language>('en');

  useEffect(() => {
    const currentLang = (Cookies.get("language") as Language) || 'en';
    setLang(currentLang);
    
    const handleLangChange = (e: any) => {
      if (e.detail) setLang(e.detail as Language);
    };

    // FIXED: Added the missing event listener here!
    window.addEventListener('languageChange', handleLangChange);

    return () => {
      // FIXED: Matched the exact camelCase event name 'languageChange'
      window.removeEventListener('languageChange', handleLangChange);
    };
  }, []);

  const t = translations[lang];
  const current = servicesData[activeTab];

  // Dynamic variables based on current language
  const currentName = lang === 'id' && current.id_name ? current.id_name : current.name;
  const currentDesc = lang === 'id' && current.id_desc ? current.id_desc : current.desc;
  const currentCaps = lang === 'id' && current.id_caps ? current.id_caps : current.caps;

  return (
    <section className="py-24 bg-background" id="services">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between md:items-end mb-10 gap-8">
          <div>
            <div className="text-[11px] font-bold tracking-widest uppercase text-chart-3 mb-2.5">
              {t.ourSectors || t.tagline}
            </div>
            {/* Note: make sure heading1 and heading2 exist in your language-data.ts, or use t.title */}
            <h2 className="font-serif text-3xl md:text-5xl text-foreground tracking-tight leading-none">
              {(t as any).heading1 || "Sectors"}<br />{(t as any).heading2 || "Overview"}
            </h2>
          </div>
          <p className="text-[15px] text-muted-foreground leading-relaxed max-w-[320px] md:text-right">
            {t.subtitle}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] border border-border rounded-[20px] overflow-hidden bg-card shadow-sm">
          {/* Tabs header */}
          <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible border-b lg:border-b-0 lg:border-r border scrollbar-none">
            {servicesData.map((tab, idx) => {
              // Get the correct tab name based on language
              const tabName = lang === 'id' && tab.id_name ? tab.id_name : tab.name;
              
              return (
                <button 
                  key={idx} 
                  onClick={() => setActiveTab(idx)}
                  className={`flex items-center lg:items-center gap-3 p-4 lg:p-4.5 w-full text-left bg-transparent border-0 border-r lg:border-r-0 lg:border-b border last:border-none cursor-pointer transition-all min-w-[150px] lg:min-w-0 flex-col lg:flex-row text-center lg:text-left ${
                    activeTab === idx ? 'bg-[oklch(0.488_0.243_264.376_/_0.05)]' : 'hover:bg-muted'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                    activeTab === idx ? 'bg-primary text-white' : 'bg-muted text-foreground/40'
                  }`}>
                    {servicesIcons[tab.slug] || <Pickaxe size={16} strokeWidth={1.5} />}
                  </div>
                  <span className={`text-sm transition-colors ${
                    activeTab === idx ? 'text-chart-2 font-semibold' : 'text-muted-fg font-medium group-hover:text-foreground/40'
                  }`}>
                    {tabName}
                  </span>
                </button>
              );
            })}
          </div>
          
          {/* Tab content panel */}
          <div className="p-8 md:p-12">
            <div className="font-serif text-3xl text-foreground mb-4 leading-tight">{currentName}</div>
            <div className="text-[15px] text-foreground/40 leading-relaxed mb-8">{currentDesc}</div>
            
            <ul className="list-none grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentCaps.map((cap, cIdx) => (
                <li key={cIdx} className="flex items-center gap-2.5 text-[13px] font-medium text-foreground/40">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></div>
                  {cap}
                </li>
              ))}
            </ul>
            
            <div className="mt-8">
              <Link 
                href={`/landing/services/${current.slug}`} 
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-chart-3 transition-all hover:gap-2.5"
              >
                {t.exploreLink || t.explore} {currentName} 
                <ArrowRight size={14} strokeWidth={1.75} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};