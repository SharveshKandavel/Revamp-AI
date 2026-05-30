import React from "react";
import { motion } from "framer-motion";
import MobileBuildCard from "./MobileBuildCard";
import { useMobileDevice } from "@/hooks/useMobile";

interface Build {
  id: string;
  name: string;
  price: number;
  purpose: string;
  parts: string[];
  image?: string;
}

interface MobileBuildListProps {
  builds: Build[];
  onViewBuild?: (buildId: string) => void;
}

const MobileBuildList: React.FC<MobileBuildListProps> = ({ builds, onViewBuild }) => {
  const { isMobile } = useMobileDevice();

  if (!isMobile && builds.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-muted-foreground mb-2">No builds found</h3>
        <p className="text-muted-foreground">Start building your first PC configuration!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {builds.map((build, index) => (
        <motion.div
          key={build.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <MobileBuildCard
            build={build}
            onView={onViewBuild}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default MobileBuildList;