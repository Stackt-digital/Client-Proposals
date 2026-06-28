import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default async function TasksPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const { data: client } = await supabase
    .from("clients")
    .select("name, clickup_list_id")
    .eq("token", token)
    .single();

  if (!client || !client.clickup_list_id) notFound();

  const embedUrl = `https://sharing.clickup.com/embed/${client.clickup_list_id}/l/list`;

  return (
    <main className="flex-1 flex flex-col">
      <div className="px-8 py-3.5 bg-white border-b border-gray-100">
        <span className="text-sm text-gray-400 font-medium">Tasks</span>
      </div>
      <div className="px-8 py-6 flex-1 flex flex-col">
        <div className="mb-5">
          <h1 className="text-2xl font-semibold text-gray-900">Tasks</h1>
          <p className="text-sm text-gray-400 mt-0.5">Work in progress and planned work for your account</p>
        </div>
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[75vh]">
          <iframe
            src={embedUrl}
            className="w-full h-full min-h-[75vh]"
            title="Tasks"
            allowFullScreen
          />
        </div>
      </div>
    </main>
  );
}
export const dynamic = "force-dynamic";
