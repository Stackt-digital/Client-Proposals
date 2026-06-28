"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";

export default function ChatWidget({ token }: { token: string }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open && !sent) textareaRef.current?.focus();
  }, [open, sent]);

  async function handleSend() {
    if (!message.trim()) return;
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/portal/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, message: message.trim(), senderName: name.trim() || undefined }),
      });
      if (!res.ok) throw new Error("Failed to send");
      setSent(true);
    } catch {
      setError("Couldn't send — please try again.");
    } finally {
      setSending(false);
    }
  }

  function handleReset() {
    setSent(false);
    setMessage("");
    setName("");
    setError("");
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat window */}
      {open && (
        <div className="w-80 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 bg-white flex flex-col"
          style={{ maxHeight: "480px" }}>
          {/* Header */}
          <div className="px-5 py-4 flex items-center justify-between" style={{ backgroundColor: "#0D2933" }}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <MessageCircle size={15} className="text-white" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold leading-tight">Stackt Team</p>
                <p className="text-white/50 text-[11px]">We usually reply within a few hours</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/50 hover:text-white transition-colors">
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-auto p-5 flex flex-col gap-4">
            {/* Bot bubble */}
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white text-[10px] font-bold" style={{ backgroundColor: "#0D2933" }}>
                S
              </div>
              <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-gray-800 leading-relaxed max-w-[220px]">
                Hey 👋🏻 Have a question or need a hand? Flick our team a message here.
              </div>
            </div>

            {sent ? (
              <div className="flex flex-col items-center gap-2 py-6 text-center">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-xl">✓</div>
                <p className="text-sm font-medium text-gray-800">Message sent!</p>
                <p className="text-xs text-gray-400">We&apos;ll get back to you soon.</p>
                <button onClick={handleReset} className="text-xs text-gray-400 underline mt-1 hover:text-gray-600">
                  Send another
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 mt-1">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name (optional)"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-gray-400 transition-colors"
                />
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSend(); }}
                  placeholder="Type your message…"
                  rows={4}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-gray-400 transition-colors resize-none"
                />
                {error && <p className="text-xs text-red-500">{error}</p>}
                <button
                  onClick={handleSend}
                  disabled={!message.trim() || sending}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-white text-sm font-medium transition-colors disabled:opacity-50"
                  style={{ backgroundColor: "#0D2933" }}
                >
                  {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                  {sending ? "Sending…" : "Send message"}
                </button>
                <p className="text-[10px] text-gray-400 text-center">⌘ + Enter to send</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Trigger bubble */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative flex items-center gap-2.5 pl-4 pr-5 py-3 rounded-full text-white text-sm font-medium shadow-lg transition-all hover:shadow-xl hover:scale-105 active:scale-95"
        style={{ backgroundColor: "#0D2933" }}
      >
        {open ? <X size={18} /> : <MessageCircle size={18} />}
        {!open && <span>Need a hand?</span>}
        {/* Pulse ring when closed */}
        {!open && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-green-400 border-2 border-white" />
        )}
      </button>
    </div>
  );
}
