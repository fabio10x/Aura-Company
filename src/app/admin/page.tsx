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
    RefreshCw,
    MoreVertical,
    Pencil,
    Trash2
} from 'lucide-react'

import ManageServices from '@/components/admin/ManageServices'
import ManageCaseStudies from '@/components/admin/ManageCaseStudies'

// Define the data interface structural type matching the database schema
interface ProjectScopeRow {
    id: string
    created_at: string
    name: string
    email: string
    company: string | null
    scope: string
    details: string
    status?: string | null
}

export default function AdminDashboard() {
    const [scopes, setScopes] = useState<ProjectScopeRow[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [updatingIds, setUpdatingIds] = useState<Record<string, boolean>>({})
    const [activeTab, setActiveTab] = useState<'submissions' | 'services' | 'casestudies'>('submissions')
    const [sortBy, setSortBy] = useState('date-desc')
    const [filterStatus, setFilterStatus] = useState('all')
    const [filterType, setFilterType] = useState('all')
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editForm, setEditForm] = useState({ name: '', email: '', details: '' })

    const handleStatusChange = async (id: string, newStatus: string) => {
        setUpdatingIds(prev => ({ ...prev, [id]: true }))
        setError(null)

        try {
            const { error: supabaseError } = await supabase
                .from('project_scopes')
                .update({ status: newStatus })
                .eq('id', id)

            if (supabaseError) throw supabaseError

            // Instantly sync the local frontend state
            setScopes(prev => prev.map(row => row.id === id ? { ...row, status: newStatus } : row))
        } catch (err: any) {
            console.error('Data layer status update failure:', err)
            setError(err.message || 'Failed to update record status inside secure vault.')
        } finally {
            setUpdatingIds(prev => ({ ...prev, [id]: false }))
        }
    }

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this submission?")) return;
        
        try {
            const { error } = await supabase
                .from('project_scopes')
                .delete()
                .eq('id', id)
                
            if (error) {
                alert("Database Error: " + error.message)
            } else {
                setScopes(prev => prev.filter(row => row.id !== id))
            }
        } catch (err: any) {
            console.error('Data layer delete failure:', err)
            setError(err.message || 'Failed to delete record.')
        }
    }

    const handleEditSubmit = async (id: string) => {
        try {
            const { error: supabaseError } = await supabase
                .from('project_scopes')
                .update({ name: editForm.name, email: editForm.email, details: editForm.details })
                .eq('id', id)
                
            if (supabaseError) throw supabaseError
            
            setScopes(prev => prev.map(row => row.id === id ? { ...row, ...editForm } : row))
            setEditingId(null)
        } catch (err: any) {
            console.error('Data layer update failure:', err)
            setError(err.message || 'Failed to update record.')
        }
    }

    const getStatusButtonClass = (currentStatus: string | null | undefined, buttonStatus: string) => {
        const isActive = currentStatus === buttonStatus
        const base = "cursor-pointer text-center px-1 py-1 rounded text-[9px] font-mono font-medium border tracking-wider transition-all disabled:opacity-40"

        if (!isActive) {
            return `${base} text-zinc-500 border-zinc-900 bg-zinc-950 hover:text-zinc-400 hover:border-zinc-800`
        }

        switch (buttonStatus) {
            case 'Done':
                return `${base} text-emerald-400 border-emerald-500/30 bg-emerald-500/10`
            case 'In Progress':
                return `${base} text-amber-400 border-amber-500/30 bg-amber-500/10`
            case 'Cancelled':
                return `${base} text-red-400 border-red-500/30 bg-red-500/10`
            case 'Future':
                return `${base} text-zinc-300 border-zinc-700 bg-zinc-900`
            default:
                return `${base} text-zinc-400 border-zinc-800 bg-zinc-900`
        }
    }

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

    const processedScopes = scopes
        .filter((row) => {
            if (filterStatus !== 'all' && row.status !== filterStatus) return false;
            if (filterType === 'local' && !row.scope.includes('-local')) return false;
            if (filterType === 'international' && row.scope.includes('-local')) return false;
            return true;
        })
        .sort((a, b) => {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            return sortBy === 'date-desc' ? dateB - dateA : dateA - dateB;
        });

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
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                            {/* Tile 1: Total gross pipelines (all, including cancelled) */}
                            <div className="p-5 border border-zinc-900 bg-zinc-900/10 rounded-xl space-y-1.5">
                                <p className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">
                                    Gross Logged Projects
                                </p>
                                <p className="text-3xl font-extrabold text-white font-mono">
                                    {scopes.length}
                                </p>
                                <p className="text-[9px] font-mono text-zinc-600">Total transaction volume</p>
                            </div>

                            {/* Tile 2: Active pipelines */}
                            <div className="p-5 border border-zinc-900 bg-zinc-900/10 rounded-xl space-y-1.5">
                                <p className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">
                                    Active Pipelines
                                </p>
                                <p className="text-3xl font-extrabold text-zinc-200 font-mono">
                                    {scopes.filter(s => s.status === 'In Progress' || s.status === 'Future').length}
                                </p>
                                <p className="text-[9px] font-mono text-zinc-600">Active velocity</p>
                            </div>

                            {/* Tile 3: In Progress count */}
                            <div className="p-5 border border-amber-500/10 bg-amber-500/5 rounded-xl space-y-1.5">
                                <p className="text-[9px] font-mono tracking-widest text-amber-600 uppercase">
                                    In Progress
                                </p>
                                <p className="text-3xl font-extrabold text-amber-400 font-mono">
                                    {scopes.filter(s => s.status === 'In Progress').length}
                                </p>
                                <p className="text-[9px] font-mono text-zinc-600">Active executions</p>
                            </div>

                            {/* Tile 4: Done count */}
                            <div className="p-5 border border-emerald-500/10 bg-emerald-500/5 rounded-xl space-y-1.5">
                                <p className="text-[9px] font-mono tracking-widest text-emerald-600 uppercase">
                                    Completed
                                </p>
                                <p className="text-3xl font-extrabold text-emerald-400 font-mono">
                                    {scopes.filter(s => s.status === 'Done').length}
                                </p>
                                <p className="text-[9px] font-mono text-zinc-600">Closed contracts</p>
                            </div>

                            {/* Tile 5: Enterprise accounts (with a company field) */}
                            <div className="p-5 border border-zinc-900 bg-zinc-900/10 rounded-xl space-y-1.5">
                                <p className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">
                                    Enterprise Accts
                                </p>
                                <p className="text-3xl font-extrabold text-zinc-300 font-mono">
                                    {scopes.filter(s => s.company).length}
                                </p>
                                <p className="text-[9px] font-mono text-zinc-600">Corp. identified</p>
                            </div>
                        </div>

                        {/* CMS Navigation Tabs */}
                        <div className="flex flex-wrap items-center gap-2 border-b border-zinc-900 pb-px mt-4">
                            {(['submissions', 'services', 'casestudies'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-2 text-[11px] uppercase font-mono tracking-wider transition-colors border-b-2 ${
                                        activeTab === tab
                                            ? 'border-white text-white font-bold'
                                            : 'border-transparent text-zinc-500 hover:text-zinc-300'
                                    }`}
                                >
                                    {tab === 'submissions' ? 'Client Submissions' : 
                                     tab === 'services' ? 'Manage Services' : 'Manage Case Studies'}
                                </button>
                            ))}
                        </div>

                        {activeTab === 'services' && <ManageServices />}
                        {activeTab === 'casestudies' && <ManageCaseStudies />}

                        {activeTab === 'submissions' && (
                            <>
                        {/* Database Records Empty Fallback */}
                        {scopes.length === 0 ? (
                            <div className="py-20 border border-dashed border-zinc-900 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 mt-6">
                                <Clock className="w-8 h-8 text-zinc-700" />
                                <h3 className="text-sm font-semibold text-zinc-400">Database Vault Empty</h3>
                                <p className="text-xs text-zinc-600 max-w-xs font-mono">
                                    No transaction records or dynamic project scopes logged in public.project_scopes yet.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6 mt-6">
                                {/* Global Sorting and Filtering Control Panel */}
                                <div className="p-4 border border-zinc-900 bg-zinc-950 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">Sort By</label>
                                        <select 
                                            value={sortBy} 
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1.5 focus:outline-none focus:border-zinc-700 text-zinc-300 text-xs font-mono appearance-none"
                                        >
                                            <option value="date-desc">Newest First</option>
                                            <option value="date-asc">Oldest First</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">Status</label>
                                        <select 
                                            value={filterStatus} 
                                            onChange={(e) => setFilterStatus(e.target.value)}
                                            className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1.5 focus:outline-none focus:border-zinc-700 text-zinc-300 text-xs font-mono appearance-none"
                                        >
                                            <option value="all">All Statuses</option>
                                            <option value="Done">Done</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Cancelled">Cancelled</option>
                                            <option value="Future">Future</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">Market Type</label>
                                        <select 
                                            value={filterType} 
                                            onChange={(e) => setFilterType(e.target.value)}
                                            className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1.5 focus:outline-none focus:border-zinc-700 text-zinc-300 text-xs font-mono appearance-none"
                                        >
                                            <option value="all">All Markets</option>
                                            <option value="local">Local Market</option>
                                            <option value="international">International</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Submissions Board Grid Layout */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {processedScopes.map((row) => (
                                    <div
                                        key={row.id}
                                        className="flex flex-col justify-between border border-zinc-900 bg-zinc-950 hover:border-zinc-800 transition-colors rounded-xl overflow-hidden p-6 space-y-6"
                                    >
                                        <div className="space-y-4">
                                            {/* Top Segment: Target Scope Badge & Date Metadata */}
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-zinc-800 bg-zinc-900/50 text-[10px] font-mono font-medium tracking-wide text-zinc-300 uppercase">
                                                        <Layers className="w-3 h-3 text-zinc-500" />
                                                        <span>{row.scope.replace('-', ' ')}</span>
                                                    </div>
                                                    {row.scope.includes('-local') ? (
                                                        <div className="inline-flex items-center px-2.5 py-1 rounded border border-amber-500/20 bg-amber-500/5 text-[10px] font-mono font-medium tracking-wide text-amber-400 uppercase">
                                                            <span>📍 LOCAL MARKET</span>
                                                        </div>
                                                    ) : (
                                                        <div className="inline-flex items-center px-2.5 py-1 rounded border border-blue-500/20 bg-blue-500/5 text-[10px] font-mono font-medium tracking-wide text-blue-400 uppercase">
                                                            <span>🌐 INTERNATIONAL</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="inline-flex items-center gap-1 text-zinc-600 font-mono text-[10px] pt-1 sm:pt-0">
                                                        <Calendar className="w-3 h-3" />
                                                        <span>{new Date(row.created_at).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="relative">
                                                        <button 
                                                            onClick={() => setOpenDropdownId(openDropdownId === row.id ? null : row.id)}
                                                            className="p-1 hover:bg-zinc-800 rounded transition-colors text-zinc-400 hover:text-white"
                                                        >
                                                            <MoreVertical className="w-4 h-4" />
                                                        </button>
                                                        {openDropdownId === row.id && (
                                                            <div className="absolute right-0 mt-2 w-32 bg-zinc-900 border border-zinc-800 rounded shadow-xl z-10 py-1">
                                                                <button 
                                                                    onClick={() => {
                                                                        setEditingId(row.id);
                                                                        setEditForm({ name: row.name, email: row.email, details: row.details });
                                                                        setOpenDropdownId(null);
                                                                    }}
                                                                    className="w-full text-left px-3 py-1.5 text-xs font-mono text-zinc-300 hover:bg-zinc-800 hover:text-white flex items-center gap-2"
                                                                >
                                                                    <Pencil className="w-3 h-3" /> Edit Record
                                                                </button>
                                                                <button 
                                                                    onClick={() => {
                                                                        handleDelete(row.id);
                                                                        setOpenDropdownId(null);
                                                                    }}
                                                                    className="w-full text-left px-3 py-1.5 text-xs font-mono text-zinc-400 hover:bg-red-500/10 hover:text-red-400 flex items-center gap-2 transition-colors"
                                                                >
                                                                    <Trash2 className="w-3 h-3" /> Delete Record
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {editingId === row.id ? (
                                                <div className="space-y-3 pt-2">
                                                    <input 
                                                        value={editForm.name} 
                                                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                                        className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-700 font-mono" 
                                                        placeholder="Name"
                                                    />
                                                    <input 
                                                        value={editForm.email} 
                                                        onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                                        className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-700 font-mono" 
                                                        placeholder="Email"
                                                    />
                                                    <textarea 
                                                        value={editForm.details} 
                                                        onChange={(e) => setEditForm({...editForm, details: e.target.value})}
                                                        className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-700 min-h-[80px] font-mono resize-none" 
                                                        placeholder="Details"
                                                    />
                                                    <div className="flex items-center gap-2 pt-1">
                                                        <button 
                                                            onClick={() => handleEditSubmit(row.id)}
                                                            className="px-3 py-1.5 bg-white text-zinc-950 text-[10px] uppercase font-mono font-bold rounded hover:bg-zinc-200 transition-colors"
                                                        >
                                                            Save Changes
                                                        </button>
                                                        <button 
                                                            onClick={() => setEditingId(null)}
                                                            className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px] uppercase font-mono rounded hover:text-white transition-colors"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>

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
                                            </>
                                            )}
                                        </div>

                                        {/* Status Control Panel */}
                                        <div className="pt-4 border-t border-zinc-900/80 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <p className="text-[9px] font-mono tracking-widest text-zinc-600 uppercase">
                                                    Pipeline Status
                                                </p>
                                                {updatingIds[row.id] && (
                                                    <div className="inline-flex items-center gap-1 text-[9px] font-mono text-amber-400/70">
                                                        <Loader2 className="w-2.5 h-2.5 animate-spin" />
                                                        <span>SYNCING VAULT...</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-4 gap-1.5">
                                                {(['Done', 'In Progress', 'Cancelled', 'Future'] as const).map((s) => (
                                                    <button
                                                        key={s}
                                                        disabled={updatingIds[row.id]}
                                                        onClick={() => handleStatusChange(row.id, s)}
                                                        className={getStatusButtonClass(row.status, s)}
                                                    >
                                                        {s}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Client Communication Trigger */}
                                        <div className="pt-2">
                                            <a
                                                href={`mailto:${row.email}?subject=${encodeURIComponent('Aura Studio // Engineering Blueprint Response')}&body=${encodeURIComponent(`Hi ${row.name},\n\nThank you for submitting your specifications to Aura Studio. We have reviewed your project blueprint regarding ${row.scope.replace(/-/g, ' ')} and wanted to connect regarding next steps...`)}`}
                                                className="w-full flex items-center justify-center gap-1.5 bg-white text-zinc-950 hover:bg-zinc-200 transition-colors py-2.5 px-4 rounded-md text-xs font-semibold tracking-wide font-mono"
                                            >
                                                <Mail className="w-4 h-4" />
                                                CONTACT CLIENT
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            </div>
                        )}
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}