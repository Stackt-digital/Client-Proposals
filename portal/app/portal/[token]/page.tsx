import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Client, ActionItem } from "@/lib/types";
import Link from "next/link";
import { ArrowRight, FileText, BarChart3, Palette, FolderOpen, Receipt, TrendingUp, CheckSquare } from "lucide-react";

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

  const contentCount = pending.filter((a) => a.type === "content_approval").length;
  const creativeCount = pending.filter((a) => a.type === "creative_review").length;
  const performanceCount = pending.filter((a) => a.type === "performance_planner").length;
  const invoiceCount = pending.filter((a) => a.type === "invoice").length;

  type ActionCard = {
    label: string;
    singular: string;
    plural: string;
    count: number;
    href: string;
    icon: React.ElementType;
    external?: boolean;
  };

  const actionCards: ActionCard[] = [
    client.statusbrew_url ? { label: "Content", singular: "approval", plural: "approvals", count: contentCount, href: client.statusbrew_url, icon: CheckSquare, external: true } : null,
    client.performance_planner_url ? { label: "Performance", singular: "plan", plural: "plans", count: performanceCount, href: `${basePath}/performance`, icon: TrendingUp } : null,
    client.figma_url ? { label: "Creative", singular: "review", plural: "reviews", count: creativeCount, href: `${basePath}/creative`, icon: Palette } : null,
    client.xero_invoice_url ? { label: "Invoices", singular: "invoice", plural: "invoices", count: invoiceCount, href: `${basePath}/invoices`, icon: Receipt, external: true } : null,
  ].filter(Boolean) as ActionCard[];

  const quickLinks = [
    client.strategy_pdf_url ? { label: "Strategy", href: `${basePath}/strategy`, icon: FileText } : null,
    client.gomarble_url ? { label: "Reporting", href: `${basePath}/reporting`, icon: BarChart3 } : null,
    client.google_drive_folder_id ? { label: "Files", href: `${basePath}/files`, icon: FolderOpen } : null,
  ].filter(Boolean) as { label: string; href: string; icon: React.ElementType }[];

  return (
    <main className="flex-1 overflow-auto bg-gray-50">
      {/* Top bar */}
      <div className="px-8 py-3.5 bg-white border-b border-gray-100">
        <span className="text-sm text-gray-400 font-medium">Home</span>
      </div>

      <div className="px-8 py-8 max-w-4xl">
        {/* Greeting */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-0.5">
          {getGreeting()}, {client.name}
        </h1>
        <p className="text-sm text-gray-400 mb-6">Here&apos;s what needs your attention today</p>

        {/* Hero banner */}
        <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-6 bg-gray-900">
          {client.hero_image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={client.hero_image_url}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-50"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-brand-teal/20" />
        </div>

        {/* Actions card */}
        {actionCards.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900 mb-0.5">Your actions</h2>
            <p className="text-sm text-gray-400 mb-5">
              You have <span className="text-gray-700 font-medium">{pending.length}</span> pending {pending.length === 1 ? "item" : "items"}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {actionCards.map((card) => {
                const Icon = card.icon;
                return (
                  <Link
                    key={card.label}
                    href={card.href}
                    target={card.external ? "_blank" : undefined}
                    rel={card.external ? "noopener noreferrer" : undefined}
                    className="group flex items-start justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all bg-gray-50"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <Icon size={13} className="text-gray-400" strokeWidth={2} />
                        <span className="text-sm font-medium text-gray-700">{card.label}</span>
                      </div>
                      <p className="text-sm text-gray-400">
                        {card.count} {card.count === 1 ? card.singular : card.plural}
                      </p>
                    </div>
                    <ArrowRight size={14} className="text-gray-300 group-hover:text-gray-500 transition-colors mt-0.5 shrink-0" />
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick links */}
        {quickLinks.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-4">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className="group bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between hover:border-gray-200 hover:shadow-sm transition-all shadow-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "#EAFCFF" }}>
                      <Icon size={15} className="text-brand-dark" strokeWidth={1.8} />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{link.label}</span>
                  </div>
                  <ArrowRight size={14} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                </Link>
              );
            })}
          </div>
        )}

        {/* About */}
        {client.about_text && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900 mb-2">About us</h2>
            <p className="text-sm text-gray-500 leading-relaxed">{client.about_text}</p>
          </div>
        )}
      </div>
    </main>
  );
}
export const dynamic = "force-dynamic";
