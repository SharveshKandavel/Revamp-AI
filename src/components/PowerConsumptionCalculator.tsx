
import React from 'react';
import { useBuild } from '@/contexts/BuildContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Zap } from 'lucide-react';

const PowerConsumptionCalculator = () => {
  const { selectedParts } = useBuild();
  
  // Calculate total power consumption
  const calculatePowerConsumption = () => {
    let total = 50; // Base system power draw
    
    if (selectedParts.CPU) {
      total += (selectedParts.CPU.specs.tdp as number) || 0;
    }
    if (selectedParts.GPU) {
      total += (selectedParts.GPU.specs.tdp as number) || 0;
    }
    
    // Add estimated power for other components
    if (selectedParts.RAM) total += 10;
    if (selectedParts.Storage) total += 15;
    if (selectedParts.Monitor) total += 30;
    
    return total;
  };

  const totalPower = calculatePowerConsumption();
  const recommendedPSU = Math.ceil((totalPower * 1.5) / 50) * 50; // Round up to nearest 50W
  
  // Only show when parts are selected
  if (Object.values(selectedParts).filter(Boolean).length < 2) return null;

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-tech-purple" />
          Power Consumption Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Estimated Power Draw</span>
              <span className="font-medium">{totalPower}W</span>
            </div>
            <Progress value={(totalPower / recommendedPSU) * 100} />
          </div>
          
          <div className="rounded-lg bg-purple-50 p-4">
            <p className="text-purple-900 font-medium">Recommended PSU Wattage</p>
            <p className="text-2xl font-bold text-purple-700">{recommendedPSU}W</p>
            <p className="text-sm text-purple-600 mt-1">
              Includes 50% headroom for system stability and future upgrades
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Daily Cost (24h)</p>
              <p className="font-medium">
                ₹{((totalPower * 24 * 0.08) / 1000).toFixed(2)}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Monthly Cost</p>
              <p className="font-medium">
                ₹{((totalPower * 24 * 30 * 0.08) / 1000).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PowerConsumptionCalculator;
