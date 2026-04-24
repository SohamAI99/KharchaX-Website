"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

export default function AuthPage() {
  const router = useRouter();
  const { status } = useSession();
  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "authenticated") router.push("/dashboard");
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        const res = await signIn("credentials", { redirect: false, email, password });
        if (res?.error) {
          setError("Invalid email or password. Please try again.");
        } else {
          router.push("/dashboard");
        }
      } else {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Signup failed. Please try again.");
        } else {
          const loginRes = await signIn("credentials", { redirect: false, email, password });
          if (!loginRes?.error) router.push("/dashboard");
          else setError("Account created but login failed. Please sign in.");
        }
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "form-input";

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <motion.div
        className="w-full max-w-md space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center justify-center w-12 h-12 bg-primary rounded-xl text-white font-bold text-2xl mb-6 shadow-md hover:brightness-110 transition-all">
            X
          </Link>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            {isLogin ? "Welcome back" : "Create an account"}
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            {isLogin ? "Sign in to access your groups and expenses." : "Start splitting expenses with your crew."}
          </p>
        </div>

        <Card className="p-6 sm:p-8">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <AnimatePresence>
              {error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {!isLogin && (
                <motion.div
                  key="name-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-1.5 pb-1">
                    <label className="block text-sm font-medium text-foreground">Full Name</label>
                    <input
                      type="text"
                      required={!isLogin}
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className={inputClass}
                      placeholder="John Doe"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-foreground">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={inputClass}
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-foreground">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={inputClass}
                placeholder={isLogin ? "••••••••" : "Min 8 chars, letters & numbers"}
              />
              {!isLogin && (
                <p className="text-xs text-text-secondary">Must be at least 8 characters with letters and numbers.</p>
              )}
            </div>

            <Button type="submit" className="w-full py-3 text-base" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isLogin ? "Signing in..." : "Creating account..."}
                </span>
              ) : (
                isLogin ? "Sign In" : "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => { setIsLogin(!isLogin); setError(""); }}
              className="text-sm font-medium text-primary hover:text-primary-hover transition-colors"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
