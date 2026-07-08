import React from 'react';
import { Stethoscope, ShieldCheck, TestTube, Briefcase, UserCog, LucideIcon } from 'lucide-react';

const ROLE_CONFIG: Record<string, { Icon: LucideIcon; color: string; bg: string; label: string }> = {
  DOCTOR: { Icon: Stethoscope, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200', label: 'Bác sĩ' },
  ADMIN: { Icon: ShieldCheck, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200', label: 'Quản trị viên' },
  LAB_TECH: { Icon: TestTube, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', label: 'Kỹ thuật viên' },
  STAFF: { Icon: Briefcase, color: 'text-slate-600', bg: 'bg-slate-50 border-slate-200', label: 'Nhân viên' },
};

export function getRoleLabel(role: string): string {
  return ROLE_CONFIG[role]?.label ?? role;
}

export function RoleDisplay({ role, expertiseName }: { role: string; expertiseName?: string }) {
  const cfg = ROLE_CONFIG[role] ?? { Icon: UserCog, color: 'text-slate-600', bg: 'bg-slate-50 border-slate-200', label: role };
  let { Icon, color, bg, label } = cfg;

  let displayLabel = label;
  if (role === 'LAB_TECH' && expertiseName) {
    const ext = expertiseName.toLowerCase();
    displayLabel = `KTV - ${expertiseName.replace('Khoa ', '')}`;
    
    // Soft, delicate colors for badges ("nhẹ nhàng")
    if (ext.includes('xét nghiệm')) {
      color = 'text-emerald-600'; bg = 'bg-emerald-50 border-emerald-200';
    } else if (ext.includes('hình ảnh') || ext.includes('x-quang')) {
      color = 'text-violet-600'; bg = 'bg-violet-50 border-violet-200';
    } else if (ext.includes('siêu âm')) {
      color = 'text-sky-600'; bg = 'bg-sky-50 border-sky-200';
    } else if (ext.includes('nội soi')) {
      color = 'text-amber-600'; bg = 'bg-amber-50 border-amber-200';
    } else {
      color = 'text-slate-600'; bg = 'bg-slate-50 border-slate-200';
    }
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${bg} ${color} whitespace-nowrap min-w-0`}>
      <Icon size={14} strokeWidth={2} className="shrink-0" />
      <span className="text-xs font-semibold">{displayLabel}</span>
    </div>
  );
}

export function RoleIcon({ role, size = 16 }: { role: string; size?: number }) {
  const cfg = ROLE_CONFIG[role] ?? { Icon: UserCog, color: 'text-slate-400', label: role };
  const { Icon, color } = cfg;
  return <Icon size={size} strokeWidth={2} className={`shrink-0 ${color}`} />;
}
