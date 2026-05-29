// src/components/common/ViewAllButton.tsx
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ViewAllButtonProps {
  text?: string;
  onClick?: () => void;
}

export const ViewAllButton: React.FC<ViewAllButtonProps> = ({ text = 'Xem tất cả', onClick }) => {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className="rounded-full border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white px-6 cursor-pointer"
    >
      {text}
      <ArrowRight className="w-4 h-4 ml-2" />
    </Button>
  );
};