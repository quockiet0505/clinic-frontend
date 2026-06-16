import React, { useState, useEffect } from 'react';
import { pharmacyApi } from '../api/pharmacyApi';
import { PrescriptionUI } from '../types/pharmacy';
import PrescriptionFilterBar from '../components/PrescriptionFilterBar';
import PrescriptionTable from '../components/PrescriptionTable';
import PrescriptionDetail from './PrescriptionDetail'; // Import component chi tiết lồng nhau

export default function PrescriptionDispense() {
  const [prescriptions, setPrescriptions] = useState<PrescriptionUI[]>([]);
  const [loading, setLoading] = useState(true);
  
  // CÔNG TẮC CHÍNH: Quản lý ID đơn thuốc đang được chọn xem chi tiết
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const fetchPrescriptions = async () => {
    setLoading(true);
    try {
      const data = await pharmacyApi.getPrescriptions();
      setPrescriptions(data);
    } catch (error) {
      console.error("Lỗi lấy đơn thuốc:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  // LUỒNG XỬ LÝ 1: Nếu selectedId KHÁC NULL -> Ẩn bảng, hiển thị ngay vùng Chi tiết tổng hợp
  if (selectedId !== null) {
    return (
      <PrescriptionDetail 
        prescriptionId={selectedId} 
        onBack={() => setSelectedId(null)} // Bấm quay lại thì reset state về null để hiện lại bảng
        onDispensed={fetchPrescriptions}   // Phát thuốc thành công thì gọi trang cha load lại danh sách mới
      />
    );
  }

  // LUỒNG XỬ LÝ 2: Nếu selectedId LÀ NULL -> Hiển thị bảng danh sách đơn thuốc như bình thường
  const filteredData = prescriptions.filter(rx => {
    const matchSearch = rx.patientName.toLowerCase().includes(search.toLowerCase()) || rx.prescriptionId.toString().includes(search);
    const matchStatus = statusFilter === 'ALL' || rx.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col gap-4 animate-in fade-in duration-500">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Quản lý Đơn Thuốc</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Kiểm tra và phát thuốc cho bệnh nhân</p>
        </div>
      </div>

      <PrescriptionFilterBar
        search={search} setSearch={setSearch}
        statusFilter={statusFilter} setStatusFilter={setStatusFilter}
        fromDate={fromDate} toDate={toDate}
        setFromDate={setFromDate} setToDate={setToDate}
      />

      <div className="flex-1 min-h-0">
        {loading ? (
          <div className="flex justify-center items-center h-full bg-white rounded-2xl border border-slate-200">
            <span className="text-slate-400 font-medium">Đang tải dữ liệu...</span>
          </div>
        ) : (
          <PrescriptionTable 
            data={filteredData} 
            // FIX TẬN GỐC: Thay vì navigate chuyển trang, mình set thẳng ID vào state để lột xác giao diện tại chỗ
            onViewDetails={(id) => setSelectedId(Number(id))} 
          />
        )}
      </div>
    </div>
  );
}