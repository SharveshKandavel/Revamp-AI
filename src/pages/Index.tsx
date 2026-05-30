import React from "react";
import { BuildProvider } from "@/contexts/BuildContext";
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
import { useBuild } from "@/contexts/BuildContext";

const MainContent = () => {
  const { userType, setUserType } = useBuild();
  const { isMobile } = useMobileDevice();

  const HeaderComponent = isMobile ? MobileOptimizedHeader : Header;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeaderComponent userType={userType} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-tech-dark mb-4 bg-gradient-to-r from-tech-purple to-tech-blue text-transparent bg-clip-text">
              Transform Your PC Build
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Revamp your tech experience with AI-powered PC part selection and recommendations
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
            </>
          )}

          {userType === "seller" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="p-6 bg-white rounded-lg shadow-md"
            >
              <h2 className="text-2xl font-bold mb-4">Seller Dashboard</h2>
              <p className="text-gray-600 mb-6">
                As a seller, you can upload your products and manage your inventory here.
              </p>
              <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
                <p className="text-gray-500">Seller functionality coming soon!</p>
              </div>
            </motion.div>
          )}

          {userType === "builder" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="p-6 bg-white rounded-lg shadow-md"
            >
              <h2 className="text-2xl font-bold mb-4">PC Builder Dashboard</h2>
              <p className="text-gray-600 mb-6">
                As a PC builder, you can view incoming build requests and manage your profile here.
              </p>
              <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
                <p className="text-gray-500">Builder functionality coming soon!</p>
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
  return (
    <BuildProvider>
      <MainContent />
    </BuildProvider>
  );
};

export default Index;
