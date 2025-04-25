import { useCallback } from 'react';

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface FileInputProps {
  label: string;
  onLoad: (data: Record<string, number>) => void;
}

export const FileInput: React.FC<FileInputProps> = ({ label, onLoad }) => {
  const handleChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      onLoad(parsed);
    } catch (err) {
      alert('Failed to parse JSON – please check the file format.');
    }
  }, [onLoad]);

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-sm font-medium text-neutral-700 dark:text-neutral-200">{label}</Label>
      <Input
        type="file"
        accept="application/json"
        onChange={handleChange}
        className="file:mr-4 file:rounded-lg file:border-0 file:bg-neutral-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-neutral-700 hover:file:bg-neutral-200 dark:file:bg-neutral-800 dark:file:text-neutral-100 dark:hover:file:bg-neutral-700"
      />
    </div>
  );
};
