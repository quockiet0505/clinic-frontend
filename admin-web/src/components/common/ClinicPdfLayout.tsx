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

export interface PdfExtraSection {
  title: string;
  content: string;
  price?: number | null;
}

export interface PdfFeeItem {
  label: string;
  amount: number;
}

export interface ClinicPdfLayoutProps {
  id: string;
  /** "CHI TIẾT ĐƠN THUỐC" | "KẾT QUẢ XÉT NGHIỆM" | "CHI TIẾT BỆNH ÁN" */
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
  extraSections?: PdfExtraSection[];
  conclusion?: string | null;

  /* Chi phí */
  consultationFinalFee?: number | null;
  serviceFinalFee?: number | null;
  totalAmount?: number | null;
  /** Chi tiết từng khoản (ưu tiên hơn consultationFinalFee/serviceFinalFee gộp) */
  feeItems?: PdfFeeItem[];

  footerNote?: string;
  /** Ẩn khối chữ ký (dùng cho phiếu hồ sơ sức khoẻ) */
  hideSignatures?: boolean;
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
    <div style={{ marginBottom: '4px', ...(full ? { gridColumn: '1/-1' } : {}) }}>
      <span style={{ display: 'inline-block', minWidth: '120px', fontWeight: 600, color: '#000', fontSize: '12px' }}>{label}</span>
      <span style={{ color: '#000', fontSize: '13px' }}>{value}</span>
    </div>
  ) : null;

const sectionHeader = (title: string) => (
  <div style={{ borderBottom: '1px solid #000', marginBottom: '8px', paddingBottom: '4px' }}>
    <span style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: '#000' }}>
      {title}
    </span>
  </div>
);

