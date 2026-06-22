
import React from 'react';
import { useBuildStore } from '@/store/useBuildStore';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Zap } from 'lucide-react';

const PowerConsumptionCalculator = () => {
  const { selectedParts } = useBuildStore();
  
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
  
  const selectedPSUWattage = (selectedParts.PowerSupply?.specs.wattage as number) || 0;
  const isPSUInsufficient = selectedPSUWattage > 0 && selectedPSUWattage < totalPower;
  const isPSULowHeadroom = selectedPSUWattage > 0 && selectedPSUWattage >= totalPower && selectedPSUWattage < recommendedPSU;

  // Only show when parts are selected
  if (Object.values(selectedParts).filter(Boolean).length < 2) return <div style={{ display: 'none' }} />;

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
            <Progress value={Math.min((totalPower / (selectedPSUWattage || recommendedPSU)) * 100, 100)} className={isPSUInsufficient ? "bg-red-200" : ""} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg bg-purple-50 p-4">
              <p className="text-purple-900 font-medium text-sm">Recommended Wattage</p>
              <p className="text-2xl font-bold text-purple-700">{recommendedPSU}W</p>
            </div>
            
            {selectedPSUWattage > 0 && (
              <div className={`rounded-lg p-4 ${
                isPSUInsufficient ? "bg-red-50 border border-red-100" : 
                isPSULowHeadroom ? "bg-amber-50 border border-amber-100" : 
                "bg-green-50 border border-green-100"
              }`}>
                <p className={`font-medium text-sm ${
                  isPSUInsufficient ? "text-red-900" : 
                  isPSULowHeadroom ? "text-amber-900" : 
                  "text-green-900"
                }`}>Selected PSU</p>
                <p className={`text-2xl font-bold ${
                  isPSUInsufficient ? "text-red-700" : 
                  isPSULowHeadroom ? "text-amber-700" : 
                  "text-green-700"
                }`}>{selectedPSUWattage}W</p>
              </div>
            )}
          </div>
          
          {isPSUInsufficient && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-700 flex gap-2 items-center">
              <Zap className="w-4 h-4 text-red-500" />
              <span>Critical: Selected PSU wattage is lower than estimated draw!</span>
            </div>
          )}

          {isPSULowHeadroom && !isPSUInsufficient && (
            <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg text-sm text-amber-700 flex gap-2 items-center">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Warning: Low headroom. Consider a higher wattage PSU for stability.</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Daily Cost (24h)</p>
              <p className="font-medium">
                ${((totalPower * 24 * 0.08) / 1000).toFixed(2)}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Monthly Cost</p>
              <p className="font-medium">
                ${((totalPower * 24 * 30 * 0.08) / 1000).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PowerConsumptionCalculator;
