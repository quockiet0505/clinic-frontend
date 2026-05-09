import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-12 w-full h-full">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );
}