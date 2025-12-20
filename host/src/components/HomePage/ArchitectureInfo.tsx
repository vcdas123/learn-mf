import React from "react";
import { Paper, Typography, Box, Chip } from "@mui/material";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";

/**
 * Architecture Information Component
 * 
 * Displays current module and theme information from Redux store.
 */
export const ArchitectureInfo: React.FC = () => {
  const app = useSelector((state: RootState) => state.app);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7 }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 4,
          background: "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)",
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          🏗️ Architecture Information
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, 1fr)",
            },
            gap: 3,
          }}
        >
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Current Module:
            </Typography>
            <Chip
              label={app.currentModule || "Home"}
              sx={{
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                color: "white",
                fontWeight: 600,
              }}
            />
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Theme:
            </Typography>
            <Chip label={app.theme} color="secondary" sx={{ fontWeight: 600 }} />
          </Box>
        </Box>
      </Paper>
    </motion.div>
  );
};

