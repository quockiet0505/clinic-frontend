import React from 'react';
import { Stethoscope, ShieldCheck, TestTube, Briefcase, UserCog, LucideIcon } from 'lucide-react';

const ROLE_CONFIG: Record<string, { Icon: LucideIcon; color: string; label: string }> = {
  DOCTOR: { Icon: Stethoscope, color: 'text-blue-500', label: 'Bác sĩ' },
  ADMIN: { Icon: ShieldCheck, color: 'text-purple-500', label: 'Quản trị viên' },
  LAB_TECH: { Icon: TestTube, color: 'text-emerald-500', label: 'Kỹ thuật viên' },
  STAFF: { Icon: Briefcase, color: 'text-slate-500', label: 'Nhân viên' },
};

export function getRoleLabel(role: string): string {
  return ROLE_CONFIG[role]?.label ?? role;
}

export function RoleDisplay({ role }: { role: string }) {
  const cfg = ROLE_CONFIG[role] ?? { Icon: UserCog, color: 'text-slate-400', label: role };
  const { Icon, color, label } = cfg;

  return (
    <div className="inline-flex items-center gap-2 whitespace-nowrap min-w-0">
      <span className={`inline-flex shrink-0 items-center justify-center w-4 h-4 ${color}`}>
        <Icon size={16} strokeWidth={2} className="shrink-0" />
      </span>
      <span className="text-sm font-medium text-slate-700">{label}</span>
    </div>
  );
}

export function RoleIcon({ role, size = 16 }: { role: string; size?: number }) {
  const cfg = ROLE_CONFIG[role] ?? { Icon: UserCog, color: 'text-slate-400', label: role };
  const { Icon, color } = cfg;
  return <Icon size={size} strokeWidth={2} className={`shrink-0 ${color}`} />;
}
