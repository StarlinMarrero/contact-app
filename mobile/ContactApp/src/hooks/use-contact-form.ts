import { useState } from 'react';
import { z } from 'zod';

import type { BusinessType, ContactReason } from '@/constants/contact-form';
import { contactFormSchema } from '@/schemas/contact-form.schema';
import { ApiError } from '@/services/api-client';
import { type ContactFormResponse, submitContactForm } from '@/services/contact-form.service';

export type ContactFormValues = {
  businessType: BusinessType | null;
  companyName: string;
  website: string;
  firstName: string;
  lastName: string;
  title: string;
  corporateEmail: string;
  corporatePhone: string;
  mobile: string;
  reasons: ContactReason[];
  message: string;
};

export type ContactFormField = keyof ContactFormValues;
export type ContactFormErrors = Partial<Record<ContactFormField, string>>;

export const FORM_SECTIONS = {
  business: ['businessType'],
  company: ['companyName', 'website'],
  personal: ['firstName', 'lastName', 'title', 'corporateEmail', 'corporatePhone', 'mobile'],
  inquiry: ['reasons', 'message'],
} as const satisfies Record<string, readonly ContactFormField[]>;

export type FormSectionKey = keyof typeof FORM_SECTIONS;

const SECTION_KEYS = Object.keys(FORM_SECTIONS) as FormSectionKey[];
const FIELD_ORDER = SECTION_KEYS.flatMap((key) => FORM_SECTIONS[key]) as ContactFormField[];

export function sectionOf(field: ContactFormField): FormSectionKey {
  return SECTION_KEYS.find((key) => (FORM_SECTIONS[key] as readonly string[]).includes(field))!;
}

const INITIAL_VALUES: ContactFormValues = {
  businessType: null,
  companyName: '',
  website: '',
  firstName: '',
  lastName: '',
  title: '',
  corporateEmail: '',
  corporatePhone: '',
  mobile: '',
  reasons: [],
  message: '',
};

function firstMessages(fieldErrors: Partial<Record<string, string[]>> | undefined): ContactFormErrors {
  const errors: ContactFormErrors = {};
  for (const field of FIELD_ORDER) {
    const message = fieldErrors?.[field]?.[0];
    if (message) errors[field] = message;
  }
  return errors;
}

export function validateContactForm(values: ContactFormValues) {
  const result = contactFormSchema.safeParse(values);
  return result.success
    ? { payload: result.data, errors: {} as ContactFormErrors }
    : { payload: null, errors: firstMessages(z.flattenError(result.error).fieldErrors) };
}

type SubmitState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success'; result: ContactFormResponse }
  | { status: 'error'; message: string };

type SubmitOutcome = { ok: true } | { ok: false; firstInvalidField?: ContactFormField };

export function useContactForm() {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [touched, setTouched] = useState<Partial<Record<ContactFormField, boolean>>>({});
  const [showAllErrors, setShowAllErrors] = useState(false);
  const [serverErrors, setServerErrors] = useState<ContactFormErrors>({});
  const [submitState, setSubmitState] = useState<SubmitState>({ status: 'idle' });

  const { payload, errors } = validateContactForm(values);

  const sectionComplete = Object.fromEntries(
    SECTION_KEYS.map((key) => [key, FORM_SECTIONS[key].every((field) => !errors[field])]),
  ) as Record<FormSectionKey, boolean>;
  const completedSections = SECTION_KEYS.filter((key) => sectionComplete[key]).length;

  function errorFor(field: ContactFormField) {
    return serverErrors[field] ?? (showAllErrors || touched[field] ? errors[field] : undefined);
  }

  function setField<K extends ContactFormField>(field: K, value: ContactFormValues[K]) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setServerErrors((prev) => {
      const cleared: ContactFormField[] = field === 'mobile' ? [field, 'corporatePhone'] : [field];
      if (!cleared.some((key) => prev[key])) return prev;
      const next = { ...prev };
      for (const key of cleared) delete next[key];
      return next;
    });
    if (submitState.status === 'error') setSubmitState({ status: 'idle' });
  }

  function markTouched(field: ContactFormField) {
    setTouched((prev) => (prev[field] ? prev : { ...prev, [field]: true }));
  }

  function toggleReason(reason: ContactReason) {
    setField(
      'reasons',
      values.reasons.includes(reason)
        ? values.reasons.filter((item) => item !== reason)
        : [...values.reasons, reason],
    );
    markTouched('reasons');
  }

  async function submit(): Promise<SubmitOutcome> {
    if (submitState.status === 'submitting') return { ok: false };

    setShowAllErrors(true);
    if (!payload) {
      return { ok: false, firstInvalidField: FIELD_ORDER.find((field) => errors[field]) };
    }

    setSubmitState({ status: 'submitting' });
    try {
      const result = await submitContactForm(payload);
      setSubmitState({ status: 'success', result });
      return { ok: true };
    } catch (error) {
      const apiError =
        error instanceof ApiError ? error : new ApiError('Something went wrong. Please try again.', 0);
      const fieldErrors = firstMessages(apiError.details);
      setServerErrors(fieldErrors);

      let message = apiError.message;
      if (Object.keys(fieldErrors).length > 0) message = 'Please review the highlighted fields.';
      else if (apiError.status >= 500) {
        message = 'Something went wrong on our side. Please try again in a moment.';
      }
      setSubmitState({ status: 'error', message });

      return { ok: false, firstInvalidField: FIELD_ORDER.find((field) => fieldErrors[field]) };
    }
  }

  function reset() {
    setValues(INITIAL_VALUES);
    setTouched({});
    setShowAllErrors(false);
    setServerErrors({});
    setSubmitState({ status: 'idle' });
  }

  return {
    values,
    setField,
    markTouched,
    toggleReason,
    errorFor,
    submit,
    reset,
    submitState,
    sectionComplete,
    completedSections,
    totalSections: SECTION_KEYS.length,
  };
}
