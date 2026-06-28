import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ExternalLink, FileText, Calendar } from "lucide-react";

interface ClientReport {
  id: string;
  title: string;
  url: string;
  report_date: string | null;
  created_at: string;
}

export default async function ReportingPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const { data: client } = await supabase
    .from("clients")
    .select("id, name, gomarble_url")
    .eq("token", token)
    .eq("is_active", true)
    .single();

  if (!client) notFound();

  const { data: reports } = await supabase
    .from("client_reports")
    .select("*")
    .eq("client_id", client.id)
    .order("report_date", { ascending: false });

  const historicReports = (reports ?? []) as ClientReport[];

  if (!client.gomarble_url && historicReports.length === 0) notFound();

  return (
    <main className="flex-1 overflow-auto bg-gray-50">
      <div className="px-8 py-3.5 bg-white border-b border-gray-100">
        <span className="text-sm text-gray-400 font-medium">Reporting</span>
      </div>

      <div className="px-8 py-8 max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Reporting</h1>
          <p className="text-sm text-gray-400 mt-0.5">Live performance data and historical reports</p>
        </div>

        {/* Live GoMarble dashboard */}
        {client.gomarble_url && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 flex items-center justify-between border-b border-gray-100">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Live Dashboard</h2>
                <p className="text-sm text-gray-400 mt-0.5">Powered by GoMarble</p>
              </div>
              <a
                href={client.gomarble_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors"
                style={{ backgroundColor: "#0D2933" }}
              >
                <ExternalLink size={14} />
                Open dashboard
              </a>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-500 mb-4">
                GoMarble reports open in their own tab for the best experience. Click the button above to view your live performance data.
              </p>
              <a
                href={client.gomarble_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all bg-gray-50 group"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "#F0FAFF" }}>
                  <ExternalLink size={16} className="text-brand-dark" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">View performance report</p>
                  <p className="text-xs text-gray-400 truncate">{client.gomarble_url}</p>
                </div>
                <ExternalLink size={14} className="text-gray-300 group-hover:text-gray-500 transition-colors shrink-0" />
              </a>
            </div>
          </div>
        )}

        {/* Historic reports */}
        {historicReports.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">Historic Reports</h2>
              <p className="text-sm text-gray-400 mt-0.5">Previous performance reports and documents</p>
            </div>
            <div className="divide-y divide-gray-100">
              {historicReports.map((report) => (
                <a
                  key={report.id}
                  href={report.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "#F0FAFF" }}>
                    <FileText size={15} className="text-brand-dark" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">{report.title}</p>
                    {report.report_date && (
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <Calendar size={11} />
                        {new Date(report.report_date).toLocaleDateString("en-NZ", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    )}
                  </div>
                  <ExternalLink size={14} className="text-gray-300 group-hover:text-gray-500 transition-colors shrink-0" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export const dynamic = "force-dynamic";
