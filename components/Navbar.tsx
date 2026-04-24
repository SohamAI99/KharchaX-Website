"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="fixed top-0 w-full bg-[var(--background)]/80 backdrop-blur-md border-[var(--card-border)] border-b z-50">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg leading-none pb-0.5">X</div>
            <Link href="/" className="text-xl font-bold tracking-tight text-foreground">
              KharchaX
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/dashboard" className="text-text-secondary hover:text-foreground text-sm font-medium transition-colors">
              Dashboard
            </Link>
            
            {session ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {session.user?.image ? (
                    <img src={session.user.image} alt="Profile" className="w-8 h-8 rounded-full" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                      {session.user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                  <span className="text-sm font-medium hidden sm:block">{session.user?.name}</span>
                </div>
                <Button size="sm" variant="outline" onClick={() => signOut()}>Logout</Button>
              </div>
            ) : (
              <Link href="/auth">
                <Button size="sm">Sign In</Button>
              </Link>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
}
