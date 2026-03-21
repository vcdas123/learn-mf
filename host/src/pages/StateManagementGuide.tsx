import React from "react";
import { Container, Typography, Box, Paper, Stack } from "@mui/material";
import { motion } from "framer-motion";
import { 
  Storage as StorageIcon, 
  Share as ShareIcon, 
  OfflineBolt as OfflineBoltIcon
} from "@mui/icons-material";

const StateManagementGuide = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, background: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          State Management
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 6, fontWeight: 400 }}>
          How we handle data across host and remotes with Redux, Zustand, and LocalStorage.
        </Typography>

        <Stack spacing={4}>
          <Paper sx={{ p: 4, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 3 }}>
              <ShareIcon sx={{ fontSize: 40, color: "#6366f1" }} />
              <Typography variant="h5" sx={{ fontWeight: 700 }}>Global State (Redux)</Typography>
            </Box>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7 }}>
              The host initializes a centralized Redux store. Remotes can access this store to read global state (like theme, user info) and dispatch actions that affect the entire application.
            </Typography>
            <Box sx={{ p: 2, bgcolor: (theme) => theme.palette.mode === 'light' ? 'grey.50' : 'rgba(255,255,255,0.05)', borderRadius: 2, fontFamily: "monospace", fontSize: "0.875rem" }}>
              {"// In Remote Module"}<br />
              {"const counter = useSelector((state) => state.counter.value);"}<br />
              {"dispatch({ type: 'counter/increment' });"}
            </Box>
          </Paper>

          <Paper sx={{ p: 4, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 3 }}>
              <StorageIcon sx={{ fontSize: 40, color: "#ec4899" }} />
              <Typography variant="h5" sx={{ fontWeight: 700 }}>Module State (Zustand)</Typography>
            </Box>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7 }}>
              For data that only belongs to a specific remote (like Student Grades or Activity Logs), we use Zustand. It's lightweight, fast, and stays scoped to the module.
            </Typography>
            <Box sx={{ p: 2, bgcolor: (theme) => theme.palette.mode === 'light' ? 'grey.50' : 'rgba(255,255,255,0.05)', borderRadius: 2, fontFamily: "monospace", fontSize: "0.875rem" }}>
              {"// In useGradeStore.ts"}<br />
              {"export const useGradeStore = create((set) => ({"}<br />
              &nbsp;&nbsp;{"grades: [],"}<br />
              &nbsp;&nbsp;{"addGrade: (grade) => set((state) => ({ grades: [...state.grades, grade] }))"}<br />
              {"}));"}
            </Box>
          </Paper>

          <Paper sx={{ p: 4, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 3 }}>
              <OfflineBoltIcon sx={{ fontSize: 40, color: "#f59e0b" }} />
              <Typography variant="h5" sx={{ fontWeight: 700 }}>Persistence (LocalStorage)</Typography>
            </Box>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7 }}>
              Each module manages its own persistence logic. When state changes in Zustand, we automatically sync the new state to LocalStorage so data survives page refreshes.
            </Typography>
            <Box sx={{ p: 2, bgcolor: (theme) => theme.palette.mode === 'light' ? 'grey.50' : 'rgba(255,255,255,0.05)', borderRadius: 2, fontFamily: "monospace", fontSize: "0.875rem" }}>
              {"// Syncing to storage"}<br />
              {"const saveLogs = (logs) => localStorage.setItem('logs', JSON.stringify(logs));"}
            </Box>
          </Paper>
        </Stack>
      </motion.div>
    </Container>
  );
};

export default StateManagementGuide;
