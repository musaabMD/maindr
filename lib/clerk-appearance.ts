/**
 * Clerk auth UI appearance - professional, polished design.
 * Matches DrNote design system.
 */
export const clerkAppearance = {
  variables: {
    fontFamily: "var(--font-bricolage), system-ui, sans-serif",
    fontFamilyButtons: "var(--font-bricolage), system-ui, sans-serif",
    fontSize: {
      xs: "0.875rem",
      sm: "1rem",
      md: "1.125rem",
      lg: "1.25rem",
      xl: "1.5rem",
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    spacing: "1.25rem",
    borderRadius: "0.75rem",
    colorPrimary: "#3f3f46",
    colorPrimaryForeground: "#ffffff",
    colorForeground: "#1A1A19",
    colorBackground: "#F8F8F7",
    colorInput: "#F2F2F0",
    colorInputForeground: "#1A1A19",
    colorBorder: "#E8E8E6",
    colorMutedForeground: "#73736F",
    colorMuted: "#F2F2F0",
    colorModalBackdrop: "rgba(15, 23, 42, 0.6)",
    colorShadow: "rgba(0, 0, 0, 0.08)",
    colorRing: "#3f3f46",
  },
  elements: {
    card: "shadow-2xl rounded-2xl border border-warm-200/80 overflow-hidden",
    headerTitle: "text-2xl font-bold tracking-tight text-warm-900",
    headerSubtitle: "text-base text-warm-600",
    formFieldInput:
      "text-base min-h-[48px] px-4 rounded-lg border-warm-200 bg-warm-50 focus:ring-2 focus:ring-warm-500/20 focus:border-warm-500 transition-colors",
    formFieldLabel: "text-sm font-medium text-warm-700",
    formButtonPrimary:
      "text-base font-semibold py-3 px-6 min-h-[48px] rounded-lg shadow-sm hover:shadow-md transition-all duration-200",
    socialButtonsBlockButton:
      "text-base py-3 rounded-lg border-warm-200 hover:bg-warm-50 transition-colors",
    footerActionLink: "text-sm font-medium text-warm-600 hover:text-warm-700 transition-colors",
  },
  cssLayerName: "clerk",
  options: {
    socialButtonsPlacement: "top",
    socialButtonsVariant: "blockButton",
    logoPlacement: "inside",
    animations: true,
  },
};
