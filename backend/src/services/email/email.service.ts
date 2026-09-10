import { Resend } from "resend";
import { env } from "../../config/env";
import { BUSINESS_TYPE_LABELS, CONTACT_REASON_LABELS } from "../../constants/contact-form.constants";
import { CreateContactFormDTO } from "../../controllers/contact-form/dto/create.dto";
import { generateSamplePdf } from "../pdf/pdf.service";

const resend = new Resend(env.RESEND_API_KEY);

const BRAND = env.EMAIL_BRAND_NAME;
const SUBJECT = `${BRAND}: we received your contact request`;

const HTML_ESCAPES: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);

type SummaryRow = [label: string, value: string];

const toReference = (id: string) => `#${id.slice(0, 8).toUpperCase()}`;

function buildSummaryRows(form: CreateContactFormDTO, reference: string): SummaryRow[] {
    return [
        ["Reference", reference],
        ["Business type", BUSINESS_TYPE_LABELS[form.businessType]],
        ["Company", form.companyName],
        ["Name", `${form.firstName} ${form.lastName}`],
        ["Reason for contact", form.reasons.map((reason) => CONTACT_REASON_LABELS[reason]).join(", ")],
    ];
}

const FOOTER = `You are receiving this email because this address was used to submit the contact form in the ${BRAND} app. If this wasn't you, you can ignore this message.`;

function buildConfirmationText(form: CreateContactFormDTO, rows: SummaryRow[]): string {
    return [
        `Hi ${form.firstName},`,
        "",
        `Thanks for reaching out to ${BRAND}. We received your request and our team will contact you at ${form.corporateEmail} shortly.`,
        "",
        ...rows.map(([label, value]) => `${label}: ${value}`),
        "",
        "The attached PDF is a copy for your records.",
        "",
        `The ${BRAND} team`,
        "",
        "--",
        FOOTER,
    ].join("\n");
}

function buildConfirmationHtml(form: CreateContactFormDTO, rows: SummaryRow[]): string {
    const tableRows = rows
        .map(
            ([label, value]) =>
                `<tr><td style="padding:6px 16px 6px 0;color:#666666;vertical-align:top;white-space:nowrap">${label}</td>` +
                `<td style="padding:6px 0;font-weight:bold">${escapeHtml(value)}</td></tr>`,
        )
        .join("");

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(SUBJECT)}</title>
</head>
<body style="margin:0;padding:24px 12px;background-color:#f4f4f5;font-family:Arial,Helvetica,sans-serif;color:#333333">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:8px">
<tr><td style="padding:24px">
<p style="margin:0 0 16px;font-size:14px;font-weight:bold;color:#8f6e3e">${escapeHtml(BRAND)}</p>
<h2 style="margin:0 0 16px">Hi ${escapeHtml(form.firstName)}, thanks for reaching out</h2>
<p style="margin:0 0 16px;line-height:1.5">We received your request and our team will contact you at ${escapeHtml(form.corporateEmail)} shortly.</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px">${tableRows}</table>
<p style="margin:16px 0 0;line-height:1.5">The attached PDF is a copy for your records.</p>
<p style="margin:16px 0 0;line-height:1.5">The ${escapeHtml(BRAND)} team</p>
</td></tr>
</table>
<p style="max-width:600px;margin:16px auto 0;font-size:12px;line-height:1.5;color:#888888;text-align:center">${escapeHtml(FOOTER)}</p>
</body>
</html>`;
}

export async function sendConfirmationEmail(form: CreateContactFormDTO, contactFormId: string): Promise<string> {
    const pdf = await generateSamplePdf();
    const rows = buildSummaryRows(form, toReference(contactFormId));

    const { data, error } = await resend.emails.send({
        from: env.EMAIL_FROM,
        to: form.corporateEmail,
        replyTo: env.EMAIL_REPLY_TO,
        subject: SUBJECT,
        html: buildConfirmationHtml(form, rows),
        text: buildConfirmationText(form, rows),
        attachments: [{ filename: "contact-request-confirmation.pdf", content: pdf }],
    });

    if (error || !data) {
        throw new Error(`Resend error: ${error?.message ?? "no data returned"}`);
    }
    return data.id;
}
