import React from "react";
import { Container, Typography, Box, Paper, Divider, Grid } from "@mui/material";
import { motion } from "framer-motion";
import { 
  Settings as SettingsIcon, 
  Hub as HubIcon, 
  Dns as DnsIcon,
  Devices as DevicesIcon
} from "@mui/icons-material";

const ArchitectureGuide = () => {
  const steps = [
    {
      title: "1. The Host Container",
      icon: <HubIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      desc: "The host is the shell that orchestrates everything. it owns the global dependencies, shared Redux store, and the main routing system.",
      details: [
        "Single React root (createRoot)",
        "Global Theme Provider",
        "Primary Navigation",
        "Shared Redux Store initialization"
      ]
    },
    {
      title: "2. Module Federation",
      icon: <SettingsIcon sx={{ fontSize: 40, color: "secondary.main" }} />,
      desc: "Webpack 5 Module Federation allows us to load remote builds at runtime. Host dynamically imports remote modules as if they were local components.",
      details: [
        "Runtime code sharing",
        "No build-time coupling",
        "Shared singleton dependencies",
        "Dynamic remote entry resolution"
      ]
    },
    {
      title: "3. Remote Modules",
      icon: <DnsIcon sx={{ fontSize: 40, color: "success.main" }} />,
      desc: "Remotes are standalone React applications that can be loaded into the host. They export a pure component that inherits context from the host.",
      details: [
        "Pure React exports",
        "Module-specific state (Zustand)",
        "Relative nested routing",
        "CORS-enabled assets"
      ]
    },
    {
      title: "4. Deployment Flow",
      icon: <DevicesIcon sx={{ fontSize: 40, color: "info.main" }} />,
      desc: "Each remote can be built and deployed independently. The host fetches the latest remoteEntry.js to always load the newest version.",
      details: [
        "Independent CI/CD pipelines",
        "Zero-downtime updates",
        "Versioning support",
        "CDN-friendly artifacts"
      ]
    }
  ];

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Architecture Deep Dive
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 6, fontWeight: 400 }}>
          Understanding the lifecycle and structural layers of this enterprise-grade micro-frontend system.
        </Typography>

        <Grid container spacing={4}>
          {steps.map((step, index) => (
            <Grid item xs={12} key={step.title}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Paper sx={{ p: 4, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 3 }}>
                    {step.icon}
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>{step.title}</Typography>
                  </Box>
                  <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7, color: "text.primary" }}>
                    {step.desc}
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  <Grid container spacing={2}>
                    {step.details.map((detail) => (
                      <Grid item xs={12} sm={6} key={detail}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "primary.main" }} />
                          <Typography variant="body2">{detail}</Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>
    </Container>
  );
};

export default ArchitectureGuide;
