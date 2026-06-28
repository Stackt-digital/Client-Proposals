import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ExternalLink } from "lucide-react";

export default async function StrategyPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const { data: client } = await supabase.from("clients").select("name, strategy_pdf_url").eq("token", token).single();

  if (!client || !client.strategy_pdf_url) notFound();

  return (
    <main className="flex-1 flex flex-col">
      <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-gray-200 bg-white flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl font-semibold text-brand-black">Strategy</h1>
          <p className="text-sm text-gray-500 mt-0.5 hidden sm:block">Your current strategy document from stackt</p>
        </div>
        <a
          href={client.strategy_pdf_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-brand-dark text-white text-xs sm:text-sm font-medium hover:bg-brand-mid transition-colors shrink-0"
        >
          <ExternalLink size={14} />
          Open full view
        </a>
      </div>
      <div className="flex-1 p-3 sm:p-6">
        <iframe
          src={client.strategy_pdf_url}
          className="w-full rounded-xl border border-gray-200 bg-white"
          style={{ height: "75vh", minHeight: "400px" }}
          title="Strategy Document"
        />
      </div>
    </main>
  );
}
export const dynamic = "force-dynamic";
