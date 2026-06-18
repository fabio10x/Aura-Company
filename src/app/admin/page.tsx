'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import {
    Terminal,
    Layers,
    Mail,
    Building2,
    Calendar,
    Clock,
    Loader2,
    AlertCircle,
    CheckCircle2,
    RefreshCw
} from 'lucide-react'

// Define the data interface structural type matching the database schema
interface ProjectScopeRow {
    id: string
    created_at: string
    name: string
    email: string
    company: string | null
    scope: string
    details: string
}

export default function AdminDashboard() {
    const [scopes, setScopes] = useState<ProjectScopeRow[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isRefreshing, setIsRefreshing] = useState(false)

    // Method to stream leads out of the Supabase Vault
    const fetchScopes = async (showRefreshIndicator = false) => {
        if (showRefreshIndicator) setIsRefreshing(true)
        setError(null)

        try {
            const { data, error: supabaseError } = await supabase
                .from('project_scopes')
                .select('*')
                .order('created_at', { ascending: false }) // Newest business opportunities first

            if (supabaseError) throw supabaseError
            setScopes(data || [])
        } catch (err: any) {
            console.error('Data layer retrieval failure:', err)
            setError(err.message || 'Failed to sync with secure database infrastructure.')
        } finally {
            setIsLoading(false)
            setIsRefreshing(false)
        }
    }

    useEffect(() => {
        fetchScopes()
    }, [])

    return (
        <div className="min-h-screen bg-black text-zinc-100 p-4 sm:p-8 md:p-12 font-sans selection:bg-zinc-800">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Console System Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
                    <div className="space-y-1.5">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/30 text-[10px] font-mono tracking-widest text-zinc-400">
                            <Terminal className="w-3 h-3 text-emerald-500 animate-pulse" />
                            <span>AURA_ADMIN_CORE_ACTIVE</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                            Inbound Contract Vault
                        </h1>
                        <p className="text-zinc-500 text-xs sm:text-sm font-mono">
                            Operational Database Metrics & Ingestion Scopes
                        </p>
                    </div>

                    {/* Operational Triggers */}
                    <button
                        onClick={() => fetchScopes(true)}
                        disabled={isLoading || isRefreshing}
                        className="cursor-pointer self-start sm:self-center inline-flex items-center gap-2 px-4 py-2 border border-zinc-800 rounded-lg bg-zinc-900/40 hover:bg-zinc-900 text-xs font-mono font-medium tracking-wide transition-all active:scale-98 disabled:opacity-40"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 text-zinc-400 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
                        {isRefreshing ? 'SYNCING...' : 'FORCE_DB_REFRESH'}
                    </button>
                </div>

                {/* Exception System Overrides */}
                {error && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-mono text-red-400 flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Dashboard Loading Lifecycle */}
                {isLoading ? (
                    <div className="py-24 flex flex-col items-center justify-center space-y-3 text-center">
                        <Loader2 className="w-8 h-8 animate-spin text-zinc-600" />
                        <p className="text-xs font-mono text-zinc-500 tracking-wider">ESTABLISHING ENCRYPTED SECURE CHANNEL...</p>
                    </div>
                ) : (
                    <>
                        {/* Metrics Panel Array */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="p-5 border border-zinc-900 bg-zinc-900/10 rounded-xl space-y-1">
                                <p className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">Gross Incoming Pipelines</p>
                                <p className="text-3xl font-extrabold text-white font-mono">{scopes.length}</p>
                            </div>
                            <div className="p-5 border border-zinc-900 bg-zinc-900/10 rounded-xl space-y-1">
                                <p className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">Active Enterprise Accounts</p>
                                <p className="text-3xl font-extrabold text-zinc-300 font-mono">
                                    {scopes.filter(s => s.company).length}
                                </p>
                            </div>
                            <div className="p-5 border border-zinc-900 bg-zinc-900/10 rounded-xl space-y-1">
                                <p className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">System Integrity Status</p>
                                <div className="flex items-center gap-2 pt-1 text-emerald-400 font-mono text-xs font-bold">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    <span>OPERATIONAL_OK</span>
                                </div>
                            </div>
                        </div>

                        {/* Database Records Empty Fallback */}
                        {scopes.length === 0 ? (
                            <div className="py-20 border border-dashed border-zinc-900 rounded-2xl flex flex-col items-center justify-center text-center space-y-2">
                                <Clock className="w-8 h-8 text-zinc-700" />
                                <h3 className="text-sm font-semibold text-zinc-400">Database Vault Empty</h3>
                                <p className="text-xs text-zinc-600 max-w-xs font-mono">
                                    No transaction records or dynamic project scopes logged in public.project_scopes yet.
                                </p>
                            </div>
                        ) : (
                            /* Submissions Board Grid Layout */
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {scopes.map((row) => (
                                    <div
                                        key={row.id}
                                        className="flex flex-col justify-between border border-zinc-900 bg-zinc-950 hover:border-zinc-800 transition-colors rounded-xl overflow-hidden p-6 space-y-6"
                                    >
                                        <div className="space-y-4">
                                            {/* Top Segment: Target Scope Badge & Date Metadata */}
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-zinc-800 bg-zinc-900/50 text-[10px] font-mono font-medium tracking-wide text-zinc-300 uppercase">
                                                    <Layers className="w-3 h-3 text-zinc-500" />
                                                    <span>{row.scope.replace('-', ' ')}</span>
                                                </div>
                                                <div className="inline-flex items-center gap-1 text-zinc-600 font-mono text-[10px] pt-1">
                                                    <Calendar className="w-3 h-3" />
                                                    <span>{new Date(row.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>

                                            {/* Middle Segment: User Parameters Grid */}
                                            <div className="space-y-2">
                                                <h3 className="text-lg font-bold text-white tracking-tight">{row.name}</h3>

                                                <div className="space-y-1 text-xs text-zinc-400 font-mono">
                                                    <a href={`mailto:${row.email}`} className="inline-flex items-center gap-2 hover:text-white transition-colors">
                                                        <Mail className="w-3.5 h-3.5 text-zinc-600" />
                                                        <span>{row.email}</span>
                                                    </a>
                                                    {row.company && (
                                                        <div className="flex items-center gap-2 text-zinc-500">
                                                            <Building2 className="w-3.5 h-3.5 text-zinc-600" />
                                                            <span>{row.company}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Lower Segment: Project Specifications Area */}
                                            <div className="pt-2 border-t border-zinc-900/80">
                                                <p className="text-zinc-400 text-xs font-mono uppercase tracking-wider text-[9px] mb-1 text-zinc-500">Project Blueprint Specifications:</p>
                                                <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap bg-zinc-900/20 p-3 rounded border border-zinc-900 font-mono">
                                                    {row.details}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}