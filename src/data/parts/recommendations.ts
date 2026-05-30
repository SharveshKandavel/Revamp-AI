
import { Part, PurposeType, PartCategory } from './types';
import { CPUs } from './cpus';
import { GPUs } from './gpus';
import { Motherboards } from './motherboards';
import { RAMs } from './ram';
import { StorageDevices } from './storage';
import { PowerSupplies } from './power-supplies';
import { Cases } from './cases';
import { Monitors } from './monitors';

const getPartsForCategory = (category: PartCategory): Part[] => {
  switch (category) {
    case 'CPU': return CPUs;
    case 'GPU': return GPUs;
    case 'Motherboard': return Motherboards;
    case 'RAM': return RAMs;
    case 'Storage': return StorageDevices;
    case 'PowerSupply': return PowerSupplies;
    case 'Case': return Cases;
    case 'Monitor': return Monitors;
    default: return [];
  }
};

export const recommendParts = (purpose: PurposeType, budget: number) => {
  const categories: PartCategory[] = ['CPU', 'GPU', 'Motherboard', 'RAM', 'Storage', 'PowerSupply', 'Case', 'Monitor'];
  const result: Record<PartCategory, Part[]> = {
    CPU: [],
    GPU: [],
    Motherboard: [],
    RAM: [],
    Storage: [],
    PowerSupply: [],
    Case: [],
    Monitor: []
  };

  // Allocate budget percentages based on purpose
  const budgetAllocations: Record<PartCategory, number> = {
    CPU: purpose === 'Gaming' ? 0.2 : 0.3,
    GPU: purpose === 'Gaming' ? 0.3 : 0.2,
    Motherboard: 0.1,
    RAM: 0.1,
    Storage: 0.1,
    PowerSupply: 0.05,
    Case: 0.05,
    Monitor: 0.2 // Allocate significant budget to monitor
  };

  categories.forEach(category => {
    const categoryBudget = budget * budgetAllocations[category];
    const parts = getPartsForCategory(category)
      .filter(part => 
        part.price <= categoryBudget && 
        part.recommendedFor.includes(purpose)
      )
      .sort((a, b) => b.performance - a.performance)
      .slice(0, 3);  // Get top 3 recommendations

    result[category] = parts;
  });

  return result;
};
