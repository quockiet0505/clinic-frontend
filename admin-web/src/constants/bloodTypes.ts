export const BLOOD_TYPE_VALUES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;

export type BloodTypeValue = (typeof BLOOD_TYPE_VALUES)[number];

/** Empty string = unknown / not specified */
export const BLOOD_TYPE_UNKNOWN = '';

export const BLOOD_TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: BLOOD_TYPE_UNKNOWN, label: 'Chưa rõ' },
  ...BLOOD_TYPE_VALUES.map((v) => ({ value: v, label: v })),
];

export function formatBloodType(value?: string | null): string {
  if (!value || value === BLOOD_TYPE_UNKNOWN) return 'Chưa rõ';
  return value;
}
