import { createTheme, Theme } from "@mui/material/styles";
import { colors } from "./colors";
import { fontFamily, fontFamilyDisplay, fontFamilyMonospace, appFontSizes, appLineHeights, appRadius } from "./typography";

export const getTheme = (mode: "light" | "dark"): Theme => {
  const isDark = mode === "dark";

  return createTheme({
    palette: {
      mode,
      primary: {
        main: colors.primary.main,
        light: "#e09a82",
        dark: colors.primary.hover,
        contrastText: colors.onPrimary,
      },
      secondary: {
        main: colors.accent.teal,
        light: "#7ccfbe",
        dark: "#4a9a8a",
        contrastText: "#ffffff",
      },
      success: { main: colors.success },
      warning: { main: colors.warning },
      error: { main: colors.error },
      info: { main: colors.accent.teal },
      background: {
        default: isDark ? colors.surface.dark : colors.canvas,
        paper: isDark ? colors.surface.darkElevated : colors.surface.card,
      },
      text: {
        primary: isDark ? colors.onDark : colors.ink,
        secondary: isDark ? colors.onDarkSoft : colors.body,
      },
      divider: isDark ? colors.surface.darkSoft : colors.hairline,
    },
    typography: {
      fontFamily,
      fontSize: 14,
      h1: {
        fontFamily: fontFamilyDisplay,
        fontWeight: 500,
        fontSize: appFontSizes["4xl"],
        letterSpacing: "-0.02em",
        lineHeight: appLineHeights.tight,
      },
      h2: {
        fontFamily: fontFamilyDisplay,
        fontWeight: 500,
        fontSize: appFontSizes["3xl"],
        letterSpacing: "-0.02em",
        lineHeight: appLineHeights.tight,
      },
      h3: {
        fontFamily: fontFamilyDisplay,
        fontWeight: 500,
        fontSize: appFontSizes["2xl"],
        letterSpacing: "-0.01em",
        lineHeight: 1.15,
      },
      h4: {
        fontFamily: fontFamilyDisplay,
        fontWeight: 500,
        fontSize: appFontSizes.xl,
        letterSpacing: "-0.01em",
        lineHeight: 1.2,
      },
      h5: {
        fontFamily,
        fontWeight: 500,
        fontSize: appFontSizes.lg,
        lineHeight: appLineHeights.snug,
      },
      h6: {
        fontFamily,
        fontWeight: 500,
        fontSize: appFontSizes.md,
        lineHeight: appLineHeights.snug,
      },
      body1: {
        fontFamily,
        fontSize: appFontSizes.base,
        lineHeight: appLineHeights.normal,
      },
      body2: {
        fontFamily,
        fontSize: appFontSizes.sm,
        lineHeight: appLineHeights.normal,
      },
      caption: {
        fontFamily,
        fontSize: appFontSizes.caption,
        fontWeight: 500,
        lineHeight: 1.4,
      },
      button: {
        fontFamily,
        fontWeight: 500,
        textTransform: "none",
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          ":root": {
            "--app-primary": colors.primary.main,
            "--app-primary-hover": colors.primary.hover,
            "--app-canvas": colors.canvas,
            "--app-surface-card": colors.surface.card,
            "--app-surface-dark": colors.surface.dark,
            "--app-surface-dark-elevated": colors.surface.darkElevated,
            "--app-ink": colors.ink,
            "--app-body": colors.body,
            "--app-muted": colors.muted,
            "--app-hairline": colors.hairline,
            "--app-on-primary": colors.onPrimary,
            "--app-on-dark": colors.onDark,
            "--app-on-dark-soft": colors.onDarkSoft,
            "--app-success": colors.success,
            "--app-warning": colors.warning,
            "--app-error": colors.error,
            "--app-accent-teal": colors.accent.teal,
            "--app-accent-amber": colors.accent.amber,
            "--app-font-display": fontFamilyDisplay,
            "--app-font-body": fontFamily,
            "--app-font-mono": fontFamilyMonospace,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            ...(isDark && {
              backgroundColor: colors.surface.darkElevated,
            }),
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? colors.surface.dark : colors.canvas,
            color: isDark ? colors.onDark : colors.ink,
            borderBottom: `1px solid ${isDark ? colors.surface.darkSoft : colors.hairline}`,
            boxShadow: "none",
          },
        },
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 500,
            fontSize: "0.875rem",
            textTransform: "none",
            minHeight: "40px",
            paddingLeft: "20px",
            paddingRight: "20px",
          },
          containedPrimary: {
            backgroundColor: colors.primary.main,
            "&:hover": {
              backgroundColor: colors.primary.hover,
            },
          },
          containedSecondary: {
            backgroundColor: isDark ? colors.surface.darkElevated : colors.canvas,
            border: `1px solid ${isDark ? colors.surface.darkSoft : colors.hairline}`,
            color: isDark ? colors.onDark : colors.ink,
            "&:hover": {
              backgroundColor: isDark ? colors.surface.darkSoft : colors.surface.soft,
            },
          },
          outlinedPrimary: {
            border: `1px solid ${colors.primary.main}`,
            color: colors.primary.main,
            "&:hover": {
              backgroundColor: "rgba(204, 120, 92, 0.08)",
              border: `1px solid ${colors.primary.main}`,
            },
          },
          textPrimary: {
            color: colors.primary.main,
            "&:hover": {
              backgroundColor: "rgba(204, 120, 92, 0.08)",
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            border: `1px solid ${isDark ? colors.surface.darkSoft : colors.hairline}`,
            backgroundImage: "none",
            boxShadow: "none",
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontFamily,
            fontWeight: 500,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: 8,
              "&.Mui-focused fieldset": {
                borderColor: colors.primary.main,
              },
            },
          },
        },
      },
    },
    shadows: [
      "none",
      "none",
      "none",
      `0 1px 3px rgba(20,20,19,0.08)`,
      `0 2px 6px rgba(20,20,19,0.08)`,
      `0 4px 12px rgba(20,20,19,0.10)`,
      `0 8px 24px rgba(20,20,19,0.12)`,
      `0 12px 32px rgba(20,20,19,0.14)`,
      `0 16px 40px rgba(20,20,19,0.16)`,
      `0 20px 48px rgba(20,20,19,0.18)`,
      `0 24px 56px rgba(20,20,19,0.20)`,
      `0 28px 64px rgba(20,20,19,0.22)`,
      `0 28px 64px rgba(20,20,19,0.22)`,
      `0 28px 64px rgba(20,20,19,0.22)`,
      `0 28px 64px rgba(20,20,19,0.22)`,
      `0 28px 64px rgba(20,20,19,0.22)`,
      `0 28px 64px rgba(20,20,19,0.22)`,
      `0 28px 64px rgba(20,20,19,0.22)`,
      `0 28px 64px rgba(20,20,19,0.22)`,
      `0 28px 64px rgba(20,20,19,0.22)`,
      `0 28px 64px rgba(20,20,19,0.22)`,
      `0 28px 64px rgba(20,20,19,0.22)`,
      `0 28px 64px rgba(20,20,19,0.22)`,
      `0 28px 64px rgba(20,20,19,0.22)`,
      `0 28px 64px rgba(20,20,19,0.22)`,
      `0 28px 64px rgba(20,20,19,0.22)`,
    ] as any,
  });
};

export const theme = getTheme("light");
