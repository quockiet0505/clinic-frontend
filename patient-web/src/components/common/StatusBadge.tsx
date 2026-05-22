// src/components/common/StatusBadge.tsx

import React from 'react';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status:
    | 'PENDING'
    | 'CONFIRMED'
    | 'COMPLETED'
    | 'CANCELLED';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
}) => {
  const statusMap = {
    PENDING:
      'bg-yellow-100 text-yellow-700 hover:bg-yellow-100',

    CONFIRMED:
      'bg-blue-100 text-blue-700 hover:bg-blue-100',

    COMPLETED:
      'bg-green-100 text-green-700 hover:bg-green-100',

    CANCELLED:
      'bg-red-100 text-red-700 hover:bg-red-100',
  };

  return (
    <Badge className={statusMap[status]}>
      {status}
    </Badge>
  );
};