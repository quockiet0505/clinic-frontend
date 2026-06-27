/** BN / walk-in SERVICE booking: xét nghiệm + chẩn đoán hình ảnh. */
export const PATIENT_BOOKABLE_SERVICE_TYPES = [
  'LAB_TEST',
  'X_RAY',
  'ULTRASOUND',
  'CT_SCAN',
  'MRI',
  'ENDOSCOPY',
] as const;

export const isPatientBookableService = (type?: string | null): boolean =>
  !!type && (PATIENT_BOOKABLE_SERVICE_TYPES as readonly string[]).includes(type);

export const isHiddenServiceType = (type?: string | null): boolean => type === 'EXAM';
