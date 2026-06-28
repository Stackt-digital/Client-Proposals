import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const bucket = (formData.get("bucket") as string) ?? "portal-assets";
    const folder = (formData.get("folder") as string) ?? "uploads";

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const ext = file.name.split(".").pop();
    const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const bytes = await file.arrayBuffer();

    const { error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(filename, bytes, { contentType: file.type, upsert: false });

    if (error) throw error;

    const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(filename);
    return NextResponse.json({ url: data.publicUrl });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
