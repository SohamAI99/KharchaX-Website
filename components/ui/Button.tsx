import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
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
  
  // Base classes - crisp flat design
  const baseClasses = "inline-flex items-center justify-center font-medium transition-colors active:scale-95 rounded-lg disabled:opacity-50 disabled:pointer-events-none";
  
  // Style variations (Notion/Linear style)
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-hover shadow-sm",
    secondary: "bg-secondary text-white hover:brightness-110 shadow-sm",
    outline: "bg-transparent border border-[var(--card-border)] text-foreground hover:bg-black/5 dark:hover:bg-white/5",
    ghost: "bg-transparent text-text-secondary hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5",
  };

  // Size variations
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
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
