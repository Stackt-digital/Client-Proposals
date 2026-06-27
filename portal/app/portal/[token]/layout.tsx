import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import PortalSidebar from "@/components/portal/PortalSidebar";
import { Client } from "@/lib/types";

async function getClient(token: string): Promise<Client | null> {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("token", token)
    .eq("is_active", true)
    .single();

  if (error || !data) return null;
  return data as Client;
}

export default async function PortalLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const client = await getClient(token);

  if (!client) notFound();

  const basePath = `/portal/${token}`;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <PortalSidebar client={client} basePath={basePath} />
      <div className="flex-1 flex flex-col min-w-0">
        {children}
      </div>
    </div>
  );
}
