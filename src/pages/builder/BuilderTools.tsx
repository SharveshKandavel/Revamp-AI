import React from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wrench, Calculator, Package, Zap, Monitor, HardDrive, Cpu, MemoryStick } from "lucide-react";
import BuildVisualizer3D from "@/components/BuildVisualizer3D";
import PowerConsumptionCalculator from "@/components/PowerConsumptionCalculator";
import CompatibilityCheck from "@/components/CompatibilityCheck";
import BuildCompatibilityVisualizer from "@/components/BuildCompatibilityVisualizer";
import { toast } from "sonner";

const BuilderTools = () => {
  const tools = [
    {
      title: "3D Build Visualizer",
      description: "Interactive 3D visualization of PC components",
      icon: <Package className="w-6 h-6" />,
      status: "Active",
      component: "visualizer"
    },
    {
      title: "Power Calculator",
      description: "Calculate total power consumption and PSU requirements",
      icon: <Zap className="w-6 h-6" />,
      status: "Active",
      component: "power"
    },
    {
      title: "Compatibility Checker",
      description: "Verify component compatibility and identify issues",
      icon: <Wrench className="w-6 h-6" />,
      status: "Active",
      component: "compatibility"
    },
    {
      title: "Performance Analyzer",
      description: "Analyze build performance and bottlenecks",
      icon: <Monitor className="w-6 h-6" />,
      status: "Coming Soon",
      component: null
    },
    {
      title: "Price Tracker",
      description: "Track component prices across different vendors",
      icon: <Calculator className="w-6 h-6" />,
      status: "Coming Soon",
      component: null
    },
    {
      title: "Benchmark Suite",
      description: "Compare build performance with benchmarks",
      icon: <Cpu className="w-6 h-6" />,
      status: "Coming Soon",
      component: null
    }
  ];

  const [activeTool, setActiveTool] = React.useState<string>("visualizer");

  const handleToolClick = (tool: any) => {
    if (tool.component) {
      setActiveTool(tool.component);
    } else {
      toast.info(`${tool.title} is coming soon!`);
    }
  };

  const renderActiveTool = () => {
    switch (activeTool) {
      case "visualizer":
        return <BuildVisualizer3D />;
      case "power":
        return <PowerConsumptionCalculator />;
      case "compatibility":
        return (
          <div className="space-y-6">
            <CompatibilityCheck />
            <BuildCompatibilityVisualizer />
          </div>
        );
      default:
        return (
          <Card>
            <CardContent className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">Select a tool to get started</p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Builder Tools
          </h1>
          <p className="text-muted-foreground">
            Professional tools to help you build and validate PC configurations
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, index) => (
            <Card 
              key={index}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                activeTool === tool.component ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => handleToolClick(tool)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    {tool.icon}
                  </div>
                  <Badge 
                    variant={tool.status === "Active" ? "default" : "secondary"}
                    className={tool.status === "Active" ? "bg-green-100 text-green-800" : ""}
                  >
                    {tool.status}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{tool.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{tool.description}</CardDescription>
                {tool.component && (
                  <Button 
                    className="w-full mt-4" 
                    variant={activeTool === tool.component ? "default" : "outline"}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTool(tool.component);
                    }}
                  >
                    {activeTool === tool.component ? "Active" : "Launch Tool"}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Active Tool Display */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>
                {tools.find(t => t.component === activeTool)?.title || "Select a Tool"}
              </CardTitle>
              <CardDescription>
                {tools.find(t => t.component === activeTool)?.description || "Choose a tool from above to get started"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderActiveTool()}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BuilderTools;