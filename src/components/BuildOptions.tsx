
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Wrench, User, ShoppingCart, Send } from "lucide-react";
import { useBuild } from "@/contexts/BuildContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const BuildOptions: React.FC = () => {
  const { selectedParts, totalPrice, assemblyOption, setAssemblyOption } = useBuild();
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
    
    // Replace with your actual Amazon and Flipkart affiliate IDs
    const amazonAffiliateId = "revampai-21";
    const flipkartAffiliateId = "revampai";
    
    return {
      amazon: `https://www.amazon.in/s?k=${searchQuery}&tag=${amazonAffiliateId}`,
      flipkart: `https://www.flipkart.com/search?q=${searchQuery}&affid=${flipkartAffiliateId}`
    };
  };

  const handlePlaceOrder = async () => {
    if (!assemblyOption) {
      toast.error("Please select a build option first");
      return;
    }

    if (assemblyOption === "self") {
      const links = getWholeSetupLinks();
      window.open(links.amazon, '_blank');
      window.open(links.flipkart, '_blank');
      toast.success("Redirecting to our partner stores!");
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
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-xl">How would you like to build your PC?</CardTitle>
        <CardDescription>
          Choose whether you want to build it yourself or have a professional do it
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            className={`p-4 border rounded-lg cursor-pointer transition-all ${
              assemblyOption === "self" 
                ? "border-tech-purple bg-tech-purple/5 ring-1 ring-tech-purple" 
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setAssemblyOption("self")}
          >
            <div className="flex items-start gap-3 mb-2">
              <div className={`p-2 rounded-full ${
                assemblyOption === "self" ? "bg-tech-purple text-white" : "bg-gray-100 text-gray-500"
              }`}>
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium">Build it yourself</h3>
                <p className="text-sm text-gray-600">
                  We'll help you find all parts online and you can assemble the PC
                </p>
              </div>
            </div>
            <div className="ml-10 text-sm">
              <span className="font-medium text-tech-green">Potential savings:</span> ₹1,500+
            </div>
          </div>

          <div 
            className={`p-4 border rounded-lg cursor-pointer transition-all ${
              assemblyOption === "professional" 
                ? "border-tech-purple bg-tech-purple/5 ring-1 ring-tech-purple" 
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setAssemblyOption("professional")}
          >
            <div className="flex items-start gap-3 mb-2">
              <div className={`p-2 rounded-full ${
                assemblyOption === "professional" ? "bg-tech-purple text-white" : "bg-gray-100 text-gray-500"
              }`}>
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium">Professional assembly</h3>
                <p className="text-sm text-gray-600">
                  Have an experienced PC builder assemble it for you
                </p>
              </div>
            </div>
            
            <div className="ml-10 text-sm mb-2">
              <span className="font-medium text-tech-purple">Service fee:</span> ₹1,500
            </div>
            
            {assemblyOption === "professional" && (
              <div className="ml-10 mt-3 flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                <MapPin className="w-3 h-3 text-tech-purple" />
                <span>We'll match you with a local certified builder</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col space-y-3">
        <div className="w-full flex justify-between items-center py-2 border-t border-gray-100 mt-2">
          <span className="text-gray-600">Parts Subtotal:</span>
          <span className="font-medium">₹{totalPrice.toLocaleString()}</span>
        </div>
        
        {assemblyOption && (
          <div className="w-full flex justify-between items-center py-2">
            <span className="text-gray-600">
              {assemblyOption === "self" ? "Assembly Savings:" : "Professional Service Fee:"}
            </span>
            <span className={`font-medium ${assemblyOption === "self" ? "text-tech-green" : "text-tech-purple"}`}>
              {assemblyOption === "self" ? "- ₹1,500+" : "+ ₹1,500"}
            </span>
          </div>
        )}
        
        <div className="w-full flex justify-between items-center py-2 border-t border-gray-100">
          <span className="font-medium">Estimated Total:</span>
          <span className="text-xl font-bold text-tech-dark">
            ₹{(totalPrice + (assemblyOption === "professional" ? 1500 : 0)).toLocaleString()}
          </span>
        </div>
        
        <button 
          className={`w-full py-3 rounded-md flex items-center justify-center gap-2 transition-all font-medium ${
            isSubmitting ? "bg-gray-400 cursor-not-allowed" : 
            isProfessional ? "bg-tech-purple hover:bg-tech-purple/90 text-white" : 
            "bg-tech-accent hover:bg-tech-accent/90 text-white"
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
          <span>{isProfessional ? "Request Professional Build" : "Shop for These Parts"}</span>
        </button>
      </CardFooter>
    </Card>
  );
};

export default BuildOptions;
