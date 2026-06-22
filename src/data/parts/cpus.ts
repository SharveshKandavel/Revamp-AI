import { Part } from './types';

export const CPUs: Part[] = [
  // CPUs
  {
    id: 'cpu-1',
    category: 'CPU',
    name: 'Ryzen 5 5600X',
    brand: 'AMD',
    price: 283,
    image: '/placeholder.svg',
    specs: {
      cores: 6,
      threads: 12,
      baseClock: '3.7GHz',
      boostClock: '4.6GHz',
      tdp: 65,
      socket: 'AM4'
    },
    recommendedFor: ['Gaming', 'Programming', 'EverydayUse'],
    performance: 7
  },
  {
    id: 'cpu-2',
    category: 'CPU',
    name: 'Core i5-12600K',
    brand: 'Intel',
    price: 367,
    image: '/placeholder.svg',
    specs: {
      cores: 10,
      threads: 16,
      baseClock: '3.7GHz',
      boostClock: '4.9GHz',
      tdp: 125,
      socket: 'LGA1700'
    },
    recommendedFor: ['Gaming', 'Programming', 'VideoEditing'],
    performance: 8
  },
  {
    id: 'cpu-3',
    category: 'CPU',
    name: 'Ryzen 7 5800X',
    brand: 'AMD',
    price: 467,
    image: '/placeholder.svg',
    specs: {
      cores: 8,
      threads: 16,
      baseClock: '3.8GHz',
      boostClock: '4.7GHz',
      tdp: 105,
      socket: 'AM4'
    },
    recommendedFor: ['Gaming', 'VideoEditing', 'Programming'],
    performance: 9
  },
  {
    id: 'cpu-4',
    category: 'CPU',
    name: 'Core i3-12100F',
    brand: 'Intel',
    price: 150,
    image: '/placeholder.svg',
    specs: {
      cores: 4,
      threads: 8,
      baseClock: '3.3GHz',
      boostClock: '4.3GHz',
      tdp: 58,
      socket: 'LGA1700'
    },
    recommendedFor: ['EverydayUse', 'Programming'],
    performance: 5
  },
  {
    id: 'cpu-5',
    category: 'CPU',
    name: 'Ryzen 9 7950X',
    brand: 'AMD',
    price: 917,
    image: '/placeholder.svg',
    specs: {
      cores: 16,
      threads: 32,
      baseClock: '4.5GHz',
      boostClock: '5.7GHz',
      tdp: 170,
      socket: 'AM5'
    },
    recommendedFor: ['Gaming', 'VideoEditing', 'Programming'],
    performance: 10
  },
  {
    id: 'cpu-6',
    category: 'CPU',
    name: 'Core i9-13900K',
    brand: 'Intel',
    price: 967,
    image: '/placeholder.svg',
    specs: {
      cores: 24,
      threads: 32,
      baseClock: '3.0GHz',
      boostClock: '5.8GHz',
      tdp: 253,
      socket: 'LGA1700'
    },
    recommendedFor: ['Gaming', 'VideoEditing', 'Programming'],
    performance: 10
  },
  {
    id: 'cpu-7',
    category: 'CPU',
    name: 'Core i7-13700K',
    brand: 'Intel',
    price: 617,
    image: '/placeholder.svg',
    specs: {
      cores: 16,
      threads: 24,
      baseClock: '3.4GHz',
      boostClock: '5.4GHz',
      tdp: 125,
      socket: 'LGA1700'
    },
    recommendedFor: ['Gaming', 'VideoEditing', 'Programming'],
    performance: 9
  },
  {
    id: 'cpu-8',
    category: 'CPU',
    name: 'Ryzen 5 7600X',
    brand: 'AMD',
    price: 400,
    image: '/placeholder.svg',
    specs: {
      cores: 6,
      threads: 12,
      baseClock: '4.7GHz',
      boostClock: '5.3GHz',
      tdp: 105,
      socket: 'AM5'
    },
    recommendedFor: ['Gaming', 'Programming'],
    performance: 8
  },
  {
    id: 'cpu-9',
    category: 'CPU',
    name: 'Core i3-13100F',
    brand: 'Intel',
    price: 183,
    image: '/placeholder.svg',
    specs: {
      cores: 4,
      threads: 8,
      baseClock: '3.4GHz',
      boostClock: '4.5GHz',
      tdp: 58,
      socket: 'LGA1700'
    },
    recommendedFor: ['EverydayUse', 'Programming'],
    performance: 6
  },
  {
    id: 'cpu-10',
    category: 'CPU',
    name: 'Ryzen 3 4100',
    brand: 'AMD',
    price: 117,
    image: '/placeholder.svg',
    specs: {
      cores: 4,
      threads: 8,
      baseClock: '3.8GHz',
      boostClock: '4.0GHz',
      tdp: 65,
      socket: 'AM4'
    },
    recommendedFor: ['EverydayUse'],
    performance: 4
  },
  {
    id: 'cpu-11',
    category: 'CPU',
    name: 'Core i7-14700K',
    brand: 'Intel',
    price: 717,
    image: '/placeholder.svg',
    specs: {
      cores: 20,
      threads: 28,
      baseClock: '3.4GHz',
      boostClock: '5.6GHz',
      tdp: 125,
      socket: 'LGA1700'
    },
    recommendedFor: ['Gaming', 'VideoEditing', 'Programming'],
    performance: 9.5
  },
];
