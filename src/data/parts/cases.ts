import { Part } from './types';

export const Cases: Part[] = [
  // Cases
  {
    id: 'case-1',
    category: 'Case',
    name: '4000D Airflow',
    brand: 'Corsair',
    price: 7999,
    image: '/placeholder.svg',
    specs: {
      formFactor: 'Mid Tower',
      motherboardSupport: 'ATX, Micro ATX, Mini ITX',
      fanSupport: '6x 120mm or 4x 140mm'
    },
    recommendedFor: ['Gaming', 'VideoEditing', 'Programming', 'EverydayUse'],
    performance: 8
  },
  {
    id: 'case-2',
    category: 'Case',
    name: 'H510',
    brand: 'NZXT',
    price: 6499,
    image: '/placeholder.svg',
    specs: {
      formFactor: 'Mid Tower',
      motherboardSupport: 'ATX, Micro ATX, Mini ITX',
      fanSupport: '4x 120mm'
    },
    recommendedFor: ['Gaming', 'EverydayUse'],
    performance: 7
  },
  {
    id: 'case-3',
    category: 'Case',
    name: 'Obsidian 1000D',
    brand: 'Corsair',
    price: 49999,
    image: '/placeholder.svg',
    specs: {
      formFactor: 'Super Tower',
      motherboardSupport: 'EATX, ATX, Micro ATX, Mini ITX',
      fanSupport: '18x 120mm or 13x 140mm'
    },
    recommendedFor: ['Gaming', 'VideoEditing'],
    performance: 10
  },
  {
    id: 'case-4',
    category: 'Case',
    name: 'Pure Base 500DX',
    brand: 'be quiet!',
    price: 8999,
    image: '/placeholder.svg',
    specs: {
      formFactor: 'Mid Tower',
      motherboardSupport: 'ATX, Micro ATX, Mini ITX',
      fanSupport: '6x 120mm'
    },
    recommendedFor: ['Gaming', 'Programming', 'EverydayUse'],
    performance: 8
  }
];
