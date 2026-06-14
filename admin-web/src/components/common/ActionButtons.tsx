import React from 'react';
import { Edit2, Trash2, Eye, LogIn, XCircle, Edit3, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActionButtonProps {
  onClick: () => void;
  label?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export const EditButton = ({ onClick, label = 'Sửa', icon = <Edit2 size={14} />, disabled, className }: ActionButtonProps) => (
  <Button onClick={onClick} disabled={disabled} variant="outline" size="sm" className={`flex items-center gap-1.5 font-semibold px-3 h-8 rounded-[10px] text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-all cursor-pointer whitespace-nowrap ${className || ''}`}>
    {icon}<span>{label}</span>
  </Button>
);

export const DeleteButton = ({ onClick, label = 'Xóa', icon = <Trash2 size={14} />, disabled, className }: ActionButtonProps) => (
  <Button onClick={onClick} disabled={disabled} variant="outline" size="sm" className={`flex items-center gap-1.5 font-semibold px-3 h-8 rounded-[10px] text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-all cursor-pointer whitespace-nowrap ${className || ''}`}>
    {icon}<span>{label}</span>
  </Button>
);

export const ViewButton = ({ onClick, label = 'Chi tiết', icon = <Eye size={14} />, disabled, className }: ActionButtonProps) => (
  <Button onClick={onClick} disabled={disabled} variant="outline" size="sm" className={`flex items-center gap-1.5 font-semibold px-3 h-8 rounded-[10px] text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 transition-all cursor-pointer whitespace-nowrap ${className || ''}`}>
    {icon}<span>{label}</span>
  </Button>
);

export const CheckInButton = ({ onClick, label = 'Check-in', icon = <LogIn size={14} />, disabled, className }: ActionButtonProps) => (
  <Button onClick={onClick} disabled={disabled} variant="outline" size="sm" className={`flex items-center gap-1.5 font-semibold px-3 h-8 rounded-[10px] text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-all cursor-pointer whitespace-nowrap ${className || ''}`}>
    {icon}<span>{label}</span>
  </Button>
);

export const CancelButton = ({ onClick, label = 'Hủy', icon = <XCircle size={14} />, disabled, className }: ActionButtonProps) => (
  <Button onClick={onClick} disabled={disabled} variant="outline" size="sm" className={`flex items-center gap-1.5 font-semibold px-3 h-8 rounded-[10px] text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 transition-all cursor-pointer whitespace-nowrap ${className || ''}`}>
    {icon}<span>{label}</span>
  </Button>
);

export const InputResultButton = ({ onClick, label = 'Nhập kết quả', icon = <Edit3 size={14} />, disabled, className }: ActionButtonProps) => (
  <Button onClick={onClick} disabled={disabled} variant="outline" size="sm" className={`flex items-center gap-1.5 font-semibold px-3 h-8 rounded-[10px] text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 transition-all cursor-pointer whitespace-nowrap ${className || ''}`}>
    {icon}<span>{label}</span>
  </Button>
);

export const ViewResultButton = ({ onClick, label = 'Xem kết quả', icon = <FileText size={14} />, disabled, className }: ActionButtonProps) => (
  <Button onClick={onClick} disabled={disabled} variant="outline" size="sm" className={`flex items-center gap-1.5 font-semibold px-3 h-8 rounded-[10px] text-purple-600 border-purple-200 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300 transition-all cursor-pointer whitespace-nowrap ${className || ''}`}>
    {icon}<span>{label}</span>
  </Button>
);
