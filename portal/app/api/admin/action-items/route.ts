import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendActionItemNotification } from "@/lib/email";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { data, error } = await supabaseAdmin
    .from("action_items")
    .insert(body)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Send notification email to client
  if (data.client_id) {
    const { data: client } = await supabaseAdmin
      .from("clients")
      .select("name, client_email, token")
      .eq("id", data.client_id)
      .single();

    if (client?.client_email && client.token) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
      const portalUrl = `${appUrl}/portal/${client.token}`;
      sendActionItemNotification({
        clientName: client.name,
        clientEmail: client.client_email,
        portalUrl,
        actionTitle: data.title,
      }).catch(console.error);
    }
  }

  return NextResponse.json(data, { status: 201 });
}
