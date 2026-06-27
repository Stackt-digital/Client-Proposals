import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ExternalLink } from "lucide-react";

export default async function CreativePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const { data: client } = await supabase.from("clients").select("name, figma_url").eq("token", token).single();

  if (!client || !client.figma_url) notFound();

  // Convert Figma URL to embed URL
  const embedUrl = client.figma_url.includes("figma.com")
    ? `https://www.figma.com/embed?embed_host=stackt&url=${encodeURIComponent(client.figma_url)}`
    : client.figma_url;

  return (
    <main className="flex-1 flex flex-col">
      <div className="px-8 py-6 border-b border-gray-200 bg-white flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-brand-black">Creative Review</h1>
          <p className="text-sm text-gray-500 mt-0.5">Review and comment on creative assets in Figma</p>
        </div>
        <a
          href={client.figma_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-dark text-white text-sm font-medium hover:bg-brand-mid transition-colors"
        >
          <ExternalLink size={14} />
          Open in Figma
        </a>
      </div>
      <div className="flex-1 p-6">
        <iframe
          src={embedUrl}
          className="w-full h-full min-h-[75vh] rounded-xl border border-gray-200 bg-white"
          title="Creative Review"
          allowFullScreen
        />
      </div>
    </main>
  );
}
export const dynamic = "force-dynamic";
