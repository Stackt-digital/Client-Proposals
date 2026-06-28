"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function CompleteButton({ actionId }: { actionId: string }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();

  async function handleComplete() {
    setLoading(true);
    await fetch(`/api/portal/action-items/${actionId}/complete`, { method: "POST" });
    setDone(true);
    setLoading(false);
    router.refresh();
  }

  if (done) return <CheckCircle2 size={18} className="text-green-500 shrink-0" />;

  return (
    <button
      onClick={handleComplete}
      disabled={loading}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-500 hover:border-green-300 hover:text-green-600 transition-colors shrink-0"
    >
      {loading ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
      Mark done
    </button>
  );
}
