import { postJson } from './api-client';

import type { ContactFormPayload } from '@/schemas/contact-form.schema';

export type ContactFormResponse = {
  id: string;
  createdAt: string;
  emailSent: boolean;
};

export function submitContactForm(payload: ContactFormPayload) {
  return postJson<ContactFormResponse>('/api/contact-forms', payload);
}
