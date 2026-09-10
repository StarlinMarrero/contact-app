export const BUSINESS_TYPES = ["storefront", "online_store", "storefront_online_store"] as const;
export type BusinessType = (typeof BUSINESS_TYPES)[number];

export const BUSINESS_TYPE_LABELS: Record<BusinessType, string> = {
    storefront: "Storefront",
    online_store: "Online Store",
    storefront_online_store: "Storefront + Online Store",
};

export const CONTACT_REASONS = ["retail_perfumery_partnership", "product_purchase", "customer_support", "other"] as const;
export type ContactReason = (typeof CONTACT_REASONS)[number];

export const CONTACT_REASON_LABELS: Record<ContactReason, string> = {
    retail_perfumery_partnership: "Retail Perfumery Partnership",
    product_purchase: "Product Purchase",
    customer_support: "Customer Support",
    other: "Other",
};

export const EMAIL_STATUSES = ["pending", "sent", "failed"] as const;
export type EmailStatus = (typeof EMAIL_STATUSES)[number];
