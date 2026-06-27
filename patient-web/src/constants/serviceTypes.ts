/** BN được đặt lịch trực tiếp (SERVICE mode): xét nghiệm + chẩn đoán hình ảnh. */
export const PATIENT_BOOKABLE_SERVICE_TYPES = [
  'LAB_TEST',
  'X_RAY',
  'ULTRASOUND',
  'CT_SCAN',
  'MRI',
  'ENDOSCOPY',
] as const;

export type PatientBookableServiceType = (typeof PATIENT_BOOKABLE_SERVICE_TYPES)[number];

export const isPatientBookableService = (type?: string | null): type is PatientBookableServiceType =>
  !!type && (PATIENT_BOOKABLE_SERVICE_TYPES as readonly string[]).includes(type);

export const SERVICE_TYPE_LABELS: Record<string, string> = {
  LAB_TEST: 'Xét nghiệm',
  X_RAY: 'Chụp X-Quang',
  ULTRASOUND: 'Siêu âm',
  CT_SCAN: 'Chụp CT',
  MRI: 'Chụp MRI',
  ENDOSCOPY: 'Nội soi',
};
