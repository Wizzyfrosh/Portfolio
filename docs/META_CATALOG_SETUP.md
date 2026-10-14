# Optional Meta catalog feed (staged integration)

This feature is **opt-in and disabled by default**. It does not modify project creation, Supabase tables, authentication, or the live portfolio.

## Before activation
1. In Meta Commerce Manager, confirm that your business has a catalog and that its category supports the listings you intend to publish. A portfolio *case study* is not necessarily a product or service that Meta accepts for commerce.
2. In the WhatsApp Business mobile app, confirm that the Meta catalog is linked to the intended WhatsApp Business profile. Having a catalog in Commerce Manager does not automatically connect it to WhatsApp.
3. Decide which published portfolio projects represent genuine purchasable services, and assign accurate prices. Do **not** list client-owned demo websites as products for sale without permission.
4. Configure the following **Vercel environment variables** (never commit secrets):
   - `META_CATALOG_FEED_KEY`: a long random secret used in the scheduled feed URL.
   - `META_CATALOG_ITEMS_JSON`: a JSON object keyed by existing Supabase project ID. Example:
     `{"your-project-id":{"enabled":true,"priceNgn":50000}}`
     This is an **example only**; replace the ID and price with real, approved values. Entries not explicitly enabled with a positive price are omitted.
5. After deploying, privately test `https://www.froshcodeorbit.site/api/meta/catalog?key=YOUR_SECRET`. Do not share or publish this URL; it contains a secret. The endpoint returns CSV and uses the existing public Supabase read permissions.
6. If Meta accepts your catalog type and fields, configure **Data sources → Data feed → Scheduled feed** in Commerce Manager using that URL. Review diagnostics and item approvals. This is not an API-based instant push.
7. Confirm visibility from the WhatsApp Business app and verify listings from a customer account.

## Safety and limitations
- The endpoint responds with 404 when its secret is not configured or incorrect. No items sync until both environment variables are configured and Meta is set to fetch the URL.
- Only published projects with an explicit enabled entry, valid positive NGN price, HTTPS live URL and screenshot are exported.
- No database migration is required. Adding a per-project UI toggle and pricing fields is a separate, optional future step.
- This is a **preliminary product-feed format**. Meta may require different fields or a different catalog vertical for professional services; validate in Commerce Manager before activating.
- The feed URL secret is a bearer credential. Rotate it if exposed; avoid logging or sharing the full URL.
- A scheduled feed can take time to fetch, review, and display; successful fetching is not a guarantee of WhatsApp visibility.
