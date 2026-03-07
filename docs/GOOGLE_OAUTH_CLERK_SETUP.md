# Google OAuth + Clerk Setup — DrNote

Complete guide for connecting Google authentication with Clerk and the DrNote app.

---

## Overview

- **Clerk domain:** `https://clerk.drnote.co`
- **App domains:** `https://drnote.co`, `https://www.drnote.co`, `http://localhost:3000`
- **Google Cloud project:** `drnotev2`

---

## 1. Google Cloud Console Setup

### 1.1 Create OAuth Client ID

1. Go to [Google Cloud Console → APIs & Services → Credentials](https://console.cloud.google.com/apis/credentials)
2. Select project **drnotev2**
3. Click **Create credentials** → **OAuth client ID**
4. **Application type:** Web application
5. **Name:** e.g. `Web client 1` or `DrNote Web`

### 1.2 Authorized Redirect URIs

Add exactly this URI (from Clerk):

```
https://clerk.drnote.co/v1/oauth_callback
```

⚠️ **Common typo:** Use `oauth_callback`, not `cauth_callback`.

### 1.3 Authorized JavaScript Origins

Add these origins (one per line):

| URI |
|-----|
| `https://drnote.co` |
| `https://www.drnote.co` |
| `http://localhost:3000` |

### 1.4 Create & Save Credentials

1. Click **Create**
2. Copy **Client ID** and **Client Secret** from the popup
3. Store the Client Secret securely — it cannot be viewed again after closing the dialog
4. Optional: Download JSON backup

---

## 2. Clerk Dashboard Setup

### 2.1 Add Google Connection

1. Go to [Clerk Dashboard → SSO connections](https://dashboard.clerk.com/~/user-authentication/sso-connections)
2. Click **Add connection** → **Google** → **For all users**

### 2.2 Configure

| Setting | Value |
|---------|-------|
| **Enable for sign-up and sign-in** | ON |
| **Use custom credentials** | ON (required for production) |
| **Client ID** | Paste from Google Cloud Console |
| **Client Secret** | Paste from Google Cloud Console |
| **Block email subaddresses** | ON (recommended for security) |

### 2.3 Authorized Redirect URI (Clerk provides this)

Clerk shows the redirect URI you must add to Google:

```
https://clerk.drnote.co/v1/oauth_callback
```

Copy this and add it to Google Cloud Console **before** creating the OAuth client (or edit the client to add it).

### 2.4 Save

Click **Save** to persist the configuration.

---

## 3. App Configuration

### 3.1 No Code Changes Required

The app already uses Clerk. Once Google is enabled in Clerk:

- `SignInButton` and `SignUpButton` automatically show "Sign in with Google"
- No `.env` changes — credentials live in Clerk Dashboard only

### 3.2 Middleware

Clerk middleware runs on all routes (`middleware.ts`):

```ts
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();
```

### 3.3 Protecting Routes (Optional)

To require auth for specific routes:

```ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/upgrade", "/dashboard"]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});
```

---

## 4. Testing

1. Open app: `https://drnote.co` or `http://localhost:3000`
2. Click **Sign in**
3. Choose **Sign in with Google**
4. Complete the flow — you should be signed in

### OAuth Consent Screen (Testing Mode)

If Google OAuth is in **Testing** mode:

- Add your email under **OAuth consent screen → Test users**
- Or publish the app to **Production** when ready for all users

---

## 5. Checklist

| Step | Where | Action |
|------|-------|--------|
| 1 | Clerk Dashboard | Add Google connection, copy Authorized Redirect URI |
| 2 | Google Cloud | Create OAuth client ID (Web), add redirect URI + JS origins |
| 3 | Google Cloud | Copy Client ID and Client Secret |
| 4 | Clerk Dashboard | Paste Client ID and Secret, enable custom credentials, Save |
| 5 | App | No code changes — Google appears in sign-in UI automatically |
| 6 | Test | Sign in with Google on drnote.co or localhost |

---

## 6. References

- [Clerk: Add Google as social connection](https://clerk.com/docs/guides/configure/auth-strategies/social-connections/google)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Clerk Dashboard SSO](https://dashboard.clerk.com/~/user-authentication/sso-connections)
