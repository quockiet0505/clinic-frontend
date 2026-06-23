import React, { useState, useEffect } from 'react';
import { ChevronLeft, Printer, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { pharmacyApi } from '../api/pharmacyApi';
import toast from 'react-hot-toast';

interface Props {
  prescriptionId: number;
  onBack: () => void;
  onDispensed: () => void;
}

export default function PrescriptionDetail({ prescriptionId, onBack, onDispensed }: Props) {
  const [prescription, setPrescription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dispensing, setDispensing] = useState(false);

  const fetchDetail = () => {
    setLoading(true);
    pharmacyApi.getPrescriptionById(prescriptionId)
      .then((data) => { 
        setPrescription(data); 
        setLoading(false); 
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    if (prescriptionId) fetchDetail();
  }, [prescriptionId]);

  const handlePrint = () => window.print();

  const handleDispense = async () => {
    setDispensing(true);
    try {
      await pharmacyApi.dispensePrescription(prescriptionId);
      toast.success('Phát thuốc thành công');
      fetchDetail();
      onDispensed();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi phát thuốc');
    } finally {
      setDispensing(false);
    }
  };

  if (loading) return <div className="p-8 text-slate-500 font-medium text-center bg-white rounded-2xl border border-slate-200">Đang tải chi tiết đơn thuốc...</div>;
  if (!prescription) return <div className="p-8 text-rose-500 font-medium text-center bg-white rounded-2xl border border-rose-200">Không tìm thấy đơn thuốc.</div>;

  const totalFee = (prescription.consultationFee || 0) + (prescription.serviceFee || 0);

  // Style định dạng chung cho các tiêu đề mục lớn I, II, III
  const headingClass = "text-sm font-bold uppercase tracking-wide text-slate-800 border-b border-slate-200 pb-2 mt-6 mb-4 first:mt-0";

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col print:block print:h-auto">

      {/* HEADER WEB BAR */}
      <div className="flex items-center justify-between shrink-0 print:hidden">
        <div className="flex items-center gap-3">
          <ChevronLeft
            size={28}
            className="cursor-pointer text-slate-400 hover:text-slate-600 transition-colors"
            onClick={onBack}
          />
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Chi tiết Đơn thuốc
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Đang xem đơn thuốc
              <span className="font-semibold text-slate-700"> #RX-{prescription.prescriptionId}</span>
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handlePrint}
            variant="outline"
            className="h-9 px-4 rounded-xl text-xs font-medium border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <Printer size={14} className="mr-1.5" />
            In đơn
          </Button>

          {prescription.status === 'PENDING' && (
            <Button
              onClick={handleDispense}
              disabled={dispensing}
              className="h-9 px-4 rounded-xl text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            >
              <CheckCircle2 size={14} className="mr-1.5" />
              {dispensing ? 'Đang xử lý...' : 'Phát thuốc'}
            </Button>
          )}
        </div>
      </div>

      {/* TỜ ĐƠN THUỐC ĐỒNG NHẤT KHỐI NỘI DUNG */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex-1 overflow-y-auto custom-scrollbar print:border-0 print:shadow-none print:rounded-none">
        <div className="max-w-3xl mx-auto p-8 print:p-0 space-y-6">

          {/* TIÊU ĐỀ CHÍNH TRÊN CÙNG */}
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-800 uppercase">
              ĐƠN THUỐC VÀ CHI PHÍ LÂM SÀNG
            </h2>
            <div className="mt-2">
              {prescription.status === 'PENDING' ? (
                <span className="bg-amber-50 text-amber-600 px-3 py-0.5 rounded-full text-xs font-semibold border border-amber-200 print:hidden">
                  Chờ phát thuốc
                </span>
              ) : (
                <span className="bg-emerald-50 text-emerald-600 px-3 py-0.5 rounded-full text-xs font-semibold border border-emerald-200 print:hidden">
                  Đã phát thuốc
                </span>
              )}
            </div>
          </div>

          {/* CHẠY MẠCH NỘI DUNG TUẦN TỰ TRÊN MỘT MẶT PHẲNG NỀN TRẮNG */}
          <div className="text-sm space-y-6 text-slate-700">
            
            {/* MỤC I: HÀNH CHÍNH & THÔNG TIN BỆNH NHÂN */}
            <div>
              <h3 className={headingClass}>I. Thông tin bệnh nhân & Sinh hiệu</h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-3 pl-2">
                <div>
                  <span className="text-slate-400 font-medium">Mã đơn thuốc:</span>
                  <span className="ml-2 font-semibold text-slate-800">RX-{prescription.prescriptionId}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Ngày sinh:</span>
                  <span className="ml-2 font-semibold text-slate-800">{prescription.dateOfBirth || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Họ và tên:</span>
                  <span className="ml-2 font-bold text-slate-900">{prescription.patientName || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Giới tính:</span>
                  <span className="ml-2 font-semibold text-slate-800">
                    {prescription.gender === 'MALE' ? 'Nam' : prescription.gender === 'FEMALE' ? 'Nữ' : 'Khác'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Số điện thoại:</span>
                  <span className="ml-2 font-semibold text-slate-800">{prescription.phone || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Địa chỉ cư trú:</span>
                  <span className="ml-2 font-semibold text-slate-800">{prescription.address || '—'}</span>
                </div>

                {/* Các chỉ số sinh hiệu nối tiếp dòng */}
                <div className="col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-slate-100 mt-2">
                  <div>
                    <span className="text-slate-400 text-xs block">Chiều cao:</span>
                    <span className="font-semibold text-slate-800">{prescription.height ? `${prescription.height} cm` : '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs block">Cân nặng:</span>
                    <span className="font-semibold text-slate-800">{prescription.weight ? `${prescription.weight} kg` : '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs block">Huyết áp:</span>
                    <span className="font-semibold text-slate-800">{prescription.bloodPressure || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs block">Mạch đập:</span>
                    <span className="font-semibold text-slate-800">{prescription.pulse ? `${prescription.pulse} lần/phút` : '—'}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 text-xs block">Tình trạng dị ứng:</span>
                    <span className="font-semibold text-rose-600">{prescription.allergies || 'Không ghi nhận'}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 text-xs block">Tiền sử bệnh lý:</span>
                    <span className="font-semibold text-slate-800">{prescription.medicalHistory || 'Không ghi nhận'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* MỤC II: CHẨN ĐOÁN LÂM SÀNG & BÁC SĨ CHỈ ĐỊNH */}
            <div>
              <h3 className={headingClass}>II. Chẩn đoán điều trị</h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-3 pl-2">
                <div className="col-span-2">
                  <span className="text-slate-400 font-medium">Bác sĩ chỉ định khám:</span>
                  <span className="ml-2 font-bold text-slate-800">BS. {prescription.doctorName || '—'}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 font-medium">Chẩn đoán bệnh lý:</span>
                  <span className="ml-2 font-medium text-slate-800">{prescription.diagnosis || 'Chưa cập nhật'}</span>
                </div>
              </div>
            </div>

            {/* MỤC III: CHỈ ĐỊNH CẬN LÂM SÀNG & KẾT QUẢ XÉT NGHIỆM */}
            <div>
              <h3 className={headingClass}>III. Chỉ định Cận lâm sàng & Kết quả</h3>
              <div className="space-y-4 pl-2">
                {prescription.serviceOrders && prescription.serviceOrders.length > 0 ? (
                  prescription.serviceOrders.map((order: any, idx: number) => (
                    <div key={idx} className="border-b border-slate-100 last:border-b-0 pb-3 last:pb-0 space-y-1">
                      <div className="flex justify-between font-semibold text-sm text-slate-800">
                        <div className="flex flex-col">
                          <span>{idx + 1}. {order.serviceName}</span>
                          <span className="text-xs font-bold text-slate-600 mt-1">
                            {order.price != null ? `${order.price.toLocaleString('vi-VN')} ₫` : 'Miễn phí'}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 font-normal">
                          Trạng thái: {order.status === 'DONE' ? 'Đã có kết quả' : 'Chờ thực hiện'}
                        </span>
                      </div>
                      {order.status === 'DONE' && (
                        <div className="pl-4 text-xs space-y-1 text-slate-600 mt-1">
                          <p><strong>Số liệu kết quả:</strong> {order.resultData || '—'}</p>
                          <p className="text-slate-800 font-medium"><strong>Kết luận chuyên môn:</strong> {order.conclusion || '—'}</p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 italic text-xs">Không có chỉ định cận lâm sàng nào.</p>
                )}
              </div>
            </div>

            {/* MỤC IV: TOA THUỐC CHI TIẾT */}
            <div>
              <h3 className={headingClass}>IV. Toa thuốc chỉ định</h3>
              <div className="space-y-1 pl-2">
                {prescription.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">
                        {idx + 1}. {item.medicineName || item.name}
                      </p>
                      <p className="text-xs text-slate-500 italic mt-1">
                        Cách dùng: {item.dosage || 'Theo hướng dẫn'}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-semibold text-slate-700 text-sm">
                        x{item.quantity || item.qty}
                      </p>
                      <p className="text-xs text-slate-400 font-medium">
                        {item.unit || 'Viên'}
                      </p>
                    </div>
                  </div>
                ))}

                {(!prescription.items || prescription.items.length === 0) && (
                  <p className="text-slate-400 italic py-2 text-xs">
                    Không có chỉ định sử dụng thuốc trong đơn này.
                  </p>
                )}
              </div>
            </div>

            {/* MỤC V: TỔNG HỢP CHI PHÍ */}
            <div>
              <h3 className={headingClass}>V. Chi phí thanh toán lâm sàng</h3>
              <div className="max-w-md ml-auto space-y-2 pt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Phí khám bệnh lâm sàng:</span>
                  <span className="font-semibold text-slate-700">
                    {(prescription.consultationFee || 0).toLocaleString('vi-VN')} VNĐ
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Phí dịch vụ kỹ thuật (Cận lâm sàng):</span>
                  <span className="font-semibold text-slate-700">
                    {(prescription.serviceFee || 0).toLocaleString('vi-VN')} VNĐ
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 mt-2 border-t border-slate-300">
                  <span className="font-bold text-slate-800">Tổng thanh toán:</span>
                  <span className="font-bold text-lg text-blue-600">
                    {totalFee.toLocaleString('vi-VN')} VNĐ
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* CHỮ KÝ XÁC NHẬN CỦA BÁC SĨ */}
          <div className="pt-8 flex justify-end">
            <div className="text-center text-sm">
              <p className="text-slate-400 italic mb-1">
                Ngày ..... tháng ..... năm 20...
              </p>
              <p className="font-bold text-slate-700 uppercase tracking-wide text-xs">
                Bác sĩ chỉ định chuyên khoa
              </p>
              <div className="h-24" />
              <p className="font-semibold text-slate-800">
                BS. {prescription.doctorName || '—'}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}