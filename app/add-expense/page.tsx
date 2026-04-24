"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

// This page is deprecated. Add expenses via /groups/[id]/add-expense
export default function AddExpenseLegacy() {
  const router = useRouter();
  useEffect(() => { router.replace("/dashboard"); }, [router]);
  return null;
}
