import React from 'react';
import { User, Phone, IdCard, Activity, Calendar } from 'lucide-react';
import type { MedicalRecordDetail } from '../types/medical';

interface PatientSummaryBannerProps {
  record: MedicalRecordDetail | null;
  recordId?: string | number;
  vitals?: {
    bloodPressure?: string;
    pulse?: number;
    weight?: number;
    height?: number;
    bloodType?: string;
    allergies?: string;
  } | null;
  showVitals?: boolean;
}

const calculateAge = (dob?: string) => {
  if (!dob) return null;
  const birthYear = new Date(dob).getFullYear();
  const currentYear = new Date().getFullYear();
  return currentYear - birthYear;
};

const genderLabel = (g?: string) => {
  if (g === 'MALE') return 'Nam';
  if (g === 'FEMALE') return 'Nữ';
  if (g) return 'Khác';
  return null;
};

export default function PatientSummaryBanner({
  record,
  recordId,
  vitals,
  showVitals = false,
}: PatientSummaryBannerProps) {
  const initials = record?.patientFullName?.charAt(0).toUpperCase() || 'U';
  const age = calculateAge(record?.patientDob);
  const gender = genderLabel(record?.patientGender);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center gap-4 p-4 md:p-5">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-lg flex items-center justify-center shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-bold text-[15px] text-slate-900 truncate">
                {record?.patientFullName || 'Đang tải...'}
              </h2>
              {(gender || age) && (
                <span className="text-[12px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {gender}{gender && age ? ', ' : ''}{age ? `${age} tuổi` : ''}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-1 text-[12px] text-slate-500 font-medium flex-wrap">
              <span className="inline-flex items-center gap-1">
                <IdCard className="w-3 h-3" />
                Hồ sơ #{recordId ?? record?.recordId ?? '—'}
              </span>
              {record?.patientPhone && (
                <span className="inline-flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {record.patientPhone}
                </span>
              )}
              {record?.createdAt && (
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(record.createdAt).toLocaleDateString('vi-VN')}
                </span>
              )}
            </div>
          </div>
        </div>

        {showVitals && vitals && (
          <div className="flex items-center gap-2 flex-wrap md:flex-nowrap md:border-l md:border-slate-200 md:pl-5">
            <VitalChip label="HA" value={vitals.bloodPressure} unit="mmHg" />
            <VitalChip label="Mạch" value={vitals.pulse} unit="bpm" />
            <VitalChip
              label="Cân nặng"
              value={vitals.weight}
              unit="kg"
            />
            {vitals.bloodType && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-rose-50 border border-rose-100 text-[12px] font-bold text-rose-700">
                <Activity className="w-3 h-3" /> {vitals.bloodType}
              </span>
            )}
          </div>
        )}
      </div>

      {showVitals && vitals?.allergies && (
        <div className="border-t border-slate-100 px-5 py-2 bg-amber-50/40 text-[12px] text-amber-800 font-medium flex items-center gap-2">
          <User className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span className="font-bold">Dị ứng:</span>
          <span>{vitals.allergies}</span>
        </div>
      )}
    </div>
  );
}

function VitalChip({
  label,
  value,
  unit,
}: {
  label: string;
  value?: string | number | null;
  unit?: string;
}) {
  return (
    <span className="inline-flex items-baseline gap-1 px-2 py-1 rounded-md bg-slate-50 border border-slate-100 text-[12px]">
      <span className="font-semibold text-slate-500">{label}</span>
      <span className="font-bold text-slate-800 tabular-nums">
        {value ?? '—'}
      </span>
      {value != null && unit && (
        <span className="font-medium text-slate-400">{unit}</span>
      )}
    </span>
  );
}
