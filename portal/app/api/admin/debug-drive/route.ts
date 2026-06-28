import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const folderId = req.nextUrl.searchParams.get("folderId");
  const apiKey = process.env.GOOGLE_DRIVE_API_KEY;

  if (!folderId) return NextResponse.json({ error: "missing folderId param" });
  if (!apiKey) return NextResponse.json({ error: "GOOGLE_DRIVE_API_KEY not set in environment" });

  const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+trashed=false&fields=files(id,name,mimeType)&key=${apiKey}`;

  try {
    const res = await fetch(url);
    const json = await res.json();
    return NextResponse.json({ status: res.status, apiKeyPrefix: apiKey.slice(0, 8) + "...", response: json });
  } catch (err) {
    return NextResponse.json({ error: String(err) });
  }
}
