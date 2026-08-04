"use client";

import { useEffect } from "react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extensions";
import { Markdown } from "tiptap-markdown";
import {
  Bold,
  Heading2,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Strikethrough,
  Undo2,
  Unlink,
} from "lucide-react";
import { cn } from "@/lib/utils";

type RichTextEditorProps = {
  /** Markdown in, markdown out — the editor itself is WYSIWYG. */
  value: string;
  onChange: (markdown: string) => void;
  placeholder?: string;
  className?: string;
};

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  className,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: { openOnClick: false },
      }),
      Placeholder.configure({ placeholder }),
      Markdown.configure({ html: false, transformPastedText: true }),
    ],
    content: value,
    // Next renders this on the server first; deferring avoids a hydration mismatch.
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "rich-text min-h-56 px-4 py-3 outline-none",
      },
    },
    onUpdate: ({ editor: instance }) => {
      onChange(instance.storage.markdown.getMarkdown());
    },
  });

  // Adopt values set from outside (loading a job to edit, or a form reset)
  // without clobbering what is being typed.
  useEffect(() => {
    if (!editor) return;
    if (value === editor.storage.markdown.getMarkdown()) return;
    editor.commands.setContent(value, { emitUpdate: false });
  }, [editor, value]);

  const state = useEditorState({
    editor,
    selector: ({ editor: instance }) => ({
      isBold: instance?.isActive("bold") ?? false,
      isItalic: instance?.isActive("italic") ?? false,
      isStrike: instance?.isActive("strike") ?? false,
      isHeading: instance?.isActive("heading", { level: 2 }) ?? false,
      isBulletList: instance?.isActive("bulletList") ?? false,
      isOrderedList: instance?.isActive("orderedList") ?? false,
      isQuote: instance?.isActive("blockquote") ?? false,
      isLink: instance?.isActive("link") ?? false,
      canUndo: instance?.can().undo() ?? false,
      canRedo: instance?.can().redo() ?? false,
    }),
  });

  if (!editor) {
    return (
      <div
        className={cn(
          "h-72 animate-pulse rounded-xl border border-border bg-surface-muted/40",
          className,
        )}
      />
    );
  }

  const setLink = () => {
    const previous = editor.getAttributes("link").href as string | undefined;
    const href = window.prompt("Link URL", previous ?? "https://");

    if (href === null) return;
    if (href === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href, target: "_blank" })
      .run();
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-surface focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/30",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-surface-muted/60 px-2 py-1.5">
        <ToolbarButton
          label="Bold"
          icon={Bold}
          active={state?.isBold}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
        <ToolbarButton
          label="Italic"
          icon={Italic}
          active={state?.isItalic}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />
        <ToolbarButton
          label="Strikethrough"
          icon={Strikethrough}
          active={state?.isStrike}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        />

        <Divider />

        <ToolbarButton
          label="Heading"
          icon={Heading2}
          active={state?.isHeading}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        />
        <ToolbarButton
          label="Bulleted list"
          icon={List}
          active={state?.isBulletList}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />
        <ToolbarButton
          label="Numbered list"
          icon={ListOrdered}
          active={state?.isOrderedList}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        />
        <ToolbarButton
          label="Quote"
          icon={Quote}
          active={state?.isQuote}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        />

        <Divider />

        <ToolbarButton
          label={state?.isLink ? "Edit link" : "Add link"}
          icon={Link2}
          active={state?.isLink}
          onClick={setLink}
        />
        {state?.isLink ? (
          <ToolbarButton
            label="Remove link"
            icon={Unlink}
            onClick={() =>
              editor.chain().focus().extendMarkRange("link").unsetLink().run()
            }
          />
        ) : null}

        <div className="ml-auto flex items-center gap-0.5">
          <ToolbarButton
            label="Undo"
            icon={Undo2}
            disabled={!state?.canUndo}
            onClick={() => editor.chain().focus().undo().run()}
          />
          <ToolbarButton
            label="Redo"
            icon={Redo2}
            disabled={!state?.canRedo}
            onClick={() => editor.chain().focus().redo().run()}
          />
        </div>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}

function Divider() {
  return <span aria-hidden="true" className="mx-1 h-5 w-px bg-border" />;
}

function ToolbarButton({
  label,
  icon: Icon,
  active,
  disabled,
  onClick,
}: {
  label: string;
  icon: typeof Bold;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex size-8 items-center justify-center rounded-md transition-colors disabled:opacity-40",
        active
          ? "bg-brand-tint text-brand"
          : "text-body hover:bg-surface hover:text-heading",
      )}
    >
      <Icon aria-hidden="true" className="size-4" />
    </button>
  );
}
