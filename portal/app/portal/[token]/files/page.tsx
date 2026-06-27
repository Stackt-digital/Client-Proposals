import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ExternalLink, FolderOpen, FileText, File, Image } from "lucide-react";

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
  webViewLink: string;
  size?: string;
}

async function getDriveFiles(folderId: string): Promise<DriveFile[]> {
  const apiKey = process.env.GOOGLE_DRIVE_API_KEY;
  if (!apiKey) return [];

  try {
    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+trashed=false&fields=files(id,name,mimeType,modifiedTime,webViewLink,size)&orderBy=modifiedTime+desc&key=${apiKey}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.files ?? [];
  } catch {
    return [];
  }
}

function fileIcon(mimeType: string) {
  if (mimeType.includes("image")) return Image;
  if (mimeType.includes("pdf") || mimeType.includes("document") || mimeType.includes("spreadsheet") || mimeType.includes("presentation")) return FileText;
  return File;
}

function fileType(mimeType: string): string {
  if (mimeType === "application/vnd.google-apps.document") return "Google Doc";
  if (mimeType === "application/vnd.google-apps.spreadsheet") return "Google Sheet";
  if (mimeType === "application/vnd.google-apps.presentation") return "Google Slides";
  if (mimeType === "application/pdf") return "PDF";
  if (mimeType === "application/vnd.google-apps.folder") return "Folder";
  if (mimeType.includes("image")) return "Image";
  return "File";
}

export default async function FilesPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const { data: client } = await supabase.from("clients").select("name, google_drive_folder_id").eq("token", token).single();

  if (!client || !client.google_drive_folder_id) notFound();

  const files = await getDriveFiles(client.google_drive_folder_id);
  const folderUrl = `https://drive.google.com/drive/folders/${client.google_drive_folder_id}`;

  return (
    <main className="flex-1 flex flex-col">
      <div className="px-8 py-6 border-b border-gray-200 bg-white flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-brand-black">Files</h1>
          <p className="text-sm text-gray-500 mt-0.5">Shared documents and assets from stackt</p>
        </div>
        <a
          href={folderUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-dark text-white text-sm font-medium hover:bg-brand-mid transition-colors"
        >
          <ExternalLink size={14} />
          Open in Drive
        </a>
      </div>

      <div className="flex-1 p-8">
        {files.length === 0 ? (
          <div className="text-center py-16">
            <FolderOpen size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-400">No files yet — check back soon.</p>
          </div>
        ) : (
          <div className="max-w-3xl space-y-2">
            {files.map((file) => {
              const Icon = fileIcon(file.mimeType);
              return (
                <a
                  key={file.id}
                  href={file.webViewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 bg-white rounded-xl border border-gray-200 px-5 py-3.5 hover:border-brand-teal/50 hover:shadow-sm transition-all group"
                >
                  <div className="w-9 h-9 rounded-lg bg-brand-sky flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-brand-dark" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-brand-black truncate group-hover:text-brand-teal transition-colors">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {fileType(file.mimeType)} · Updated{" "}
                      {new Date(file.modifiedTime).toLocaleDateString("en-NZ", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <ExternalLink size={14} className="text-gray-300 group-hover:text-brand-teal transition-colors shrink-0" />
                </a>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
export const dynamic = "force-dynamic";
