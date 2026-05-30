import { Part } from './types';

export const Motherboards: Part[] = [
  {
    id: 'mb-1',
    category: 'Motherboard',
    name: 'B550 Gaming Plus',
    brand: 'MSI',
    price: 12999,
    image: '/placeholder.svg',
    specs: {
      socket: 'AM4',
      chipset: 'B550',
      memorySlots: 4,
      maxMemory: '128GB',
      formFactor: 'ATX'
    },
    recommendedFor: ['Gaming', 'Programming', 'VideoEditing', 'EverydayUse'],
    performance: 7
  },
  {
    id: 'mb-2',
    category: 'Motherboard',
    name: 'Z690 Gaming X',
    brand: 'Gigabyte',
    price: 19999,
    image: '/placeholder.svg',
    specs: {
      socket: 'LGA1700',
      chipset: 'Z690',
      memorySlots: 4,
      maxMemory: '128GB',
      formFactor: 'ATX'
    },
    recommendedFor: ['Gaming', 'Programming', 'VideoEditing'],
    performance: 8
  },
  {
    id: 'mb-3',
    category: 'Motherboard',
    name: 'ROG Strix X670E-E',
    brand: 'ASUS',
    price: 42999,
    image: '/placeholder.svg',
    specs: {
      socket: 'AM5',
      chipset: 'X670E',
      memorySlots: 4,
      maxMemory: '128GB',
      formFactor: 'ATX'
    },
    recommendedFor: ['Gaming', 'VideoEditing'],
    performance: 9
  },
  {
    id: 'mb-4',
    category: 'Motherboard',
    name: 'MAG B760M Mortar',
    brand: 'MSI',
    price: 15999,
    image: '/placeholder.svg',
    specs: {
      socket: 'LGA1700',
      chipset: 'B760',
      memorySlots: 4,
      maxMemory: '128GB',
      formFactor: 'Micro-ATX'
    },
    recommendedFor: ['Gaming', 'Programming', 'EverydayUse'],
    performance: 7
  },
  {
    id: 'mb-5',
    category: 'Motherboard',
    name: 'B650 AORUS Elite AX',
    brand: 'Gigabyte',
    price: 18999,
    image: '/placeholder.svg',
    specs: {
      socket: 'AM5',
      chipset: 'B650',
      memorySlots: 4,
      maxMemory: '128GB',
      formFactor: 'ATX'
    },
    recommendedFor: ['Gaming', 'Programming'],
    performance: 8
  },
];
