import React, { useState } from 'react';
import { Pill, Search, Filter } from 'lucide-react';
import { SectionContainer } from '@/components/common';
import { MedicineCard } from '../components/MedicineCard';

export const Prescriptions: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for UI demonstration
  const mockPrescriptions = [
    {
      id: '1',
      date: '2023-10-24',
      doctor: 'Dr. Nguyễn Văn A',
      diagnosis: 'Viêm họng hạt',
      medicines: [
        { name: 'Amoxicillin', dosage: '500mg', frequency: '2 viên/ngày (Sáng, Tối)', duration: '5 ngày', type: 'Capsule', instructions: 'Uống sau khi ăn no' },
        { name: 'Paracetamol', dosage: '500mg', frequency: 'Khi sốt > 38.5 độ', duration: 'Theo triệu chứng', type: 'Tablet', instructions: 'Cách nhau ít nhất 4-6 tiếng' },
      ]
    },
    {
      id: '2',
      date: '2023-09-10',
      doctor: 'Dr. Trần Thị B',
      diagnosis: 'Rối loạn tiêu hóa',
      medicines: [
        { name: 'Smecta', dosage: '1 gói', frequency: '3 gói/ngày', duration: '3 ngày', type: 'Powder', instructions: 'Pha với nước sôi để nguội' },
        { name: 'Oresol', dosage: '1 gói', frequency: 'Uống thay nước', duration: '2 ngày', type: 'Powder', instructions: 'Pha đúng 200ml nước/gói' },
      ]
    }
  ];

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
          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Tìm thuốc, chẩn đoán..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-full border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-sm"
              />
            </div>
            <button className="h-11 px-4 rounded-full border border-slate-200 bg-white text-slate-600 font-medium text-sm flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm">
              <Filter className="w-4 h-4" />
              Lọc
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          {mockPrescriptions.map((prescription) => (
            <div key={prescription.id} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-800 mb-1">{prescription.diagnosis}</h2>
                  <p className="text-sm font-medium text-slate-500">
                    Kê bởi <span className="text-slate-700 font-semibold">{prescription.doctor}</span>
                  </p>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center px-3 py-1.5 rounded-xl bg-blue-50 text-blue-600 text-sm font-bold mb-1">
                    {new Date(prescription.date).toLocaleDateString('vi-VN')}
                  </div>
                  <p className="text-[13px] text-slate-400 font-medium">Mã ĐT: #{prescription.id.padStart(5, '0')}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {prescription.medicines.map((med, idx) => (
                  <MedicineCard key={idx} {...med} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </SectionContainer>
    </main>
  );
};
