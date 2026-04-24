"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

const modeIcon: Record<string, string> = { Trip: "🌴", Party: "🎉", Flatmate: "🏠" };
const modeColor: Record<string, string> = {
  Trip: "text-primary bg-primary/10",
  Party: "text-secondary bg-secondary/10",
  Flatmate: "text-[#0984E3] bg-[#0984E3]/10",
};

function GroupCardSkeleton() {
  return (
    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6 space-y-4">
      <div className="flex justify-between">
        <div className="skeleton w-10 h-10 rounded-lg" />
        <div className="skeleton w-16 h-6 rounded-md" />
      </div>
      <div className="skeleton w-3/4 h-6 rounded" />
      <div className="skeleton w-1/3 h-4 rounded" />
      <div className="skeleton w-full h-px rounded mt-2" />
      <div className="skeleton w-24 h-4 rounded" />
    </div>
  );
}

export default function Dashboard() {
  const { status } = useSession();
  const router = useRouter();

  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/"); return; }

    if (status === "authenticated") {
      fetch("/api/groups")
        .then(r => { if (!r.ok) throw new Error("Failed"); return r.json(); })
        .then(data => setGroups(data))
        .catch(() => setError("Couldn't load your groups. Please try again."))
        .finally(() => setLoading(false));
    }
  }, [status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-300">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="skeleton w-40 h-8 rounded" />
            <div className="skeleton w-64 h-4 rounded" />
          </div>
          <div className="skeleton w-36 h-10 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => <GroupCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 text-red-500 flex items-center justify-center rounded-full">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        </div>
        <h2 className="text-xl font-bold text-foreground">Something went wrong</h2>
        <p className="text-text-secondary max-w-md text-center">{error}</p>
        <Button onClick={() => window.location.reload()} variant="outline">Try Again</Button>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-text-secondary mt-1">
            {groups.length > 0 ? `${groups.length} active group${groups.length > 1 ? "s" : ""}` : "Welcome — get started below."}
          </p>
        </div>
        <Link href="/groups/new">
          <Button className="flex items-center gap-2 shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            Create Group
          </Button>
        </Link>
      </div>

      {/* Groups Grid */}
      {groups.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="flex flex-col items-center justify-center py-20 text-center border-dashed border-2 bg-transparent shadow-none">
            <span className="text-5xl mb-4">🌴</span>
            <h2 className="text-xl font-bold text-foreground mb-2">No groups yet</h2>
            <p className="text-text-secondary max-w-sm mb-6">Create your first group to start tracking and splitting expenses with friends.</p>
            <Link href="/groups/new">
              <Button>Create Your First Group</Button>
            </Link>
          </Card>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group, i) => (
            <motion.div
              key={group._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06, ease: "easeOut" }}
              whileHover={{ y: -4, transition: { duration: 0.15 } }}
            >
              <Link href={`/groups/${group._id}`} className="block h-full">
                <Card className="h-full flex flex-col justify-between cursor-pointer hover:border-primary/40 transition-colors group">
                  <div>
                    <div className="flex justify-between items-start mb-5">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center text-xl ${modeColor[group.mode] || modeColor.Trip}`}>
                        {modeIcon[group.mode] || "🌴"}
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-md uppercase tracking-wider ${modeColor[group.mode] || modeColor.Trip}`}>
                        {group.mode}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold tracking-tight text-foreground mb-1 group-hover:text-primary transition-colors">
                      {group.name}
                    </h3>
                    <p className="text-sm text-text-secondary">
                      {group.members.length} Member{group.members.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[var(--card-border)] flex justify-between items-center text-sm text-text-secondary">
                    <span>View Ledger</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
