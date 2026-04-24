"use client";

import { use, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

export default function InvitePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();

  const [groupInfo, setGroupInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch(`/api/invite/${code}`)
      .then(r => r.json().then(d => ({ ok: r.ok, data: d })))
      .then(({ ok, data }) => {
        if (!ok) setError(data.error || "Invalid invite link.");
        else setGroupInfo(data);
      })
      .catch(() => setError("Failed to load invite. Please try again."))
      .finally(() => setLoading(false));
  }, [code]);

  const handleJoin = async () => {
    if (status === "unauthenticated") {
      router.push("/auth");
      return;
    }
    setJoining(true);
    setError("");

    try {
      const res = await fetch(`/api/invite/${code}`, { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to join.");
      } else {
        setSuccess(true);
        setTimeout(() => router.push("/dashboard"), 2000);
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setJoining(false);
    }
  };

  if (loading || status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-text-secondary animate-pulse">Checking invite...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <motion.div
        className="w-full max-w-md space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-primary/10 text-primary mx-auto rounded-2xl flex items-center justify-center text-3xl mb-6">
            🌴
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">You're Invited!</h2>
          <p className="mt-2 text-sm text-text-secondary">Join the group to start splitting expenses together.</p>
        </div>

        <Card className="p-6 sm:p-8 text-center space-y-6">
          <AnimatePresence mode="wait">
            {error ? (
              <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
                  {error}
                </div>
                <Link href="/">
                  <Button variant="outline" className="w-full">Go to Home</Button>
                </Link>
              </motion.div>
            ) : success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4 py-4"
              >
                <div className="w-14 h-14 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-xl font-bold text-foreground">Joined!</h3>
                <p className="text-sm text-text-secondary">Redirecting to your dashboard...</p>
              </motion.div>
            ) : (
              <motion.div key="invite" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                {/* Group Preview */}
                <div className="bg-[var(--background)] border border-[var(--card-border)] rounded-xl p-5 text-left">
                  <h3 className="text-2xl font-bold text-foreground">{groupInfo?.name}</h3>
                  <p className="text-sm text-text-secondary mt-1">Created by {groupInfo?.createdBy}</p>
                  <div className="mt-4 inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-semibold">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {groupInfo?.memberCount} {groupInfo?.memberCount === 1 ? "Member" : "Members"}
                  </div>
                </div>

                {status === "unauthenticated" ? (
                  <div className="space-y-4">
                    <p className="text-sm text-text-secondary">Sign in to accept this invite.</p>
                    <Button onClick={() => router.push("/auth")} className="w-full py-3 text-base">
                      Sign In to Join
                    </Button>
                  </div>
                ) : (
                  <Button onClick={handleJoin} disabled={joining} className="w-full py-3 text-base">
                    {joining ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Joining...
                      </span>
                    ) : "Join Group"}
                  </Button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </div>
  );
}
