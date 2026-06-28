import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendPendingActionsNotification } from "@/lib/email";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
  const { clientId } = await req.json();
  if (!clientId) return NextResponse.json({ error: "clientId required" }, { status: 400 });

  const { data: client } = await supabaseAdmin
    .from("clients")
    .select("name, token, client_email")
    .eq("id", clientId)
    .single();

  if (!client?.client_email) {
    return NextResponse.json({ error: "Client has no email address" }, { status: 400 });
  }

  const { data: actions } = await supabaseAdmin
    .from("action_items")
    .select("title, description")
    .eq("client_id", clientId)
    .eq("status", "pending");

  if (!actions || actions.length === 0) {
    return NextResponse.json({ error: "No pending actions to notify about" }, { status: 400 });
  }

  const headersList = await headers();
  const host = headersList.get("host") ?? "";
  const proto = host.startsWith("localhost") ? "http" : "https";
  const portalUrl = `${proto}://${host}/portal/${client.token}`;

  await sendPendingActionsNotification({
    clientName: client.name,
    clientEmail: client.client_email,
    portalUrl,
    pendingItems: actions,
  });

  return NextResponse.json({ ok: true, sent: actions.length });
}
