'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import { 
  ClipboardCheck, 
  Briefcase, 
  Layers, 
  FlaskConical, 
  Factory, 
  FileText, 
  Compass, 
  GraduationCap,
  ArrowRight 
} from 'lucide-react';

import { listServices } from '../_lib/services-data';
import { translations, Language } from '@/translate/language-data';

import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const serviceIcons: Record<string, React.ReactNode> = {
  'inspection-condition-assessment': <ClipboardCheck size={18} strokeWidth={1.5} />,
  'project-management': <Briefcase size={18} strokeWidth={1.5} />,
  'structural-analysis-design': <Layers size={18} strokeWidth={1.5} />,
  'laboratory-testing': <FlaskConical size={18} strokeWidth={1.5} />,
  'manufacturing-surveillance': <Factory size={18} strokeWidth={1.5} />,
  'specification-development': <FileText size={18} strokeWidth={1.5} />,
  'drafting-services': <Compass size={18} strokeWidth={1.5} />,
  'technical-training': <GraduationCap size={18} strokeWidth={1.5} />,
};

export const Services: React.FC = () => {
  const pathname = usePathname();
  const isLandingMain = pathname === '/landing';
  const displayedServices = isLandingMain ? listServices.slice(0, 4) : listServices;

  // 1. Setup Language State
  const [lang, setLang] = useState<Language>('en');

  // 2. Listen to Language Changes immediately
  useEffect(() => {
    const currentLang = (Cookies.get("language") as Language) || 'en';
    setLang(currentLang);
    
    const handleLangChange = (e: any) => {
      if (e.detail) setLang(e.detail as Language);
    };

    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  // 3. Load UI translations
  const t = translations[lang];

  return (
    <section className="bg-background" id="services">
      <div className="max-w-7xl mx-auto px-6">
          
          {isLandingMain && (
            <Button asChild variant="ghost" className="text-vertex-primary hover:text-vertex-primary/90 hover:bg-vertex-muted p-0 px-4 h-10 font-semibold gap-1.5 transition-all hover:gap-2.5">
              <Link href="/landing/services">
                {/* Translated "View Core Services" */}
                {t.core}
                <ArrowRight size={14} strokeWidth={1.75} />
              </Link>
            </Button>
          )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
          {displayedServices.map((service, idx) => (
            <Link key={idx} href={`/landing/services/${service.slug}`} className="group block h-full">
              <Card className="h-full border-vertex-border bg-card rounded-2xl p-[26px] transition-all duration-250 relative overflow-hidden hover:shadow-xl hover:-translate-y-1 hover:border-[oklch(0.488_0.243_264.376_/_0.3)] after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-vertex-primary after:scale-x-0 after:origin-left hover:after:scale-x-100 after:transition-transform after:duration-250">
                
                <CardHeader className="p-0 mb-5 space-y-0">
                  <div className="w-10 h-10 rounded-lg bg-vertex-muted text-vertex-primary flex items-center justify-center mb-5 transition-all duration-250 group-hover:bg-chart-1 group-hover:text-white">
                    {serviceIcons[service.slug]}
                  </div>
                  <CardTitle className="font-semibold text-sm text-vertex-fg leading-snug group-hover:text-vertex-primary transition-colors duration-200">
                    {/* Translate Title dynamically */}
                    {lang === 'id' && service.id_title ? service.id_title : service.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-0 space-y-4">
                  <CardDescription className="text-[13px] text-vertex-muted-fg leading-relaxed">
                    {/* Translate Description dynamically */}
                    {lang === 'id' && service.id_desc ? service.id_desc : service.desc}
                  </CardDescription>
                  
                  <div className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-vertex-primary opacity-0 -translate-x-1 transition-all duration-250 group-hover:opacity-100 group-hover:translate-x-0">
                    {/* Translated "Explore" or "Learn More" */}
                    {t.exploreLink}
                    <ArrowRight size={12} strokeWidth={1.75} />
                  </div>
                </CardContent>

              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};