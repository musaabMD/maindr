# DrNote Chat Log — Past Sessions & Actions

A log of past AI-assisted development sessions for the DrNote project.

---

## 1. Add Vercel Analytics
**Chat ID:** `6fccc9c0-9b87-4292-8050-8d8893b377dd`

**Request:** Add Vercel Analytics to the project.

**Actions:**
- Checked project structure and existing setup
- Integrated Vercel Analytics for the deployment at https://vercel.com/musaabhq/drnote.com-main/analytics

---

## 2. Suggest Exam Form + Convex
**Chat ID:** `f4fc0f1f-662d-4682-98d3-8ac7dac0c473`

**Request:** Create a simple suggest-exam form and add it to Convex as suggested exams.

**Actions:**
- Added `suggestedExams` table in Convex schema (name, description, submittedBy)
- Created `suggest` mutation in `convex/suggestedExams.ts`
- Built `components/exams/suggest-exam-form.tsx` modal (exam name + description)
- Added "Suggest Exam" button to browse page that opens the form
- Submissions stored in Convex `suggestedExams` table

---

## 3. Convex Setup & Clerk Auth
**Chat ID:** `cb06032d-3f2e-4113-a398-4c6360866bd4`

**Request:** Start Convex and link to the project.

**Actions:**
- Started Convex dev and provisioned deployment
- Fixed `CLERK_JWT_ISSUER_DOMAIN` requirement — set to `https://clerk.drnote.co` in Convex Dashboard
- Created `exams` table (name, slug, questions, color, subjects, tags, description, passRate, duration, difficulty)
- Created `users` table synced with Clerk (name, externalId, email, imageUrl)
- Added `exams.list`, `exams.getBySlug`, `exams.seed` functions
- Implemented Clerk webhook for user sync (create/update/delete)
- Fixed `ConvexProviderWithClerk` import — moved from `convex/react` to `convex/react-clerk`
- Improved Clerk auth UI: larger fonts (Bricolage Grotesque), DrNote green (#006450), better spacing

---

## 4. Hero Text, Upgrade Page, PricingTable
**Chat ID:** `dae53290-a857-4ef5-9625-fb8877002d63`

**Request:** Add hero text and sub text above exam cards; add upgrade page with Clerk PricingTable.

**Actions:**
- Added hero section: "Master Your Exams" + sub text
- Created `/upgrade` page with Clerk `<PricingTable />`
- Added "Back to exams" link and DrNote branding

---

## 5. Clerk Production Keys & Domain
**Chat ID:** `66d49449-ddc8-44f4-9f38-f8eca99fec76`

**Request:** Fix Clerk production keys error on localhost; prepare for Vercel deployment.

**Actions:**
- Explained production keys only work on `drnote.co`; localhost needs development keys
- Added `.env.example` with env var reference
- Configured `.env.local` for development keys
- Documented Vercel env vars for production (Clerk, Convex, CLERK_ENCRYPTION_KEY)
- Fixed "Publishable key not valid" by switching to dev keys locally

---

## 6. Add Clerk via MCP
**Chat ID:** `b22e49d3-0ab8-4493-948c-08dc8abf5c43`

**Request:** Add Clerk auth using MCP; add provided keys to `.env.local`.

**Actions:**
- Installed `@clerk/nextjs`
- Created `.env.local` with Clerk keys
- Added `clerkMiddleware()` in `middleware.ts`
- Wrapped app with `ClerkProvider` in layout
- Added auth UI: Sign In / Sign Up (modal) when signed out; `UserButton` when signed in
- Used Clerk v7 `Show` component (when="signed-in" / when="signed-out")

---

## 7. UI: White BG, Header, Larger Exam Cards
**Chat ID:** `5238d813-4f0e-4f98-a236-563b104b8e44`

**Request:** One white background for the app; fix header; make exam cards larger.

**Actions:**
- Set unified white background (`#ffffff`)
- Moved Clerk auth into main header; removed duplicate header
- Increased exam card size: minHeight 180px, larger font, 3-column grid, more padding
- Added dark mode toggle separate from Suggest Exam

---

## 8. DrNote Branding & Header
**Chat ID:** `72e83900-ad21-4add-ad31-f1ae96fa769f`

**Request:** App name and header like Grokipedia; larger DrNote; no header border.

**Actions:**
- Added Source Serif 4 for "DrNote" with "v2" in smaller gray
- Centered search bar with ⌘K shortcut pill
- Header: DrNote v2 | Search | Suggest Exam | Theme toggle | Avatar
- Removed header border
- Increased DrNote font size to 28px

---

## 9. Copy & Messaging
**Chat ID:** `799f6d32-850e-451b-85c0-beacf0662081`

**Request:** Update copy to "Just DrNote, Test Prep For Medical Exams"; fix hierarchy so "Browse Exams" isn't too large.

**Actions:**
- Set main heading: "Just DrNote, Test Prep For Medical Exams"
- Subtext: "Browse Exams · 1,000+ standardized tests"
- Updated layout metadata (title, description)

---

## 10. Exam List, Filters, Theme
**Chat ID:** (from `5238d813` and related)

**Request:** Exam list SMLE, SDLE, SPLE, SNLE, Family Medicine, SLLE; remove online/community; exam name only; white/dark switch; remove tag filters (All, College, Medical, etc.).

**Actions:**
- Replaced exams with Saudi medical exams (SMLE, SDLE, SPLE, SNLE, Family Medicine, SLLE)
- Exam cards show only exam name
- Added light/dark switch (white default)
- Removed tag filters (All, College, Medical, Law, Business, Finance)
- Search filters by exam name only

---

## 11. Remove Detail Page
**Chat ID:** (from `5238d813`)

**Request:** Remove the details page view.

**Actions:**
- Removed `DetailPage` from `app/page.tsx`
- Removed `onOpen` from browse page and exam cards
- Deleted `components/exams/detail-page.tsx`
- Exam cards are now display-only (no navigation)

---

## 12. Convex DB Setup
**Chat ID:** (from `b22e49d3`)

**Request:** Start Convex DB and link to project (blessed-fish-200 deployment).

**Actions:**
- Installed Convex
- Added `NEXT_PUBLIC_CONVEX_URL` to `.env.local`
- Created `convex/schema.ts`, `convex/auth.config.ts`
- Added `ConvexClientProvider` with `ConvexProviderWithClerk`
- Documented `CLERK_JWT_ISSUER_DOMAIN` setup in Convex Dashboard

---

## 13. Next.js + shadcn Setup
**Chat ID:** `2307e9eb-df02-40cb-8957-906ef0569058`

**Request:** Start Next.js ASAP; use shadcn MCP.

**Actions:**
- Created Next.js 16 app with App Router, TypeScript, Tailwind CSS v4
- Initialized shadcn/ui with Radix, Button component
- Moved project to DrNoteFinal root
- Dev server at http://localhost:3000

---

## 14. Exam List UI (Full Implementation)
**Chat ID:** `2307e9eb-df02-40cb-8957-906ef0569058`

**Request:** Add exam list UI (SAT, MCAT, Bar Exam, GRE, CPA, ACT, LSAT, GMAT) with BrowsePage, DetailPage, search, filters.

**Actions:**
- Created `lib/exams.ts` with exam data
- Built `components/exams/`: Avatar, TagPill, StarRating, TiltedArt, ExamCard, BrowsePage, DetailPage
- Added search, tag filters, dark/light mode
- Fonts: Bricolage Grotesque, Bebas Neue, DM Mono

---

## 15. App Name Correction
**Chat ID:** `2307e9eb-df02-40cb-8957-906ef0569058`

**Request:** App name is "drnonte".

**Actions:**
- Set `package.json` name to `"drnonte"`
- Updated page title to "drnonte — Browse Exams"

---

## 16. Google OAuth + Clerk Setup
**Chat ID:** (current session)

**Request:** Connect Google auth with Clerk and the app; document the full setup.

**Actions:**
- Configured Google Cloud Console (drnotev2): OAuth client ID (Web application)
- Authorized redirect URI: `https://clerk.drnote.co/v1/oauth_callback`
- Authorized JavaScript origins: `https://drnote.co`, `https://www.drnote.co`, `http://localhost:3000`
- Added Client ID and Client Secret to Clerk Dashboard → SSO connections → Google
- Created `docs/GOOGLE_OAUTH_CLERK_SETUP.md` with full setup guide

---

## Summary: Key Files & Integrations

| Area | Files / Services |
|------|------------------|
| **Auth** | Clerk (`@clerk/nextjs`), Google OAuth, `middleware.ts`, `lib/clerk-appearance.ts` |
| **Auth Docs** | `docs/GOOGLE_OAUTH_CLERK_SETUP.md` |
| **Database** | Convex (`blessed-fish-200`), `convex/schema.ts`, `convex/exams.ts`, `convex/users.ts`, `convex/suggestedExams.ts` |
| **Exams** | `components/exams/browse-page.tsx`, `exam-card.tsx`, `suggest-exam-form.tsx` |
| **Upgrade** | `/upgrade` with Clerk PricingTable |
| **Analytics** | Vercel Analytics |
| **UI** | shadcn/ui, Bricolage Grotesque, Source Serif 4, DM Mono |

---

*Last updated: March 7, 2026*
