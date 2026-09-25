'use client'; 

import React, { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Cookies from 'js-cookie'; 

import { Navbar } from '../../../_components/nav-bar';
import { ChildHero } from '../../../_components/child-hero';
import { Services } from '../../../_components/services';
import { FeaturedProjects } from '../../../_components/featured-projects';

// Data imports
import { featuredProjects } from '../../../_lib/featured-projects-data';
import { servicesData } from '../../../_lib/services-data';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const desc = "JaPaTek Solution";

interface PageProps {
  params: Promise<{
    type: string;
    slug?: string[];
  }>;
}

// Sub-component that handles media fallback & controlled tooltip behavior
function SlideshowItem({
  baseUrl,
  mainSlug,
  index,
  lang,
  api,
}: {
  baseUrl: string;
  mainSlug: string | null;
  index: number;
  lang: string;
  api: any;
}) {
  const [isVideoError, setIsVideoError] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const mp4Url = `${baseUrl}.mp4`;
  const jpgUrl = `${baseUrl}.jpg`;

  // Automatically dismiss the tooltip as soon as the carousel begins sliding
  useEffect(() => {
    if (!api) return;

    const handleSlideChange = () => {
      setTooltipOpen(false);
    };

    api.on('select', handleSlideChange);
    api.on('scroll', handleSlideChange);

    return () => {
      api.off('select', handleSlideChange);
      api.off('scroll', handleSlideChange);
    };
  }, [api]);

  return (
    <CarouselItem>
      <Dialog>
        <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
          <DialogTrigger asChild>
            <TooltipTrigger asChild>
              <div className="p-1 cursor-pointer focus:outline-none">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-vertex-border bg-muted shadow-md group">
                  {!isVideoError ? (
                    <video
                      src={mp4Url}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
                      autoPlay
                      muted
                      loop
                      playsInline
                      onError={() => setIsVideoError(true)}
                    />
                  ) : (
                    <img
                      src={jpgUrl}
                      alt={`Slideshow ${mainSlug} ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                </div>
              </div>
            </TooltipTrigger>
          </DialogTrigger>

          <TooltipContent className="bg-gold/10 pointer-events-none">
            <p>{lang === 'id' ? 'Klik untuk memperbesar media' : 'Click to view full media'}</p>
          </TooltipContent>
        </Tooltip>

        <DialogContent className="!max-w-[95vw] !w-[95vw] h-[90vh] md:h-[95vh] p-2 md:p-8 bg-background/5 backdrop-blur border-none shadow-2xl rounded-xl flex items-center justify-center overflow-hidden">
          <DialogTitle className="sr-only">Full Media View</DialogTitle>
          <DialogDescription className="sr-only">
            A full screen view of the selected project media.
          </DialogDescription>

          <div className="relative w-full h-full flex items-center justify-center">
            {!isVideoError ? (
              <video
                src={mp4Url}
                className="w-full h-full object-contain drop-shadow-lg"
                controls
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <img
                src={jpgUrl}
                alt={`Full view ${mainSlug} ${index + 1}`}
                className="w-full h-full object-contain drop-shadow-lg"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </CarouselItem>
  );
}

export default function CombinedDynamicPage({ params }: PageProps) {
  const { type, slug } = React.use(params);
  const [lang, setLang] = useState<string>('en');
  const [api, setApi] = useState<any>();

  useEffect(() => {
    const currentLang = Cookies.get("language") || 'en';
    setLang(currentLang);

    const handleLangChange = (e: any) => {
      if (e.detail) setLang(e.detail);
    };

    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  const allowedTypes = ['services', 'project'];
  if (!allowedTypes.includes(type)) {
    notFound();
  }

  const isIndexPage = !slug || slug.length === 0;
  const isSubLevel1 = slug && slug.length === 1;
  const isSubLevel2 = slug && slug.length === 2;

  const mainSlug = slug ? slug[0] : null;
  const subSlug = slug && slug.length > 1 ? slug[1] : null;

  // PERBAIKAN: Ubah 'sec' menjadi 'services'
  const project = type === 'project' && mainSlug ? featuredProjects.find((proj) => proj.slug === mainSlug) : null;
  const service = type === 'services' && mainSlug ? servicesData.find((sec) => sec.slug === mainSlug) : null;

  let pageTitle = mainSlug?.replace('-', ' ') || '';
  let pageDescription = desc;

  // PERBAIKAN: service sudah dikenali, tipe any bisa dihapus (opsional tapi lebih bersih)
  if (type === 'project' && project) {
    pageTitle = (lang === 'id' && (project as any).id_title) ? (project as any).id_title : project.title;
    pageDescription = (lang === 'id' && (project as any).id_extend_desc) ? (project as any).id_extend_desc : project.extend_desc;
  } else if (type === 'services' && service) {
    pageTitle = (lang === 'id' && service.id_name) ? service.id_name : service.name;
    pageDescription = (lang === 'id' && service.id_extend_desc) ? service.id_extend_desc : service.extend_desc;
  }

  const formattedSlug = mainSlug ? mainSlug.toLowerCase() : 'default';

  // Base URLs without extensions (1, 2, 3...)
  // REFORMAT: Changed old AWS domain to new generic blob storage endpoint.
  // Replace 'https://cdn.ja-pa-tek.com' with your actual new blob storage endpoint.
 const slideshowBaseUrls = [1, 2, 3].map(
    (index) => `https://uwtzrtpvr9dcj5x7.public.blob.vercel-storage.com/${mainSlug}/${formattedSlug}-${index}`
  );

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

      <ChildHero title={heroTitle} titledesc={heroTitleDesc} description={desc} />

      <main className="mx-auto py-16">
        {isIndexPage && (
          <>
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
                    {slideshowBaseUrls.map((baseUrl, index) => (
                      <SlideshowItem
                        key={index}
                        baseUrl={baseUrl}
                        mainSlug={mainSlug}
                        index={index}
                        lang={lang}
                        api={api}
                      />
                    ))}
                  </CarouselContent>
                  
                  <CarouselPrevious className="cursor-pointer md:inline-flex -left-12" />
                  <CarouselNext className="cursor-pointer md:inline-flex -right-12" />
                </Carousel>
              </TooltipProvider>
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