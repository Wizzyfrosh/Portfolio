# Portfolio upgrades — staging checklist

**Never merge this PR before running the migrations and confirming a successful preview build.** The existing live deployment and old data must remain intact.

## Features in this branch

- Editable project case-study fields (challenge / solution / process / results) on the existing Projects admin form. Optional; regular projects still work.
- Full splash animation **once per browser** (localStorage key `froshcodeorbit_splash_seen_v1`). Refresh/revisits use a simple spinner, and Next.js route-level loading has a spinner.
- Resume admin uploader validates PDF (<=10 MB), stores it in Supabase, and **immediately persists** the public URL to `profiles`. The public `/resume` page already loads this URL. The unused homepage component now links to the actual uploaded URL instead of the missing `/resume.pdf`.
- Website template store: `/store`, `/store/[slug]`, `/store/complete` and admin pages `/admin/templates`, `/admin/templates/new`, `/admin/templates/[id]/edit`.
- Paystack server-only checkout / verify endpoints. A valid payment and matched reference/email/amount/currency are required before a **120-second signed download link** is issued. ZIP files are private.

## Supabase migrations: applied and verified on 14 October 2026

These changes have already been applied to **My Portfolio Website** in Supabase (project ref `tbrizmndydegsykqtnwj`). Do not re-run them as a routine deployment step:

1. Four optional case study columns on `public.projects`.
2. Missing authenticated INSERT and UPDATE permissions on `public.profiles` (existing `profile` bucket and storage permissions were preserved).
3. `public.website_templates`, `public.template_orders`, and private `template-files` storage bucket.
4. `migrations/20261014_portfolio_admin_hardening.sql`: a `portfolio_admins` registry containing the single existing auth user, plus an owner-only permission check for profile writes, template management, and template ZIP access.

Database verification after the changes: 7 existing projects, 1 existing profile, 0 templates, 0 orders. Public files and prior project records were not deleted.

**Note:** The previous `20261014_resume_storage_fix.sql` in this branch is a reference migration, but the actual database update was narrower: only missing profile-table write permissions were added, since the bucket and storage policies were already present. The subsequent admin-hardening migration replaced those broad profile write permissions with owner-only permissions.

## REQUIRED: Vercel Environment Variables

Set these in Vercel Settings → Environment Variables, separately for Preview and Production when ready:

- `NEXT_PUBLIC_SUPABASE_URL` (existing)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (existing)
- `SUPABASE_SERVICE_ROLE_KEY` (SECRET; obtain from Supabase project dashboard; **never expose in client code or GitHub**)
- `PAYSTACK_SECRET_KEY` (SECRET; start with Paystack test secret key; do not place in `NEXT_PUBLIC_` variables)

Use Paystack test mode first. Never enter live keys until test purchases and private delivery work end-to-end. The storefront can render without keys but checkout responds with unavailable.

## Suggested acceptance tests

1. `npm ci && npm run build` on a preview environment. Run typecheck `npx tsc --noEmit`.
2. Test landing page, admin login, blog editing, existing projects and dynamic SEO.
3. Publish a new project with case study fields. Edit/clear those fields. Verify output on `/projects/[id]` and that old projects remain unchanged.
4. Open homepage in a clean browser: full splash once; refresh: no repeated splash; other pages: loading spinner.
5. Upload a real PDF on Admin → Profile. Confirm a new URL is saved and the download works from `/resume`. Confirm a non-PDF fails.
6. Create a **draft** template with original/authorized ZIP, cover image, price in NGN. Publish only for a test. Inspect store pages, preview, checkout, callback verification, invalid email/reference and unpaid attempts.
7. Use Paystack **test** purchase, verify signed URL access expires; check orders show the correct amount. Change template price and retry a previously initialized purchase; order verification must use original stored amount.
8. Ensure the ZIP cannot be fetched from public storage URL, and secrets never reach browser bundles.
9. Check mobile navigation, dark mode, browser console and Vercel logs.
10. Only then approve and merge the PR.

## Notes

- The initial resume problem was an inconsistent link: `/resume.pdf` was referenced but wasn't in `public/`. The upload code also did not save its URL until an extra click; a missing bucket/policy could cause an upload failure. SQL fixes bucket access where needed.
- Paystack verification is implemented using the official `transaction/verify/:reference` endpoint. Customers must return to the completion page and verify to get the file. A signed Paystack webhook has been implemented for `charge.success`, along with `/store/recover`. Transactional email and order-management are not enabled yet.
- The public template catalog is separate from client case studies, preventing accidentally listing client-owned projects as downloadable merchandise.
- Your prior draft Meta catalog PR #5 remains independent and is not included here.
- Template and profile mutations are now restricted to the existing portfolio admin account. Legacy project and blog policies still use their existing authenticated-user convention; audit those separately before adding any additional auth users.

## Vercel access limitation (current)

The connected Vercel integration returned an authorization error for environment-variable metadata on the `froshcodeorbit` project. Complete secret configuration manually through the Vercel dashboard. Do not paste private keys into ChatGPT, GitHub, screenshots, or public issue comments. A Paystack TEST checkout was completed successfully on 15 Oct 2026, with the order verified and ZIP opened by the owner. The webhook itself has not yet been tested. Vercel Preview SSO protection prevents unauthenticated webhook delivery on preview domains.

## 2026-10-14 Database migration status

