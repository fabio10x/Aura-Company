'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAgencyStore } from '@/store/useAgencyStore'
import { supabase } from '@/lib/supabaseClient' // 1. Import our central database client
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { z } from 'zod'

// Define the absolute architectural rules for your input data schema
const contactSchema = z.object({
    name: z.string().min(2, { message: "Identification requires at least 2 characters." }),
    email: z.string().email({ message: "Invalid system email address configuration." }),
    company: z.string().optional(),
    scope: z.string(),
    details: z.string().min(10, { message: "Parameters require at least 10 descriptive characters." })
})

export default function ContactSection() {
    const { market, currency } = useAgencyStore()
    const [submitted, setSubmitted] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false) // Track live database network execution state
    const [serverError, setServerError] = useState<string | null>(null) // Capture structural network exceptions

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        scope: market === 'international' ? 'web-development' : 'web-dev-local',
        details: ''
    })

    // Track specific input errors by matching field keys to error messages
    const [errors, setErrors] = useState<Record<string, string>>({})

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrors({})
        setServerError(null)

        // Parse data against the structural Zod schema rules
        const result = contactSchema.safeParse(formData)

        if (!result.success) {
            const formattedErrors: Record<string, string> = {}
            result.error.issues.forEach((issue) => {
                if (issue.path[0]) {
                    formattedErrors[issue.path[0].toString()] = issue.message
                }
            })
            setErrors(formattedErrors)
            return
        }

        // 2. Begin Live Database Ingestion Lifecycle
        setIsSubmitting(true)

        try {
            const { error } = await supabase
                .from('project_scopes') // Target our database table vault
                .insert([
                    {
                        name: result.data.name,
                        email: result.data.email,
                        company: result.data.company || null,
                        scope: result.data.scope,
                        details: result.data.details,
                    }
                ])

            if (error) throw error // Force break execution sequence if database returns an exception

            // Success state fallback execution loop
            setSubmitted(true)
            setFormData({
                name: '',
                email: '',
                company: '',
                scope: market === 'international' ? 'web-development' : 'web-dev-local',
                details: ''
            })
            setTimeout(() => setSubmitted(false), 6000)

        } catch (err: any) {
            console.error('Database Network Failover Exception:', err)
            setServerError(err.message || 'System Pipeline Interface Error. Submission failed.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <section id="portal" className="py-20 px-4 sm:px-8 max-w-4xl mx-auto w-full border-t border-zinc-900/60">
            <div className="space-y-12">

                {/* Section Header */}
                <div className="text-center space-y-3">
                    <span className="text-xs font-mono tracking-widest text-zinc-500 uppercase">PROJECT SCOPING</span>
                    <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
                        Initiate Your Engineering Blueprint
                    </h2>
                    <p className="text-zinc-400 text-sm max-w-md mx-auto">
                        Submit your parameters below. Our structural analysis system will review your project scope within 24 operational hours.
                    </p>
                </div>

                {/* Interactive Intake Form Card */}
                <div className="p-6 sm:p-10 rounded-2xl border border-zinc-900 bg-zinc-900/5 backdrop-blur-md relative overflow-hidden">

                    {submitted ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="py-12 flex flex-col items-center justify-center text-center space-y-4"
                        >
                            <div className="h-12 w-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                                <CheckCircle className="w-6 h-6" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-lg font-bold text-white">Scope Logged in Database Vault</h3>
                                <p className="text-sm text-zinc-400 max-w-xs">
                                    Your corporate project requirements have stream-validated and saved securely.
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {serverError && (
                                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-xs font-mono text-red-400 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    <span>{serverError}</span>
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {/* Identification Field */}
                                <div className="space-y-2">
                                    <label className="text-xs font-mono text-zinc-400 uppercase">Your Name</label>
                                    <input
                                        type="text"
                                        disabled={isSubmitting}
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g., Alex Chen"
                                        className={`w-full bg-zinc-950 border rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-700 focus:outline-none transition-colors disabled:opacity-50 ${errors.name ? 'border-red-500/50 focus:border-red-500' : 'border-zinc-900 focus:border-zinc-700'}`}
                                    />
                                    {errors.name && (
                                        <p className="text-xs text-red-400 font-mono flex items-center gap-1.5 mt-1">
                                            <AlertCircle className="w-3 h-3" /> {errors.name}
                                        </p>
                                    )}
                                </div>

                                {/* Secure Communication Layer */}
                                <div className="space-y-2">
                                    <label className="text-xs font-mono text-zinc-400 uppercase">Email Address</label>
                                    <input
                                        type="text"
                                        disabled={isSubmitting}
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="name@company.com"
                                        className={`w-full bg-zinc-950 border rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-700 focus:outline-none transition-colors disabled:opacity-50 ${errors.email ? 'border-red-500/50 focus:border-red-500' : 'border-zinc-900 focus:border-zinc-700'}`}
                                    />
                                    {errors.email && (
                                        <p className="text-xs text-red-400 font-mono flex items-center gap-1.5 mt-1">
                                            <AlertCircle className="w-3 h-3" /> {errors.email}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {/* Company Context */}
                                <div className="space-y-2">
                                    <label className="text-xs font-mono text-zinc-400 uppercase">Organization / Company</label>
                                    <input
                                        type="text"
                                        disabled={isSubmitting}
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        placeholder="Optional"
                                        className="w-full bg-zinc-950 border border-zinc-900 rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-zinc-700 transition-colors disabled:opacity-50"
                                    />
                                </div>

                                {/* Market-Adaptive Dynamic Dropdown */}
                                <div className="space-y-2">
                                    <label className="text-xs font-mono text-zinc-400 uppercase">Select a Service</label>
                                    <div className="relative">
                                        <select
                                            disabled={isSubmitting}
                                            value={formData.scope}
                                            onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                                            className="w-full bg-zinc-950 border border-zinc-900 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-zinc-700 transition-colors appearance-none cursor-pointer disabled:opacity-50"
                                        >
                                            {market === 'international' ? (
                                                <>
                                                    <option value="web-development">Web Development</option>
                                                    <option value="digital-visibility">Social Media Management</option>
                                                </>
                                            ) : (
                                                <>
                                                    <option value="web-dev-local">Web Development</option>
                                                    <option value="visibility-local">Social Media Management</option>
                                                </>
                                            )}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-500 font-mono text-[10px]">
                                            ▼
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Scope Specifications Textarea */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-mono text-zinc-400 uppercase">Project Parameters & Objectives</label>
                                    <span className="text-[10px] font-mono text-zinc-600">Billing Profile Context: {currency}</span>
                                </div>
                                <textarea
                                    rows={4}
                                    disabled={isSubmitting}
                                    value={formData.details}
                                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                                    placeholder="Describe the functional workflows, custom panels, or integrations your business scaling profile requires..."
                                    className={`w-full bg-zinc-950 border rounded-lg p-4 text-sm text-white placeholder-zinc-700 focus:outline-none transition-colors resize-none disabled:opacity-50 ${errors.details ? 'border-red-500/50 focus:border-red-500' : 'border-zinc-900 focus:border-zinc-700'}`}
                                />
                                {errors.details && (
                                    <p className="text-xs text-red-400 font-mono flex items-center gap-1.5 mt-1">
                                        <AlertCircle className="w-3 h-3" /> {errors.details}
                                    </p>
                                )}
                            </div>

                            {/* Submission Trigger */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="cursor-pointer w-full group relative inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg text-sm font-semibold tracking-wide text-black bg-white hover:bg-zinc-200 transition-all duration-200 active:scale-[0.99] disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        Transmitting Stream...
                                        <Loader2 className="w-4 h-4 animate-spin text-zinc-500" />
                                    </>
                                ) : (
                                    <>
                                        Transmit Project Scope
                                        <Send className="w-4 h-4 text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                    </>
                                )}
                            </button>

                        </form>
                    )}

                </div>

            </div>
        </section>
    )
}