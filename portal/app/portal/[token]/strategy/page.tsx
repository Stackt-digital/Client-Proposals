import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default async function StrategyPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const { data: client } = await supabase.from("clients").select("name, strategy_pdf_url").eq("token", token).single();

  if (!client || !client.strategy_pdf_url) notFound();

  return (
    <main className="flex-1 flex flex-col">
      <div className="px-8 py-6 border-b border-gray-200 bg-white">
        <h1 className="text-xl font-semibold text-brand-black">Strategy</h1>
        <p className="text-sm text-gray-500 mt-0.5">Your current strategy document from stackt</p>
      </div>
      <div className="flex-1 p-6">
        <iframe
          src={client.strategy_pdf_url}
          className="w-full h-full min-h-[75vh] rounded-xl border border-gray-200 bg-white"
          title="Strategy Document"
        />
      </div>
    </main>
  );
}
export const dynamic = "force-dynamic";
