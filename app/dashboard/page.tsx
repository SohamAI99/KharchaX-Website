"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { BalanceCard } from "@/components/shared/BalanceCard";
import { BudgetProgressCard } from "@/components/shared/BudgetProgressCard";
import { ActivityRow } from "@/components/shared/ActivityRow";

import { calculateSettlements, getUserDashboardBalances } from "@/utils/expenseLogic";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [group, setGroup] = useState<any>(null);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
      return;
    }

    if (status === "authenticated") {
      async function fetchData() {
        try {
          setError(null);
          const res = await fetch("/api/groups");
          
          if (!res.ok) throw new Error("Failed to fetch groups");
          
          const allGroups = await res.json();
          
          if (allGroups && allGroups.length > 0) {
            // For MVP: We just grab the first group they are a member of.
            // A more advanced app would list multiple groups.
            const activeGroup = allGroups[0];
            setGroup(activeGroup);

            const exRes = await fetch(`/api/groups/${activeGroup._id}/expenses`);
            if (!exRes.ok) throw new Error("Failed to fetch expenses");
            
            const groupExpenses = await exRes.json();
            setExpenses(groupExpenses);
          }
        } catch (err: any) {
          console.error("Dashboard Fetch Error:", err);
          setError("We couldn't load your dashboard data. Please check your connection.");
        } finally {
          setLoading(false);
        }
      }
      fetchData();
    }
  }, [status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4 text-text-secondary animate-in fade-in">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="font-medium animate-pulse">Loading KharchaX Dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 text-red-500 flex items-center justify-center rounded-full mb-2">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        </div>
        <h2 className="text-xl font-bold">Something went wrong</h2>
        <p className="text-text-secondary max-w-md text-center">{error}</p>
        <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">Try Again</Button>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="w-16 h-16 bg-primary/10 text-primary flex items-center justify-center rounded-full mb-2">
           <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
        </div>
        <h2 className="text-xl font-bold">Welcome to KharchaX!</h2>
        <p className="text-text-secondary max-w-md text-center">You haven't joined any groups yet. Let's create your first trip or run the seed endpoint for demo data.</p>
      </div>
    );
  }

  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  // --- ALGORTIHM MAGIC ---
  const currentUserId = (session?.user as any)?.id || "";
  const globalSettlements = calculateSettlements(expenses, group.members);
  const myBalances = getUserDashboardBalances(currentUserId, globalSettlements);

  // Helper to format Date
  const timeAgo = (dateStr: string) => {
    const hours = Math.abs(new Date().getTime() - new Date(dateStr).getTime()) / 36e5;
    if (hours < 24) return `${Math.floor(hours) || 1} hours ago`;
    return `${Math.floor(hours / 24)} days ago`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-text-secondary mt-1">Welcome back! Here's your financial overview.</p>
        </div>
        <Button className="w-full sm:w-auto flex items-center justify-center gap-2">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          <span>Add Expense</span>
        </Button>
      </div>

      {/* Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="flex flex-col justify-center">
          <p className="text-text-secondary font-medium text-sm mb-1 uppercase tracking-wider">Total Group Expenses</p>
          <h2 className="text-4xl font-bold tracking-tight text-foreground">₹{totalSpent.toLocaleString()}</h2>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <span className="bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-md font-medium">{group.mode} Mode Active</span>
            <span className="text-text-secondary font-medium">{group.name}</span>
          </div>
        </Card>

        <BudgetProgressCard 
          title="Remaining Budget"
          totalBudget={group.budget || 0}
          spentAmount={totalSpent}
        />
      </div>

      {/* Middle Section: Balances dynamically calculated via AI algorithm */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BalanceCard 
          title="You Owe"
          amount={myBalances.youOweTotal}
          type={myBalances.youOweTotal > 0 ? "debt" : "neutral"}
          items={myBalances.oweList}
        />

        <BalanceCard 
          title="You Get"
          amount={myBalances.youGetTotal}
          type={myBalances.youGetTotal > 0 ? "credit" : "neutral"}
          items={myBalances.getList}
        />
      </div>

      {/* Bottom Section: Recent Activity */}
      <div>
        <h3 className="text-xl font-bold tracking-tight mb-4 text-foreground">Recent Activity</h3>
        <Card className="p-0 overflow-hidden">
          <div className="flex flex-col">
            {expenses.length === 0 ? (
               <div className="p-8 text-center text-text-secondary text-sm">No recent expenses found.</div>
            ) : (
              expenses.map((expense) => (
                <ActivityRow 
                  key={expense._id}
                  emoji="💸" 
                  title={expense.title} 
                  addedBy={expense.paidBy.name} 
                  timeAgo={timeAgo(expense.date)} 
                  amount={expense.amount} 
                  splitCount={expense.splitAmong.length} 
                />
              ))
            )}
          </div>
        </Card>
      </div>
      
    </div>
  );
}
