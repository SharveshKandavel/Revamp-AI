
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useBuild } from "@/contexts/BuildContext";
import { useAuth } from "@/contexts/AuthContext";
import { Check, ExternalLink, HardDrive, Layers, MonitorSmartphone, Package, Plug, ShieldAlert, Unplug, X, ShoppingCart, Save } from "lucide-react";
import { PartCategory } from "@/data/mockData";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

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
  const { selectedParts, totalPrice, compatibilityResult } = useBuild();
  const { user, isAuthenticated } = useAuth();

  // Count selected parts
  const selectedCount = Object.values(selectedParts).filter(Boolean).length;
  
  if (selectedCount === 0) {
    return null;
  }

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
    if (!isAuthenticated) {
      toast.error("Please login to save your build", {
        description: "Join Revamp AI to keep your custom configurations."
      });
      return;
    }

    try {
      const buildData = {
        user_id: user?.id,
        title: `${performanceLevel.level} Build - ${new Date().toLocaleDateString()}`,
        description: `A custom ${performanceLevel.level.toLowerCase()} machine with ${selectedParts.CPU?.name || 'various components'}.`,
        total_price: totalPrice,
        parts: selectedParts,
        performance: performanceLevel.level,
        is_public: true
      };

      const { data, error } = await supabase
        .from('builds')
        .insert([buildData])
        .select();

      if (error) throw error;

      toast.success("Build saved to cloud!", {
        description: "You can view your saved builds in your dashboard."
      });
    } catch (error: any) {
      console.error("Error saving build:", error.message);
      
      // Fallback to local storage if supabase fails
      const savedBuilds = JSON.parse(localStorage.getItem("saved_builds") || "[]");
      const newBuild = {
        id: Date.now(),
        userId: user?.id,
        title: `${performanceLevel.level} Build - ${new Date().toLocaleDateString()}`,
        description: `A custom ${performanceLevel.level.toLowerCase()} machine with ${selectedParts.CPU?.name || 'various components'}.`,
        price: totalPrice,
        parts: selectedParts,
        performance: performanceLevel.level,
        date: new Date().toISOString(),
        likes: 0,
        author: user?.name || "Guest",
        rating: 5.0,
        difficulty: performanceLevel.level === 'High-End' ? 'Advanced' : 'Intermediate',
        category: 'Custom',
        specs: [selectedParts.GPU?.name, selectedParts.CPU?.name].filter(Boolean)
      };

      localStorage.setItem("saved_builds", JSON.stringify([newBuild, ...savedBuilds]));
      toast.info("Build saved locally", {
        description: "We saved it to your browser as a backup."
      });
    }
  };

  // Generate affiliate links for products
  const getAffiliateLinks = (partName: string) => {
    // Replace spaces with plus signs for URL friendly search queries
    const searchQuery = encodeURIComponent(partName);
    
    // Replace with your actual Amazon and Flipkart affiliate IDs
    const amazonAffiliateId = "revampai-21";
    const flipkartAffiliateId = "revampai";
    
    return {
      amazon: `https://www.amazon.in/s?k=${searchQuery}&tag=${amazonAffiliateId}`,
      flipkart: `https://www.flipkart.com/search?q=${searchQuery}&affid=${flipkartAffiliateId}`
    };
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">Your PC Build</CardTitle>
            <CardDescription>
              {selectedCount} of 8 components selected
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Estimated Cost</div>
            <div className="text-2xl font-bold text-tech-purple">
              ₹{totalPrice.toLocaleString()}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {Object.entries(categoryNames).map(([category, name]) => {
            const part = selectedParts[category as PartCategory];
            const affiliateLinks = part ? getAffiliateLinks(`${part.brand} ${part.name}`) : null;
            
            return (
              <div 
                key={category}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  part ? "border-green-100 bg-green-50" : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    part ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"
                  }`}>
                    {categoryIcons[category as PartCategory]}
                  </div>
                  <div>
                    <div className="font-medium">{name}</div>
                    {part && (
                      <div className="text-sm text-gray-600">
                        {part.brand} {part.name}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {part ? (
                    <>
                      <span className="font-medium">₹{part.price.toLocaleString()}</span>
                      <Check className="w-4 h-4 text-green-500" />
                      
                      {/* Affiliate links */}
                      {affiliateLinks && (
                        <div className="flex space-x-1 ml-2">
                          <a 
                            href={affiliateLinks.amazon}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 bg-amber-100 hover:bg-amber-200 rounded-md text-amber-800 transition-colors"
                            title="View on Amazon"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 8c1.9 0 3-1.25 3-3.5 0-1.563-.526-3.5-3-3.5-1.116 0-3 1.035-3 3.5 0 .1 0 .307.01.584M5 8c-1.9 0-3-1.25-3-3.5 0-1.563.526-3.5 3-3.5 1.116 0 3 1.035 3 3.5 0 .1 0 .307-.01.584M9 22h6m-3-7v7m-8-7h14a2 2 0 0 0 1.857-1.257L19 9a1.999 1.999 0 0 0-2-2H7a2 2 0 0 0-2 2l-.857 4.743A2 2 0 0 0 6 15Z"/></svg>
                          </a>
                          <a 
                            href={affiliateLinks.flipkart}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 bg-blue-100 hover:bg-blue-200 rounded-md text-blue-800 transition-colors"
                            title="View on Flipkart"
                          >
                            <ShoppingCart className="w-4 h-4" />
                          </a>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <span className="text-sm text-gray-400">Not selected</span>
                      <X className="w-4 h-4 text-gray-300" />
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Build Performance</div>
              <div className={`font-medium ${performanceLevel.color}`}>
                {performanceLevel.level}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div 
                className={`${
                  compatibilityResult.compatible 
                    ? "text-green-600 bg-green-50" 
                    : "text-red-600 bg-red-50"
                } px-3 py-1 rounded-full flex items-center gap-1.5 text-sm font-medium`}
              >
                {compatibilityResult.compatible ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Compatible</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-4 h-4" />
                    <span>Incompatible</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {!compatibilityResult.compatible && compatibilityResult.message && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600 flex gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{compatibilityResult.message}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col space-y-3 pt-0">
        <div className="w-full grid grid-cols-2 gap-3">
          <a 
            href={`https://www.amazon.in/s?k=pc+parts+${performanceLevel.level.toLowerCase()}&tag=revampai-21`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-md flex items-center justify-center gap-2 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 8c1.9 0 3-1.25 3-3.5 0-1.563-.526-3.5-3-3.5-1.116 0-3 1.035-3 3.5 0 .1 0 .307.01.584M5 8c-1.9 0-3-1.25-3-3.5 0-1.563.526-3.5 3-3.5 1.116 0 3 1.035 3 3.5 0 .1 0 .307-.01.584M9 22h6m-3-7v7m-8-7h14a2 2 0 0 0 1.857-1.257L19 9a1.999 1.999 0 0 0-2-2H7a2 2 0 0 0-2 2l-.857 4.743A2 2 0 0 0 6 15Z"/></svg>
            <span>Buy on Amazon</span>
          </a>
          <a 
            href={`https://www.flipkart.com/search?q=pc+parts+${performanceLevel.level.toLowerCase()}&affid=revampai`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md flex items-center justify-center gap-2 transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Buy on Flipkart</span>
          </a>
        </div>
        <button 
          onClick={handleSaveBuild}
          className="w-full border border-gray-300 hover:bg-gray-50 py-2 rounded-md flex items-center justify-center gap-2 transition-colors"
        >
          <Save className="w-4 h-4" />
          Save Build
        </button>
      </CardFooter>
    </Card>
  );
};

export default BuildSummary;
