import React, { useState, useEffect } from 'react';
import { History, Pill, ChevronLeft, Receipt, Loader2 } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import PatientHistoryTimeline from '@/features/patients/components/PatientHistoryTimeline';
import { medicalApi } from '../api/medicalApi';
import { MedicalRecordDetail as RecordDetailType } from '../types/medical';

export default function MedicalRecordDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'timeline' | 'medications' | 'billing'>('timeline');
  const [record, setRecord] = useState<RecordDetailType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      setLoading(true);
      const data = await medicalApi.getRecordDetail(Number(id));
      setRecord(data);
      setLoading(false);
    };
    fetchDetail();
  }, [id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-6rem)]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!record) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-6rem)] text-slate-500">
        Không tìm thấy hồ sơ bệnh án
      </div>
    );
  }

  const recordHistory = [{ 
    recordId: Number(id), 
    date: new Date(record.createdAt).toISOString().split('T')[0], 
    doctor: record.doctorName, 
    diagnosis: record.diagnosis || 'Chưa chẩn đoán', 
    treatment: record.treatment || 'Chưa điều trị' 
  }];

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] animate-in fade-in duration-500">
      <div className="max-w-5xl mx-auto w-full flex flex-col h-full space-y-6">
        <div className="flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <ChevronLeft size={24} className="cursor-pointer text-slate-400 hover:text-slate-600 transition-colors" onClick={() => navigate(-1)} />
            <div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">Chi tiết hồ sơ bệnh án</h1>
              <p className="text-sm text-slate-500 mt-0.5">Xem thông tin chi tiết của <span className="font-medium text-slate-700">#REC-{id}</span></p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="flex border-b border-slate-100 px-5 pt-1 bg-slate-50 shrink-0">
            <button
              onClick={() => setActiveTab('timeline')}
              className={`cursor-pointer flex items-center gap-2 px-5 py-3 font-semibold text-sm transition-all border-b-2 ${
                activeTab === 'timeline'
                  ? 'border-blue-600 text-blue-600 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <History size={16} /> Ghi chú
            </button>
            <button
              onClick={() => setActiveTab('medications')}
              className={`cursor-pointer flex items-center gap-2 px-5 py-3 font-semibold text-sm transition-all border-b-2 ${
                activeTab === 'medications'
                  ? 'border-blue-600 text-blue-600 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <Pill size={16} /> Đơn thuốc
            </button>
            <button
              onClick={() => setActiveTab('billing')}
              className={`cursor-pointer flex items-center gap-2 px-5 py-3 font-semibold text-sm transition-all border-b-2 ${
                activeTab === 'billing'
                  ? 'border-blue-600 text-blue-600 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <Receipt size={16} /> Hóa đơn chi phí
            </button>
          </div>

          <div className="p-5 flex-1 overflow-y-auto bg-slate-50/30">
            {activeTab === 'timeline' && <PatientHistoryTimeline visits={recordHistory} />}
            {activeTab === 'medications' && (
              <div className="text-center text-slate-500 py-10 font-medium">Danh sách đơn thuốc sẽ hiển thị tại đây.</div>
            )}
            {activeTab === 'billing' && (
              <div className="max-w-2xl mx-auto mt-4">
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                    <Receipt className="text-blue-500" />
                    Chi tiết thanh toán
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Phí khám bệnh (Bác sĩ {record.doctorName})</span>
                      <span className="font-semibold text-slate-800">
                        {record.consultationFee ? formatPrice(record.consultationFee) : '0 ₫'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Phí dịch vụ cận lâm sàng</span>
                      <span className="font-semibold text-slate-800">
                        {record.serviceFee ? formatPrice(record.serviceFee) : '0 ₫'}
                      </span>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-200 border-dashed flex justify-between items-center">
                      <span className="font-bold text-slate-800 text-lg">Tổng hóa đơn</span>
                      <span className="font-bold text-blue-600 text-xl">
                        {formatPrice((record.consultationFee || 0) + (record.serviceFee || 0))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}