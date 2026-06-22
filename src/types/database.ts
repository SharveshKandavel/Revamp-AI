
import { PartCategory } from "@/data/parts/types";

export interface Product {
  id: number;
  seller_id: string | null;
  asin?: string;
  name: string;
  category: string;
  manufacturer?: string;
  model?: string;
  price: number;
  current_price_cents?: number;
  stock: number;
  image_url: string;
  specs: Record<string, any>;
  amazon_url?: string;
  last_updated?: string;
  created_at: string;
}

export interface Order {
  id: string;
  seller_id: string;
  customer_name: string;
  items: string[];
  total_price: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered';
  created_at: string;
}

export interface Build {
  id: number;
  user_id: string;
  title: string;
  description: string;
  total_price: number;
  parts: Record<string, any>; // Stores ASINs or product IDs
  compatibility_score: number;
  performance_metrics: Record<string, any>;
  likes: number;
  created_at: string;
  // UI extended props
  author?: string;
  image?: string;
  specs?: string[];
  difficulty?: string;
  category?: string;
  rating?: number;
}
