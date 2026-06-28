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

interface ActionSummaryCardProps {
  label: string;
  count: number;
  singular: string;
  plural: string;
  href: string;
  icon: React.ElementType;
  external?: boolean;
}

function ActionSummaryCard({ label, count, singular, plural, href, icon: Icon, external }: ActionSummaryCardProps) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group flex-1 min-w-[160px] bg-white rounded-xl border border-gray-200 p-5 flex items-start justify-between hover:border-brand-teal/40 hover:shadow-sm transition-all"
    >
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Icon size={16} className="text-gray-400" strokeWidth={1.8} />
          <span className="text-sm font-medium text-gray-700">{label}</span>
        </div>
        <p className="text-sm text-gray-500">{count} {count === 1 ? singular : plural}</p>
      </div>
      <ArrowRight size={16} className="text-gray-300 group-hover:text-brand-teal transition-colors shrink-0 mt-0.5" />
    </Link>
  );
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

  const actionCards = [
    client.statusbrew_url && { label: "Content", singular: "approval", plural: "approvals", count: contentCount, href: client.statusbrew_url, icon: CheckSquare, external: true },
    client.performance_planner_url && { label: "Performance", singular: "plan", plural: "plans", count: performanceCount, href: `${basePath}/performance`, icon: TrendingUp },
    client.figma_url && { label: "Creative", singular: "review", plural: "reviews", count: creativeCount, href: `${basePath}/creative`, icon: Palette },
    client.xero_invoice_url && { label: "Invoices", singular: "invoice", plural: "invoices", count: invoiceCount, href: `${basePath}/invoices`, icon: Receipt, external: true },
  ].filter(Boolean) as ActionSummaryCardProps[];

  return (
    <main className="flex-1 overflow-auto bg-gray-50">
      {/* Breadcrumb */}
      <div className="px-8 py-4 border-b border-gray-200 bg-white">
        <span className="text-sm text-gray-500">Home</span>
      </div>

      <div className="px-8 py-8 max-w-5xl">
        {/* Greeting */}
        <h1 className="text-3xl font-semibold text-brand-black mb-1">
          {getGreeting()}, {client.name}
        </h1>
        <p className="text-sm text-gray-500 mb-6">Here&apos;s what needs your attention today</p>

        {/* Hero banner */}
        <div className="relative w-full h-52 rounded-2xl overflow-hidden mb-8 bg-brand-dark">
          {client.hero_image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={client.hero_image_url}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-40"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-dark via-brand-mid to-brand-teal/30" />
        </div>

        {/* Actions section */}
        {actionCards.length > 0 && (
          <section className="mb-8">
            <h2 className="text-base font-semibold text-brand-black mb-1">Your actions</h2>
            <p className="text-sm text-gray-500 mb-4">
              You have{" "}
              <span className="font-semibold text-brand-black">{pending.length}</span>{" "}
              pending {pending.length === 1 ? "item" : "items"}
            </p>
            <div className="flex flex-wrap gap-3">
              {actionCards.map((card) => (
                <ActionSummaryCard key={card.label} {...card} />
              ))}
            </div>
          </section>
        )}

        {/* Quick access links */}
        <section className="mb-8">
          <h2 className="text-base font-semibold text-brand-black mb-4">Quick access</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {client.strategy_pdf_url && (
              <Link href={`${basePath}/strategy`} className="group bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3 hover:border-brand-teal/40 hover:shadow-sm transition-all">
                <div className="w-9 h-9 rounded-lg bg-brand-sky flex items-center justify-center shrink-0">
                  <FileText size={16} className="text-brand-dark" strokeWidth={1.8} />
                </div>
                <span className="text-sm font-medium text-brand-black">Strategy</span>
                <ArrowRight size={14} className="text-gray-300 group-hover:text-brand-teal ml-auto transition-colors" />
              </Link>
            )}
            {client.gomarble_url && (
              <Link href={`${basePath}/reporting`} className="group bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3 hover:border-brand-teal/40 hover:shadow-sm transition-all">
                <div className="w-9 h-9 rounded-lg bg-brand-sky flex items-center justify-center shrink-0">
                  <BarChart3 size={16} className="text-brand-dark" strokeWidth={1.8} />
                </div>
                <span className="text-sm font-medium text-brand-black">Reporting</span>
                <ArrowRight size={14} className="text-gray-300 group-hover:text-brand-teal ml-auto transition-colors" />
              </Link>
            )}
            {client.google_drive_folder_id && (
              <Link href={`${basePath}/files`} className="group bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3 hover:border-brand-teal/40 hover:shadow-sm transition-all">
                <div className="w-9 h-9 rounded-lg bg-brand-sky flex items-center justify-center shrink-0">
                  <FolderOpen size={16} className="text-brand-dark" strokeWidth={1.8} />
                </div>
                <span className="text-sm font-medium text-brand-black">Files</span>
                <ArrowRight size={14} className="text-gray-300 group-hover:text-brand-teal ml-auto transition-colors" />
              </Link>
            )}
          </div>
        </section>

        {/* About */}
        {client.about_text && (
          <section className="mb-8">
            <h2 className="text-base font-semibold text-brand-black mb-2">About us</h2>
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
