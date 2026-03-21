import { createTheme, Theme } from "@mui/material/styles";

/**
 * MUI Theme Configuration
 * 
 * Provides light and dark theme configurations for the application.
 * Remotes inherit this theme via the host's ThemeProvider.
 */
export const getTheme = (mode: "light" | "dark"): Theme => {
  return createTheme({
    palette: {
      mode,
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
        default: mode === "light" ? "#fafafa" : "#0f172a",
        paper: mode === "light" ? "#ffffff" : "#1e293b",
      },
      text: {
        primary: mode === "light" ? "#1e293b" : "#f8fafc",
        secondary: mode === "light" ? "#64748b" : "#94a3b8",
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
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === "light" ? "#ffffff" : "#1e293b",
            color: mode === "light" ? "#1e293b" : "#f8fafc",
          },
        },
      },
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
};

// Default theme for initial load
export const theme = getTheme("light");
