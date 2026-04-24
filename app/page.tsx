import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-12 animate-in fade-in zoom-in duration-500">
      
      {/* Hero Section */}
      <section className="space-y-6 max-w-3xl">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground">
          Split smart. <span className="text-primary">No drama.</span>
        </h1>
        <p className="text-xl text-text-secondary">
          KharchaX is the ultimate AI-powered expense manager for trips, parties, and flatmates. Stop fighting over calculators and start living.
        </p>
        <div className="pt-4 flex items-center justify-center space-x-4">
          <Link 
            href="/dashboard"
            className="bg-primary hover:brightness-110 active:scale-95 text-white px-8 py-4 rounded-2xl font-medium text-lg transition-all shadow-lg"
          >
            Create Group
          </Link>
          <Link 
            href="#features"
            className="bg-transparent border border-border/50 hover:bg-black/5 dark:hover:bg-white/5 text-foreground px-8 py-4 rounded-2xl font-medium text-lg transition-all"
          >
            See How
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
        <div className="bg-white dark:bg-slate-800/50 p-8 rounded-2xl shadow-sm border border-border/50 hover:-translate-y-1 transition-transform">
          <div className="h-12 w-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Smart Splitting</h3>
          <p className="text-text-secondary">Automatically calculates who owes whom and shows simple settlement instructions.</p>
        </div>

        <div className="bg-white dark:bg-slate-800/50 p-8 rounded-2xl shadow-sm border border-border/50 hover:-translate-y-1 transition-transform">
          <div className="h-12 w-12 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center mb-6">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.965 11.965 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Fairness Analyzer</h3>
          <p className="text-text-secondary">Detects overpaying and underpaying members to ensure true equality in your groups.</p>
        </div>

        <div className="bg-white dark:bg-slate-800/50 p-8 rounded-2xl shadow-sm border border-border/50 hover:-translate-y-1 transition-transform">
          <div className="h-12 w-12 bg-[#0984E3]/10 text-[#0984E3] rounded-xl flex items-center justify-center mb-6">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </div>
          <h3 className="text-xl font-bold mb-2">AI Budget Planner</h3>
          <p className="text-text-secondary">Enter your budget and let AI suggest food quantities, optimizations, and early alerts.</p>
        </div>
      </section>
    </div>
  );
}
