# Contact Form API

Express + TypeScript + PostgreSQL (TypeORM) backend that stores contact form submissions and sends a
confirmation email (with a PDF attachment) to the submitter's corporate email via [Resend](https://resend.com).

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create the database:
   ```bash
   psql -U postgres -c "CREATE DATABASE contact_forms"
   ```
3. Edit `.env` (see `.env.example`):
   - `DATABASE_*` – your Postgres connection.
   - `RESEND_API_KEY` – from https://resend.com/api-keys
   - `EMAIL_FROM` – `onboarding@resend.dev` works in sandbox mode, but **only delivers to the email that owns
     the Resend account**. Verify a domain in Resend to send to any address.
   - `EMAIL_REPLY_TO` (optional) – a real, monitored mailbox that receives replies.

## Email deliverability (inbox, not spam)

Every confirmation email is sent with an HTML and a plain-text version and a complete HTML document.
It only echoes structured fields (reference, business type, company, name, reasons); free text and URLs typed
into the form (title, website, message) are stored but never repeated in the email, because filters match on them.
Test with realistic data: lorem ipsum and random URLs from form fillers are themselves classified as spam.
Where it lands depends mostly on the sending domain's DNS:

| Record | Host                            | Value                                                     |
| ------ | ------------------------------- | --------------------------------------------------------- |
| DKIM   | `resend._domainkey.<domain>`    | from the Resend dashboard                                 |
| SPF    | `send.<domain>` (TXT + MX)      | from the Resend dashboard                                 |
| DMARC  | `_dmarc.<domain>`               | `v=DMARC1; p=none; rua=mailto:dmarc@<domain>` (required by Gmail/Yahoo) |

Also: send from a real address (not `onboarding@`), keep the domain's volume steady, and check the score with
https://www.mail-tester.com and Google Postmaster Tools.
4. Run the migrations:
   ```bash
   npm run m:run
   ```
5. Start:
   ```bash
   npm run dev          # watch mode
   npm run build && npm start
   ```

## Project structure

```
src/
├── routers/                 # index → /api → per-domain routers
│   ├── api/contact-form/    # POST /api/contact-forms
│   └── public/              # GET /health
├── controllers/
│   └── contact-form/
│       ├── contact-form.controller.ts  # validates the request, calls the service
│       └── dto/create.dto.ts           # zod schema + CreateContactFormDTO type
├── services/                # business logic, return { data, error }
│   ├── contact-form/create.service.ts
│   ├── email/email.service.ts          # Resend
│   └── pdf/pdf.service.ts              # pdfkit
├── middlewares/             # error handler, rate limit
├── database/                # TypeORM (see below)
├── constants/ interfaces/ config/
├── app.ts                   # express app
└── server.ts                # connects DB, starts HTTP server
```

To add an endpoint: route in `routers/api/<domain>` → method in `controllers/<domain>` → one file per action in `services/<domain>`.

## Database

```
src/database/
├── connections/
│   ├── index.ts          # DataSource (also used by the TypeORM CLI)
│   └── ormconfig.ts      # connection options from .env
├── entities/
│   ├── entity/           # *.entity.ts
│   └── extends/
│       └── base.extend.ts  # id, uuid, createdAt, updatedAt, deletedAt
└── migrations/           # <timestamp>-<name>.ts
```

`synchronize` is off; the schema only changes through migrations.

| Command                                 | Description                                                    |
| --------------------------------------- | -------------------------------------------------------------- |
| `npm run m:generate --name=AddSomething` | Generate a migration from the diff between entities and the DB |
| `npm run m:create --name=Something`      | Create an empty migration                                      |
| `npm run m:run`                          | Run pending migrations                                         |
| `npm run m:revert`                       | Revert the last migration                                      |
| `npm run m:show`                         | List migrations and whether they ran                           |
| `npm run m:run:prod`                     | Run migrations from the compiled `dist` (after `npm run build`) |

On macOS/Linux use `m:generate:mac` / `m:create:mac`.

Workflow for schema changes: edit the entity → `npm run m:generate --name=Xxx` → review the file → `npm run m:run`.

Entity column types are always declared explicitly (`@Column({ type: 'varchar' })`), because `tsx`
does not emit decorator metadata.

## Endpoints

### `GET /health`
Returns `{ "status": "ok" }`.

### `POST /api/contact-forms`

Rate limited to 20 requests per 15 minutes per IP.

```json
{
  "businessType": "storefront",
  "companyName": "Acme Inc",
  "website": "acme.com",
  "firstName": "Jane",
  "lastName": "Doe",
  "title": "Buyer",
  "corporateEmail": "jane@acme.com",
  "corporatePhone": "+1 809 555 0100",
  "mobile": "",
  "reasons": ["retail_perfumery_partnership", "product_purchase"],
  "message": "Hello!"
}
```

| Field            | Required | Values                                                                              |
| ---------------- | -------- | ----------------------------------------------------------------------------------- |
| `businessType`   | yes      | `storefront`, `online_store`, `storefront_online_store`                             |
| `companyName`    | yes      |                                                                                     |
| `website`        | no       | e.g. `example.com` or `https://example.com`                                         |
| `firstName`      | yes      |                                                                                     |
| `lastName`       | yes      |                                                                                     |
| `title`          | yes      |                                                                                     |
| `corporateEmail` | yes      | valid email                                                                         |
| `corporatePhone` | *        | *at least one of `corporatePhone` / `mobile`                                        |
| `mobile`         | *        |                                                                                     |
| `reasons`        | yes      | 1+ of `retail_perfumery_partnership`, `product_purchase`, `customer_support`, `other` |
| `message`        | no       | max 5000 chars                                                                      |

Empty strings / `null` are treated as "not provided".

**201 Created**
```json
{ "id": "5f0c6c1e-3c1a-4d7e-9a57-0a8f5b8f2b6e", "createdAt": "2026-09-10T15:00:00.000Z", "emailSent": true }
```
The submission is saved even if the email fails; `emailSent` tells you whether it went out
(also stored in the `emailStatus` column).

**400 Bad Request**
```json
{
  "error": {
    "code": 400,
    "message": "Error validation",
    "details": {
      "corporateEmail": ["Invalid email address"],
      "corporatePhone": ["Please provide at least one phone number (Corporate Phone or Mobile)"]
    }
  }
}
```

Every error uses the same `{ "error": { "code", "message" } }` shape (400 validation / malformed JSON,
404 not found, 429 rate limited, 500 server error). Errors are `http-errors` instances (`createHttpError(404, "...")`)
passed to `next()`; `middlewares/error-handler.middleware.ts` formats them. 5xx messages are never sent to the client.

## Calling from the Expo app

A physical device can't reach `localhost` — use your machine's LAN IP, e.g. `http://192.168.1.20:3000`
(Android emulator: `http://10.0.2.2:3000`).
