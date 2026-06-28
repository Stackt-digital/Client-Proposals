"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Client } from "@/lib/types";
import ImageUpload from "./ImageUpload";

interface Props {
  client?: Client;
}

const integrations = [
  { key: "clickup_list_id", label: "ClickUp List/View ID", placeholder: "abc123xyz", hint: "Found in the ClickUp share link: /embed/THIS_PART/l/list" },
  { key: "google_drive_folder_id", label: "Google Drive Folder ID", placeholder: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs", hint: "Found in the Drive folder URL: /folders/THIS_PART" },
  { key: "gomarble_url", label: "GoMarble Report URL", placeholder: "https://app.gomarble.com/reports/...", hint: "Full URL to the client's GoMarble dashboard" },
  { key: "figma_url", label: "Figma File URL", placeholder: "https://www.figma.com/file/...", hint: "Link to the Figma file for creative review" },
  { key: "statusbrew_url", label: "StatusBrew Approval URL", placeholder: "https://app.statusbrew.com/...", hint: "Direct link to the content approval board" },
  { key: "performance_planner_url", label: "Performance Planner URL", placeholder: "https://...", hint: "Link to the performance plan document or embed" },
  { key: "strategy_pdf_url", label: "Strategy PDF URL", placeholder: "https://...", hint: "Public URL to the strategy PDF (Google Drive, Dropbox, etc.)" },
  { key: "xero_invoice_url", label: "Xero Invoice URL", placeholder: "https://invoicing.xero.com/...", hint: "Direct payment link from Xero" },
];

export default function ClientForm({ client }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: client?.name ?? "",
    client_email: client?.client_email ?? "",
    account_lead_email: client?.account_lead_email ?? "",
    about_text: client?.about_text ?? "",
    logo_url: client?.logo_url ?? "",
    hero_image_url: client?.hero_image_url ?? "",
    is_active: client?.is_active ?? true,
    fireflies_enabled: client?.fireflies_enabled ?? false,
    clickup_list_id: client?.clickup_list_id ?? "",
    google_drive_folder_id: client?.google_drive_folder_id ?? "",
    gomarble_url: client?.gomarble_url ?? "",
    figma_url: client?.figma_url ?? "",
    statusbrew_url: client?.statusbrew_url ?? "",
    performance_planner_url: client?.performance_planner_url ?? "",
    strategy_pdf_url: client?.strategy_pdf_url ?? "",
    xero_invoice_url: client?.xero_invoice_url ?? "",
  });

  function field(key: string, value: string | boolean) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const url = client ? `/api/admin/clients/${client.id}` : "/api/admin/clients";
      const res = await fetch(url, {
        method: client ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to save");
      }
      const data = await res.json();
      router.push(client ? `/admin/clients/${client.id}` : `/admin/clients/${data.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <h3 className="text-sm font-semibold text-gray-900">Basic Info</h3>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Client Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => field("name", e.target.value)}
            required
            placeholder="Acme Corp"
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Client Email</label>
          <input
            type="email"
            value={form.client_email}
            onChange={(e) => field("client_email", e.target.value)}
            placeholder="client@example.com"
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400 transition-colors"
          />
          <p className="text-xs text-gray-400 mt-1">Used to send portal link and action item notifications</p>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Account Lead Email</label>
          <input
            type="email"
            value={form.account_lead_email}
            onChange={(e) => field("account_lead_email", e.target.value)}
            placeholder="lead@stackt.co.nz"
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400 transition-colors"
          />
          <p className="text-xs text-gray-400 mt-1">This team member is emailed when the client completes an action item</p>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">About / Welcome text</label>
          <textarea
            value={form.about_text}
            onChange={(e) => field("about_text", e.target.value)}
            rows={3}
            placeholder="A short message that appears on the client's home page..."
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400 transition-colors resize-none"
          />
        </div>

        <ImageUpload
          label="Logo"
          value={form.logo_url}
          onChange={(url) => field("logo_url", url)}
          hint="Appears in the sidebar of the client portal"
          folder="logos"
        />

        <ImageUpload
          label="Hero Banner Image"
          value={form.hero_image_url}
          onChange={(url) => field("hero_image_url", url)}
          hint="Background image for the portal header banner"
          folder="heroes"
        />

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="is_active"
            checked={form.is_active}
            onChange={(e) => field("is_active", e.target.checked)}
            className="w-4 h-4 rounded border-gray-300"
          />
          <label htmlFor="is_active" className="text-sm text-gray-700">Portal is active (visible to client)</label>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="fireflies_enabled"
            checked={form.fireflies_enabled as boolean}
            onChange={(e) => field("fireflies_enabled", e.target.checked)}
            className="w-4 h-4 rounded border-gray-300"
          />
          <label htmlFor="fireflies_enabled" className="text-sm text-gray-700">Show meeting notes (Fireflies)</label>
        </div>
      </div>

      {/* Integrations */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">Integrations</h3>
        <p className="text-xs text-gray-500 -mt-2">Sections only appear in the client portal if you fill them in.</p>

        {integrations.map((intg) => (
          <div key={intg.key}>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">{intg.label}</label>
            <input
              type="text"
              value={(form as Record<string, string | boolean>)[intg.key] as string}
              onChange={(e) => field(intg.key, e.target.value)}
              placeholder={intg.placeholder}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400 transition-colors font-mono"
            />
            <p className="text-xs text-gray-400 mt-1">{intg.hint}</p>
          </div>
        ))}
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 text-white rounded-xl font-semibold text-sm transition-colors disabled:opacity-50"
        style={{ backgroundColor: "#0D2933" }}
      >
        {loading ? "Saving…" : client ? "Save Changes" : "Create Portal"}
      </button>
    </form>
  );
}
