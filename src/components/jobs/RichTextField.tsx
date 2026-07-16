"use client";

import { useRef, type ChangeEvent } from "react";
import { Bold, Italic, Link2, List } from "lucide-react";
import { cn } from "@/lib/utils";

export type RichTextTool = "bold" | "italic" | "list" | "link";

type RichTextFieldProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  tools?: RichTextTool[];
  invalid?: boolean;
  minLength?: number;
};

// Fixed the missing `<` opening bracket for the Record generic here:
const TOOL_META: Record<
  RichTextTool,
  { icon: typeof Bold; label: string; group: "format" | "insert" }
> = {
  bold: { icon: Bold, label: "Bold", group: "format" },
  italic: { icon: Italic, label: "Italic", group: "format" },
  list: { icon: List, label: "Bulleted list", group: "format" },
  link: { icon: Link2, label: "Insert link", group: "insert" },
};

export function RichTextField({
  id,
  value,
  onChange,
  placeholder,
  tools = ["bold", "italic", "list", "link"],
  invalid = false,
  minLength,
}: RichTextFieldProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const applyTool = (tool: RichTextTool) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.slice(start, end);
    const before = value.slice(0, start);
    const after = value.slice(end);

    let inserted: string;
    let caretStart: number;
    let caretEnd: number;

    switch (tool) {
      case "bold": {
        inserted = `**${selected || "bold text"}**`;
        caretStart = start + 2;
        caretEnd = caretStart + (selected || "bold text").length;
        break;
      }
      case "italic": {
        inserted = `*${selected || "italic text"}*`;
        caretStart = start + 1;
        caretEnd = caretStart + (selected || "italic text").length;
        break;
      }
      case "list": {
        const source = selected || "List item";
        inserted = source
          .split("\n")
          .map((line) => (line.startsWith("- ") ? line : `- ${line}`))
          .join("\n");
        caretStart = start;
        caretEnd = start + inserted.length;
        break;
      }
      case "link": {
        const label = selected || "link text";
        inserted = `[${label}](https://)`;
        caretStart = start + label.length + 3;
        caretEnd = caretStart + 8;
        break;
      }
    }

    onChange(`${before}${inserted}${after}`);

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(caretStart, caretEnd);
    });
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };

  const formatTools = tools.filter((t) => TOOL_META[t].group === "format");
  const insertTools = tools.filter((t) => TOOL_META[t].group === "insert");
  const belowMin = minLength !== undefined && value.length < minLength;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-slate-200 bg-white transition-all duration-200",
        "focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20",
        invalid && "border-red-300 focus-within:border-red-400 focus-within:ring-red-100",
      )}
    >
      <div className="flex items-center gap-1 border-b border-slate-200 bg-slate-50/70 px-3 py-2">
        {formatTools.map((tool) => {
          const { icon: Icon, label } = TOOL_META[tool];
          return (
            <button
              key={tool}
              type="button"
              aria-label={label}
              onClick={() => applyTool(tool)}
              className="flex size-7 items-center justify-center rounded text-slate-500 transition-colors duration-200 hover:bg-slate-200/70 hover:text-heading active:bg-slate-300/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
            >
              <Icon className="size-3.5" aria-hidden="true" />
            </button>
          );
        })}

        {formatTools.length > 0 && insertTools.length > 0 ? (
          <span
            aria-hidden="true"
            className="mx-1 h-4 w-px shrink-0 bg-slate-300"
          />
        ) : null}

        {insertTools.map((tool) => {
          const { icon: Icon, label } = TOOL_META[tool];
          return (
            <button
              key={tool}
              type="button"
              aria-label={label}
              onClick={() => applyTool(tool)}
              className="flex size-7 items-center justify-center rounded text-slate-500 transition-colors duration-200 hover:bg-slate-200/70 hover:text-heading active:bg-slate-300/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
            >
              <Icon className="size-3.5" aria-hidden="true" />
            </button>
          );
        })}
      </div>

      <textarea
        ref={textareaRef}
        id={id}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        aria-invalid={invalid}
        className="min-h-40 w-full resize-none border-0 bg-transparent px-4 py-3 text-sm text-heading placeholder:text-slate-400 focus:outline-none focus:ring-0"
      />

      {minLength !== undefined ? (
        <div className="flex justify-end px-4 pb-2">
          <span
            className={cn(
              "text-[10px] tabular-nums",
              belowMin ? "text-red-500" : "text-slate-400",
            )}
          >
            {value.length} / {minLength} min
          </span>
        </div>
      ) : null}
    </div>
  );
}