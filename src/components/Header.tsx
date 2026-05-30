
import React from "react";
import { Menu, ShoppingCart, Wrench, User, LogOut } from "lucide-react";
import { useBuild } from "@/contexts/BuildContext";
import { useAuth } from "@/contexts/AuthContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { Button } from "./ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface HeaderProps {
  userType?: string; // Kept for backward compatibility but using AuthContext mainly
}

const Header: React.FC<HeaderProps> = () => {
  const buildContext = useBuild();
  const { totalPrice = 0 } = buildContext;
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Builds", path: "/builds" },
    { name: "Guides", path: "/guides" },
  ];

  // Add role-specific dashboards to nav if authenticated
  if (isAuthenticated) {
    if (user?.role === "seller") {
      navItems.push({ name: "Seller Dashboard", path: "/seller" });
    } else if (user?.role === "builder") {
      navItems.push({ name: "Builder Dashboard", path: "/builder" });
    }
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getUserTypeText = () => {
    switch (user?.role) {
      case 'customer':
        return 'PC Enthusiast';
      case 'seller':
        return 'Parts Seller';
      case 'builder':
        return 'PC Builder';
      default:
        return 'Guest';
    }
  };

  return (
    <header className="w-full sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center py-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center mb-4 sm:mb-0"
        >
          <Logo size="md" showText={true} />
        </motion.div>
        
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item, index) => (
            <motion.div 
              key={item.name}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link 
                to={item.path} 
                className={`text-tech-dark/80 hover:text-tech-accent transition-colors ${
                  location.pathname === item.path ? 'text-tech-accent font-medium' : ''
                }`}
              >
                {item.name}
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          {totalPrice > 0 && (
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white border border-tech-accent/20 px-4 py-2 rounded-lg shadow-sm hidden sm:block"
            >
              <span className="text-tech-accent font-medium">Build: </span>
              <span className="font-bold">₹{totalPrice.toLocaleString()}</span>
            </motion.div>
          )}

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 border border-tech-purple/20">
                    <AvatarImage src="" alt={user?.name} />
                    <AvatarFallback className="bg-tech-purple/10 text-tech-purple">
                      {user?.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="right" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-tech-purple mt-1">
                      {getUserTypeText()}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to={user?.role === 'seller' ? '/seller' : user?.role === 'builder' ? '/builder' : '/'}>
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button size="sm" className="bg-tech-purple hover:bg-tech-purple/90" asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          )}

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button className="p-2 text-tech-dark rounded-md hover:bg-gray-100">
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                <nav className="flex flex-col gap-4 mt-8">
                  {navItems.map((item) => (
                    <Link 
                      key={item.name} 
                      to={item.path} 
                      className={`px-4 py-2 rounded-md hover:bg-gray-100 transition-colors ${
                        location.pathname === item.path ? 'bg-gray-100 text-tech-accent' : ''
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                  {!isAuthenticated && (
                    <>
                      <DropdownMenuSeparator />
                      <Link to="/login" className="px-4 py-2 text-sm">Login</Link>
                      <Link to="/signup" className="px-4 py-2 text-sm font-medium text-tech-purple">Sign Up</Link>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </motion.div>
      </div>
    </header>
  );
};

export default Header;
