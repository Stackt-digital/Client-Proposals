import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Client, ActionItem } from "@/lib/types";
import ActionCard from "@/components/portal/ActionCard";
import IntegrationTile from "@/components/portal/IntegrationTile";
import { BarChart3, FileText, Palette, FolderOpen, Receipt, TrendingUp, CheckSquare } from "lucide-react";

async function getPortalData(token: string) {
  const { data: client } = await supabase
    .from("clients")
    .select("*")
    .eq("token", token)
    .eq("is_active", true)
    .single();

  if (!client) return null;

  const { data: actions } = await supabase
    .from("action_items")
    .select("*")
    .eq("client_id", client.id)
    .order("created_at", { ascending: false });

  return { client: client as Client, actions: (actions ?? []) as ActionItem[] };
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default async function PortalHomePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const data = await getPortalData(token);

  if (!data) notFound();

  const { client, actions } = data;
  const pending = actions.filter((a) => a.status === "pending");
  const basePath = `/portal/${token}`;

  return (
    <main className="flex-1 overflow-auto">
      {/* Hero banner */}
      <div className="relative h-48 bg-brand-dark overflow-hidden">
        {client.hero_image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={client.hero_image_url}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/80 to-brand-mid/60" />
      </div>

      <div className="px-8 py-6 max-w-4xl">
        {/* Greeting */}
        <div className="-mt-10 mb-6">
          <div className="bg-white rounded-2xl border border-gray-200 px-6 py-5 shadow-sm">
            <h1 className="text-2xl font-semibold text-brand-black">
              {getGreeting()}, {client.name} 👋
            </h1>
            <p className="text-sm text-gray-500 mt-1">Here&apos;s what needs your attention today</p>
          </div>
        </div>

        {/* Pending actions */}
        {pending.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-brand-black">Your actions</h2>
              <span className="text-xs text-gray-500">
                You have <span className="font-semibold text-brand-orange">{pending.length}</span> pending{" "}
                {pending.length === 1 ? "item" : "items"}
              </span>
            </div>
            <div className="space-y-3">
              {pending.map((item) => (
                <ActionCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        )}

        {/* Quick access tiles */}
        <section className="mb-8">
          <h2 className="text-base font-semibold text-brand-black mb-3">Quick access</h2>
          <div className="grid grid-cols-2 gap-3">
            {client.strategy_pdf_url && (
              <IntegrationTile
                label="Strategy"
                description="View your current strategy document"
                href={`${basePath}/strategy`}
                icon={FileText}
              />
            )}
            {client.gomarble_url && (
              <IntegrationTile
                label="Reporting"
                description="Live performance dashboard"
                href={`${basePath}/reporting`}
                icon={BarChart3}
              />
            )}
            {client.figma_url && (
              <IntegrationTile
                label="Creative Review"
                description="Review and approve creative assets"
                href={`${basePath}/creative`}
                icon={Palette}
                count={pending.filter(a => a.type === "creative_review").length}
              />
            )}
            {client.google_drive_folder_id && (
              <IntegrationTile
                label="Files"
                description="Access all shared documents"
                href={`${basePath}/files`}
                icon={FolderOpen}
              />
            )}
            {client.performance_planner_url && (
              <IntegrationTile
                label="Performance Planner"
                description="Review and approve your media plan"
                href={`${basePath}/performance`}
                icon={TrendingUp}
                count={pending.filter(a => a.type === "performance_planner").length}
              />
            )}
            {client.xero_invoice_url && (
              <IntegrationTile
                label="Invoices"
                description="View and pay outstanding invoices"
                href={`${basePath}/invoices`}
                icon={Receipt}
                count={pending.filter(a => a.type === "invoice").length}
                external
              />
            )}
            {client.statusbrew_url && (
              <IntegrationTile
                label="Content Approvals"
                description="Review and approve scheduled content"
                href={client.statusbrew_url}
                icon={CheckSquare}
                count={pending.filter(a => a.type === "content_approval").length}
                external
              />
            )}
          </div>
        </section>

        {/* About */}
        {client.about_text && (
          <section className="mb-8">
            <h2 className="text-base font-semibold text-brand-black mb-3">About us</h2>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-sm text-gray-600 leading-relaxed">{client.about_text}</p>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
export const dynamic = "force-dynamic";
