"use client";

import { use, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { calculateSettlements, getUserDashboardBalances } from "@/utils/expenseLogic";

function SkeletonRow() {
  return (
    <div className="flex items-center justify-between p-4 border-b border-[var(--card-border)] last:border-0">
      <div className="flex items-center gap-3">
        <div className="skeleton w-9 h-9 rounded-lg" />
        <div className="space-y-1.5">
          <div className="skeleton w-32 h-4 rounded" />
          <div className="skeleton w-20 h-3 rounded" />
        </div>
      </div>
      <div className="skeleton w-16 h-5 rounded" />
    </div>
  );
}

export default function GroupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { status, data: session } = useSession();
  const router = useRouter();

  const [group, setGroup] = useState<any>(null);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const currentUserId = (session?.user as any)?.id || "";

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/"); return; }
    if (status !== "authenticated") return;

    Promise.all([
      fetch(`/api/groups/${id}`).then(r => { if (!r.ok) throw new Error("group"); return r.json(); }),
      fetch(`/api/groups/${id}/expenses`).then(r => { if (!r.ok) throw new Error("expenses"); return r.json(); }),
    ])
      .then(([g, e]) => { setGroup(g); setExpenses(e); })
      .catch(() => setError("Failed to load group data. Please try again."))
      .finally(() => setLoading(false));
  }, [status, router, id]);

  const handleCopyInvite = () => {
    if (!group?.inviteCode) return;
    navigator.clipboard.writeText(`${window.location.origin}/invite/${group.inviteCode}`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  if (status === "loading" || loading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-300">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="skeleton w-48 h-8 rounded" />
            <div className="skeleton w-32 h-4 rounded" />
          </div>
          <div className="flex gap-3">
            <div className="skeleton w-32 h-10 rounded-lg" />
            <div className="skeleton w-32 h-10 rounded-lg" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-0 overflow-hidden">
              {[...Array(4)].map((_, i) => <SkeletonRow key={i} />)}
            </Card>
          </div>
          <div className="space-y-6">
            <div className="skeleton h-40 rounded-xl" />
            <div className="skeleton h-40 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 text-red-500 flex items-center justify-center rounded-full">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        </div>
        <h2 className="text-xl font-bold text-foreground">Failed to load group</h2>
        <p className="text-text-secondary text-center max-w-sm">{error}</p>
        <Button onClick={() => window.location.reload()} variant="outline">Try Again</Button>
      </div>
    );
  }

  const modeIcon: Record<string, string> = { Trip: "🌴", Party: "🎉", Flatmate: "🏠" };
  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const globalSettlements = calculateSettlements(expenses, group.members);
  const myBalances = getUserDashboardBalances(currentUserId, globalSettlements);

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-foreground mb-3 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{modeIcon[group.mode] || "🌴"}</span>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">{group.name}</h1>
              <p className="text-text-secondary text-sm">{group.members.length} Members · {group.mode} Mode</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleCopyInvite}
            disabled={!group.inviteCode}
            className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-lg border border-[var(--card-border)] text-foreground hover:bg-[var(--card-border)] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.span
                  key="copied"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-secondary"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                  Copied!
                </motion.span>
              ) : (
                <motion.span key="share" className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                  Share Invite
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
          <Link href={`/groups/${id}/add-expense`} className="flex-1 sm:flex-none">
            <Button className="w-full flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
              Add Expense
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Expenses */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-foreground">Expenses</h2>
            <span className="text-sm text-text-secondary">
              Total: <span className="font-semibold text-foreground">₹{totalSpent.toLocaleString()}</span>
            </span>
          </div>

          <Card className="p-0 overflow-hidden">
            {expenses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 text-center space-y-3">
                <span className="text-4xl">💸</span>
                <p className="font-semibold text-foreground">No expenses yet</p>
                <p className="text-sm text-text-secondary max-w-xs">Add the first expense and we'll track who owes what automatically.</p>
                <Link href={`/groups/${id}/add-expense`}>
                  <Button variant="outline" size="sm" className="mt-2">Add First Expense</Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-[var(--card-border)]">
                {expenses.map((expense, i) => (
                  <motion.div
                    key={expense._id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.25 }}
                    className="flex items-center justify-between p-4 hover:bg-[var(--background)] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-base flex-shrink-0">
                        💸
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">{expense.title}</p>
                        <p className="text-xs text-text-secondary">
                          Paid by <span className="font-medium">{expense.paidBy?.name || "Unknown"}</span>
                          {expense.splitAmong?.length > 0 && ` · Split ${expense.splitAmong.length} ways`}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-foreground">₹{expense.amount.toLocaleString()}</span>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right: Members + Balance */}
        <div className="space-y-6">
          
          {/* Members */}
          <div>
            <h2 className="text-lg font-bold text-foreground mb-3">Members</h2>
            <Card className="p-4">
              <div className="space-y-2">
                {group.members.map((member: any) => (
                  <div key={member._id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {member.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{member.name}</p>
                      {member._id === currentUserId && (
                        <p className="text-xs text-text-secondary">You</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Your Balance */}
          <div>
            <h2 className="text-lg font-bold text-foreground mb-3">Your Balance</h2>
            <div className="space-y-3">
              {/* You Owe */}
              <Card className={`p-4 ${myBalances.youOweTotal > 0 ? "border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-900/10" : ""}`}>
                <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1">You Owe</p>
                <p className={`text-2xl font-bold ${myBalances.youOweTotal > 0 ? "text-red-500" : "text-foreground"}`}>
                  ₹{myBalances.youOweTotal.toLocaleString()}
                </p>
                {myBalances.oweList.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {myBalances.oweList.map((item: any, i: number) => (
                      <p key={i} className="text-xs text-text-secondary">→ {item.to}: ₹{item.amount}</p>
                    ))}
                  </div>
                )}
              </Card>

              {/* You Get */}
              <Card className={`p-4 ${myBalances.youGetTotal > 0 ? "border-secondary/30 dark:border-secondary/20 bg-secondary/5" : ""}`}>
                <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1">You Get</p>
                <p className={`text-2xl font-bold ${myBalances.youGetTotal > 0 ? "text-secondary" : "text-foreground"}`}>
                  ₹{myBalances.youGetTotal.toLocaleString()}
                </p>
                {myBalances.getList.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {myBalances.getList.map((item: any, i: number) => (
                      <p key={i} className="text-xs text-text-secondary">← {item.from}: ₹{item.amount}</p>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </div>

          {/* Budget */}
          {group.budget && (
            <div>
              <h2 className="text-lg font-bold text-foreground mb-3">Budget</h2>
              <Card className="p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-text-secondary">Spent</span>
                  <span className="font-semibold text-foreground">₹{totalSpent.toLocaleString()} / ₹{group.budget.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-[var(--card-border)] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-700"
                    style={{ width: `${Math.min((totalSpent / group.budget) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-text-secondary mt-2">
                  {Math.max(0, group.budget - totalSpent).toLocaleString()} remaining
                </p>
              </Card>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
