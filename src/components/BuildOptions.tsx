
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Wrench, User, ShoppingCart } from "lucide-react";
import { useBuild } from "@/contexts/BuildContext";
import { toast } from "sonner";

const BuildOptions: React.FC = () => {
  const { selectedParts, totalPrice, assemblyOption, setAssemblyOption } = useBuild();
  
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

  const handlePlaceOrder = () => {
    if (!assemblyOption) {
      toast.error("Please select a build option first");
      return;
    }
    
    // Get affiliate links
    const links = getWholeSetupLinks();
    
    // Open links in new tabs
    window.open(links.amazon, '_blank');
    window.open(links.flipkart, '_blank');
    
    toast.success("Redirecting to our partner stores!");
  };

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
            className={`p-4 border rounded-lg cursor-pointer ${
              assemblyOption === "self" 
                ? "border-tech-purple bg-tech-purple/5" 
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setAssemblyOption("self")}
          >
            <div className="flex items-start gap-3 mb-2">
              <div className={`p-2 rounded-full ${
                assemblyOption === "self" ? "bg-tech-purple text-white" : "bg-gray-100"
              }`}>
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium">Build it yourself</h3>
                <p className="text-sm text-gray-500">
                  We'll help you find all parts online and you can assemble the PC
                </p>
              </div>
            </div>
            <div className="ml-10 text-sm">
              <span className="font-medium">Potential savings:</span> ₹1,500+
            </div>
          </div>

          <div 
            className={`p-4 border rounded-lg cursor-pointer ${
              assemblyOption === "professional" 
                ? "border-tech-purple bg-tech-purple/5" 
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setAssemblyOption("professional")}
          >
            <div className="flex items-start gap-3 mb-2">
              <div className={`p-2 rounded-full ${
                assemblyOption === "professional" ? "bg-tech-purple text-white" : "bg-gray-100"
              }`}>
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium">Professional assembly</h3>
                <p className="text-sm text-gray-500">
                  Have an experienced PC builder assemble it for you
                </p>
              </div>
            </div>
            
            <div className="ml-10 text-sm mb-2">
              <span className="font-medium">Service fee:</span> ₹1,500
            </div>
            
            {assemblyOption === "professional" && (
              <div className="ml-10 mt-3 flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>Find PC builders near your location</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col space-y-3">
        <div className="w-full flex justify-between items-center py-2 border-t border-gray-100">
          <span className="text-gray-600">Subtotal:</span>
          <span className="font-medium">₹{totalPrice.toLocaleString()}</span>
        </div>
        
        {assemblyOption && (
          <div className="w-full flex justify-between items-center py-2">
            <span className="text-gray-600">
              {assemblyOption === "self" ? "Estimated savings:" : "Service fee:"}
            </span>
            <span className="font-medium">
              {assemblyOption === "self" ? "₹1,500+" : "₹1,500"}
            </span>
          </div>
        )}
        
        <div className="w-full flex justify-between items-center py-2 border-t border-gray-100">
          <span className="font-medium">Total:</span>
          <span className="text-xl font-bold text-tech-purple">
            ₹{(totalPrice + (assemblyOption === "professional" ? 1500 : 0)).toLocaleString()}
          </span>
        </div>
        
        <button 
          className="w-full bg-tech-purple hover:bg-tech-purple/90 text-white py-3 rounded-md flex items-center justify-center gap-2 transition-colors"
          onClick={handlePlaceOrder}
        >
          <ShoppingCart className="w-5 h-5" />
          <span>Shop for These Parts</span>
        </button>
      </CardFooter>
    </Card>
  );
};

export default BuildOptions;
