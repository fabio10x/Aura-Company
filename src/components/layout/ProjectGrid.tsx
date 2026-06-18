'use client'

import { motion } from 'framer-motion'
import { useAgencyStore } from '@/store/useAgencyStore'
import { ExternalLink, FolderGit2 } from 'lucide-react'
import { projectsData } from '@/data/agencyContent'

export default function ProjectGrid() {
    const { market } = useAgencyStore()

    // Filter projects dynamically based on the system state, or show all to look massive
    const filteredProjects = projectsData.filter(p => p.market === market || market === 'international')

    return (
        <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full border-t border-zinc-900/60">
            <div className="space-y-12">

                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div className="space-y-3">
                        <span className="text-xs font-mono tracking-widest text-zinc-500 uppercase">CASE STUDIES</span>
                        <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
                            Selected Engineering Operations
                        </h2>
                    </div>
                    <p className="text-zinc-500 text-xs sm:text-sm font-mono">
            // TOTAL_BUILDS_RENDERED: {filteredProjects.length}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {filteredProjects.map((project) => (
                        <motion.div
                            key={project.id}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="group relative rounded-2xl border border-zinc-900 bg-zinc-900/5 hover:border-zinc-800 transition-all duration-300 p-6 flex flex-col justify-between overflow-hidden"
                        >
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-zinc-400">
                                    <FolderGit2 className="w-5 h-5 text-zinc-600 group-hover:text-white transition-colors" />
                                    <span className="text-xs font-mono bg-zinc-900 px-2.5 py-1 rounded-md border border-zinc-800">
                                        {project.category}
                                    </span>
                                </div>

                                {project.image && (
                                    <a
                                        href={project.liveUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block relative w-full h-48 overflow-hidden rounded-xl bg-zinc-950 border border-zinc-900/80"
                                    >
                                        <img
                                            src={project.image}
                                            alt={project.title}
                                            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/40 via-transparent to-transparent" />
                                    </a>
                                )}

                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-white group-hover:text-zinc-300 transition-colors">
                                        {project.liveUrl ? (
                                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1.5">
                                                {project.title}
                                            </a>
                                        ) : (
                                            project.title
                                        )}
                                    </h3>
                                    <p className="text-zinc-400 text-sm leading-relaxed">
                                        {project.desc}
                                    </p>
                                </div>
                            </div>

                            <div className="pt-6 mt-6 border-t border-zinc-900/80 flex flex-wrap items-center justify-between gap-4">
                                <div className="flex flex-wrap gap-2">
                                    {project.tech.map((t, i) => (
                                        <span key={i} className="text-[10px] font-mono text-zinc-500 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-900">
                                            {t}
                                        </span>
                                    ))}
                                </div>
                                {project.liveUrl ? (
                                    <a
                                        href={project.liveUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-zinc-500 hover:text-white transition-colors cursor-pointer p-1"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                ) : (
                                    <span className="text-zinc-500">
                                        <ExternalLink className="w-4 h-4" />
                                    </span>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    )
}