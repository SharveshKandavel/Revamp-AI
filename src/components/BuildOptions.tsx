
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Wrench, User, ShoppingCart, Send, ExternalLink } from "lucide-react";
import { useBuildStore, useTotalPrice } from "@/store/useBuildStore";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const BuildOptions: React.FC = () => {
  const { selectedParts, assemblyOption, setAssemblyOption } = useBuildStore();
  const totalPrice = useTotalPrice();
  const { user, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Count selected parts
  const selectedCount = Object.values(selectedParts).filter(Boolean).length;
  
  if (selectedCount < 3) {
    return null;
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

  const handlePlaceOrder = async () => {
    if (!assemblyOption) {
      toast.error("Please select a build option first");
      return;
    }

    if (assemblyOption === "self") {
      const amazonUrl = getWholeSetupLinks();
      window.open(amazonUrl, '_blank');
      toast.success("Redirecting to Amazon Canada!");
    } else {
      // Professional assembly request
      if (!isAuthenticated) {
        toast.error("Please login to request professional assembly", {
          description: "We need your contact details to connect you with a builder."
        });
        return;
      }

      setIsSubmitting(true);
      try {
        const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
        const partList = Object.values(selectedParts)
          .filter(Boolean)
          .map(p => `${p.brand} ${p.name}`);

        const { error } = await supabase
          .from('orders')
          .insert([{
            id: orderId,
            customer_name: user?.name || "Customer",
            items: partList,
            total_price: totalPrice + 1500,
            status: 'Pending',
            // For demo, we assign it to a placeholder UUID or the first available builder
            seller_id: "00000000-0000-0000-0000-000000000000" 
          }]);

        if (error) throw error;

        toast.success("Build request submitted!", {
          description: `Request ${orderId} has been sent to our certified builders.`
        });
      } catch (err: any) {
        console.error("Order error:", err.message);
        toast.error("Failed to submit request", {
          description: "Please try again later or contact support."
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const isProfessional = assemblyOption === "professional";

  return (
    <Card className="mb-8 glass-card border-none shadow-2xl overflow-hidden">
      <CardHeader className="px-8 pt-8">
        <CardTitle className="text-2xl font-bold tracking-tight">Deployment Strategy</CardTitle>
        <CardDescription className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-1">
          Select your preferred assembly protocol
        </CardDescription>
      </CardHeader>

      <CardContent className="px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            className={`p-6 rounded-2xl cursor-pointer transition-all duration-500 relative overflow-hidden ${
              assemblyOption === "self" 
                ? "glass-card border-none ring-2 ring-tech-purple shadow-xl" 
                : "glass-card-hover glass-card border-none opacity-60 hover:opacity-100"
            }`}
            onClick={() => setAssemblyOption("self")}
          >
            <div className="flex items-start gap-4 mb-4 relative z-10">
              <div className={`p-3 rounded-xl transition-colors ${
                assemblyOption === "self" ? "bg-tech-purple text-white" : "bg-tech-purple/10 text-tech-purple"
              }`}>
                <Wrench className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg dark:text-white leading-tight">Autonomous Assembly</h3>
                <p className="text-xs font-medium text-gray-400 mt-1 leading-relaxed">
                  Manual integration of all components via verified digital blueprints.
                </p>
              </div>
            </div>
            <div className="ml-14 text-[10px] font-black uppercase tracking-widest text-green-500 relative z-10">
              Efficiency Gain: ₹1,500+
            </div>
          </div>

          <div 
            className={`p-6 rounded-2xl cursor-pointer transition-all duration-500 relative overflow-hidden ${
              assemblyOption === "professional" 
                ? "glass-card border-none ring-2 ring-tech-purple shadow-xl" 
                : "glass-card-hover glass-card border-none opacity-60 hover:opacity-100"
            }`}
            onClick={() => setAssemblyOption("professional")}
          >
            <div className="flex items-start gap-4 mb-4 relative z-10">
              <div className={`p-3 rounded-xl transition-colors ${
                assemblyOption === "professional" ? "bg-tech-purple text-white" : "bg-tech-purple/10 text-tech-purple"
              }`}>
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg dark:text-white leading-tight">Expert Synthesis</h3>
                <p className="text-xs font-medium text-gray-400 mt-1 leading-relaxed">
                  Institutional-grade assembly by certified hardware architects.
                </p>
              </div>
            </div>
            
            <div className="ml-14 text-[10px] font-black uppercase tracking-widest text-tech-purple relative z-10">
              Service Allocation: ₹1,500
            </div>
            
            {assemblyOption === "professional" && (
              <div className="ml-14 mt-4 flex items-center gap-2 text-[9px] font-bold text-gray-400 bg-white/5 p-2 rounded-lg relative z-10 border border-white/5">
                <MapPin className="w-3 h-3 text-tech-purple" />
                <span className="uppercase tracking-tighter">Matching with local certified node...</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 px-8 pb-8 pt-6 border-t border-white/10 bg-white/5">
        <div className="w-full flex justify-between items-center py-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Parts Subtotal</span>
          <span className="font-bold dark:text-white">₹{totalPrice.toLocaleString()}</span>
        </div>
        
        {assemblyOption && (
          <div className="w-full flex justify-between items-center py-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              {assemblyOption === "self" ? "Assembly Efficiency" : "Professional Allocation"}
            </span>
            <span className={`font-bold ${assemblyOption === "self" ? "text-green-500" : "text-tech-purple"}`}>
              {assemblyOption === "self" ? "- ₹1,500+" : "+ ₹1,500"}
            </span>
          </div>
        )}
        
        <div className="w-full flex justify-between items-center py-4 border-t border-white/5">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Final Valuation</span>
          <span className="text-3xl font-black text-tech-dark dark:text-white">
            ₹{(totalPrice + (assemblyOption === "professional" ? 1500 : 0)).toLocaleString()}
          </span>
        </div>
        
        <button 
          className={`w-full h-14 rounded-xl flex items-center justify-center gap-3 transition-all font-black uppercase tracking-widest text-xs ${
            isSubmitting ? "bg-gray-400 cursor-not-allowed" : 
            isProfessional ? "bg-tech-purple hover:bg-tech-purple/90 text-white" : 
            "bg-tech-dark hover:bg-black text-white"
          }`}
          onClick={handlePlaceOrder}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : isProfessional ? (
            <Send className="w-5 h-5" />
          ) : (
            <ShoppingCart className="w-5 h-5" />
          )}
          <span>{isProfessional ? "Initialize Professional Request" : "Acquire Component List"}</span>
        </button>
      </CardFooter>
    </Card>
  );
};

export default BuildOptions;
