
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Cpu, ShoppingCart, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface UserTypeSelectorProps {
  onSelectUserType: (userType: string) => void;
}

interface UserTypeCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const UserTypeCard: React.FC<UserTypeCardProps> = ({
  title,
  description,
  icon,
  onClick
}) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <Card 
      className="cursor-pointer transition-all hover:shadow-md"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-secondary/50 text-tech-purple">
            {icon}
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  </motion.div>
);

const UserTypeSelector: React.FC<UserTypeSelectorProps> = ({ onSelectUserType }) => {
  const navigate = useNavigate();
  const { user, updateRole, isAuthenticated } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingType, setPendingType] = useState<{ type: string; route: string | null } | null>(null);

  const userTypes = [
    {
      type: "customer",
      title: "PC Enthusiast",
      description: "Find and build the perfect PC for your needs",
      icon: <Cpu className="w-5 h-5" />,
      route: null
    },
    {
      type: "seller",
      title: "Parts Seller",
      description: "Sell PC parts and components on our platform",
      icon: <ShoppingCart className="w-5 h-5" />,
      route: "/seller"
    },
    {
      type: "builder",
      title: "PC Builder",
      description: "Help others assemble their custom PCs",
      icon: <Wrench className="w-5 h-5" />,
      route: "/builder"
    }
  ];

  const handleUserTypeSelect = (userType: string, route: string | null) => {
    if (userType === 'seller') {
      setPendingType({ type: userType, route });
      setShowConfirm(true);
    } else {
      executeUserTypeSelect(userType, route);
    }
  };

  const executeUserTypeSelect = async (userType: string, route: string | null) => {
    // If authenticated, update the actual user role in Supabase
    if (isAuthenticated) {
      try {
        await updateRole(userType as UserRole);
        toast.success(`Role updated to ${userType}`);
      } catch (err) {
        console.error("Failed to update role in database:", err);
      }
    }
    
    // Update local session state
    onSelectUserType(userType);
    
    if (route) {
      navigate(route);
    }
  };

  const confirmSwitch = () => {
    if (pendingType) {
      executeUserTypeSelect(pendingType.type, pendingType.route);
    }
    setShowConfirm(false);
    setPendingType(null);
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-tech-dark mb-4 flex items-center">
        <span className="mr-2">👋</span>
        How would you like to use Revamp AI?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {userTypes.map((type) => (
          <UserTypeCard
            key={type.type}
            title={type.title}
            description={type.description}
            icon={type.icon}
            onClick={() => handleUserTypeSelect(type.type, type.route)}
          />
        ))}
      </div>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Switch to Parts Seller Account?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to switch your account type to Parts Seller? 
              This will give you access to the inventory management dashboard and sales tools.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingType(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmSwitch}
              className="bg-tech-purple hover:bg-tech-purple/90"
            >
              Confirm & Switch
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserTypeSelector;
