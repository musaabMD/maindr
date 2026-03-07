/**
 * Clerk auth UI appearance - larger fonts, app font, better spacing.
 * Matches DrNote design system.
 */
export const clerkAppearance = {
  variables: {
    fontFamily: "var(--font-bricolage), system-ui, sans-serif",
    fontFamilyButtons: "var(--font-bricolage), system-ui, sans-serif",
    fontSize: {
      xs: "0.9375rem",   // 15px
      sm: "1rem",        // 16px
      md: "1.125rem",    // 18px
      lg: "1.25rem",     // 20px
      xl: "1.375rem",    // 22px
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    spacing: "1.25rem",
    borderRadius: "0.625rem",
    colorPrimary: "#006450",
    colorForeground: "#0e0e10",
    colorBackground: "#ffffff",
    colorInput: "#f5f5f5",
    colorInputForeground: "#0e0e10",
    colorBorder: "rgba(0,0,0,0.1)",
    colorMutedForeground: "#6b7280",
  },
  elements: {
    formButtonPrimary: "text-base font-semibold py-3 px-6 min-h-[48px]",
    formFieldInput: "text-base min-h-[48px] px-4",
    formFieldLabel: "text-base font-medium",
    card: "shadow-xl rounded-xl",
    headerTitle: "text-xl font-bold",
    headerSubtitle: "text-base",
    socialButtonsBlockButton: "text-base py-3",
    footerActionLink: "text-base font-medium",
  },
};
