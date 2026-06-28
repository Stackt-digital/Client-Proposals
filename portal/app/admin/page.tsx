import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Client } from "@/lib/types";
import { Plus, ExternalLink, Users, Settings } from "lucide-react";
import CopyLinkButton from "@/components/admin/CopyLinkButton";

async function getClients(): Promise<Client[]> {
  const { data } = await supabase.from("clients").select("*").order("created_at", { ascending: false });
  return (data ?? []) as Client[];
}

export default async function AdminPage() {
  const clients = await getClients();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#0D2933" }}>
            <span className="text-white text-xs font-bold">S</span>
          </div>
          <div>
            <p className="text-gray-900 font-semibold text-sm uppercase tracking-wide">stackt</p>
            <p className="text-gray-400 text-xs">Admin Dashboard</p>
          </div>
        </div>
        <Link
          href="/admin/clients/new"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors"
          style={{ backgroundColor: "#0D2933" }}
        >
          <Plus size={15} />
          New Client Portal
        </Link>
      </header>

      <div className="px-8 py-8 max-w-5xl mx-auto">
        {/* Stats row */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {[
            { label: "Total Clients", value: clients.length, icon: Users },
            { label: "Active Portals", value: clients.filter(c => c.is_active).length, icon: ExternalLink },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <stat.icon size={18} className="text-gray-300 mb-2" />
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Client list */}
        <div>
          <h2 className="text-base font-semibold text-gray-900 mb-4">Client Portals</h2>

          {clients.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-12 text-center shadow-sm">
              <Users size={36} className="text-gray-200 mx-auto mb-3" />
              <p className="text-sm text-gray-400 mb-4">No client portals yet.</p>
              <Link
                href="/admin/clients/new"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium"
                style={{ backgroundColor: "#0D2933" }}
              >
                <Plus size={14} />
                Create your first portal
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {clients.map((client) => {
                const portalPath = `/portal/${client.token}`;
                return (
                  <div key={client.id} className="bg-white rounded-xl border border-gray-100 p-5 flex items-center justify-between gap-4 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "#F0FAFF" }}>
                        <span className="text-gray-700 text-sm font-bold">{client.name.slice(0, 2).toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{client.name}</p>
                        <p className="text-xs text-gray-400 font-mono mt-0.5">/portal/{client.token.slice(0, 8)}…</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${client.is_active ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                        {client.is_active ? "Active" : "Inactive"}
                      </span>
                      <CopyLinkButton token={client.token} />
                      <Link
                        href={portalPath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 hover:border-gray-400 transition-colors"
                      >
                        <ExternalLink size={12} />
                        Preview
                      </Link>
                      <Link
                        href={`/admin/clients/${client.id}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-xs font-medium transition-colors"
                        style={{ backgroundColor: "#0D2933" }}
                      >
                        <Settings size={12} />
                        Edit
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export const dynamic = "force-dynamic";
