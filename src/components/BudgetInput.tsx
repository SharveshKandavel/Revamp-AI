
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
      toast.success(`Budget set to $${parsedBudget.toLocaleString()}`);
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
    <Card className="mb-12 glass-card border-none shadow-2xl overflow-hidden relative group transition-all duration-500">
      <div className="absolute top-0 right-0 w-64 h-64 bg-tech-purple/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-tech-purple/10 transition-colors" />
      
      <CardHeader className="pb-6 pt-10 px-8 relative z-10">
        <CardTitle className="text-3xl font-bold text-tech-dark dark:text-white flex items-center tracking-tight">
          <Coins className="mr-3 text-tech-purple" size={28} />
          Define Your Investment
        </CardTitle>
      </CardHeader>
      
      <CardContent className="px-8 pb-10 relative z-10">
        <div className="flex flex-col space-y-10">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none">
              <span className="text-2xl font-light text-gray-400">$</span>
            </div>
            <input
              type="text"
              value={localBudget}
              onChange={handleBudgetChange}
              placeholder="0.00"
              className="pl-12 w-full h-20 text-4xl font-bold bg-transparent border-b-2 border-gray-100 dark:border-gray-800 focus:border-tech-purple focus:outline-none transition-colors placeholder:text-gray-200"
              onKeyDown={(e) => e.key === "Enter" && handleBudgetSubmit()}
            />
            <button
              onClick={handleBudgetSubmit}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-tech-dark hover:bg-black text-white px-8 h-12 rounded-full font-bold text-sm tracking-wider uppercase hover-lift"
            >
              Establish
            </button>
          </div>

          {localBudget && (
            <div className="space-y-3">
              <Progress value={getProgressValue()} className="h-1.5 bg-gray-100 dark:bg-gray-800" />
              <div className="flex justify-between text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                <span>Entry-Level</span>
                <span>Elite Architecture</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {budgetRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => {
                  setLocalBudget(range.value.toString());
                  setBudget(range.value);
                  toast.success(`Investment established at $${range.value.toLocaleString()}`);
                }}
                className={`p-4 border rounded-2xl text-left transition-all duration-300 hover-lift ${
                  budget === range.value 
                    ? "border-tech-purple bg-tech-purple/5 shadow-xl" 
                    : "glass-card border-none hover:bg-white/60 dark:hover:bg-slate-900/60"
                }`}
              >
                <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">{range.label}</div>
                <div className={`text-lg font-bold ${range.color.replace('bg-', 'text-')}`}>
                  ${(range.value / 1000).toLocaleString()}k
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
