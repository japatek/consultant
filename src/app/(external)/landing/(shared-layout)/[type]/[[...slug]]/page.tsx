import React from 'react';
import { notFound } from 'next/navigation';

import { Navbar } from '../../../_components/nav-bar';
import { ChildHero } from '../../../_components/child-hero';
import { Sectors } from '../../../_components/sectors';
import { Services } from '../../../_components/services';
import { FeaturedProjects } from '../../../_components/featured-projects';

// Import Shadcn UI Carousel components
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const desc = "Lorem ipsum dolor sit amet, consectetur adipiscing elit...";

// Configuration for CloudFront Domain (Fallback to placeholder if env not set)
const CLOUDFRONT_BASE_URL = process.env.MEDIA_URL || "https://d2tbt8ofproiin.cloudfront.net";

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

  // 2. Dynamically construct 3 CloudFront image URLs based on mainSlug
  // Example: "Vending-Machine" -> "vending-machine"
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
      heroTitle = `Service: ${mainSlug?.replace('-', ' ')}`;
      heroTitleDesc = 'Technical specifications of our main engineering service.';
    } else if (isSubLevel2) {
      heroTitle = `${subSlug?.replace('-', ' ')}`;
      heroTitleDesc = `Specialized division under ${mainSlug?.replace('-', ' ')}.`;
    }
  } else {
    heroTitle = type.toUpperCase();
    heroTitleDesc = `Overview of ${type}`;
  }

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
                Level 1: {type} Detail
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground capitalize">
                {mainSlug?.replace('-', ' ')}
              </h2>
              <p className="text-[15px] text-muted-foreground leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sit amet elementum neque, vitae sodales augue. Nam sed lorem ornare dui vulputate rhoncus. Integer suscipit libero non odio interdum sagittis. Phasellus pretium lobortis ipsum, sed finibus justo. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. 
              </p>
              <p className="text-[15px] text-muted-foreground leading-relaxed">
                Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Quisque ac mauris posuere, tristique erat et, congue lectus.
              </p>
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
              Ini adalah halaman sub-spesifik baru Anda. Berada di dalam grup: <strong className="capitalize">{mainSlug}</strong>.
            </p>
          </div>
        )}
      </main>

      {/* Parent Footer Layout */}
      <FeaturedProjects />
    </div>
  );
}