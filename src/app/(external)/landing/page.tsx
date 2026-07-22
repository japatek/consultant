import React from 'react';
import { Navbar } from './_components/nav-bar';
import { Hero } from './_components/hero';
import { FeaturedProjects } from './_components/featured-projects';
import { CTA } from './_components/CTA';
import Footer  from '@/components/Footer';
import { OurClients } from './_components/client';


export default function App() {
  return(
      <div className="font-sans antialiased text-vertex-fg bg-white overflow-x-hidden selection:bg-vertex-primary selection:text-white">
      <Navbar />
      <Hero />
      <FeaturedProjects />
      <OurClients/>
      <CTA />
      <Footer />
    </div>
  )
}