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
  IconButton,
} from "@mui/material";
import { 
  ArrowBack as ArrowBackIcon, 
  Delete as DeleteIcon,
  Edit as EditIcon 
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useActivityStore } from "../store/useActivityStore";

function ActivityLogDetail(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const getLogById = useActivityStore((state) => state.getLogById);
  const removeLog = useActivityStore((state) => state.removeLog);

  const log = id ? getLogById(id) : undefined;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "completed":
        return "primary";
      case "draft":
        return "warning";
      default:
        return "default";
    }
  };

  const handleDelete = () => {
    if (!id) return;
    if (window.confirm("Are you sure you want to delete this log?")) {
      removeLog(id);
      navigate("..");
    }
  };

  if (!log) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>Log entry not found</Alert>
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
          Activity Log Record
        </Typography>
        <Paper 
          elevation={2} 
          sx={{ 
            p: 4, 
            maxWidth: 800,
            background: (theme) => theme.palette.mode === "light" ? "linear-gradient(135deg, #fafafa 0%, #ffffff 100%)" : "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)" 
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>{log.title}</Typography>
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => navigate("edit")}
                  >
                    Edit
                  </Button>
                  <Chip 
                    label={log.status} 
                    color={getStatusColor(log.status) as any} 
                    size="small" 
                    sx={{ fontWeight: 600 }}
                  />
                  <IconButton color="error" size="small" onClick={handleDelete}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary">
                Log ID
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, fontFamily: "monospace" }}>
                {log.id}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary">
                Full Content & Description
              </Typography>
              <Typography variant="body1" sx={{ mt: 1, whiteSpace: "pre-wrap" }}>
                {log.description || "No detailed description available for this log entry."}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="caption" color="text.secondary">
                Total Entries
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {log.entries || 0}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="caption" color="text.secondary">
                Log Date
              </Typography>
              <Typography variant="body1">{log.date}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate("..")}
                  sx={{
                    background: (theme) => theme.palette.mode === "light" ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" : "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
                  }}
                >
                  Back to List
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>
    </Box>
  );
}

export default ActivityLogDetail;
