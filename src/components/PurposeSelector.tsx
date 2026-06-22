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
    className="h-full"
  >
    <Card 
      className={`cursor-pointer transition-all h-full glass-card border-none group ${
        selected ? "ring-2 ring-tech-purple shadow-xl" : "glass-card-hover"
      }`}
      onClick={() => onSelect(type)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-full transition-colors duration-500 ${selected ? "bg-tech-purple text-white" : "bg-tech-purple/10 text-tech-purple group-hover:bg-tech-purple group-hover:text-white"}`}>
            {icon}
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm font-medium">{description}</CardDescription>
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
      description: "Elite performance for real-time simulations and cinematic fidelity.",
      icon: <Gamepad2 className="w-5 h-5" />
    },
    {
      title: "CGI / Rendering",
      type: "VideoEditing" as PurposeType,
      description: "Compute overhead for complex visual synthesis and rendering workloads.",
      icon: <Video className="w-5 h-5" />
    },
    {
      title: "Engineering",
      type: "Programming" as PurposeType,
      description: "Optimized multitasking for large-scale development and architectural cycles.",
      icon: <Code className="w-5 h-5" />
    },
    {
      title: "Workstation",
      type: "EverydayUse" as PurposeType,
      description: "Stable performance for institutional workflows and executive productivity.",
      icon: <Laptop className="w-5 h-5" />
    }
  ];

  const handleAutomaticBuild = () => {
    if (!purpose) {
      toast.error("Please select a curation objective first");
      return;
    }

    setLocalBuildMode("automatic");
    setBuildMode("automatic");
    toast.success("System is computing the optimal configuration");
  };

  const handleManualBuild = () => {
    if (!purpose) {
      toast.error("Please select a curation objective first");
      return;
    }
    
    setLocalBuildMode("manual");
    setBuildMode("manual");
    toast.success("Manual architectural control established");
  };

  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold text-tech-dark dark:text-white mb-8">
        Performance Intent
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-10 rounded-2xl border-none mt-12 shadow-2xl"
        >
          <h3 className="text-2xl font-bold mb-8">Curation Methodology</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card 
              className="cursor-pointer glass-card-hover glass-card border-none p-6"
              onClick={handleAutomaticBuild}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-tech-purple/10 text-tech-purple">
                  <Wand className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl">System Synthesis</CardTitle>
              </div>
              <CardDescription className="text-base leading-relaxed font-medium">
                Allow the curation engine to architect the optimal component ecosystem based on your performance intent.
              </CardDescription>
            </Card>

            <Card 
              className="cursor-pointer glass-card-hover glass-card border-none p-6"
              onClick={handleManualBuild}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-tech-purple/10 text-tech-purple">
                  <Sliders className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl">Manual Control</CardTitle>
              </div>
              <CardDescription className="text-base leading-relaxed font-medium">
                Exercise full architectural authority and personally select each institutional-grade component.
              </CardDescription>
            </Card>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PurposeSelector;
