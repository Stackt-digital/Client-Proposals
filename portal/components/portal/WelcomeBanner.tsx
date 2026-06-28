"use client";

import { useState, useEffect } from "react";
import { X, Sparkles } from "lucide-react";

export default function WelcomeBanner({ token, clientName }: { token: string; clientName: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const key = `portal_welcomed_${token}`;
    if (!localStorage.getItem(key)) {
      setVisible(true);
    }
  }, [token]);

  function dismiss() {
    localStorage.setItem(`portal_welcomed_${token}`, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="mx-8 mt-6 rounded-2xl border border-blue-100 bg-gradient-to-r from-[#EAF7FF] to-[#F0FAFF] px-5 py-4 flex items-start gap-3 shadow-sm">
      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: "#0D2933" }}>
        <Sparkles size={14} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900">Welcome to your portal, {clientName} 👋</p>
        <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">
          This is your hub for everything Stackt — check your action items, review work, access reports, and message our team any time.
        </p>
      </div>
      <button onClick={dismiss} className="text-gray-400 hover:text-gray-600 transition-colors shrink-0 mt-0.5">
        <X size={16} />
      </button>
    </div>
  );
}
