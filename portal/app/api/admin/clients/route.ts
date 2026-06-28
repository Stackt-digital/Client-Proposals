import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendPortalWelcome } from "@/lib/email";

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, ...rest } = body;

  if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

  const slug = slugify(name);
  const { data, error } = await supabaseAdmin
    .from("clients")
    .insert({ name, slug, ...rest })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Send welcome email if client email provided
  if (data.client_email && data.token) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
    const portalUrl = `${appUrl}/portal/${data.token}`;
    sendPortalWelcome({ clientName: name, clientEmail: data.client_email, portalUrl }).catch(console.error);
  }

  return NextResponse.json(data, { status: 201 });
}
