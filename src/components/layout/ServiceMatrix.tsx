'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAgencyStore } from '@/store/useAgencyStore'
import { Code2, CheckCircle2, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

interface ServiceRow {
    id: string
    title: string
    description: string
    price: string
    price_suffix: string
    market_type: 'local' | 'international' | 'both'
    features_list: string[]
}

export default function ServiceMatrix() {
    const { market, selectPackage } = useAgencyStore()
    const [services, setServices] = useState<ServiceRow[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchServices = async () => {
            setIsLoading(true)
            try {
                const { data, error } = await supabase
                    .from('services')
                    .select('*')
                    .order('created_at', { ascending: true })
                if (error) throw error
                setServices(data || [])
            } catch (err) {
                console.error('ServiceMatrix: Failed to fetch services', err)
                setServices([])
            } finally {
                setIsLoading(false)
            }
        }
        fetchServices()
    }, [])

    // Dynamically filter by market state — show 'both' in all views
    const activeServices = services.filter(s =>
        s.market_type === market || s.market_type === 'both'
    )

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

                {/* Loading State */}
                {isLoading ? (
                    <div className="py-20 flex justify-center items-center gap-3 text-zinc-600">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span className="text-xs font-mono uppercase tracking-widest">Fetching service matrix...</span>
                    </div>
                ) : activeServices.length === 0 ? (
                    <div className="py-20 border border-dashed border-zinc-900 rounded-2xl flex flex-col items-center justify-center text-center space-y-2">
                        <Code2 className="w-8 h-8 text-zinc-800" />
                        <p className="text-sm font-mono text-zinc-600 uppercase tracking-widest">No services configured for this market view.</p>
                    </div>
                ) : (
                    /* The Card Grid Container */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AnimatePresence mode="wait">
                            {activeServices.map((service) => (
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
                                                <Code2 className="w-6 h-6" />
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xl font-mono font-bold text-white tracking-tight">
                                                    {service.price}
                                                </span>
                                                {service.price_suffix && (
                                                    <span className="text-xs font-mono text-zinc-500 ml-1">{service.price_suffix}</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Descriptive Text Blocks */}
                                        <div className="space-y-2">
                                            <h3 className="text-xl font-bold text-white group-hover:text-zinc-200 transition-colors">
                                                {service.title}
                                            </h3>
                                            <p className="text-zinc-400 text-sm leading-relaxed">
                                                {service.description}
                                            </p>
                                        </div>

                                        {/* Core Features Checklist */}
                                        {service.features_list && service.features_list.length > 0 && (
                                            <ul className="space-y-2.5 pt-2 border-t border-zinc-900">
                                                {service.features_list.map((feature, idx) => (
                                                    <li key={idx} className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
                                                        <CheckCircle2 className="w-3.5 h-3.5 text-zinc-700 flex-shrink-0" />
                                                        <span>{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>

                                    {/* Action Button */}
                                    <div className="pt-6 mt-6 border-t border-zinc-900">
                                        <button
                                            onClick={() => {
                                                const scope = `${service.title.toLowerCase().replace(/\s+/g, '-')}-${service.market_type === 'local' ? 'local' : ''}`
                                                selectPackage(scope, service.title)
                                                document.getElementById('portal')?.scrollIntoView({ behavior: 'smooth' })
                                            }}
                                            className="w-full cursor-pointer py-2.5 px-4 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white font-semibold text-xs transition-colors border border-zinc-800 hover:border-zinc-700 flex items-center justify-center gap-1.5"
                                        >
                                            Order Package
                                        </button>
                                    </div>

                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}

            </div>
        </section>
    )
}