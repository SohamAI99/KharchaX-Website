"use client";

import { use, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

export default function InvitePage({ params }: { params: Promise<{ code: string }> }) {
  const unwrappedParams = use(params);
  const code = unwrappedParams.code;
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [groupInfo, setGroupInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchGroupDetails() {
      try {
        const res = await fetch(`/api/invite/${code}`);
        const data = await res.json();
        
        if (!res.ok) {
          setError(data.error || "Failed to load invite.");
        } else {
          setGroupInfo(data);
        }
      } catch (err) {
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchGroupDetails();
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
        setError(data.error || "Failed to join group.");
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      }
    } catch (err) {
      setError("An unexpected error occurred while joining.");
    } finally {
      setJoining(false);
    }
  };

  if (loading || status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4 text-text-secondary animate-in fade-in">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="font-medium animate-pulse">Checking invite...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-500">
      <div className="w-full max-w-md space-y-8">
        
        <div className="text-center">
          <div className="w-16 h-16 bg-primary/10 text-primary mx-auto rounded-full flex items-center justify-center text-3xl mb-6 shadow-sm">
            🌴
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            You're Invited!
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            Join the group to split expenses effortlessly.
          </p>
        </div>

        <Card className="p-8 text-center flex flex-col items-center">
          {error ? (
            <div className="space-y-4">
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
                {error}
              </div>
              <Link href="/">
                <Button variant="outline" className="w-full mt-4">Go Home</Button>
              </Link>
            </div>
          ) : success ? (
            <div className="space-y-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-foreground">Joined Successfully!</h3>
              <p className="text-sm text-text-secondary">Redirecting you to the dashboard...</p>
            </div>
          ) : (
            <div className="space-y-6 w-full">
              <div className="bg-[var(--background)] border border-[var(--card-border)] rounded-lg p-6">
                <h3 className="text-2xl font-bold text-foreground">{groupInfo?.name}</h3>
                <p className="text-sm text-text-secondary mt-1">Created by {groupInfo?.createdBy}</p>
                <div className="mt-4 inline-flex items-center gap-2 bg-secondary/10 text-secondary px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                  {groupInfo?.memberCount} Members
                </div>
              </div>

              {status === "unauthenticated" ? (
                <div className="space-y-4">
                  <p className="text-sm text-text-secondary">You need to sign in to join this group.</p>
                  <Button onClick={() => router.push("/auth")} className="w-full">Sign In to Join</Button>
                </div>
              ) : (
                <Button onClick={handleJoin} disabled={joining} className="w-full text-base py-6">
                  {joining ? "Joining..." : "Join Group"}
                </Button>
              )}
            </div>
          )}
        </Card>
        
      </div>
    </div>
  );
}
