'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useAgencyStore } from '@/store/useAgencyStore'
import { Code2, MonitorPlay, ShoppingBag, CheckCircle2 } from 'lucide-react'
import { servicesData } from '@/data/agencyContent'

export default function ServiceMatrix() {
    const { market } = useAgencyStore()

    // Extract the specific services based on the active global Zustand state
    const activeServices = servicesData[market]

    return (
        <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
            <div className="space-y-12">

                {/* Section Typography Header */}
                <div className="space-y-4">
                    <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
                        Operational Solutions Matrix
                    </h2>
                    <p className="text-zinc-400 text-sm sm:text-base max-w-xl">
                        Modular engineering components tailored explicitly to drive commercial scale.
                    </p>
                </div>

                {/* The Card Grid Container */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AnimatePresence mode="wait">
                        {activeServices.map((service) => {
                            // Resolve the icon component safely, default to Code2
                            const Icon = service.icon || Code2

                            return (
                                <motion.div
                                    key={service.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                                    className="p-6 rounded-2xl border border-zinc-900 bg-zinc-900/10 backdrop-blur-md flex flex-col justify-between hover:border-zinc-800 transition-colors group"
                                >
                                    <div className="space-y-6">
                                        {/* Upper Card Block */}
                                        <div className="flex items-start justify-between">
                                            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 group-hover:text-white transition-colors">
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <span className="text-xl font-mono font-bold text-white tracking-tight">
                                                {service.price}
                                            </span>
                                        </div>

                                        {/* Descriptive Text Blocks */}
                                        <div className="space-y-2">
                                            <h3 className="text-xl font-bold text-white group-hover:text-zinc-200 transition-colors">
                                                {service.title}
                                            </h3>
                                            <p className="text-zinc-400 text-sm leading-relaxed">
                                                {service.desc}
                                            </p>
                                        </div>

                                        {/* Core Features Checklist */}
                                        <ul className="space-y-2.5 pt-2 border-t border-zinc-900">
                                            {service.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-zinc-700 flex-shrink-0" />
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                </div>

            </div>
        </section>
    )
}