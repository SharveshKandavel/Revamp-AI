
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
  id: string | number;
  asin?: string;
  category: PartCategory;
  name: string;
  brand: string;
  price: number;
  current_price_cents?: number;
  image: string;
  specs: Record<string, any>;
  recommendedFor: PurposeType[];
  performance: number;
  amazon_url?: string;
}
