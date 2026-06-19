'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Loader2, Plus, Pencil, Trash2, X, AlertCircle, CheckCircle2 } from 'lucide-react'

export interface ServiceRow {
    id: string
    created_at: string
    title: string
    description: string
    price: string
    price_suffix: string
    market_type: 'local' | 'international' | 'both'
    features_list: string[]
}

export default function ManageServices() {
    const [services, setServices] = useState<ServiceRow[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    
    // Form States
    const [isAdding, setIsAdding] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [formData, setFormData] = useState({ 
        title: '', 
        description: '',
        price: '',
        price_suffix: '',
        market_type: 'local' as 'local' | 'international' | 'both',
        features_list: '' // Internal string representation for editing
    })

    useEffect(() => {
        fetchServices()
    }, [])

    const fetchServices = async () => {
        try {
            const { data, error } = await supabase.from('services').select('*').order('created_at', { ascending: false })
            if (error) throw error
            setServices(data || [])
        } catch (err: any) {
            setError(err.message || 'Failed to load services.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)
        try {
            const features = formData.features_list.split(',').map(s => s.trim()).filter(Boolean)
            const payload = { ...formData, features_list: features }

            const { data, error } = await supabase.from('services').insert([payload]).select().single()
            if (error) throw error
            setServices(prev => [data, ...prev])
            resetForm()
            setIsAdding(false)
        } catch (err: any) {
            setError(err.message || 'Failed to add service.')
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
            const features = formData.features_list.split(',').map(s => s.trim()).filter(Boolean)
            const payload = { ...formData, features_list: features }

            const { data, error } = await supabase.from('services').update(payload).eq('id', editingId).select().single()
            if (error) throw error
            setServices(prev => prev.map(s => s.id === editingId ? data : s))
            resetForm()
            setEditingId(null)
        } catch (err: any) {
            setError(err.message || 'Failed to update service.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this service?")) return
        try {
            const { error } = await supabase.from('services').delete().eq('id', id)
            if (error) throw error
            setServices(prev => prev.filter(s => s.id !== id))
        } catch (err: any) {
            alert("Delete Error: " + (err.message || 'Failed to delete service.'))
        }
    }

    const startEdit = (service: ServiceRow) => {
        setEditingId(service.id)
        setFormData({ 
            title: service.title || '', 
            description: service.description || '',
            price: service.price || '',
            price_suffix: service.price_suffix || '',
            market_type: service.market_type || 'both',
            features_list: (service.features_list || []).join(', ')
        })
        setIsAdding(false)
    }

    const resetForm = () => {
        setFormData({ 
            title: '', 
            description: '',
            price: '',
            price_suffix: '',
            market_type: 'local',
            features_list: '' 
        })
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-white tracking-tight">Services Matrix</h2>
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
                        <h3 className="text-sm font-semibold text-white uppercase tracking-widest font-mono">{editingId ? 'Edit Blueprint' : 'New Service Blueprint'}</h3>
                        <button type="button" onClick={() => { resetForm(); setIsAdding(false); setEditingId(null); }} className="text-zinc-500 hover:text-white transition-colors bg-zinc-900 border border-zinc-800 p-1.5 rounded">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5 md:col-span-2">
                            <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Service Title</label>
                            <input
                                required
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-zinc-600 font-mono transition-colors"
                                placeholder="e.g. Enterprise Architecture"
                            />
                        </div>

                        <div className="space-y-1.5 md:col-span-2">
                            <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Operational Description</label>
                            <textarea
                                required
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-zinc-600 font-mono resize-none transition-colors"
                                placeholder="Detailed functional description..."
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

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Price String</label>
                                <input
                                    required
                                    value={formData.price}
                                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-zinc-600 font-mono transition-colors"
                                    placeholder="e.g. 45,000"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Suffix</label>
                                <input
                                    value={formData.price_suffix}
                                    onChange={(e) => setFormData(prev => ({ ...prev, price_suffix: e.target.value }))}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-zinc-600 font-mono transition-colors"
                                    placeholder="e.g. Br/mo, $+"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5 md:col-span-2">
                            <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Features Checklist Array</label>
                            <input
                                value={formData.features_list}
                                onChange={(e) => setFormData(prev => ({ ...prev, features_list: e.target.value }))}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-300 focus:outline-none focus:border-zinc-600 font-mono transition-colors"
                                placeholder="Separate features with commas (e.g. Secure Portals, Automated Metrics)"
                            />
                            <p className="text-[10px] font-mono text-zinc-600 pt-1">Will be automatically formatted into an array and mapped to CheckCircle components.</p>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-zinc-800/80">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-zinc-950 hover:bg-zinc-200 transition-colors rounded-lg text-xs font-mono font-bold w-full uppercase tracking-widest"
                        >
                            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                            {isSubmitting ? 'SYNCING PIPELINE...' : 'DEPLOY SERVICE RECORD'}
                        </button>
                    </div>
                </form>
            )}

            {isLoading ? (
                <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-zinc-600" /></div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {services.map((service) => (
                        <div key={service.id} className="p-6 border border-zinc-900 bg-zinc-950 rounded-2xl flex flex-col hover:border-zinc-800 transition-colors relative overflow-hidden group">
                            
                            {/* Market Type View Indicator */}
                            <div className="absolute top-4 right-4">
                                <span className="text-[9px] font-mono text-zinc-600 bg-zinc-900/50 px-2 py-1 rounded border border-zinc-800/50 uppercase tracking-widest">
                                    // {service.market_type === 'both' ? 'GLOBAL' : service.market_type}_VIEW
                                </span>
                            </div>

                            <div className="space-y-6 flex-1 pt-6">
                                <div className="space-y-3">
                                    <h3 className="text-xl font-bold text-white tracking-tight leading-tight">{service.title}</h3>
                                    <p className="text-sm text-zinc-400 font-mono leading-relaxed line-clamp-2">{service.description}</p>
                                </div>

                                <div className="flex items-baseline gap-1.5 border-l-2 border-emerald-500 pl-4 py-1">
                                    <span className="text-3xl font-extrabold text-white tracking-tighter">{service.price}</span>
                                    <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">{service.price_suffix}</span>
                                </div>

                                {service.features_list && service.features_list.length > 0 && (
                                    <ul className="space-y-3 pt-4 border-t border-zinc-900/80">
                                        {service.features_list.map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-3">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                                <span className="text-xs font-mono text-zinc-300">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <div className="flex gap-3 pt-6 mt-6 border-t border-zinc-900/80">
                                <button onClick={() => startEdit(service)} className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:text-white transition-colors rounded-lg text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold">
                                    <Pencil className="w-3 h-3" /> Edit
                                </button>
                                <button onClick={() => handleDelete(service.id)} className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 bg-zinc-900 border border-zinc-800 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-colors rounded-lg text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold">
                                    <Trash2 className="w-3 h-3" /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
