import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useBuildStore } from "@/store/useBuildStore";
import { PurposeType } from "@/data/parts/types";
import { Gamepad2, Video, Code, Laptop, Wand, Sliders } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface PurposeCardProps {
  title: string;
  description: string;
  type: PurposeType;
  icon: React.ReactNode;
  selected: boolean;
  onSelect: (purpose: PurposeType) => void;
}

const PurposeCard: React.FC<PurposeCardProps> = ({
  title,
  description,
  type,
  icon,
  selected,
  onSelect
}) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${
        selected ? "ring-2 ring-tech-purple shadow-lg" : ""
      }`}
      onClick={() => onSelect(type)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-full ${selected ? "bg-tech-purple text-white" : "bg-secondary/50 text-tech-purple"}`}>
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

const PurposeSelector: React.FC = () => {
  const { purpose, setPurpose, setBuildMode } = useBuildStore();
  const [localBuildMode, setLocalBuildMode] = useState<"manual" | "automatic" | null>(null);

  const purposes = [
    {
      title: "Gaming",
      type: "Gaming" as PurposeType,
      description: "High performance for running the latest games",
      icon: <Gamepad2 className="w-5 h-5" />
    },
    {
      title: "Video Editing",
      type: "VideoEditing" as PurposeType,
      description: "Powerful processing for video work and rendering",
      icon: <Video className="w-5 h-5" />
    },
    {
      title: "Programming",
      type: "Programming" as PurposeType,
      description: "Efficient multitasking for development work",
      icon: <Code className="w-5 h-5" />
    },
    {
      title: "Everyday Use",
      type: "EverydayUse" as PurposeType,
      description: "Reliable performance for browsing and office tasks",
      icon: <Laptop className="w-5 h-5" />
    }
  ];

  const handleAutomaticBuild = () => {
    if (!purpose) {
      toast.error("Please select a purpose first");
      return;
    }

    setLocalBuildMode("automatic");
    setBuildMode("automatic");
    toast.success("AI is assembling the best PC for your needs");
  };

  const handleManualBuild = () => {
    if (!purpose) {
      toast.error("Please select a purpose first");
      return;
    }
    
    setLocalBuildMode("manual");
    setBuildMode("manual");
    toast.success("You can now customize your PC build");
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-tech-dark mb-4 flex items-center">
        <span className="mr-2">🎯</span>
        What will you use your PC for?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {purposes.map((p) => (
          <PurposeCard
            key={p.type}
            title={p.title}
            description={p.description}
            type={p.type}
            icon={p.icon}
            selected={purpose === p.type}
            onSelect={setPurpose}
          />
        ))}
      </div>

      {purpose && !localBuildMode && (
        <div className="bg-white p-5 rounded-lg shadow-sm border mt-6">
          <h3 className="text-xl font-semibold mb-4">How would you like to build your PC?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card 
              className="cursor-pointer hover:shadow-md transition-all"
              onClick={handleAutomaticBuild}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-secondary/50 text-tech-purple">
                    <Wand className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-lg">Automatic Build</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Let AI choose the best components based on your requirements
                </CardDescription>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-md transition-all"
              onClick={handleManualBuild}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-secondary/50 text-tech-purple">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-lg">Manual Customization</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Personally select each component for a fully customized build
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurposeSelector;
