"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "@/components/ThemeProvider";
import { useState } from "react";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/planner", label: "AI Planner" },
];

function SunIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  );
}

export default function Navbar() {
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-[var(--card-border)] bg-[var(--navbar-bg)] backdrop-blur-md">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg leading-none">X</div>
            <Link href={session ? "/dashboard" : "/"} className="text-xl font-bold tracking-tight text-foreground">
              KharchaX
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden sm:flex items-center gap-6">
            {session && navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-sm font-medium transition-colors ${
                  pathname === href
                    ? "text-primary"
                    : "text-text-secondary hover:text-foreground"
                }`}
              >
                {label}
              </Link>
            ))}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary hover:text-foreground hover:bg-[var(--card-border)] transition-all"
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>

            {/* Auth */}
            {session ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                    {session.user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="text-sm font-medium text-foreground hidden md:block">{session.user?.name}</span>
                </div>
                <Button size="sm" variant="outline" onClick={() => signOut({ callbackUrl: "/" })}>
                  Logout
                </Button>
              </div>
            ) : (
              <Link href="/auth">
                <Button size="sm">Sign In</Button>
              </Link>
            )}
          </div>

          {/* Mobile: theme + hamburger */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary hover:text-foreground transition-all"
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary hover:text-foreground transition-all"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-4 space-y-3">
          {session && navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`block text-sm font-medium py-2 transition-colors ${
                pathname === href ? "text-primary" : "text-text-secondary hover:text-foreground"
              }`}
            >
              {label}
            </Link>
          ))}
          {session ? (
            <div className="pt-2 border-t border-[var(--card-border)]">
              <p className="text-sm text-text-secondary mb-2">{session.user?.name}</p>
              <Button size="sm" variant="outline" className="w-full" onClick={() => signOut({ callbackUrl: "/" })}>
                Logout
              </Button>
            </div>
          ) : (
            <Link href="/auth" onClick={() => setMobileOpen(false)}>
              <Button size="sm" className="w-full">Sign In</Button>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
