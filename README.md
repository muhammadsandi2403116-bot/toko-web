This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Auth.js Google OAuth

Authentication uses Google OAuth with database-backed Auth.js sessions. Set
`AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AUTH_SECRET`, `AUTH_URL`, and
`DATABASE_URL` in `.env`. Aiven's `ssl-mode=REQUIRED` enables encrypted
connections. For certificate and hostname verification, download the Aiven CA,
set `DATABASE_SSL_CA` to its local file path, and use
`ssl-mode=VERIFY_IDENTITY` in `DATABASE_URL`. Register this redirect URI in Google Cloud:

```text
http://localhost:3000/api/auth/callback/google
```

Apply the Prisma schema changes to the configured database with:

```bash
npx prisma migrate deploy
```

Session records expire after 30 days and are refreshed during normal session
use. Google OAuth accounts are stored in the `Account` table; the
`refresh_token` is kept server-side for future Google API access and must not
be sent to the browser.

## UNTUK ORANG ORANG YANG TAU AJA

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
