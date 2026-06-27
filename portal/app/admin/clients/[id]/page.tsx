import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Client } from "@/lib/types";
import ClientForm from "@/components/admin/ClientForm";
import ActionItemManager from "@/components/admin/ActionItemManager";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";

export default async function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: client } = await supabase.from("clients").select("*").eq("id", id).single();
  if (!client) notFound();

  const { data: actions } = await supabase
    .from("action_items")
    .select("*")
    .eq("client_id", id)
    .order("created_at", { ascending: false });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const portalUrl = `${baseUrl}/portal/${client.token}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-brand-dark px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-brand-sky/60 hover:text-brand-sky transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-white font-semibold text-sm">{(client as Client).name}</h1>
        </div>
        <a
          href={portalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-brand-teal/30 text-brand-sky text-xs hover:border-brand-teal transition-colors"
        >
          <ExternalLink size={12} />
          View client portal
        </a>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10 space-y-10">
        {/* Portal link box */}
        <div className="bg-brand-sky/30 border border-brand-sky rounded-xl px-5 py-4">
          <p className="text-xs font-semibold text-brand-dark uppercase tracking-wider mb-1">Client portal link</p>
          <p className="text-sm font-mono text-brand-dark break-all">{portalUrl}</p>
          <p className="text-xs text-brand-dark/50 mt-1">Share this link directly with your client — no login required.</p>
        </div>

        {/* Client settings */}
        <div>
          <h2 className="text-base font-semibold text-brand-black mb-4">Portal Settings</h2>
          <ClientForm client={client as Client} />
        </div>

        {/* Action items */}
        <div>
          <h2 className="text-base font-semibold text-brand-black mb-4">Action Items</h2>
          <ActionItemManager clientId={id} actions={(actions ?? []) as import("@/lib/types").ActionItem[]} />
        </div>
      </div>
    </div>
  );
}
export const dynamic = "force-dynamic";
