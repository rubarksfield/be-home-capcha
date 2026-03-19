# Be Home Cascais Guest WiFi Portal

Production-ready external captive portal for a UniFi guest WiFi network, built with Next.js App Router, TypeScript, Tailwind CSS, Prisma, and Supabase Postgres.

## Proposed file tree

```text
.
├── app
│   ├── admin
│   │   ├── leads
│   │   │   ├── actions.ts
│   │   │   └── page.tsx
│   │   └── login
│   │       ├── actions.ts
│   │       └── page.tsx
│   ├── api
│   │   └── portal
│   │       ├── retry
│   │       │   └── route.ts
│   │       └── submit
│   │           └── route.ts
│   ├── icon.svg
│   ├── layout.tsx
│   ├── page.tsx
│   ├── portal
│   │   └── page.tsx
│   ├── privacy
│   │   └── page.tsx
│   ├── success
│   │   └── page.tsx
│   └── terms
│       └── page.tsx
├── components
│   ├── admin
│   │   ├── leads-table.tsx
│   │   ├── login-form.tsx
│   │   └── logout-button.tsx
│   ├── portal
│   │   ├── brand-mark.tsx
│   │   ├── footer-links.tsx
│   │   ├── lead-form.tsx
│   │   ├── legal-page.tsx
│   │   ├── portal-copy.tsx
│   │   ├── success-content.tsx
│   │   └── trust-pill.tsx
│   └── ui
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── checkbox.tsx
│       ├── input.tsx
│       ├── label.tsx
│       └── table.tsx
├── lib
│   ├── auth
│   │   └── admin.ts
│   ├── constants
│   │   └── site.ts
│   ├── portal
│   │   └── query.ts
│   ├── services
│   │   ├── leads.ts
│   │   └── unifi
│   │       ├── index.ts
│   │       ├── live.ts
│   │       ├── mock.ts
│   │       └── types.ts
│   ├── validation
│   │   └── portal.ts
│   ├── db.ts
│   ├── env.ts
│   └── utils.ts
├── prisma
│   └── schema.prisma
├── .env.example
├── components.json
├── eslint.config.mjs
├── middleware.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

## Architecture summary

- `/portal` renders the branded captive portal experience and reads UniFi query params directly from the redirect URL.
- `app/api/portal/submit/route.ts` validates the lead payload with Zod, stores the submission via Prisma, then calls a UniFi authorizer abstraction.
- `lib/services/unifi` exposes two modes:
  - `mock` for local development and end-to-end testing
  - `live` for production controller integration
- `/success` confirms connection and optionally redirects the guest to the original destination or a configured default URL.
- `/admin/leads` is protected with a minimal password flow backed by an HTTP-only session cookie and lists recent submissions.

## Features included

- Original Be Home-aligned visual design with warm neutrals, soft sage accents, rounded cards, subtle gradients, and calm copy
- Mobile-first portal flow with inline validation, loading states, retry authorization, and an anti-bot honeypot
- Prisma schema for lead capture and UniFi metadata
- Google Sheets syncing for lead capture
- Supabase-compatible Postgres configuration
- Simple protected admin dashboard
- Placeholder `/privacy` and `/terms` pages
- Ready for Vercel deployment

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Copy the environment file and fill in values:

```bash
cp .env.example .env
```

3. Generate the Prisma client:

```bash
npm run prisma:generate
```

4. Push the schema to your database:

```bash
npm run prisma:push
```

5. Start the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000/portal](http://localhost:3000/portal)

For local testing with sample UniFi parameters, try a URL like:

```text
http://localhost:3000/portal?ap=AA:BB:CC:DD:EE:FF&mac=11:22:33:44:55:66&ip=192.168.1.100&ssid=BeHomeGuest&site=default&t=1699999999&url=https%3A%2F%2Fwww.behomecascais.com
```

## Supabase setup

1. Create a new Supabase project.
2. Copy the pooled or direct Postgres connection string into `DATABASE_URL`.
3. Ensure SSL is enabled in the connection string, for example `sslmode=require`.
4. Run `npm run prisma:push` to create the `Lead` table.

## Prisma commands

```bash
npm run prisma:generate
npm run prisma:push
npm run prisma:migrate
npm run prisma:studio
```

`prisma:push` is the quickest option for initial setup. If you want migration files for a team workflow, switch to `prisma:migrate`.

## Environment variables

Required values are documented in [.env.example](./.env.example).

Important variables:

- `DATABASE_URL`: Supabase Postgres connection string
- `NEXT_PUBLIC_SITE_URL`: the deployed portal URL, such as `https://wifi.behomecascais.com`
- `PORTAL_DEFAULT_REDIRECT_URL`: fallback destination after successful login
- `ADMIN_PASSWORD`: password for `/admin/login`
- `ADMIN_SESSION_SECRET`: used to sign the admin cookie
- `UNIFI_AUTH_MODE`: `mock` or `live`
- `UNIFI_BASE_URL`: your UniFi controller base URL
- `UNIFI_USERNAME` and `UNIFI_PASSWORD`: service account credentials
- `UNIFI_SITE`: default site name for authorization requests
- `UNIFI_AUTH_DURATION_MINUTES`: guest access duration
- `UNIFI_BRIDGE_URL`: optional public bridge endpoint for local-network UniFi controllers
- `UNIFI_BRIDGE_TOKEN`: bearer token shared between the portal app and the bridge
- `GOOGLE_SHEETS_CLIENT_EMAIL`: Google service account email
- `GOOGLE_SHEETS_PRIVATE_KEY`: Google service account private key
- `GOOGLE_SHEETS_SPREADSHEET_ID`: target spreadsheet ID
- `GOOGLE_SHEETS_SHEET_NAME`: worksheet tab name, defaults to `Leads`

