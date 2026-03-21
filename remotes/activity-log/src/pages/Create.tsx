import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Paper,
  Typography,
  Grid,
  MenuItem,
  Alert,
} from "@mui/material";
import { Save as SaveIcon, Cancel as CancelIcon } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useDispatch } from "../hooks/useReduxStore";
import { useActivityStore } from "../store/useActivityStore";

function ActivityLogCreate(): React.ReactElement {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const addLog = useActivityStore((state) => state.addLog);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const status = formData.get("status") as "active" | "completed" | "draft";
    const description = formData.get("description") as string;
    const date = formData.get("date") as string;

    if (!title || !status) {
      setError("Title and status are required");
      return;
    }

    // Save to Zustand store (which handles localStorage)
    addLog({
      title,
      status,
      description,
      date: date || new Date().toISOString().split("T")[0],
    });

    dispatch({
      type: "app/addNotification",
      payload: {
        message: `New activity log "${title}" created successfully!`,
        type: "success",
      },
    });

    navigate(".."); // Navigate back to module list
  };

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h5" component="h2" sx={{ mb: 4, fontWeight: 700 }}>
          Create New Activity Log
        </Typography>
        <Paper 
          elevation={2} 
          sx={{ 
            p: 4, 
            maxWidth: 800, 
            background: (theme) => theme.palette.mode === "light" ? "linear-gradient(135deg, #fafafa 0%, #ffffff 100%)" : "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)" 
          }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  name="title"
                  label="Log Title"
                  fullWidth
                  required
                  variant="outlined"
                  autoFocus
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  select
                  name="status"
                  label="Status"
                  fullWidth
                  required
                  defaultValue="active"
                  variant="outlined"
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="draft">Draft</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  name="date"
                  label="Date"
                  type="date"
                  fullWidth
                  defaultValue={new Date().toISOString().split("T")[0]}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  name="description"
                  label="Description"
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    sx={{
                      background:
                        "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                    }}
                  >
                    Save Log
                  </Button>
                  <Button
                    type="button"
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={() => navigate("..")}
                  >
                    Cancel
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </motion.div>
    </Box>
  );
}

export default ActivityLogCreate;
