import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface GradientButtonProps extends React.ComponentProps<typeof Button> {
  children: React.ReactNode;
  className?: string;
}

export default function GradientButton({ children, className, ...props }: GradientButtonProps) {
  return (
    <Button
      className={cn(
        "h-11 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}