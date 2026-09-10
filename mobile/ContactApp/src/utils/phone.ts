export const PHONE_COUNTRY_CODE = '+1';
export const PHONE_DIGITS = 10;

export function phoneDigits(value: string) {
  const digits = value.replace(/\D/g, '');
  return digits.length > PHONE_DIGITS && digits.startsWith('1') ? digits.slice(1) : digits;
}

export function formatPhone(value: string) {
  const digits = phoneDigits(value).slice(0, PHONE_DIGITS);
  if (digits.length === 0) return '';
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export function toApiPhone(value: string) {
  return phoneDigits(value) ? `${PHONE_COUNTRY_CODE} ${formatPhone(value)}` : undefined;
}
