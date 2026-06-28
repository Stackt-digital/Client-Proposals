"use client";

import { useEffect } from "react";

export default function VisitLogger({ clientId }: { clientId: string }) {
  useEffect(() => {
    fetch("/api/portal/log-visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId }),
    }).catch(() => {});
  }, [clientId]);

  return null;
}
