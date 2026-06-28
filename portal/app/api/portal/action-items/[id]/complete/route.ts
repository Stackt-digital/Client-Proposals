import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendActionCompletedToLead } from "@/lib/email";
import { headers } from "next/headers";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: action, error: actionError } = await supabaseAdmin
    .from("action_items")
    .select("title, client_id, clients(name, token, account_lead_email)")
    .eq("id", id)
    .single();

  if (actionError || !action) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { error } = await supabaseAdmin
    .from("action_items")
    .update({ status: "completed" })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const client = action.clients as { name: string; token: string; account_lead_email?: string } | null;
  if (client?.account_lead_email) {
    const headersList = await headers();
    const host = headersList.get("host") ?? "";
    const proto = host.startsWith("localhost") ? "http" : "https";
    const portalUrl = `${proto}://${host}/portal/${client.token}`;
    sendActionCompletedToLead({
      clientName: client.name,
      accountLeadEmail: client.account_lead_email,
      portalUrl,
      actionTitle: action.title,
    }).catch(console.error);
  }

  return NextResponse.json({ ok: true });
}
