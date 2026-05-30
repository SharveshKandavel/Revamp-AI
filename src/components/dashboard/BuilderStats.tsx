
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Users, Package, Timer, TrendingUp } from "lucide-react";

const BuilderStats = () => {
  const [stats] = useState([
    { label: "Active Builds", value: "12", icon: <Package className="w-6 h-6 text-tech-purple" />, bg: "bg-purple-100" },
    { label: "Total Clients", value: "48", icon: <Users className="w-6 h-6 text-blue-600" />, bg: "bg-blue-100" },
    { label: "Completion Rate", value: "95%", icon: <TrendingUp className="w-6 h-6 text-green-600" />, bg: "bg-green-100" },
    { label: "Avg. Build Time", value: "2.5d", icon: <Timer className="w-6 h-6 text-amber-600" />, bg: "bg-amber-100" }
  ]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="transition-all hover:shadow-md hover:-translate-y-1">
          <CardContent className="pt-4">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${stat.bg}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BuilderStats;
