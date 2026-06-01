
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBuildStore } from "@/store/useBuildStore";
import { IndianRupee, Coins } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const BudgetInput: React.FC = () => {
  const { budget, setBudget } = useBuildStore();
  const [localBudget, setLocalBudget] = useState(budget > 0 ? budget.toString() : "");

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, "");
    setLocalBudget(value);
  };

  const handleBudgetSubmit = () => {
    const parsedBudget = parseInt(localBudget, 10);
    if (!isNaN(parsedBudget) && parsedBudget > 0) {
      setBudget(parsedBudget);
      toast.success(`Budget set to ₹${parsedBudget.toLocaleString()}`);
    } else {
      toast.error("Please enter a valid budget");
    }
  };

  const budgetRanges = [
    { label: "Budget", value: 30000, color: "bg-green-400" },
    { label: "Mid-range", value: 60000, color: "bg-blue-500" },
    { label: "High-end", value: 100000, color: "bg-purple-500" },
    { label: "Enthusiast", value: 150000, color: "bg-red-500" }
  ];

  // Calculate a percentage value for the budget progress bar
  const getProgressValue = () => {
    const currentBudget = parseInt(localBudget, 10) || 0;
    const maxBudget = 200000; // Maximum reference point
    return Math.min(Math.round((currentBudget / maxBudget) * 100), 100);
  };

  return (
    <Card className="mb-8 hover-scale transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl text-tech-dark flex items-center">
          <Coins className="mr-2 text-tech-purple" size={24} />
          What's your budget?
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-gray-500">₹</span>
            </div>
            <input
              type="text"
              value={localBudget}
              onChange={handleBudgetChange}
              placeholder="Enter your budget"
              className="pl-8 w-full h-12 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-tech-purple px-4"
              onKeyDown={(e) => e.key === "Enter" && handleBudgetSubmit()}
            />
            <button
              onClick={handleBudgetSubmit}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-tech-purple text-white px-4 py-1 rounded-md hover:bg-opacity-90 transition-colors"
            >
              Set Budget
            </button>
          </div>

          {localBudget && (
            <div className="space-y-1">
              <Progress value={getProgressValue()} className="h-2" />
              <div className="flex justify-between text-xs text-gray-500">
                <span>₹0</span>
                <span>₹100,000</span>
                <span>₹200,000+</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {budgetRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => {
                  setLocalBudget(range.value.toString());
                  setBudget(range.value);
                  toast.success(`Budget set to ₹${range.value.toLocaleString()}`);
                }}
                className={`p-3 border rounded-md text-center hover:bg-gray-50 transition-all ${
                  budget === range.value ? "border-tech-purple bg-tech-purple bg-opacity-10 shadow-md" : "border-gray-200"
                }`}
              >
                <div className="font-semibold">{range.label}</div>
                <div className={`text-sm mt-1 ${range.color} text-white rounded-full px-2 py-1`}>
                  ₹{range.value.toLocaleString()}
                </div>
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetInput;
