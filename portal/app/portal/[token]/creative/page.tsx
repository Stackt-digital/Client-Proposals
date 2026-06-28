import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ExternalLink } from "lucide-react";

export default async function CreativePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const { data: client } = await supabase.from("clients").select("name, figma_url").eq("token", token).single();

  if (!client || !client.figma_url) notFound();

  const embedUrl = client.figma_url.includes("figma.com")
    ? `https://www.figma.com/embed?embed_host=stackt&url=${encodeURIComponent(client.figma_url)}`
    : client.figma_url;

  return (
    <main className="flex-1 flex flex-col">
      <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-gray-200 bg-white flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl font-semibold text-brand-black">Creative Review</h1>
          <p className="text-sm text-gray-500 mt-0.5 hidden sm:block">Review and comment on creative assets in Figma</p>
        </div>
        <a
          href={client.figma_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-brand-dark text-white text-xs sm:text-sm font-medium hover:bg-brand-mid transition-colors shrink-0"
        >
          <ExternalLink size={14} />
          Open in Figma
        </a>
      </div>
      <div className="flex-1 p-3 sm:p-6">
        <iframe
          src={embedUrl}
          className="w-full rounded-xl border border-gray-200 bg-white"
          style={{ height: "75vh", minHeight: "400px" }}
          title="Creative Review"
          allowFullScreen
        />
      </div>
    </main>
  );
}
export const dynamic = "force-dynamic";
