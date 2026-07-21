import React from "react";
import { Container, Typography, Box, Button, Paper, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowForward as ArrowForwardIcon } from "@mui/icons-material";
import { FeatureCard } from "./FeatureCard";
import { featureConfigs } from "../../routes/remoteRoutes";
import { colors } from "../../theme/colors";

const SpikeMark: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = "currentColor",
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ display: "inline-block", verticalAlign: "middle" }}>
    <line x1="12" y1="2" x2="12" y2="22" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="2" y1="12" x2="22" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const HomePage: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const coral = theme.palette.primary.main;
  const coralDark = theme.palette.primary.dark;

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: "background.default",
          py: { xs: 8, md: 12 },
          px: { xs: 3, md: 4 },
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { md: "1fr 1fr" },
              gap: { xs: 6, md: 8 },
              alignItems: "center",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Typography
                variant="h1"
                sx={{
                  mb: 3,
                  color: "text.primary",
                  fontFamily: '"Cormorant Garamond", serif',
                  fontWeight: 500,
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                }}
              >
                Discover the World
                <br />
                and Beyond
              </Typography>
              <Typography
                sx={{
                  mb: 5,
                  color: "text.secondary",
                  fontSize: "1.125rem",
                  lineHeight: 1.6,
                  maxWidth: 480,
                }}
              >
                A curated exploration platform powered by micro-frontends.
                Browse space imagery from NASA, search the world's largest open
                library, and track seismic activity in real time.
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button
                  component={Link}
                  to="/cosmos"
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    px: 3,
                    py: 1.5,
                    borderRadius: "8px",
                    fontWeight: 500,
                    "&:hover": { bgcolor: "primary.dark" },
                  }}
                >
                  Start Exploring
                </Button>
                <Button
                  component={Link}
                  to="/atlas"
                  variant="outlined"
                  sx={{
                    borderColor: "primary.main",
                    color: "primary.main",
                    px: 3,
                    py: 1.5,
                    borderRadius: "8px",
                    fontWeight: 500,
                    "&:hover": {
                      borderColor: "primary.main",
                      bgcolor: "rgba(204, 120, 92, 0.08)",
                    },
                  }}
                >
                  Browse Atlas
                </Button>
              </Box>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Paper
                elevation={0}
                sx={{
                  bgcolor: colors.surface.dark,
                  borderRadius: "16px",
                  p: 4,
                  overflow: "hidden",
                  position: "relative",
                  border: "1px solid",
                  borderColor: colors.surface.darkElevated,
                }}
              >
                <Box sx={{ mb: 2, display: "flex", gap: 1 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: colors.error }} />
                  <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: colors.accent.amber }} />
                  <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: colors.success }} />
                </Box>
                <Box
                  sx={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: "0.8125rem",
                    color: colors.onDarkSoft,
                    lineHeight: 1.8,
                  }}
                >
                  <Box sx={{ color: colors.muted }}>// Module Federation Architecture</Box>
                  <Box>
                    <span style={{ color: coral }}>const</span>{" "}
                    <span style={{ color: colors.accent.teal }}>host</span>{" "}
                    <span style={{ color: colors.onDarkSoft }}>=</span>{" "}
                    <span style={{ color: colors.accent.amber }}>createApp</span>
                    <span style={{ color: colors.onDarkSoft }}>{"({"}</span>
                  </Box>
                  <Box sx={{ pl: 3 }}>
                    <span style={{ color: colors.mutedSoft }}>remotes:</span>{" "}
                    <span style={{ color: colors.onDarkSoft }}>{"["}</span>
                  </Box>
                  <Box sx={{ pl: 6 }}>
                    <span style={{ color: colors.success }}>"cosmos"</span>
                    <span style={{ color: colors.onDarkSoft }}> {"\u2190"} </span>
                    <span style={{ color: colors.accent.amber }}>NASA APOD</span>
                  </Box>
                  <Box sx={{ pl: 6 }}>
                    <span style={{ color: colors.success }}>"atlas"</span>
                    <span style={{ color: colors.onDarkSoft }}> {"\u2190"} </span>
                    <span style={{ color: colors.accent.amber }}>Open Library + USGS</span>
                  </Box>
                  <Box sx={{ pl: 3 }}>
                    <span style={{ color: colors.onDarkSoft }}>{"]"}</span>
                  </Box>
                  <Box>
                    <span style={{ color: colors.onDarkSoft }}>{"})"}</span>
                  </Box>
                </Box>
              </Paper>
            </motion.div>
          </Box>
        </Container>
      </Box>

      {/* Feature Cards Section */}
      <Box
        sx={{
          bgcolor: isDark ? colors.surface.dark : colors.surface.soft,
          py: { xs: 8, md: 12 },
          px: { xs: 3, md: 4 },
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h2"
              sx={{
                fontFamily: '"Cormorant Garamond", serif',
                fontWeight: 500,
                fontSize: { xs: "1.75rem", md: "2.25rem" },
                letterSpacing: "-0.02em",
                color: "text.primary",
                mb: 2,
              }}
            >
              Explore Our Modules
            </Typography>
            <Typography
              sx={{ color: "text.secondary", maxWidth: 560, lineHeight: 1.6 }}
            >
              Each module is a standalone micro-frontend, independently deployed
              and loaded at runtime via Webpack Module Federation.
            </Typography>
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
              gap: 4,
            }}
          >
            {featureConfigs.map((feature, index) => (
              <FeatureCard key={feature.path} feature={feature} index={index} />
            ))}
          </Box>
        </Container>
      </Box>

      {/* Architecture Section */}
      <Box
        sx={{
          bgcolor: "background.default",
          py: { xs: 8, md: 12 },
          px: { xs: 3, md: 4 },
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { md: "1fr 1fr" },
              gap: 6,
              alignItems: "center",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontWeight: 500,
                  fontSize: { xs: "1.75rem", md: "2.25rem" },
                  letterSpacing: "-0.02em",
                  color: "text.primary",
                  mb: 3,
                }}
              >
                Built with Module Federation
              </Typography>
              <Typography
                sx={{ color: "text.secondary", lineHeight: 1.7, mb: 3 }}
              >
                The host application loads remote modules at runtime. Each remote
                is an independent application with its own state management, API
                integrations, and deployment pipeline.
              </Typography>
              <Typography
                sx={{ color: "text.secondary", lineHeight: 1.7 }}
              >
                Shared dependencies (React, MUI, Redux) are configured as
                singletons across the federation boundary, ensuring one copy of
                each library runs in the browser.
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Paper
                elevation={0}
                sx={{
                  bgcolor: colors.surface.dark,
                  borderRadius: "12px",
                  p: 4,
                  border: "1px solid",
                  borderColor: colors.surface.darkElevated,
                }}
              >
                <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: colors.error }} />
                  <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: colors.accent.amber }} />
                  <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: colors.success }} />
                </Box>
                <Box
                  sx={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: "0.75rem",
                    color: colors.onDarkSoft,
                    lineHeight: 2,
                  }}
                >
                  <Box>
                    <span style={{ color: colors.mutedSoft }}>// Shared dependencies</span>
                  </Box>
                  <Box>
                    <span style={{ color: coral }}>react</span>
                    <span style={{ color: colors.onDarkSoft }}> {"\u2192"} </span>
                    <span style={{ color: colors.success }}>singleton</span>
                  </Box>
                  <Box>
                    <span style={{ color: coral }}>react-dom</span>
                    <span style={{ color: colors.onDarkSoft }}> {"\u2190"} </span>
                    <span style={{ color: colors.success }}>eager</span>
                  </Box>
                  <Box>
                    <span style={{ color: coral }}>@mui/material</span>
                    <span style={{ color: colors.onDarkSoft }}> {"\u2192"} </span>
                    <span style={{ color: colors.success }}>singleton</span>
                  </Box>
                  <Box>
                    <span style={{ color: coral }}>zustand</span>
                    <span style={{ color: colors.onDarkSoft }}> {"\u2190"} </span>
                    <span style={{ color: colors.success }}>singleton</span>
                  </Box>
                  <Box sx={{ mt: 1 }}>
                    <span style={{ color: colors.mutedSoft }}>// Runtime loading</span>
                  </Box>
                  <Box>
                    <span style={{ color: colors.accent.amber }}>import</span>
                    <span style={{ color: colors.onDarkSoft }}>(</span>
                    <span style={{ color: colors.success }}>"cosmos/App"</span>
                    <span style={{ color: colors.onDarkSoft }}>)</span>
                  </Box>
                  <Box>
                    <span style={{ color: colors.accent.amber }}>import</span>
                    <span style={{ color: colors.onDarkSoft }}>(</span>
                    <span style={{ color: colors.success }}>"atlas/App"</span>
                    <span style={{ color: colors.onDarkSoft }}>)</span>
                  </Box>
                </Box>
              </Paper>
            </motion.div>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          bgcolor: colors.surface.dark,
          py: { xs: 6, md: 8 },
          px: { xs: 3, md: 4 },
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", md: "center" },
              gap: 4,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <SpikeMark size={18} color={colors.onDark} />
              <Typography
                sx={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontWeight: 500,
                  fontSize: "1.125rem",
                  color: colors.onDark,
                  letterSpacing: "-0.02em",
                }}
              >
                Discovery Hub
              </Typography>
            </Box>
            <Typography
              sx={{ color: colors.onDarkSoft, fontSize: "0.8125rem" }}
            >
              Built with Webpack 5 Module Federation. Powered by public APIs from NASA, Open Library, and USGS.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};
