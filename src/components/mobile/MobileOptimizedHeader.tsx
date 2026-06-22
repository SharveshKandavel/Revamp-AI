import React, { useState } from "react";
import { Menu, X, ShoppingCart, Wrench, User } from "lucide-react";
import { useBuildStore, useTotalPrice } from "@/store/useBuildStore";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import Logo from "../Logo";
import { useMobileDevice } from "@/hooks/useMobile";
import { ImpactStyle } from "@capacitor/haptics";

interface MobileOptimizedHeaderProps {
  userType?: string;
}

const MobileOptimizedHeader: React.FC<MobileOptimizedHeaderProps> = ({ userType }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const buildContext = useBuildStore();
  const totalPrice = useTotalPrice();
  const location = useLocation();
  const { triggerHaptic, isMobile } = useMobileDevice();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Builds", path: "/builds" },
    { name: "Guides", path: "/guides" },
    { name: "Seller Dashboard", path: "/seller", visibleFor: ["seller"] }
  ];

  const filteredNavItems = navItems.filter(item => 
    !item.visibleFor || !userType || item.visibleFor.includes(userType)
  );

  const handleMenuToggle = async () => {
    await triggerHaptic(ImpactStyle.Light);
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavClick = async () => {
    await triggerHaptic(ImpactStyle.Light);
    setIsMobileMenuOpen(false);
  };

  const getUserTypeIcon = () => {
    switch (userType) {
      case 'customer':
        return <User className="w-4 h-4" />;
      case 'seller':
        return <ShoppingCart className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <>
      <header className="w-full sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto flex justify-between items-center py-3 px-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center"
          >
            <Logo size="sm" showText={true} />
          </motion.div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {filteredNavItems.map((item, index) => (
              <motion.div 
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link 
                  to={item.path} 
                  className={`text-foreground/80 hover:text-primary transition-colors font-medium ${
                    location.pathname === item.path ? 'text-primary' : ''
                  }`}
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* User Type Badge */}
            {userType && (
              <div className="hidden sm:flex bg-primary/10 px-3 py-1.5 rounded-full text-primary items-center gap-1.5">
                {getUserTypeIcon()}
                <span className="text-xs font-medium">
                  {userType === 'customer' ? 'Enthusiast' : 'Seller'}
                </span>
              </div>
            )}
            
            {/* Total Price */}
            {totalPrice > 0 && (
              <motion.div 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="hidden sm:flex bg-card border border-border px-3 py-1.5 rounded-lg shadow-sm"
              >
                <span className="text-primary font-semibold text-sm">₹{totalPrice.toLocaleString()}</span>
              </motion.div>
            )}
            
            {/* Mobile Menu Button */}
            <button 
              onClick={handleMenuToggle}
              className="lg:hidden p-2 text-foreground rounded-md hover:bg-accent active:scale-95 transition-all"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
              onClick={handleMenuToggle}
            />
            
            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-16 right-0 bottom-0 w-80 bg-card border-l border-border z-50 lg:hidden"
            >
              <div className="flex flex-col h-full">
                {/* User Info */}
                {userType && (
                  <div className="p-6 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-full">
                        {getUserTypeIcon()}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          {userType === 'customer' ? 'PC Enthusiast' : 'Parts Seller'}
                        </p>
                        {totalPrice > 0 && (
                          <p className="text-sm text-muted-foreground">
                            Current Build: ₹{totalPrice.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Navigation */}
                <nav className="flex-1 p-6">
                  <div className="space-y-2">
                    {filteredNavItems.map((item, index) => (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link 
                          to={item.path} 
                          onClick={handleNavClick}
                          className={`flex items-center px-4 py-3 rounded-lg hover:bg-accent transition-colors ${
                            location.pathname === item.path ? 'bg-primary/10 text-primary font-medium' : 'text-foreground'
                          }`}
                        >
                          {item.name}
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileOptimizedHeader;