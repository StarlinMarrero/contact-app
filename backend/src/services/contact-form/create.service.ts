import createHttpError from "http-errors";
import { CreateContactFormDTO } from "../../controllers/contact-form/dto/create.dto";
import { ContactFormEntity } from "../../database/entities/entity/contact-form.entity";
import { IResServices } from "../../interfaces/services/services.interface";
import { sendConfirmationEmail } from "../email/email.service";

interface ICreateService {
    payload: CreateContactFormDTO;
}

interface ICreatedContactForm {
    id: string;
    createdAt: Date;
    emailSent: boolean;
}

export default async ({ payload }: ICreateService): Promise<IResServices<ICreatedContactForm>> => {
    try {
        const contactForm = await ContactFormEntity.create(payload).save();

        const emailId = await sendConfirmationEmail(payload, contactForm.uuid).catch((error) => {
            console.error(`🚨 Failed to send confirmation email for contact form ${contactForm.uuid}:`, error);
            return null;
        });

        await ContactFormEntity.update(contactForm.id, { emailStatus: emailId ? "sent" : "failed", emailId }).catch((error) => {
            console.error(`🚨 Failed to update email status for contact form ${contactForm.uuid}:`, error);
        });

        return {
            data: { id: contactForm.uuid, createdAt: contactForm.createdAt, emailSent: emailId !== null },
        };
    } catch (error) {
        return { error: createHttpError(500, error as Error) };
    }
};
