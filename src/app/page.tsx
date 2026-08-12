import React from 'react';
import { cookies } from 'next/headers';

// Landing Page Components
import { Navbar } from '@/app/(external)/landing/_components/nav-bar';
import { Hero } from '@/app/(external)/landing/_components/hero';
import { FeaturedProjects } from '@/app/(external)/landing/_components/featured-projects';
import { CTA } from '@/app/(external)/landing/_components/CTA';
import { OurClients } from '@/app/(external)/landing/_components/client';
import Footer from '@/components/Footer';

// Security & Interactive Components
import { TurnstileGateway } from '@/app/(external)/landing/_components/turnstile-gateway';
import { ContactDialog } from '@/app/(external)/landing/_components/contact-dialog';

export default async function App() {
  // 1. Check if the user has already passed the Turnstile Gateway check
  const cookieStore = await cookies();
  const isVerified = cookieStore.get('verified_human');

  // 2. If they don't have the cookie, show the Gateway widget to verify them
  if (!isVerified?.value) {
    return <TurnstileGateway />;
  }

  // 3. If they have the cookie, render the actual landing page securely
  return (
    <div className="font-sans antialiased text-vertex-fg bg-white overflow-x-hidden selection:bg-[royalblue] selection:text-white">
      <Navbar />
      <Hero />
      <FeaturedProjects />
      <CTA />
      
      {/* ── Contact Section ───────────────────────────────────────────────── */}
      <section className="w-full py-16 md:py-24 bg-slate-50/50">
        <div className="container mx-auto px-4 text-center space-y-6">
          <div className="space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
              Let's Start a Conversation
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Have a question, a project idea, or just want to say hi? Send me a direct message and I'll get back to you shortly.
            </p>
          </div>
          
          <div className="pt-4 flex justify-center">
            {/* The Shadcn Modal Button is rendered here */}
            <ContactDialog />
          </div>
        </div>
      </section>
      {/* ────────────────────────────────────────────────────────────────── */}

      <OurClients />
      <Footer />
    </div>
  );
}