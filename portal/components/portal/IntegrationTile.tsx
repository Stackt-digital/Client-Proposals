import Link from "next/link";
import { ArrowRight, LucideIcon } from "lucide-react";

interface IntegrationTileProps {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  count?: number;
  external?: boolean;
}

export default function IntegrationTile({ label, description, href, icon: Icon, count, external }: IntegrationTileProps) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group bg-white rounded-xl border border-gray-200 p-5 flex items-start justify-between gap-3 hover:border-brand-teal/50 hover:shadow-sm transition-all"
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-brand-sky flex items-center justify-center shrink-0">
          <Icon size={18} className="text-brand-dark" strokeWidth={1.8} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-brand-black">{label}</p>
            {count !== undefined && count > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand-orange text-white text-[10px] font-bold">
                {count}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        </div>
      </div>
      <ArrowRight size={16} className="text-gray-300 group-hover:text-brand-teal transition-colors shrink-0 mt-1" />
    </Link>
  );
}
