"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ActivityRow } from "@/components/shared/ActivityRow";
import { BalanceCard } from "@/components/shared/BalanceCard";

export default function GroupPage() {
  const [group, setGroup] = useState<any>(null);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setError(null);
        const res = await fetch("/api/groups");
        if (!res.ok) throw new Error("Failed to fetch group details");

        const allGroups = await res.json();
        
        if (allGroups && allGroups.length > 0) {
          const activeGroup = allGroups[0];
          setGroup(activeGroup);

          const exRes = await fetch(`/api/groups/${activeGroup._id}/expenses`);
          if (!exRes.ok) throw new Error("Failed to fetch expenses");
          
          const groupExpenses = await exRes.json();
          setExpenses(groupExpenses);
        }
      } catch (err: any) {
        console.error("Error fetching group data:", err);
        setError("Unable to load group expenses. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4 text-text-secondary animate-in fade-in">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="font-medium animate-pulse">Loading Ledger...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 text-red-500 flex items-center justify-center rounded-full mb-2">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        </div>
        <h2 className="text-xl font-bold">Failed to load data</h2>
        <p className="text-text-secondary max-w-md text-center">{error}</p>
        <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">Refresh Page</Button>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <h2 className="text-2xl font-bold">No Group Selected</h2>
        <p className="text-text-secondary">Please create a group to start tracking expenses.</p>
      </div>
    );
  }

  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Group Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-4xl">🌴</span>
            <h1 className="text-3xl font-bold">{group.name}</h1>
          </div>
          <p className="text-text-secondary">{group.members.length} Members • Created recently</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button variant="outline" className="w-full sm:w-auto flex-1">Share Code</Button>
          <Button className="w-full sm:w-auto flex-1">Add Expense</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Expense List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-end">
            <h2 className="text-xl font-bold">Group Expenses</h2>
            <span className="text-sm text-text-secondary font-medium">Total: ₹{totalSpent.toLocaleString()}</span>
          </div>
          
          <Card className="p-0 overflow-hidden">
            <div className="divide-y divide-border/50">
              {expenses.length === 0 ? (
                 <div className="p-6 text-center text-text-secondary">No expenses added yet.</div>
              ) : (
                expenses.map(expense => (
                  <ActivityRow 
                    key={expense._id}
                    emoji="💸" 
                    title={expense.title} 
                    addedBy={expense.paidBy.name} 
                    timeAgo="Recently" 
                    amount={expense.amount} 
                    splitCount={expense.splitAmong.length} 
                  />
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Right Side: Members & Balance Summary */}
        <div className="space-y-8">
          
          {/* Members list */}
          <div>
            <h2 className="text-xl font-bold mb-4">Members</h2>
            <Card className="p-4">
              <div className="flex flex-wrap gap-2">
                {group.members.map((member: any) => (
                   <div key={member._id} className="bg-primary/5 border border-primary/20 text-foreground px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2">
                     <div className="w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-[10px]">
                       {member.name.charAt(0)}
                     </div>
                     {member.name}
                   </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Quick Summary */}
          {/* Static for now until Algorithm implemented */}
          <div>
             <h2 className="text-xl font-bold mb-4">Your Summary</h2>
             <BalanceCard 
                title="Your Overall Balance"
                amount={0}
                type="neutral"
             />
             <p className="text-xs text-text-secondary mt-3 text-center">Calculated across {expenses.length} expenses</p>
          </div>
          
        </div>
      </div>
    </div>
  );
}
