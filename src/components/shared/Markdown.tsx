import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

/**
 * Renders stored markdown. Raw HTML is not enabled, so recruiter-authored
 * content cannot inject markup. Styling comes from `.rich-text`, the same class
 * the editor uses, so what was written matches what is published.
 */
export function Markdown({
  content,
  className,
}: {
  content?: string | null;
  className?: string;
}) {
  if (!content?.trim()) return null;

  return (
    <div className={cn("rich-text", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer nofollow">
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
