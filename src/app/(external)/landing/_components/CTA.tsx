'use client'
import React from 'react';

export const CTA: React.FC = () => {
  return (
    <section className="bg-background py-28 relative overflow-hidden" id="contact">
      <div className="absolute inset-0 bg-[linear-gradient(oklch(0.488_0.243_264.376_/_0.07)_1px,transparent_1px),linear-gradient(90deg,oklch(0.488_0.243_264.376_/_0.07)_1px,transparent_1px)] bg-[size:44px_44px] pointer-events-none"></div>

      <div className="relative z-10 text-center max-w-2xl mx-auto px-6">
        <div className="text-[11px] font-bold tracking-widest uppercase text-chart-2 mb-3.5">Get in Touch</div>
        <h2 className="font-serif text-3xl md:text-5xl text-foreground tracking-tight leading-[1.08] mb-5">Ready to start<br />your project?</h2>
        <p className="text-foreground/55 text-md leading-relaxed mb-10">
          Talk to our engineering team about your next project. We provide obligation-free initial consultations to understand your requirements and explore the right approach.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <a href="mailto:contact@JaPaTek.com?cc=riefkyiqbalm@gmail.com&bcc=riefky.iqbal19@gmail.com&subject=Hello%20JaPa" className="inline-flex items-center gap-2 bg-primary text-white rounded-lg px-8 py-4 text-base font-semibold transition-all hover:bg-primary-light hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-glow">
            Contact Us
            <svg viewBox="0 0 14 14" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M2 7h10M8 3l4 4-4 4" /></svg>
          </a>
          {/* <a
            href="https://wa.me/628988350450"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-transparent text-foreground/80 border border-white/20 rounded-lg px-8 py-4 text-base font-medium transition-all hover:border-white/50 hover:bg-white/5"
          >
          
          </a> */}
        </div>
      </div>
    </section>
  );
};