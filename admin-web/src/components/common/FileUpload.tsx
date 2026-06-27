import React, { useRef } from 'react';
import { UploadCloud, X } from 'lucide-react';

interface Props {
  onFileSelect: (file: File) => void;
  label?: string;
  accept?: string;
  multiple?: boolean;
}

export default function FileUpload({
  onFileSelect,
  label = 'Tải ảnh lên',
  accept = 'image/*',
  multiple = false,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
      className="border-2 border-dashed border-slate-300 rounded-2xl p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
    >
      <UploadCloud size={32} className="text-slate-400 mb-2" />
      <span className="text-sm font-bold text-slate-600">{label}</span>
      <span className="text-xs text-slate-400 mt-1">Nhấn để chọn ảnh</span>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept}
        multiple={multiple}
        onChange={(e) => {
          const files = e.target.files;
          if (!files?.length) return;
          if (multiple) {
            Array.from(files).forEach(onFileSelect);
          } else {
            onFileSelect(files[0]);
          }
          e.target.value = '';
        }}
      />
    </div>
  );
}

interface UploadedPreviewProps {
  urls: string[];
  onRemove: (index: number) => void;
  resolveUrl?: (url: string) => string;
}

export function UploadedPreview({ urls, onRemove, resolveUrl = (u) => u }: UploadedPreviewProps) {
  if (!urls.length) return null;

  return (
    <div className="flex flex-wrap gap-3 mt-3">
      {urls.map((url, index) => (
        <div key={`${url}-${index}`} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200">
          <img src={resolveUrl(url)} alt="" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5"
          >
            <X size={12} />
          </button>
        </div>
      ))}
    </div>
  );
}
