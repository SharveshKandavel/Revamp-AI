
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import { useBuildStore, useTotalPrice } from "@/store/useBuildStore";
import { toast } from "sonner";

const BuildOptions: React.FC = () => {
  const { selectedParts } = useBuildStore();
  const totalPrice = useTotalPrice();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Count selected parts
  const selectedCount = Object.values(selectedParts).filter(Boolean).length;
  
  if (selectedCount < 3) {
    return <div style={{ display: 'none' }} />;
  }

  // Generate affiliate links for entire build
  const getWholeSetupLinks = () => {
    // Get the names of all selected parts
    const partNames = Object.values(selectedParts)
      .filter(Boolean)
      .map(part => `${part?.brand} ${part?.name}`)
      .join(' ');
    
    const searchQuery = encodeURIComponent(`PC components ${partNames}`);
    
    // Using Canada domain and verified tag
    return `https://www.amazon.ca/s?k=${searchQuery}&tag=revampai-20`;
  };

  const handlePlaceOrder = () => {
    setIsSubmitting(true);
    
    const amazonUrl = getWholeSetupLinks();
    window.open(amazonUrl, '_blank');
    toast.success("Redirecting to Amazon!");
    
    // Reset the submitting state
    setTimeout(() => {
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <Card className="mb-8 glass-card border-none shadow-2xl overflow-hidden">
      <CardHeader className="px-8 pt-8 border-b border-white/10 bg-white/5">
        <div className="flex justify-between items-center w-full">
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight">Checkout</CardTitle>
            <CardDescription className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-1">
              Purchase your selected components
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Total Valuation</div>
            <div className="text-3xl font-black text-tech-dark dark:text-white leading-none">
              ${totalPrice.toLocaleString()}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <button 
          className="w-full h-16 flex items-center justify-center gap-3 transition-all font-black uppercase tracking-widest text-sm bg-tech-purple hover:bg-tech-purple/90 text-white"
          onClick={handlePlaceOrder}
          disabled={isSubmitting}
        >
          <div className="flex items-center justify-center w-5 h-5">
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <ShoppingCart className="w-5 h-5" />
            )}
          </div>
          <span>Acquire Component List on Amazon</span>
        </button>
      </CardContent>
    </Card>
  );
};

export default BuildOptions;

