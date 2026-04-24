"use client";

import { use, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

export default function AddExpensePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { status } = useSession();
  const router = useRouter();

  const [group, setGroup] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/"); return; }
    if (status !== "authenticated") return;

    fetch(`/api/groups/${id}`)
      .then(r => { if (!r.ok) throw new Error("Failed"); return r.json(); })
      .then(data => {
        setGroup(data);
        // Default: select all members
        const ids = data.members.map((m: any) => m._id);
        setSelectedMembers(ids);
        if (ids.length > 0) setPaidBy(ids[0]);
      })
      .catch(() => setError("Failed to load group members."))
      .finally(() => setLoading(false));
  }, [status, router, id]);

  const toggleMember = (memberId: string) => {
    setSelectedMembers(prev =>
      prev.includes(memberId) ? prev.filter(m => m !== memberId) : [...prev, memberId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paidBy || selectedMembers.length === 0) {
      setError("Please select who paid and at least one person to split among.");
      return;
    }

    setSubmitting(true);
    setError("");

    const splitAmong = selectedMembers.map(userId => ({ user: userId }));
    
    try {
      const res = await fetch(`/api/groups/${id}/expenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, amount: Number(amount), paidBy, splitAmong }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add expense.");

      router.push(`/groups/${id}`);
    } catch (err: any) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  const perPersonAmount = amount && selectedMembers.length > 0
    ? (Number(amount) / selectedMembers.length).toFixed(2)
    : null;

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
        <div className="skeleton w-40 h-8 rounded" />
        <div className="skeleton w-full h-96 rounded-xl" />
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-2xl mx-auto space-y-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Back */}
      <div>
        <Link
          href={`/groups/${id}`}
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-foreground mb-4 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to {group?.name || "Group"}
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Add Expense</h1>
        <p className="text-text-secondary mt-1">Record a new payment and split it among the group.</p>
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
          {/* Title + Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Expense Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Dinner at restaurant"
                className="form-input"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Amount (₹)</label>
              <input
                type="number"
                required
                min="1"
                step="0.01"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0.00"
                className="form-input"
              />
            </div>
          </div>

          {/* Paid By */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Paid By</label>
            <select
              value={paidBy}
              onChange={e => setPaidBy(e.target.value)}
              className="form-input"
            >
              {group?.members.map((member: any) => (
                <option key={member._id} value={member._id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          {/* Split Among */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Split Among</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMembers(group.members.map((m: any) => m._id))}
                  className="text-xs text-primary hover:underline font-medium"
                >
                  All
                </button>
                <span className="text-text-secondary text-xs">·</span>
                <button
                  type="button"
                  onClick={() => setSelectedMembers([])}
                  className="text-xs text-text-secondary hover:text-foreground transition-colors"
                >
                  None
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {group?.members.map((member: any) => {
                const isSelected = selectedMembers.includes(member._id);
                return (
                  <motion.label
                    key={member._id}
                    whileHover={{ scale: 1.005 }}
                    whileTap={{ scale: 0.995 }}
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? "border-primary/40 bg-primary/5"
                        : "border-[var(--card-border)] hover:border-[var(--text-secondary)]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleMember(member._id)}
                        className="w-4 h-4 accent-primary"
                      />
                      <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                        {member.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-foreground">{member.name}</span>
                    </div>
                    {perPersonAmount && isSelected && (
                      <span className="text-sm font-semibold text-primary">₹{perPersonAmount}</span>
                    )}
                  </motion.label>
                );
              })}
            </div>

            {perPersonAmount && selectedMembers.length > 1 && (
              <p className="text-xs text-text-secondary text-center">
                ₹{perPersonAmount} each · split equally among {selectedMembers.length} people
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="pt-2">
            <Button
              type="submit"
              className="w-full py-6 text-base"
              disabled={submitting || selectedMembers.length === 0}
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </span>
              ) : "Add Expense"}
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
}
