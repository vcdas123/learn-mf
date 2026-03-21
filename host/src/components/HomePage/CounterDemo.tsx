import React from "react";
import { Paper, Typography, Box, Button } from "@mui/material";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";

/**
 * Counter Demo Component
 * 
 * Demonstrates Redux store integration that can be accessed
 * and controlled by remote modules.
 */
export const CounterDemo: React.FC = () => {
  const dispatch = useDispatch();
  const counter = useSelector((state: RootState) => state.counter);

  const handleIncrement = () => {
    dispatch({ type: "counter/increment" });
  };

  const handleDecrement = () => {
    dispatch({ type: "counter/decrement" });
  };

  const showNotification = (type: "success" | "info") => {
    dispatch({
      type: "app/addNotification",
      payload: {
        message: `Counter is now ${counter.value}`,
        type,
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 6,
          background: (theme) => 
            theme.palette.mode === "light" 
              ? "linear-gradient(135deg, #e0e7ff 0%, #fce7f3 100%)"
              : "linear-gradient(135deg, #1e293b 0%, #1e1b4b 100%)",
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          🔄 Redux Store Demo (Shared from Host)
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            mb: 3,
            flexWrap: "wrap",
          }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="outlined" onClick={handleDecrement} size="large">
              −
            </Button>
          </motion.div>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              background: (theme) => theme.palette.mode === "light" ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" : "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {counter.value}
          </Typography>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="outlined" onClick={handleIncrement} size="large">
              +
            </Button>
          </motion.div>
        </Box>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="contained"
              color="success"
              size="medium"
              onClick={() => showNotification("success")}
              sx={{
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                boxShadow: "0 4px 12px rgba(16, 185, 129, 0.4)",
              }}
            >
              Show Success Notification
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="contained"
              color="info"
              size="medium"
              onClick={() => showNotification("info")}
              sx={{
                background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)",
              }}
            >
              Show Info Notification
            </Button>
          </motion.div>
        </Box>
        <Typography
          variant="caption"
          sx={{ display: "block", mt: 3, color: "text.secondary" }}
        >
          Remotes can access and control this counter via Redux store
        </Typography>
      </Paper>
    </motion.div>
  );
};

