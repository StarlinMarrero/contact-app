import { z } from 'zod';

import { BUSINESS_TYPES, CONTACT_REASONS, FieldLimits } from '@/constants/contact-form';
import { PHONE_DIGITS, phoneDigits, toApiPhone } from '@/utils/phone';

const WEBSITE_REGEX = /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(\/\S*)?$/i;

const requiredText = (label: string, max: number) =>
  z.string().trim().min(1, `${label} is required`).max(max);

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((value) => value || undefined);

const phone = z
  .string()
  .refine((value) => {
    const digits = phoneDigits(value).length;
    return digits === 0 || digits === PHONE_DIGITS;
  }, 'Enter a 10-digit phone number')
  .transform(toApiPhone);

export const contactFormSchema = z
  .object({
    businessType: z.enum(BUSINESS_TYPES, { error: 'Select your business type' }),
    companyName: requiredText('Company name', FieldLimits.companyName),
    website: optionalText(FieldLimits.website).refine(
      (value) => !value || WEBSITE_REGEX.test(value),
      'Enter a valid website, e.g. example.com',
    ),
    firstName: requiredText('First name', FieldLimits.name),
    lastName: requiredText('Last name', FieldLimits.name),
    title: requiredText('Title', FieldLimits.title),
    corporateEmail: z
      .string()
      .trim()
      .min(1, 'Corporate email is required')
      .max(FieldLimits.email)
      .pipe(z.email('Enter a valid email address')),
    corporatePhone: phone,
    mobile: phone,
    reasons: z.array(z.enum(CONTACT_REASONS)).min(1, 'Select at least one reason for contact'),
    message: optionalText(FieldLimits.message),
  })
  .refine((form) => form.corporatePhone || form.mobile, {
    message: 'Provide at least one phone number (Corporate Phone or Mobile)',
    path: ['corporatePhone'],
    when: (payload) =>
      typeof payload.value === 'object' && payload.value !== null && !Array.isArray(payload.value),
  });

export type ContactFormPayload = z.output<typeof contactFormSchema>;
