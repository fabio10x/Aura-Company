'use client'

import { motion } from 'framer-motion'
import { useAgencyStore } from '@/store/useAgencyStore'
import { ArrowUpRight, Terminal, Globe2, Sparkles, Target, Zap } from 'lucide-react'

export default function HeroSection() {
    const { market, currency } = useAgencyStore()

    // Core Operational Values Matrix
    const values = [
        { text: "Build a brand", icon: Sparkles },
        { text: "Improve visibility", icon: Target },
        { text: "Enable easy purchasability", icon: Zap }
    ]

    // High-end container variant staggering the items down as they load
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.12, delayChildren: 0.05 }
        }
    }

    // Liquid fade-up variant for premium text elements
    const textVariants = {
        hidden: { opacity: 0, y: 16 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }
        }
    }

    return (
        <section className="relative w-full min-h-[82vh] lg:min-h-[85vh] flex flex-col justify-center px-4 sm:px-8 max-w-7xl mx-auto overflow-hidden pt-4 pb-6">

            {/* Structural Tech Background Accent Lines */}
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-25" />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-5 max-w-4xl"
            >
                {/* Metric Tracker Blueprint */}
                <motion.div variants={textVariants} className="inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/40 backdrop-blur-md text-[10px] sm:text-xs font-mono tracking-widest text-zinc-400">
                    <Terminal className="w-3.5 h-3.5 text-zinc-500 animate-pulse" />
                    <span>AGENCY_ENGINE_ACTIVE</span>
                    <span className="text-zinc-700">|</span>
                    <span className="text-zinc-200 uppercase">{market} SYSTEM READY</span>
                </motion.div>

                {/* Cinematic Headline Matrix */}
                <div className="space-y-3">
                    <motion.h1
                        variants={textVariants}
                        className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]"
                    >
                        We Architect Custom <br />
                        <span className="bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-500 bg-clip-text text-transparent">
                            Digital Infrastructure.
                        </span>
                    </motion.h1>

                    <motion.p
                        variants={textVariants}
                        className="text-zinc-400 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed"
                    >
                        {market === 'international'
                            ? "Engineering heavy-duty full-stack software schemas, secure enterprise dashboards, and reactive AI integrations for world-class founders."
                            : "Building lightning-fast corporate platforms, custom databases, and high-conversion commercial structures optimized for local scale."
                        }
                    </motion.p>
                </div>

                {/* Core Values Pipeline Row */}
                <motion.div
                    variants={textVariants}
                    className="w-full max-w-2xl pt-1"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {values.map((val, idx) => {
                            const Icon = val.icon
                            return (
                                <div
                                    key={idx}
                                    className="flex items-center justify-start sm:justify-center gap-2 p-2.5 rounded-xl border border-zinc-900/80 bg-zinc-900/10 backdrop-blur-xs text-zinc-400 text-xs font-medium tracking-wide"
                                >
                                    <Icon className="w-3.5 h-3.5 text-zinc-600" />
                                    <span>{val.text}</span>
                                </div>
                            )
                        })}
                    </div>
                </motion.div>

                {/* High-Ticket Action Triggers */}
                <motion.div variants={textVariants} className="flex flex-wrap items-center gap-3 pt-2">
                    <a href="#portal" className="w-full sm:w-auto cursor-pointer group relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold tracking-wide text-black bg-white hover:bg-zinc-200 transition-all duration-200 active:scale-98">
                        Initiate Project Scoping
                        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>

                    <div className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg border border-zinc-800 bg-zinc-900/20 font-mono text-[11px] text-zinc-400 backdrop-blur-xs">
                        <Globe2 className="w-3.5 h-3.5 text-zinc-600" />
                        Pricing Context: <span className="text-white font-bold">{currency} BASELINE</span>
                    </div>
                </motion.div>

            </motion.div>
        </section>
    )
}