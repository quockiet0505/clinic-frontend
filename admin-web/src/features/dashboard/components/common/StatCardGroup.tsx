import React from 'react';
import { StatsCard } from '@/components/common/StatsCard';

interface StatItem {
  title: string;
  value: string;
  trend: string;
  isUp: boolean;
  icon: React.ElementType;
  color: string;
  bg: string;
}

interface Props {
  stats: StatItem[];
  cols?: number;
}

export default function StatCardGroup({ stats, cols = 4 }: Props) {
  const colClass = {
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5',
    6: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-6',
  }[cols] || 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';

  return (
    <div className={`grid ${colClass} gap-4`}>
      {stats.map((stat, idx) => (
        <StatsCard
          key={idx}
          icon={<stat.icon size={16} />}
          label={stat.title}
          value={stat.value}
          bgColor={stat.bg}
          iconColor={stat.color}
        />
      ))}
    </div>
  );
}