import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import PortalSidebar from "@/components/portal/PortalSidebar";
import ChatWidget from "@/components/portal/ChatWidget";
import { Client, ActionItem } from "@/lib/types";

async function getClientData(token: string) {
  const { data: client, error } = await supabase
    .from("clients")
    .select("*")
    .eq("token", token)
    .eq("is_active", true)
    .single();

  if (error || !client) return null;

  const { data: actions } = await supabase
    .from("action_items")
    .select("type, status")
    .eq("client_id", client.id)
    .eq("status", "pending");

  const pendingCounts: Partial<Record<ActionItem["type"], number>> = {};
  for (const a of actions ?? []) {
    pendingCounts[a.type as ActionItem["type"]] = (pendingCounts[a.type as ActionItem["type"]] ?? 0) + 1;
  }

  return { client: client as Client, pendingCounts };
}

export default async function PortalLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const data = await getClientData(token);

  if (!data) notFound();

  const { client, pendingCounts } = data;
  const basePath = `/portal/${token}`;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <PortalSidebar client={client} basePath={basePath} pendingCounts={pendingCounts} />
      <div className="flex-1 flex flex-col min-w-0">
        {children}
      </div>
      <ChatWidget token={token} />
    </div>
  );
}
export const dynamic = "force-dynamic";
