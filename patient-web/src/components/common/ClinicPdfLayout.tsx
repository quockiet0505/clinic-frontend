import React from 'react';
import { formatDoctorName, formatVND } from '@/utils/generatePdf';

/* ─── Data shapes ──────────────────────────────────────────────── */

export interface PdfPatient {
  /* Thông tin cơ bản */
  name?: string | null;
  gender?: string | null;
  dob?: string | null;
  phone?: string | null;
  address?: string | null;
  /* Hồ sơ sức khoẻ */
  bloodType?: string | null;
  height?: number | null;
  weight?: number | null;
  bloodPressure?: string | null;
  pulse?: number | null;
  allergies?: string | null;
  medicalHistory?: string | null;
}

export interface PdfTableRow {
  index: number;
  name: string;
  detail: string;
  quantity: string;
}

export interface ClinicPdfLayoutProps {
  id: string;
  /** "ĐƠN THUỐC" | "KẾT QUẢ XÉT NGHIỆM" | … */
  documentTitle: string;
  documentCode: string;
  issuedDate: string;
  logoSrc?: string;

  patient?: PdfPatient;

  /* Bác sĩ / dịch vụ */
  doctorName?: string | null;
  doctorSpecialty?: string | null;
  technicianName?: string | null;
  diagnosis?: string | null;
  serviceName?: string | null;
  serviceDoctor?: string | null;

  /* Nội dung chính (đơn thuốc) */
  tableHeaders?: [string, string, string];
  tableRows?: PdfTableRow[];
  notes?: string | null;

  /* Nội dung chính (XN / CLS) */
  extraSections?: Array<{ title: string; content: string }>;
  conclusion?: string | null;

  /* Chi phí */
  consultationFee?: number | null;
  serviceFee?: number | null;
  totalAmount?: number | null;

  footerNote?: string;
}

/* ─── Constants ────────────────────────────────────────────────── */
const CLINIC_NAME    = 'PHÒNG KHÁM ĐA KHOA CLINIQA';
const CLINIC_ADDRESS = '71-73 Ngô Thời Nhiệm, Phường Võ Thị Sáu, Quận 3, TP.HCM';
const CLINIC_HOTLINE = 'Hotline: 1900 2115  |  Email: contact@cliniqa.vn';
const STATIC_BASE    = (import.meta as any).env?.VITE_STATIC_BASE_URL || 'http://localhost:8080';
const DEFAULT_LOGO   = `${STATIC_BASE}/images/logos/logo.png`;

/* ─── Micro helpers ─────────────────────────────────────────────── */
const cell = (label: string, value?: string | number | null, full = false) =>
  value != null && value !== '' ? (
    <div style={{ marginBottom: '3px', ...(full ? { gridColumn: '1/-1' } : {}) }}>
      <span style={{ display: 'inline-block', minWidth: '120px', fontWeight: 700, color: '#475569', fontSize: '11px' }}>{label}</span>
      <span style={{ color: '#1e293b', fontSize: '11.5px' }}>{value}</span>
    </div>
  ) : null;

