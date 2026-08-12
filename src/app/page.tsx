import React from 'react';
import { cookies } from 'next/headers';
import { Navbar } from '@/app/(external)/landing/_components/nav-bar';
import { Hero } from '@/app/(external)/landing/_components/hero';
import { FeaturedProjects } from '@/app/(external)/landing/_components/featured-projects';
import { CTA } from '@/app/(external)/landing/_components/CTA';
import Footer from '@/components/Footer';
import { OurClients } from '@/app/(external)/landing/_components/client';
import { TurnstileGateway } from '@/app/(external)/landing/_components/turnstile-gateway';

export default async function App() {
  // 1. Check if the user has already passed the Turnstile check
  const cookieStore = await cookies();
  const isVerified = cookieStore.get('verified_human');

  // 2. If they don't have the cookie, show the Gateway widget
  if (!isVerified?.value) {
    return <TurnstileGateway />;
  }

  // 3. If they have the cookie, render the actual landing page
  return (
    <div className="font-sans antialiased text-vertex-fg bg-white overflow-x-hidden selection:bg-[royalblue] selection:text-white">
      <Navbar />
      <Hero />
      <FeaturedProjects />
      <CTA />
      <OurClients />
      <Footer />
    </div>
  );
}