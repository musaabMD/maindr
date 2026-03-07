import type { AuthConfig } from "convex/server";

/**
 * Convex auth config for Clerk.
 * Set CLERK_JWT_ISSUER_DOMAIN in your Convex Dashboard (Settings → Environment Variables)
 * to your Clerk Frontend API URL (e.g. https://clerk.drnote.co for production).
 * See https://docs.convex.dev/auth/clerk
 */
export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN!,
      applicationID: "convex",
    },
  ],
} satisfies AuthConfig;
