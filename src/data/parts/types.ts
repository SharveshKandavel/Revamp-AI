
export type PartCategory = 
  | 'CPU' 
  | 'GPU' 
  | 'Motherboard' 
  | 'RAM' 
  | 'Storage' 
  | 'PowerSupply' 
  | 'Case' 
  | 'Monitor';

export type PurposeType = 'Gaming' | 'VideoEditing' | 'Programming' | 'EverydayUse';

export interface Part {
  id: string;
  category: PartCategory;
  name: string;
  brand: string;
  price: number;
  image: string;
  specs: Record<string, string | number>;
  recommendedFor: PurposeType[];
  performance: number;
}
