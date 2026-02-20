"use client";

import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function MarkdownContent({ content }: { content: string }) {
  const CodeBlock = useMemo(
    () =>
      function CodeBlock({
        className,
        children,
        ...props
      }: React.HTMLAttributes<HTMLElement> & { children?: string }) {
        const match = /language-(\w+)/.exec(className || "");
        if (match) {
          return (
            <div>
              <SyntaxHighlighter
                style={oneDark}
                language={match[1]}
                PreTag="div"
                customStyle={{
                  margin: 0,
                  borderRadius: "0.75rem",
                  background: "#27272a",
                }}
                useInlineStyles
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            </div>
          );
        }
        return (
          <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-sm text-zinc-100" {...props}>
            {children}
          </code>
        );
      },
    []
  );

  return (
    <div className="prose prose-zinc dark:prose-invert max-w-none [&_pre]:!rounded-xl [&_pre]:!p-4 [&_pre]:!bg-zinc-800 [&_pre]:!text-zinc-100">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code: CodeBlock as any,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
