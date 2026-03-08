import type { AuthConfig } from "convex/server";

/**
 * Convex auth config for Clerk.
 * Supports both development (localhost) and production (drnote.co):
 * - Dev: https://<instance>.clerk.accounts.dev (from pk_test_ keys)
 * - Prod: https://clerk.drnote.co
 *
 * Set in Convex Dashboard (Settings → Environment Variables):
 * - CLERK_JWT_ISSUER_DOMAIN = https://clerk.drnote.co (production)
 * - CLERK_JWT_ISSUER_DOMAIN_DEV = https://nice-weevil-50.clerk.accounts.dev (development)
 *
 * See https://docs.convex.dev/auth/clerk
 */
const providers: { domain: string; applicationID: string }[] = [
  { domain: process.env.CLERK_JWT_ISSUER_DOMAIN!, applicationID: "convex" },
];
if (process.env.CLERK_JWT_ISSUER_DOMAIN_DEV) {
  providers.push({
    domain: process.env.CLERK_JWT_ISSUER_DOMAIN_DEV,
    applicationID: "convex",
  });
}

export default {
  providers,
} satisfies AuthConfig;
