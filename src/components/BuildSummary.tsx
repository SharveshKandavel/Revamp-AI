
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useBuildStore, useTotalPrice } from "@/store/useBuildStore";
import { useAuth } from "@/contexts/AuthContext";
import { Check, ExternalLink, HardDrive, Layers, MonitorSmartphone, Package, Plug, ShieldAlert, Unplug, X, ShoppingCart, Save } from "lucide-react";
import { PartCategory } from "@/data/parts/types";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { getAffiliateLink, formatAmazonPrice } from "@/utils/amazonUtils";

const categoryIcons: Record<PartCategory, React.ReactNode> = {
  CPU: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><path d="M15 2v2M15 20v2M2 15h2M20 15h2M2 9h2M20 9h2M9 2v2M9 20v2" /></svg>,
  GPU: <Layers className="w-4.5 h-4.5" />,
  Motherboard: <Unplug className="w-4.5 h-4.5" />,
  RAM: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 19v2M10 19v2M14 19v2M18 19v2M8 3v2M16 3v2M12 3v2M2 6h20M2 10h20M2 14h20M2 18h20" /></svg>,
  Storage: <HardDrive className="w-4.5 h-4.5" />,
  PowerSupply: <Plug className="w-4.5 h-4.5" />,
  Case: <Package className="w-4.5 h-4.5" />,
  Monitor: <MonitorSmartphone className="w-4.5 h-4.5" />
};

const categoryNames: Record<PartCategory, string> = {
  CPU: "Processor",
  GPU: "Graphics Card",
  Motherboard: "Motherboard",
  RAM: "Memory",
  Storage: "Storage",
  PowerSupply: "Power Supply",
  Case: "Case/Cabinet",
  Monitor: "Monitor"
};

const BuildSummary: React.FC = () => {
  const { selectedParts, compatibilityResult } = useBuildStore();
  const totalPrice = useTotalPrice();
  const { user, isAuthenticated } = useAuth();

  // Count selected parts
  const selectedCount = Object.values(selectedParts).filter(Boolean).length;
  
  // Removed early return

  // Calculate and display the build performance level
  const calculatePerformanceLevel = () => {
    const parts = Object.values(selectedParts).filter(part => part !== null);
    
    if (parts.length === 0) return { level: "Unknown", color: "text-gray-500" };
    
    const totalPerformance = parts.reduce((acc, part) => acc + (part?.performance || 0), 0);
    const avgPerformance = totalPerformance / parts.length;
    
    if (avgPerformance >= 8) return { level: "High-End", color: "text-indigo-600" };
    if (avgPerformance >= 6) return { level: "Mid-Range", color: "text-blue-600" };
    if (avgPerformance >= 4) return { level: "Entry-Level", color: "text-green-600" };
    return { level: "Basic", color: "text-yellow-600" };
  };

  const performanceLevel = calculatePerformanceLevel();

  const handleSaveBuild = async () => {
    if (!isAuthenticated || !user) {
      toast.error("Please login to save your build", {
        description: "Join Revamp AI to keep your custom configurations."
      });
      return;
    }

    try {
      const title = `${performanceLevel.level} Build - ${new Date().toLocaleDateString()}`;
      const description = `A custom ${performanceLevel.level.toLowerCase()} machine with ${selectedParts.CPU?.name || 'various components'}.`;
      
      const { saveBuild } = useBuildStore.getState();
      await saveBuild(title, description, user.id);

      toast.success("Build saved to cloud!", {
        description: "You can view your saved builds in your dashboard."
      });
    } catch (error: any) {
      console.error("Error saving build:", error.message);
      toast.error("Failed to save build to cloud", {
        description: error.message
      });
    }
  };

  return (
    <div style={{ display: selectedCount === 0 ? 'none' : 'block' }}>
      <Card className="mb-8 glass-card border-none shadow-2xl overflow-hidden">
      <CardHeader className="px-8 pt-8">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight">Configuration Matrix</CardTitle>
            <CardDescription className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-1">
              {selectedCount} of 8 components verified
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Curation Value</div>
            <div className="text-3xl font-black text-tech-purple">
              ${totalPrice.toLocaleString()}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-8">
        <div className="space-y-3">
          {Object.entries(categoryNames).map(([category, name]) => {
            const part = selectedParts[category as PartCategory];
            const amazonUrl = part?.asin ? getAffiliateLink(part.asin) : part?.amazon_url;
            
            return (
              <div 
                key={category}
                className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${
                  part ? "glass-card border-none ring-1 ring-green-500/20 bg-green-500/5" : "bg-gray-100/30 dark:bg-slate-900/30 border border-white/5"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-xl ${
                    part ? "text-green-500 bg-green-500/10" : "text-gray-400"
                  }`}>
                    {categoryIcons[category as PartCategory]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">{name}</div>
                    {part && (
                      <div className="font-bold text-sm truncate dark:text-white">
                        {part.brand} {part.name}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {part ? (
                    <>
                      <span className="font-black text-sm whitespace-nowrap dark:text-white">
                        {part.current_price_cents ? formatAmazonPrice(part.current_price_cents) : `$${part.price.toLocaleString()}`}
                      </span>
                      
                      {amazonUrl && (
                        <a 
                          href={amazonUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-amber-500/10 hover:bg-amber-500/20 rounded-xl text-amber-600 transition-colors"
                          title="View on Amazon"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </>
                  ) : (
                    <>
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Pending</span>
                      <X className="w-4 h-4 text-gray-200" />
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 p-6 glass-card rounded-2xl border-none flex items-center justify-between">
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Performance Tier</div>
            <div className={`text-lg font-black ${performanceLevel.color}`}>
              {performanceLevel.level}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <div 
              className={`${
                compatibilityResult.compatible 
                  ? "text-green-500 bg-green-500/10" 
                  : "text-red-500 bg-red-500/10"
              } px-4 py-2 rounded-full flex items-center gap-2 text-[10px] font-black uppercase tracking-widest`}
            >
              {compatibilityResult.compatible ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Verified Compatible</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4" />
                  <span>Integrity Failed</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        {!compatibilityResult.compatible && compatibilityResult.message && (
          <div className="mt-4 p-4 bg-red-500/5 border border-red-500/20 rounded-xl text-xs text-red-500 flex gap-3 font-medium leading-relaxed">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{compatibilityResult.message}</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-3 px-8 pb-8 pt-6 border-t border-white/10 bg-white/5">
        <Button 
          className="w-full bg-amber-500 hover:bg-amber-600 text-white h-14 rounded-xl flex items-center justify-center gap-3 transition-all font-black uppercase tracking-widest text-xs"
          asChild
        >
          <a 
            href={`https://www.amazon.ca/s?k=pc+parts+${performanceLevel.level.toLowerCase()}&tag=revampai-20`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="w-5 h-5" />
            Complete Selection on Amazon
          </a>
        </Button>
        <button 
          onClick={handleSaveBuild}
          className="w-full h-12 rounded-xl flex items-center justify-center gap-2 transition-all text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-tech-purple hover:bg-tech-purple/5"
        >
          <Save className="w-4 h-4" />
          Cloud Sync Matrix
        </button>
      </CardFooter>
      </Card>
    </div>
  );
};

export default BuildSummary;
