
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Cpu, Wrench, ShoppingCart } from "lucide-react";
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
    className="h-full"
  >
    <Card 
      className="cursor-pointer h-full glass-card glass-card-hover border-none"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-tech-purple/10 text-tech-purple">
            {icon}
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base font-medium">{description}</CardDescription>
      </CardContent>
    </Card>
  </motion.div>
);

const UserTypeSelector: React.FC<UserTypeSelectorProps> = ({ onSelectUserType }) => {
  const navigate = useNavigate();
  const { updateRole, isAuthenticated } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingType, setPendingType] = useState<{ type: string; route: string | null } | null>(null);

  const userTypes = [
    {
      type: "customer",
      title: "Enthusiast",
      description: "Architect and curate the optimal computing system for your unique performance requirements.",
      icon: <Cpu className="w-5 h-5" />,
      route: null
    },
    {
      type: "seller",
      title: "Seller",
      description: "Manage a boutique inventory of elite components and facilitate high-fidelity commerce.",
      icon: <ShoppingCart className="w-5 h-5" />,
      route: "/seller"
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
    <div className="mb-12">
      <h2 className="text-3xl font-bold text-tech-dark dark:text-white mb-8">
        Select Workspace
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
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
        <AlertDialogContent className="rounded-3xl p-8">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold">Initialize Seller Profile?</AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              Are you prepared to oversee boutique inventory and facilitate elite commercial operations? 
              This will reconfigure your terminal for institutional commerce tools.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel onClick={() => setPendingType(null)} className="rounded-full px-8">Return</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmSwitch}
              className="bg-tech-dark hover:bg-black text-white rounded-full px-8"
            >
              Transition Now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserTypeSelector;
