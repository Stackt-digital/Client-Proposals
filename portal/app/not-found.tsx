import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{ backgroundColor: "#F0FAFF" }}>
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm" style={{ backgroundColor: "#0D2933" }}>
        <span className="text-white text-xl font-bold">S</span>
      </div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Page not found</h1>
      <p className="text-gray-500 text-sm max-w-sm mb-8 leading-relaxed">
        This link may have expired or the portal is no longer active. If you think this is a mistake, reach out to your Stackt account lead.
      </p>
      <a
        href="mailto:hello@stackt.digital"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-medium transition-opacity hover:opacity-90"
        style={{ backgroundColor: "#0D2933" }}
      >
        Contact Stackt
      </a>
      <p className="text-[11px] text-gray-400 mt-10">
        Powered by <span className="font-semibold">stackt</span>
      </p>
    </div>
  );
}
