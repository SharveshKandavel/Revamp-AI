import React from "react";
import Header from "@/components/Header";
import MobileOptimizedHeader from "@/components/mobile/MobileOptimizedHeader";
import { useMobileDevice } from "@/hooks/useMobile";
import Footer from "@/components/Footer";
import UserTypeSelector from "@/components/UserTypeSelector";
import PurposeSelector from "@/components/PurposeSelector";
import BudgetInput from "@/components/BudgetInput";
import PartsPicker from "@/components/PartsPicker";
import CompatibilityCheck from "@/components/CompatibilityCheck";
import BuildSummary from "@/components/BuildSummary";
import BuildOptions from "@/components/BuildOptions";
import BuildCompatibilityVisualizer from "@/components/BuildCompatibilityVisualizer";
import BuildVisualizer3D from "@/components/BuildVisualizer3D";
import PowerConsumptionCalculator from "@/components/PowerConsumptionCalculator";
import { motion } from "framer-motion";
import { useBuildStore } from "@/store/useBuildStore";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Wrench } from "lucide-react";

const MainContent = () => {
  const { userType, setUserType, fetchCatalog } = useBuildStore();
  const { isMobile } = useMobileDevice();

  React.useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  const HeaderComponent = isMobile ? MobileOptimizedHeader : Header;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeaderComponent userType={userType} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-tech-dark dark:text-white mb-6 tracking-tight">
              Architecture for <span className="text-tech-purple">Performance</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium">
              Precision hardware curation and technical assembly for the modern ecosystem.
            </p>
          </motion.div>

          {!userType && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <UserTypeSelector onSelectUserType={setUserType} />
            </motion.div>
          )}

          {userType && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-8"
            >
              <Button 
                variant="ghost" 
                onClick={() => setUserType(null)}
                className="flex items-center gap-2 text-gray-500 hover:text-tech-purple transition-colors p-0"
              >
                <motion.div
                  whileHover={{ x: -4 }}
                >
                  ← Back to Selection
                </motion.div>
              </Button>
            </motion.div>
          )}

          {userType === "customer" && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <PurposeSelector />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <BudgetInput />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <PartsPicker />
              </motion.div>
              
              <BuildVisualizer3D />
              <BuildCompatibilityVisualizer />
              <PowerConsumptionCalculator />
              <CompatibilityCheck />
              <BuildSummary />
              <BuildOptions />
              
              <motion.div 
                className="mt-12 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Button 
                  variant="outline" 
                  onClick={() => setUserType(null)}
                  className="px-8 py-2 text-gray-500 hover:text-tech-purple transition-colors"
                >
                  Change User Type
                </Button>
              </motion.div>
            </>
          )}

          {userType === "seller" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="p-16 glass-card border-none shadow-2xl text-center rounded-[3rem]"
            >
              <ShoppingCart className="w-16 h-16 text-tech-purple mx-auto mb-10 opacity-80" />
              <h2 className="text-5xl font-bold mb-8 text-tech-dark dark:text-white tracking-tight">Commercial Terminal</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-xl mx-auto leading-relaxed font-medium">
                Oversee boutique inventory, facilitate high-fidelity commerce, and manage institutional supply chains.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button 
                  onClick={() => window.location.href = "/seller"}
                  className="bg-tech-dark hover:bg-black text-white h-16 px-12 text-lg rounded-full transition-all duration-500 hover:-translate-y-1 font-bold uppercase tracking-wider"
                >
                  Enter Workspace
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setUserType(null)}
                  className="h-16 px-12 text-lg rounded-full glass-card border-none hover:bg-white/60 transition-all duration-500 hover:-translate-y-1 font-bold uppercase tracking-wider"
                >
                  Switch Role
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

const Index = () => {
  return <MainContent />;
};

export default Index;
