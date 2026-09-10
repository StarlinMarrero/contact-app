import { Check, Column, Entity, Index } from "typeorm";
import { BUSINESS_TYPES, CONTACT_REASONS, EMAIL_STATUSES, type BusinessType, type ContactReason, type EmailStatus } from "../../../constants/contact-form.constants";
import { Base } from "../extends/base.extend";

@Entity("contact-forms")
@Index("idx_contact_forms_corporate_email", ["corporateEmail"])
@Check("CHK_contact_forms_phone_required", `"corporatePhone" IS NOT NULL OR "mobile" IS NOT NULL`)
export class ContactFormEntity extends Base {
    @Column({ type: "enum", enum: BUSINESS_TYPES, enumName: "contact_form_business_type_enum" })
    businessType: BusinessType;

    @Column({ type: "varchar", length: 200 })
    companyName: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    website: string | null;

    @Column({ type: "varchar", length: 100 })
    firstName: string;

    @Column({ type: "varchar", length: 100 })
    lastName: string;

    @Column({ type: "varchar", length: 100 })
    title: string;

    @Column({ type: "varchar", length: 254 })
    corporateEmail: string;

    @Column({ type: "varchar", length: 30, nullable: true })
    corporatePhone: string | null;

    @Column({ type: "varchar", length: 30, nullable: true })
    mobile: string | null;

    @Column({ type: "enum", enum: CONTACT_REASONS, enumName: "contact_form_reason_enum", array: true })
    reasons: ContactReason[];

    @Column({ type: "text", nullable: true })
    message: string | null;

    @Column({ type: "enum", enum: EMAIL_STATUSES, enumName: "contact_form_email_status_enum", default: "pending" })
    emailStatus: EmailStatus;

    @Column({ type: "varchar", nullable: true })
    emailId: string | null;
}
