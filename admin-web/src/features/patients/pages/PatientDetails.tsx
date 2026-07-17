import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  UserCircle2,
  Phone,
  MapPin,
  Activity,
  BriefcaseMedical,
  Droplet,
  AlertCircle,
  Heart,
  Calendar,
  Cake,
  Mail,
  User,
  Stethoscope,
  Ruler,
  Scale,
  Edit3,
  Printer,
  ShieldCheck,
} from 'lucide-react';

import PatientHistoryTimeline from '../components/PatientHistoryTimeline';
import PatientFormDialog from '../components/PatientFormDialog';
import { patientApi } from '../api/patientApi';
import DetailPageHeader, { IconAction } from '@/components/common/DetailPageHeader';
import { formatBloodType } from '@/constants/bloodTypes';

export default function PatientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [isEditOpen, setIsEditOpen] = React.useState(false);

  const fetchPatient = async () => {
    if (id) {
      try {
        const data = await patientApi.getById(Number(id));
        if (data) {
          setPatient({
            ...data,
            bloodType: data.bloodType || '',
            allergies: data.allergies || 'Chưa cập nhật',
            chronicDiseases: data.chronicDiseases || 'Chưa cập nhật',
            recentVisits: data.recentVisits || [],
          });
        }
      } catch (error) {
        console.error('Failed to fetch patient', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const calculateAge = (dob: string) => {
    if (!dob) return null;
    const birth = new Date(dob);
    const diff = Date.now() - birth.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  React.useEffect(() => {
    fetchPatient();
  }, [id]);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-sm font-medium text-slate-500">Đang tải hồ sơ...</p>
        </div>
      </div>
    );

  if (!patient)
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="rounded-2xl bg-rose-50 px-8 py-6 text-rose-600 shadow-sm border border-rose-100">
          <p className="text-lg font-semibold">Không tìm thấy bệnh nhân</p>
        </div>
      </div>
    );

  const age = calculateAge(patient.dateOfBirth);
  const genderText =
    patient.gender === 'MALE' || patient.gender === 'Male'
      ? 'Nam'
      : patient.gender === 'FEMALE' || patient.gender === 'Female'
        ? 'Nữ'
        : 'Khác';

  const patientCode = `PAT-${String(patient.patientId || id).padStart(5, '0')}`;
  const initial = patient.fullName?.charAt(0)?.toUpperCase() ?? 'U';
  const visits = patient.recentVisits ?? [];

  return (
    <div className="min-h-[calc(100vh-6rem)] animate-in fade-in duration-300 pb-6">
      <div className="mx-auto max-w-[1200px] w-full space-y-5">
        <DetailPageHeader
          title="Hồ sơ bệnh nhân"
          subtitle={`Đang xem chi tiết hồ sơ — ${patient.fullName ?? '—'}`}
          code={`#${patientCode}`}
          onBack={() => navigate('/patients')}
          backLabel="Về danh sách bệnh nhân"
          statusBadge={
            patient.isActive === 0 ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                Đã bị khóa đăng nhập
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                Đang hoạt động
              </span>
            )
          }
          actions={
            <>
              <IconAction
                icon={<Printer size={15} />}
                label="In hồ sơ"
                onClick={() => window.print()}
                tone="sky"
              />
              <IconAction
                icon={<Edit3 size={15} />}
                label="Chỉnh sửa hồ sơ"
                tone="emerald"
                onClick={() => setIsEditOpen(true)}
              />

              {patient.bookingLocked && (
                <IconAction
                  icon={<Activity size={15} />}
                  label="Mở khóa đặt lịch"
                  tone="sky"
                  onClick={async () => {
                    try {
                      await patientApi.unlockBooking(patient.patientId);
                      fetchPatient();
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                />
              )}
            </>
          }
        />

        <div className="grid lg:grid-cols-[minmax(0,320px)_1fr] gap-5 items-start">
          {/* Sidebar - Profile card */}
          <aside className="flex flex-col gap-4 lg:sticky lg:top-6">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 px-5 pt-6 pb-12 relative">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,white,transparent_60%)]" />
                <p className="relative text-[11px] font-bold uppercase tracking-wider text-white/70">
                  Bệnh nhân
                </p>
                <p className="relative text-[12px] font-semibold text-white/90 tabular-nums mt-0.5">
                  {patientCode}
                </p>
              </div>
              <div className="px-5 -mt-9 relative">
                <div className="h-20 w-20 rounded-2xl bg-white text-blue-600 ring-4 ring-white shadow-lg flex items-center justify-center text-3xl font-black">
                  {initial}
                </div>
                <h2 className="mt-3 text-[20px] font-black tracking-tight text-slate-900 leading-tight">
                  {patient.fullName}
                </h2>
                <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                  <Pill icon={<User className="w-3 h-3" />} tone="blue">
                    {genderText}
                  </Pill>
                  {age && (
                    <Pill icon={<Cake className="w-3 h-3" />} tone="violet">
                      {age} tuổi
                    </Pill>
                  )}
                  {patient.bookingLocked && (
                    <Pill icon={<Activity className="w-3 h-3" />} tone="rose">
                      Khóa đặt lịch ({patient.cancelSpamCount} lần hủy)
                    </Pill>
                  )}
                </div>
              </div>

              <div className="border-t border-slate-100 mt-5 p-5 space-y-3">
                <SidebarRow
                  icon={<Calendar className="w-3.5 h-3.5" />}
                  label="Ngày sinh"
                  value={patient.dateOfBirth || 'Chưa cập nhật'}
                />
                <SidebarRow
                  icon={<Phone className="w-3.5 h-3.5" />}
                  label="Số điện thoại"
                  value={patient.phone || 'Chưa cập nhật'}
                  highlight={!!patient.phone}
                />
                {patient.email && (
                  <SidebarRow
                    icon={<Mail className="w-3.5 h-3.5" />}
                    label="Email"
                    value={patient.email}
                  />
                )}
                <SidebarRow
                  icon={<MapPin className="w-3.5 h-3.5" />}
                  label="Địa chỉ"
                  value={patient.address || 'Chưa cập nhật'}
                />
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                icon={<BriefcaseMedical className="w-4 h-4" />}
                value={visits.length}
                label="Lượt khám"
                tone="blue"
              />
              <StatCard
                icon={<Heart className="w-4 h-4" />}
                value={
                  patient.chronicDiseases &&
                  patient.chronicDiseases !== 'Chưa cập nhật'
                    ? 1
                    : 0
                }
                label="Bệnh mãn tính"
                tone="rose"
              />
            </div>

            {/* Trust */}
            <div className="rounded-xl border border-slate-200/60 bg-white/60 backdrop-blur-sm px-4 py-3 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-blue-500 shrink-0" />
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Hồ sơ điện tử được mã hóa, lưu trên hệ thống ClinicPro.
              </p>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex flex-col gap-5 min-w-0">
            {/* Health overview - colored cards */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2 bg-gradient-to-r from-rose-50/50 to-white">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-rose-100 text-rose-600">
                  <Stethoscope size={14} />
                </span>
                <h2 className="font-bold text-slate-800 text-[14px]">
                  Tổng quan sức khỏe
                </h2>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <HealthCard
                    icon={<Droplet className="w-4 h-4" />}
                    label="Nhóm máu"
                    value={formatBloodType(patient.bloodType)}
                    tone="rose"
                  />
                  <HealthCard
                    icon={<Ruler className="w-4 h-4" />}
                    label="Chiều cao"
                    value={patient.height ? `${patient.height} cm` : 'Chưa có'}
                    tone="sky"
                  />
                  <HealthCard
                    icon={<Scale className="w-4 h-4" />}
                    label="Cân nặng"
                    value={patient.weight ? `${patient.weight} kg` : 'Chưa có'}
                    tone="violet"
                  />
                  <HealthCard
                    icon={<Activity className="w-4 h-4" />}
                    label="Huyết áp"
                    value={patient.bloodPressure || 'Chưa có'}
                    tone="amber"
                  />
                  <HealthCard
                    icon={<Activity className="w-4 h-4" />}
                    label="Nhịp tim"
                    value={patient.pulse ? `${patient.pulse} bpm` : 'Chưa có'}
                    tone="emerald"
                  />
                  <HealthCard
                    icon={<Heart className="w-4 h-4" />}
                    label="Bệnh mãn tính"
                    value={
                      patient.chronicDiseases !== 'Chưa cập nhật'
                        ? patient.chronicDiseases
                        : 'Không có'
                    }
                    tone="indigo"
                    multiline
                  />
                </div>

                {patient.allergies && patient.allergies !== 'Chưa cập nhật' && (
                  <div className="rounded-xl border border-amber-200/70 border-l-[3px] border-l-amber-500 bg-gradient-to-r from-amber-50/70 to-white p-3.5">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <p className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                        Cảnh báo dị ứng
                      </p>
                    </div>
                    <p className="text-[14px] font-bold text-amber-900 leading-snug">
                      {patient.allergies}
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Personal block */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2 bg-gradient-to-r from-blue-50/50 to-white">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-blue-100 text-blue-600">
                  <UserCircle2 size={14} />
                </span>
                <h2 className="font-bold text-slate-800 text-[14px]">
                  Thông tin cá nhân chi tiết
                </h2>
              </div>
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-[13.5px]">
                <DetailRow icon={<User className="w-3.5 h-3.5" />} label="Họ và tên" value={patient.fullName} highlight />
                <DetailRow icon={<User className="w-3.5 h-3.5" />} label="Giới tính" value={genderText} />
                <DetailRow icon={<Cake className="w-3.5 h-3.5" />} label="Ngày sinh" value={patient.dateOfBirth || 'Chưa cập nhật'} />
                <DetailRow icon={<Calendar className="w-3.5 h-3.5" />} label="Tuổi" value={age ? `${age} tuổi` : 'Chưa có'} />
                <DetailRow icon={<Phone className="w-3.5 h-3.5" />} label="Số điện thoại" value={patient.phone || 'Chưa cập nhật'} />
                {patient.email && <DetailRow icon={<Mail className="w-3.5 h-3.5" />} label="Email" value={patient.email} />}
                <div className="md:col-span-2">
                  <DetailRow
                    icon={<MapPin className="w-3.5 h-3.5" />}
                    label="Địa chỉ"
                    value={patient.address || 'Chưa cập nhật'}
                  />
                </div>
              </div>
            </section>

            {/* History timeline */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2 bg-gradient-to-r from-violet-50/50 to-white">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-violet-100 text-violet-600">
                  <BriefcaseMedical size={14} />
                </span>
                <h2 className="font-bold text-slate-800 text-[14px]">
                  Lịch sử khám bệnh
                </h2>
                <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-100 text-[11px] font-bold tabular-nums">
                  {visits.length} lượt
                </span>
              </div>
              <div className="max-h-[400px] overflow-y-auto p-2 custom-scrollbar">
                <PatientHistoryTimeline visits={visits} />
              </div>
            </section>
          </div>
        </div>
      </div>
      
      {patient && (
        <PatientFormDialog
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          initialData={patient}
          onSubmit={async (data: any) => {
            await patientApi.update(patient.patientId, data);
            setIsEditOpen(false);
            fetchPatient();
          }}
        />
      )}
    </div>
  );
}

function Pill({
  children,
  icon,
  tone,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
  tone: 'blue' | 'violet' | 'emerald' | 'rose' | 'amber';
}) {
  const styles: Record<typeof tone, string> = {
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    violet: 'bg-violet-50 text-violet-700 border-violet-100',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    rose: 'bg-rose-50 text-rose-700 border-rose-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border ${styles[tone]}`}
    >
      {icon}
      {children}
    </span>
  );
}

function SidebarRow({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="text-slate-400 mt-0.5 shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          {label}
        </p>
        <p
          className={`text-[13px] mt-0.5 break-words ${
            highlight ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
  tone,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  tone: 'blue' | 'rose' | 'emerald' | 'violet';
}) {
  const styles: Record<typeof tone, string> = {
    blue: 'border-blue-100 text-blue-600 bg-blue-50/40',
    rose: 'border-rose-100 text-rose-600 bg-rose-50/40',
    emerald: 'border-emerald-100 text-emerald-600 bg-emerald-50/40',
    violet: 'border-violet-100 text-violet-600 bg-violet-50/40',
  };
  return (
    <div className={`rounded-xl border bg-white px-3 py-3 shadow-sm ${styles[tone]}`}>
      <div className="mb-1.5">{icon}</div>
      <p className="text-[20px] font-black text-slate-800 tabular-nums leading-none">
        {value}
      </p>
      <p className="text-[11px] font-bold text-slate-500 mt-1 uppercase tracking-wider">
        {label}
      </p>
    </div>
  );
}

function HealthCard({
  icon,
  label,
  value,
  tone,
  multiline,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: 'rose' | 'sky' | 'violet' | 'amber' | 'emerald' | 'indigo';
  multiline?: boolean;
}) {
  const styles: Record<typeof tone, string> = {
    rose: 'border-rose-100 bg-gradient-to-br from-rose-50/70 to-white text-rose-700',
    sky: 'border-sky-100 bg-gradient-to-br from-sky-50/70 to-white text-sky-700',
    violet: 'border-violet-100 bg-gradient-to-br from-violet-50/70 to-white text-violet-700',
    amber: 'border-amber-100 bg-gradient-to-br from-amber-50/70 to-white text-amber-700',
    emerald: 'border-emerald-100 bg-gradient-to-br from-emerald-50/70 to-white text-emerald-700',
    indigo: 'border-indigo-100 bg-gradient-to-br from-indigo-50/70 to-white text-indigo-700',
  };
  return (
    <div className={`rounded-xl border p-3 ${styles[tone]}`}>
      <div className="flex items-center gap-1.5 mb-1.5">
        {icon}
        <p className="text-[11px] font-bold uppercase tracking-wider">{label}</p>
      </div>
      <p
        className={`font-black text-slate-800 ${
          multiline ? 'text-[13px] leading-snug' : 'text-[15px] tabular-nums'
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-start gap-2.5 min-w-0">
      <span className="text-slate-400 mt-1 shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          {label}
        </p>
        <p
          className={`mt-0.5 break-words ${
            highlight ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
