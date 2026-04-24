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
    <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 transition-colors gap-3 sm:gap-0 border-b border-[var(--card-border)] last:border-0">
      <div className="flex items-center space-x-4">
        <div className="h-10 w-10 shrink-0 bg-black/5 dark:bg-white/10 rounded-lg flex items-center justify-center text-lg">
          {emoji}
        </div>
        <div>
          <p className="font-medium text-foreground leading-snug">{title}</p>
          <p className="text-xs text-text-secondary mt-0.5">Added by {addedBy} • {timeAgo}</p>
        </div>
      </div>
      <div className="text-left sm:text-right w-full sm:w-auto pl-14 sm:pl-0 flex flex-col justify-center">
        <p className="font-semibold text-foreground text-sm sm:text-base">₹{amount.toLocaleString()}</p>
        <p className="text-[11px] text-text-secondary font-medium tracking-wide uppercase mt-0.5">Split / {splitCount}</p>
      </div>
    </div>
  );
}
