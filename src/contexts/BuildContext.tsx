
import React, { createContext, useContext, useState, ReactNode } from "react";
import { Part, PartCategory, PurposeType, recommendParts, isCompatible, PARTS } from "@/data/mockData";

interface BuildContextType {
  purpose: PurposeType | null;
  budget: number;
  selectedParts: Record<PartCategory, Part | null>;
  recommendations: Record<PartCategory, Part[]>;
  compatibilityResult: { compatible: boolean; message?: string };
  totalPrice: number;
  userType: string | null;
  buildMode: "manual" | "automatic" | null;
  assemblyOption: "self" | "professional" | null;
  
  setPurpose: (purpose: PurposeType) => void;
  setBudget: (budget: number) => void;
  selectPart: (category: PartCategory, part: Part | null) => void;
  clearSelection: () => void;
  generateRecommendations: () => void;
  checkCompatibility: () => { compatible: boolean; message?: string };
  setUserType: (type: string) => void;
  setBuildMode: (mode: "manual" | "automatic" | null) => void;
  setAssemblyOption: (option: "self" | "professional" | null) => void;
}

const BuildContext = createContext<BuildContextType | undefined>(undefined);

interface BuildProviderProps {
  children: ReactNode;
}

export const BuildProvider: React.FC<BuildProviderProps> = ({ children }) => {
  const [purpose, setPurpose] = useState<PurposeType | null>(null);
  const [budget, setBudget] = useState<number>(0);
  const [selectedParts, setSelectedParts] = useState<Record<PartCategory, Part | null>>({
    CPU: null,
    GPU: null,
    Motherboard: null,
    RAM: null,
    Storage: null,
    PowerSupply: null,
    Case: null,
    Monitor: null,
  });
  
  const [recommendations, setRecommendations] = useState<Record<PartCategory, Part[]>>({
    CPU: [],
    GPU: [],
    Motherboard: [],
    RAM: [],
    Storage: [],
    PowerSupply: [],
    Case: [],
    Monitor: [],
  });
  
  const [compatibilityResult, setCompatibilityResult] = useState<{ compatible: boolean; message?: string }>({
    compatible: true
  });

  const [userType, setUserType] = useState<string | null>(null);
  const [buildMode, setBuildMode] = useState<"manual" | "automatic" | null>(null);
  const [assemblyOption, setAssemblyOption] = useState<"self" | "professional" | null>(null);

  // Calculate total price
  const totalPrice = Object.values(selectedParts).reduce(
    (sum, part) => sum + (part ? part.price : 0),
    0
  );

  // Set purpose and generate initial recommendations
  const handleSetPurpose = (newPurpose: PurposeType) => {
    setPurpose(newPurpose);
    if (budget > 0) {
      const newRecommendations = recommendParts(newPurpose, budget);
      setRecommendations(newRecommendations);
    }
  };

  // Set budget and generate recommendations
  const handleSetBudget = (newBudget: number) => {
    setBudget(newBudget);
    if (purpose) {
      const newRecommendations = recommendParts(purpose, newBudget);
      setRecommendations(newRecommendations);
    }
  };

  // Select a part and check compatibility
  const selectPart = (category: PartCategory, part: Part | null) => {
    setSelectedParts(prev => {
      const newSelection = { ...prev, [category]: part };
      setCompatibilityResult(isCompatible(newSelection));
      return newSelection;
    });
  };

  // Clear all selections
  const clearSelection = () => {
    setSelectedParts({
      CPU: null,
      GPU: null,
      Motherboard: null,
      RAM: null,
      Storage: null,
      PowerSupply: null,
      Case: null,
      Monitor: null,
    });
    setCompatibilityResult({ compatible: true });
  };

  // Generate recommendations based on current purpose and budget
  const generateRecommendations = () => {
    if (purpose && budget > 0) {
      const newRecommendations = recommendParts(purpose, budget);
      setRecommendations(newRecommendations);
    }
  };

  // Check compatibility of current selected parts
  const checkCompatibility = () => {
    const result = isCompatible(selectedParts);
    setCompatibilityResult(result);
    return result;
  };

  // Handle user type changes
  const handleSetUserType = (type: string) => {
    setUserType(type);
    // Reset selections when user type changes
    if (type !== "customer") {
      clearSelection();
      setPurpose(null);
      setBudget(0);
      setBuildMode(null);
      setAssemblyOption(null);
    }
  };

  return (
    <BuildContext.Provider
      value={{
        purpose,
        budget,
        selectedParts,
        recommendations,
        compatibilityResult,
        totalPrice,
        userType,
        buildMode,
        assemblyOption,
        setPurpose: handleSetPurpose,
        setBudget: handleSetBudget,
        selectPart,
        clearSelection,
        generateRecommendations,
        checkCompatibility,
        setUserType: handleSetUserType,
        setBuildMode,
        setAssemblyOption,
      }}
    >
      {children}
    </BuildContext.Provider>
  );
};

export const useBuild = () => {
  const context = useContext(BuildContext);
  if (!context) {
    throw new Error("useBuild must be used within a BuildProvider");
  }
  return context;
};
