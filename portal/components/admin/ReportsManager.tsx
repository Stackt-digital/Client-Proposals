"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ClientReport } from "@/lib/types";
import { Plus, Trash2, FileText, Calendar } from "lucide-react";

export default function ReportsManager({ clientId, reports }: { clientId: string; reports: ClientReport[] }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: "", url: "", report_date: "" });

  async function addReport() {
    if (!form.title || !form.url) return;
    setSaving(true);
    try {
      await fetch("/api/admin/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, client_id: clientId }),
      });
      setForm({ title: "", url: "", report_date: "" });
      setAdding(false);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  async function deleteReport(id: string) {
    await fetch(`/api/admin/reports/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="space-y-3">
      {reports.map((report) => (
        <div key={report.id} className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex items-center gap-3">
          <FileText size={16} className="text-gray-300 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">{report.title}</p>
            {report.report_date && (
              <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                <Calendar size={11} />
                {new Date(report.report_date).toLocaleDateString("en-NZ", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            )}
          </div>
          <button onClick={() => deleteReport(report.id)} className="shrink-0 text-gray-300 hover:text-red-400 transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      ))}

      {adding ? (
        <div className="bg-white rounded-xl border border-brand-teal/30 p-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Report Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Q2 2025 Performance Report"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-brand-teal"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Google Drive / PDF URL *</label>
            <input
              type="url"
              value={form.url}
              onChange={(e) => setForm(f => ({ ...f, url: e.target.value }))}
              placeholder="https://drive.google.com/file/d/..."
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-brand-teal font-mono"
            />
            <p className="text-xs text-gray-400 mt-1">Use a shareable Google Drive link or any public PDF URL</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Report Date (optional)</label>
            <input
              type="date"
              value={form.report_date}
              onChange={(e) => setForm(f => ({ ...f, report_date: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-brand-teal"
            />
          </div>
          <div className="flex gap-2 pt-1">
            <button
              onClick={addReport}
              disabled={!form.title || !form.url || saving}
              className="px-4 py-2 rounded-lg bg-brand-dark text-white text-sm font-medium hover:bg-brand-mid transition-colors disabled:opacity-50"
            >
              {saving ? "Adding…" : "Add Report"}
            </button>
            <button
              onClick={() => setAdding(false)}
              className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-gray-300 text-sm text-gray-400 hover:border-brand-teal hover:text-brand-teal transition-colors"
        >
          <Plus size={15} />
          Add historic report
        </button>
      )}
    </div>
  );
}
