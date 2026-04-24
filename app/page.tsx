"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Smart Splitting",
    desc: "Debt-minimization algorithm calculates the fewest transactions to settle all balances fairly.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: "Shareable Invites",
    desc: "One link, anyone can join. Friends sign up and are instantly added to your group ledger.",
    color: "text-secondary",
    bg: "bg-secondary/10",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "AI Budget Planner",
    desc: "Enter your budget and let AI generate an optimized category breakdown and money-saving tips.",
    color: "text-[#0984E3]",
    bg: "bg-[#0984E3]/10",
  },
];

const steps = [
  { step: "01", title: "Create a Group", desc: "Set up a Trip, Party, or Flatmate group in seconds." },
  { step: "02", title: "Invite Friends", desc: "Share a link. Anyone can join — no friction, no setup." },
  { step: "03", title: "Log Expenses", desc: "Add who paid and split equally or by amount." },
  { step: "04", title: "Settle Up", desc: "The AI calculates the minimum transactions to zero out all debts." },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.08, ease: "easeOut" as const },
  }),
};

export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") router.push("/dashboard");
  }, [status, router]);

  if (status === "loading" || status === "authenticated") {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-28 pb-24">

      {/* ── Hero ── */}
      <section className="flex flex-col items-center text-center space-y-8 pt-16 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-semibold uppercase tracking-widest"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          AI-Powered Expense Splitting
        </motion.div>

        <motion.h1
          className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.05]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        >
          Split smart.{" "}
          <span className="text-primary">No drama.</span>
        </motion.h1>

        <motion.p
          className="text-xl text-text-secondary max-w-2xl leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        >
          KharchaX is the AI-powered group expense manager for trips, parties, and flatmates.
          Stop fighting over calculators — start living.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 pt-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
        >
          <Link href="/auth">
            <Button size="lg" className="px-10 py-4 text-base rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow">
              Get Started — It's Free
            </Button>
          </Link>
        </motion.div>

        {/* Social Proof */}
        <motion.p
          className="text-xs text-text-secondary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          No credit card required · Secure email + password auth
        </motion.p>
      </section>

      {/* ── Features ── */}
      <section id="features" className="space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Everything you need, nothing you don't</h2>
          <p className="text-text-secondary max-w-xl mx-auto">Built to handle real-world group finances without spreadsheets or messy group chats.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              custom={i}
              variants={fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-[var(--card-bg)] p-8 rounded-2xl border border-[var(--card-border)] cursor-default"
            >
              <div className={`w-12 h-12 ${f.bg} ${f.color} rounded-xl flex items-center justify-center mb-6`}>
                {f.icon}
              </div>
              <h3 className="text-lg font-bold mb-2 text-foreground">{f.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── How it Works ── */}
      <section className="space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">How it works</h2>
          <p className="text-text-secondary">Up and running in under 60 seconds.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              custom={i}
              variants={fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="relative bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 space-y-3"
            >
              <span className="text-4xl font-black text-primary/20 leading-none">{s.step}</span>
              <h3 className="text-base font-bold text-foreground">{s.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-12 text-center space-y-6">
        <h2 className="text-3xl font-bold text-foreground">Ready to stop the drama?</h2>
        <p className="text-text-secondary text-lg max-w-md mx-auto">Create your first group in 30 seconds. Your friends will thank you.</p>
        <Link href="/auth">
          <Button size="lg" className="px-10 py-4 text-base rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow">
            Start Splitting for Free
          </Button>
        </Link>
      </section>
    </div>
  );
}
