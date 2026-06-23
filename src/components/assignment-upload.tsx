"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileText, CheckCircle, Loader2, X, AlertCircle, Award } from "lucide-react";
import { cn } from "@/lib/utils";

export function AssignmentUpload({ lessonId, enrollmentId, courseSlug, lessonTitle, isSubmitted }: {
  lessonId: string;
  enrollmentId: string;
  courseSlug: string;
  lessonTitle: string;
  isSubmitted: boolean;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(isSubmitted);
  const [submittedFile, setSubmittedFile] = useState<string | null>(null);

  async function handleSubmit() {
    if (!file) return;
    setUploading(true);
    setError("");

    const fd = new FormData();
    fd.set("file", file);
    fd.set("lessonId", lessonId);
    fd.set("enrollmentId", enrollmentId);

    try {
      const res = await fetch("/api/assignments/upload", { method: "POST", body: fd });
      const d = await res.json();
      if (d.error) { setError(d.error); return; }
      setSubmitted(true);
      setSubmittedFile(d.url);
      router.refresh();
    } catch {
      setError("Upload failed. Please try again.");
    }
    setUploading(false);
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-8 text-center">
        <Award className="mx-auto mb-3 size-10 text-green-400" />
        <h3 className="font-heading font-bold text-off-white">Assignment Submitted</h3>
        <p className="mt-2 text-sm text-muted-foreground">{lessonTitle}</p>
        {submittedFile && (
          <a href={submittedFile} target="_blank" rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-xs text-gold underline underline-offset-2">
            View submitted file
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/5 bg-surface p-6">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
          <FileText className="size-5 text-amber-400" />
        </div>
        <div className="flex-1">
          <h3 className="font-heading font-bold text-off-white">Assignment Submission</h3>
          <p className="mt-1 text-xs text-muted-foreground">Upload your completed assignment file (PDF, DOC, DOCX, or images). Max 10MB.</p>
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-2">
          <AlertCircle className="size-4 shrink-0 text-red-400" />
          <p className="text-xs text-red-400">{error}</p>
        </div>
      )}

      {!file ? (
        <button onClick={() => inputRef.current?.click()}
          className="mt-4 flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-white/10 px-6 py-8 text-sm text-muted-foreground transition-all hover:border-gold/40 hover:text-gold">
          <Upload className="size-6" />
          <span>Click to select file</span>
          <span className="text-[10px]">PDF, DOC, DOCX, JPG, PNG (max 10MB)</span>
        </button>
      ) : (
        <div className="mt-4 rounded-lg border border-white/10 bg-industrial-black p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <FileText className="size-5 text-gold" />
              <div>
                <p className="text-xs font-medium text-off-white">{file.name}</p>
                <p className="text-[10px] text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <button onClick={() => setFile(null)} className="rounded-full p-1 text-muted-foreground hover:bg-white/5 hover:text-off-white">
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      <input ref={inputRef} type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) { setFile(f); setError(""); } }} />

      <div className="mt-4 flex justify-end">
        <button onClick={handleSubmit} disabled={!file || uploading}
          className={cn("flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-bold transition-all",
            !file ? "cursor-not-allowed bg-white/5 text-muted-foreground"
            : "bg-gold text-industrial-black hover:bg-gold-light"
          )}>
          {uploading && <Loader2 className="size-4 animate-spin" />}
          {uploading ? "Uploading..." : <><Upload size={14} /> Submit Assignment</>}
        </button>
      </div>
    </div>
  );
}
