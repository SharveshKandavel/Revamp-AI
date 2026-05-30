
import { Part, PurposeType } from './types';

export const isCompatible = (selectedParts: Record<string, Part | null>) => {
  // Basic compatibility checks
  const cpu = selectedParts.CPU;
  const motherboard = selectedParts.Motherboard;
  const ram = selectedParts.RAM;
  const gpu = selectedParts.GPU;
  const monitor = selectedParts.Monitor;
  const purpose = selectedParts.purpose as unknown as PurposeType | undefined;

  if (cpu && motherboard) {
    // Check socket compatibility
    if (cpu.specs.socket !== motherboard.specs.socket) {
      return {
        compatible: false,
        message: `CPU socket ${cpu.specs.socket} is not compatible with motherboard socket ${motherboard.specs.socket}`
      };
    }
  }

  if (gpu && monitor) {
    // Check if high-end GPU is paired with a low refresh rate monitor for gaming
    if (gpu.performance >= 8 && 
        monitor.specs.refreshRate && 
        parseInt(monitor.specs.refreshRate.toString()) < 120 && 
        purpose === 'Gaming') {
      return {
        compatible: false,
        message: `Your high-performance GPU (${gpu.name}) is bottlenecked by your monitor's refresh rate (${monitor.specs.refreshRate})`
      };
    }
  }

  // Add more compatibility checks as needed
  return { compatible: true };
};