Applied in Supabase **My Portfolio Website** (`tbrizmndydegsykqtnwj`): case-study fields, portfolio resume profile write policies (using existing working `profile` storage bucket rather than recreating it), marketplace tables/private bucket, and owner-only admin hardening. Originally verified 7 projects, 1 profile, 1 admin. Subsequently 1 template and a successful TEST order were verified. Do **not** rerun `20261014_resume_storage_fix.sql` as-is: the live environment needed a different, less disruptive change to `profiles` insert/update RLS. The checked-in hardening migration includes the final access policies. For later new installations, use a tailored migration sequence.

Vercel environment metadata access returned 403 for the connected scope. Paystack test secret and Supabase service role key need to be configured in the owner-controlled Vercel dashboard and test purchases verified before PR merge.

## Purchase recovery + Paystack webhook (test mode)

- Recovery page: `/store/recover`. Buyer enters the Paystack reference, then verifies with their original checkout email. The backend independently verifies success, amount, NGN currency, Paystack customer email, and order reference before generating a fresh 120-second private ZIP link.
- Test webhook endpoint: `https://<current-preview-host>/api/store/webhook`. Configure **Test Webhook URL** in the Paystack dashboard only after the new preview build is READY. Use the exact preview host you are testing; never point a live webhook at an unmerged preview deployment.
- Webhook authenticity: validate `x-paystack-signature` using HMAC-SHA512 and the relevant Paystack secret key, with a timing-safe comparison over the raw request body. Only the `charge.success` event can mark an order paid, and it is independently verified via the Paystack transaction API. Unknown references do not create orders.
- Idempotency: a previously paid order keeps its existing `paid_at` timestamp. No direct client access to private ZIP files or order records.
- **Not yet implemented:** emailed receipts / durable email-based purchase lookup, rate limiting, authenticated buyer accounts, and complete real-payment regression/security tests. Do not activate production Paystack keys yet.
- For initial smoke test, use a signed-in tester's existing **paid test reference** at `/store/recover` to verify that the second download works without another charge. Confirm status in `template_orders` and confirm unsigned storage URLs cannot be accessed.


## Purchase recovery, webhook and launch safety (15 Oct 2026)

- Recovery page: `/store/recover`. Customers enter the original `frosh_...` reference, then the original checkout email at `/store/complete`. The server checks Paystack's verify API, the stored currency/amount/reference and Paystack customer email before it creates a short-lived private ZIP URL. A past successful purchase can be recovered without paying again.
- Webhook handler: `POST /api/store/webhook`. It authenticates `x-paystack-signature` using HMAC-SHA512 on the exact raw request body with the server-only Paystack secret. Only `charge.success` attempts fulfillment; all details are verified against Paystack and the database. Replayed successful events do not change `paid_at` once status is paid. There is no public listing endpoint for orders.
- **Preview limitation:** Vercel project `froshcodeorbit` has SSO protection set to `all_except_custom_domains`. Paystack webhook delivery to protected `*.vercel.app` preview hostnames cannot be assumed to work. Keep preview protection enabled. Do not point Paystack live webhook to a transient preview, expose the SSO bypass token, or enable live charges while testing. Configure the webhook in Paystack TEST settings only when an intentionally public, stable URL is ready, then verify a signed delivery and the order's paid status when the buyer does not return.
- **Production launch:** Explicitly review branch merge, configure production environment keys, set Paystack live webhook URL to `https://www.froshcodeorbit.site/api/store/webhook` **only after production deployment**, and test signed webhook delivery. Never deploy a test Paystack secret with live payments or vice versa.
- **Still pending:** email receipts, durable purchase reference email retrieval, anonymous negative-access tests, duplicate webhook replay test, complete admin/resume/case-study regression, and final production approval. Paystack test checkout/download has passed, but live release is not approved.


## Resend customer receipts (prepared 15 Oct 2026)

The new `src/lib/store-receipt.ts` sends purchase confirmations only after the backend independently verifies the Paystack transaction and matching stored order. It emails the template title, amount, reference and a secure purchase recovery URL, **never** the private ZIP file or permanent storage URL. `receipt_sent_at` tracks successful Resend API acceptance. Receipt failures don't prevent paid downloads. Repeated calls use a stable Resend idempotency key and skip rows already marked sent.

Applied additive migration `migrations/20261015_template_order_receipts.sql` to My Portfolio Website on 15 Oct. Existing test order remains paid, receipt not yet sent.

Resend sender setup (Preview only initially):
1. Verify a domain in Resend Domains and add the DNS records it provides, using your DNS host. A subdomain such as `mail.froshcodeorbit.site` is reasonable; use exactly the domain Resend confirms as verified.
2. Generate a Resend API key with sending permission.
3. In Vercel `froshcodeorbit` project, add `RESEND_API_KEY` as a **secret**, Preview only (never `NEXT_PUBLIC_`).
4. Add `RESEND_FROM_EMAIL` in Preview as a verified-domain sender, e.g. `Frosh CodeOrbit <orders@mail.froshcodeorbit.site>` **only if that subdomain was verified**.
5. Redeploy Preview after saving. Recover the existing paid test order to trigger a receipt email, and verify `receipt_sent_at` is populated.
6. Do not enable production Resend keys, live Paystack or merge the PR until webhook and security tests pass.

Note: Prior preview links can have Vercel SSO protection and email recovery links use the deployment's hostname. Preview receipts may only be usable by the owner; production receipts will use the public site URL. An email accepted by Resend is not proof of mailbox delivery. Review Resend send logs and inbox/spam folder.