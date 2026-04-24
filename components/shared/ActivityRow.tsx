import React from "react";

interface ActivityRowProps {
  emoji: string;
  title: string;
  addedBy: string;
  timeAgo: string;
  amount: number;
  splitCount: number;
}

export function ActivityRow({ emoji, title, addedBy, timeAgo, amount, splitCount }: ActivityRowProps) {
  return (
    <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors gap-3 sm:gap-0">
      <div className="flex items-center space-x-4">
        <div className="h-10 w-10 shrink-0 bg-primary/10 text-primary rounded-full flex items-center justify-center text-lg">
          {emoji}
        </div>
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-text-secondary">Added by {addedBy} • {timeAgo}</p>
        </div>
      </div>
      <div className="text-left sm:text-right w-full sm:w-auto pl-14 sm:pl-0">
        <p className="font-bold sm:text-base text-lg">₹{amount.toLocaleString()}</p>
        <p className="text-xs text-text-secondary">Split among {splitCount}</p>
      </div>
    </div>
  );
}
