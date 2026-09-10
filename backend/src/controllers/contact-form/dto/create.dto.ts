import { z } from "zod";
import { BUSINESS_TYPES, CONTACT_REASONS } from "../../../constants/contact-form.constants";

const optional = <T extends z.ZodType>(schema: T) =>
    z.preprocess((value) => (value == null || (typeof value === "string" && value.trim() === "") ? undefined : value), schema.optional());

const requiredText = (label: string, max: number) =>
    z.string({ error: `${label} is required` }).trim().min(1, `${label} is required`).max(max);

const phone = z
    .string()
    .trim()
    .regex(/^\+?[0-9\s\-().]{7,20}$/, "Invalid phone number");

const website = z
    .string()
    .trim()
    .max(255)
    .regex(/^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(\/\S*)?$/i, "Invalid website");

export const createContactFormSchema = z
    .object({
        businessType: z.enum(BUSINESS_TYPES, {
            error: (issue) => (issue.input === undefined ? "Business type is required" : "Invalid business type"),
        }),
        companyName: requiredText("Company name", 200),
        website: optional(website),
        firstName: requiredText("First name", 100),
        lastName: requiredText("Last name", 100),
        title: requiredText("Title", 100),
        corporateEmail: z.string({ error: "Corporate email is required" }).trim().max(254).pipe(z.email("Invalid email address")),
        corporatePhone: optional(phone),
        mobile: optional(phone),
        reasons: z
            .array(z.enum(CONTACT_REASONS), { error: "Reason for contact is required" })
            .min(1, "Select at least one reason for contact")
            .transform((reasons) => [...new Set(reasons)]),
        message: optional(z.string().trim().max(5000)),
    })
    .refine((form) => form.corporatePhone || form.mobile, {
        message: "Please provide at least one phone number (Corporate Phone or Mobile)",
        path: ["corporatePhone"],
        when: (payload) => typeof payload.value === "object" && payload.value !== null && !Array.isArray(payload.value),
    });

export type CreateContactFormDTO = z.infer<typeof createContactFormSchema>;
