import React from 'react';
import Footer  from '@/components/Footer';
import { Navbar } from '../_components/nav-bar';

export default function SharedPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="font-sans antialiased text-vertex-fg bg-white overflow-x-hidden selection:bg-vertex-primary selection:text-white">
        {children}
      </main>
      <Footer />
    </div>
  );
}