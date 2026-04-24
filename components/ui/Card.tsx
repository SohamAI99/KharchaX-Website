import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ className = "", children, ...props }: CardProps) {
  return (
    <div 
      className={`bg-white dark:bg-slate-800/50 p-6 rounded-[12px] shadow-sm border border-border/50 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
