
export * from './parts/types';
export * from './parts/compatibility';
export * from './parts/recommendations';
export { CPUs } from './parts/cpus';
export { GPUs } from './parts/gpus';
export { Motherboards } from './parts/motherboards';
export { RAMs } from './parts/ram';
export { StorageDevices } from './parts/storage';
export { PowerSupplies } from './parts/power-supplies';
export { Cases } from './parts/cases';
export { Monitors } from './parts/monitors';

// Combine all parts for legacy support
import { CPUs } from './parts/cpus';
import { GPUs } from './parts/gpus';
import { Motherboards } from './parts/motherboards';
import { RAMs } from './parts/ram';
import { StorageDevices } from './parts/storage';
import { PowerSupplies } from './parts/power-supplies';
import { Cases } from './parts/cases';
import { Monitors } from './parts/monitors';

export const PARTS = [
  ...CPUs,
  ...GPUs,
  ...Motherboards,
  ...RAMs,
  ...StorageDevices,
  ...PowerSupplies,
  ...Cases,
  ...Monitors
];
