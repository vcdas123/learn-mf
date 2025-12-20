import React from "react";
import { Link } from "react-router-dom";
import { Paper, Typography, Box, Chip } from "@mui/material";
import { motion } from "framer-motion";
import type { FeatureConfig } from "../../routes/remoteRoutes";

interface FeatureCardProps {
  feature: FeatureConfig;
  index: number;
}

/**
 * Convert Tailwind gradient class to CSS gradient
 * Handles colors like "from-blue-50 to-indigo-50"
 */
const getGradientColors = (
  tailwindClass: string,
  direction: string = "90deg",
  opacity: number = 1
): string => {
  const colorMap: Record<string, string> = {
    "blue-50": "#eff6ff",
    "indigo-50": "#eef2ff",
    "purple-50": "#faf5ff",
    "pink-50": "#fdf2f8",
  };

  const parts = tailwindClass.split(" ");
  const fromPart = parts.find((p) => p.startsWith("from-"));
  const toPart = parts.find((p) => p.startsWith("to-"));

  const fromColor = fromPart?.replace("from-", "") || "";
  const toColor = toPart?.replace("to-", "") || "";

  const from = colorMap[fromColor] || "#f3f4f6";
  const to = colorMap[toColor] || "#e5e7eb";

  // Convert hex to rgba if opacity is less than 1
  if (opacity < 1) {
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : { r: 243, g: 244, b: 246 };
    };

    const fromRgb = hexToRgb(from);
    const toRgb = hexToRgb(to);

    return `linear-gradient(${direction}, rgba(${fromRgb.r}, ${fromRgb.g}, ${fromRgb.b}, ${opacity}) 0%, rgba(${toRgb.r}, ${toRgb.g}, ${toRgb.b}, ${opacity}) 100%)`;
  }

  return `linear-gradient(${direction}, ${from} 0%, ${to} 100%)`;
};

/**
 * Feature Card Component
 *
 * Displays a card for each remote module with animation and hover effects.
 */
export const FeatureCard: React.FC<FeatureCardProps> = ({ feature, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4 + index * 0.1, duration: 0.6, ease: "easeOut" }}
    whileHover={{ y: -8 }}
    style={{ height: "100%" }}
  >
    <Paper
      component={Link}
      to={feature.path}
      elevation={0}
      sx={{
        p: { xs: 3.5, md: 4.5 },
        height: "100%",
        textDecoration: "none",
        color: "inherit",
        borderRadius: 3,
        border: "1.5px solid",
        borderColor: "divider",
        background: "white",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: getGradientColors(feature.color, "90deg"),
          transform: "scaleX(0)",
          transformOrigin: "left",
          transition: "transform 0.4s ease",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: getGradientColors(feature.color, "135deg", 0.05),
          opacity: 0,
          transition: "opacity 0.4s ease",
          pointerEvents: "none",
        },
        "&:hover": {
          boxShadow: "0 12px 32px rgba(99, 102, 241, 0.12)",
          borderColor: "primary.main",
          transform: "translateY(-4px)",
          "&::before": {
            transform: "scaleX(1)",
          },
          "&::after": {
            opacity: 1,
          },
          "& .explore-arrow": {
            transform: "translateX(4px)",
          },
        },
      }}
    >
      {/* Icon Container */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Box
          sx={{
            fontSize: { xs: "3rem", md: "3.5rem" },
            lineHeight: 1,
            filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.08))",
            transform: "translateZ(0)",
            transition: "transform 0.3s ease",
            "&:hover": {
              transform: "scale(1.1) rotate(5deg)",
            },
          }}
        >
          {feature.emoji}
        </Box>
      </Box>

      {/* Title */}
      <Typography
        variant="h6"
        component="h3"
        sx={{
          mb: 2,
          fontWeight: 700,
          fontSize: { xs: "1.125rem", md: "1.25rem" },
          color: "text.primary",
          lineHeight: 1.3,
        }}
      >
        {feature.title}
      </Typography>

      {/* Description */}
      <Typography
        variant="body2"
        sx={{
          mb: "auto",
          color: "text.secondary",
          fontSize: { xs: "0.875rem", md: "0.9375rem" },
          lineHeight: 1.7,
          minHeight: { xs: "48px", md: "56px" },
        }}
      >
        {feature.desc}
      </Typography>

      {/* Footer with Badge and CTA */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          mt: 3,
          pt: 3,
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Chip
          label={feature.badge}
          size="small"
          sx={{
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            color: "white",
            fontWeight: 600,
            fontSize: "0.75rem",
            height: "26px",
            boxShadow: "0 2px 8px rgba(99, 102, 241, 0.25)",
          }}
        />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            color: "primary.main",
            fontWeight: 600,
            fontSize: "0.875rem",
          }}
        >
          <Typography
            component="span"
            sx={{
              fontWeight: 600,
              fontSize: "0.875rem",
            }}
          >
            Explore
          </Typography>
          <Typography
            component="span"
            className="explore-arrow"
            sx={{
              transition: "transform 0.3s ease",
              display: "inline-block",
            }}
          >
            →
          </Typography>
        </Box>
      </Box>
    </Paper>
  </motion.div>
);

