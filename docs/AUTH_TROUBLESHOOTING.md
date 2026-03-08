# DrNote Auth Troubleshooting — Clerk + Convex

## Error: "No auth provider found matching the given token"

This means the JWT's `iss` (issuer) or `aud` (audience) don't match Convex's configured providers.

---

## Fix Checklist

### 1. Activate Convex integration in Clerk (both instances)

The Convex integration creates a JWT template named `convex` with `aud: "convex"`. Without it, tokens have the wrong audience.

**Verify the template exists:** Clerk Dashboard → JWT Templates → ensure a template named `convex` exists (or Convex integration adds it automatically).

**For your development instance (nice-weevil-50):**
1. Go to [Clerk Dashboard → Convex integration](https://dashboard.clerk.com/apps/setup/convex)
2. Switch to your **development** application if you have multiple
3. Click **Activate Convex integration**
4. Copy the Frontend API URL: `https://nice-weevil-50.clerk.accounts.dev`

**For production (clerk.drnote.co):**
1. Switch to your **production** Clerk application
2. Repeat the same steps
3. Copy: `https://clerk.drnote.co`

---

### 2. Set Convex Dashboard environment variables

Auth config runs on Convex's servers, so env vars must be set in the **Convex Dashboard**, not `.env.local`.

1. Go to [Convex Dashboard](https://dashboard.convex.dev/) → your project → **Settings** → **Environment Variables**
2. Switch to your **development** deployment (blessed-fish-200)
3. Add:
   - `CLERK_JWT_ISSUER_DOMAIN` = `https://clerk.drnote.co`
   - `CLERK_JWT_ISSUER_DOMAIN_DEV` = `https://nice-weevil-50.clerk.accounts.dev`
4. Run `npx convex dev` to sync the config

---

### 3. Clear session and sign in again

Stale sessions can send tokens from the wrong Clerk instance.

1. Sign out completely (UserButton → Sign out)
2. Clear site data for localhost / drnote.co (or use incognito)
3. Sign in again

---

### 4. Dev vs prod deployment mismatch

- **Localhost** uses dev Clerk keys (`pk_test_...`) → issuer: `https://nice-weevil-50.clerk.accounts.dev`
- **Production (drnote.co)** uses prod Clerk keys (`pk_live_...`) → issuer: `https://clerk.drnote.co`

Ensure your Convex deployment has both providers configured (see step 2 above).

---

## Verify configuration

After `npx convex dev`, the error message lists the configured providers. You should see:
- `OIDC(domain=https://clerk.drnote.co, app_id=convex)`
- `OIDC(domain=https://nice-weevil-50.clerk.accounts.dev, app_id=convex)`

If the token still doesn't match, decode it at [jwt.io](https://jwt.io/) and check:
- `iss` must exactly match one of the domains above (no trailing slash)
- `aud` must be `"convex"`

---

## See also

- [Convex docs: Clerk](https://docs.convex.dev/auth/clerk)
- [Clerk docs: Convex integration](https://clerk.com/docs/guides/development/integrations/databases/convex)
