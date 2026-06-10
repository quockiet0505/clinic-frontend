import React, { useState } from 'react';
import { Pill, Search, Filter } from 'lucide-react';
import { SearchInput } from '@/components/common/SearchInput';
import { SectionContainer } from '@/components/common';
import { MedicineCard } from '../components/MedicineCard';

export const Prescriptions: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const data = await import('../api/recordApi').then(m => m.recordApi.getPrescriptions());
        setPrescriptions(data);
      } catch (error) {
        console.error('Failed to fetch prescriptions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPrescriptions();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;
  }

  const filteredPrescriptions = prescriptions.filter((p: any) => 
    p.items?.some((item: any) => item.medicineName?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <SectionContainer className="max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-800 mb-2">Đơn Thuốc Của Tôi</h1>
            <p className="text-[14.5px] text-slate-500 font-medium">
              Quản lý và xem lại chi tiết các đơn thuốc được bác sĩ kê.
            </p>
          </div>
            <div className="w-full md:w-80">
              <SearchInput
                value={searchQuery}
                onSearch={setSearchQuery}
                placeholder="Tìm thuốc, chẩn đoán..."
                className="h-11"
              />
            </div>
        </div>

        {filteredPrescriptions.length > 0 ? (
          <div className="flex flex-col gap-8">
            {filteredPrescriptions.map((prescription: any) => (
              <div key={prescription.prescriptionId} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-800 mb-1">Mã Bệnh Án: #{prescription.recordId}</h2>
                    <p className="text-sm font-medium text-slate-500">
                      Kê đơn lúc <span className="text-slate-700 font-semibold">{new Date(prescription.createdAt).toLocaleTimeString('vi-VN')}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center px-3 py-1.5 rounded-xl bg-blue-50 text-blue-600 text-sm font-bold mb-1">
                      {new Date(prescription.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                    <p className="text-[13px] text-slate-400 font-medium">Mã ĐT: #{String(prescription.prescriptionId).padStart(5, '0')}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {prescription.items?.map((med: any, idx: number) => (
                    <MedicineCard 
                      key={idx} 
                      name={med.medicineName} 
                      dosage={med.dosage} 
                      frequency={`Số lượng: ${med.quantity} ${med.unit}`} 
                      duration="" 
                      type="Medicine" 
                      instructions={""} 
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200 shadow-sm p-12 text-center flex flex-col items-center justify-center bg-white mt-8">
            <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mb-4">
              <Pill className="w-10 h-10 text-primary-500" />
            </div>
            <h2 className="text-xl font-black text-slate-800 mb-2">Chưa có đơn thuốc nào</h2>
            <p className="text-slate-500 text-[15px] font-medium max-w-md">
              Bạn chưa có đơn thuốc nào được kê hoặc không có đơn thuốc nào khớp với bộ lọc.
            </p>
          </div>
        )}
      </SectionContainer>
    </main>
  );
};
