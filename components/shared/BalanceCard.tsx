import React from "react";
import { Card } from "@/components/ui/Card";

interface BalanceItem {
  name: string;
  amount: number;
}

interface BalanceCardProps {
  title: string;
  amount: number;
  type: "debt" | "credit" | "neutral";
  items?: BalanceItem[];
}

export function BalanceCard({ title, amount, type, items = [] }: BalanceCardProps) {
  const getBorderColor = () => {
    switch (type) {
      case "debt": return "border-l-[var(--color-debt)]";
      case "credit": return "border-l-secondary";
      default: return "border-l-primary";
    }
  };

  const getTextColor = () => {
    switch (type) {
      case "debt": return "text-[var(--color-debt)]";
      case "credit": return "text-secondary";
      default: return "text-primary";
    }
  };

  return (
    <Card className={`border-l-[4px] ${getBorderColor()}`}>
      <p className="text-text-secondary font-medium text-sm mb-1">{title}</p>
      <h2 className={`text-3xl font-bold tracking-tight ${getTextColor()}`}>₹{amount.toLocaleString()}</h2>
      
      {items.length > 0 && (
        <div className="mt-4 space-y-3">
          {items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center text-sm">
              <span className="text-foreground">
                {type === "debt" ? "To" : "From"} {item.name}
              </span>
              <span className="font-semibold">₹{item.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
