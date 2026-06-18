'use client'

import { useAgencyStore } from '@/store/useAgencyStore'
import { Quote } from 'lucide-react'
import { testimonialsData } from '@/data/agencyContent'

export default function TestimonialGrid() {
    const { market } = useAgencyStore()

    return (
        <section className="py-25 px-4 sm:px-8 max-w-7xl mx-auto w-full border-t border-zinc-900/60 bg-[radial-gradient(ellipse_50%_50%_at_50%_100%,#09090b,transparent)]">
            <div className="space-y-16">

                <div className="text-center space-y-3 max-w-xl mx-auto">
                    <span className="text-xs font-mono tracking-widest text-zinc-500 uppercase">SYSTEM TRUST</span>
                    <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
                        Client Infrastructure Feedback
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {testimonialsData.map((rev, idx) => (
                        <div
                            key={idx}
                            className="p-8 rounded-2xl border border-zinc-900 bg-zinc-900/10 backdrop-blur-xs relative space-y-6 flex flex-col justify-between"
                        >
                            <Quote className="w-8 h-8 text-zinc-800 absolute top-6 right-6 -z-10" />

                            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed italic font-medium">
                                "{rev.quote}"
                            </p>

                            <div className="flex items-center gap-3 pt-4 border-t border-zinc-900">
                                <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-xs text-zinc-400 border border-zinc-700">
                                    {rev.author[0]}
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white">{rev.author}</h4>
                                    <p className="text-xs text-zinc-500 font-mono">{rev.role} — <span className="text-zinc-400">{rev.company}</span></p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    )
}