'use client';

import React from 'react';
import { Tooltip } from 'radix-ui';

// Client data with added 'url' properties
const clients = [
  {
    name: 'PLN Indonesia Power',
    logo: 'https://d2tbt8ofproiin.cloudfront.net/client/ip.png',
    url:  'https://www.plnindonesiapower.co.id/'
  },
  {
    name: 'PT Sandesign Cipta Teknika',
    logo: 'https://d2tbt8ofproiin.cloudfront.net/client/sandi.png',
    url:  'https://www.linkedin.com/in/sandesign-ct-27aa45308/?locale=en'
  },
  {
    name: 'LPP Agro Nusantara',
    logo: 'https://d2tbt8ofproiin.cloudfront.net/client/lpp.png',
    url:  'https://lpp.co.id/'
  },
  {
    name: 'PT Tensor Sinergi Indonesia',
    logo: 'https://d2tbt8ofproiin.cloudfront.net/client/tensor.png',
    url:  'https://pttensor.com/'
  },
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

        {/* Client Logos Flex Container - Always centered regardless of count */}

        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 lg:gap-16">
          {clients.map((client, idx) => (
            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger>
                  <a
                    key={idx}
                    href={client.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${client.name} website`}
                    className="flex items-center justify-center group h-24 md:h-28 px-4 cursor-pointer transition-all duration-300"
                  >
                    {/* Logo: Increased size constraints */}
                    <img
                      src={client.logo}
                      alt={`${client.name} logo`}
                      className="max-h-16 md:max-h-20 w-auto max-w-[160px] md:max-w-[200px] object-contain opacity-60 grayscale transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-110"
                    />
                  </a>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content className="TooltipContent bg-gold/50 rounded-sm p-1" sideOffset={2}>
                    {client.name}
                    <Tooltip.Arrow className="TooltipArrow" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
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