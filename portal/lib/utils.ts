import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ActionType } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function actionLabel(type: ActionType): string {
  const labels: Record<ActionType, string> = {
    content_approval: "Content Approval",
    performance_planner: "Performance Planner",
    invoice: "Invoice",
    creative_review: "Creative Review",
    reporting: "Report Ready",
  };
  return labels[type];
}

export function actionIcon(type: ActionType): string {
  const icons: Record<ActionType, string> = {
    content_approval: "📋",
    performance_planner: "📈",
    invoice: "💳",
    creative_review: "🎨",
    reporting: "📊",
  };
  return icons[type];
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-NZ", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
