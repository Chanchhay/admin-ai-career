"use client";

import { useRef, useState, type DragEvent } from "react";
import { FileCheck2, Loader2, UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";

type FileDropzoneProps = {
  /** URL of the already-uploaded file, if any. */
  value?: string;
  onChange: (url: string) => void;
  accept?: string;
  hint?: string;
  className?: string;
};

const DEFAULT_ACCEPT = ".pdf,.png,.jpg,.jpeg,.webp,.svg";

export function FileDropzone({
  value,
  onChange,
  accept = DEFAULT_ACCEPT,
  hint = "PDF, PNG, JPG, WebP or SVG up to 5 MB.",
  className,
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File) => {
    setError(null);
    setIsUploading(true);

    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/uploads", { method: "POST", body });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.message ?? "Upload failed.");
      }

      setFileName(payload.name ?? file.name);
      onChange(payload.url);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error ? uploadError.message : "Upload failed.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) void upload(file);
  };

  const clear = () => {
    setFileName(null);
    setError(null);
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className={className}>
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload a file"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-4 py-8 text-center transition-colors",
          isDragging
            ? "border-brand bg-brand-tint"
            : "border-border bg-surface-muted/40 hover:border-brand/40",
        )}
      >
        <span className="flex size-11 items-center justify-center rounded-full bg-surface text-brand shadow-sm">
          {isUploading ? (
            <Loader2 aria-hidden="true" className="size-5 animate-spin" />
          ) : value ? (
            <FileCheck2 aria-hidden="true" className="size-5" />
          ) : (
            <UploadCloud aria-hidden="true" className="size-5" />
          )}
        </span>
        <p className="mt-3 text-sm font-medium text-heading">
          {isUploading
            ? "Uploading…"
            : value
              ? (fileName ?? "File uploaded")
              : "Drag and drop, or click to browse"}
        </p>
        <p className="mt-1 text-xs text-body">{hint}</p>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void upload(file);
          }}
        />
      </div>

      {value ? (
        <div className="mt-2 flex justify-end text-xs">
          <button
            type="button"
            onClick={clear}
            className="inline-flex shrink-0 items-center gap-1 font-medium text-body hover:text-destructive"
          >
            <X aria-hidden="true" className="size-3.5" />
            Remove
          </button>
        </div>
      ) : null}

      {error ? (
        <p role="alert" className="mt-2 text-sm font-medium text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
