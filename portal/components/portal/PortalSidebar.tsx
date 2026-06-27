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
} from "lucide-react";
import { Client } from "@/lib/types";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  enabled?: (c: Client) => boolean;
}

const navItems: NavItem[] = [
  { label: "Home", href: "", icon: Home },
  { label: "Strategy", href: "/strategy", icon: FileText, enabled: (c) => !!c.strategy_pdf_url },
  { label: "Reporting", href: "/reporting", icon: BarChart3, enabled: (c) => !!c.gomarble_url },
  { label: "Creative Review", href: "/creative", icon: Palette, enabled: (c) => !!c.figma_url },
  { label: "Files", href: "/files", icon: FolderOpen, enabled: (c) => !!c.google_drive_folder_id },
  { label: "Performance", href: "/performance", icon: TrendingUp, enabled: (c) => !!c.performance_planner_url },
  { label: "Invoices", href: "/invoices", icon: Receipt, enabled: (c) => !!c.xero_invoice_url },
];

export default function PortalSidebar({ client, basePath }: { client: Client; basePath: string }) {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 bg-brand-sky flex flex-col min-h-screen">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-brand-teal/20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-brand-dark rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold font-mono">S</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-brand-dark uppercase tracking-widest">stackt</p>
            <p className="text-[10px] text-brand-dark/60 truncate max-w-[100px]">{client.name}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-0.5">
        {navItems.map((item) => {
          if (item.enabled && !item.enabled(client)) return null;
          const href = `${basePath}${item.href}`;
          const isActive = pathname === href || (item.href === "" && pathname === basePath);
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-brand-dark text-white"
                  : "text-brand-dark/70 hover:bg-brand-dark/10 hover:text-brand-dark"
              )}
            >
              <Icon size={16} strokeWidth={1.8} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-brand-teal/20">
        <p className="text-[10px] text-brand-dark/40 px-3">
          Powered by{" "}
          <span className="font-semibold text-brand-dark/60">stackt</span>
        </p>
      </div>
    </aside>
  );
}
