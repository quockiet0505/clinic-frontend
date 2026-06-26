import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Zap } from 'lucide-react';

interface Props {
  queueNumber?: number | null;
}

export default function QueueNumberCell({ queueNumber }: Props) {
  if (queueNumber === null || queueNumber === undefined) {
    return <span className="text-sm text-slate-300">—</span>;
  }

  if (queueNumber === 0) {
    return (
      <Badge
        variant="outline"
        className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border-amber-200 text-[11px] font-semibold px-2 py-0.5 rounded-md whitespace-nowrap"
      >
        <Zap size={11} className="shrink-0" />
        Ưu tiên
      </Badge>
    );
  }

  return <span className="text-sm font-bold text-slate-800">#{queueNumber}</span>;
}
