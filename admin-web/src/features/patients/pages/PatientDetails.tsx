import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
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
} from 'lucide-react';

import PatientHistoryTimeline from '../components/PatientHistoryTimeline';
import { patientApi } from '../api/patientApi';

export default function PatientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  const calculateAge = (dob: string) => {
    if (!dob) return null;
    const birth = new Date(dob);
    const diff = Date.now() - birth.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  React.useEffect(() => {
    const fetchPatient = async () => {
      if (id) {
        try {
          const data = await patientApi.getById(Number(id));
          if (data) {
            setPatient({
              ...data,
              bloodType: data.bloodType || 'Chưa cập nhật',
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
    fetchPatient();
  }, [id]);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
          <p className="text-sm font-medium text-slate-500">Đang tải hồ sơ...</p>
        </div>
      </div>
    );

  if (!patient)
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="rounded-2xl bg-rose-50 px-8 py-6 text-rose-600 shadow-sm">
          <p className="text-lg font-semibold">⚠️ Không tìm thấy bệnh nhân</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* HEADER - NÚT QUAY LẠI ĐƯỢC SỬA LẠI NHƯ BAN ĐẦU */}
        <div className="flex items-center gap-3">
          <ChevronLeft 
            size={28} 
            className="cursor-pointer text-slate-400 hover:text-slate-600 transition-colors" 
            onClick={() => navigate('/patients')} 
          />
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">Hồ sơ bệnh nhân</h1>
            <p className="text-sm text-slate-500">
              Đang xem chi tiết <span className="font-semibold text-slate-700">#{patient.patientId || id}</span>
            </p>
          </div>
        </div>

        {/* MAIN CARD */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/60 ring-1 ring-slate-200/50">
          {/* Profile Header - MÀU NHẠT */}
          <div className="relative bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 px-8 py-7 text-slate-800">
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-white/60 text-4xl font-bold uppercase text-indigo-600 shadow-lg backdrop-blur-sm ring-2 ring-white/70">
                {patient.fullName.charAt(0)}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-3xl font-bold tracking-tight text-slate-800">{patient.fullName}</h2>
                <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100/80 px-3 py-1 text-xs font-semibold text-indigo-700 backdrop-blur-sm">
                    <User size={12} />
                    PAT-{patient.patientId || id}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100/80 px-3 py-1 text-xs font-semibold text-emerald-700 backdrop-blur-sm">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                    </span>
                    Hoạt động
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Info Body - 2 columns */}
          <div className="grid grid-cols-1 gap-0 divide-y divide-slate-100 md:grid-cols-2 md:divide-x md:divide-y-0">
            {/* Left: Personal Info */}
            <div className="space-y-5 p-7">
              <div className="flex items-center gap-2">
                <UserCircle2 size={18} className="text-indigo-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Thông tin cá nhân</h3>
              </div>
              <div className="space-y-4 text-sm">
                <InfoRow icon={User} label="Giới tính" value={genderText} />
                <InfoRow icon={Cake} label="Ngày sinh" value={patient.dateOfBirth || 'Chưa cập nhật'} />
                <InfoRow icon={Calendar} label="Tuổi" value={age ? `${age} tuổi` : 'Chưa có'} />
                {patient.email && <InfoRow icon={Mail} label="Email" value={patient.email} isLong />}
              </div>
              {/* ĐÃ BỎ GẠCH NGANG */}
              <div className="space-y-4 text-sm">
                <InfoRow icon={Phone} label="Số điện thoại" value={patient.phone || 'Chưa cập nhật'} />
                <InfoRow icon={MapPin} label="Địa chỉ" value={patient.address || 'Chưa cập nhật'} isLong />
              </div>
            </div>

            {/* Right: Health Info */}
            <div className="space-y-5 p-7">
              <div className="flex items-center gap-2">
                <Stethoscope size={18} className="text-rose-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Thông tin sức khỏe</h3>
              </div>
              <div className="space-y-4 text-sm">
                <InfoRow 
                  icon={Droplet} 
                  label="Nhóm máu" 
                  value={patient.bloodType} 
                  valueClassName="text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md font-semibold whitespace-nowrap"
                  isOneLine
                />
                <InfoRow 
                  icon={AlertCircle} 
                  label="Dị ứng" 
                  value={patient.allergies} 
                  valueClassName="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md whitespace-nowrap"
                  isOneLine
                />
                <InfoRow 
                  icon={Heart} 
                  label="Bệnh mãn tính" 
                  value={patient.chronicDiseases} 
                  valueClassName="text-slate-800 whitespace-nowrap"
                  isOneLine
                />
              </div>
            </div>
          </div>
        </div>

        {/* HISTORY TIMELINE CARD */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-lg shadow-slate-200/60 ring-1 ring-slate-200/50">
          <div className="flex items-center gap-3 border-b border-slate-100 px-7 py-4">
            <BriefcaseMedical size={20} className="text-indigo-500" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600">Lịch sử khám bệnh</h2>
            <span className="ml-auto text-xs font-medium text-slate-400">
              {patient.recentVisits?.length || 0} lượt
            </span>
          </div>
          <div className="max-h-[340px] overflow-y-auto p-2">
            <PatientHistoryTimeline visits={patient.recentVisits} />
          </div>
        </div>
      </div>
    </div>
  );
}

// InfoRow component với label lớn hơn
function InfoRow({
  icon: Icon,
  label,
  value,
  isLong = false,
  isOneLine = false,
  valueClassName = '',
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  isLong?: boolean;
  isOneLine?: boolean;
  valueClassName?: string;
}) {
  return (
    <div className={`flex items-start gap-3 ${isLong ? 'items-start' : 'items-center'}`}>
      <Icon size={16} className="mt-0.5 shrink-0 text-slate-400" />
      <span className="min-w-[100px] shrink-0 text-sm font-semibold text-slate-500">{label}</span>
      <span 
        className={`text-sm font-medium text-slate-800 ${valueClassName} ${isOneLine ? 'truncate' : ''}`}
        style={{ maxWidth: isOneLine ? '160px' : 'none' }}
        title={value}
      >
        {value}
      </span>
    </div>
  );
}