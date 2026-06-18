'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import HeroSection from '@/components/layout/HeroSection'
import ServiceMatrix from '@/components/layout/ServiceMatrix'
import ProjectGrid from '@/components/layout/ProjectGrid'
import TestimonialGrid from '@/components/layout/TestimonialGrid'
import ContactSection from '@/components/layout/ContactSection'
import { useAgencyStore } from '@/store/useAgencyStore'
import { Layers } from 'lucide-react'

export default function Home() {
  const { toggleMarket, market } = useAgencyStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  return (
    <div className="min-h-screen bg-zinc-950 text-white relative">

      {/* Floating Corporate Management Header Navbar */}
      <nav className="w-full border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">

          {/* Company Brand Logo Area */}
          <Link href="/" className="flex items-center gap-2 font-black tracking-tighter text-lg cursor-pointer hover:opacity-90 transition-opacity">
            <Layers className="w-5 h-5 text-white" />
            AURA <span className="text-zinc-500 font-medium tracking-normal text-sm">STUDIO</span>
          </Link>

          {/* Action Management Dashboard Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleMarket}
              className="cursor-pointer font-mono text-[11px] uppercase tracking-wider border border-zinc-800 px-3 py-1.5 rounded-md bg-zinc-900/30 hover:bg-zinc-900 hover:border-zinc-700 text-zinc-300 transition-all duration-200"
            >
              System View: <span className="text-white font-bold">{market}</span>
            </button>

            <a
              href="#portal"
              className="text-xs font-semibold px-4 py-2 rounded-md bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white hover:border-zinc-700 transition-colors"
            >
              Client Portal
            </a>
          </div>
        </div>
      </nav>

      {/* Main Structural Landing Core */}
      <HeroSection />
      <ServiceMatrix />
      <ProjectGrid />
      <TestimonialGrid />
      <ContactSection />

      {/* Deep Footer Block */}
      <footer className="w-full py-12 border-t border-zinc-900 text-center text-xs text-zinc-600 font-mono">
        © {new Date().getFullYear()} AURA INDUSTRIAL CORP. ALL RIGHTS RESERVED.
      </footer>
    </div>
  )
}