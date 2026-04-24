"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

const modes = [
  { value: "Trip", icon: "🌴", desc: "Vacations, day trips, travel" },
  { value: "Party", icon: "🎉", desc: "Events, celebrations, dinners" },
  { value: "Flatmate", icon: "🏠", desc: "Rent, utilities, groceries" },
];

export default function CreateGroupPage() {
  const router = useRouter();
  const { status } = useSession();

  const [name, setName] = useState("");
  const [mode, setMode] = useState("Trip");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (status === "unauthenticated") {
    router.push("/auth");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError("Group name is required."); return; }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          mode,
          budget: budget ? Number(budget) : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create group.");

      router.push(`/groups/${data._id}`);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto py-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="mb-8">
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-foreground mb-5 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Dashboard
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Create New Group</h1>
        <p className="text-text-secondary mt-1">Set up a shared space to track and split expenses.</p>
      </div>

      <Card className="p-6 sm:p-8">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Group Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Goa Trip 2026, Flat 4B"
              className="form-input"
            />
          </div>

          {/* Mode */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Type</label>
            <div className="grid grid-cols-3 gap-3">
              {modes.map(({ value, icon, desc }) => (
                <motion.button
                  key={value}
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setMode(value)}
                  className={`py-4 px-3 rounded-xl border text-center transition-all ${
                    mode === value
                      ? "border-primary bg-primary/8 text-foreground shadow-sm"
                      : "border-[var(--card-border)] text-text-secondary hover:border-text-secondary"
                  }`}
                >
                  <div className="text-2xl mb-1">{icon}</div>
                  <div className="text-sm font-semibold">{value}</div>
                  <div className="text-xs text-text-secondary mt-0.5 leading-tight hidden sm:block">{desc}</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Budget (optional) */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Total Budget <span className="text-text-secondary font-normal">(Optional)</span>
            </label>
            <input
              type="number"
              min="0"
              value={budget}
              onChange={e => setBudget(e.target.value)}
              placeholder="₹ e.g. 50000"
              className="form-input"
            />
            <p className="text-xs text-text-secondary">Used by the AI Planner for budget optimization advice.</p>
          </div>

          <Button type="submit" className="w-full py-6 text-base" disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating...
              </span>
            ) : "Create Group"}
          </Button>
        </form>
      </Card>
    </motion.div>
  );
}
