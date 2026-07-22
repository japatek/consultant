'use client'
import React from 'react';

export const WhyUs: React.FC = () => {
  return (
    <section className="py-24 bg-background" id="about">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="text-[11px] font-bold tracking-widest uppercase text-vertex-primary mb-3.5">Why Engage Vertex</div>
            <h2 className="font-serif text-3xl md:text-5xl text-vertex-fg tracking-tight leading-[1.08] mb-5">Engineering expertise<br />you can rely on</h2>
            <p className="text-[15px] text-vertex-muted-fg leading-relaxed mb-10 max-w-lg">
              Vertex Engineering Consultants are specialists in structural, civil, and industrial engineering. We offer a comprehensive suite of services built on decades of hands-on experience across Australia's most demanding sectors.
            </p>
            
            <div className="flex flex-col">
              {[
                { title: 'Accredited & Certified', desc: 'Our team holds relevant professional accreditations across structural, civil and materials engineering disciplines, ensuring rigorous standards on every engagement.' },
                { title: 'Experienced Team', desc: 'Decades of combined industry experience across oil & gas, mining, water, and infrastructure sectors — our engineers have seen it all and solved it all.' },
                { title: 'End-to-End Delivery', desc: 'From initial feasibility and design through to site supervision and quality sign-off — Vertex sees every project through to a successful conclusion.' }
              ].map((feat, i) => (
                <div key={i} className="flex gap-4 py-6 border-b border-vertex-border first:pt-0 last:border-b-0 last:pb-0">
                  <div className="w-10 h-10 rounded-lg bg-[oklch(0.488_0.243_264.376_/_0.1)] text-vertex-primary flex items-center justify-center flex-shrink-0">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="9" cy="9" r="7"/><path d="M6 9l2 2 4-4"/></svg>
                  </div>
                  <div>
                    <div className="font-semibold text-[15px] text-vertex-fg mb-1">{feat.title}</div>
                    <div className="text-[13px] text-vertex-muted-fg leading-relaxed">{feat.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { val: '25+', lbl: 'Years Experience' },
              { val: '500+', lbl: 'Projects Delivered' },
              { val: '12', lbl: 'Industry Sectors' },
              { val: '98%', lbl: 'Client Satisfaction' }
            ].map((box, i) => (
              <div key={i} className="bg-white border border-vertex-border rounded-2xl p-[30px] relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:height-[3px] before:bg-gradient-to-r before:from-vertex-primary before:to-[oklch(0.623_0.214_259.815)]">
                <div className="text-[44px] font-extrabold text-vertex-primary tracking-tighter leading-none">{box.val}</div>
                <div className="text-[12px] text-vertex-muted-fg font-semibold uppercase tracking-wider mt-2">{box.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};