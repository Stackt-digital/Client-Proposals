"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";

interface Props {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
  bucket?: string;
  folder?: string;
}

export default function ImageUpload({ label, value, onChange, hint, bucket = "portal-assets", folder = "uploads" }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucket", bucket);
      formData.append("folder", folder);

      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1.5">{label}</label>

      {value ? (
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="w-16 h-16 rounded-lg object-cover border border-gray-200" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 truncate">{value}</p>
            <button
              type="button"
              onClick={() => onChange("")}
              className="mt-1 flex items-center gap-1 text-xs text-red-400 hover:text-red-600 transition-colors"
            >
              <X size={11} /> Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full flex flex-col items-center justify-center gap-2 py-6 rounded-lg border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors text-gray-400 hover:text-gray-500 disabled:opacity-50"
        >
          {uploading
            ? <Loader2 size={20} className="animate-spin" />
            : <Upload size={20} />
          }
          <span className="text-xs">{uploading ? "Uploading…" : "Click to upload image"}</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}
