import { create } from 'zustand';
import { Part, PartCategory, PurposeType } from '@/data/parts/types';
import { isCompatible } from '@/data/parts/compatibility';
import { recommendParts } from '@/data/parts/recommendations';
import { supabase } from '@/lib/supabase';

interface BuildState {
  purpose: PurposeType | null;
  budget: number;
  selectedParts: Record<PartCategory, Part | null>;
  recommendations: Record<PartCategory, Part[]>;
  catalog: Part[]; // All parts from Supabase
  isLoading: boolean;
  compatibilityResult: { compatible: boolean; message?: string };
  userType: string | null;
  buildMode: 'manual' | 'automatic' | null;
  assemblyOption: 'self' | 'professional' | null;
  
  // Actions
  fetchCatalog: () => Promise<void>;
  setPurpose: (purpose: PurposeType) => void;
  setBudget: (budget: number) => void;
  selectPart: (category: PartCategory, part: Part | null) => void;
  clearSelection: () => void;
  setUserType: (type: string) => void;
  setBuildMode: (mode: 'manual' | 'automatic' | null) => void;
  setAssemblyOption: (option: 'self' | 'professional' | null) => void;
  
  // Computed
  updateRecommendations: () => void;
  checkCompatibility: () => void;
}

export const useBuildStore = create<BuildState>((set, get) => ({
  purpose: null,
  budget: 0,
  selectedParts: {
    CPU: null, GPU: null, Motherboard: null, RAM: null,
    Storage: null, PowerSupply: null, Case: null, Monitor: null,
  },
  recommendations: {
    CPU: [], GPU: [], Motherboard: [], RAM: [],
    Storage: [], PowerSupply: [], Case: [], Monitor: [],
  },
  catalog: [],
  isLoading: false,
  compatibilityResult: { compatible: true },
  userType: null,
  buildMode: null,
  assemblyOption: null,

  fetchCatalog: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*');
      
      if (error) throw error;

      // Transform Supabase products back into Part format
      const parts: Part[] = (data || []).map(p => ({
        id: p.id,
        asin: p.asin,
        category: p.category as PartCategory,
        name: p.name,
        brand: p.manufacturer || 'Unknown',
        price: p.price,
        current_price_cents: p.current_price_cents,
        image: p.image_url,
        specs: p.specs,
        recommendedFor: ['Gaming', 'Programming'], // Default or derived
        performance: 8, // Derived from specs in a real app
        amazon_url: p.amazon_url
      }));

      set({ catalog: parts });
      get().updateRecommendations();
    } catch (err) {
      console.error("Failed to fetch catalog:", err);
    } finally {
      set({ isLoading: false });
    }
  },

  setPurpose: (purpose) => {
    set({ purpose });
    get().updateRecommendations();
  },

  setBudget: (budget) => {
    set({ budget });
    get().updateRecommendations();
  },

  selectPart: (category, part) => {
    set((state) => ({
      selectedParts: { ...state.selectedParts, [category]: part },
    }));
    get().checkCompatibility();
  },

  clearSelection: () => {
    set({
      selectedParts: {
        CPU: null, GPU: null, Motherboard: null, RAM: null,
        Storage: null, PowerSupply: null, Case: null, Monitor: null,
      },
      compatibilityResult: { compatible: true },
    });
  },

  setUserType: (type) => {
    set({ userType: type });
    if (type !== 'customer') {
      get().clearSelection();
      set({ purpose: null, budget: 0, buildMode: null, assemblyOption: null });
    }
  },

  setBuildMode: (mode) => set({ buildMode: mode }),
  setAssemblyOption: (option) => set({ assemblyOption: option }),

  updateRecommendations: () => {
    const { purpose, budget, catalog } = get();
    if (!purpose || budget <= 0) return;

    // Filter catalog instead of using mock data
    const filtered: Record<PartCategory, Part[]> = {
      CPU: [], GPU: [], Motherboard: [], RAM: [],
      Storage: [], PowerSupply: [], Case: [], Monitor: [],
    };

    catalog.forEach(part => {
      if (part.price <= budget && part.category in filtered) {
        filtered[part.category].push(part);
      }
    });

    set({ recommendations: filtered });
  },

  checkCompatibility: () => {
    const { selectedParts } = get();
    const result = isCompatible(selectedParts as any);
    set({ compatibilityResult: result });
  },
}));

// Helper selector for total price
export const useTotalPrice = () => {
  const selectedParts = useBuildStore((state) => state.selectedParts);
  return Object.values(selectedParts).reduce(
    (sum, part) => sum + (part ? part.price : 0),
    0
  );
};
