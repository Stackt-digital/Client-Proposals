import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { Resend } from "resend";

function getResend() {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

export async function POST(req: NextRequest) {
  const { token, message, senderName } = await req.json();
  if (!token || !message) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const { data: client } = await supabaseAdmin
    .from("clients")
    .select("name")
    .eq("token", token)
    .single();

  const clientName = client?.name ?? "A client";
  const from = senderName ? `${senderName} (${clientName})` : clientName;

  const resend = getResend();
  if (!resend) return NextResponse.json({ ok: true });

  await resend.emails.send({
    from: "Stackt Portal <hello@stackt.digital>",
    to: "hello@stackt.digital",
    replyTo: undefined,
    subject: `New message from ${from}`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:40px 24px;color:#121212">
        <h1 style="font-size:18px;font-weight:600;margin:0 0 4px">New portal message</h1>
        <p style="color:#6e6e6e;font-size:13px;margin:0 0 24px">From <strong>${from}</strong> via their client portal</p>
        <div style="background:#f5f7f8;border-radius:8px;padding:16px 20px;font-size:14px;line-height:1.6;color:#121212;white-space:pre-wrap">${message}</div>
      </div>
    `,
  });

  return NextResponse.json({ ok: true });
}
