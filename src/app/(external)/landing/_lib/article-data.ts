// src/_lib/article-data.ts

export interface Article {
  title: string;
  slug: string;
  desc: string;
  
  // Optional Indonesian fields
  id_title?: string;
  id_desc?: string;
}

export const articleData: Article[] = [
  {
    title: 'The Future of Heavy Machinery in Power Generation',
    id_title: 'Masa Depan Alat Berat dalam Pembangkit Listrik',
    slug: 'future-heavy-machinery',
    desc: 'Exploring the latest innovations in heavy machinery, focusing on the role of predictive FEA in preventing critical failures.',
    id_desc: 'Menjelajahi inovasi terbaru dalam alat berat, dengan fokus pada peran FEA prediktif dalam mencegah kegagalan kritis.',
  },
  {
    title: 'Advancements in Offshore Structural Integrity',
    id_title: 'Kemajuan dalam Integritas Struktural Lepas Pantai',
    slug: 'offshore-structural-integrity',
    desc: 'How new engineering paradigms and drone-assisted NDE are revolutionizing the lifespan of offshore platforms.',
    id_desc: 'Bagaimana paradigma rekayasa baru dan NDE berbantuan drone merevolusi umur anjungan lepas pantai.',
  },
  {
    title: 'AI-Driven Automation in Industrial Facilities',
    id_title: 'Otomasi Berbasis AI di Fasilitas Industri',
    slug: 'ai-driven-automation',
    desc: 'A deep dive into how artificial intelligence is merging with traditional robotics to create hyper-efficient industrial workflows.',
    id_desc: 'Penjelasan mendalam tentang bagaimana kecerdasan buatan menyatu dengan robotika tradisional untuk menciptakan alur kerja industri yang sangat efisien.',
  }
];