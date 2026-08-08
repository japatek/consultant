import React from 'react';
import { Navbar } from '@/app/(external)/landing/_components/nav-bar';
import { Hero } from '@/app/(external)/landing/_components/hero';
import { FeaturedProjects } from '@/app/(external)/landing/_components/featured-projects';
import { CTA } from '@/app/(external)/landing/_components/CTA';
import Footer from '@/components/Footer';
import { OurClients } from '@/app/(external)/landing/_components/client';


export default function App() {
  return (

    <div className="font-sans antialiased text-vertex-fg bg-white overflow-x-hidden selection:bg-[royalblue] selection:text-white">
      <Navbar />
      <Hero />
      <FeaturedProjects />
      <CTA />
      <OurClients />
      <Footer />
    </div>

  )
}