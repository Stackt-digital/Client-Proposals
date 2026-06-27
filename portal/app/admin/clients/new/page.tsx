import ClientForm from "@/components/admin/ClientForm";

export default function NewClientPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-brand-black">Create Client Portal</h1>
          <p className="text-sm text-gray-500 mt-1">Set up a new portal for your client. You can always edit these settings later.</p>
        </div>
        <ClientForm />
      </div>
    </div>
  );
}
export const dynamic = "force-dynamic";