## Google Sheets setup

1. Create a Google Sheet for lead capture.
2. Add a worksheet tab named `Leads` or set your own tab name in `GOOGLE_SHEETS_SHEET_NAME`.
3. Create a Google Cloud service account with the Google Sheets API enabled.
4. Share the spreadsheet with the service account email as an editor.
5. Add these Vercel environment variables:

```env
GOOGLE_SHEETS_CLIENT_EMAIL=service-account@project-id.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_SPREADSHEET_ID=your-sheet-id
GOOGLE_SHEETS_SHEET_NAME=Leads
```

Each new lead is appended as a row with timestamp, name, email, consent flags, network metadata, and authorization status. If Sheets is not configured, the portal still works and logs are still stored in Postgres.

## Mock vs live UniFi auth mode

### Mock mode

Use this in local development:

```env
UNIFI_AUTH_MODE="mock"
```

In mock mode, submissions are stored and the app behaves like a successful authorization without contacting a controller.

### Live mode

Use this in production:

```env
UNIFI_AUTH_MODE="live"
```

The live adapter currently uses:

- `POST /api/auth/login`
- `POST /proxy/network/api/s/{site}/cmd/stamgr` with `cmd: "authorize-guest"`

UniFi API behaviour can vary by controller version and UniFi OS generation. The adapter in [`lib/services/unifi/live.ts`](./lib/services/unifi/live.ts) is structured so another engineer can update endpoint paths or payload details without touching the portal UI or persistence layer.

### Live mode with a local-network controller

If your UniFi controller only exists on a private LAN address such as `https://192.168.3.1`, Vercel cannot reach it directly. In that case, run the included bridge script on a machine that can see the controller.

1. Run the bridge on a LAN machine:

```bash
node scripts/unifi-bridge-server.mjs
```

2. Set these bridge machine env vars:

```env
UNIFI_BASE_URL=https://192.168.3.1
UNIFI_USERNAME=your-controller-username
UNIFI_PASSWORD=your-controller-password
UNIFI_SITE=default
UNIFI_BRIDGE_TOKEN=replace-with-a-long-random-token
PORT=8787
```

3. Expose that bridge securely through a public URL you control.

4. In Vercel, set:

```env
UNIFI_AUTH_MODE=live
UNIFI_BRIDGE_URL=https://your-bridge-host/authorize-guest
UNIFI_BRIDGE_TOKEN=replace-with-the-same-token
```

5. Leave `UNIFI_BASE_URL` on Vercel empty when using the bridge. The bridge machine handles the local controller connection.

## UniFi external portal configuration

In UniFi Network:

1. Enable the guest hotspot / portal for the relevant WiFi network.
2. Choose **External Portal Server**.
3. Set the external portal URL to:

```text
https://your-portal-domain.com/portal
```

4. Confirm UniFi is configured to append its guest redirect query parameters.
5. Ensure the captive portal domain is reachable by guest devices before authorization.
6. If required by your network setup, allowlist the portal domain in pre-auth settings so guests can load the form page.

To make the live authorization flow work in deployment:

1. Set `UNIFI_AUTH_MODE=live` in Vercel.
2. Add `UNIFI_BASE_URL`, `UNIFI_USERNAME`, `UNIFI_PASSWORD`, `UNIFI_SITE`, and `UNIFI_AUTH_DURATION_MINUTES`.
3. Use a UniFi account with permission to authorize guest clients.
4. Point UniFi’s external portal URL to your deployed `/portal` route.
5. Test on the actual guest SSID and confirm the redirect includes `mac`, `ap`, `ip`, `ssid`, `site`, and `url`.
6. If your UniFi controller version uses different endpoints, update [`lib/services/unifi/live.ts`](./lib/services/unifi/live.ts).

Common redirect parameters supported by this app include:

- `id`
- `ap`
- `t`
- `url`
- `ssid`
- `site`
- `mac`
- `ip`

All received query params are stored in `rawQueryParams` for debugging and controller-version differences.

## Vercel deployment

1. Push this repository to GitHub.
2. Import the project into Vercel.
3. Add all environment variables from `.env.example`.
4. Set the production `NEXT_PUBLIC_SITE_URL`.
5. Ensure the database is reachable from Vercel.
6. Run `npm run prisma:generate` during build automatically via `postinstall`.
7. After the first deploy, run `npm run prisma:push` or `npm run prisma:migrate` against the production database.

If you prefer, you can also use a Vercel build step plus a separate migration workflow in CI.

## Notes for handoff

- The privacy and terms pages are intentionally production-shaped placeholders and should be replaced with final legal copy before launch.
- The admin area uses a simple env-backed password flow suitable for a small v1. For multi-user admin access, swap this for proper auth.
- The retry endpoint is useful when the lead is stored successfully but UniFi authorization fails on the first attempt.
