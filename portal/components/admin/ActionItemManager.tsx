"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ActionItem, ActionType } from "@/lib/types";
import { actionLabel } from "@/lib/utils";
import { Plus, Trash2, CheckCircle2, Circle } from "lucide-react";

const ACTION_TYPES: ActionType[] = [
  "content_approval",
  "performance_planner",
  "invoice",
  "creative_review",
  "reporting",
];

export default function ActionItemManager({ clientId, actions }: { clientId: string; actions: ActionItem[] }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    type: "content_approval" as ActionType,
    title: "",
    description: "",
    url: "",
    due_date: "",
  });

  async function addItem() {
    if (!form.title) return;
    setSaving(true);
    try {
      await fetch("/api/admin/action-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, client_id: clientId }),
      });
      setForm({ type: "content_approval", title: "", description: "", url: "", due_date: "" });
      setAdding(false);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(item: ActionItem) {
    await fetch(`/api/admin/action-items/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: item.status === "pending" ? "completed" : "pending" }),
    });
    router.refresh();
  }

  async function deleteItem(id: string) {
    await fetch(`/api/admin/action-items/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="space-y-3">
      {/* Existing items */}
      {actions.map((item) => (
        <div key={item.id} className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex items-center gap-3">
          <button onClick={() => toggleStatus(item)} className="shrink-0 text-gray-300 hover:text-brand-teal transition-colors">
            {item.status === "completed"
              ? <CheckCircle2 size={18} className="text-green-500" />
              : <Circle size={18} />}
          </button>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium ${item.status === "completed" ? "text-gray-400 line-through" : "text-brand-black"}`}>
              {item.title}
            </p>
            <p className="text-xs text-gray-400">{actionLabel(item.type)}{item.due_date ? ` · Due ${item.due_date}` : ""}</p>
          </div>
          <button onClick={() => deleteItem(item.id)} className="shrink-0 text-gray-300 hover:text-red-400 transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      ))}

      {/* Add form */}
      {adding ? (
        <div className="bg-white rounded-xl border border-brand-teal/30 p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm(f => ({ ...f, type: e.target.value as ActionType }))}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-brand-teal"
              >
                {ACTION_TYPES.map((t) => (
                  <option key={t} value={t}>{actionLabel(t)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Due Date</label>
              <input
                type="date"
                value={form.due_date}
                onChange={(e) => setForm(f => ({ ...f, due_date: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-brand-teal"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Review June content calendar"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-brand-teal"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">URL (optional)</label>
            <input
              type="url"
              value={form.url}
              onChange={(e) => setForm(f => ({ ...f, url: e.target.value }))}
              placeholder="https://..."
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-brand-teal font-mono"
            />
          </div>
          <div className="flex gap-2 pt-1">
            <button
              onClick={addItem}
              disabled={!form.title || saving}
              className="px-4 py-2 rounded-lg bg-brand-dark text-white text-sm font-medium hover:bg-brand-mid transition-colors disabled:opacity-50"
            >
              {saving ? "Adding…" : "Add Item"}
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
          Add action item
        </button>
      )}
    </div>
  );
}
