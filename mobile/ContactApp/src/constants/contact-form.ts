import type { SymbolViewProps } from 'expo-symbols';

export const BUSINESS_TYPES = ['storefront', 'online_store', 'storefront_online_store'] as const;
export type BusinessType = (typeof BUSINESS_TYPES)[number];

export const CONTACT_REASONS = [
  'retail_perfumery_partnership',
  'product_purchase',
  'customer_support',
  'other',
] as const;
export type ContactReason = (typeof CONTACT_REASONS)[number];

export const BUSINESS_TYPE_OPTIONS: {
  value: BusinessType;
  label: string;
  icon: SymbolViewProps['name'];
}[] = [
  {
    value: 'storefront',
    label: 'Storefront',
    icon: { ios: 'storefront', android: 'storefront', web: 'storefront' },
  },
  {
    value: 'online_store',
    label: 'Online Store',
    icon: { ios: 'bag', android: 'shopping_bag', web: 'shopping_bag' },
  },
  {
    value: 'storefront_online_store',
    label: 'Storefront + Online Store',
    icon: { ios: 'square.grid.2x2', android: 'grid_view', web: 'grid_view' },
  },
];

export const CONTACT_REASON_OPTIONS: { value: ContactReason; label: string }[] = [
  { value: 'retail_perfumery_partnership', label: 'Retail Perfumery Partnership' },
  { value: 'product_purchase', label: 'Product Purchase' },
  { value: 'customer_support', label: 'Customer Support' },
  { value: 'other', label: 'Other' },
];

export const FieldLimits = {
  companyName: 200,
  website: 255,
  name: 100,
  title: 100,
  email: 254,
  message: 5000,
} as const;
