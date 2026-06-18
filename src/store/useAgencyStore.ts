import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type TargetMarket = 'local' | 'international'

interface AgencyState {
    market: TargetMarket
    currency: 'ETB' | 'USD'
    setMarket: (market: TargetMarket) => void
    toggleMarket: () => void
}

export const useAgencyStore = create<AgencyState>()(
    persist(
        (set) => ({
            market: 'international', // High-ticket default
            currency: 'USD',
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
        }),
        {
            name: 'aura-market-storage', // The unique key name for the browser local storage row
        }
    )
)