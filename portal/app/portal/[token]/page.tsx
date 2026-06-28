import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Client, ActionItem } from "@/lib/types";
import Link from "next/link";
import { ArrowRight, FileText, BarChart3, Palette, FolderOpen, Receipt, TrendingUp, CheckSquare, CalendarDays, PartyPopper } from "lucide-react";
import CompleteButton from "@/components/portal/CompleteButton";
import WelcomeBanner from "@/components/portal/WelcomeBanner";

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

function isOverdue(item: ActionItem) {
  if (!item.due_date || item.status !== "pending") return false;
  return new Date(item.due_date) < new Date(new Date().toDateString());
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
  const completed = actions.filter((a) => a.status === "completed");
  const overdue = pending.filter(isOverdue);
  const basePath = `/portal/${token}`;

  const progressPct = actions.length > 0 ? Math.round((completed.length / actions.length) * 100) : 0;

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
      {/* Top breadcrumb */}
      <div className="px-4 sm:px-8 py-3.5 bg-white border-b border-gray-100">
        <span className="text-sm text-gray-400 font-medium">Home</span>
      </div>

      {/* First-visit welcome banner */}
      <WelcomeBanner token={token} clientName={client.name} />

      <div className="px-4 sm:px-8 py-8 max-w-4xl space-y-5">
        {/* Greeting */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {getGreeting()}, {client.name}
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {pending.length === 0 ? "You're all caught up — nothing needs your attention right now" : "Here's what needs your attention today"}
          </p>
        </div>

        {/* Hero banner */}
        <div
          className="relative w-full h-44 rounded-2xl overflow-hidden"
          style={{ background: "linear-gradient(135deg, #0D2933 0%, #0D3A4A 55%, #1a5a6e 100%)" }}
        >
          {client.hero_image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={client.hero_image_url}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-40"
            />
          )}
          {/* Book a call CTA inside banner when calendar set */}
          {client.calendar_url && (
            <div className="absolute bottom-5 left-6">
              <a
                href={client.calendar_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 backdrop-blur-sm border border-white/25 text-white text-sm font-medium hover:bg-white/25 transition-colors"
              >
                <CalendarDays size={14} />
                Book a call with your team
              </a>
            </div>
          )}
        </div>

        {/* Actions card */}
        {actionCards.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-start justify-between mb-1">
              <h2 className="text-base font-semibold text-gray-900">Your actions</h2>
              {actions.length > 0 && (
                <span className="text-xs text-gray-400 mt-0.5">{completed.length}/{actions.length} completed</span>
              )}
            </div>

            {/* Progress bar */}
            {actions.length > 0 && (
              <div className="w-full h-1.5 bg-gray-100 rounded-full mb-4 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%`, backgroundColor: progressPct === 100 ? "#22c55e" : "#0D2933" }}
                />
              </div>
            )}

            {/* Overdue alert */}
            {overdue.length > 0 && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5 mb-4 text-sm text-red-600">
                <span className="font-medium">{overdue.length} overdue item{overdue.length > 1 ? "s" : ""}</span>
                <span className="text-red-400">— please action as soon as possible</span>
              </div>
            )}

            {pending.length === 0 ? (
              /* All caught up empty state */
              <div className="flex flex-col items-center py-8 text-center">
                <PartyPopper size={32} className="text-gray-300 mb-3" />
                <p className="text-sm font-medium text-gray-700">You&apos;re all caught up!</p>
                <p className="text-xs text-gray-400 mt-1">No pending actions right now. We&apos;ll let you know when something needs your attention.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
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

                {/* Individual pending items */}
                <div className="space-y-2 border-t border-gray-100 pt-4">
                  {pending.map((item) => {
                    const overduItem = isOverdue(item);
                    return (
                      <div key={item.id} className={`flex items-center justify-between gap-3 py-1.5 px-3 rounded-xl ${overduItem ? "bg-red-50" : ""}`}>
                        <div className="min-w-0">
                          <p className={`text-sm font-medium truncate ${overduItem ? "text-red-700" : "text-gray-800"}`}>{item.title}</p>
                          <div className="flex items-center gap-2">
                            {item.description && <p className="text-xs text-gray-400 truncate">{item.description}</p>}
                            {overduItem && <span className="text-[10px] font-semibold text-red-500 uppercase tracking-wide shrink-0">Overdue</span>}
                            {item.due_date && !overduItem && <p className="text-xs text-gray-400 shrink-0">Due {new Date(item.due_date).toLocaleDateString("en-NZ", { day: "numeric", month: "short" })}</p>}
                          </div>
                        </div>
                        <CompleteButton actionId={item.id} />
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* All caught up state when no action cards configured */}
        {actionCards.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm flex flex-col items-center text-center">
            <PartyPopper size={32} className="text-gray-300 mb-3" />
            <p className="text-sm font-medium text-gray-700">Nothing needs your attention right now</p>
            <p className="text-xs text-gray-400 mt-1">Your Stackt team will notify you when there&apos;s something to review.</p>
          </div>
        )}

        {/* Quick links */}
        {quickLinks.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className="group bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between hover:border-gray-200 hover:shadow-sm transition-all shadow-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "#F0FAFF" }}>
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

        {/* Book a call standalone card */}
        {client.calendar_url && (
          <a
            href={client.calendar_url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:border-gray-200 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white" style={{ backgroundColor: "#0D2933" }}>
                <CalendarDays size={18} strokeWidth={1.8} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Book a call</p>
                <p className="text-xs text-gray-400 mt-0.5">Schedule time with your Stackt account lead</p>
              </div>
            </div>
            <ArrowRight size={16} className="text-gray-300 group-hover:text-gray-600 transition-colors" />
          </a>
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
