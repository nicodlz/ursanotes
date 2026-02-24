import { useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { useVaultStore } from "@/stores/index.js";
import { markdownComponents } from "@/lib/markdown-components.js";

interface PreviewProps {
  noteId: string;
  onScroll?: (scrollTop: number, scrollHeight: number, clientHeight: number) => void;
}

/**
 * Markdown preview component
 * 
 * Focused on rendering. Markdown component config extracted to lib/markdown-components.
 */
export function Preview({ noteId, onScroll }: PreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Select only the content string to minimize re-renders
  const noteContent = useVaultStore((state) => {
    const note = state.notes.find((n) => n.id === noteId);
    return note?.content ?? null;
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !onScroll) return;

    const handleScroll = () => {
      onScroll(
        container.scrollTop,
        container.scrollHeight,
        container.clientHeight
      );
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [onScroll]);

  if (noteContent === null) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <p>Note not found</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="h-full overflow-auto p-6">
      <div className="prose prose-invert max-w-none">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={markdownComponents}
        >
          {noteContent}
        </ReactMarkdown>
      </div>
    </div>
  );
}
