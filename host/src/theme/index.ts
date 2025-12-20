import { createTheme } from "@mui/material/styles";

/**
 * MUI Theme Configuration
 * 
 * Centralized theme configuration for the host application.
 * This theme is used throughout the application and can be accessed
 * by remotes when they inherit the ThemeProvider context.
 */
export const theme = createTheme({
  palette: {
    primary: {
      main: "#6366f1",
      light: "#818cf8",
      dark: "#4f46e5",
    },
    secondary: {
      main: "#ec4899",
      light: "#f472b6",
      dark: "#db2777",
    },
    background: {
      default: "#fafafa",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
    h3: {
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h4: {
      fontWeight: 600,
      letterSpacing: "-0.01em",
    },
    h5: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    "none",
    "0px 2px 4px rgba(0,0,0,0.04)",
    "0px 4px 8px rgba(0,0,0,0.06)",
    "0px 8px 16px rgba(0,0,0,0.08)",
    "0px 12px 24px rgba(0,0,0,0.10)",
    "0px 16px 32px rgba(0,0,0,0.12)",
    "0px 20px 40px rgba(0,0,0,0.14)",
    "0px 24px 48px rgba(0,0,0,0.16)",
    "0px 28px 56px rgba(0,0,0,0.18)",
    "0px 32px 64px rgba(0,0,0,0.20)",
    "0px 36px 72px rgba(0,0,0,0.22)",
    "0px 40px 80px rgba(0,0,0,0.24)",
    "0px 40px 80px rgba(0,0,0,0.24)",
    "0px 40px 80px rgba(0,0,0,0.24)",
    "0px 40px 80px rgba(0,0,0,0.24)",
    "0px 40px 80px rgba(0,0,0,0.24)",
    "0px 40px 80px rgba(0,0,0,0.24)",
    "0px 40px 80px rgba(0,0,0,0.24)",
    "0px 40px 80px rgba(0,0,0,0.24)",
    "0px 40px 80px rgba(0,0,0,0.24)",
    "0px 40px 80px rgba(0,0,0,0.24)",
    "0px 40px 80px rgba(0,0,0,0.24)",
    "0px 40px 80px rgba(0,0,0,0.24)",
    "0px 40px 80px rgba(0,0,0,0.24)",
    "0px 40px 80px rgba(0,0,0,0.24)",
  ] as any,
});

