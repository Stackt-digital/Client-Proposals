"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
  Video,
  Menu,
  X,
  CalendarDays,
} from "lucide-react";
import { Client, ActionItem } from "@/lib/types";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  iconAnim: string;
  enabled?: (c: Client) => boolean;
  badgeKey?: ActionItem["type"];
  external?: boolean;
  externalHref?: (c: Client) => string;
}

const navItems: NavItem[] = [
  { label: "Home",        href: "",             icon: Home,        iconAnim: "icon-bounce" },
  { label: "Tasks",       href: "/tasks",       icon: ListTodo,    iconAnim: "icon-slide-right", enabled: (c) => !!c.clickup_list_id },
  { label: "Content",     href: "",             icon: CheckSquare, iconAnim: "icon-pop",         enabled: (c) => !!c.statusbrew_url, badgeKey: "content_approval", external: true, externalHref: (c) => c.statusbrew_url! },
  { label: "Performance", href: "/performance", icon: TrendingUp,  iconAnim: "icon-slide-up",    enabled: (c) => !!c.performance_planner_url, badgeKey: "performance_planner" },
  { label: "Creative",    href: "/creative",    icon: Palette,     iconAnim: "icon-spin",        enabled: (c) => !!c.figma_url, badgeKey: "creative_review" },
  { label: "Strategy",    href: "/strategy",    icon: FileText,    iconAnim: "icon-slide-up",    enabled: (c) => !!c.strategy_pdf_url },
  { label: "Reporting",   href: "/reporting",   icon: BarChart3,   iconAnim: "icon-grow",        enabled: (c) => !!(c.gomarble_url) },
  { label: "Files",       href: "/files",       icon: FolderOpen,  iconAnim: "icon-pop",         enabled: (c) => !!c.google_drive_folder_id },
  { label: "Invoices",    href: "/invoices",    icon: Receipt,     iconAnim: "icon-print",       enabled: (c) => !!c.xero_invoice_url, badgeKey: "invoice" },
  { label: "Meetings",    href: "/meetings",    icon: Video,       iconAnim: "icon-pulse",       enabled: (c) => !!c.clickup_meetings_list_id },
];

function SidebarContent({
  client,
  basePath,
  pendingCounts,
  onClose,
}: {
  client: Client;
  basePath: string;
  pendingCounts?: Partial<Record<ActionItem["type"], number>>;
  onClose?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: "#F0FAFF" }}>
      {/* Logo */}
      <div className="px-5 pt-6 pb-5 flex items-center justify-between">
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
        {onClose && (
          <button onClick={onClose} className="text-black/40 hover:text-black transition-colors md:hidden">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 pb-4 space-y-0.5 overflow-y-auto">
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
              onClick={onClose}
              className={cn(
                "group flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-white text-black font-semibold shadow-sm"
                  : "text-black/70 hover:bg-white/70 hover:text-black font-medium"
              )}
            >
              <Icon
                size={15}
                strokeWidth={1.8}
                className={cn("shrink-0 text-black/50 icon-anim", item.iconAnim)}
              />
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

      {/* Book a call */}
      {client.calendar_url && (
        <div className="px-3 pb-3">
          <a
            href={client.calendar_url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-md"
            style={{ backgroundColor: "#0D2933" }}
          >
            <CalendarDays size={15} strokeWidth={1.8} className="shrink-0 icon-anim icon-bounce" />
            <span>Book a call</span>
          </a>
        </div>
      )}

      {/* Footer */}
      <div className="px-5 py-4 border-t border-black/5">
        <p className="text-[10px] text-gray-400">
          Powered by <span className="font-semibold text-gray-500">stackt</span>
        </p>
      </div>
    </div>
  );
}

export default function PortalSidebar({
  client,
  basePath,
  pendingCounts,
}: {
  client: Client;
  basePath: string;
  pendingCounts?: Partial<Record<ActionItem["type"], number>>;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div
        className="md:hidden fixed top-0 inset-x-0 z-30 h-14 border-b border-gray-100 flex items-center px-4 gap-3"
        style={{ backgroundColor: "#F0FAFF" }}
      >
        <button
          onClick={() => setMobileOpen(true)}
          className="text-black/60 hover:text-black transition-colors"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center border border-gray-100">
            {client.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={client.logo_url} alt="Stackt" className="w-4 h-4 object-contain" />
            ) : (
              <span className="text-[9px] font-bold text-gray-900">S</span>
            )}
          </div>
          <span className="text-sm font-semibold text-black tracking-wide uppercase">stackt</span>
          <span className="text-sm text-gray-400">· {client.name}</span>
        </div>
      </div>

      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile slide-in sidebar */}
      <aside
        className={cn(
          "md:hidden fixed inset-y-0 left-0 z-50 w-64 shadow-xl transition-transform duration-200",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent
          client={client}
          basePath={basePath}
          pendingCounts={pendingCounts}
          onClose={() => setMobileOpen(false)}
        />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col w-52 shrink-0 min-h-screen border-r border-gray-100">
        <SidebarContent client={client} basePath={basePath} pendingCounts={pendingCounts} />
      </aside>
    </>
  );
}
