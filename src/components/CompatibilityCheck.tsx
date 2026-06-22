
import React from "react";
import { useBuildStore } from "@/store/useBuildStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Shield } from "lucide-react";
import { motion } from "framer-motion";

const CompatibilityCheck: React.FC = () => {
  const { selectedParts, compatibilityResult } = useBuildStore();

  // Count selected parts
  const selectedCount = Object.values(selectedParts).filter(Boolean).length;
  
  // Removed early return

  return (
    <div style={{ display: selectedCount < 2 ? 'none' : 'block' }}>
      <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="mb-8 overflow-hidden border-l-4 hover-scale transition-all duration-300 border-l-tech-purple">
        <CardHeader className="bg-gray-50 pb-2">
          <CardTitle className="flex items-center gap-2 text-xl">
            {compatibilityResult.compatible ? (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500" />
            )}
            <Shield className="w-5 h-5 text-tech-purple" />
            Compatibility Check
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className={`p-4 rounded-md ${
            compatibilityResult.compatible 
              ? "bg-green-50 border border-green-100" 
              : "bg-red-50 border border-red-100"
          }`}>
            {compatibilityResult.compatible ? (
              <div className="text-green-700 flex items-center">
                <CheckCircle2 className="w-5 h-5 mr-2" />
                All components are compatible! Your build looks good.
              </div>
            ) : (
              <div className="text-red-600">
                <p className="font-medium mb-2 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Compatibility issue detected:
                </p>
                <p className="ml-7">{compatibilityResult.message}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
    </div>
  );
};

export default CompatibilityCheck;
