'use client'

import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

export interface HeroMedia {
  type: 'image' | 'video'
  src: string
}

interface ChildHeroProps {
  /** Small label above the title, e.g. "Our Sectors" */
  title?: string
  /** Main H1 — keep under ~6 words for visual impact */
  titledesc?: string
  /** Optional subtitle below the title */
  description?: string
  className?: string
  /** Array of media (images/videos) for the background slideshow */
  media?: HeroMedia[]
}

const DEFAULT_MEDIA: HeroMedia[] = [
  { type: 'image', src: 'https://images.unsplash.com/photo-1542621334-a254cf47733d?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { type: 'video', src: 'https://media.istockphoto.com/id/480961036/id/video/skema.mp4?s=mp4-640x640-is&k=20&c=VKNdw1JtD9efX6R-s2PqMIEX8YUBnMDWgrFbBCvNhAs=' },
  { type: 'image', src: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=1920' }
]

export function ChildHero({ 
  title, 
  titledesc, 
  description, 
  className,
  media = DEFAULT_MEDIA
}: ChildHeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!media || media.length <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % media.length)
    }, 6000)

    return () => clearInterval(timer)
  }, [media])

  return (
    <section className={cn('relative overflow-hidden min-h-[60vh] flex items-center bg-background', className)}>
      
      {/* 1. FULL SLIDESHOW MEDIA LAYER */}
      {media && media.length > 0 && (
        <div className="absolute inset-0 z-0">
          {media.map((item, index) => (
            <div
              key={item.src}
              className={cn(
                "absolute inset-0 transition-opacity duration-1000 ease-in-out",
                index === currentIndex ? 'opacity-100' : 'opacity-0'
              )}
            >
              {item.type === 'video' ? (
                <video
                  src={item.src}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-full w-full object-cover select-none pointer-events-none"
                />
              ) : (
                <img
                  src={item.src}
                  alt="Hero background"
                  className="h-full w-full object-cover select-none pointer-events-none"
                />
              )}
            </div>
          ))}
          
          {/* MODERN DESIGN OVERLAY: Menggantikan filter hitam pekat lama. 
              Menggunakan gradasi melengkung (radial/linear) agar bagian tengah gambar tetap cerah asli, 
              namun sisi bawah dan kiri menggelap mulus demi legibilitas teks */}
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/70 via-black/40 to-transparent mix-blend-multiply" />
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-background via-transparent to-black/30" />
        </div>
      )}

      {/* 2. OVERLAY GRID PATTERN */}
      {/* Grid pattern yang diperhalus opacity-nya agar terlihat menyatu jernih di atas foto */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 opacity-25"
        style={{
          backgroundImage: [
            'linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
            'linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
          ].join(', '),
          backgroundSize: '48px 48px',
        }}
      />

      {/* Glow lembut khas desain modern */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 z-20 h-[500px] w-[500px] rounded-full opacity-30 blur-[100px]"
        style={{
          background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)',
        }}
      />

      {/* 3. CONTENT CONTAINER */}
      <div className="relative z-30 mx-auto max-w-7xl w-full px-6 sm:px-8 pb-24 pt-36">
        {title && (
          <p className="mb-5 flex items-center gap-2 text-[0.6875rem] text-chart-3 font-bold uppercase tracking-[0.2em]">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-chart-3 animate-pulse" />
            {title}
          </p>
        )}

        <h1 className="max-w-4xl font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.1] tracking-[-0.02em] text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
          {titledesc}
        </h1>

        {description && (
          <p className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-white/80 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
            {description}
          </p>
        )}
      </div>

      {/* 4. BOTTOM SMOOTH BLEND INTO PAGE */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-30 h-32 bg-gradient-to-t from-background to-transparent"
      />
    </section>
  )
}