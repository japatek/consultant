'use client'
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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

// Import komponen Shadcn UI
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ServiceItem {
  icon: React.ReactNode;
  title: string;
  desc: string;
  slug: string;
}

export const Services: React.FC = () => {
  const pathname = usePathname();

  const listServices: ServiceItem[] = [
    {
      title: 'Inspection & Condition Assessment',
      desc: 'Comprehensive site inspections assessing structural integrity of assets, translated into detailed technical condition reports with prioritised recommendations.',
      icon: <ClipboardCheck size={18} strokeWidth={1.5} />,
      slug: 'inspection-condition-assessment'
    },
    {
      title: 'Project Management',
      desc: 'Full turnkey project management from inception through to delivery, ensuring on-time and on-budget outcomes with transparent client communication throughout.',
      icon: <Briefcase size={18} strokeWidth={1.5} />,
      slug: 'project-management'
    },
    {
      title: 'Structural Analysis & Design',
      desc: 'Advanced FEA and structural design using proven methodologies to resolve complex engineering challenges across all material types and structural configurations.',
      icon: <Layers size={18} strokeWidth={1.5} />,
      slug: 'structural-analysis-design'
    },
    {
      title: 'Laboratory Testing',
      desc: 'Accredited laboratory facilities enabling our engineers to deliver detailed reports outlining valuable equipment data for informed asset management decisions.',
      icon: <FlaskConical size={18} strokeWidth={1.5} />,
      slug: 'laboratory-testing'
    },
    {
      title: 'Manufacturing Surveillance',
      desc: 'Factory surveillance and compliance verification ensuring all manufacturing processes meet relevant codes, standards, and client specifications from the outset.',
      icon: <Factory size={18} strokeWidth={1.5} />,
      slug: 'manufacturing-surveillance'
    },
    {
      title: 'Specification Development',
      desc: 'Comprehensive specification development to eliminate common issues arising from insufficient technical documentation, protecting your project from costly disputes.',
      icon: <FileText size={18} strokeWidth={1.5} />,
      slug: 'specification-development'
    },
    {
      title: 'Drafting Services',
      desc: 'Full drafting services delivering native files for seamless integration into client design workflows, with precision documentation meeting all relevant standards.',
      icon: <Compass size={18} strokeWidth={1.5} />,
      slug: 'drafting-services'
    },
    {
      title: 'Technical Training',
      desc: 'Specialised training programs teaching correct installation and maintenance techniques for optimum performance, delivered by our senior engineering staff.',
      icon: <GraduationCap size={18} strokeWidth={1.5} />,
      slug: 'technical-training'
    }
  ];

  const isLandingMain = pathname === '/landing';
  const displayedServices = isLandingMain ? listServices.slice(0, 4) : listServices;

  return (
    <section className="bg-background" id="services">
      <div className="max-w-7xl mx-auto px-6">
        {/* <div className="flex flex-col sm:flex-row justify-between sm:items-end mb-10 gap-8"> */}
          
          {/* Menggunakan Shadcn Button dengan prop asChild agar menyatu dengan Next.js Link */}
          {isLandingMain && (
            <Button asChild variant="ghost" className="text-vertex-primary hover:text-vertex-primary/90 hover:bg-vertex-muted p-0 px-4 h-10 font-semibold gap-1.5 transition-all hover:gap-2.5">
              <Link href="/landing/services">
                View all services
                <ArrowRight size={14} strokeWidth={1.75} />
              </Link>
            </Button>
          )}
        {/* </div> */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {displayedServices.map((service, idx) => (
            <Link key={idx} href={`/landing/services/${service.slug}`} className="group block h-full">
              {/* Implementasi Shadcn Card dengan penyesuaian utility classes Anda */}
              <Card className="h-full border-vertex-border bg-card rounded-2xl p-[26px] transition-all duration-250 relative overflow-hidden hover:shadow-xl hover:-translate-y-1 hover:border-[oklch(0.488_0.243_264.376_/_0.3)] after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-vertex-primary after:scale-x-0 after:origin-left hover:after:scale-x-100 after:transition-transform after:duration-250">
                
                <CardHeader className="p-0 mb-5 space-y-0">
                  <div className="w-10 h-10 rounded-lg bg-vertex-muted text-vertex-primary flex items-center justify-center mb-5 transition-all duration-250 group-hover:bg-chart-1 group-hover:text-white">
                    {service.icon}
                  </div>
                  <CardTitle className="font-semibold text-sm text-vertex-fg leading-snug group-hover:text-vertex-primary transition-colors duration-200">
                    {service.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-0 space-y-4">
                  <CardDescription className="text-[13px] text-vertex-muted-fg leading-relaxed">
                    {service.desc}
                  </CardDescription>
                  
                  <div className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-vertex-primary opacity-0 -translate-x-1 transition-all duration-250 group-hover:opacity-100 group-hover:translate-x-0">
                    Learn more
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