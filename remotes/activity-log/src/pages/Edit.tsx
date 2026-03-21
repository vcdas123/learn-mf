import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { useActivityStore, type ActivityLog } from "../store/useActivityStore";

function ActivityLogEdit(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { getLogById, updateLog } = useActivityStore();
  
  const log = id ? getLogById(id) : null;
  const [formData, setFormData] = useState<Partial<ActivityLog>>({
    title: "",
    status: "active",
    description: "",
    date: "",
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (log) {
      setFormData(log);
    } else if (id) {
      setError("Log record not found");
    }
  }, [id, log]);

  const handleChange = (field: keyof ActivityLog) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) return;

    if (!formData.title || !formData.status) {
      setError("Title and status are required");
      return;
    }

    updateLog(id, formData);

    dispatch({
      type: "app/addNotification",
      payload: {
        message: `Activity log "${formData.title}" updated successfully!`,
        type: "success",
      },
    });

    navigate(".."); // Navigate back to detail view
  };

  if (error && !log) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button variant="outlined" onClick={() => navigate("..")}>Back to List</Button>
      </Box>
    );
  }

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h5" component="h2" sx={{ mb: 4, fontWeight: 700 }}>
          Edit Activity Log
        </Typography>
        <Paper 
          elevation={2} 
          sx={{ 
            p: 4, 
            maxWidth: 800,
            background: (theme) => theme.palette.mode === "light" ? "linear-gradient(135deg, #fafafa 0%, #ffffff 100%)" : "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)" 
          }}
        >
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Log Title"
                  fullWidth
                  required
                  value={formData.title || ""}
                  onChange={handleChange("title")}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  select
                  label="Status"
                  fullWidth
                  required
                  value={formData.status || "active"}
                  onChange={handleChange("status")}
                  variant="outlined"
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="draft">Draft</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Date"
                  type="date"
                  fullWidth
                  value={formData.date || ""}
                  onChange={handleChange("date")}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Description"
                  fullWidth
                  multiline
                  rows={4}
                  value={formData.description || ""}
                  onChange={handleChange("description")}
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
                    Save Changes
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

export default ActivityLogEdit;
