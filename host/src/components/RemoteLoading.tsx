import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { motion } from "framer-motion";

interface RemoteLoadingProps {
  moduleName: string;
}

/**
 * Loading component for remote modules
 * 
 * Displays a loading indicator while a remote module is being loaded.
 * Used as fallback in Suspense boundaries.
 */
export const RemoteLoading: React.FC<RemoteLoadingProps> = ({ moduleName }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "400px",
    }}
  >
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center"
    >
      <CircularProgress size={48} sx={{ mb: 3 }} />
      <Typography variant="body1" sx={{ color: "text.secondary", mt: 2 }}>
        Loading {moduleName} module...
      </Typography>
    </motion.div>
  </Box>
);

