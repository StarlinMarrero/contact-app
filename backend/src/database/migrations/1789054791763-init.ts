import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1789054791763 implements MigrationInterface {
  name = 'Init1789054791763';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(
      `CREATE TYPE "public"."contact_form_business_type_enum" AS ENUM('storefront', 'online_store', 'storefront_online_store')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."contact_form_reason_enum" AS ENUM('retail_perfumery_partnership', 'product_purchase', 'customer_support', 'other')`,
    );
    await queryRunner.query(`CREATE TYPE "public"."contact_form_email_status_enum" AS ENUM('pending', 'sent', 'failed')`);
    await queryRunner.query(
      `CREATE TABLE "contact-forms" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "businessType" "public"."contact_form_business_type_enum" NOT NULL, "companyName" character varying(200) NOT NULL, "website" character varying(255), "firstName" character varying(100) NOT NULL, "lastName" character varying(100) NOT NULL, "title" character varying(100) NOT NULL, "corporateEmail" character varying(254) NOT NULL, "corporatePhone" character varying(30), "mobile" character varying(30), "reasons" "public"."contact_form_reason_enum" array NOT NULL, "message" text, "emailStatus" "public"."contact_form_email_status_enum" NOT NULL DEFAULT 'pending', "emailId" character varying, CONSTRAINT "CHK_contact_forms_phone_required" CHECK ("corporatePhone" IS NOT NULL OR "mobile" IS NOT NULL), CONSTRAINT "PK_7bbdd75e2e249f8d6ee7f6eadf9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "idx_contact_forms_corporate_email" ON "contact-forms" ("corporateEmail") `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."idx_contact_forms_corporate_email"`);
    await queryRunner.query(`DROP TABLE "contact-forms"`);
    await queryRunner.query(`DROP TYPE "public"."contact_form_email_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."contact_form_reason_enum"`);
    await queryRunner.query(`DROP TYPE "public"."contact_form_business_type_enum"`);
  }
}
