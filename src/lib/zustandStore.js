import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useGasStore = create(
  persist(
    (set) => ({
      mode: 'live',
      chains: {
        ethereum: { baseFee: 0, priorityFee: 0, history: [] },
        polygon: { baseFee: 0, priorityFee: 0, history: [] },
        arbitrum: { baseFee: 0, priorityFee: 0, history: [] },
      },
      usdPrice: 0,
      simulatedCost: {},
      isLoading: false,
      error: null,

      setMode: (mode) => set({ mode }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      updateChainData: (chain, baseFee, priorityFee) =>
        set((state) => {
          const newPoint = {
            time: Math.floor(Date.now() / 1000),
            value: baseFee + priorityFee,
          };
          return {
            chains: {
              ...state.chains,
              [chain]: {
                baseFee,
                priorityFee,
                history: [...state.chains[chain].history.slice(-59), newPoint],
              },
            },
          };
        }),

      setUsdPrice: (price) => set({ usdPrice: price }),
      setSimulatedCost: (cost) => set({ simulatedCost: cost }),
    }),
    {
      name: 'gas-store',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ mode: state.mode }),
    }
  )
);