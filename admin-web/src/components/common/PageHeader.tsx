import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface Props {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actionText?: string;
  onAction?: () => void;
  children?: React.ReactNode;
}

export default function PageHeader({ title, description, breadcrumbs, actionText, onAction, children }: Props) {
  // Mặc định nếu không truyền breadcrumbs: Trang chủ / Tiêu đề
  const finalBreadcrumbs = breadcrumbs || [
    { label: 'Trang chủ', path: '/dashboard' },
    { label: title }
  ];

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
      <div>
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-1">
          {finalBreadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {crumb.path ? (
                <Link to={crumb.path} className="hover:text-slate-800 transition-colors cursor-pointer">
                  {crumb.label}
                </Link>
              ) : (
                <span className={idx === finalBreadcrumbs.length - 1 ? "font-medium text-slate-800" : "hover:text-slate-800 transition-colors cursor-pointer"}>
                  {crumb.label}
                </span>
              )}
              {idx < finalBreadcrumbs.length - 1 && <span className="text-slate-300">/</span>}
            </React.Fragment>
          ))}
        </nav>
        <div className="flex items-end gap-3">
          <h1 className="text-xl font-semibold text-slate-800">{title}</h1>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
        {children}
        {actionText && onAction && (
          <Button onClick={onAction} className="h-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg text-white font-bold px-5 shadow-sm w-full sm:w-auto cursor-pointer">
            <Plus size={18} className="mr-2" /> {actionText}
          </Button>
        )}
      </div>
    </div>
  );
}