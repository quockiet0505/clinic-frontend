import React, { useState } from 'react';
import { Activity, Download, Eye, FileText, FlaskConical } from 'lucide-react';
import { SectionContainer } from '@/components/common';
import { Card } from '@/components/ui/card';

export const LabResults: React.FC = () => {
  const mockResults = [
    {
      id: 'LR001',
      date: '2023-10-24',
      type: 'Xét nghiệm máu tổng quát',
      doctor: 'Dr. Nguyễn Văn A',
      status: 'Hoàn thành',
      metrics: [
        { name: 'Hồng cầu (RBC)', value: '4.5', unit: 'T/L', range: '4.0 - 5.8', status: 'normal' },
        { name: 'Bạch cầu (WBC)', value: '11.2', unit: 'G/L', range: '4.0 - 10.0', status: 'high' },
        { name: 'Đường huyết (Glucose)', value: '5.2', unit: 'mmol/L', range: '3.9 - 6.4', status: 'normal' },
      ]
    },
    {
      id: 'LR002',
      date: '2023-08-15',
      type: 'Sinh hóa máu',
      doctor: 'Dr. Trần Thị B',
      status: 'Hoàn thành',
      metrics: [
        { name: 'Cholesterol', value: '6.1', unit: 'mmol/L', range: '< 5.2', status: 'high' },
        { name: 'Triglyceride', value: '1.8', unit: 'mmol/L', range: '< 1.7', status: 'high' },
      ]
    }
  ];

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <SectionContainer className="max-w-5xl">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-slate-800 mb-2">Kết Quả Xét Nghiệm & CLS</h1>
          <p className="text-[14.5px] text-slate-500 font-medium">
            Xem chi tiết các chỉ số sinh hóa và kết quả chẩn đoán hình ảnh.
          </p>
        </div>

        <div className="grid gap-6">
          {mockResults.map((result) => (
            <Card key={result.id} className="overflow-hidden border-0 shadow-sm rounded-3xl bg-white">
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                      <FlaskConical className="w-7 h-7" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-800">{result.type}</h2>
                      <p className="text-sm text-slate-500 font-medium">Thực hiện: {new Date(result.date).toLocaleDateString('vi-VN')} • {result.doctor}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-medium text-sm hover:bg-slate-200 transition-colors">
                      <Eye className="w-4 h-4" /> Chi tiết
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-50 text-primary-600 font-medium text-sm hover:bg-primary-100 transition-colors">
                      <Download className="w-4 h-4" /> Tải PDF
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-1 border border-slate-100">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-100/50 rounded-t-xl">
                      <tr>
                        <th className="px-6 py-4 font-bold rounded-tl-xl">Chỉ số</th>
                        <th className="px-6 py-4 font-bold">Kết quả</th>
                        <th className="px-6 py-4 font-bold">Tham chiếu</th>
                        <th className="px-6 py-4 font-bold rounded-tr-xl">Đánh giá</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.metrics.map((metric, idx) => (
                        <tr key={idx} className="border-b border-slate-100 last:border-0 bg-white hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-semibold text-slate-700">{metric.name}</td>
                          <td className="px-6 py-4">
                            <span className={`font-bold text-[15px] ${metric.status === 'high' ? 'text-rose-600' : 'text-emerald-600'}`}>
                              {metric.value}
                            </span>
                            <span className="text-slate-400 ml-1 text-[13px]">{metric.unit}</span>
                          </td>
                          <td className="px-6 py-4 text-slate-500 font-medium">{metric.range}</td>
                          <td className="px-6 py-4">
                            {metric.status === 'normal' ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-bold">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Bình thường
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-600 text-xs font-bold">
                                <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div> Bất thường
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </SectionContainer>
    </main>
  );
};
