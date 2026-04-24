import React from "react";
import { Card } from "@/components/ui/Card";

interface BudgetProgressCardProps {
  title: string;
  totalBudget: number;
  spentAmount: number;
}

export function BudgetProgressCard({ title, totalBudget, spentAmount }: BudgetProgressCardProps) {
  const remaining = totalBudget - spentAmount;
  const percentage = Math.min((spentAmount / totalBudget) * 100, 100);

  return (
    <Card>
      <p className="text-text-secondary font-medium text-sm mb-1">{title}</p>
      <h2 className="text-4xl font-bold tracking-tight text-primary">
        ₹{remaining.toLocaleString()}
      </h2>
      <div className="mt-4 w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
        <div 
          className="bg-primary h-full rounded-full transition-all duration-500" 
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-xs text-text-secondary mt-2 text-right">
        {percentage.toFixed(0)}% of ₹{totalBudget.toLocaleString()} budget used
      </p>
    </Card>
  );
}
