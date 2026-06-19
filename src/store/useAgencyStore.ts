import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type TargetMarket = 'local' | 'international'

export interface SelectedPackage {
    scope: string
    title: string
    timestamp: number
}

interface AgencyState {
    market: TargetMarket
    currency: 'ETB' | 'USD'
    setMarket: (market: TargetMarket) => void
    toggleMarket: () => void
    selectedPackage: SelectedPackage | null
    selectPackage: (scope: string, title: string) => void
}

export const useAgencyStore = create<AgencyState>()(
    persist(
        (set) => ({
            market: 'international', // High-ticket default
            currency: 'USD',
            selectedPackage: null,
            setMarket: (market) =>
                set({
                    market,
                    currency: market === 'local' ? 'ETB' : 'USD'
                }),
            toggleMarket: () =>
                set((state) => {
                    const nextMarket = state.market === 'international' ? 'local' : 'international'
                    return {
                        market: nextMarket,
                        currency: nextMarket === 'local' ? 'ETB' : 'USD'
                    }
                }),
            selectPackage: (scope, title) =>
                set({
                    selectedPackage: {
                        scope,
                        title,
                        timestamp: Date.now()
                    }
                }),
        }),
        {
            name: 'aura-market-storage', // The unique key name for the browser local storage row
        }
    )
)