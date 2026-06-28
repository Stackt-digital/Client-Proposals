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
    <aside className="w-52 shrink-0 flex flex-col min-h-screen border-r border-gray-200" style={{ backgroundColor: "#EAFCFF" }}>
      {/* Logo */}
      <div className="px-5 pt-6 pb-5">
        {client.logo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={client.logo_url} alt="Stackt" className="h-7 w-auto object-contain" />
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-brand-dark flex items-center justify-center shrink-0">
              <span className="text-white text-[11px] font-bold tracking-tight">S</span>
            </div>
            <span className="text-sm font-semibold text-brand-dark tracking-wide">stackt</span>
          </div>
        )}
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
                  ? "bg-white text-brand-dark font-semibold shadow-sm"
                  : "text-gray-600 hover:bg-white/60 hover:text-brand-dark font-medium"
              )}
            >
              <Icon size={15} strokeWidth={1.8} className="shrink-0" />
              <span className="flex-1">{item.label}</span>
              {badgeCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-brand-dark text-white text-[10px] font-bold px-1">
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
