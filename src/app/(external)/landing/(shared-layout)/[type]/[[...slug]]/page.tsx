'use client'; // <-- Changed to a Client Component!

import React, { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Cookies from 'js-cookie'; // <-- Using js-cookie instead of next/headers

import { Navbar } from '../../../_components/nav-bar';
import { ChildHero } from '../../../_components/child-hero';
import { Sectors } from '../../../_components/sectors';
import { Services } from '../../../_components/services';
import { FeaturedProjects } from '../../../_components/featured-projects';

// Data imports
import { featuredProjects } from '../../../_lib/featured-projects-data';
import { listServices } from '../../../_lib/services-data';
import { sectorData } from '../../../_lib/sectors-data';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const desc = "JaPaTek Solution";

interface PageProps {
  params: Promise<{
    type: string;
    slug?: string[]; 
  }>;
}

export default function CombinedDynamicPage({ params }: PageProps) {
  // 1. Unwrap the params Promise (Next.js 15 Client Component rule)
  const { type, slug } = React.use(params);

  // 2. Setup Instant Language Listener
  const [lang, setLang] = useState<string>('en');

  useEffect(() => {
    const currentLang = Cookies.get("language") || 'en';
    setLang(currentLang);
    
    const handleLangChange = (e: any) => {
      if (e.detail) setLang(e.detail);
    };

    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  // URL Validation
  const allowedTypes = ['sector', 'services', 'project'];
  if (!allowedTypes.includes(type)) {
    notFound();
  }

  const isIndexPage = !slug || slug.length === 0;       
  const isSubLevel1 = slug && slug.length === 1;        
  const isSubLevel2 = slug && slug.length === 2;        

  const mainSlug = slug ? slug[0] : null;
  const subSlug = slug && slug.length > 1 ? slug[1] : null;
  
  const project = type === 'project' && mainSlug ? featuredProjects.find((proj) => proj.slug === mainSlug) : null;
  const service = type === 'services' && mainSlug ? listServices.find((item) => item.slug === mainSlug) : null;
  const sector = type === 'sector' && mainSlug ? sectorData.find((sec) => sec.slug === mainSlug) : null;

  // 3. Dynamically set title and description based on LANGUAGE
  let pageTitle = mainSlug?.replace('-', ' ') || '';
  let pageDescription = desc;

  if (type === 'project' && project) {
    pageTitle = (lang === 'id' && (project as any).id_title) ? (project as any).id_title : project.title;
    pageDescription = (lang === 'id' && (project as any).id_extend_desc) ? (project as any).id_extend_desc : project.extend_desc;
  } else if (type === 'services' && service) {
    pageTitle = (lang === 'id' && (service as any).id_title) ? (service as any).id_title : service.title;
    pageDescription = (lang === 'id' && (service as any).id_extend_desc) ? (service as any).id_extend_desc : service.extend_desc;
  } else if (type === 'sector' && sector) {
    pageTitle = (lang === 'id' && (sector as any).id_name) ? (sector as any).id_name : sector.name;
    pageDescription = (lang === 'id' && (sector as any).id_extend_desc) ? (sector as any).id_extend_desc : sector.extend_desc;
  }

  const formattedSlug = mainSlug ? mainSlug.toLowerCase() : 'default';
  const slideshowImages = [1, 2, 3].map(
    (index) => `https://d2tbt8ofproiin.cloudfront.net/${mainSlug}/${formattedSlug}-${index}.jpg`
  );

  // 4. Set dynamic Hero Banner titles based on LANGUAGE
  let heroTitle = '';
  let heroTitleDesc = '';

  if (type === 'services') {
    if (isIndexPage) {
      heroTitle = lang === 'id' ? 'Layanan' : 'Services';
      heroTitleDesc = lang === 'id' ? 'Semua layanan yang kami sediakan.' : 'All services we are provided.';
    } else if (isSubLevel1) {
      heroTitle = lang === 'id' ? `Layanan: ${pageTitle}` : `Service: ${pageTitle}`;
      heroTitleDesc = lang === 'id' ? 'Spesifikasi teknis dari layanan teknik utama kami.' : 'Technical specifications of our main engineering service.';
    } else if (isSubLevel2) {
      heroTitle = `${subSlug?.replace('-', ' ')}`;
      heroTitleDesc = lang === 'id' ? `Divisi khusus di bawah ${pageTitle}.` : `Specialized division under ${pageTitle}.`;
    }
  } else if (type === 'sector') {
    if (isIndexPage) {
      heroTitle = lang === 'id' ? 'Sektor' : 'Sectors';
      heroTitleDesc = lang === 'id' ? 'Industri yang kami layani.' : 'Industries we serve.';
    } else if (isSubLevel1) {
      heroTitle = lang === 'id' ? `Sektor: ${pageTitle}` : `Sector: ${pageTitle}`;
      heroTitleDesc = lang === 'id' ? 'Dukungan teknik khusus untuk industri ini.' : 'Specialized engineering support for this industry.';
    }
  } else {
    heroTitle = type.toUpperCase();
    heroTitleDesc = lang === 'id' ? `Gambaran umum tentang ${type}` : `Overview of ${type}`;
  }

  const renderDescription = (text: string) => {
    return text
      .trim()
      .split(/\n\s*\n/)
      .filter(Boolean)
      .map((paragraph, index) => {
        const lines = paragraph.split(/\n/).map((line) => line.trim()).filter(Boolean);
        const bulletLines = lines.filter((line) => line.startsWith('•'));
        const introLines = lines.filter((line) => !line.startsWith('•'));

        return (
          <div key={index} className="space-y-4">
            {introLines.length > 0 && (
              <p className="text-[15px] text-muted-foreground leading-relaxed pl-8">
                {introLines.join(' ')}
              </p>
            )}
            {bulletLines.length > 0 && (
              <ul className="list-disc pl-8 ml-6 text-[15px] text-muted-foreground leading-relaxed space-y-2">
                {bulletLines.map((line, itemIndex) => (
                  <li key={itemIndex}>{line.replace(/^•\s*/, '')}</li>
                ))}
              </ul>
            )}
          </div>
        );
      });
  };

  return (
    <div className="font-sans antialiased text-vertex-fg bg-background overflow-x-hidden">
      <Navbar />
      
      {/* 5. The ChildHero now gets instantly updated strings whenever the toggle is clicked! */}
      <ChildHero title={heroTitle} titledesc={heroTitleDesc} description={desc} />

      <main className="mx-auto py-16">
        {isIndexPage && (
          <>
            {type === 'sector' && <Sectors />}
            {type === 'services' && <Services />}
          </>
        )}

        {isSubLevel1 && (
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">            
              <span className="text-xs font-bold uppercase tracking-widest text-chart-3">
                {lang === 'id' ? `Detail ${type}` : `${type} Detail`}
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground capitalize">
                {pageTitle}
              </h2>
              <div>{renderDescription(pageDescription)}</div>
            </div>
            
            <div className="w-full flex justify-center items-center px-4 md:px-10">            
              <Carousel className="w-full max-w-md md:max-w-xl">
                <CarouselContent>
                  {slideshowImages.map((src, index) => (
                    <CarouselItem key={index}>
                      <div className="p-1">
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-vertex-border bg-muted shadow-md group">
                          <img 
                            src={src} 
                            alt={`Slideshow ${mainSlug} ${index + 1}`}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="cursor-pointer md:inline-flex -left-12" />
                <CarouselNext className="cursor-pointer md:inline-flex -right-12" />
              </Carousel>
            </div>
          </div>
        )}

        {isSubLevel2 && (
          <div className="bg-rose-50/50 p-8 rounded-2xl border border-rose-100 max-w-4xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-rose-600">
              {lang === 'id' ? 'Level 2: Sub-Spesialisasi' : 'Level 2: Sub-Specialization'}
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-2 capitalize">{subSlug?.replace('-', ' ')}</h2>
            <p className="mt-4 text-slate-600">
              {lang === 'id' 
                ? <>Ini adalah halaman sub-spesifik baru Anda. Berada di dalam grup: <strong className="capitalize">{pageTitle}</strong>.</>
                : <>This is your new sub-specific page. Located inside group: <strong className="capitalize">{pageTitle}</strong>.</>
              }
            </p>
          </div>
        )}
      </main>

      <FeaturedProjects />
    </div>
  );
}