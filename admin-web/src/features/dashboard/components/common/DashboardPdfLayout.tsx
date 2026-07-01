import React from 'react';
import { DashboardStats, RevenueStatsSummary, ReportFilter } from '../../types/dashboard';
import { formatVND } from '@/utils/generatePdf';
import { formatDateTime } from '@/utils/formatters';

interface DashboardPdfLayoutProps {
  id: string;
  filter: ReportFilter;
  stats: DashboardStats;
  revenue: RevenueStatsSummary;
  doctors?: any[];
  services?: any[];
  patients?: any;
}

const CLINIC_NAME    = 'PHÒNG KHÁM ĐA KHOA CLINIQA';
const CLINIC_ADDRESS = '71-73 Ngô Thời Nhiệm, Phường Võ Thị Sáu, Quận 3, TP.HCM';
const CLINIC_HOTLINE = 'Hotline: 1900 2115  |  Email: contact@cliniqa.vn';
const STATIC_BASE    = (import.meta as any).env?.VITE_STATIC_BASE_URL || 'http://localhost:8080';
const DEFAULT_LOGO   = `${STATIC_BASE}/images/logos/logo.png`;

export function DashboardPdfLayout({ id, filter, stats, revenue, doctors = [], services = [], patients }: DashboardPdfLayoutProps) {
  const periodLabel = filter.period === 'month' ? `Tháng ${filter.month}/${filter.year}` : `Quý ${filter.quarter}/${filter.year}`;
  const today = new Date();
  const dateStr = `TP. Hồ Chí Minh, ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}`;

  const sectionHeader = (title: string) => (
    <div style={{ borderBottom: '1px solid #000', marginBottom: '12px', paddingBottom: '4px', marginTop: '24px' }}>
      <span style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: '#000' }}>
        {title}
      </span>
    </div>
  );

  return (
    <div id={id} className="hidden" style={{ fontFamily: '"Times New Roman", Times, serif', color: '#000', background: '#fff', padding: '30px 40px', fontSize: '13px', lineHeight: '1.5', width: '794px', boxSizing: 'border-box' }}>
      
      {/* ══ HEADER ═════════════════════════════════════════════ */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #0284c7', paddingBottom: '12px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src={DEFAULT_LOGO}
            crossOrigin="anonymous"
            alt="logo"
            style={{ height: '50px', width: 'auto', objectFit: 'contain' }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#0284c7' }}>{CLINIC_NAME}</div>
            <div style={{ fontSize: '11px', color: '#000', marginTop: '2px' }}>{CLINIC_ADDRESS}</div>
            <div style={{ fontSize: '11px', color: '#000' }}>{CLINIC_HOTLINE}</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '12px', color: '#000' }}>Kỳ báo cáo: <strong>{periodLabel}</strong></div>
          <div style={{ fontSize: '12px', color: '#000' }}>Ngày lập: <strong>{formatDateTime(today.toISOString())}</strong></div>
        </div>
      </div>

      <div style={{ textAlign: 'center', margin: '24px 0' }}>
        <div style={{ fontWeight: 'bold', fontSize: '20px', textTransform: 'uppercase' }}>BÁO CÁO THỐNG KÊ HOẠT ĐỘNG</div>
      </div>

      {/* ══ CONTENT ════════════════════════════════════════════ */}
      <div>
        
        {(filter.type === 'all' || filter.type === 'overview') && (
          <div>
            {sectionHeader('I. TỔNG QUAN HOẠT ĐỘNG')}
            
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '8px' }}>1. Phân tích nổi bật</div>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', lineHeight: '1.8' }}>
                <li><strong>Tỷ lệ hoàn thành lịch hẹn:</strong> {stats.totalAppointments > 0 ? ((stats.completedAppointments / stats.totalAppointments) * 100).toFixed(1) : 0}%</li>
                <li><strong>Tỷ lệ hao hụt (Hủy/Bỏ khám):</strong> {stats.totalAppointments > 0 ? (((stats.cancelledAppointments + stats.noShowAppointments) / stats.totalAppointments) * 100).toFixed(1) : 0}%</li>
              </ul>
            </div>

            <div style={{ display: 'flex', gap: '30px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '8px' }}>2. Thông tin nhân sự & bệnh nhân</div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <tbody>
                    <tr>
                      <td style={{ border: '1px solid #000', padding: '6px', fontWeight: 'bold', width: '60%' }}>Tổng số bệnh nhân</td>
                      <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'right' }}>{stats.totalPatients}</td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid #000', padding: '6px', fontWeight: 'bold' }}>Tổng số nhân sự</td>
                      <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'right' }}>{stats.totalStaff}</td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid #000', padding: '6px', fontWeight: 'bold' }}>Số lượng bác sĩ</td>
                      <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'right' }}>{stats.totalDoctors}</td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid #000', padding: '6px', fontWeight: 'bold' }}>Đánh giá trung bình</td>
                      <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'right' }}>{stats.avgRating.toFixed(1)} / 5.0</td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid #000', padding: '6px', fontWeight: 'bold' }}>Lượt phản hồi</td>
                      <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'right' }}>{stats.totalFeedbacks}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '8px' }}>3. Tình hình lịch hẹn</div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <tbody>
                    <tr>
                      <td style={{ border: '1px solid #000', padding: '6px', fontWeight: 'bold', width: '60%' }}>Tổng lịch hẹn</td>
                      <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'right' }}>{stats.totalAppointments}</td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid #000', padding: '6px', fontWeight: 'bold' }}>Đã hoàn thành</td>
                      <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'right' }}>{stats.completedAppointments}</td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid #000', padding: '6px', fontWeight: 'bold' }}>Đã hủy</td>
                      <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'right' }}>{stats.cancelledAppointments}</td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid #000', padding: '6px', fontWeight: 'bold' }}>Bỏ khám (No show)</td>
                      <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'right' }}>{stats.noShowAppointments}</td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid #000', padding: '6px', fontWeight: 'bold' }}>Chờ khám</td>
                      <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'right' }}>{stats.pendingAppointments}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {(filter.type === 'all' || filter.type === 'revenue') && (
          <div>
            {sectionHeader(filter.type === 'all' ? 'II. BÁO CÁO DOANH THU' : 'I. BÁO CÁO DOANH THU')}
            
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '8px' }}>1. Phân tích nổi bật</div>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', lineHeight: '1.8' }}>
                <li><strong>Nguồn doanh thu chính:</strong> {revenue.consultationRevenue! > revenue.serviceRevenue! ? 'Khám bệnh' : 'Dịch vụ Cận lâm sàng'} (Khám: {revenue.totalRevenue > 0 ? ((revenue.consultationRevenue! / revenue.totalRevenue) * 100).toFixed(1) : 0}%, Dịch vụ: {revenue.totalRevenue > 0 ? ((revenue.serviceRevenue! / revenue.totalRevenue) * 100).toFixed(1) : 0}%)</li>
                <li><strong>Dịch vụ đóng góp nhiều nhất:</strong> {revenue.byService?.sort((a, b) => b.revenue - a.revenue)[0]?.serviceName || 'N/A'} ({revenue.byService?.sort((a, b) => b.revenue - a.revenue)[0]?.percentage?.toFixed(1) || 0}%)</li>
              </ul>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '8px' }}>2. Tổng hợp doanh thu</div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr>
                    <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'left', fontWeight: 'bold' }}>Hạng mục doanh thu</th>
                    <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'right', fontWeight: 'bold', width: '200px' }}>Số tiền (VNĐ)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ border: '1px solid #000', padding: '6px' }}>Doanh thu Khám bệnh</td>
                    <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'right' }}>{formatVND(revenue.consultationRevenue)}</td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #000', padding: '6px' }}>Doanh thu Dịch vụ (Xét nghiệm, CĐHA)</td>
                    <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'right' }}>{formatVND(revenue.serviceRevenue)}</td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #000', padding: '6px', fontWeight: 'bold', textTransform: 'uppercase' }}>Tổng doanh thu kỳ báo cáo</td>
                    <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'right', fontWeight: 'bold' }}>{formatVND(revenue.totalRevenue)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {revenue.byService && revenue.byService.length > 0 && (
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '8px' }}>3. Chi tiết doanh thu theo dịch vụ</div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr>
                      <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'center', fontWeight: 'bold', width: '40px' }}>STT</th>
                      <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'left', fontWeight: 'bold' }}>Tên dịch vụ</th>
                      <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'right', fontWeight: 'bold', width: '120px' }}>Doanh thu</th>
                      <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'right', fontWeight: 'bold', width: '80px' }}>Tỷ lệ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {revenue.byService.map((s: any, index: number) => (
                      <tr key={index}>
                        <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>{index + 1}</td>
                        <td style={{ border: '1px solid #000', padding: '6px' }}>{s.serviceName}</td>
                        <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'right' }}>{formatVND(s.revenue)}</td>
                        <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'right' }}>{s.percentage.toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {(filter.type === 'all' || filter.type === 'doctors') && (
          <div>
            {sectionHeader(filter.type === 'all' ? 'III. THỐNG KÊ CHI TIẾT BÁC SĨ' : 'I. THỐNG KÊ CHI TIẾT BÁC SĨ')}
            
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '8px' }}>1. Phân tích nổi bật</div>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', lineHeight: '1.8' }}>
                <li><strong>Bác sĩ khám nhiều nhất:</strong> {doctors.length > 0 ? `${[...doctors].sort((a, b) => b.totalAppointments - a.totalAppointments)[0]?.doctorName} (${[...doctors].sort((a, b) => b.totalAppointments - a.totalAppointments)[0]?.totalAppointments} lượt)` : 'Chưa có dữ liệu'}</li>
                <li><strong>Bác sĩ đánh giá tốt nhất:</strong> {doctors.length > 0 ? `${[...doctors].sort((a, b) => b.avgRating - a.avgRating)[0]?.doctorName} (${[...doctors].sort((a, b) => b.avgRating - a.avgRating)[0]?.avgRating.toFixed(1)} ⭐)` : 'Chưa có dữ liệu'}</li>
                <li><strong>Bác sĩ đem lại doanh thu cao nhất:</strong> {doctors.length > 0 ? `${[...doctors].sort((a, b) => b.revenue - a.revenue)[0]?.doctorName} (${formatVND([...doctors].sort((a, b) => b.revenue - a.revenue)[0]?.revenue || 0)})` : 'Chưa có dữ liệu'}</li>
              </ul>
            </div>

            <div>
              <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '8px' }}>2. Bảng kê chi tiết</div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr>
                    <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'center', fontWeight: 'bold', width: '40px' }}>STT</th>
                    <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'left', fontWeight: 'bold' }}>Tên Bác sĩ</th>
                    <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'center', fontWeight: 'bold' }}>Lượt khám</th>
                    <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'center', fontWeight: 'bold' }}>Tỷ lệ HT</th>
                    <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'center', fontWeight: 'bold' }}>Đánh giá</th>
                    <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'right', fontWeight: 'bold' }}>Doanh thu</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.length > 0 ? doctors.map((d: any, index: number) => (
                    <tr key={index}>
                      <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>{index + 1}</td>
                      <td style={{ border: '1px solid #000', padding: '6px' }}>{d.doctorName}</td>
                      <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>{d.totalAppointments}</td>
                      <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>{d.completionRate.toFixed(1)}%</td>
                      <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>{d.avgRating.toFixed(1)} ⭐</td>
                      <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'right' }}>{formatVND(d.revenue)}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan={6} style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>Không có dữ liệu</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {(filter.type === 'all' || filter.type === 'services') && (
          <div>
            {sectionHeader(filter.type === 'all' ? 'IV. THỐNG KÊ CHI TIẾT DỊCH VỤ' : 'I. THỐNG KÊ CHI TIẾT DỊCH VỤ')}
            
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '8px' }}>1. Phân tích nổi bật</div>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', lineHeight: '1.8' }}>
                <li><strong>Dịch vụ được sử dụng nhiều nhất:</strong> {services.length > 0 ? `${[...services].sort((a, b) => b.totalOrders - a.totalOrders)[0]?.serviceName} (${[...services].sort((a, b) => b.totalOrders - a.totalOrders)[0]?.totalOrders} lượt)` : 'Chưa có dữ liệu'}</li>
                <li><strong>Dịch vụ doanh thu cao nhất:</strong> {services.length > 0 ? `${[...services].sort((a, b) => b.revenue - a.revenue)[0]?.serviceName} (${formatVND([...services].sort((a, b) => b.revenue - a.revenue)[0]?.revenue || 0)})` : 'Chưa có dữ liệu'}</li>
              </ul>
            </div>

            <div>
              <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '8px' }}>2. Bảng kê chi tiết</div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr>
                    <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'center', fontWeight: 'bold', width: '40px' }}>STT</th>
                    <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'left', fontWeight: 'bold' }}>Tên Dịch vụ</th>
                    <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'center', fontWeight: 'bold' }}>Lượt sử dụng</th>
                    <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'center', fontWeight: 'bold' }}>Đã hoàn thành</th>
                    <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'right', fontWeight: 'bold' }}>Doanh thu</th>
                  </tr>
                </thead>
                <tbody>
                  {services.length > 0 ? services.map((s: any, index: number) => (
                    <tr key={index}>
                      <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>{index + 1}</td>
                      <td style={{ border: '1px solid #000', padding: '6px' }}>{s.serviceName}</td>
                      <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>{s.totalOrders}</td>
                      <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>{s.completedOrders}</td>
                      <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'right' }}>{formatVND(s.revenue)}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan={5} style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>Không có dữ liệu</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {(filter.type === 'all' || filter.type === 'patients') && (
          <div>
            {sectionHeader(filter.type === 'all' ? 'V. THỐNG KÊ CHI TIẾT BỆNH NHÂN' : 'I. THỐNG KÊ CHI TIẾT BỆNH NHÂN')}
            
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '8px' }}>1. Phân tích bệnh nhân</div>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', lineHeight: '1.8' }}>
                <li><strong>Bệnh nhân mới:</strong> {patients?.newPatients || 0} người</li>
                <li><strong>Bệnh nhân cũ quay lại:</strong> {patients?.returningPatients || 0} người</li>
              </ul>
            </div>

            <div>
              <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '8px' }}>2. Top bệnh nhân chi tiêu cao nhất</div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr>
                    <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'center', fontWeight: 'bold', width: '40px' }}>STT</th>
                    <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'left', fontWeight: 'bold' }}>Tên Bệnh nhân</th>
                    <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'center', fontWeight: 'bold' }}>Lượt khám</th>
                    <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'center', fontWeight: 'bold' }}>Lần khám cuối</th>
                    <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'right', fontWeight: 'bold' }}>Tổng chi tiêu</th>
                  </tr>
                </thead>
                <tbody>
                  {patients?.topPatients && patients.topPatients.length > 0 ? patients.topPatients.map((p: any, index: number) => (
                    <tr key={index}>
                      <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>{index + 1}</td>
                      <td style={{ border: '1px solid #000', padding: '6px' }}>{p.patientName}</td>
                      <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>{p.visitCount}</td>
                      <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>{formatDateTime(p.lastVisit)}</td>
                      <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'right' }}>{formatVND(p.totalSpent)}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan={5} style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>Không có dữ liệu</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
      </div>

      {/* ══ SIGNATURES ════════════════════════════════════════ */}
      <div style={{ display: 'flex', width: '100%', marginTop: '40px' }}>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontWeight: 'bold', fontSize: '13px', marginTop: '16px' }}>Người lập biểu</div>
          <div style={{ fontSize: '12px', fontStyle: 'italic', marginTop: '2px' }}>(Ký, ghi rõ họ tên)</div>
        </div>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: '12px', fontStyle: 'italic' }}>{dateStr}</div>
          <div style={{ fontWeight: 'bold', fontSize: '13px', marginTop: '2px' }}>Giám đốc Phòng khám</div>
          <div style={{ fontSize: '12px', fontStyle: 'italic', marginTop: '2px' }}>(Ký, đóng dấu, ghi rõ họ tên)</div>
        </div>
      </div>

    </div>
  );
}
