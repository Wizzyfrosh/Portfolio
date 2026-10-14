# Portfolio upgrades — staging checklist

**Never merge this PR before running the migrations and confirming a successful preview build.** The existing live deployment and old data must remain intact.

## Features in this branch

- Editable project case-study fields (challenge / solution / process / results) on the existing Projects admin form. Optional; regular projects still work.
- Full splash animation **once per browser** (localStorage key `froshcodeorbit_splash_seen_v1`). Refresh/revisits use a simple spinner, and Next.js route-level loading has a spinner.
- Resume admin uploader validates PDF (<=10 MB), stores it in Supabase, and **immediately persists** the public URL to `profiles`. The public `/resume` page already loads this URL. The unused homepage component now links to the actual uploaded URL instead of the missing `/resume.pdf`.
- Website template store: `/store`, `/store/[slug]`, `/store/complete` and admin pages `/admin/templates`, `/admin/templates/new`, `/admin/templates/[id]/edit`.
- Paystack server-only checkout / verify endpoints. A valid payment and matched reference/email/amount/currency are required before a **120-second signed download link** is issued. ZIP files are private.

## REQUIRED: Supabase SQL

Run these **in order** in your existing Supabase project's SQL Editor:

1. `migrations/20261014_project_case_studies.sql`
2. `migrations/20261014_resume_storage_fix.sql`
3. `migrations/20261014_template_marketplace.sql`

All are additive/idempotent where practical. Confirm existing admin login, published projects, blog posts, and PDF uploads still work.

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
- For stronger administration security, consider restricting Supabase project/template mutation policies to a specific admin UID instead of the existing all-authenticated-user convention.
