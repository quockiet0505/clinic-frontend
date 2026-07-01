import ExcelJS from 'exceljs';
import { DashboardStats, RevenueStatsSummary, ReportFilter } from '../features/dashboard/types/dashboard';

export async function exportDashboardToExcel(
  filter: ReportFilter,
  stats: DashboardStats,
  revenue: RevenueStatsSummary,
  doctors: any[] = [],
  services: any[] = [],
  patients: any = null
) {
  const periodLabel = filter.period === 'month' ? `Tháng ${filter.month}/${filter.year}` : `Quý ${filter.quarter}/${filter.year}`;
  const filename = `BaoCao_${filter.type}_${filter.period === 'month' ? `T${filter.month}` : `Q${filter.quarter}`}_${filter.year}.xlsx`;
  const today = new Date();
  const dateStr = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Báo cáo thống kê', {
    pageSetup: { paperSize: 9, orientation: 'portrait' } // A4
  });

  // Cài đặt độ rộng cột
  sheet.columns = [
    { width: 5 },  // A (STT hoặc lề)
    { width: 35 }, // B (Tên / Hạng mục)
    { width: 15 }, // C (Số liệu 1)
    { width: 30 }, // D (Số liệu 2)
    { width: 20 }, // E (Số liệu 3 / Doanh thu)
    { width: 15 }, // F (Số liệu 4)
  ];

  const borderAll = {
    top: { style: 'thin' as const },
    left: { style: 'thin' as const },
    bottom: { style: 'thin' as const },
    right: { style: 'thin' as const }
  };

  const highlightFill = { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: 'FFFFFBEB' } }; // Vàng nhạt cho highlight
  const headerFill = { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: 'FFEFF6FF' } }; // Xanh dương nhạt
  const headerFillGreen = { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: 'FFF0FDF4' } }; // Xanh lá nhạt

  // HEADER
  sheet.mergeCells('B1:F1');
  sheet.getCell('B1').value = 'PHÒNG KHÁM ĐA KHOA CLINIQA';
  sheet.getCell('B1').font = { bold: true, size: 14, color: { argb: 'FF0284C7' } };

  sheet.mergeCells('B2:F2');
  sheet.getCell('B2').value = '71-73 Ngô Thời Nhiệm, Phường Võ Thị Sáu, Quận 3, TP.HCM';

  sheet.mergeCells('B3:F3');
  sheet.getCell('B3').value = 'Hotline: 1900 2115  |  Email: contact@cliniqa.vn';

  sheet.addRow([]);

  // TITLE
  sheet.mergeCells('B5:F5');
  const title = sheet.getCell('B5');
  title.value = 'BÁO CÁO THỐNG KÊ HOẠT ĐỘNG';
  title.font = { bold: true, size: 16 };
  title.alignment = { horizontal: 'center' };

  sheet.mergeCells('B6:F6');
  const subtitle1 = sheet.getCell('B6');
  subtitle1.value = `Kỳ báo cáo: ${periodLabel}`;
  subtitle1.alignment = { horizontal: 'center' };

  sheet.mergeCells('B7:F7');
  const subtitle2 = sheet.getCell('B7');
  subtitle2.value = `Ngày lập: ${dateStr}`;
  subtitle2.alignment = { horizontal: 'center' };
  subtitle2.font = { italic: true };

  sheet.addRow([]);
  let currentRow = 9;

  // I. TỔNG QUAN
  if (filter.type === 'all' || filter.type === 'overview') {
    sheet.mergeCells(`B${currentRow}:F${currentRow}`);
    sheet.getCell(`B${currentRow}`).value = 'I. TỔNG QUAN HOẠT ĐỘNG';
    sheet.getCell(`B${currentRow}`).font = { bold: true, size: 12 };
    currentRow++;

    // Highlight
    sheet.mergeCells(`B${currentRow}:F${currentRow}`);
    sheet.getCell(`B${currentRow}`).value = '1. Phân tích nổi bật';
    sheet.getCell(`B${currentRow}`).font = { bold: true };
    currentRow++;

    sheet.mergeCells(`B${currentRow}:F${currentRow}`);
    const rate = stats.totalAppointments > 0 ? ((stats.completedAppointments / stats.totalAppointments) * 100).toFixed(1) : 0;
    sheet.getCell(`B${currentRow}`).value = `  • Tỷ lệ hoàn thành lịch hẹn: ${rate}%`;
    sheet.getCell(`B${currentRow}`).fill = highlightFill;
    currentRow++;

    sheet.mergeCells(`B${currentRow}:F${currentRow}`);
    const dropRate = stats.totalAppointments > 0 ? (((stats.cancelledAppointments + stats.noShowAppointments) / stats.totalAppointments) * 100).toFixed(1) : 0;
    sheet.getCell(`B${currentRow}`).value = `  • Tỷ lệ hao hụt (Hủy/Bỏ khám): ${dropRate}%`;
    sheet.getCell(`B${currentRow}`).fill = highlightFill;
    currentRow++;

    // Data tables
    sheet.mergeCells(`B${currentRow}:C${currentRow}`);
    sheet.getCell(`B${currentRow}`).value = '2. Nhân sự & Bệnh nhân';
    sheet.getCell(`B${currentRow}`).font = { bold: true };
    sheet.mergeCells(`D${currentRow}:E${currentRow}`);
    sheet.getCell(`D${currentRow}`).value = '3. Tình hình lịch hẹn';
    sheet.getCell(`D${currentRow}`).font = { bold: true };
    currentRow++;

    const overviewData = [
      ['Tổng số bệnh nhân', stats.totalPatients, 'Tổng lịch khám', stats.totalAppointments],
      ['Tổng số nhân sự', stats.totalStaff, 'Đã hoàn thành', stats.completedAppointments],
      ['Số lượng bác sĩ', stats.totalDoctors, 'Đã hủy', stats.cancelledAppointments],
      ['Đánh giá trung bình', `${stats.avgRating.toFixed(1)} / 5.0`, 'Bỏ khám (No show)', stats.noShowAppointments],
      ['Lượt phản hồi', stats.totalFeedbacks, 'Chờ khám', stats.pendingAppointments],
    ];

    overviewData.forEach(row => {
      const r = sheet.getRow(currentRow);
      r.getCell(2).value = row[0]; r.getCell(2).border = borderAll;
      r.getCell(3).value = row[1]; r.getCell(3).border = borderAll; r.getCell(3).alignment = { horizontal: 'right' };
      r.getCell(4).value = row[2]; r.getCell(4).border = borderAll;
      r.getCell(5).value = row[3]; r.getCell(5).border = borderAll; r.getCell(5).alignment = { horizontal: 'right' };
      currentRow++;
    });
    sheet.addRow([]); currentRow++;
  }

  // II. DOANH THU
  if (filter.type === 'all' || filter.type === 'revenue') {
    const sec = filter.type === 'all' ? 'II' : 'I';
    sheet.mergeCells(`B${currentRow}:F${currentRow}`);
    sheet.getCell(`B${currentRow}`).value = `${sec}. BÁO CÁO DOANH THU`;
    sheet.getCell(`B${currentRow}`).font = { bold: true, size: 12 };
    currentRow++;

    // Highlight
    sheet.mergeCells(`B${currentRow}:F${currentRow}`);
    sheet.getCell(`B${currentRow}`).value = '1. Phân tích nổi bật';
    sheet.getCell(`B${currentRow}`).font = { bold: true };
    currentRow++;

    const mainSource = revenue.consultationRevenue! > revenue.serviceRevenue! ? 'Khám bệnh' : 'Dịch vụ Cận lâm sàng';
    const khPct = revenue.totalRevenue > 0 ? ((revenue.consultationRevenue! / revenue.totalRevenue) * 100).toFixed(1) : 0;
    const dvPct = revenue.totalRevenue > 0 ? ((revenue.serviceRevenue! / revenue.totalRevenue) * 100).toFixed(1) : 0;
    sheet.mergeCells(`B${currentRow}:F${currentRow}`);
    sheet.getCell(`B${currentRow}`).value = `  • Nguồn thu chính: ${mainSource} (Khám: ${khPct}%, Dịch vụ: ${dvPct}%)`;
    sheet.getCell(`B${currentRow}`).fill = highlightFill;
    currentRow++;

    const topSrv = [...(revenue.byService || [])].sort((a, b) => b.revenue - a.revenue)[0];
    sheet.mergeCells(`B${currentRow}:F${currentRow}`);
    sheet.getCell(`B${currentRow}`).value = `  • Dịch vụ đóng góp nhiều nhất: ${topSrv?.serviceName || 'N/A'} (${topSrv?.percentage?.toFixed(1) || 0}%)`;
    sheet.getCell(`B${currentRow}`).fill = highlightFill;
    currentRow++;

    // 2. Tổng hợp doanh thu
    sheet.mergeCells(`B${currentRow}:F${currentRow}`);
    sheet.getCell(`B${currentRow}`).value = '2. Tổng hợp doanh thu';
    sheet.getCell(`B${currentRow}`).font = { bold: true };
    currentRow++;

    sheet.mergeCells(`B${currentRow}:C${currentRow}`);
    sheet.getCell(`B${currentRow}`).value = 'Hạng mục doanh thu';
    sheet.getCell(`B${currentRow}`).font = { bold: true };
    sheet.getCell(`B${currentRow}`).fill = headerFill;
    sheet.getCell(`B${currentRow}`).border = borderAll;

    sheet.mergeCells(`D${currentRow}:E${currentRow}`);
    sheet.getCell(`D${currentRow}`).value = 'Số tiền (VNĐ)';
    sheet.getCell(`D${currentRow}`).font = { bold: true };
    sheet.getCell(`D${currentRow}`).fill = headerFill;
    sheet.getCell(`D${currentRow}`).border = borderAll;
    sheet.getCell(`D${currentRow}`).alignment = { horizontal: 'right' };
    currentRow++;

    const revData = [
      ['Doanh thu Khám bệnh', revenue.consultationRevenue],
      ['Doanh thu Dịch vụ (XN/CĐHA)', revenue.serviceRevenue],
      ['TỔNG DOANH THU KỲ BÁO CÁO', revenue.totalRevenue]
    ];

    revData.forEach((row, idx) => {
      sheet.mergeCells(`B${currentRow}:C${currentRow}`);
      sheet.getCell(`B${currentRow}`).value = row[0];
      sheet.getCell(`B${currentRow}`).border = borderAll;

      sheet.mergeCells(`D${currentRow}:E${currentRow}`);
      sheet.getCell(`D${currentRow}`).value = row[1];
      sheet.getCell(`D${currentRow}`).border = borderAll;
      sheet.getCell(`D${currentRow}`).alignment = { horizontal: 'right' };
      if (idx === 2) {
        sheet.getCell(`B${currentRow}`).font = { bold: true };
        sheet.getCell(`D${currentRow}`).font = { bold: true };
      }
      currentRow++;
    });
    sheet.addRow([]); currentRow++;

    // 3. Chi tiết dịch vụ
    sheet.mergeCells(`B${currentRow}:F${currentRow}`);
    sheet.getCell(`B${currentRow}`).value = '3. Chi tiết doanh thu theo dịch vụ';
    sheet.getCell(`B${currentRow}`).font = { bold: true };
    currentRow++;

    const headers = ['STT', 'Tên dịch vụ', 'Doanh thu (VNĐ)', 'Tỷ lệ (%)'];
    [2, 3, 4, 5].forEach((col, i) => {
      const cell = sheet.getCell(currentRow, col);
      cell.value = headers[i];
      cell.font = { bold: true };
      cell.fill = headerFillGreen;
      cell.border = borderAll;
      cell.alignment = { horizontal: i === 1 ? 'left' : 'center' };
    });
    currentRow++;

    if (revenue.byService && revenue.byService.length > 0) {
      revenue.byService.forEach((s, idx) => {
        const r = sheet.getRow(currentRow);
        r.getCell(2).value = idx + 1; r.getCell(2).border = borderAll; r.getCell(2).alignment = { horizontal: 'center' };
        r.getCell(3).value = s.serviceName; r.getCell(3).border = borderAll;
        r.getCell(4).value = s.revenue; r.getCell(4).border = borderAll; r.getCell(4).numFmt = '#,##0';
        r.getCell(5).value = s.percentage / 100; r.getCell(5).border = borderAll; r.getCell(5).numFmt = '0.0%';
        currentRow++;
      });
    } else {
      sheet.mergeCells(`B${currentRow}:E${currentRow}`);
      sheet.getCell(`B${currentRow}`).value = 'Không có dữ liệu';
      sheet.getCell(`B${currentRow}`).alignment = { horizontal: 'center' };
      sheet.getCell(`B${currentRow}`).border = borderAll;
      currentRow++;
    }
    sheet.addRow([]); currentRow++;
  }

  // III. BÁC SĨ
  if (filter.type === 'all' || filter.type === 'doctors') {
    const sec = filter.type === 'all' ? 'III' : 'I';
    sheet.mergeCells(`B${currentRow}:F${currentRow}`);
    sheet.getCell(`B${currentRow}`).value = `${sec}. THỐNG KÊ CHI TIẾT BÁC SĨ`;
    sheet.getCell(`B${currentRow}`).font = { bold: true, size: 12 };
    currentRow++;

    sheet.mergeCells(`B${currentRow}:F${currentRow}`);
    sheet.getCell(`B${currentRow}`).value = '1. Phân tích nổi bật';
    sheet.getCell(`B${currentRow}`).font = { bold: true };
    currentRow++;

    const topAppts = [...(doctors || [])].sort((a, b) => b.totalAppointments - a.totalAppointments)[0];
    sheet.mergeCells(`B${currentRow}:F${currentRow}`);
    sheet.getCell(`B${currentRow}`).value = `  • Bác sĩ khám nhiều nhất: ${topAppts ? `${topAppts.doctorName} (${topAppts.totalAppointments} lượt)` : 'Chưa có dữ liệu'}`;
    sheet.getCell(`B${currentRow}`).fill = highlightFill;
    currentRow++;

    const topRating = [...(doctors || [])].sort((a, b) => b.avgRating - a.avgRating)[0];
    sheet.mergeCells(`B${currentRow}:F${currentRow}`);
    sheet.getCell(`B${currentRow}`).value = `  • Bác sĩ đánh giá tốt nhất: ${topRating ? `${topRating.doctorName} (${topRating.avgRating.toFixed(1)} ⭐)` : 'Chưa có dữ liệu'}`;
    sheet.getCell(`B${currentRow}`).fill = highlightFill;
    currentRow++;

    const topRevDoctor = [...(doctors || [])].sort((a, b) => b.revenue - a.revenue)[0];
    sheet.mergeCells(`B${currentRow}:F${currentRow}`);
    sheet.getCell(`B${currentRow}`).value = `  • Bác sĩ doanh thu cao nhất: ${topRevDoctor ? `${topRevDoctor.doctorName} (${topRevDoctor.revenue.toLocaleString()} VNĐ)` : 'Chưa có dữ liệu'}`;
    sheet.getCell(`B${currentRow}`).fill = highlightFill;
    currentRow++;

    sheet.mergeCells(`B${currentRow}:F${currentRow}`);
    sheet.getCell(`B${currentRow}`).value = '2. Bảng kê chi tiết';
    sheet.getCell(`B${currentRow}`).font = { bold: true };
    currentRow++;

    const headers = ['STT', 'Tên Bác sĩ', 'Lượt khám', 'Tỷ lệ HT', 'Đánh giá', 'Doanh thu'];
    [2, 3, 4, 5, 6, 7].forEach((col, i) => { // Dùng cột G(7) cho Doanh thu
      const cell = sheet.getCell(currentRow, col);
      cell.value = headers[i];
      cell.font = { bold: true };
      cell.fill = headerFill;
      cell.border = borderAll;
      cell.alignment = { horizontal: 'center' };
    });
    currentRow++;

    if (doctors && doctors.length > 0) {
      doctors.forEach((d, idx) => {
        const r = sheet.getRow(currentRow);
        r.getCell(2).value = idx + 1; r.getCell(2).border = borderAll; r.getCell(2).alignment = { horizontal: 'center' };
        r.getCell(3).value = d.doctorName; r.getCell(3).border = borderAll;
        r.getCell(4).value = d.totalAppointments; r.getCell(4).border = borderAll; r.getCell(4).alignment = { horizontal: 'center' };
        r.getCell(5).value = d.completionRate / 100; r.getCell(5).border = borderAll; r.getCell(5).numFmt = '0.0%';
        r.getCell(6).value = `${d.avgRating.toFixed(1)} ⭐`; r.getCell(6).border = borderAll; r.getCell(6).alignment = { horizontal: 'center' };
        r.getCell(7).value = d.revenue; r.getCell(7).border = borderAll; r.getCell(7).numFmt = '#,##0';
        currentRow++;
      });
    } else {
      sheet.mergeCells(`B${currentRow}:G${currentRow}`);
      sheet.getCell(`B${currentRow}`).value = 'Không có dữ liệu';
      sheet.getCell(`B${currentRow}`).alignment = { horizontal: 'center' };
      sheet.getCell(`B${currentRow}`).border = borderAll;
      currentRow++;
    }
    sheet.addRow([]); currentRow++;
  }

  // IV. DỊCH VỤ
  if (filter.type === 'all' || filter.type === 'services') {
    const sec = filter.type === 'all' ? 'IV' : 'I';
    sheet.mergeCells(`B${currentRow}:F${currentRow}`);
    sheet.getCell(`B${currentRow}`).value = `${sec}. THỐNG KÊ CHI TIẾT DỊCH VỤ`;
    sheet.getCell(`B${currentRow}`).font = { bold: true, size: 12 };
    currentRow++;

    sheet.mergeCells(`B${currentRow}:F${currentRow}`);
    sheet.getCell(`B${currentRow}`).value = '1. Phân tích nổi bật';
    sheet.getCell(`B${currentRow}`).font = { bold: true };
    currentRow++;

    const topOrders = [...(services || [])].sort((a, b) => b.totalOrders - a.totalOrders)[0];
    sheet.mergeCells(`B${currentRow}:F${currentRow}`);
    sheet.getCell(`B${currentRow}`).value = `  • Dịch vụ sử dụng nhiều nhất: ${topOrders ? `${topOrders.serviceName} (${topOrders.totalOrders} lượt)` : 'Chưa có dữ liệu'}`;
    sheet.getCell(`B${currentRow}`).fill = highlightFill;
    currentRow++;

    const topRevService = [...(services || [])].sort((a, b) => b.revenue - a.revenue)[0];
    sheet.mergeCells(`B${currentRow}:F${currentRow}`);
    sheet.getCell(`B${currentRow}`).value = `  • Dịch vụ doanh thu cao nhất: ${topRevService ? `${topRevService.serviceName} (${topRevService.revenue.toLocaleString()} VNĐ)` : 'Chưa có dữ liệu'}`;
    sheet.getCell(`B${currentRow}`).fill = highlightFill;
    currentRow++;

    sheet.mergeCells(`B${currentRow}:F${currentRow}`);
    sheet.getCell(`B${currentRow}`).value = '2. Bảng kê chi tiết';
    sheet.getCell(`B${currentRow}`).font = { bold: true };
    currentRow++;

    const headers = ['STT', 'Tên Dịch vụ', 'Lượt sử dụng', 'Đã hoàn thành', 'Doanh thu'];
    [2, 3, 4, 5, 6].forEach((col, i) => {
      const cell = sheet.getCell(currentRow, col);
      cell.value = headers[i];
      cell.font = { bold: true };
      cell.fill = headerFillGreen;
      cell.border = borderAll;
      cell.alignment = { horizontal: 'center' };
    });
    currentRow++;

    if (services && services.length > 0) {
      services.forEach((s, idx) => {
        const r = sheet.getRow(currentRow);
        r.getCell(2).value = idx + 1; r.getCell(2).border = borderAll; r.getCell(2).alignment = { horizontal: 'center' };
        r.getCell(3).value = s.serviceName; r.getCell(3).border = borderAll;
        r.getCell(4).value = s.totalOrders; r.getCell(4).border = borderAll; r.getCell(4).alignment = { horizontal: 'center' };
        r.getCell(5).value = s.completedOrders; r.getCell(5).border = borderAll; r.getCell(5).alignment = { horizontal: 'center' };
        r.getCell(6).value = s.revenue; r.getCell(6).border = borderAll; r.getCell(6).numFmt = '#,##0';
        currentRow++;
      });
    } else {
      sheet.mergeCells(`B${currentRow}:F${currentRow}`);
      sheet.getCell(`B${currentRow}`).value = 'Không có dữ liệu';
      sheet.getCell(`B${currentRow}`).alignment = { horizontal: 'center' };
      sheet.getCell(`B${currentRow}`).border = borderAll;
      currentRow++;
    }
    sheet.addRow([]); currentRow++;
  }

  // V. BỆNH NHÂN
  if (filter.type === 'all' || filter.type === 'patients') {
    const sec = filter.type === 'all' ? 'V' : 'I';
    sheet.mergeCells(`B${currentRow}:F${currentRow}`);
    sheet.getCell(`B${currentRow}`).value = `${sec}. THỐNG KÊ CHI TIẾT BỆNH NHÂN`;
    sheet.getCell(`B${currentRow}`).font = { bold: true, size: 12 };
    currentRow++;

    sheet.mergeCells(`B${currentRow}:F${currentRow}`);
    sheet.getCell(`B${currentRow}`).value = '1. Phân tích nổi bật';
    sheet.getCell(`B${currentRow}`).font = { bold: true };
    currentRow++;

    sheet.mergeCells(`B${currentRow}:F${currentRow}`);
    sheet.getCell(`B${currentRow}`).value = `  • Bệnh nhân mới: ${patients?.newPatients || 0} người`;
    sheet.getCell(`B${currentRow}`).fill = highlightFill;
    currentRow++;

    sheet.mergeCells(`B${currentRow}:F${currentRow}`);
    sheet.getCell(`B${currentRow}`).value = `  • Bệnh nhân cũ quay lại: ${patients?.returningPatients || 0} người`;
    sheet.getCell(`B${currentRow}`).fill = highlightFill;
    currentRow++;

    sheet.mergeCells(`B${currentRow}:F${currentRow}`);
    sheet.getCell(`B${currentRow}`).value = '2. Top bệnh nhân chi tiêu cao nhất';
    sheet.getCell(`B${currentRow}`).font = { bold: true };
    currentRow++;

    const headers = ['STT', 'Tên Bệnh nhân', 'Lượt khám', 'Lần khám cuối', 'Tổng chi tiêu'];
    [2, 3, 4, 5, 6].forEach((col, i) => {
      const cell = sheet.getCell(currentRow, col);
      cell.value = headers[i];
      cell.font = { bold: true };
      cell.fill = headerFill;
      cell.border = borderAll;
      cell.alignment = { horizontal: 'center' };
    });
    currentRow++;

    if (patients?.topPatients && patients.topPatients.length > 0) {
      patients.topPatients.forEach((p: any, idx: number) => {
        const r = sheet.getRow(currentRow);
        r.getCell(2).value = idx + 1; r.getCell(2).border = borderAll; r.getCell(2).alignment = { horizontal: 'center' };
        r.getCell(3).value = p.patientName; r.getCell(3).border = borderAll;
        r.getCell(4).value = p.visitCount; r.getCell(4).border = borderAll; r.getCell(4).alignment = { horizontal: 'center' };
        r.getCell(5).value = new Date(p.lastVisit).toLocaleDateString('vi-VN'); r.getCell(5).border = borderAll; r.getCell(5).alignment = { horizontal: 'center' };
        r.getCell(6).value = p.totalSpent; r.getCell(6).border = borderAll; r.getCell(6).numFmt = '#,##0';
        currentRow++;
      });
    } else {
      sheet.mergeCells(`B${currentRow}:F${currentRow}`);
      sheet.getCell(`B${currentRow}`).value = 'Không có dữ liệu';
      sheet.getCell(`B${currentRow}`).alignment = { horizontal: 'center' };
      sheet.getCell(`B${currentRow}`).border = borderAll;
      currentRow++;
    }
    sheet.addRow([]); currentRow++;
  }

  // SIGNATURES
  sheet.addRow([]);
  currentRow++;

  const sigRow1 = sheet.getRow(currentRow);
  sheet.mergeCells(`B${currentRow}:C${currentRow}`);
  const s1 = sigRow1.getCell(2);
  s1.value = 'Người lập biểu';
  s1.font = { bold: true };
  s1.alignment = { horizontal: 'center' };

  sheet.mergeCells(`D${currentRow}:F${currentRow}`);
  const s2 = sigRow1.getCell(4);
  s2.value = 'Giám đốc Phòng khám';
  s2.font = { bold: true };
  s2.alignment = { horizontal: 'center' };
  currentRow++;

  const sigRow2 = sheet.getRow(currentRow);
  sheet.mergeCells(`B${currentRow}:C${currentRow}`);
  const ss1 = sigRow2.getCell(2);
  ss1.value = '(Ký và ghi rõ họ tên)';
  ss1.font = { italic: true };
  ss1.alignment = { horizontal: 'center' };

  sheet.mergeCells(`D${currentRow}:F${currentRow}`);
  const ss2 = sigRow2.getCell(4);
  ss2.value = '(Ký, đóng dấu và ghi rõ họ tên)';
  ss2.font = { italic: true };
  ss2.alignment = { horizontal: 'center' };

  // Write and download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
