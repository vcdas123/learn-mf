/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./host/src/**/*.{js,jsx,ts,tsx}",
    "./remotes/**/src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--app-primary, #cc785c)",
          hover: "var(--app-primary-hover, #a9583e)",
          on: "var(--app-on-primary, #ffffff)",
        },
        canvas: "var(--app-canvas, #faf9f5)",
        surface: {
          card: "var(--app-surface-card, #efe9de)",
          dark: "var(--app-surface-dark, #181715)",
          "dark-elevated": "var(--app-surface-dark-elevated, #252320)",
        },
        ink: "var(--app-ink, #141413)",
        body: "var(--app-body, #3d3d3a)",
        muted: "var(--app-muted, #6c6a64)",
        hairline: "var(--app-hairline, #e6dfd8)",
        "on-dark": "var(--app-on-dark, #faf9f5)",
        "on-dark-soft": "var(--app-on-dark-soft, #a09d96)",
        success: "var(--app-success, #5db872)",
        warning: "var(--app-warning, #d4a017)",
        error: "var(--app-error, #c64545)",
        "accent-teal": "var(--app-accent-teal, #5db8a6)",
        "accent-amber": "var(--app-accent-amber, #e8a55a)",
      },
      fontFamily: {
        display: ["Cormorant Garamond", "EB Garamond", "Times New Roman", "serif"],
        body: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        xs: "4px",
        sm: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        pill: "9999px",
      },
      spacing: {
        section: "96px",
      },
    },
  },
  plugins: [],
};
