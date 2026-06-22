// ============================================
// MMS DESIGN TOKENS
// Typed references for the MMS design system
// ============================================

export const colors = {
  gold: "#D9A400",
  goldLight: "#E8B800",
  goldDark: "#B88D00",
  black: "#111111",
  surface: "#1A1A1A",
  surfaceLight: "#222222",
  silver: "#C0C0C0",
  white: "#F7F7F7",
} as const;

export const typography = {
  display: "var(--font-bebas-neue)",
  heading: "var(--font-montserrat)",
  body: "var(--font-inter)",
} as const;

export const spacing = {
  sectionPadding: "var(--section-padding)",
  containerMax: "var(--container-max)",
  containerPadding: "var(--container-padding)",
} as const;

export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

export const animations = {
  duration: {
    fast: "150ms",
    normal: "300ms",
    slow: "500ms",
  },
  easing: {
    default: "cubic-bezier(0.4, 0, 0.2, 1)",
    in: "cubic-bezier(0.4, 0, 1, 1)",
    out: "cubic-bezier(0, 0, 0.2, 1)",
    spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
} as const;
