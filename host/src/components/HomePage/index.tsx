import React from "react";
import { Container, Paper, Typography, Box, Grid, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  MenuBook as MenuBookIcon,
  Storage as StorageIcon,
  Palette as PaletteIcon,
  ArrowForward as ArrowForwardIcon
} from "@mui/icons-material";
import { CounterDemo } from "./CounterDemo";
import { FeatureCard } from "./FeatureCard";
import { featureConfigs } from "../../routes/remoteRoutes";

/**
 * Home Page Component
 * 
 * Main landing page of the host application showcasing:
 * - Welcome message
 * - Redux counter demo
 * - Available remote modules
 * - Architectural guides
 */
export const HomePage: React.FC = () => {
  const guides = [
    {
      title: "System Architecture",
      desc: "Detailed breakdown of the Module Federation setup and host-remote relationship.",
      path: "/guide/architecture",
      icon: <MenuBookIcon />,
      color: "#6366f1"
    },
    {
      title: "State Management",
      desc: "How we sync Redux across modules and manage module-specific Zustand stores.",
      path: "/guide/state",
      icon: <StorageIcon />,
      color: "#10b981"
    },
    {
      title: "Styling & UI",
      desc: "Deep dive into the theme system, Tailwind integration, and animations.",
      path: "/guide/styling",
      icon: <PaletteIcon />,
      color: "#ec4899"
    }
  ];

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
            background: (theme) => 
              theme.palette.mode === "light" 
                ? "linear-gradient(135deg, #fafafa 0%, #ffffff 100%)"
                : "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            sx={{
              mb: 3,
              background: (theme) => theme.palette.mode === "light" ? "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)" : "linear-gradient(135deg, #4f46e5 0%, #9d174d 100%)",
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
            Enterprise-grade component-based micro-frontend architecture with Webpack 5 Module
            Federation, featuring a unified design system and shared global state.
          </Typography>

          {/* Redux Counter Demo */}
          <CounterDemo />

          {/* Available Remote Modules */}
          <Box sx={{ mb: 8 }}>
            <Box sx={{ mb: 5 }}>
              <Typography
                variant="h4"
                component="h2"
                sx={{
                  mb: 2,
                  fontWeight: 800,
                  fontSize: { xs: "1.75rem", md: "2.125rem" },
                  background: (theme) => theme.palette.mode === "light" ? "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)" : "linear-gradient(135deg, #4f46e5 0%, #9d174d 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  letterSpacing: "-0.02em",
                }}
              >
                Available Remote Modules
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Each module is a standalone application loaded at runtime.
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
                alignItems: "stretch",
              }}
            >
              {featureConfigs.map((feature, index) => (
                <FeatureCard key={feature.path} feature={feature} index={index} />
              ))}
            </Box>
          </Box>

          {/* Architectural Guides */}
          <Box>
            <Box sx={{ mb: 5 }}>
              <Typography
                variant="h4"
                component="h2"
                sx={{
                  mb: 2,
                  fontWeight: 800,
                  fontSize: { xs: "1.75rem", md: "2.125rem" },
                  background: (theme) => theme.palette.mode === "light" ? "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)" : "linear-gradient(135deg, #059669 0%, #2563eb 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  letterSpacing: "-0.02em",
                }}
              >
                Architectural Deep Dive
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Step-by-step documentation of the design patterns used in this project.
              </Typography>
            </Box>
            <Grid container spacing={3} alignItems="stretch">
              {guides.map((guide, index) => (
                <Grid item xs={12} md={4} key={guide.path}>
                  <motion.div
                    whileHover={{ y: -5 }}
                    style={{ height: "100%", display: "flex" }}
                  >
                    <Paper
                      sx={{
                        p: 4,
                        height: "100%",
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: 3,
                        border: "1px solid",
                        borderColor: "divider",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
                          borderColor: guide.color,
                        }
                      }}
                    >
                      <Box sx={{ color: guide.color, mb: 2 }}>
                        {React.cloneElement(guide.icon as React.ReactElement, { sx: { fontSize: 40 } })}
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                        {guide.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flexGrow: 1 }}>
                        {guide.desc}
                      </Typography>
                      <Button
                        component={Link}
                        to={guide.path}
                        variant="outlined"
                        endIcon={<ArrowForwardIcon />}
                        sx={{ 
                          alignSelf: "flex-start",
                          borderColor: guide.color,
                          color: guide.color,
                          "&:hover": {
                            borderColor: guide.color,
                            bgcolor: `${guide.color}10`
                          }
                        }}
                      >
                        Read Guide
                      </Button>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

