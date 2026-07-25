import React from 'react';
import { Navbar } from '../../_components/nav-bar';
import { ChildHero } from '../../_components/child-hero';
import { AboutUs } from '../../_components/aboutus';
import { FeaturedProjects } from '../../_components/featured-projects';
import { CTA } from '../../_components/CTA';
import Footer  from '@/components/Footer';
import { OurClients } from '../../_components/client';

const desc = "Merging deep physical engineering design with cutting-edge AI tools and computational modeling. From detailed 3D CAD modeling and finite element analysis (FEA) to AI-assisted design optimization and automated inspection workflows, we empower industrial projects with faster execution, uncompromised safety, and exact technical execution."
export default function AboutPage() {
  return(
      <div className="font-sans antialiased text-vertex-fg bg-white overflow-x-hidden selection:bg-[royalblue] selection:text-white">
      <Navbar />
      <ChildHero title= 'About' titledesc= 'About Us' description={desc} />
      <AboutUs/>
      <FeaturedProjects />
      <OurClients/>
      <CTA />
      <Footer />
    </div>
  )
}