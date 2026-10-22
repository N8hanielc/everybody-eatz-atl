# Everybody Eatz ATL — Thanksgiving Food Drive Website

A three-page website for the Everybody Eatz ATL Thanksgiving food drive.

- **Home** (`/`) — event details, fundraising goal with live verified total, partners
- **Items** (`/items`) — grocery carousel and the list of items needed
- **Donate & Volunteer** (`/donate`) — Stripe donations, live progress, verified donor activity, volunteer sign-up, grocery-donation info

Built with Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion, Lucide icons, Stripe Checkout, and Supabase. Deploys to Vercel.

---

## Contents

1. [Install Node.js](#1-install-nodejs)
2. [Open the project in VS Code](#2-open-the-project-in-vs-code)
3. [Install dependencies](#3-install-dependencies)
4. [Create your environment file](#4-create-your-environment-file)
5. [Set up Supabase](#5-set-up-supabase)
6. [Create the database tables](#6-create-the-database-tables)
7. [Set up Stripe Checkout](#7-set-up-stripe-checkout)
8. [Set up and test the Stripe webhook](#8-set-up-and-test-the-stripe-webhook)
9. [Run the site locally](#9-run-the-site-locally)
10. [Test a donation](#10-test-a-donation)
11. [Test the volunteer form](#11-test-the-volunteer-form)
12. [Push to GitHub](#12-push-to-github)
13. [Deploy to Vercel](#13-deploy-to-vercel)
14. [Add environment variables on Vercel](#14-add-environment-variables-on-vercel)
15. [Connect a custom domain](#15-connect-a-custom-domain)
- [Editing content after launch](#editing-content-after-launch)
- [How donations are counted](#how-donations-are-counted)
- [Privacy and security](#privacy-and-security)
- [Project structure](#project-structure)
- [Troubleshooting](#troubleshooting)

> **Where do I type commands?** In VS Code, open the built-in terminal with **Terminal → New Terminal** (or <kbd>Ctrl</kbd>+<kbd>`</kbd>). It opens already inside the project folder. Every command in this guide is typed there and run with <kbd>Enter</kbd>.

---

## 1. Install Node.js

You need Node.js **18.18 or newer** (the current LTS, 22.x, is recommended).

1. Check whether you already have it — in any terminal run:
   ```bash
   node -v
   ```
   If it prints `v18.18.0` or higher, skip to step 2.
2. Otherwise download the **LTS** installer from <https://nodejs.org> and run it with the default options.
3. Close and reopen your terminal (and VS Code), then run `node -v` again to confirm.

## 2. Open the project in VS Code

1. Unzip the project somewhere easy to find, e.g. `Documents/everybody-eatz-atl`.
2. Open VS Code → **File → Open Folder…** → choose the `everybody-eatz-atl` folder (the one containing `package.json`).
3. If VS Code asks "Do you trust the authors?", click **Yes**.

## 3. Install dependencies

In the VS Code terminal:

```bash
npm install
```

This downloads everything listed in `package.json` into a `node_modules` folder and creates `package-lock.json`. It takes a minute or two. Commit `package-lock.json` to GitHub later — it locks exact versions.

## 4. Create your environment file

Secrets are kept in a file called `.env.local` that never goes to GitHub.

**macOS / Linux / Git Bash:**
```bash
cp .env.example .env.local
```
**Windows PowerShell:**
```powershell
Copy-Item .env.example .env.local
```

Open `.env.local` in VS Code. You'll fill in the values during steps 5–8. Here is what each one is:

| Variable | Required? | Secret? | Where to get it |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Yes | No | `http://localhost:3000` locally; your real URL in production |
| `NEXT_PUBLIC_DONATION_CURRENCY` | No | No | Defaults to `usd` |
| `STRIPE_SECRET_KEY` | Yes | **Yes** | Stripe Dashboard → Developers → API keys → Secret key (`sk_test_…`) |
| `STRIPE_WEBHOOK_SECRET` | Yes | **Yes** | Local: printed by `stripe listen`. Production: your webhook endpoint's Signing secret (`whsec_…`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | No | No | Not used by the current site; kept for future use |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | No | Supabase → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | No | No | Supabase → Project Settings → API Keys → anon/publishable key. Not used by the current site |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | **Yes** | Supabase → Project Settings → API Keys → service_role/secret key |

Rules:
- Anything starting with `NEXT_PUBLIC_` is visible in the browser — never put a secret in one.
- After editing `.env.local`, stop the dev server (<kbd>Ctrl</kbd>+<kbd>C</kbd>) and start it again so changes load.

## 5. Set up Supabase

Supabase stores verified donations and volunteer sign-ups.

1. Go to <https://supabase.com> → sign up (free) → **New project**.
2. Name it `everybody-eatz-atl`, set a strong database password (save it somewhere safe), pick a region near Atlanta (e.g. East US), click **Create**.
3. When it finishes, open **Project Settings → API** (on newer dashboards: **Project Settings → Data API** for the URL and **API Keys** for the keys):
   - Copy **Project URL** → paste into `NEXT_PUBLIC_SUPABASE_URL`
   - Copy the **service_role** key (sometimes labelled "secret" — click reveal) → paste into `SUPABASE_SERVICE_ROLE_KEY`
   - Optionally copy the **anon / publishable** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

> ⚠️ The service-role key can read and write everything. It is only used in server code in this project (`lib/supabase-admin.ts`, which is marked `server-only` so the build fails if it ever reaches the browser). Never paste it anywhere public.

## 6. Create the database tables

1. In Supabase, open **SQL Editor → New query**.
2. Open `supabase/schema.sql` from this project in VS Code, select all, copy.
3. Paste into the Supabase SQL editor and click **Run**. You should see "Success. No rows returned".
4. Open **Table Editor** — you'll see `donations` and `volunteers` (plus two read-only helper views, `volunteer_signups_readable` and `donation_totals`).

What the schema does:
- `donations` — one row per **verified** Stripe payment. `stripe_checkout_session_id` and `stripe_payment_intent_id` are **unique**, so a payment can never be counted twice. Amounts are stored in cents (`amount_cents`).
- `volunteers` — one row per sign-up.
- **Row Level Security is on with no public policies**, so the public anon key cannot read or write either table. Only the website's server code (service-role key) and you in the dashboard can see the data.

**Viewing volunteers:** Table Editor → `volunteers` (or the friendlier `volunteer_signups_readable` view). You can export to CSV with the **Export** button.

The script is safe to run again if you need to.

## 7. Set up Stripe Checkout

1. Sign up at <https://dashboard.stripe.com/register>.
2. Make sure **Test mode** is ON (toggle in the dashboard header) while developing.
3. Go to **Developers → API keys** and copy the **Secret key** (`sk_test_…`) → paste into `STRIPE_SECRET_KEY`.
4. (Optional) Under **Settings → Business → Public details**, set the business name and support email that donors will see on the Checkout page and receipts.
5. (Optional) Under **Settings → Customer emails**, turn on **Successful payments** so donors get email receipts.

You don't need to create products in Stripe — the site creates the donation line item on the fly with the amount the donor chose, after validating it on the server ($1 minimum, $10,000 maximum — change in `config/site.ts`).

## 8. Set up and test the Stripe webhook

The webhook is how Stripe tells the site "this payment really succeeded". **It is the only thing that adds money to the total.**

### Locally (with the Stripe CLI)

1. Install the Stripe CLI: <https://docs.stripe.com/stripe-cli> (macOS: `brew install stripe/stripe-cli/stripe`; Windows: download from the releases page or use Scoop).
2. Log in:
   ```bash
   stripe login
   ```
3. Open a **second** terminal in VS Code (the **+** icon in the terminal panel) and run:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe-webhook
   ```
   (or the shortcut `npm run stripe:listen`).
4. It prints `Your webhook signing secret is whsec_…`. Copy that into `STRIPE_WEBHOOK_SECRET` in `.env.local`, then restart `npm run dev`.
5. Leave `stripe listen` running while you test donations.

### In production (after deploying to Vercel)

1. Stripe Dashboard → **Developers → Webhooks → Add endpoint** (in newer dashboards: **Workbench → Webhooks → Add destination**).
2. Endpoint URL: `https://YOUR-DOMAIN/api/stripe-webhook`
3. Select these events:
   - `checkout.session.completed`
   - `checkout.session.async_payment_succeeded`
   - `charge.refunded`
4. Save, then reveal the endpoint's **Signing secret** (`whsec_…`) and put it in Vercel's `STRIPE_WEBHOOK_SECRET` (step 14). Do this once for test mode and again for live mode when you go live — each mode has its own secret.

## 9. Run the site locally

```bash
npm run dev
```

Open <http://localhost:3000>. The site works even before Stripe/Supabase are configured: the total shows **$0**, and the donate/volunteer forms show a friendly "not available yet" message instead of breaking.

Other useful commands:

```bash
npm run build      # production build — run before pushing to catch errors
npm run start      # serve the production build locally
npm run typecheck  # TypeScript check only
```

## 10. Test a donation

With `npm run dev` **and** `stripe listen` both running:

1. Go to <http://localhost:3000/donate>, choose **$40**, pick a display option, click **Donate Now**.
2. On Stripe Checkout use test card **4242 4242 4242 4242**, any future expiry (e.g. 12/34), any CVC, any ZIP.
3. You're redirected to the thank-you page. In the `stripe listen` terminal you'll see `checkout.session.completed` → `[200]`.
4. Back on `/donate` (refresh, or wait up to 30 seconds) the total shows **$40** and the donor activity line appears.
5. In Supabase → Table Editor → `donations`, you'll see the row.

Also try:
- **Cancel** on the Stripe page → you land on `/donate/cancel` and nothing is recorded.
- Card **4000 0000 0000 0002** (declined) → nothing is recorded.
- Refund the test payment in the Stripe dashboard → the donation is marked `refunded` and drops out of the total.

## 11. Test the volunteer form

1. Go to <http://localhost:3000/donate#volunteer>.
2. Click **Sign Up to Volunteer** with empty fields → you'll see helpful error messages.
3. Fill in name, email, role, availability → submit → the thank-you message appears.
4. Check Supabase → Table Editor → `volunteers` for the new row.

(Submissions within ~2.5 seconds of page load are silently ignored as likely bots — take a normal few seconds to fill it in.)

## 12. Push to GitHub

1. Create a free account at <https://github.com> and click **New repository**. Name it `everybody-eatz-atl`, keep it **Private** if you like, and **don't** add a README (this project has one). Click **Create repository**.
2. If you've never used Git on this computer, install it from <https://git-scm.com> and set your name/email once:
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "you@example.com"
   ```
3. In the VS Code terminal (project folder):
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Everybody Eatz ATL site"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/everybody-eatz-atl.git
   git push -u origin main
   ```
4. Before pushing, double-check that `.env.local` is **not** listed when you run `git status` — it's excluded by `.gitignore`.

## 13. Deploy to Vercel

1. Sign up at <https://vercel.com> with your GitHub account.
2. **Add New… → Project** → import `everybody-eatz-atl`.
3. Vercel detects Next.js automatically. Before clicking **Deploy**, open **Environment Variables** and add them (step 14).
4. Click **Deploy**. In ~1–2 minutes you'll get a URL like `https://everybody-eatz-atl.vercel.app`.
5. Set up the production webhook (step 8, "In production") using that URL.

Every future `git push` to `main` redeploys automatically.

## 14. Add environment variables on Vercel

Vercel → your project → **Settings → Environment Variables**. Add each one (Environment: **Production**, and **Preview** if you want preview deployments to work too):

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://everybody-eatz-atl.vercel.app` (or your custom domain) |
| `NEXT_PUBLIC_DONATION_CURRENCY` | `usd` |
| `STRIPE_SECRET_KEY` | your `sk_test_…` (switch to `sk_live_…` when you go live) |
| `STRIPE_WEBHOOK_SECRET` | the signing secret of the **production** webhook endpoint |
| `NEXT_PUBLIC_SUPABASE_URL` | your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | your Supabase service-role key |

After adding or changing variables, go to **Deployments → ⋯ → Redeploy** so they take effect.

**Going live with real money:** in Stripe, finish account activation, switch off Test mode, copy the live secret key, create a live-mode webhook endpoint, update both Stripe variables on Vercel, and redeploy. Make one small real donation to confirm, then refund it.

## 15. Connect a custom domain

1. Buy a domain (e.g. from Namecheap, Cloudflare, Google/Squarespace Domains).
2. Vercel → project → **Settings → Domains → Add** → enter the domain.
3. Vercel shows the DNS records to add (usually an `A` record for the root and a `CNAME` for `www`). Add them at your domain registrar.
4. Wait for the green "Valid Configuration" check (minutes to a few hours).
5. Update `NEXT_PUBLIC_SITE_URL` on Vercel to the new domain and redeploy.
6. Update the Stripe webhook endpoint URL to the new domain (or add a second endpoint and update `STRIPE_WEBHOOK_SECRET`).

---

## Editing content after launch

Almost everything lives in **`config/site.ts`** — edit, save, commit, push, and Vercel redeploys.

| To change… | Edit in `config/site.ts` |
|---|---|
| Event date, time, location, address | `event` |
| Fundraising goal, donation options, min/max | `fundraising` |
| Partner names/logos | `partners` (logo files go in `public/images/partners/`) |
| Grocery carousel items, prices, photos | `groceries.carousel` (photos go in `public/images/items/`) |
| "Additional Items Needed" list | `groceries.additional` |
| Grocery drop-off status | `dropOff` — set `confirmed: true` and fill `confirmedDetails` once approved |
| Volunteer roles/availability options | `volunteer` (if you add new values, also update the `check` constraints in `supabase/schema.sql`) |
| Tax-deductible wording | `fundraising.taxDeductibleConfirmed` — leave `false` until legal status is confirmed |
| Navigation | `nav` |

See `public/images/README.md` for adding product photos, partner logos, the closing photo, and official social-sharing artwork.

## How donations are counted

1. Donor picks an amount → the browser calls `POST /api/donations`.
2. The server validates the amount and creates a Stripe Checkout Session (secret key stays on the server). **Nothing is recorded yet.**
3. Donor pays on Stripe's hosted page.
4. Stripe calls `POST /api/stripe-webhook`. The server **verifies the signature**, confirms `payment_status = paid`, and inserts one row into `donations`. Duplicate events are ignored thanks to the unique constraints.
5. The total on `/` and `/donate` = sum of `paid` rows ÷ goal, capped at 100%. Pages refresh immediately after a verified donation and at least every 60 seconds; the donate page also polls every 30 seconds.

Clicking Donate, abandoning checkout, or visiting the success page never changes the total. Full refunds (`charge.refunded`) remove a donation from the total; partial refunds are not subtracted automatically.

## Privacy and security

- Secret keys are only read in server files (`lib/stripe.ts`, `lib/supabase-admin.ts`), which import `server-only`.
- Public endpoints return only the aggregate total and donor display names donors opted into (first name + last initial). Emails, full names, and payment details are never displayed.
- Volunteer data is write-only from the website; RLS blocks all public reads.
- Spam protection on the volunteer form: hidden honeypot field, minimum fill time, server-side validation, and a light per-IP rate limit.
- The site makes no tax-deductibility claim and labels grocery drop-off as pending until you confirm it in config.

## Project structure

```
app/
  layout.tsx                 Fonts, metadata, header/footer
  page.tsx                   Home
  items/page.tsx             Thanksgiving items
  donate/page.tsx            Donate & volunteer
  donate/success/page.tsx    After a completed checkout
  donate/cancel/page.tsx     After a canceled checkout
  api/donations/route.ts     GET public summary · POST create Stripe Checkout
  api/stripe-webhook/route.ts  Verified payment → Supabase
  api/volunteers/route.ts    Volunteer sign-up → Supabase
  opengraph-image.tsx        Placeholder social image
  sitemap.ts, robots.ts, error.tsx, not-found.tsx, loading.tsx
components/
  header.tsx, footer.tsx, logo.tsx, reveal.tsx, providers.tsx
  home/        hero, event-info, fundraising-goal, partner-logos, closing-section
  items/       grocery-carousel, grocery-item-card, grocery-illustration, additional-items-grid
  donate/      donation-form, donation-progress, progress-bar, donor-activity, volunteer-form, grocery-donation-info
  decor/       leaf icons, floating leaves, harvest illustration
  ui/          loading, error, and success messages
config/site.ts               ← edit content here
lib/                         Stripe/Supabase clients, validation, formatting, donation summary
supabase/schema.sql          Database tables + security
public/images/               Your photos and logos
```

## Troubleshooting

| Problem | Fix |
|---|---|
| `npm install` fails with peer-dependency errors | Run `npm install --legacy-peer-deps` |
| "Online donations aren't available yet" | `STRIPE_SECRET_KEY` missing — add it and restart `npm run dev` |
| "Volunteer sign-up isn't available yet" | `NEXT_PUBLIC_SUPABASE_URL` or `SUPABASE_SERVICE_ROLE_KEY` missing |
| Paid, but total stays $0 | `stripe listen` not running locally, or wrong `STRIPE_WEBHOOK_SECRET`. Check the listen terminal / Stripe webhook logs for non-200 responses |
| Webhook returns 400 "Invalid signature" | The `whsec_…` doesn't match the endpoint (each `stripe listen` session and each dashboard endpoint has its own) |
| Webhook returns 500 | Usually Supabase not configured or the schema wasn't run. Stripe retries automatically for up to 3 days once fixed |
| Changes to `.env.local` ignored | Stop (<kbd>Ctrl</kbd>+<kbd>C</kbd>) and restart `npm run dev` |
| Changes on Vercel not showing | Redeploy after editing environment variables |
