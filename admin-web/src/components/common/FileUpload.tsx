import React from 'react';
import { UploadCloud } from 'lucide-react';

interface Props {
  onFileSelect: (file: File) => void;
  label?: string;
}

export default function FileUpload({ onFileSelect, label = "Upload Document" }: Props) {
  return (
    <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
      <UploadCloud size={32} className="text-slate-400 mb-2" />
      <span className="text-sm font-bold text-slate-600">{label}</span>
      <span className="text-xs text-slate-400 mt-1">Drag & drop or click to browse</span>
      <input type="file" className="hidden" onChange={(e) => e.target.files && onFileSelect(e.target.files[0])} />
    </div>
  );
}