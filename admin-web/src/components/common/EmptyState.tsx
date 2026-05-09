import React from 'react';
import { FolderSearch } from 'lucide-react';

interface Props { title?: string; description?: string; }

export default function EmptyState({ title = "No records found", description = "Try adjusting your search or filters." }: Props) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center h-full min-h-[300px]">
      <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-4 border border-slate-100">
        <FolderSearch size={32} />
      </div>
      <h3 className="text-lg font-black text-slate-700">{title}</h3>
      <p className="text-sm text-slate-500 font-medium mt-1">{description}</p>
    </div>
  );
}