import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { motion } from "framer-motion";

interface RemoteLoadingProps {
  moduleName: string;
}

export const RemoteLoading: React.FC<RemoteLoadingProps> = ({ moduleName }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "400px",
      bgcolor: "background.default",
    }}
  >
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ textAlign: "center" }}
    >
      <CircularProgress
        size={40}
        sx={{ color: "primary.main", mb: 3 }}
      />
      <Typography
        sx={{
          color: "text.secondary",
          mt: 2,
          fontFamily: '"Cormorant Garamond", serif',
          fontSize: "1.125rem",
        }}
      >
        Loading {moduleName}...
      </Typography>
    </motion.div>
  </Box>
);
