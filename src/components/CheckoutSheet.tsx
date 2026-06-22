
import React from "react";
import { useBuildStore, useTotalPrice } from "@/store/useBuildStore";
import { PartCategory } from "@/data/parts/types";
import { getAffiliateLink, formatAmazonPrice } from "@/utils/amazonUtils";
import { ExternalLink, ShoppingCart, X, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const categoryNames: Record<PartCategory, string> = {
  CPU: "Processor",
  GPU: "Graphics Card",
  Motherboard: "Motherboard",
  RAM: "Memory",
  Storage: "Storage",
  PowerSupply: "Power Supply",
  Case: "Case",
  Monitor: "Monitor",
};

interface CheckoutSheetProps {
  open: boolean;
  onClose: () => void;
}

const CheckoutSheet: React.FC<CheckoutSheetProps> = ({ open, onClose }) => {
  const { selectedParts } = useBuildStore();
  const totalPrice = useTotalPrice();

  const selected = Object.entries(selectedParts).filter(([, part]) => part !== null) as [
    PartCategory,
    NonNullable<(typeof selectedParts)[PartCategory]>
  ][];

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            key="sheet"
            className="fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-3xl shadow-2xl max-h-[90vh] flex flex-col"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div>
                <h2 className="text-xl font-black tracking-tight dark:text-white">Your Component List</h2>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                  {selected.length} parts · Total ${totalPrice.toLocaleString()}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Parts List */}
            <div className="overflow-y-auto flex-1 px-4 py-4 space-y-3">
              {selected.map(([category, part]) => {
                const buyUrl = part.asin
                  ? getAffiliateLink(part.asin)
                  : part.amazon_url ?? null;

                const displayPrice = part.current_price_cents
                  ? formatAmazonPrice(part.current_price_cents)
                  : `$${part.price.toLocaleString()}`;

                return (
                  <div
                    key={category}
                    className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-slate-900/60 gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                      <div className="min-w-0">
                        <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                          {categoryNames[category]}
                        </div>
                        <div className="text-sm font-bold dark:text-white truncate">
                          {part.brand} {part.name}
                        </div>
                        <div className="text-xs font-black text-tech-purple">{displayPrice}</div>
                      </div>
                    </div>

                    {buyUrl ? (
                      <a
                        href={buyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-xl transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Buy
                      </a>
                    ) : (
                      <span className="shrink-0 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        Link unavailable
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-4 pb-8 pt-4 border-t border-white/10 bg-white/5">
              <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                Each component links directly to its product page
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CheckoutSheet;
