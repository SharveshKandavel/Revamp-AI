import { create } from 'zustand';
import { Part, PartCategory, PurposeType, Build } from '@/data/parts/types';
import { isCompatible } from '@/data/parts/compatibility';
import { recommendParts } from '@/data/parts/recommendations';
import { supabase } from '@/lib/supabase';

// Configuration
const API_BASE_URL = "http://localhost:8000";

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
      // Try to fetch from backend
      const response = await fetch(`${API_BASE_URL}/catalog`);
      if (!response.ok) throw new Error("Backend unavailable");
      
      const data = await response.json();

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
      console.warn("Falling back to local static catalog due to backend error:", err);
      // Import PARTS dynamically or use it if imported at top
      const { PARTS } = await import('@/data/mockData');
      set({ catalog: PARTS as Part[] });
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
