'use client'
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
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
import { featuredProjects } from "../_lib/featured-projects-data";

export const FeaturedProjects: React.FC = () => {
  const pathname = usePathname();
  const isProjectListPage = pathname === '/landing/project';

  const projects = featuredProjects;

  // Show only 3 projects if not on the main project listing page
  const displayedProjects = isProjectListPage ? projects : projects.slice(0, 3);

  return (
    <section className="py-24 bg-card/80" id="projects">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-end mb-10">
          <div>
            <div className="text-[11px] font-bold tracking-widest uppercase text-chart-3 mb-2.5">Featured Projects</div>
            <h2 className="font-serif text-3xl md:text-5xl text-vertex-fg tracking-tight leading-none">Our work in the field</h2>
          </div>
          
          {/* Only render "All projects" button if NOT on /landing/project */}
          {!isProjectListPage && (
            <Button asChild variant="ghost" className="text-vertex-primary hover:text-vertex-primary/90 hover:bg-vertex-muted p-0 px-4 h-10 font-semibold gap-1.5 transition-all hover:gap-2.5 mt-4 sm:mt-0">
              <Link href="/landing/project">
                All projects
                <ArrowRight size={14} strokeWidth={1.75} />
              </Link>
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayedProjects.map((proj, idx) => (
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
                      unoptimized
                      loading="lazy"
                    />
                  ) : (
                    <video 
                      src={proj.media.url}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
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