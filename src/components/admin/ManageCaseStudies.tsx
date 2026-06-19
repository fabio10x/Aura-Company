'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Loader2, Plus, Pencil, Trash2, X, AlertCircle, Image as ImageIcon, ExternalLink } from 'lucide-react'

export interface CaseStudyRow {
    id: string
    created_at: string
    title: string
    description: string
    live_url: string
    image: string
    category: string
    market_type: 'local' | 'international' | 'both'
    tech_stack: string[]
}

export default function ManageCaseStudies() {
    const [caseStudies, setCaseStudies] = useState<CaseStudyRow[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    
    // Form States
    const [isAdding, setIsAdding] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [formData, setFormData] = useState({ 
        title: '', 
        description: '', 
        live_url: '',
        category: '',
        market_type: 'local' as 'local' | 'international' | 'both',
        tech_stack: ''
    })
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    useEffect(() => {
        fetchCaseStudies()
    }, [])

    const fetchCaseStudies = async () => {
        try {
            const { data, error } = await supabase.from('case_studies').select('*').order('created_at', { ascending: false })
            if (error) throw error
            setCaseStudies(data || [])
        } catch (err: any) {
            setError(err.message || 'Failed to load case studies.')
        } finally {
            setIsLoading(false)
        }
    }

    const uploadImage = async (file: File): Promise<string> => {
        const fileName = `${Date.now()}-${file.name}`
        const { error } = await supabase.storage.from('portfolio-images').upload(fileName, file)
        if (error) throw error
        const { data } = supabase.storage.from('portfolio-images').getPublicUrl(fileName)
        return data.publicUrl
    }

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)
        try {
            let imageUrl = ''
            if (selectedFile) {
                imageUrl = await uploadImage(selectedFile)
            } else {
                throw new Error("Image file is required for case studies.")
            }

            const techArray = formData.tech_stack.split(',').map(s => s.trim()).filter(Boolean)
            const payload = { ...formData, tech_stack: techArray, image: imageUrl }

            const { data, error } = await supabase.from('case_studies').insert([payload]).select().single()
            if (error) throw error
            
            setCaseStudies(prev => [data, ...prev])
            resetForm()
            setIsAdding(false)
        } catch (err: any) {
            setError(err.message || 'Failed to add case study.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingId) return
        setIsSubmitting(true)
        setError(null)
        try {
            const techArray = formData.tech_stack.split(',').map(s => s.trim()).filter(Boolean)
            let payload: any = { ...formData, tech_stack: techArray }
            
            if (selectedFile) {
                payload.image = await uploadImage(selectedFile)
            }

            const { data, error } = await supabase.from('case_studies').update(payload).eq('id', editingId).select().single()
            if (error) throw error
            
            setCaseStudies(prev => prev.map(s => s.id === editingId ? data : s))
            resetForm()
            setEditingId(null)
        } catch (err: any) {
            setError(err.message || 'Failed to update case study.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this case study?")) return
        try {
            const { error } = await supabase.from('case_studies').delete().eq('id', id)
            if (error) throw error
            setCaseStudies(prev => prev.filter(s => s.id !== id))
        } catch (err: any) {
            alert("Delete Error: " + (err.message || 'Failed to delete case study.'))
        }
    }

    const startEdit = (cs: CaseStudyRow) => {
        setEditingId(cs.id)
        setFormData({ 
            title: cs.title || '', 
            description: cs.description || '', 
            live_url: cs.live_url || '',
            category: cs.category || '',
            market_type: cs.market_type || 'both',
            tech_stack: (cs.tech_stack || []).join(', ')
        })
        setSelectedFile(null)
        setIsAdding(false)
    }

    const resetForm = () => {
        setFormData({ title: '', description: '', live_url: '', category: '', market_type: 'local', tech_stack: '' })
        setSelectedFile(null)
        const fileInput = document.getElementById('case-study-file') as HTMLInputElement
        if (fileInput) fileInput.value = ''
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-white tracking-tight">Portfolio Case Studies</h2>
                {!isAdding && !editingId && (
                    <button
                        onClick={() => { resetForm(); setIsAdding(true); }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-zinc-950 hover:bg-zinc-200 transition-colors rounded text-xs font-bold font-mono"
                    >
                        <Plus className="w-3.5 h-3.5" /> ADD NEW
                    </button>
                )}
            </div>

            {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-mono text-red-400 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {(isAdding || editingId) && (
                <form onSubmit={editingId ? handleEdit : handleAdd} className="p-6 border border-zinc-800 bg-zinc-900/50 rounded-2xl space-y-6 shadow-xl relative">
                    <div className="flex justify-between items-center border-b border-zinc-800/80 pb-4">
                        <h3 className="text-sm font-semibold text-white uppercase tracking-widest font-mono">{editingId ? 'Edit Portfolio Asset' : 'Deploy Portfolio Asset'}</h3>
                        <button type="button" onClick={() => { resetForm(); setIsAdding(false); setEditingId(null); }} className="text-zinc-500 hover:text-white transition-colors bg-zinc-900 border border-zinc-800 p-1.5 rounded">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5 md:col-span-2">
                            <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Project Title</label>
                            <input
                                required
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-zinc-600 font-mono transition-colors"
                                placeholder="e.g. Aura Hotel"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Category Label</label>
                            <input
                                required
                                value={formData.category}
                                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-zinc-600 font-mono transition-colors"
                                placeholder="e.g. Full-Stack Web App"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Market Segment</label>
                            <select
                                value={formData.market_type}
                                onChange={(e) => setFormData(prev => ({ ...prev, market_type: e.target.value as any }))}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-zinc-600 font-mono appearance-none transition-colors"
                            >
                                <option value="local">Local Market</option>
                                <option value="international">International Market</option>
                                <option value="both">Both Markets</option>
                            </select>
                        </div>

                        <div className="space-y-1.5 md:col-span-2">
                            <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Functional Description</label>
                            <textarea
                                required
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-zinc-600 font-mono resize-none transition-colors"
                                placeholder="Project parameters and outcome description..."
                            />
                        </div>

                        <div className="space-y-1.5 md:col-span-2">
                            <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Technology Stack Array</label>
                            <input
                                value={formData.tech_stack}
                                onChange={(e) => setFormData(prev => ({ ...prev, tech_stack: e.target.value }))}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-300 focus:outline-none focus:border-zinc-600 font-mono transition-colors"
                                placeholder="e.g. React, Next.js, Supabase, Tailwind CSS"
                            />
                            <p className="text-[10px] font-mono text-zinc-600 pt-1">Comma-separated inputs will render as styled tag pills.</p>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Live Link URL</label>
                            <input
                                type="url"
                                value={formData.live_url}
                                onChange={(e) => setFormData(prev => ({ ...prev, live_url: e.target.value }))}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-zinc-600 font-mono transition-colors"
                                placeholder="https://..."
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Project Cover Visual</label>
                            <input
                                id="case-study-file"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                className="block w-full text-xs text-zinc-400 file:mr-4 file:py-2.5 file:px-4 file:rounded file:border-0 file:text-[10px] file:uppercase file:tracking-widest file:bg-zinc-900 file:text-zinc-300 hover:file:bg-zinc-800 file:font-mono font-mono cursor-pointer bg-zinc-950 border border-zinc-800 rounded-lg focus:outline-none transition-colors"
                            />
                            {editingId && !selectedFile && (
                                <p className="text-[10px] text-emerald-500/70 font-mono mt-1 pt-1">// Original asset securely preserved.</p>
                            )}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-zinc-800/80">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-zinc-950 hover:bg-zinc-200 transition-colors rounded-lg text-xs font-mono font-bold w-full uppercase tracking-widest"
                        >
                            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                            {isSubmitting ? 'UPLOADING ASSET...' : 'DEPLOY PORTFOLIO RECORD'}
                        </button>
                    </div>
                </form>
            )}

            {isLoading ? (
                <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-zinc-600" /></div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {caseStudies.map((cs) => (
                        <div key={cs.id} className="group relative border border-zinc-900 bg-zinc-950 rounded-2xl overflow-hidden flex flex-col hover:border-zinc-800 transition-colors">
                            {/* Visual Image Backdrop */}
                            <div className="h-56 bg-zinc-900 relative overflow-hidden">
                                {cs.image ? (
                                    <img src={cs.image} alt={cs.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center border-b border-zinc-800">
                                        <ImageIcon className="w-8 h-8 text-zinc-800" />
                                    </div>
                                )}
                                
                                {/* Overlay Tags */}
                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1.5 bg-zinc-950/80 backdrop-blur-md border border-zinc-800/50 text-white text-[10px] uppercase tracking-widest font-mono rounded-full">
                                        {cs.category}
                                    </span>
                                </div>
                                <div className="absolute top-4 right-4">
                                    <span className="px-2 py-1.5 bg-zinc-950/90 backdrop-blur-md text-[9px] font-mono text-zinc-400 uppercase tracking-widest rounded border border-zinc-800/50">
                                        // {cs.market_type === 'both' ? 'GLOBAL' : cs.market_type}_VIEW
                                    </span>
                                </div>
                            </div>
                            
                            <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start gap-4">
                                        <h3 className="text-2xl font-bold text-white leading-tight tracking-tight">{cs.title}</h3>
                                        {cs.live_url && (
                                            <a href={cs.live_url} target="_blank" rel="noreferrer" className="flex-shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:bg-white hover:text-zinc-950 hover:border-white transition-all shadow-lg">
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        )}
                                    </div>
                                    <p className="text-sm text-zinc-400 font-mono leading-relaxed line-clamp-3">{cs.description}</p>
                                </div>

                                {cs.tech_stack && cs.tech_stack.length > 0 && (
                                    <div className="flex flex-wrap gap-2 pt-6 border-t border-zinc-900/50">
                                        {cs.tech_stack.map((tech, idx) => (
                                            <span key={idx} className="px-3 py-1.5 rounded-md bg-zinc-900 text-zinc-300 border border-zinc-800 text-[10px] font-mono uppercase tracking-widest">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            
                            {/* Admin Actions */}
                            <div className="px-6 pb-6 pt-0 flex gap-3 mt-4">
                                <button onClick={() => startEdit(cs)} className="flex-1 inline-flex items-center justify-center gap-1.5 py-3 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:text-white transition-colors rounded-xl text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold shadow-sm">
                                    <Pencil className="w-3.5 h-3.5" /> Edit
                                </button>
                                <button onClick={() => handleDelete(cs.id)} className="flex-1 inline-flex items-center justify-center gap-1.5 py-3 bg-zinc-900 border border-zinc-800 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-colors rounded-xl text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold shadow-sm">
                                    <Trash2 className="w-3.5 h-3.5" /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
