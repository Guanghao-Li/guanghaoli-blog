"use client";

interface PdfAttachmentProps {
  pdfData: string;
  pdfName: string;
}

const PdfIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-8 w-8 text-red-500"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2 5 5h-5V4zM8.5 13H7v4h1.5v-4zm2.5 0h-1.5v4H11v-4zm2.5 0H13v4h1.5v-4zm2 0h-1.5v4H16v-4z" />
  </svg>
);

export default function PdfAttachment({ pdfData, pdfName }: PdfAttachmentProps) {
  if (!pdfData) return null;

  const handleRead = () => {
    window.open(pdfData, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 shadow-md dark:border-zinc-700 dark:bg-zinc-800/50">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <PdfIcon />
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {pdfName || "Document.pdf"}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleRead}
            className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            在线阅读
          </button>
          <a
            href={pdfData}
            download={pdfName || "document.pdf"}
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            下载
          </a>
        </div>
      </div>
    </div>
  );
}
