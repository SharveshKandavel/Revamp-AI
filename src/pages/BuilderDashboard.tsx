
import React from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import BuilderStats from "@/components/dashboard/BuilderStats";
import RecentBuilds from "@/components/dashboard/RecentBuilds";
import BuilderBuildRequests from "@/components/dashboard/BuilderBuildRequests";
import BuildVisualizer3D from "@/components/BuildVisualizer3D";
import PowerConsumptionCalculator from "@/components/PowerConsumptionCalculator";

const BuilderDashboard = () => {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-tech-dark mb-8">
          Welcome Back, Builder
        </h1>
        
        <BuilderStats />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="space-y-8">
            <BuilderBuildRequests />
            <RecentBuilds />
          </div>
          <div className="space-y-8">
            <BuildVisualizer3D />
            <PowerConsumptionCalculator />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BuilderDashboard;
