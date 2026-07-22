'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Fuel, 
  Pickaxe, 
  Droplet, 
  Settings, 
  Construction, 
  ArrowRight 
} from 'lucide-react';

interface Sector {
  name: string;
  icon: React.ReactNode;
  desc: string;
  caps: string[];
  slug: string;
}

export const Sectors: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const sectorData: Sector[] = [
    {
      name: "Oil & Gas",
      icon: <Fuel size={16} strokeWidth={1.5} />,
      slug: "oil-and-gas",
      desc: "JaPa provides specialist engineering support to oil and gas operators across upstream, midstream and downstream assets. Our engineers have extensive experience with pressure vessels, piping systems, and structural integrity assessment in corrosive and high-temperature environments.",
      caps: ["Pressure vessel engineering", "Pipeline integrity assessment", "Corrosion evaluation & management", "Hazardous area structural review"]
    },
    {
      name: "Mining & Resources",
      icon: <Pickaxe size={16} strokeWidth={1.5} />,
      slug: "mining-and-resources",
      desc: "Our mining sector expertise spans mineral processing facilities, tailings infrastructure, and materials handling systems. We work alongside major Australian mining operators to deliver engineering certainty in highly demanding and remote environments.",
      caps: ["Tailings management structures", "Mineral processing plant design", "Materials handling engineering", "Ground stability analysis"]
    },
    {
      name: "Water & Wastewater",
      icon: <Droplet size={16} strokeWidth={1.5} />,
      slug: "water-and-wastewater",
      desc: "From water treatment plants to sewerage infrastructure, JaPa delivers full-cycle engineering solutions. We specialise in storage tanks, distribution pipelines, and civil infrastructure for water utilities, councils, and private operators.",
      caps: ["Water treatment plant design", "Sewage treatment engineering", "Storage tank structural design", "Pipeline condition assessment"]
    },
    {
      name: "Industrial",
      icon: <Settings size={16} strokeWidth={1.5} />,
      slug: "industrial",
      desc: "Industrial clients engage JaPa for facility structural assessment, process equipment design, and compliance review. Our engineers understand the demands of continuous operation and the critical importance of minimising unplanned production downtime.",
      caps: ["Industrial facility assessment", "Process equipment engineering", "Maintenance strategy development", "Compliance & standards review"]
    },
    {
      name: "Infrastructure",
      icon: <Construction size={16} strokeWidth={1.5} />,
      slug: "infrastructure",
      desc: "JaPa supports civil and transport infrastructure projects with structural design, condition assessment, and asset management strategies. We bring engineering precision to bridges, retaining structures, and major public infrastructure assets.",
      caps: ["Bridge structural assessment", "Retaining wall design", "Road & transport infrastructure", "Asset management planning"]
    }
  ];

  const current = sectorData[activeTab];

  return (
    <section className="py-24 bg-background" id="sectors">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between md:items-end mb-10 gap-8">
          <div>
            <div className="text-[11px] font-bold tracking-widest uppercase text-chart-3 mb-2.5">Our Sectors</div>
            <h2 className="font-serif text-3xl md:text-5xl text-foreground tracking-tight leading-none">Expert support across<br />major industrial sectors</h2>
          </div>
          <p className="text-[15px] text-muted-foreground leading-relaxed max-w-[320px] md:text-right">
            Clients from a wide range of industries engage JaPa for advanced engineering and testing services.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] border border-border rounded-[20px] overflow-hidden bg-card shadow-sm">
          {/* Tabs header */}
          <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible border-b lg:border-b-0 lg:border-r border scrollbar-none">
            {sectorData.map((tab, idx) => (
              <button 
                key={idx} 
                onClick={() => setActiveTab(idx)}
                className={`flex items-center lg:items-center gap-3 p-4 lg:p-4.5 w-full text-left bg-transparent border-0 border-r lg:border-r-0 lg:border-b border last:border-none cursor-pointer transition-all min-w-[150px] lg:min-w-0 flex-col lg:flex-row text-center lg:text-left ${
                  activeTab === idx ? 'bg-[oklch(0.488_0.243_264.376_/_0.05)]' : 'hover:bg-muted'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                  activeTab === idx ? 'bg-primary text-white' : 'bg-muted text-foreground/40'
                }`}>
                  {tab.icon}
                </div>
                <span className={`text-sm transition-colors ${
                  activeTab === idx ? 'text-chart-2 font-semibold' : 'text-muted-fg font-medium group-hover:text-foreground/40'
                }`}>{tab.name}</span>
              </button>
            ))}
          </div>
          
          {/* Tab content panel */}
          <div className="p-8 md:p-12">
            <div className="font-serif text-3xl text-foreground mb-4 leading-tight">{current.name}</div>
            <div className="text-[15px] text-foreground/40 leading-relaxed mb-8">{current.desc}</div>
            
            <ul className="list-none grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {current.caps.map((cap, cIdx) => (
                <li key={cIdx} className="flex items-center gap-2.5 text-[13px] font-medium text-foreground/40">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></div>
                  {cap}
                </li>
              ))}
            </ul>
            
            <div className="mt-8">
              <Link 
                href={`/a/sector/${current.slug}`} 
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-chart-3 transition-all hover:gap-2.5"
              >
                Explore {current.name} 
                <ArrowRight size={14} strokeWidth={1.75} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};