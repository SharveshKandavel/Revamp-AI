import { create } from 'zustand';
import { Part, PartCategory, PurposeType, Build } from '@/data/parts/types';
import { isCompatible } from '@/data/parts/compatibility';
import { recommendParts } from '@/data/parts/recommendations';
import { supabase } from '@/lib/supabase';

// Configuration
const API_BASE_URL = "/api";

interface BuildState {
  purpose: PurposeType | null;
  budget: number;
  selectedParts: Record<PartCategory, Part | null>;
  recommendations: Record<PartCategory, Part[]>;
  catalog: Part[]; // All parts from Backend
  isLoading: boolean;
  compatibilityResult: { compatible: boolean; message?: string };
  userType: string | null;
  buildMode: 'manual' | 'automatic' | null;
  assemblyOption: 'self' | 'professional' | null;
  
  // Actions
  fetchCatalog: () => Promise<void>;
  saveBuild: (title: string, description: string, userId: string) => Promise<any>;
  fetchUserBuilds: (userId: string) => Promise<Build[]>;
  fetchCommunityBuilds: () => Promise<Build[]>;
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
      // Fetch directly from Supabase for speed and reliability
      const { data, error } = await supabase.from('products').select('*');
      
      if (error) throw new Error(error.message);

      if (!data || data.length < 5) {
        throw new Error("Catalog is empty/sparse");
      }

      const parts: Part[] = data.map((p: any) => ({
        id: p.id,
        asin: p.asin,
        category: p.category as PartCategory,
        name: p.name,
        brand: p.manufacturer || 'Unknown',
        price: p.price,
        current_price_cents: p.current_price_cents,
        image: p.image_url,
        specs: p.specs,
        recommendedFor: ['Gaming', 'Programming'], 
        performance: 8,
        amazon_url: p.amazon_url
      }));

      set({ catalog: parts });
    } catch (err) {
      console.error("Failed to load catalog from Supabase:", err);
      // Empty catalog state handled gracefully by UI
      set({ catalog: [] });
    } finally {
      get().updateRecommendations();
      set({ isLoading: false });
    }
  },

  saveBuild: async (title: string, description: string, userId: string) => {
    const { selectedParts, compatibilityResult } = get();
    const totalPrice = Object.values(selectedParts).reduce(
      (sum, part) => sum + (part ? part.price : 0), 0
    );

    const buildData = {
      user_id: userId,
      title,
      description,
      parts: selectedParts,
      total_price: totalPrice,
      compatibility_score: compatibilityResult.compatible ? 100 : 50,
      performance_metrics: {},
      likes: 0,
      is_public: true,
    };

    const { data, error } = await supabase
      .from('builds')
      .insert(buildData)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  fetchUserBuilds: async (userId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/builds/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch user builds");
      return await response.json();
    } catch (err) {
      console.error("User builds fetch error:", err);
      return [];
    }
  },

  fetchCommunityBuilds: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/builds`);
      if (!response.ok) throw new Error("Failed to fetch community builds");
      const builds = await response.json();
      return builds.filter((b: any) => b.is_public);
    } catch (err) {
      console.error("Community builds fetch error:", err);
      return [];
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

    const filtered: Record<PartCategory, Part[]> = {
      CPU: [], GPU: [], Motherboard: [], RAM: [],
      Storage: [], PowerSupply: [], Case: [], Monitor: [],
    };

    // Allocate budget percentages based on purpose
    const budgetAllocations: Record<PartCategory, number> = {
      CPU: purpose === 'Gaming' ? 0.25 : 0.35,
      GPU: purpose === 'Gaming' ? 0.40 : 0.20,
      Motherboard: 0.10,
      RAM: 0.08,
      Storage: 0.07,
      PowerSupply: 0.05,
      Case: 0.05,
      Monitor: 0.0 // Handled separately or optional if we don't strictly bind it to core budget
    };

    Object.keys(filtered).forEach(cat => {
      const category = cat as PartCategory;
      // If category is monitor, give it a fixed generic allowance or 20% of budget on top
      const categoryBudget = category === 'Monitor' 
        ? budget * 0.2 
        : budget * budgetAllocations[category];

      // Filter parts for this category within budget, then sort by price descending to get the best parts they can afford
      const parts = catalog
        .filter(p => p.category === category && p.price > 0 && p.price <= categoryBudget)
        .sort((a, b) => b.price - a.price)
        .slice(0, 15); // Keep top 15 recommendations per category
      
      // Fallback: if budget is too strict and returns 0 parts, just give them the 5 cheapest parts in that category
      if (parts.length === 0) {
        const cheapestParts = catalog
          .filter(p => p.category === category && p.price > 0)
          .sort((a, b) => a.price - b.price)
          .slice(0, 5);
        filtered[category] = cheapestParts;
      } else {
        filtered[category] = parts;
      }
    });

    set({ recommendations: filtered });
  },

  checkCompatibility: () => {
    const { selectedParts, purpose } = get();
    const result = isCompatible(selectedParts as Record<string, import('@/data/parts/types').Part | null>, purpose);
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
