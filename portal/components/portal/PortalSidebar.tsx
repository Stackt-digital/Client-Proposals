"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  FileText,
  BarChart3,
  Palette,
  FolderOpen,
  Receipt,
  TrendingUp,
  CheckSquare,
  ListTodo,
} from "lucide-react";
import { Client, ActionItem } from "@/lib/types";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  enabled?: (c: Client) => boolean;
  badgeKey?: ActionItem["type"];
  external?: boolean;
  externalHref?: (c: Client) => string;
}

const navItems: NavItem[] = [
  { label: "Home", href: "", icon: Home },
  { label: "Tasks", href: "/tasks", icon: ListTodo, enabled: (c) => !!c.clickup_list_id },
  { label: "Content", href: "", icon: CheckSquare, enabled: (c) => !!c.statusbrew_url, badgeKey: "content_approval", external: true, externalHref: (c) => c.statusbrew_url! },
  { label: "Performance", href: "/performance", icon: TrendingUp, enabled: (c) => !!c.performance_planner_url, badgeKey: "performance_planner" },
  { label: "Creative", href: "/creative", icon: Palette, enabled: (c) => !!c.figma_url, badgeKey: "creative_review" },
  { label: "Strategy", href: "/strategy", icon: FileText, enabled: (c) => !!c.strategy_pdf_url },
  { label: "Reporting", href: "/reporting", icon: BarChart3, enabled: (c) => !!c.gomarble_url },
  { label: "Files", href: "/files", icon: FolderOpen, enabled: (c) => !!c.google_drive_folder_id },
  { label: "Invoices", href: "/invoices", icon: Receipt, enabled: (c) => !!c.xero_invoice_url, badgeKey: "invoice" },
];

export default function PortalSidebar({
  client,
  basePath,
  pendingCounts,
}: {
  client: Client;
  basePath: string;
  pendingCounts?: Partial<Record<ActionItem["type"], number>>;
}) {
  const pathname = usePathname();

  return (
    <aside
      className="w-52 shrink-0 flex flex-col min-h-screen border-r border-gray-100"
      style={{ backgroundColor: "#F0FAFF" }}
    >
      {/* Logo */}
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 border border-gray-100">
            {client.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={client.logo_url} alt="Stackt" className="w-6 h-6 object-contain" />
            ) : (
              <span className="text-[11px] font-bold text-gray-900">S</span>
            )}
          </div>
          <div>
            <span className="text-sm font-semibold text-black tracking-wide uppercase">stackt</span>
            <p className="text-[11px] text-gray-400 leading-tight">{client.name}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 pb-4 space-y-0.5">
        {navItems.map((item) => {
          if (item.enabled && !item.enabled(client)) return null;

          const href = item.external && item.externalHref
            ? item.externalHref(client)
            : `${basePath}${item.href}`;

          const isActive = !item.external && (
            pathname === `${basePath}${item.href}` ||
            (item.href === "" && pathname === basePath)
          );
          const Icon = item.icon;
          const badgeCount = item.badgeKey ? (pendingCounts?.[item.badgeKey] ?? 0) : 0;

          return (
            <Link
              key={item.label}
              href={href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-white text-black font-semibold shadow-sm"
                  : "text-black/70 hover:bg-white/70 hover:text-black font-medium"
              )}
            >
              <Icon size={15} strokeWidth={1.8} className="shrink-0 text-black/50" />
              <span className="flex-1">{item.label}</span>
              {badgeCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-black text-white text-[10px] font-bold px-1">
                  {badgeCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-black/5">
        <p className="text-[10px] text-gray-400">
          Powered by <span className="font-semibold text-gray-500">stackt</span>
        </p>
      </div>
    </aside>
  );
}
