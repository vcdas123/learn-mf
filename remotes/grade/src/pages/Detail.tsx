import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Paper,
  Typography,
  Grid,
  Divider,
  Chip,
  Alert,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useGradeStore } from "../store/useGradeStore";

function GradeDetail(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const getGradeById = useGradeStore((state) => state.getGradeById);
  const removeGrade = useGradeStore((state) => state.removeGrade);

  const grade = id ? getGradeById(id) : undefined;

  const getScoreColor = (score: number) => {
    if (score >= 90) return "success";
    if (score >= 70) return "warning";
    return "error";
  };

  const handleDelete = () => {
    if (!id) return;
    if (window.confirm("Are you sure you want to delete this grade?")) {
      removeGrade(id);
      navigate("/");
    }
  };

  if (!grade) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          Grade not found
        </Alert>
        <Button variant="outlined" onClick={() => navigate("/")}>
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
          Grade Details
        </Typography>
        <Paper elevation={2} sx={{ p: 4, maxWidth: 800 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Grade ID
                </Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => navigate(`/${id}/edit`)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<DeleteIcon />}
                    onClick={handleDelete}
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
              <Typography variant="body1" sx={{ fontWeight: 600, fontFamily: "monospace" }}>
                {grade.id}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                Grade Name
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {grade.name}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                Score
              </Typography>
              <Chip
                label={`${grade.score}%`}
                color={getScoreColor(grade.score) as "success" | "warning" | "error"}
                size="medium"
                sx={{ fontSize: "1rem", fontWeight: 700, height: 32, px: 1 }}
              />
            </Grid>

            {grade.studentName && (
              <Grid item xs={12} md={6}>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                  Student Name
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {grade.studentName}
                </Typography>
              </Grid>
            )}

            {grade.subject && (
              <Grid item xs={12} md={6}>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                  Subject
                </Typography>
                <Chip label={grade.subject} variant="outlined" />
              </Grid>
            )}

            {grade.date && (
              <Grid item xs={12} md={6}>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                  Date
                </Typography>
                <Typography variant="body2">
                  {new Date(grade.date).toLocaleDateString()}
                </Typography>
              </Grid>
            )}

            {grade.notes && (
              <>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                    Notes
                  </Typography>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      bgcolor: "grey.50",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                      {grade.notes}
                    </Typography>
                  </Paper>
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Button
                variant="contained"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate("/")}
                sx={{
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                }}
              >
                Back to List
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>
    </Box>
  );
}

export default GradeDetail;
