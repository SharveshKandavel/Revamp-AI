
import React, { useState, useEffect } from "react";
import { useBuildStore } from "@/store/useBuildStore";
import { Part, PartCategory } from "@/data/parts/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Cpu, HardDrive, Layers, MonitorSmartphone, Package, Plug, ShieldAlert, Unplug, Wand, ExternalLink, Check } from "lucide-react";
import { toast } from "sonner";
import { getAffiliateLink, formatAmazonPrice } from "@/utils/amazonUtils";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

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
  const amazonUrl = part.asin ? getAffiliateLink(part.asin) : part.amazon_url;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card 
        className={`cursor-pointer h-full glass-card border-none overflow-hidden group transition-all duration-500 flex flex-col ${
          isSelected ? "ring-2 ring-tech-purple shadow-2xl scale-[1.02]" : "glass-card-hover"
        }`}
        onClick={onSelect}
      >
        <CardHeader className="pb-2 pt-6 px-6 relative z-10">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-xl font-bold line-clamp-2 text-tech-dark dark:text-white leading-tight">{part.name}</CardTitle>
              <CardDescription className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-1">{part.brand}</CardDescription>
            </div>
            <div className="text-xl font-black text-tech-purple ml-2">
              {part.current_price_cents ? formatAmazonPrice(part.current_price_cents) : `$${part.price.toLocaleString()}`}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-4 px-6 relative z-10 flex-grow">
          <div className="space-y-2 mt-4">
            {Object.entries(part.specs || {}).slice(0, 3).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center text-xs">
                <span className="text-gray-400 uppercase tracking-tighter font-bold">{key}</span>
                <span className="font-medium truncate ml-4 dark:text-slate-300">{String(value)}</span>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="pt-4 pb-6 px-6 flex flex-col gap-4 border-t border-white/10 bg-white/5">
          <div className="w-full flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Perf</span>
              <div className="w-16 h-1 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-tech-purple" 
                  style={{ width: `${part.performance * 10}%` }}
                ></div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isAutoSelected && (
                <div className="flex items-center text-tech-purple gap-1">
                  <Wand className="w-3 h-3" />
                  <span>AI Selected</span>
                </div>
              )}
              {isSelected && (
                <div className="flex items-center text-green-500 gap-1">
                  <Check className="w-3 h-3" />
                  <span>Active</span>
                </div>
              )}
            </div>
          </div>
          
          {amazonUrl && (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-[10px] h-10 gap-2 rounded-full border-orange-200 dark:border-orange-900/30 text-orange-600 hover:bg-orange-50 font-black uppercase tracking-widest"
              onClick={(e) => {
                e.stopPropagation();
                window.open(amazonUrl, '_blank');
              }}
            >
              <ExternalLink className="w-3 h-3" />
              Inventory Link
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
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
  } = useBuildStore();

  const [activeCategory, setActiveCategory] = useState<PartCategory>("CPU");
  const [autoSelectedParts, setAutoSelectedParts] = useState<Record<PartCategory, boolean>>({
    CPU: false, GPU: false, Motherboard: false, RAM: false,
    Storage: false, PowerSupply: false, Case: false, Monitor: false
  });
  
  const [aiSelectionCompleted, setAiSelectionCompleted] = useState<boolean>(false);

  useEffect(() => {
    if (buildMode === "automatic" && purpose && budget > 0 && !aiSelectionCompleted) {
      const newAutoSelected: Record<PartCategory, boolean> = {
        CPU: false, GPU: false, Motherboard: false, RAM: false,
        Storage: false, PowerSupply: false, Case: false, Monitor: false
      };
      
      Object.entries(recommendations).forEach(([category, parts]) => {
        if (parts.length > 0) {
          selectPart(category as PartCategory, parts[0]);
          newAutoSelected[category as PartCategory] = true;
        }
      });
      
      setAutoSelectedParts(newAutoSelected);
      setAiSelectionCompleted(true);
      toast.success("AI Synthesis complete: optimal components selected.");
    }
  }, [buildMode, purpose, budget, recommendations, selectPart, aiSelectionCompleted]);

  if (!purpose || budget <= 0) return null;

  const categories: PartCategory[] = ["CPU", "GPU", "Motherboard", "RAM", "Storage", "PowerSupply", "Case", "Monitor"];

  return (
    <div className="mb-12 py-10 border-y border-white/10">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-tech-purple mb-4 block">Curation Hub</span>
          <h2 className="text-4xl font-bold text-tech-dark dark:text-white tracking-tight">
            {buildMode === "automatic" ? "Synthetic Configuration" : "Manual Curation"}
          </h2>
        </div>
        <div className="flex gap-2">
          {buildMode === "automatic" && (
            <div className="flex items-center text-tech-purple glass-card px-4 py-2 rounded-full border-none">
              <Wand className="w-4 h-4 mr-2" />
              <span className="text-xs font-black uppercase tracking-widest">AI Optimized</span>
            </div>
          )}
          {!compatibilityResult.compatible && (
            <div className="flex items-center text-red-500 glass-card px-4 py-2 rounded-full border-none">
              <ShieldAlert className="w-4 h-4 mr-2" />
              <span className="text-xs font-black uppercase tracking-widest">Integrity Alert</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-10">
        {categories.map((category) => (
          <button
            key={category}
            className={`p-4 rounded-2xl flex flex-col items-center justify-center transition-all duration-500 relative ${
              activeCategory === category 
                ? "glass-card border-none ring-1 ring-tech-purple shadow-xl" 
                : selectedParts[category] 
                ? "glass-card border-none ring-1 ring-green-500/30" 
                : "glass-card border-none hover:bg-white/60 opacity-60"
            }`}
            onClick={() => setActiveCategory(category)}
          >
            <div className={`mb-2 transition-colors ${
              activeCategory === category ? "text-tech-purple" : "text-gray-400"
            }`}>
              {categoryIcons[category]}
            </div>
            <div className="text-[9px] font-black uppercase tracking-widest">{category}</div>
            {selectedParts[category] && (
              <div className="absolute top-2 right-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recommendations[activeCategory].length > 0 ? (
          recommendations[activeCategory].map((part) => (
            <PartCard
              key={part.id}
              part={part}
              isSelected={selectedParts[activeCategory]?.id === part.id}
              isAutoSelected={autoSelectedParts[activeCategory] && selectedParts[activeCategory]?.id === part.id}
              onSelect={() => {
                selectPart(activeCategory, part);
                if (autoSelectedParts[activeCategory]) {
                  setAutoSelectedParts(prev => ({ ...prev, [activeCategory]: false }));
                }
              }}
            />
          ))
        ) : (
          <div className="col-span-full glass-card rounded-3xl border-none p-20 text-center shadow-inner">
            <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No compatible components found for this tier.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PartsPicker;
