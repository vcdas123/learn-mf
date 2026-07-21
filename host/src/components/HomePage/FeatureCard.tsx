import React from "react";
import { Link } from "react-router-dom";
import { Paper, Typography, Box, Chip, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import type { FeatureConfig } from "../../routes/remoteRoutes";

interface FeatureCardProps {
  feature: FeatureConfig;
  index: number;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ feature, index }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.15, duration: 0.6, ease: "easeOut" }}
      whileHover={{ y: -6 }}
      style={{ height: "100%", display: "flex" }}
    >
      <Paper
        component={Link}
        to={feature.path}
        elevation={0}
        sx={{
          p: { xs: 3.5, md: 4.5 },
          height: "100%",
          width: "100%",
          textDecoration: "none",
          color: "inherit",
          borderRadius: "12px",
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          display: "flex",
          flexDirection: "column",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: isDark ? "0 2px 8px rgba(0,0,0,0.4)" : "0 1px 3px rgba(20,20,19,0.08)",
            borderColor: "primary.main",
          },
        }}
      >
        <Box sx={{ fontSize: "2.5rem", mb: 2.5, lineHeight: 1 }}>
          {feature.emoji}
        </Box>

        <Typography
          sx={{
            fontFamily: '"Cormorant Garamond", serif',
            fontWeight: 500,
            fontSize: "1.5rem",
            letterSpacing: "-0.01em",
            color: "text.primary",
            mb: 1.5,
          }}
        >
          {feature.title}
        </Typography>

        <Typography
          sx={{
            color: "text.secondary",
            fontSize: "0.9375rem",
            lineHeight: 1.65,
            mb: "auto",
            minHeight: 64,
          }}
        >
          {feature.desc}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mt: 3,
            pt: 2.5,
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Chip
            label={feature.badge}
            size="small"
            sx={{
              bgcolor: "primary.main",
              color: "primary.contrastText",
              fontWeight: 500,
              fontSize: "0.75rem",
              height: "24px",
            }}
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              color: "primary.main",
              fontWeight: 500,
              fontSize: "0.875rem",
            }}
          >
            <Typography component="span" sx={{ fontWeight: 500, fontSize: "0.875rem" }}>
              Explore
            </Typography>
            <Typography
              component="span"
              sx={{ transition: "transform 0.3s ease", display: "inline-block" }}
            >
              {"\u2192"}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </motion.div>
  );
};
