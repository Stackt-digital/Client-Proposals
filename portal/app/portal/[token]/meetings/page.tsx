import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Client } from "@/lib/types";
import { Video, Calendar, ExternalLink, AlertCircle } from "lucide-react";

interface ClickUpTask {
  id: string;
  name: string;
  description: string;
  date_created: string;
  due_date: string | null;
  url: string;
}

function extractFirefliesUrl(text: string): string | null {
  const match = text?.match(/https?:\/\/[^\s]*fireflies\.ai[^\s]*/i);
  return match ? match[0] : null;
}

async function getMeetingTasks(listId: string): Promise<{ tasks: ClickUpTask[]; error: boolean }> {
  const apiKey = process.env.CLICKUP_API_KEY;
  if (!apiKey) return { tasks: [], error: false };

  try {
    const res = await fetch(
      `https://api.clickup.com/api/v2/list/${listId}/task?order_by=due_date&reverse=true&include_closed=true`,
      {
        headers: { Authorization: apiKey },
        next: { revalidate: 300 },
      }
    );
    if (!res.ok) return { tasks: [], error: true };
    const json = await res.json();
    return { tasks: (json.tasks ?? []) as ClickUpTask[], error: false };
  } catch {
    return { tasks: [], error: true };
  }
}

function formatDate(ts: string | null) {
  if (!ts) return null;
  return new Date(Number(ts)).toLocaleDateString("en-NZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function MeetingsPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const { data: client } = await supabase
    .from("clients")
    .select("*")
    .eq("token", token)
    .eq("is_active", true)
    .single();

  if (!client || !(client as Client).clickup_meetings_list_id) notFound();

  const listId = (client as Client).clickup_meetings_list_id!;
  const { tasks, error } = await getMeetingTasks(listId);
  const apiKeyMissing = !process.env.CLICKUP_API_KEY;

  return (
    <main className="flex-1 overflow-auto bg-gray-50">
      <div className="px-4 sm:px-8 py-3.5 bg-white border-b border-gray-100">
        <span className="text-sm text-gray-400 font-medium">Meeting Notes</span>
      </div>

      <div className="px-4 sm:px-8 py-8 max-w-4xl space-y-5">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Meeting Notes</h1>
          <p className="text-sm text-gray-400 mt-0.5">Recordings and notes from your sessions with Stackt</p>
        </div>

        {apiKeyMissing && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4">
            <p className="text-sm font-medium text-amber-800">ClickUp not connected</p>
            <p className="text-xs text-amber-600 mt-0.5">Add a <code>CLICKUP_API_KEY</code> environment variable in Vercel to enable meeting notes.</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl px-5 py-4 flex items-start gap-3">
            <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-700">Couldn&apos;t load meetings</p>
              <p className="text-xs text-red-500 mt-0.5">There was a problem connecting to ClickUp. Please try refreshing the page.</p>
            </div>
          </div>
        )}

        {!apiKeyMissing && !error && tasks.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
            <Video size={36} className="text-gray-200 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No meetings yet</p>
            <p className="text-xs text-gray-400 mt-1">Meeting notes will appear here once your Stackt team adds them.</p>
          </div>
        )}

        {tasks.map((task) => {
          const firefliesUrl = extractFirefliesUrl(task.description ?? "");
          const dateStr = formatDate(task.due_date ?? task.date_created);

          return (
            <div key={task.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base font-semibold text-gray-900">{task.name}</h2>
                    {dateStr && (
                      <p className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
                        <Calendar size={12} />
                        {dateStr}
                      </p>
                    )}
                  </div>

                  {firefliesUrl && (
                    <a
                      href={firefliesUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-xs font-medium shrink-0 hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: "#0D2933" }}
                    >
                      <Video size={12} />
                      <span className="hidden sm:inline">View recording</span>
                      <span className="sm:hidden">Watch</span>
                    </a>
                  )}
                </div>

                {task.description && !firefliesUrl && (
                  <p className="text-sm text-gray-500 mt-3 leading-relaxed">{task.description}</p>
                )}

                {task.description && firefliesUrl && task.description.replace(firefliesUrl, "").trim() && (
                  <p className="text-sm text-gray-500 mt-3 leading-relaxed">
                    {task.description.replace(firefliesUrl, "").trim()}
                  </p>
                )}

                <div className="mt-4 flex items-center gap-3 pt-3 border-t border-gray-100">
                  <a
                    href={task.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <ExternalLink size={11} />
                    View in ClickUp
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

export const dynamic = "force-dynamic";
