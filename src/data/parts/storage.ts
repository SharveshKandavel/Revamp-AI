import { Part } from './types';

export const StorageDevices: Part[] = [
  {
    id: 'storage-1',
    category: 'Storage',
    name: '970 EVO Plus 1TB',
    brand: 'Samsung',
    price: 167,
    image: '/placeholder.svg',
    specs: {
      capacity: '1TB',
      type: 'NVMe SSD',
      readSpeed: '3500MB/s',
      writeSpeed: '3300MB/s',
      interface: 'PCIe 3.0 x4'
    },
    recommendedFor: ['Gaming', 'VideoEditing', 'Programming'],
    performance: 9
  },
  {
    id: 'storage-2',
    category: 'Storage',
    name: 'Barracuda 2TB',
    brand: 'Seagate',
    price: 72,
    image: '/placeholder.svg',
    specs: {
      capacity: '2TB',
      type: 'HDD',
      rpm: 7200,
      cache: '256MB',
      interface: 'SATA 6Gb/s'
    },
    recommendedFor: ['EverydayUse', 'Gaming'],
    performance: 5
  },
  {
    id: 'storage-3',
    category: 'Storage',
    name: '980 PRO 2TB',
    brand: 'Samsung',
    price: 333,
    image: '/placeholder.svg',
    specs: {
      capacity: '2TB',
      type: 'NVMe SSD Gen4',
      readSpeed: '7000MB/s',
      writeSpeed: '5100MB/s',
      interface: 'PCIe 4.0 x4'
    },
    recommendedFor: ['Gaming', 'VideoEditing'],
    performance: 10
  },
  {
    id: 'storage-4',
    category: 'Storage',
    name: 'FireCuda 4TB',
    brand: 'Seagate',
    price: 167,
    image: '/placeholder.svg',
    specs: {
      capacity: '4TB',
      type: 'SSHD',
      rpm: 7200,
      cache: '1TB NAND',
      interface: 'SATA 6Gb/s'
    },
    recommendedFor: ['Gaming', 'VideoEditing'],
    performance: 7
  },
  {
    id: 'storage-5',
    category: 'Storage',
    name: 'SN850X 2TB',
    brand: 'Western Digital',
    price: 300,
    image: '/placeholder.svg',
    specs: {
      capacity: '2TB',
      type: 'NVMe SSD Gen4',
      readSpeed: '7300MB/s',
      writeSpeed: '6600MB/s',
      interface: 'PCIe 4.0 x4'
    },
    recommendedFor: ['Gaming', 'VideoEditing'],
    performance: 9
  },
  {
    id: 'storage-6',
    category: 'Storage',
    name: 'MP600 PRO XT 4TB',
    brand: 'Corsair',
    price: 617,
    image: '/placeholder.svg',
    specs: {
      capacity: '4TB',
      type: 'NVMe SSD Gen4',
      readSpeed: '7100MB/s',
      writeSpeed: '6800MB/s',
      interface: 'PCIe 4.0 x4'
    },
    recommendedFor: ['VideoEditing', 'Programming'],
    performance: 10
  },
  {
    id: 'storage-7',
    category: 'Storage',
    name: 'IronWolf Pro 8TB',
    brand: 'Seagate',
    price: 317,
    image: '/placeholder.svg',
    specs: {
      capacity: '8TB',
      type: 'HDD',
      rpm: 7200,
      cache: '256MB',
      interface: 'SATA 6Gb/s'
    },
    recommendedFor: ['VideoEditing'],
    performance: 6
  },
  {
    id: 'storage-8',
    category: 'Storage',
    name: 'KC3000 2TB',
    brand: 'Kingston',
    price: 283,
    image: '/placeholder.svg',
    specs: {
      capacity: '2TB',
      type: 'NVMe SSD Gen4',
      readSpeed: '7000MB/s',
      writeSpeed: '7000MB/s',
      interface: 'PCIe 4.0 x4'
    },
    recommendedFor: ['Gaming', 'VideoEditing'],
    performance: 9.5
  },
  {
    id: 'storage-9',
    category: 'Storage',
    name: 'Blue SN570 500GB',
    brand: 'Western Digital',
    price: 75,
    image: '/placeholder.svg',
    specs: {
      capacity: '500GB',
      type: 'NVMe SSD',
      readSpeed: '3500MB/s',
      writeSpeed: '2300MB/s',
      interface: 'PCIe 3.0 x4'
    },
    recommendedFor: ['Programming', 'EverydayUse'],
    performance: 7
  },
];
