import React, { useState } from 'react';
import { format } from 'date-fns';
import { CalendarDays, Clock3, User, Activity, FileText, FlaskConical, HelpCircle, XCircle, FileSignature, Pill, Loader2, CalendarOff } from 'lucide-react';
import { CancelAppointmentDialog } from './CancelAppointmentDialog';
import type { AppointmentHistoryItem } from '../types/appointment';
import { recordApi } from '../../records/api/recordApi';
import { useNavigate } from 'react-router-dom';
import { Dialog } from '@/components/ui/dialog';
import { PrescriptionModalContent } from '../../records/components/PrescriptionModalContent';
import { LabResultModalContent } from '../../records/components/LabResultModalContent';
import { ReviewModal } from './ReviewModal';
import { useToast } from '@/hooks/useToast';
import { Star } from 'lucide-react';

interface AppointmentCardProps {
  appointment: AppointmentHistoryItem;
  onCancelSuccess: () => void;
  isUpcoming: boolean;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, onCancelSuccess, isUpcoming }) => {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const [prescriptionData, setPrescriptionData] = useState<any>(null);
  const [labResultData, setLabResultData] = useState<any>(null);
  const { status } = appointment;
  const { toast } = useToast();
  const navigate = useNavigate();

  // Status mapping based on Patient Journey
  const statusConfig: Record<string, { label: string, color: string, icon: React.ReactNode, message: string }> = {
    PENDING: {
      label: 'Chờ xác nhận',
      color: 'bg-amber-100 text-amber-700 border-amber-200',
      icon: <HelpCircle className="w-4 h-4 text-amber-600" />,
      message: 'Phòng khám đang xác nhận lịch hẹn của bạn.'
    },
    CONFIRMED: {
      label: 'Đã xác nhận',
      color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      icon: <CalendarDays className="w-4 h-4 text-emerald-600" />,
      message: 'Vui lòng đến trước giờ khám 15 phút để làm thủ tục.'
    },
    CHECKED_IN: {
      label: 'Đã check-in',
      color: 'bg-blue-100 text-blue-700 border-blue-200',
      icon: <User className="w-4 h-4 text-blue-600" />,
      message: `Bạn đã làm thủ tục thành công. Số thứ tự: ${appointment.queueNumber || 'Đang cập nhật'}`
    },
    IN_PROGRESS: {
      label: 'Đang khám',
      color: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      icon: <Activity className="w-4 h-4 text-indigo-600" />,
      message: 'Bác sĩ đang tiếp nhận và thăm khám.'
    },
    WAITING_RESULT: {
      label: 'Chờ kết quả',
      color: 'bg-purple-100 text-purple-700 border-purple-200',
      icon: <FlaskConical className="w-4 h-4 text-purple-600" />,
      message: 'Vui lòng chờ kết quả cận lâm sàng/xét nghiệm.'
    },
    SKIPPED: {
      label: 'Bị qua lượt',
      color: 'bg-orange-100 text-orange-700 border-orange-200',
      icon: <Clock3 className="w-4 h-4 text-orange-600" />,
      message: 'Đã gọi tên nhưng bạn không có mặt. Vui lòng liên hệ quầy lễ tân để được xếp lại vào cuối hàng đợi.'
    },
    COMPLETED: {
      label: 'Hoàn thành',
      color: 'bg-slate-100 text-slate-700 border-slate-200',
      icon: <FileSignature className="w-4 h-4 text-slate-600" />,
      message: 'Bạn có thể xem lại đơn thuốc và kết quả xét nghiệm.'
    },
    CANCELLED: {
      label: 'Đã huỷ',
      color: 'bg-rose-100 text-rose-700 border-rose-200',
      icon: <XCircle className="w-4 h-4 text-rose-600" />,
      message: 'Lịch hẹn này đã được huỷ bỏ.'
    },
    NO_SHOW: {
      label: 'Không đến khám',
      color: 'bg-red-100 text-red-700 border-red-200',
      icon: <CalendarOff className="w-4 h-4 text-red-600" />,
      message: 'Bạn đã không đến khám theo lịch hẹn.'
    }
  };

  const config = statusConfig[status] || {
    label: status,
    color: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: <CalendarDays className="w-4 h-4 text-slate-600" />,
    message: ''
  };

  const avatarGradient = getAvatarColor(appointment.doctorName);
  const initial = appointment.doctorName ? appointment.doctorName.charAt(0).toUpperCase() : 'B';

  const appointmentDate = new Date(appointment.appointmentDate);
  const timeStart = appointment.timeStart?.substring(0, 5) || '00:00';
  const timeEnd = appointment.timeEnd?.substring(0, 5) || '00:00';

  const handleOpenPrescription = async () => {
    setLoadingModal(true);
    try {
      const histories = await recordApi.getMedicalHistory();
      const record = histories.find(r => r.appointmentId === Number(appointment.id));
      if (!record) {
        toast({ title: 'Không tìm thấy', description: 'Chưa có hồ sơ khám cho lịch này.', variant: 'destructive' });
        return;
      }
      const detail = await recordApi.getRecordDetail(record.recordId);
      if (detail.prescription) {
        setPrescriptionData({
          ...detail.prescription,
          diagnosis: detail.diagnosis,
          treatment: detail.treatment,
          doctorName: detail.mainDoctorName,
          patientFullName: detail.patientFullName,
          patientGender: detail.patientGender,
          patientDob: detail.patientDob,
          patientPhone: detail.patientPhone,
          patientAddress: detail.patientAddress,
        });
      } else {
        toast({ title: 'Trống', description: 'Bác sĩ không kê đơn thuốc cho lần khám này.' });
      }
    } catch (e) {
      toast({ title: 'Lỗi', description: 'Không thể tải đơn thuốc.', variant: 'destructive' });
    } finally {
      setLoadingModal(false);
    }
  };

  const handleOpenLabResult = async () => {
    setLoadingModal(true);
    try {
      const histories = await recordApi.getMedicalHistory();
      const record = histories.find(r => r.appointmentId === Number(appointment.id));
      if (!record) {
        toast({ title: 'Không tìm thấy', description: 'Chưa có hồ sơ khám cho lịch này.', variant: 'destructive' });
        return;
      }
      const detail = await recordApi.getRecordDetail(record.recordId);
      // Giả sử lấy kết quả xét nghiệm đầu tiên
      const labOrder = detail.serviceOrders?.find(o => o.result);
      if (labOrder?.result) {
        setLabResultData({
          ...labOrder.result,
          serviceName: labOrder.serviceName,
          price: labOrder.price,
          doctorName: detail.mainDoctorName,
          resultId: labOrder.result.resultId,
          patientFullName: detail.patientFullName,
          patientGender: detail.patientGender,
          patientDob: detail.patientDob,
          patientPhone: detail.patientPhone,
          patientAddress: detail.patientAddress,
        });
      } else {
        toast({ title: 'Trống', description: 'Chưa có kết quả xét nghiệm nào.' });
      }
    } catch (e) {
      toast({ title: 'Lỗi', description: 'Không thể tải kết quả xét nghiệm.', variant: 'destructive' });
    } finally {
      setLoadingModal(false);
    }
  };

  const handleOpenRecord = async () => {
    setLoadingModal(true);
    try {
      const histories = await recordApi.getMedicalHistory();
      const record = histories.find(r => r.appointmentId === Number(appointment.id));
      if (!record) {
        toast({ title: 'Không tìm thấy', description: 'Chưa có hồ sơ khám cho lịch này.', variant: 'destructive' });
        return;
      }
      toast({ title: 'Thành công', description: 'Đang chuyển đến chi tiết hồ sơ...', variant: 'default' });
      navigate(`/records/detail/${record.recordId}`);
    } catch (e) {
      toast({ title: 'Lỗi', description: 'Không thể tải hồ sơ khám.', variant: 'destructive' });
    } finally {
      setLoadingModal(false);
    }
  };

  // Helper cho LabResultModalContent
  const getLabStatus = (data: any) => {
    if (!data?.resultData) return { label: 'Chờ kết quả', color: 'bg-amber-100 text-amber-700 border-amber-200' };
    const text = data.resultData.toLowerCase();
    const isAbnormal = text.includes('bất thường') || text.includes('cao') || text.includes('thấp') || text.includes('dương tính');
    return isAbnormal 
      ? { label: 'Bất thường', color: 'bg-rose-100 text-rose-700 border-rose-200' }
      : { label: 'Bình thường', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
  };

  return (
    <>
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5 md:p-6 mb-4 hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Info Column */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">
                Mã lịch: <span className="text-slate-600">#{appointment.id.padStart(6, '0')}</span>
              </span>
              <div className={`px-3 py-1.5 rounded-full border text-[12.5px] font-bold flex items-center gap-1.5 ${config.color}`}>
                {config.icon}
                {config.label}
              </div>
            </div>

            <div className="flex gap-4">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${avatarGradient} flex items-center justify-center shrink-0 shadow-inner text-white font-black text-2xl overflow-hidden`}>
                {appointment.doctorImageUrl ? (
                  <img src={appointment.doctorImageUrl} onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden'); }} alt="Bác sĩ" className="w-full h-full object-cover" />
                ) : null}
                <span className={appointment.doctorImageUrl ? 'hidden' : ''}>{initial}</span>
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="font-black text-slate-800 text-[18px] leading-tight mb-1">
                  BS. {appointment.doctorName}
                </h3>
                <p className="text-primary-600 text-[14.5px] font-bold">{appointment.specialty}</p>
                {appointment.serviceName && appointment.serviceType !== 'EXAM' && (
                   <p className="text-slate-500 text-[13px] font-medium mt-0.5">{appointment.serviceName}</p>
                )}
              </div>
            </div>

            {/* Time & Date Row */}
            <div className="flex flex-wrap items-center gap-6 mt-5 pt-5 border-t border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
                  <CalendarDays className="w-4 h-4 text-slate-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Ngày khám</span>
                  <span className="text-[14.5px] font-bold text-slate-700">
                    {format(appointmentDate, 'dd/MM/yyyy')}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
                  <Clock3 className="w-4 h-4 text-slate-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Giờ khám</span>
                  <span className="text-[14.5px] font-bold text-slate-700">
                    {timeStart} - {timeEnd}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Column */}
          <div className="lg:w-[320px] shrink-0 bg-slate-50/80 rounded-2xl p-5 border border-slate-100 flex flex-col justify-between">
            <div className="mb-4">
              <p className="text-[13px] font-bold text-slate-600 leading-relaxed">
                {config.message}
              </p>
              {appointment.symptoms && appointment.symptoms !== 'Không có triệu chứng' && (
                <div className="mt-3">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Lý do khám / Triệu chứng</span>
                  <p className="text-[13px] font-medium text-slate-600 line-clamp-2">{appointment.symptoms}</p>
                </div>
              )}
              {status === 'NO_SHOW' && (
                <div className="mt-3 bg-red-50 p-2.5 rounded-xl border border-red-100 flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                  <p className="text-[12px] text-red-700 font-bold leading-snug">
                    Cảnh báo: Bạn đã vắng mặt. Nếu không đến khám quá 3 lần, tài khoản của bạn sẽ bị khoá tự động.
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mt-auto">
              {status === 'COMPLETED' && (
                <>
                  <button onClick={handleOpenPrescription} disabled={loadingModal} className="cursor-pointer flex-1 min-w-[120px] justify-center px-4 py-2.5 rounded-xl border border-transparent bg-emerald-500 font-bold text-white hover:bg-emerald-600 transition-colors flex items-center gap-2 text-[13px] shadow-sm shadow-emerald-200 disabled:opacity-50">
                    {loadingModal && !prescriptionData ? <Loader2 className="w-4 h-4 animate-spin" /> : <Pill className="w-4 h-4" />} Đơn thuốc
                  </button>
                  <button onClick={handleOpenLabResult} disabled={loadingModal} className="cursor-pointer flex-1 min-w-[120px] justify-center px-4 py-2.5 rounded-xl border border-transparent bg-blue-500 font-bold text-white hover:bg-blue-600 transition-colors flex items-center gap-2 text-[13px] shadow-sm shadow-blue-200 disabled:opacity-50">
                    {loadingModal && !labResultData ? <Loader2 className="w-4 h-4 animate-spin" /> : <FlaskConical className="w-4 h-4" />} Xét nghiệm
                  </button>
                  {!hasReviewed && (
                    <button onClick={() => setReviewModalOpen(true)} className="cursor-pointer flex-1 min-w-[120px] justify-center px-4 py-2.5 rounded-xl border border-yellow-500 bg-yellow-50 font-bold text-yellow-600 hover:bg-yellow-100 transition-colors flex items-center gap-2 text-[13px] shadow-sm">
                      <Star className="w-4 h-4 fill-yellow-500" /> Đánh giá
                    </button>
                  )}
                  {hasReviewed && (
                    <button disabled className="cursor-not-allowed flex-1 min-w-[120px] justify-center px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 font-bold text-slate-500 flex items-center gap-2 text-[13px]">
                      <Star className="w-4 h-4" /> Đã đánh giá
                    </button>
                  )}
                </>
              )}

              {status === 'CONFIRMED' && (
                <>
                  <button 
                    onClick={() => setCancelDialogOpen(true)}
                    className="cursor-pointer flex-1 min-w-[100px] justify-center px-4 py-2.5 rounded-xl border border-transparent bg-rose-100 font-bold text-rose-600 hover:bg-rose-200 transition-colors flex items-center gap-2 text-[13px]"
                  >
                    Hủy lịch
                  </button>
                </>
              )}

              {status === 'PENDING' && (
                <button 
                  onClick={() => setCancelDialogOpen(true)}
                  className="cursor-pointer w-full justify-center px-4 py-2.5 rounded-xl border border-transparent bg-rose-50 font-bold text-rose-600 hover:bg-rose-100 transition-colors flex items-center gap-2 text-[13px]"
                >
                  <XCircle className="w-4 h-4" /> Huỷ lịch hẹn
                </button>
              )}
              
              {(status === 'CHECKED_IN' || status === 'IN_PROGRESS' || status === 'WAITING_RESULT' || status === 'SKIPPED') && (
                <div className="w-full text-center px-4 py-2.5 rounded-xl bg-white border border-slate-200 shadow-sm text-slate-500 font-bold text-[13px]">
                   Vui lòng theo dõi thông báo tại phòng khám
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <CancelAppointmentDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        appointmentId={appointment.id}
        onSuccess={onCancelSuccess}
      />

      {/* Prescription Modal */}
      <Dialog open={!!prescriptionData} onOpenChange={(open) => !open && setPrescriptionData(null)}>
        {prescriptionData && <PrescriptionModalContent prescription={prescriptionData} />}
      </Dialog>

      {/* Lab Result Modal */}
      <Dialog open={!!labResultData} onOpenChange={(open) => !open && setLabResultData(null)}>
        {labResultData && <LabResultModalContent result={labResultData} />}
      </Dialog>
      <Dialog open={reviewModalOpen} onOpenChange={setReviewModalOpen}>
        <ReviewModal appointment={appointment} onSuccess={() => { setReviewModalOpen(false); setHasReviewed(true); }} />
      </Dialog>
    </>
  );
};

const getAvatarColor = (name: string) => {
  const colors = [
    'from-indigo-500 to-purple-500',
    'from-emerald-500 to-teal-500',
    'from-amber-500 to-orange-500',
    'from-rose-500 to-pink-500',
    'from-blue-500 to-cyan-500',
  ];
  let hash = 0;
  if (!name) return colors[0];
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};
