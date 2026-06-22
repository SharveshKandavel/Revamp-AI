
import React from 'react';
import { useBuildStore } from '@/store/useBuildStore';
import { motion } from 'framer-motion';
import { AlertTriangle, Check, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const BuildCompatibilityVisualizer = () => {
  const { selectedParts, compatibilityResult } = useBuildStore();
  
  // Count selected parts
  const selectedCount = Object.values(selectedParts).filter(Boolean).length;
  
  if (selectedCount < 2) return <div style={{ display: 'none' }} />;

  // Calculate compatibility percentage
  const compatibilityScore = compatibilityResult.compatible ? 100 : 70;

  return (
    <Card className="mb-8 overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-tech-purple" />
          AI Build Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className={`absolute left-0 top-0 h-full ${
                compatibilityResult.compatible ? 'bg-green-500' : 'bg-yellow-500'
              }`}
              initial={{ width: '0%' }}
              animate={{ width: `${compatibilityScore}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          
          <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50">
            {compatibilityResult.compatible ? (
              <>
                <Check className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium text-green-700">Perfect Compatibility</p>
                  <p className="text-sm text-gray-600">All components work together optimally</p>
                </div>
              </>
            ) : (
              <>
                <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-700">Compatibility Warning</p>
                  <p className="text-sm text-gray-600">{compatibilityResult.message}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BuildCompatibilityVisualizer;
