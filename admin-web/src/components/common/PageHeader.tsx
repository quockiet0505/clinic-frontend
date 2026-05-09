import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface Props {
  title: string; description: string;
  actionText?: string; onAction?: () => void;
}

export default function PageHeader({ title, description, actionText, onAction }: Props) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h1>
        <p className="text-sm text-slate-500 mt-1">{description}</p>
      </div>
      {actionText && onAction && (
        <Button onClick={onAction} className="h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 shadow-sm w-full sm:w-auto">
          <Plus size={18} className="mr-2" /> {actionText}
        </Button>
      )}
    </div>
  );
}