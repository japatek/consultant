'use client'
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Project {
  tag: string;
  title: string;
  desc: string;
  slug: string;
  media: {
    type: 'image' | 'video';
    url: string;
    alt?: string;
  };
}

export const FeaturedProjects: React.FC = () => {
  const projects: Project[] = [
    {
      tag: "Mining",
      title: "Olympic Dam Processing Facility Assessment",
      desc: "Comprehensive structural integrity assessment of GRP/FRP processing vessels at a major copper-uranium operation, including FEA analysis of critical support structures and nozzle load cases.",
      slug: "olympic-dam-assessment",
      media: {
        type: 'image',
        url: 'https://japa-media-062995001999-ap-southeast-1-an.s3.ap-southeast-1.amazonaws.com/projects/olympic-dam-assessment.jpg',
        alt: 'Olympic Dam Processing Facility'
      }
    },
    {
      tag: "Water",
      title: "Regional Water Treatment Plant Upgrade",
      desc: "Detailed structural design and project management for a major water treatment plant capacity expansion, increasing throughput by 40% to serve a growing regional municipality.",
      slug: "regional-water-upgrade",
      media: {
        type: 'image',
        url: 'https://japa-media-062995001999-ap-southeast-1-an.s3.ap-southeast-1.amazonaws.com/projects/water-plant-timelapse.mp4'
      }
    },
    {
      tag: "Robotics",
      title: "Pharmacy Vending Machine",
      desc: "Full structural condition assessment and remaining service life analysis for an offshore production platform, utilising advanced NDE techniques and drone-assisted access for hard-to-reach areas.",
      slug: "vending-machine",
      media: {
        type: 'image',
        url: 'https://d2tbt8ofproiin.cloudfront.net/Vending-Machine/vending-machine-1.jpg',
        alt: 'Offshore Platform Assessment Drone View'
      }
    }
  ];

  return (
    <section className="py-24 bg-card/80" id="projects">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-end mb-10">
          <div>
            <div className="text-[11px] font-bold tracking-widest uppercase text-chart-3 mb-2.5">Featured Projects</div>
            <h2 className="font-serif text-3xl md:text-5xl text-vertex-fg tracking-tight leading-none">Our work in the field</h2>
          </div>
          
          <Button asChild variant="ghost" className="text-vertex-primary hover:text-vertex-primary/90 hover:bg-vertex-muted p-0 px-4 h-10 font-semibold gap-1.5 transition-all hover:gap-2.5 mt-4 sm:mt-0">
            <Link href="/landing/project">
              All projects
              <ArrowRight size={14} strokeWidth={1.75} />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((proj, idx) => (
            <Link key={idx} href={`/landing/project/${proj.slug}`} className="group block h-full">
              <Card className="h-full border-vertex-border bg-card rounded-2xl overflow-hidden transition-all duration-250 hover:shadow-xl hover:-translate-y-1">
                
                <div className="h-[190px] relative overflow-hidden flex items-center justify-center bg-slate-900">
                  <Badge className="absolute top-4 left-4 bg-vertex-primary hover:bg-vertex-primary/90 text-white text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full z-20 border-none">
                    {proj.tag}
                  </Badge>
                  
                  {proj.media.type === 'image' ? (
                    <Image 
                      src={proj.media.url}
                      alt={proj.media.alt || proj.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105 z-0"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      unoptimized // Bypasses Next.js server processing
                      loading="lazy" // Defers loading until image is near viewport
                    />
                  ) : (
                    <video 
                      src={proj.media.url}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata" // Helps with caching the video metadata
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 z-0"
                    />
                  )}
                  
                  <div className="absolute inset-0 bg-black/10 z-10 transition-opacity duration-300 group-hover:opacity-0" />
                </div>

                <CardHeader className="p-6 pb-0 space-y-0">
                  <CardTitle className="font-bold text-[16px] text-vertex-fg mb-2.5 leading-snug group-hover:text-vertex-primary transition-colors duration-200">
                    {proj.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-6 pt-0">
                  <CardDescription className="text-[13px] text-vertex-muted-fg leading-relaxed">
                    {proj.desc}
                  </CardDescription>
                  
                  <div className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-vertex-primary mt-[18px] transition-all group-hover:gap-2.5">
                    Read case study 
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