const sectionHeader = (num: string, title: string, color = '#0284c7') => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '7px' }}>
    <span style={{ fontWeight: 900, fontSize: '11px', background: color, color: '#fff', borderRadius: '3px', padding: '1px 6px' }}>{num}</span>
    <span style={{ fontWeight: 800, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px', color }}>
      {title}
    </span>
  </div>
);

const box = (children: React.ReactNode, bg = '#f8fafc', border = '#e2e8f0'): React.ReactNode => (
  <div style={{ border: `1px solid ${border}`, borderRadius: '6px', padding: '10px 14px', marginBottom: '10px', background: bg }}>
    {children}
  </div>
);

/* ─── Component ─────────────────────────────────────────────────── */
export const ClinicPdfLayout: React.FC<ClinicPdfLayoutProps> = ({
  id, documentTitle, documentCode, issuedDate, logoSrc,
  patient, doctorName, doctorSpecialty, technicianName, diagnosis, serviceName, serviceDoctor,
  tableHeaders = ['Tên', 'Chi tiết / Liều dùng', 'Số lượng'],
  tableRows = [], notes,
  extraSections = [], conclusion,
  consultationFee, serviceFee, totalAmount,
  footerNote,
}) => {
  const today = new Date();
  const dateStr = `TP. Hồ Chí Minh, ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}`;
  const hasFee = consultationFee != null || serviceFee != null || totalAmount != null;
  const genderLabel = patient?.gender === 'MALE' ? 'Nam' : patient?.gender === 'FEMALE' ? 'Nữ' : (patient?.gender || undefined);
  const yearOfBirth = patient?.dob ? String(new Date(patient.dob).getFullYear()) : undefined;
  const hasVital = patient && (patient.bloodType || patient.height || patient.weight || patient.bloodPressure || patient.pulse || patient.allergies || patient.medicalHistory);

  return (
    <div id={id} style={{ display: 'none', fontFamily: '"Arial","Helvetica Neue",Helvetica,sans-serif', color: '#1e293b', background: '#fff', padding: '26px 30px', fontSize: '12px', lineHeight: '1.55', width: '794px', boxSizing: 'border-box' }}>

      {/* ══ HEADER ═════════════════════════════════════════════ */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #0284c7', paddingBottom: '10px', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src={logoSrc || DEFAULT_LOGO}
            crossOrigin="anonymous"
            alt="logo"
            style={{ height: '46px', width: 'auto', objectFit: 'contain', borderRadius: '4px' }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
          <div>
            <div style={{ fontWeight: 900, fontSize: '13px', color: '#0284c7' }}>{CLINIC_NAME}</div>
            <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>{CLINIC_ADDRESS}</div>
            <div style={{ fontSize: '10px', color: '#64748b' }}>{CLINIC_HOTLINE}</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 900, fontSize: '17px', textTransform: 'uppercase', letterSpacing: '1.5px' }}>{documentTitle}</div>
          <div style={{ fontSize: '10.5px', color: '#64748b', marginTop: '3px' }}>Mã phiếu: <strong style={{ color: '#1e293b' }}>{documentCode}</strong></div>
          <div style={{ fontSize: '10.5px', color: '#64748b' }}>Ngày: <strong style={{ color: '#1e293b' }}>{issuedDate}</strong></div>
        </div>
      </div>

      {/* ══ I. THÔNG TIN BỆNH NHÂN ════════════════════════════ */}
      {patient && box(
        <>
          {sectionHeader('I', 'Thông tin bệnh nhân')}
          {/* Basic info — 2 cols */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px 16px', marginBottom: hasVital ? '8px' : 0 }}>
            <div style={{ gridColumn: '1/-1', marginBottom: '4px' }}>
              <span style={{ display: 'inline-block', minWidth: '120px', fontWeight: 700, color: '#475569', fontSize: '11px' }}>Họ và tên:</span>
              <span style={{ fontWeight: 800, fontSize: '13px', textTransform: 'uppercase' }}>{patient.name || '---'}</span>
            </div>
            {cell('Giới tính:', genderLabel)}
            {cell('Năm sinh:', yearOfBirth)}
            {cell('Điện thoại:', patient.phone || undefined)}
            {patient.address && cell('Địa chỉ:', patient.address, true)}
          </div>

          {/* Health profile */}
          {hasVital && (
            <>
              <div style={{ borderTop: '1px dashed #cbd5e1', marginBottom: '7px' }} />
              <div style={{ fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.8px', color: '#64748b', marginBottom: '5px' }}>Hồ sơ sức khoẻ</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2px 16px' }}>
                {cell('Nhóm máu:', patient.bloodType || undefined)}
                {patient.height && cell('Chiều cao:', `${patient.height} cm`)}
                {patient.weight && cell('Cân nặng:', `${patient.weight} kg`)}
                {cell('Huyết áp:', patient.bloodPressure || undefined)}
                {patient.pulse && cell('Mạch:', `${patient.pulse} lần/phút`)}
              </div>
              {patient.allergies && (
                <div style={{ marginTop: '4px' }}>
                  <span style={{ display: 'inline-block', minWidth: '120px', fontWeight: 700, color: '#475569', fontSize: '11px' }}>Dị ứng:</span>
                  <span style={{ color: '#b45309', fontSize: '11.5px', fontWeight: 600 }}>{patient.allergies}</span>
                </div>
              )}
              {patient.medicalHistory && (
                <div style={{ marginTop: '4px' }}>
                  <span style={{ display: 'inline-block', minWidth: '120px', fontWeight: 700, color: '#475569', fontSize: '11px' }}>Tiền sử bệnh:</span>
                  <span style={{ color: '#1e293b', fontSize: '11.5px' }}>{patient.medicalHistory}</span>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* ══ II. THÔNG TIN BÁC SĨ / KHÁM ══════════════════════ */}
      {(doctorName || diagnosis || serviceName || technicianName) && box(
        <>
          {sectionHeader('II', 'Thông tin khám bệnh')}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px 16px' }}>
            {cell('Bác sĩ điều trị:', formatDoctorName(doctorName))}
            {cell('Chuyên khoa:', doctorSpecialty || undefined)}
            {cell('Kỹ thuật viên:', technicianName || undefined)}
            {cell('Ngày khám:', issuedDate)}
          </div>
          {(diagnosis || serviceName || serviceDoctor) && (
            <div style={{ borderTop: '1px dashed #cbd5e1', marginTop: '6px', paddingTop: '6px' }}>
              {diagnosis && (
                <div style={{ marginBottom: '3px' }}>
                  <span style={{ display: 'inline-block', minWidth: '120px', fontWeight: 700, color: '#475569', fontSize: '11px' }}>Chẩn đoán:</span>
                  <span style={{ color: '#1e293b', fontWeight: 700, fontSize: '12px' }}>{diagnosis}</span>
                </div>
              )}
              {serviceName && cell('Dịch vụ thực hiện:', serviceName)}
              {serviceDoctor && cell('Bác sĩ thực hiện:', formatDoctorName(serviceDoctor))}
            </div>
          )}
        </>
      )}

      {/* ══ III. NỘI DUNG CHI TIẾT ════════════════════════════ */}
      {(tableRows.length > 0 || extraSections.length > 0 || conclusion || notes) && box(
        <>
          {sectionHeader('III', tableRows.length > 0 ? 'Đơn thuốc điều trị' : 'Kết quả & Kết luận')}

          {/* Medicine table */}
          {tableRows.length > 0 && (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', marginBottom: notes ? '8px' : 0 }}>
              <thead>
                <tr style={{ background: '#f1f5f9', borderBottom: '1.5px solid #cbd5e1' }}>
                  <th style={{ padding: '5px 4px', textAlign: 'center', width: '28px', fontWeight: 700, fontSize: '9.5px' }}>STT</th>
                  <th style={{ padding: '5px 4px', textAlign: 'left', fontWeight: 700, fontSize: '9.5px' }}>{tableHeaders[0]}</th>
                  <th style={{ padding: '5px 4px', textAlign: 'left', fontWeight: 700, fontSize: '9.5px' }}>{tableHeaders[1]}</th>
                  <th style={{ padding: '5px 4px', textAlign: 'right', fontWeight: 700, fontSize: '9.5px', width: '68px' }}>{tableHeaders[2]}</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row) => (
                  <tr key={row.index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '6px 4px', textAlign: 'center', color: '#64748b' }}>{row.index}</td>
                    <td style={{ padding: '6px 4px', fontWeight: 700 }}>{row.name}</td>
                    <td style={{ padding: '6px 4px', color: '#475569' }}>{row.detail}</td>
                    <td style={{ padding: '6px 4px', textAlign: 'right', fontWeight: 700 }}>{row.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Lời dặn (prescription) */}
          {notes && (
            <div style={{ marginTop: tableRows.length ? '8px' : 0 }}>
              <div style={{ fontWeight: 700, fontSize: '10.5px', color: '#92400e', marginBottom: '3px' }}>Lời dặn của bác sĩ</div>
              <div style={{ background: '#fffbeb', borderLeft: '3px solid #f59e0b', padding: '7px 10px', borderRadius: '0 4px 4px 0', whiteSpace: 'pre-wrap', fontSize: '11px' }}>
                {notes}
              </div>
            </div>
          )}

          {/* Lab result sections */}
          {extraSections.map((sec, i) => (
            <div key={i} style={{ marginBottom: i < extraSections.length - 1 || conclusion ? '8px' : 0 }}>
              <div style={{ fontWeight: 700, fontSize: '10.5px', color: '#475569', marginBottom: '3px' }}>{sec.title}</div>
              <div style={{ background: '#f8fafc', borderRadius: '4px', padding: '7px 10px', whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '11px' }}>
                {sec.content || 'Chưa có dữ liệu.'}
              </div>
            </div>
          ))}

          {/* Conclusion */}
          {conclusion && (
            <div style={{ marginTop: extraSections.length ? '8px' : 0 }}>
              <div style={{ fontWeight: 700, fontSize: '10.5px', color: '#1d4ed8', marginBottom: '3px' }}>Kết luận của bác sĩ</div>
              <div style={{ background: '#eff6ff', borderLeft: '3px solid #3b82f6', padding: '7px 10px', borderRadius: '0 4px 4px 0', whiteSpace: 'pre-wrap', fontSize: '11px' }}>
                {conclusion}
              </div>
            </div>
          )}
        </>
      )}

      {/* ══ IV. CHI PHÍ ═══════════════════════════════════════ */}
      {hasFee && box(
        <>
          {sectionHeader('IV', 'Chi phí khám bệnh', '#16a34a')}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11.5px' }}>
            {consultationFee != null && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#475569' }}>Tiền khám:</span>
                <span style={{ fontWeight: 700 }}>{formatVND(consultationFee)}</span>
              </div>
            )}
            {serviceFee != null && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#475569' }}>Tiền dịch vụ:</span>
                <span style={{ fontWeight: 700 }}>{formatVND(serviceFee)}</span>
              </div>
            )}
            {totalAmount != null && (
              <div style={{ borderTop: '1px solid #86efac', marginTop: '4px', paddingTop: '5px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 800, fontSize: '12px' }}>Tổng cộng:</span>
                <span style={{ fontWeight: 900, fontSize: '14px', color: '#16a34a' }}>{formatVND(totalAmount)}</span>
              </div>
            )}
          </div>
        </>,
        '#f0fdf4', '#bbf7d0'
      )}

      {/* ══ SIGNATURES ════════════════════════════════════════ */}
      <div style={{ display: 'flex', justifyContent: technicianName ? 'space-between' : 'flex-end', textAlign: 'center', marginTop: '16px' }}>
        {technicianName && (
          <div>
            <div style={{ fontSize: '10.5px', color: '#64748b', fontStyle: 'italic' }}>{dateStr}</div>
            <div style={{ fontWeight: 700, fontSize: '11.5px', marginTop: '45px' }}>Kỹ thuật viên</div>
            <div style={{ fontWeight: 700, fontSize: '11.5px', marginTop: '2px' }}>{technicianName}</div>
          </div>
        )}
        <div>
          <div style={{ fontSize: '10.5px', color: '#64748b', fontStyle: 'italic' }}>{dateStr}</div>
          <div style={{ fontWeight: 700, fontSize: '11.5px', marginTop: '45px' }}>Bác sĩ điều trị</div>
          <div style={{ fontWeight: 700, fontSize: '11.5px', marginTop: '2px' }}>{formatDoctorName(doctorName)}</div>
        </div>
      </div>

      {/* ══ FOOTER ════════════════════════════════════════════ */}
      <div style={{ marginTop: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '7px', textAlign: 'center', fontSize: '9.5px', color: '#94a3b8', fontStyle: 'italic' }}>
        {footerNote || 'Phiếu này có giá trị lưu hành nội bộ phòng khám. Vui lòng mang theo khi tái khám.'}
      </div>
    </div>
  );
};
