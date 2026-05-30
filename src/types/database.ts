
import { PartCategory } from "@/data/mockData";

export interface Product {
  id: number;
  seller_id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image_url: string;
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
  parts: Record<PartCategory, any>;
  performance: string;
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
