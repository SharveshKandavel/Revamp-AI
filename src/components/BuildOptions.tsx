
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import { useBuildStore, useTotalPrice } from "@/store/useBuildStore";
import CheckoutSheet from "@/components/CheckoutSheet";

const BuildOptions: React.FC = () => {
  const { selectedParts } = useBuildStore();
  const totalPrice = useTotalPrice();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  // Count selected parts
  const selectedCount = Object.values(selectedParts).filter(Boolean).length;

  return (
    <div style={{ display: selectedCount < 3 ? 'none' : 'block' }}>
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
          onClick={() => setCheckoutOpen(true)}
        >
          <ShoppingCart className="w-5 h-5" />
          <span>Acquire Component List</span>
        </button>
      </CardContent>
      </Card>

      <CheckoutSheet open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </div>
  );
};

export default BuildOptions;
