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
- Paystack verification is implemented using the official `transaction/verify/:reference` endpoint. Customers must return to the completion page and verify to get the file. A future enhancement can add a signed webhook plus transactional email delivery and order-management.
- The public template catalog is separate from client case studies, preventing accidentally listing client-owned projects as downloadable merchandise.
- Your prior draft Meta catalog PR #5 remains independent and is not included here.
- Template and profile mutations are now restricted to the existing portfolio admin account. Legacy project and blog policies still use their existing authenticated-user convention; audit those separately before adding any additional auth users.

## Vercel access limitation (current)

The connected Vercel integration returned an authorization error for environment-variable metadata on the `froshcodeorbit` project. Complete secret configuration manually through the Vercel dashboard. Do not paste private keys into ChatGPT, GitHub, screenshots, or public issue comments. The test payment flow has **not** been executed or validated yet.

## 2026-10-14 Database migration status

Applied in Supabase **My Portfolio Website** (`tbrizmndydegsykqtnwj`): case-study fields, portfolio resume profile write policies (using existing working `profile` storage bucket rather than recreating it), marketplace tables/private bucket, and owner-only admin hardening. Verified 7 projects, 1 profile, 1 admin; 0 templates or orders. Do **not** rerun `20261014_resume_storage_fix.sql` as-is: the live environment needed a different, less disruptive change to `profiles` insert/update RLS. The checked-in hardening migration includes the final access policies. For later new installations, use a tailored migration sequence.

Vercel environment metadata access returned 403 for the connected scope. Paystack test secret and Supabase service role key need to be configured in the owner-controlled Vercel dashboard and test purchases verified before PR merge.
