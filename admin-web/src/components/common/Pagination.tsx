import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-slate-200">
      <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="h-8 rounded-lg font-bold">
        <ChevronLeft size={16} className="mr-1"/> Prev
      </Button>
      <span className="text-sm font-bold text-slate-600">Page {currentPage} of {totalPages}</span>
      <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="h-8 rounded-lg font-bold">
        Next <ChevronRight size={16} className="ml-1"/>
      </Button>
    </div>
  );
}