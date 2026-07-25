'use client'
import React from 'react';

// Data klien (Silakan ganti properti 'logo' dengan path/URL gambar logo klien asli Anda)
const clients = [
  { name: 'Pertamina', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Logo_Pertamina_%28Persero%29.svg' },
  { name: 'Chevron', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Chevron_Logo.svg' },
  { name: 'BHP', logo: 'https://upload.wikimedia.org/wikipedia/en/2/25/BHP_2017_logo.svg' },
  { name: 'Rio Tinto', logo: 'https://upload.wikimedia.org/wikipedia/en/9/91/Rio_Tinto_logo.svg' },
  { name: 'Schlumberger', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/SLB_Logo_2022.svg' },
  { name: 'Halliburton', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Halliburton_logo.svg' },
];

export const OurClients: React.FC = () => {
  return (
    <section className="py-20 bg-emerald-800 relative border-t border-white/10" id="clients">
      {/* Background subtle glow */}
     <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-[radial-gradient(ellipse,rgba(244,63,94,0.25)_0%,transparent_70%)] pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-[1px] bg-JaPaTek-primary"></div>
            <span className="text-[11px] font-bold tracking-widest uppercase text-white/60">
              Trusted By Industry Leaders
            </span>
            <div className="w-8 h-[1px] bg-JaPaTek-primary"></div>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl text-white tracking-tight">
            Our <span className="italic text-chart-3">Partners</span>
          </h2>
        </div>

        {/* Client Logos Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 md:gap-12 items-center justify-center">
          {clients.map((client, idx) => (
            <div 
              key={idx} 
              className="flex items-center justify-center group h-20"
            >
              {/* Gambar logo: Default grayscale & opacity direndahkan. Saat di-hover, kembali normal. */}
              <img 
                src={client.logo} 
                alt={`${client.name} logo`} 
                className="max-h-12 w-auto max-w-[120px] object-contain opacity-50 grayscale transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-105"
              />
            </div>
          ))}
        </div>

        {/* Optional text or link below logos */}
        <div className="mt-12 text-center">
          <p className="text-sm text-white/40">
            Delivering precision engineering to over 150+ companies worldwide.
          </p>
        </div>
      </div>
    </section>
  );
};