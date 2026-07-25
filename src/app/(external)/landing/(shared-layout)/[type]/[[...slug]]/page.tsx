import React from 'react';
import { notFound } from 'next/navigation';

import { Navbar } from '../../../_components/nav-bar';
import { ChildHero } from '../../../_components/child-hero';
import { Sectors } from '../../../_components/sectors';
import { Services } from '../../../_components/services';
import { FeaturedProjects } from '../../../_components/featured-projects';

// Data imports
import { featuredProjects } from '../../../_lib/featured-projects-data';
import { listServices } from '../../../_lib/services-data';
import { sectorData } from '../../../_lib/sectors-data'; // <-- Adjust this path to where you saved the sector array

// Import Shadcn UI Carousel components
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const desc = "Lorem ipsum dolor sit amet, consectetur adipiscing elit...";

interface PageProps {
  params: Promise<{
    type: string;
    slug?: string[]; // Catches ['sub-1', 'sub-2', etc.]
  }>;
}

export default async function CombinedDynamicPage({ params }: PageProps) {
  const { type, slug } = await params;

  // 1. URL Validation
  const allowedTypes = ['sector', 'services', 'project'];
  if (!allowedTypes.includes(type)) {
    notFound();
  }

  // Determine URL depth levels
  const isIndexPage = !slug || slug.length === 0;       // /landing/services
  const isSubLevel1 = slug && slug.length === 1;        // /landing/project/Vending-Machine
  const isSubLevel2 = slug && slug.length === 2;        // /landing/services/civil/structural

  const mainSlug = slug ? slug[0] : null;
  const subSlug = slug && slug.length > 1 ? slug[1] : null;
  
  // Find matching data based on the type
  const project = type === 'project' && mainSlug ? featuredProjects.find((proj) => proj.slug === mainSlug) : null;
  const service = type === 'services' && mainSlug ? listServices.find((item) => item.slug === mainSlug) : null;
  const sector = type === 'sector' && mainSlug ? sectorData.find((sec) => sec.slug === mainSlug) : null;

  // Dynamically set title and description (prioritizing extend_desc)
  const pageTitle = project?.title ?? service?.title ?? sector?.name ?? mainSlug?.replace('-', ' ');
  const pageDescription = project?.extend_desc ?? service?.extend_desc ?? sector?.extend_desc ??
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sit amet elementum neque, vitae sodales augue. Nam sed lorem ornare dui vulputate rhoncus. Integer suscipit libero non odio interdum sagittis. Phasellus pretium lobortis ipsum, sed finibus justo. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.';

  // 2. Dynamically construct 3 CloudFront image URLs based on mainSlug
  const formattedSlug = mainSlug ? mainSlug.toLowerCase() : 'default';

  // Generates 3 URLs: .../vending-machine-1.jpg, -2.jpg, -3.jpg
  const slideshowImages = [1, 2, 3].map(
    (index) => `https://d2tbt8ofproiin.cloudfront.net/${mainSlug}/${formattedSlug}-${index}.jpg`
  );

  // 3. Set dynamic Hero Banner titles
  let heroTitle = '';
  let heroTitleDesc = '';

  if (type === 'services') {
    if (isIndexPage) {
      heroTitle = 'Services';
      heroTitleDesc = 'All services we are provided.';
    } else if (isSubLevel1) {
      heroTitle = `Service: ${pageTitle}`;
      heroTitleDesc = 'Technical specifications of our main engineering service.';
    } else if (isSubLevel2) {
      heroTitle = `${subSlug?.replace('-', ' ')}`;
      heroTitleDesc = `Specialized division under ${pageTitle}.`;
    }
  } else if (type === 'sector') {
    if (isIndexPage) {
      heroTitle = 'Sectors';
      heroTitleDesc = 'Industries we serve.';
    } else if (isSubLevel1) {
      heroTitle = `Sector: ${pageTitle}`;
      heroTitleDesc = 'Specialized engineering support for this industry.';
    }
  } else {
    heroTitle = type.toUpperCase();
    heroTitleDesc = `Overview of ${type}`;
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

      {/* Main Content Body */}
      <main className="mx-auto py-16">
        {isIndexPage && (
          <>
            {type === 'sector' && <Sectors />}
            {type === 'services' && <Services />}
          </>
        )}

        {/* LEVEL 1: Detail with Text & Dynamic CloudFront Slideshow */}
        {isSubLevel1 && (
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Column 1: Text Description */}
            <div className="space-y-4">            
              <span className="text-xs font-bold uppercase tracking-widest text-chart-3">
                {type} Detail
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground capitalize">
                {pageTitle}
              </h2>
              <div>{renderDescription(pageDescription)}</div>
            </div>
            
            {/* Column 2: Dynamic CloudFront Carousel */}
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
                {/* Carousel Navigation Buttons */}
                <CarouselPrevious className="cursor-pointer md:inline-flex -left-12" />
                <CarouselNext className="cursor-pointer md:inline-flex -right-12" />
              </Carousel>
            </div>

          </div>
        )}

        {/* LEVEL 2: Sub-Specialization */}
        {isSubLevel2 && (
          <div className="bg-rose-50/50 p-8 rounded-2xl border border-rose-100 max-w-4xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-rose-600">Level 2: Sub-Spesialisasi</span>
            <h2 className="text-2xl font-bold text-slate-900 mt-2 capitalize">{subSlug?.replace('-', ' ')}</h2>
            <p className="mt-4 text-slate-600">
              Ini adalah halaman sub-spesifik baru Anda. Berada di dalam grup: <strong className="capitalize">{pageTitle}</strong>.
            </p>
          </div>
        )}
      </main>

      {/* Parent Footer Layout */}
      <FeaturedProjects />
    </div>
  );
}