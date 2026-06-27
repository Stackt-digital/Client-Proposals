import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ExternalLink, Receipt } from "lucide-react";

export default async function InvoicesPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const { data: client } = await supabase.from("clients").select("name, xero_invoice_url").eq("token", token).single();

  if (!client || !client.xero_invoice_url) notFound();

  return (
    <main className="flex-1 flex flex-col">
      <div className="px-8 py-6 border-b border-gray-200 bg-white">
        <h1 className="text-xl font-semibold text-brand-black">Invoices</h1>
        <p className="text-sm text-gray-500 mt-0.5">View and pay outstanding invoices</p>
      </div>
      <div className="flex-1 p-8">
        <div className="max-w-lg mx-auto text-center py-16">
          <div className="w-16 h-16 bg-brand-sky rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Receipt size={28} className="text-brand-dark" />
          </div>
          <h2 className="text-lg font-semibold text-brand-black mb-2">Pay your invoice</h2>
          <p className="text-sm text-gray-500 mb-6">
            Your invoice is ready. Click below to view and pay securely through Xero.
          </p>
          <a
            href={client.xero_invoice_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-dark text-white text-sm font-semibold hover:bg-brand-mid transition-colors"
          >
            <ExternalLink size={16} />
            View Invoice in Xero
          </a>
        </div>
      </div>
    </main>
  );
}
export const dynamic = "force-dynamic";
