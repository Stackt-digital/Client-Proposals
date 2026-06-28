import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const listId = req.nextUrl.searchParams.get("listId");
  const apiKey = process.env.CLICKUP_API_KEY;

  if (!listId) return NextResponse.json({ error: "missing listId param" });
  if (!apiKey) return NextResponse.json({ error: "CLICKUP_API_KEY not set in environment" });

  const url = `https://api.clickup.com/api/v2/list/${listId}/task?order_by=due_date&reverse=true&include_closed=true`;

  try {
    const res = await fetch(url, { headers: { Authorization: apiKey } });
    const json = await res.json();
    return NextResponse.json({
      status: res.status,
      url,
      apiKeyPrefix: apiKey.slice(0, 8) + "...",
      response: json,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) });
  }
}
