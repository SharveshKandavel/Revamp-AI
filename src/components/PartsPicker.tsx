
import React, { useState, useEffect } from "react";
import { useBuild } from "@/contexts/BuildContext";
import { Part, PartCategory } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Cpu, HardDrive, Layers, MonitorSmartphone, Package, Plug, ShieldAlert, Unplug, Wand } from "lucide-react";
import { toast } from "sonner";

const categoryIcons: Record<PartCategory, React.ReactNode> = {
  CPU: <Cpu className="w-5 h-5" />,
  GPU: <Layers className="w-5 h-5" />,
  Motherboard: <Unplug className="w-5 h-5" />,
  RAM: <Package className="w-5 h-5" />,
  Storage: <HardDrive className="w-5 h-5" />,
  PowerSupply: <Plug className="w-5 h-5" />,
  Case: <Package className="w-5 h-5" />,
  Monitor: <MonitorSmartphone className="w-5 h-5" />
};

const categoryNames: Record<PartCategory, string> = {
  CPU: "Processor",
  GPU: "Graphics Card",
  Motherboard: "Motherboard",
  RAM: "Memory",
  Storage: "Storage",
  PowerSupply: "Power Supply",
  Case: "Cabinet/Case",
  Monitor: "Monitor"
};

interface PartCardProps {
  part: Part;
  isSelected: boolean;
  onSelect: () => void;
  isAutoSelected?: boolean;
}

const PartCard: React.FC<PartCardProps> = ({ part, isSelected, onSelect, isAutoSelected }) => {
  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected ? "ring-2 ring-tech-purple shadow-lg" : ""
      }`}
      onClick={onSelect}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{part.name}</CardTitle>
            <CardDescription>{part.brand}</CardDescription>
          </div>
          <div className="text-xl font-bold text-tech-purple">₹{part.price.toLocaleString()}</div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-1 text-sm">
          {Object.entries(part.specs).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
              <span className="font-medium">{value}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="w-full flex justify-between text-sm">
          <div className="flex items-center">
            <span className="mr-1">Performance:</span>
            <div className="w-20 h-2 bg-gray-200 rounded-full">
              <div 
                className="h-2 bg-tech-purple rounded-full" 
                style={{ width: `${part.performance * 10}%` }}
              ></div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {isAutoSelected && (
              <Wand className="w-3.5 h-3.5 text-tech-purple" />
            )}
            <span className={`ml-auto font-medium px-2 py-0.5 rounded-full text-xs ${
              isSelected ? "bg-tech-purple text-white" : "bg-gray-100"
            }`}>
              {isSelected ? "Selected" : "Select"}
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

const PartsPicker: React.FC = () => {
  const { 
    selectedParts, 
    recommendations, 
    selectPart, 
    compatibilityResult,
    purpose,
    budget,
    buildMode
  } = useBuild();

  const [activeCategory, setActiveCategory] = useState<PartCategory>("CPU");
  const [autoSelectedParts, setAutoSelectedParts] = useState<Record<PartCategory, boolean>>({
    CPU: false,
    GPU: false,
    Motherboard: false,
    RAM: false,
    Storage: false,
    PowerSupply: false,
    Case: false,
    Monitor: false
  });
  
  // Add a state to track if AI selection has been done
  const [aiSelectionCompleted, setAiSelectionCompleted] = useState<boolean>(false);

  // Handle automatic build selection
  useEffect(() => {
    if (buildMode === "automatic" && purpose && budget > 0 && !aiSelectionCompleted) {
      const newAutoSelected: Record<PartCategory, boolean> = {
        CPU: false,
        GPU: false,
        Motherboard: false,
        RAM: false,
        Storage: false,
        PowerSupply: false,
        Case: false,
        Monitor: false
      };
      
      // Automatically select the top recommended parts for each category
      Object.entries(recommendations).forEach(([category, parts]) => {
        if (parts.length > 0) {
          selectPart(category as PartCategory, parts[0]);
          newAutoSelected[category as PartCategory] = true;
        }
      });
      
      setAutoSelectedParts(newAutoSelected);
      setAiSelectionCompleted(true); // Mark AI selection as completed
      toast.success("AI has automatically selected the best parts for you!");
    }
  }, [buildMode, purpose, budget, recommendations, selectPart, aiSelectionCompleted]);

  // Don't show anything if purpose or budget are not set
  if (!purpose || budget <= 0) {
    return null;
  }

  const categories: PartCategory[] = [
    "CPU", "GPU", "Motherboard", "RAM", "Storage", "PowerSupply", "Case", "Monitor"
  ];

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-tech-dark">
          {buildMode === "automatic" ? "AI-Selected Parts" : "Choose Your Parts"}
        </h2>
        {buildMode === "automatic" && (
          <div className="flex items-center text-tech-purple bg-tech-purple/5 px-3 py-1 rounded-full">
            <Wand className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">AI-optimized build</span>
          </div>
        )}
        {!compatibilityResult.compatible && (
          <div className="flex items-center text-red-500">
            <ShieldAlert className="w-5 h-5 mr-1" />
            <span className="text-sm font-medium">{compatibilityResult.message}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category}
            className={`p-2 border rounded-md flex flex-col items-center justify-center hover:bg-gray-50 transition-colors ${
              activeCategory === category 
                ? "border-tech-purple bg-tech-purple bg-opacity-10" 
                : selectedParts[category] 
                ? "border-tech-green bg-tech-green bg-opacity-5" 
                : "border-gray-200"
            }`}
            onClick={() => setActiveCategory(category)}
          >
            <div className={`p-1 rounded-full mb-1 ${
              activeCategory === category ? "text-tech-purple" : "text-gray-500"
            }`}>
              {categoryIcons[category]}
            </div>
            <div className="text-xs font-medium">{categoryNames[category]}</div>
            {selectedParts[category] && (
              <div className="flex items-center mt-1">
                <div className="w-2 h-2 bg-tech-green rounded-full mr-1"></div>
                {autoSelectedParts[category] && (
                  <Wand className="w-3 h-3 text-tech-purple" />
                )}
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendations[activeCategory].length > 0 ? (
          recommendations[activeCategory].map((part) => (
            <PartCard
              key={part.id}
              part={part}
              isSelected={selectedParts[activeCategory]?.id === part.id}
              isAutoSelected={autoSelectedParts[activeCategory] && selectedParts[activeCategory]?.id === part.id}
              onSelect={() => {
                selectPart(activeCategory, part);
                // Mark as manually selected if changed from AI recommendation
                if (autoSelectedParts[activeCategory]) {
                  setAutoSelectedParts(prev => ({
                    ...prev,
                    [activeCategory]: false
                  }));
                }
              }}
            />
          ))
        ) : (
          <div className="col-span-3 text-center p-8 border rounded-md">
            <p className="text-gray-500">No recommended parts found for this category within your budget.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PartsPicker;
