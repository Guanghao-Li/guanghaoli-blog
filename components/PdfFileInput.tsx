"use client";

interface PdfFileInputProps {
  value: string;
  onChange: (base64: string, name: string) => void;
}

export default function PdfFileInput({ value, onChange }: PdfFileInputProps) {
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        onChange(result, file.name);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div>
      <input
        type="file"
        accept=".pdf"
        onChange={handleChange}
        className="block w-full text-sm text-zinc-500 file:mr-4 file:rounded file:border-0 file:bg-zinc-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-zinc-700 hover:file:bg-zinc-200 dark:file:bg-zinc-700 dark:file:text-zinc-200 dark:hover:file:bg-zinc-600"
      />
      {value && (
        <p className="mt-1 text-xs text-zinc-500">当前: {value}</p>
      )}
    </div>
  );
}
