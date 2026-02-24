import type { Components } from "react-markdown";

/**
 * Custom components for ReactMarkdown rendering
 * Separated from Preview component for Single Responsibility Principle
 */
export const markdownComponents: Components = {
  // Make links open in new tab
  a: ({ href, children }) => (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="text-blue-400 hover:text-blue-300 underline"
    >
      {children}
    </a>
  ),
  // Responsive images
  img: ({ src, alt }) => (
    <img 
      src={src} 
      alt={alt || ""} 
      className="max-w-full h-auto rounded-lg"
      loading="lazy"
    />
  ),
  // Style code blocks
  pre: ({ children }) => (
    <pre className="bg-[var(--bg-secondary)] rounded-lg p-4 overflow-x-auto my-4">
      {children}
    </pre>
  ),
  code: ({ className, children }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code className="bg-[var(--bg-secondary)] px-1.5 py-0.5 rounded text-sm font-mono">
          {children}
        </code>
      );
    }
    return <code className={className}>{children}</code>;
  },
  // Task list support
  input: ({ checked }) => (
    <input 
      type="checkbox" 
      checked={checked} 
      readOnly 
      className="mr-2 cursor-default"
    />
  ),
  // Better list styling — list-outside for proper nested indentation (CommonMark)
  ul: ({ children }) => (
    <ul className="list-disc list-outside pl-6 my-2 space-y-1">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-outside pl-6 my-2 space-y-1">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="pl-1">
      {children}
    </li>
  ),
  // Headings
  h1: ({ children }) => (
    <h1 className="text-3xl font-bold mt-6 mb-4 border-b border-border pb-2">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl font-bold mt-5 mb-3 border-b border-border pb-1">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl font-bold mt-4 mb-2">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-lg font-bold mt-3 mb-2">
      {children}
    </h4>
  ),
  h5: ({ children }) => (
    <h5 className="text-base font-bold mt-3 mb-1">
      {children}
    </h5>
  ),
  h6: ({ children }) => (
    <h6 className="text-sm font-bold mt-3 mb-1 text-[var(--text-secondary)]">
      {children}
    </h6>
  ),
  // Blockquotes
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-blue-500 pl-4 my-4 italic text-muted-foreground">
      {children}
    </blockquote>
  ),
  // Horizontal rule
  hr: () => (
    <hr className="my-6 border-border" />
  ),
  // Tables
  table: ({ children }) => (
    <div className="overflow-x-auto my-4">
      <table className="min-w-full border border-border rounded-lg">
        {children}
      </table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-border bg-muted px-4 py-2 text-left font-semibold">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-border px-4 py-2">
      {children}
    </td>
  ),
  // Paragraphs
  p: ({ children }) => (
    <p className="my-3 leading-relaxed">
      {children}
    </p>
  ),
};
