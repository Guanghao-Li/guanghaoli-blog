"use client";

import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { slugify } from "@/lib/slug";

export default function MarkdownContentWithIds({ content }: { content: string }) {
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

  function getTextContent(node: React.ReactNode): string {
    if (typeof node === "string") return node;
    if (Array.isArray(node)) return node.map(getTextContent).join("");
    if (node && typeof node === "object" && "props" in node) return getTextContent((node as any).props?.children);
    return "";
  }

  const Heading = useMemo(
    () =>
      function Heading({
        level,
        children,
        ...props
      }: React.HTMLAttributes<HTMLHeadingElement> & { level: 1 | 2 | 3; children?: React.ReactNode }) {
        const Tag = `h${level}` as "h1" | "h2" | "h3";
        const text = getTextContent(children).trim();
        const id = text ? slugify(text) : `h${level}-${Math.random().toString(36).slice(2, 9)}`;
        return (
          <Tag id={id} {...props}>
            {children}
          </Tag>
        );
      },
    []
  );

  return (
    <div className="prose prose-zinc dark:prose-invert max-w-none prose-headings:scroll-mt-24 [&_pre]:!rounded-xl [&_pre]:!p-4 [&_pre]:!bg-zinc-800 [&_pre]:!text-zinc-100">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code: CodeBlock as any,
          h1: ({ children, ...p }) => <Heading level={1} {...p}>{children}</Heading>,
          h2: ({ children, ...p }) => <Heading level={2} {...p}>{children}</Heading>,
          h3: ({ children, ...p }) => <Heading level={3} {...p}>{children}</Heading>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
