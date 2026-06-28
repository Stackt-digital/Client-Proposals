import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { client_id, title, url, report_date } = body;

  if (!client_id || !title || !url) {
    return NextResponse.json({ error: "client_id, title and url are required" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("client_reports")
    .insert({ client_id, title, url, report_date: report_date || null })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
