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
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useGradeStore, type Grade } from "../store/useGradeStore";

function StudentGradesEdit(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const getGradeById = useGradeStore((state) => state.getGradeById);
  const updateGrade = useGradeStore((state) => state.updateGrade);
  const removeGrade = useGradeStore((state) => state.removeGrade);

  const grade = id ? getGradeById(id) : null;
  const [formData, setFormData] = useState<Partial<Grade>>({
    name: "",
    score: 0,
    subject: "",
    studentName: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || !grade) {
      setError("Record not found");
      return;
    }
    setFormData(grade);
  }, [id, grade]);

  const handleChange = (field: keyof Grade) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = field === "score" ? Number(e.target.value) : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) return;

    if (!formData.name || formData.score === undefined) {
      setError("Entry name and score are required");
      return;
    }

    if (formData.score < 0 || formData.score > 100) {
      setError("Score must be between 0 and 100");
      return;
    }

    updateGrade(id, formData);
    navigate(".."); // Navigate back to detail view
  };

  const handleDelete = () => {
    if (!id) return;
    if (window.confirm("Are you sure you want to delete this record?")) {
      removeGrade(id);
      navigate("../.."); // Navigate back to list
    }
  };

  if (!grade && !error) {
    return (
      <Box>
        <Typography variant="body1">Loading record...</Typography>
      </Box>
    );
  }

  if (error && !grade) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={() => navigate("../..")}>
          Back to List
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Typography variant="h5" component="h2" sx={{ mb: 4, fontWeight: 700 }}>
          Edit Record
        </Typography>

        <Paper elevation={2} sx={{ p: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Entry Name"
                  fullWidth
                  required
                  value={formData.name || ""}
                  onChange={handleChange("name")}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Score"
                  type="number"
                  fullWidth
                  required
                  value={formData.score || 0}
                  onChange={handleChange("score")}
                  inputProps={{ min: 0, max: 100 }}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Student Name"
                  fullWidth
                  value={formData.studentName || ""}
                  onChange={handleChange("studentName")}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  select
                  label="Subject"
                  fullWidth
                  value={formData.subject || ""}
                  onChange={handleChange("subject")}
                  variant="outlined"
                >
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
                  label="Notes"
                  fullWidth
                  multiline
                  rows={4}
                  value={formData.notes || ""}
                  onChange={handleChange("notes")}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    sx={{
                      background: (theme) => theme.palette.mode === "light" ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" : "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
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
                  <Button
                    type="button"
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={handleDelete}
                    sx={{ ml: "auto" }}
                  >
                    Delete
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

export default StudentGradesEdit;