const box = (children: React.ReactNode): React.ReactNode => (
  <div style={{ marginBottom: '16px' }}>
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
  consultationFinalFee, serviceFinalFee, totalAmount, feeItems = [],
  footerNote, hideSignatures = false,
}) => {
  const today = new Date();
  const dateStr = `TP. Hồ Chí Minh, ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}`;
  const hasItemizedFees = feeItems.length > 0;
  const hasFee =
    hasItemizedFees ||
    consultationFinalFee != null ||
    serviceFinalFee != null ||
    totalAmount != null;
  const genderLabel = patient?.gender === 'MALE' ? 'Nam' : patient?.gender === 'FEMALE' ? 'Nữ' : (patient?.gender || undefined);
  const yearOfBirth = patient?.dob ? String(new Date(patient.dob).getFullYear()) : undefined;
  const hasVital = patient && (patient.bloodType || patient.height || patient.weight || patient.bloodPressure || patient.pulse || patient.allergies || patient.medicalHistory);

  return (
    <div id={id} style={{ display: 'none', fontFamily: '"Times New Roman", Times, serif', color: '#000', background: '#fff', padding: '30px 40px', fontSize: '13px', lineHeight: '1.5', width: '794px', boxSizing: 'border-box' }}>

      {/* ══ HEADER ═════════════════════════════════════════════ */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #0284c7', paddingBottom: '12px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src={logoSrc || DEFAULT_LOGO}
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
          <div style={{ fontSize: '12px', color: '#000' }}>Mã phiếu: <strong>{documentCode}</strong></div>
          <div style={{ fontSize: '12px', color: '#000' }}>Ngày: <strong>{issuedDate}</strong></div>
        </div>
      </div>

      <div style={{ textAlign: 'center', margin: '20px 0 24px' }}>
        <div style={{ fontWeight: 'bold', fontSize: '20px', textTransform: 'uppercase' }}>{documentTitle}</div>
      </div>

      {/* ══ I. THÔNG TIN BỆNH NHÂN ════════════════════════════ */}
      {patient && box(
        <>
          {sectionHeader('I. THÔNG TIN BỆNH NHÂN')}
          {/* Basic info — 2 cols */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 16px', marginBottom: hasVital ? '12px' : 0 }}>
            <div style={{ gridColumn: '1/-1', marginBottom: '6px' }}>
              <span style={{ display: 'inline-block', minWidth: '120px', fontWeight: 'bold', color: '#000', fontSize: '13px' }}>Họ và tên:</span>
              <span style={{ fontWeight: 'bold', fontSize: '15px', textTransform: 'uppercase' }}>{patient.name || '---'}</span>
            </div>
            {cell('Giới tính:', genderLabel)}
            {cell('Năm sinh:', yearOfBirth)}
            {cell('Điện thoại:', patient.phone || undefined)}
            {patient.address && cell('Địa chỉ:', patient.address, true)}
          </div>

          {/* Health profile */}
          {hasVital && (
            <>
              <div style={{ borderTop: '1px dashed #000', margin: '8px 0' }} />
              <div style={{ fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase', marginBottom: '6px' }}>Hồ sơ sức khoẻ</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px 16px' }}>
                {cell('Nhóm máu:', patient.bloodType || undefined)}
                {patient.height && cell('Chiều cao:', `${patient.height} cm`)}
                {patient.weight && cell('Cân nặng:', `${patient.weight} kg`)}
                {cell('Huyết áp:', patient.bloodPressure || undefined)}
                {patient.pulse && cell('Mạch:', `${patient.pulse} lần/phút`)}
              </div>
              {patient.allergies && (
                <div style={{ marginTop: '6px' }}>
                  <span style={{ display: 'inline-block', minWidth: '120px', fontWeight: 'bold', fontSize: '12px' }}>Dị ứng:</span>
                  <span style={{ fontSize: '13px', fontWeight: 'bold' }}>{patient.allergies}</span>
                </div>
              )}
              {patient.medicalHistory && (
                <div style={{ marginTop: '6px' }}>
                  <span style={{ display: 'inline-block', minWidth: '120px', fontWeight: 'bold', fontSize: '12px' }}>Tiền sử bệnh:</span>
                  <span style={{ fontSize: '13px' }}>{patient.medicalHistory}</span>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* ══ II. THÔNG TIN BÁC SĨ / KHÁM ══════════════════════ */}
      {(doctorName || diagnosis || serviceName || technicianName) && box(
        <>
          {sectionHeader('II. THÔNG TIN KHÁM BỆNH')}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 16px' }}>
            {cell('Bác sĩ điều trị:', formatDoctorName(doctorName))}
            {cell('Chuyên khoa:', doctorSpecialty || undefined)}
            {cell('Kỹ thuật viên:', technicianName || undefined)}
            {cell('Ngày khám:', issuedDate)}
          </div>
          {(diagnosis || serviceName || serviceDoctor) && (
            <div style={{ borderTop: '1px dashed #000', margin: '8px 0', paddingTop: '8px' }}>
              {diagnosis && (
                <div style={{ marginBottom: '4px' }}>
                  <span style={{ display: 'inline-block', minWidth: '120px', fontWeight: 'bold', fontSize: '12px' }}>Chẩn đoán:</span>
                  <span style={{ fontWeight: 'bold', fontSize: '13px' }}>{diagnosis}</span>
                </div>
              )}
              {serviceName && cell('Dịch vụ:', serviceName)}
              {consultationFinalFee != null && consultationFinalFee > 0 && cell('Phí khám:', formatVND(consultationFinalFee))}
              {serviceDoctor && cell('BS thực hiện:', formatDoctorName(serviceDoctor))}
            </div>
          )}
        </>
      )}

      {/* ══ III. NỘI DUNG CHI TIẾT ════════════════════════════ */}
      {(tableRows.length > 0 || extraSections.length > 0 || conclusion || notes) && box(
        <>
          {sectionHeader(tableRows.length > 0 ? 'III. CHI TIẾT ĐƠN THUỐC' : 'III. KẾT QUẢ CẬN LÂM SÀNG')}

          {/* Medicine table */}
          {tableRows.length > 0 && (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', marginBottom: notes ? '12px' : 0 }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'center', width: '30px', fontWeight: 'bold' }}>STT</th>
                  <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'left', fontWeight: 'bold' }}>{tableHeaders[0]}</th>
                  <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'left', fontWeight: 'bold' }}>{tableHeaders[1]}</th>
                  <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'right', fontWeight: 'bold', width: '80px' }}>{tableHeaders[2]}</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row) => (
                  <tr key={row.index}>
                    <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>{row.index}</td>
                    <td style={{ border: '1px solid #000', padding: '6px', fontWeight: 'bold' }}>{row.name}</td>
                    <td style={{ border: '1px solid #000', padding: '6px' }}>{row.detail}</td>
                    <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'right', fontWeight: 'bold' }}>{row.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Lời dặn (prescription) */}
          {notes && (
            <div style={{ marginTop: tableRows.length ? '12px' : 0 }}>
              <div style={{ fontWeight: 'bold', fontSize: '13px', textDecoration: 'underline', marginBottom: '4px' }}>Lời dặn của bác sĩ:</div>
              <div style={{ whiteSpace: 'pre-wrap', fontSize: '13px' }}>
                {notes}
              </div>
            </div>
          )}

          {/* Lab result sections */}
          {extraSections.map((sec, i) => (
            <div key={i} style={{ marginBottom: i < extraSections.length - 1 || conclusion ? '12px' : 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontWeight: 'bold', fontSize: '13px' }}>{sec.title}</span>
                {sec.price != null && sec.price > 0 && (
                  <span style={{ fontSize: '11px', fontStyle: 'italic' }}>({formatVND(sec.price)})</span>
                )}
              </div>
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '13px', paddingLeft: '8px', borderLeft: '1px solid #000' }}>
                {sec.content || 'Chưa có dữ liệu.'}
              </div>
            </div>
          ))}

          {/* Conclusion */}
          {conclusion && (
            <div style={{ marginTop: extraSections.length ? '12px' : 0 }}>
              <div style={{ fontWeight: 'bold', fontSize: '13px', textDecoration: 'underline', marginBottom: '4px' }}>Kết luận:</div>
              <div style={{ whiteSpace: 'pre-wrap', fontSize: '13px' }}>
                {conclusion}
              </div>
            </div>
          )}
        </>
      )}

      {/* ══ IV. CHI PHÍ ═══════════════════════════════════════ */}
      {hasFee && box(
        <>
          {sectionHeader('IV. CHI PHÍ')}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', maxWidth: '360px', marginLeft: 'auto' }}>
            {hasItemizedFees ? (
              <>
                {feeItems.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                    <span style={{ flex: 1 }}>{item.label}</span>
                    <span style={{ whiteSpace: 'nowrap' }}>{formatVND(item.amount)}</span>
                  </div>
                ))}
                {totalAmount != null && (
                  <div style={{ borderTop: '1px solid #000', paddingTop: '6px', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 'bold' }}>Tổng cộng:</span>
                    <span style={{ fontWeight: 'bold' }}>{formatVND(totalAmount)}</span>
                  </div>
                )}
              </>
            ) : (
              <>
                {consultationFinalFee != null && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Phí khám:</span>
                    <span>{formatVND(consultationFinalFee)}</span>
                  </div>
                )}
                {serviceFinalFee != null && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Phí cận lâm sàng:</span>
                    <span>{formatVND(serviceFinalFee)}</span>
                  </div>
                )}
                {totalAmount != null && (
                  <div style={{ borderTop: '1px solid #000', paddingTop: '6px', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 'bold' }}>Tổng cộng:</span>
                    <span style={{ fontWeight: 'bold' }}>{formatVND(totalAmount)}</span>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}

      {/* ══ SIGNATURES ════════════════════════════════════════ */}
      {!hideSignatures && (
      <div style={{ display: 'flex', justifyContent: technicianName ? 'space-between' : 'flex-end', textAlign: 'center', marginTop: '24px' }}>
        {technicianName && (
          <div>
            <div style={{ fontSize: '12px', fontStyle: 'italic' }}>{dateStr}</div>
            <div style={{ fontWeight: 'bold', fontSize: '13px', marginTop: '40px' }}>Kỹ thuật viên</div>
            <div style={{ fontWeight: 'bold', fontSize: '13px', marginTop: '4px' }}>{technicianName}</div>
          </div>
        )}
        <div>
          <div style={{ fontSize: '12px', fontStyle: 'italic' }}>{dateStr}</div>
          <div style={{ fontWeight: 'bold', fontSize: '13px', marginTop: '40px' }}>Bác sĩ điều trị</div>
          <div style={{ fontWeight: 'bold', fontSize: '13px', marginTop: '4px' }}>{formatDoctorName(doctorName)}</div>
        </div>
      </div>
      )}

      {/* ══ FOOTER ════════════════════════════════════════════ */}
      <div style={{ marginTop: '30px', borderTop: '1px solid #000', paddingTop: '10px', textAlign: 'center', fontSize: '11px', fontStyle: 'italic' }}>
        {footerNote || 'Phiếu này có giá trị lưu hành nội bộ phòng khám. Vui lòng mang theo khi tái khám.'}
      </div>
    </div>
  );
};
