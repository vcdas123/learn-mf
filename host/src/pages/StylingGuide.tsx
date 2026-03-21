import React from "react";
import { Container, Typography, Box, Paper, Grid } from "@mui/material";
import { motion } from "framer-motion";
import { 
  Palette as PaletteIcon, 
  Css as CssIcon, 
  AutoAwesome as AutoAwesomeIcon 
} from "@mui/icons-material";

const StylingGuide = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Styling & UI
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 6, fontWeight: 400 }}>
          A unified design system combining Material UI, Tailwind CSS, and Framer Motion.
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Paper sx={{ p: 4, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 3 }}>
                <PaletteIcon sx={{ fontSize: 40, color: "primary.main" }} />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>Theme-Aware Components</Typography>
              </Box>
              <Typography variant="body1" sx={{ mb: 3 }}>
                All components use the MUI `useTheme` hook or SX props to access the current palette. This ensures seamless Light and Dark mode transitions without hardcoded color conflicts.
              </Typography>
              <Box sx={{ p: 2, bgcolor: (theme) => theme.palette.mode === 'light' ? 'grey.50' : 'rgba(255,255,255,0.05)', borderRadius: 2, fontFamily: "monospace" }}>
                {"sx={{ background: (theme) => theme.palette.background.paper }}"}
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, borderRadius: 3, border: "1px solid", borderColor: "divider", height: "100%" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 3 }}>
                <CssIcon sx={{ fontSize: 40, color: "#38bdf8" }} />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>Tailwind CSS</Typography>
              </Box>
              <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
                Used for layout utility classes, gradients, and rapid UI prototyping. It works alongside MUI to provide the best of both worlds: robust components and flexible utilities.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, borderRadius: 3, border: "1px solid", borderColor: "divider", height: "100%" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 3 }}>
                <AutoAwesomeIcon sx={{ fontSize: 40, color: "#f472b6" }} />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>Animations</Typography>
              </Box>
              <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
                Framer Motion provides smooth layout transitions and component entry animations. Every module feels "alive" with consistent movement patterns across the entire application.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </motion.div>
    </Container>
  );
};

export default StylingGuide;
