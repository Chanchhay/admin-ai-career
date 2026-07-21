"use client";

import Image from "next/image";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type DragEvent,
  type KeyboardEvent,
} from "react";
import { FileUp, X } from "lucide-react";
import {
  ACCEPTED_LOGO_EXTENSIONS,
  ACCEPTED_LOGO_TYPES,
  MAX_LOGO_SIZE_BYTES,
  MAX_LOGO_SIZE_MB,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

type FileDropzoneProps = {
  value: File | null;
  onChange: (file: File | null) => void;
  error?: string;
};

function formatSize(bytes: number) {
  return `${(bytes / 1024).toFixed(0)} KB`;
}

export function FileDropzone({ value, onChange, error }: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const previewUrl = useMemo(
    () => (value ? URL.createObjectURL(value) : null),
    [value],
  );

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const accept = (file: File | undefined) => {
    if (!file) return;
    if (!(ACCEPTED_LOGO_TYPES as readonly string[]).includes(file.type)) {
      setLocalError(`Only ${ACCEPTED_LOGO_EXTENSIONS} files are allowed.`);
      onChange(null);
      return;
    }
    if (file.size > MAX_LOGO_SIZE_BYTES) {
      setLocalError(`Logo must be ${MAX_LOGO_SIZE_MB}MB or smaller.`);
      onChange(null);
      return;
    }
    setLocalError(null);
    onChange(file);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    accept(event.dataTransfer.files[0]);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      inputRef.current?.click();
    }
  };

  const clear = () => {
    setLocalError(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const visibleError = error ?? localError;

  return (
    <div className="space-y-2">
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload company logo"
        onClick={() => inputRef.current?.click()}
        onKeyDown={handleKeyDown}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 px-4 py-10 text-center transition-all duration-200",
          "hover:border-brand/50 hover:bg-slate-50/70",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2",
          isDragging && "border-brand bg-brand-tint",
          visibleError && "border-red-300 bg-red-50/50",
        )}
      >
        {value && previewUrl ? (
          <div className="flex w-full items-center gap-3 px-2">
            <span className="relative size-12 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white">
              <Image
                src={previewUrl}
                alt={`${value.name} preview`}
                fill
                unoptimized
                className="object-contain p-1"
              />
            </span>
            <span className="min-w-0 flex-1 text-left">
              <span className="block truncate text-sm font-semibold text-heading">
                {value.name}
              </span>
              <span className="block text-xs text-slate-500">
                {formatSize(value.size)}
              </span>
            </span>
            <button
              type="button"
              aria-label="Remove logo"
              onClick={(event) => {
                event.stopPropagation();
                clear();
              }}
              className="flex size-7 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors duration-200 hover:bg-slate-100 hover:text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <>
            <span className="mb-3 flex size-11 items-center justify-center rounded-full bg-brand-tint">
              <FileUp aria-hidden="true" className="size-5 text-brand" />
            </span>
            <p className="text-sm font-semibold text-heading">
              Click to upload or drag and drop
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {ACCEPTED_LOGO_EXTENSIONS} (max. 800x400px)
            </p>
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          className="sr-only"
          tabIndex={-1}
          accept={ACCEPTED_LOGO_TYPES.join(",")}
          onChange={(event) => accept(event.target.files?.[0])}
        />
      </div>

      {visibleError ? (
        <p className="text-xs font-medium text-red-600">{visibleError}</p>
      ) : null}
    </div>
  );
}
