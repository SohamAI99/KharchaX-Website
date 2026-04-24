import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

export default function AddExpensePage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div>
        <Link href="/group" className="text-secondary hover:underline text-sm font-medium flex items-center gap-1 mb-4">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to Group
        </Link>
        <h1 className="text-3xl font-bold">Add New Expense</h1>
        <p className="text-text-secondary mt-1">Record a new payment for the group.</p>
      </div>

      <Card className="space-y-6">
        
        {/* Title & Amount Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Expense Title</label>
            <input 
              type="text" 
              placeholder="e.g. Dinner at absolute barbeques"
              className="w-full px-4 py-3 rounded-xl border border-border/50 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Amount (₹)</label>
            <input 
              type="number" 
              placeholder="0.00"
              className="w-full px-4 py-3 rounded-xl border border-border/50 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium text-xl text-primary"
            />
          </div>
        </div>

        {/* Paid By Row */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Paid By</label>
          <select className="w-full px-4 py-3 rounded-xl border border-border/50 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium appearance-none">
            <option>You (Soham)</option>
            <option>Rahul</option>
            <option>Sneha</option>
          </select>
        </div>

        {/* Split Among Row */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Split Among</label>
          
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button className="flex-1 py-2 text-sm font-medium bg-white dark:bg-slate-700 shadow-sm rounded-lg">Equally</button>
            <button className="flex-1 py-2 text-sm font-medium text-text-secondary hover:text-foreground">Unequally</button>
            <button className="flex-1 py-2 text-sm font-medium text-text-secondary hover:text-foreground">By Percent</button>
          </div>

          <div className="space-y-2 pt-2">
             {["You (Soham)", "Rahul", "Sneha", "Amit"].map((name) => (
                <label key={name} className="flex items-center justify-between p-3 border border-border/50 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-primary focus:ring-primary" />
                    <span className="font-medium">{name}</span>
                  </div>
                  <span className="text-sm text-text-secondary">₹0.00</span>
                </label>
             ))}
          </div>
        </div>

        <div className="pt-4 border-t border-border/50">
           <Button className="w-full h-14 text-lg">Add Final Expense</Button>
        </div>
      </Card>

    </div>
  );
}
