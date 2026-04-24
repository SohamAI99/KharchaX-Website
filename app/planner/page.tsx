"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function PlannerPage() {
  const [mode, setMode] = useState("Trip");
  const [people, setPeople] = useState<number>(6);
  const [budget, setBudget] = useState<number>(50000);
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const generatePlan = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/ai/planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, people, budget }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate plan");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getBarColor = (index: number) => {
    const colors = ["bg-primary", "bg-secondary", "bg-[#0984E3]"];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-2">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
        </div>
        <h1 className="text-3xl font-bold">AI Budget Planner</h1>
        <p className="text-text-secondary text-lg">
          Tell us about your next gathering. KharchaX AI will allocate your budget and suggest the smartest way to split costs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8">
        
        {/* Left Side: Input Panel */}
        <Card className="space-y-6 border-primary/20 shadow-md h-fit">
          <h2 className="text-xl font-bold border-b border-border/50 pb-4">Gathering Details</h2>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Type of Gathering</label>
              <div className="grid grid-cols-3 gap-3">
                {["Trip", "Party", "Flatmate"].map((m) => (
                  <button 
                    key={m}
                    onClick={() => setMode(m)}
                    className={`py-3 rounded-xl font-medium transition-all ${
                      mode === m 
                        ? "border-2 border-primary bg-primary/5 text-primary" 
                        : "border border-border/50 hover:bg-slate-50 dark:hover:bg-slate-800 text-text-secondary"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Number of People</label>
              <input 
                type="number" 
                value={people}
                onChange={(e) => setPeople(Number(e.target.value))}
                min={1}
                className="w-full px-4 py-3 rounded-xl border border-border/50 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 font-medium" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Total Group Budget (₹)</label>
              <input 
                type="number" 
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                min={100}
                className="w-full px-4 py-3 rounded-xl border border-border/50 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 font-medium text-lg text-primary" 
              />
            </div>
            
            <div className="pt-2">
              <Button 
                onClick={generatePlan} 
                disabled={loading}
                className="w-full gap-2 text-lg h-14"
              >
                {loading ? (
                  <span className="animate-pulse">Analyzing Data...</span>
                ) : (
                  <>
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                    Generate Smart Plan
                  </>
                )}
              </Button>
            </div>
            {error && (
              <p className="text-sm text-[var(--color-debt)] text-center font-medium mt-2 p-2 bg-[var(--color-debt)]/10 rounded-lg">{error}</p>
            )}
          </div>
        </Card>

        {/* Right Side: Output/Suggestions */}
        <div className="space-y-6">
          {!result && !loading && !error && (
             <div className="h-full flex items-center justify-center border-2 border-dashed border-border p-12 rounded-2xl text-center text-text-secondary">
               Configure your parameters on the left and tap Generate to see the AI magic!
             </div>
          )}

          {loading && (
             <div className="h-full flex items-center justify-center p-12 rounded-2xl text-center">
               <div className="flex flex-col items-center space-y-4">
                 <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                 <p className="text-primary font-medium animate-pulse">Running KharchaX Neural Engine...</p>
               </div>
             </div>
          )}

          {result && (
            <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-6">
              <Card className="bg-primary/5 border-primary/20">
                <h3 className="text-lg font-bold text-primary mb-2">AI Plan Generated! ✨</h3>
                <p className="text-sm text-foreground">Based on your input, here is the optimized budget structure for a {mode} with {people} people.</p>
              </Card>

              <Card className="space-y-4">
                <h4 className="font-bold border-b border-border/50 pb-2">Suggested Allocation</h4>
                
                <div className="space-y-5 mt-4">
                  {result.breakdown.map((item: any, idx: number) => (
                    <div key={idx}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{item.category} ({item.percentage}%)</span>
                        <span className="font-bold text-primary">₹{item.amount.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-1000 ${getBarColor(idx)}`} style={{width: `${item.percentage}%`}}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <h4 className="font-bold border-b border-border/50 pb-3 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  AI Travel Tips
                </h4>
                <ul className="space-y-3 text-sm text-text-secondary list-none">
                  {result.tips.map((tip: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-border/40">
                      <span className="text-primary mt-0.5">•</span>
                      <span className="leading-relaxed text-foreground">{tip}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
