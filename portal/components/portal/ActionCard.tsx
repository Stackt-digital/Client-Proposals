import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { ActionItem } from "@/lib/types";
import { actionLabel, cn, formatDate } from "@/lib/utils";

const typeColors: Record<string, string> = {
  invoice: "bg-brand-orange/10 text-brand-orange border-brand-orange/20",
  content_approval: "bg-brand-teal/10 text-brand-teal border-brand-teal/20",
  performance_planner: "bg-purple-50 text-purple-600 border-purple-200",
  creative_review: "bg-indigo-50 text-indigo-600 border-indigo-200",
  reporting: "bg-green-50 text-green-600 border-green-200",
};

export default function ActionCard({ item }: { item: ActionItem }) {
  const isCompleted = item.status === "completed";

  return (
    <div className={cn(
      "bg-white rounded-xl border p-4 flex items-start justify-between gap-4 transition-shadow hover:shadow-sm",
      isCompleted ? "border-gray-200 opacity-60" : "border-gray-200"
    )}>
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div className={cn("mt-0.5 w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 text-xs font-semibold", typeColors[item.type] ?? "bg-gray-50 text-gray-500 border-gray-200")}>
          {actionLabel(item.type).slice(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className={cn("text-sm font-semibold text-brand-black", isCompleted && "line-through text-gray-400")}>
            {item.title}
          </p>
          {item.description && (
            <p className="text-xs text-gray-500 mt-0.5 truncate">{item.description}</p>
          )}
          <div className="flex items-center gap-3 mt-1.5">
            <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full border", typeColors[item.type] ?? "bg-gray-100 text-gray-500 border-gray-200")}>
              {actionLabel(item.type)}
            </span>
            {item.due_date && (
              <span className="text-[10px] text-gray-400">Due {formatDate(item.due_date)}</span>
            )}
          </div>
        </div>
      </div>

      {isCompleted ? (
        <CheckCircle2 size={18} className="text-green-500 shrink-0 mt-1" />
      ) : item.url ? (
        <Link
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 mt-1 flex items-center gap-1 text-xs font-medium text-brand-teal hover:text-brand-dark transition-colors"
        >
          View <ArrowRight size={14} />
        </Link>
      ) : null}
    </div>
  );
}
