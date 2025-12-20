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
import { useGradeStore } from "../store/useGradeStore";

function GradeCreate(): React.ReactElement {
  const navigate = useNavigate();
  const addGrade = useGradeStore((state) => state.addGrade);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const score = Number(formData.get("score"));
    const studentName = formData.get("studentName") as string;
    const subject = formData.get("subject") as string;
    const date = formData.get("date") as string;
    const notes = formData.get("notes") as string;

    if (!name || score === null) {
      setError("Name and score are required");
      return;
    }

    if (score < 0 || score > 100) {
      setError("Score must be between 0 and 100");
      return;
    }

    addGrade({
      name,
      score,
      studentName: studentName || undefined,
      subject: subject || undefined,
      date: date || undefined,
      notes: notes || undefined,
    });

    navigate(-1); // Navigate back to list
  };

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Typography variant="h5" component="h2" sx={{ mb: 4, fontWeight: 700 }}>
          Create New Grade
        </Typography>
        <Paper elevation={2} sx={{ p: 4, maxWidth: 800 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  name="name"
                  label="Grade Name"
                  fullWidth
                  required
                  variant="outlined"
                  autoFocus
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  name="score"
                  label="Score"
                  type="number"
                  fullWidth
                  required
                  variant="outlined"
                  inputProps={{ min: 0, max: 100, step: 0.1 }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  name="studentName"
                  label="Student Name"
                  fullWidth
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  select
                  name="subject"
                  label="Subject"
                  fullWidth
                  defaultValue=""
                  variant="outlined"
                >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="Math">Mathematics</MenuItem>
                  <MenuItem value="Science">Science</MenuItem>
                  <MenuItem value="English">English</MenuItem>
                  <MenuItem value="History">History</MenuItem>
                  <MenuItem value="Physics">Physics</MenuItem>
                  <MenuItem value="Chemistry">Chemistry</MenuItem>
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
                  name="notes"
                  label="Notes"
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
                    Create Grade
                  </Button>
                  <Button
                    type="button"
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={() => navigate("/")}
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

export default GradeCreate;
