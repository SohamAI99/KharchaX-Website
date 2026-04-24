import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function Button({ 
  variant = "primary", 
  size = "md", 
  className = "", 
  children, 
  ...props 
}: ButtonProps) {
  
  // Base classes according to Design Doc
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all active:scale-95 rounded-[12px] shadow-sm disabled:opacity-50 disabled:pointer-events-none";
  
  // Style variations
  const variants = {
    primary: "bg-primary text-white hover:brightness-110",
    secondary: "bg-secondary text-white hover:brightness-110",
    outline: "bg-transparent border border-border/50 text-foreground hover:bg-black/5 dark:hover:bg-white/5",
  };

  // Size variations
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
