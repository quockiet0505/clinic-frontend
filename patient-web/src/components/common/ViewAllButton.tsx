// src/components/common/ViewAllButton.tsx

import React from 'react';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface ViewAllButtonProps {
  text?: string;
  onClick?: () => void;
}

export const ViewAllButton: React.FC<ViewAllButtonProps> = ({
  text = 'Xem tất cả',
  onClick,
}) => {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className="rounded-full border-[#00b5f1] text-[#00b5f1] hover:bg-[#00b5f1] hover:text-white px-6"
    >
      {text}

      <ArrowRight className="w-4 h-4 ml-2" />
    </Button>
  );
};