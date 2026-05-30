
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Cpu, ShoppingCart, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
    onSelectUserType(userType);
    if (route) {
      navigate(route);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-tech-dark mb-4 flex items-center">
        <span className="mr-2">👋</span>
        How would you like to use Revamp AI?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {userTypes.map((userType) => (
          <UserTypeCard
            key={userType.type}
            title={userType.title}
            description={userType.description}
            icon={userType.icon}
            onClick={() => handleUserTypeSelect(userType.type, userType.route)}
          />
        ))}
      </div>
    </div>
  );
};

export default UserTypeSelector;
