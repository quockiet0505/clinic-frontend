// src/features/records/api/recordApi.ts
import type { MedicalRecord } from '../types/record';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const recordApi = {
  getMedicalHistory: async (): Promise<MedicalRecord[]> => {
    await delay(1000); // Simulate network latency

    return [
      {
        id: 'REC-2026-001',
        visitDate: '2026-05-10',
        doctorName: 'BS CKII. Ngô Trung Nam',
        specialty: 'Nội Tim Mạch',
        facility: 'Phòng khám Đa khoa ClinicPro',
        symptoms: 'Tức ngực, khó thở khi leo cầu thang',
        diagnosis: 'Thiếu máu cơ tim cục bộ nhẹ / Rối loạn lipid máu',
        notes: 'Kiêng ăn mỡ động vật, tập thể dục nhẹ nhàng 30p mỗi ngày.',
        prescriptions: [
          { id: 'P1', medicineName: 'Atorvastatin 20mg', dosage: '1 viên/ngày', quantity: '30 viên', instructions: 'Uống buổi tối sau ăn' },
          { id: 'P2', medicineName: 'Aspirin 81mg', dosage: '1 viên/ngày', quantity: '30 viên', instructions: 'Uống sau ăn sáng' }
        ],
        labResults: [
          { id: 'L1', testName: 'Cholesterol toàn phần', resultValue: '6.2 mmol/L', normalRange: '< 5.2', status: 'ABNORMAL' },
          { id: 'L2', testName: 'Triglyceride', resultValue: '2.5 mmol/L', normalRange: '< 1.7', status: 'ABNORMAL' },
          { id: 'L3', testName: 'Điện tâm đồ (ECG)', resultValue: 'Nhịp xoang đều, ST chênh xuống nhẹ', normalRange: 'Bình thường', status: 'NORMAL' }
        ]
      },
      {
        id: 'REC-2025-089',
        visitDate: '2025-11-20',
        doctorName: 'BS. Trần Thị Mây',
        specialty: 'Nội Tổng Quát',
        facility: 'Phòng khám Đa khoa ClinicPro',
        symptoms: 'Sốt cao, ho nhiều có đờm xanh, đau họng',
        diagnosis: 'Viêm phế quản cấp',
        prescriptions: [
          { id: 'P3', medicineName: 'Augmentin 1g', dosage: '2 viên/ngày', quantity: '14 viên', instructions: 'Sáng 1 viên, tối 1 viên sau ăn' },
          { id: 'P4', medicineName: 'Alpha Choay', dosage: '4 viên/ngày', quantity: '20 viên', instructions: 'Ngậm dưới lưỡi, chia 2 lần' },
          { id: 'P5', medicineName: 'Paracetamol 500mg', dosage: '1 viên/lần', quantity: '10 viên', instructions: 'Uống khi sốt > 38.5 độ' }
        ]
      }
    ];
  }
};