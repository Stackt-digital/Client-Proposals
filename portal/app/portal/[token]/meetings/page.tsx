import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Client } from "@/lib/types";
import { Video, Calendar, Clock, ChevronDown } from "lucide-react";

interface FirefliesTranscript {
  id: string;
  title: string;
  date: number;
  duration: number;
  participants: string[];
  summary?: {
    overview?: string;
    action_items?: string;
    keywords?: string[];
  };
}

async function getFirefliesTranscripts(clientEmail: string): Promise<FirefliesTranscript[]> {
  const apiKey = process.env.FIREFLIES_API_KEY;
  if (!apiKey) return [];

  const query = `
    query {
      transcripts(participant_email: "${clientEmail}") {
        id
        title
        date
        duration
        participants
        summary {
          overview
          action_items
          keywords
        }
      }
    }
  `;

  try {
    const res = await fetch("https://api.fireflies.ai/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ query }),
      next: { revalidate: 300 },
    });

    if (!res.ok) return [];
    const json = await res.json();
    return (json?.data?.transcripts ?? []) as FirefliesTranscript[];
  } catch {
    return [];
  }
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-NZ", { day: "numeric", month: "long", year: "numeric" });
}

function formatDuration(seconds: number) {
  const m = Math.round(seconds / 60);
  if (m < 60) return `${m}m`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}

export default async function MeetingsPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const { data: client } = await supabase
    .from("clients")
    .select("*")
    .eq("token", token)
    .eq("is_active", true)
    .single();

  if (!client || !(client as Client).fireflies_enabled) notFound();

  const clientEmail = (client as Client).client_email ?? "";
  const transcripts = clientEmail ? await getFirefliesTranscripts(clientEmail) : [];
  const apiKeyMissing = !process.env.FIREFLIES_API_KEY;

  return (
    <main className="flex-1 overflow-auto bg-gray-50">
      <div className="px-8 py-3.5 bg-white border-b border-gray-100">
        <span className="text-sm text-gray-400 font-medium">Meeting Notes</span>
      </div>

      <div className="px-8 py-8 max-w-4xl space-y-5">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Meeting Notes</h1>
          <p className="text-sm text-gray-400 mt-0.5">Recordings and summaries from your sessions with Stackt</p>
        </div>

        {apiKeyMissing && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4">
            <p className="text-sm font-medium text-amber-800">Fireflies not connected</p>
            <p className="text-xs text-amber-600 mt-0.5">Add a FIREFLIES_API_KEY environment variable to enable meeting notes.</p>
          </div>
        )}

        {!apiKeyMissing && !clientEmail && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4">
            <p className="text-sm font-medium text-amber-800">No client email set</p>
            <p className="text-xs text-amber-600 mt-0.5">Add a client email address in the admin panel to filter meetings by participant.</p>
          </div>
        )}

        {transcripts.length === 0 && !apiKeyMissing && clientEmail && (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
            <Video size={36} className="text-gray-200 mx-auto mb-3" />
            <p className="text-sm text-gray-400">No meetings found yet.</p>
            <p className="text-xs text-gray-300 mt-1">Meetings will appear here after they&apos;re recorded and processed by Fireflies.</p>
          </div>
        )}

        {transcripts.map((t) => (
          <div key={t.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">{t.title || "Untitled meeting"}</h2>
                  <div className="flex items-center gap-4 mt-1.5">
                    <span className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Calendar size={12} />
                      {formatDate(t.date)}
                    </span>
                    {t.duration > 0 && (
                      <span className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Clock size={12} />
                        {formatDuration(t.duration)}
                      </span>
                    )}
                  </div>
                </div>
                <ChevronDown size={16} className="text-gray-300 shrink-0 mt-1" />
              </div>

              {t.summary?.overview && (
                <div className="mt-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Summary</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{t.summary.overview}</p>
                </div>
              )}

              {t.summary?.action_items && (
                <div className="mt-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Action Items</p>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{t.summary.action_items}</p>
                </div>
              )}

              {t.summary?.keywords && t.summary.keywords.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {t.summary.keywords.slice(0, 8).map((kw) => (
                    <span key={kw} className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{kw}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export const dynamic = "force-dynamic";
