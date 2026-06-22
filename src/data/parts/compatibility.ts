
import { Part, PurposeType } from './types';

// Which sockets require DDR5 RAM
const DDR5_SOCKETS = ['AM5'];
// Which sockets require DDR4 RAM
const DDR4_SOCKETS = ['AM4', 'LGA1700'];

interface CompatibilityResult {
  compatible: boolean;
  message?: string;
}

export const isCompatible = (
  selectedParts: Record<string, Part | null>,
  purpose?: PurposeType | null
): CompatibilityResult => {
  const cpu        = selectedParts.CPU;
  const motherboard = selectedParts.Motherboard;
  const ram        = selectedParts.RAM;
  const gpu        = selectedParts.GPU;
  const psu        = selectedParts.PowerSupply;
  const monitor    = selectedParts.Monitor;

  // ── 1. CPU ↔ Motherboard socket ────────────────────────────────────────────
  if (cpu && motherboard) {
    const cpuSocket = cpu.specs?.socket as string | undefined;
    const mbSocket  = motherboard.specs?.socket as string | undefined;

    if (cpuSocket && mbSocket && cpuSocket !== mbSocket) {
      return {
        compatible: false,
        message: `CPU socket (${cpuSocket}) is incompatible with motherboard socket (${mbSocket}). Select a matching pair.`,
      };
    }

    // ── 2. Motherboard socket ↔ RAM type (DDR4 vs DDR5) ────────────────────
    if (ram) {
      const ramType  = ram.specs?.type as string | undefined;   // 'DDR4' or 'DDR5'
      const socket   = mbSocket ?? cpuSocket ?? '';

      if (ramType && socket) {
        const needsDDR5 = DDR5_SOCKETS.some(s => socket.includes(s));
        const needsDDR4 = DDR4_SOCKETS.some(s => socket.includes(s));

        if (needsDDR5 && ramType === 'DDR4') {
          return {
            compatible: false,
            message: `AM5 platform (${cpu?.name ?? motherboard.name}) requires DDR5 RAM, but you selected ${ram.brand} ${ram.name} (DDR4).`,
          };
        }

        if (needsDDR4 && ramType === 'DDR5') {
          return {
            compatible: false,
            message: `${socket} platform requires DDR4 RAM, but you selected ${ram.brand} ${ram.name} (DDR5).`,
          };
        }
      }
    }
  }

  // ── 3. PSU wattage vs estimated system draw ─────────────────────────────
  if (psu) {
    const psuWattage = psu.specs?.wattage as number | undefined;
    if (psuWattage) {
      let estimatedDraw = 50; // base
      if (cpu) estimatedDraw += (cpu.specs?.tdp as number) || 65;
      if (gpu) estimatedDraw += (gpu.specs?.tdp as number) || 150;
      if (ram) estimatedDraw += 10;

      const recommended = Math.ceil((estimatedDraw * 1.25) / 50) * 50; // 25% headroom

      if (psuWattage < estimatedDraw) {
        return {
          compatible: false,
          message: `PSU (${psuWattage}W) is underpowered for your build's estimated draw (~${estimatedDraw}W). Upgrade to at least ${recommended}W.`,
        };
      }
    }
  }

  // ── 4. High-end GPU bottlenecked by low-refresh monitor (Gaming only) ───
  if (gpu && monitor && purpose === 'Gaming') {
    const refreshRateStr = monitor.specs?.refreshRate as string | undefined;
    if (refreshRateStr) {
      const refreshRate = parseInt(refreshRateStr, 10);
      if (gpu.performance >= 8 && refreshRate < 120) {
        return {
          compatible: false,
          message: `Your ${gpu.brand} ${gpu.name} (high-end GPU) is bottlenecked by the ${monitor.brand} ${monitor.name}'s ${refreshRate}Hz refresh rate for gaming. Consider a 144Hz+ monitor.`,
        };
      }
    }
  }

  return { compatible: true };
};
