import React from "react";
import { Container, Paper, Typography, Box } from "@mui/material";
import { motion } from "framer-motion";
import { CounterDemo } from "./CounterDemo";
import { FeatureCard } from "./FeatureCard";
import { ArchitectureInfo } from "./ArchitectureInfo";
import { featureConfigs } from "../../routes/remoteRoutes";

/**
 * Home Page Component
 * 
 * Main landing page of the host application showcasing:
 * - Welcome message
 * - Redux counter demo
 * - Available remote modules
 * - Architecture information
 */
export const HomePage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 8 },
            background: "linear-gradient(135deg, #fafafa 0%, #ffffff 100%)",
            borderRadius: 4,
            mb: 6,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            sx={{
              mb: 3,
              background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontWeight: 700,
            }}
          >
            Welcome to Micro-Frontend Demo
          </Typography>
          <Typography
            variant="h6"
            sx={{ mb: 6, color: "text.secondary", fontWeight: 400, maxWidth: "600px" }}
          >
            Enterprise-grade component-based micro-frontend architecture with Module
            Federation, featuring beautiful UI with Framer Motion animations.
          </Typography>

          {/* Redux Counter Demo */}
          <CounterDemo />

          {/* Available Remote Modules */}
          <Box sx={{ mb: 8 }}>
            <Box sx={{ mb: 5, textAlign: { xs: "left", md: "center" } }}>
              <Typography
                variant="h4"
                component="h2"
                sx={{
                  mb: 2,
                  fontWeight: 800,
                  fontSize: { xs: "1.75rem", md: "2.125rem" },
                  background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  letterSpacing: "-0.02em",
                }}
              >
                Available Remote Modules
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "text.secondary",
                  fontSize: { xs: "0.875rem", md: "1rem" },
                  maxWidth: "700px",
                  mx: { xs: 0, md: "auto" },
                  lineHeight: 1.7,
                }}
              >
                Explore our micro-frontend modules, each with unique features and capabilities
              </Typography>
            </Box>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  lg: "repeat(3, 1fr)",
                },
                gap: { xs: 3, md: 4 },
              }}
            >
              {featureConfigs.map((feature, index) => (
                <FeatureCard key={feature.path} feature={feature} index={index} />
              ))}
            </Box>
          </Box>
        </Paper>

        {/* Architecture Information */}
        <ArchitectureInfo />
      </motion.div>
    </Container>
  );
};

