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
import { Button } from "@/components/ui/button";
import { ShoppingCart, Wrench } from "lucide-react";

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
              className="p-8 bg-white rounded-xl shadow-lg border border-gray-100 text-center"
            >
              <div className="w-20 h-20 bg-tech-purple/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="w-10 h-10 text-tech-purple" />
              </div>
              <h2 className="text-3xl font-bold mb-4 text-tech-dark">Seller Dashboard</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Manage your PC parts inventory, track sales, and connect with builders across the platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => window.location.href = "/seller"}
                  className="bg-tech-purple hover:bg-tech-purple/90 px-8 py-6 text-lg"
                >
                  Go to Seller Dashboard
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setUserType(null)}
                  className="px-8 py-6 text-lg"
                >
                  Change User Type
                </Button>
              </div>
            </motion.div>
          )}

          {userType === "builder" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="p-8 bg-white rounded-xl shadow-lg border border-gray-100 text-center"
            >
              <div className="w-20 h-20 bg-tech-blue/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Wrench className="w-10 h-10 text-tech-blue" />
              </div>
              <h2 className="text-3xl font-bold mb-4 text-tech-dark">PC Builder Dashboard</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Access your build queue, view client requests, and manage your professional assembly profile.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => window.location.href = "/builder"}
                  className="bg-tech-blue hover:bg-tech-blue/90 px-8 py-6 text-lg"
                >
                  Go to Builder Dashboard
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setUserType(null)}
                  className="px-8 py-6 text-lg"
                >
                  Change User Type
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
  return (
    <BuildProvider>
      <MainContent />
    </BuildProvider>
  );
};

export default Index;
