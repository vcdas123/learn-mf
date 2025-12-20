import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Container, Paper, Typography, Box } from "@mui/material";
import { motion } from "framer-motion";
import { routes, defaultRoute } from "./routes";

function ImageAnalyzerApp(): React.ReactElement {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 6 },
            background: "linear-gradient(135deg, #fafafa 0%, #ffffff 100%)",
            borderRadius: 4,
            mb: 4,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box
            sx={{
              borderBottom: "2px solid",
              borderColor: "divider",
              pb: 3,
              mb: 4,
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              sx={{
                mb: 2,
                fontWeight: 700,
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              🖼️ Image Analyzer
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              AI-powered image analysis and insights. Access shared Redux store from the host.
            </Typography>
          </Box>
          <Routes>
            {routes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={<route.component />}
              />
            ))}
            <Route path="*" element={<Navigate to={defaultRoute} replace />} />
          </Routes>
        </Paper>
      </motion.div>
    </Container>
  );
}

export default ImageAnalyzerApp;
