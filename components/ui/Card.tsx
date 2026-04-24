import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ className = "", children, ...props }: CardProps) {
  return (
    <div 
      className={`bg-[var(--card-bg)] p-6 rounded-xl shadow-sm border border-[var(--card-border)] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
