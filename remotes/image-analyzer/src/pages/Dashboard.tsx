import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Box,
  Button,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
} from "@mui/material";
import {
  PlayArrow as PlayArrowIcon,
  Image as ImageIcon,
  Analytics as AnalyticsIcon,
  Insights as InsightsIcon,
  AddCircle as AddCircleIcon,
  Delete as DeleteIcon,
  History as HistoryIcon,
} from "@mui/icons-material";
// Use safe hooks that work in both host and standalone modes
import { useSelector, useDispatch } from "../hooks/useReduxStore";
import { useImageStore } from "../store/useImageStore";

function ImageAnalyzerDashboard(): React.ReactElement {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { history, removeAnalysis } = useImageStore();
  
  // Access Redux store (from host in production, standalone in dev)
  const counter = useSelector((state: any) => state.counter);

  const handleIncrement = () => {
    dispatch({ type: "counter/increment" });
    dispatch({
      type: "app/addNotification",
      payload: {
        message: "Counter incremented from Image Analyzer module!",
        type: "success",
      },
    });
  };

  const features = [
    {
      icon: <ImageIcon sx={{ fontSize: 40, color: "#6366f1" }} />,
      title: "Image Recognition",
      desc: "Advanced image analysis and pattern detection powered by deep learning models.",
      gradient: (theme: any) => theme.palette.mode === "light" ? "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)" : "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
    },
    {
      icon: <AnalyticsIcon sx={{ fontSize: 40, color: "#10b981" }} />,
      title: "Pattern Detection",
      desc: "Identify repetitive patterns and anomalies automatically with enterprise AI.",
      gradient: (theme: any) => theme.palette.mode === "light" ? "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)" : "linear-gradient(135deg, #064e3b 0%, #065f46 100%)",
    },
    {
      icon: <InsightsIcon sx={{ fontSize: 40, color: "#8b5cf6" }} />,
      title: "Automated Insights",
      desc: "Get instant AI-powered insights and actionable recommendations for your data.",
      gradient: (theme: any) => theme.palette.mode === "light" ? "linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)" : "linear-gradient(135deg, #2e1065 0%, #4c1d95 100%)",
    },
  ];

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          variant="h5"
          component="h2"
          sx={{ mb: 2, fontWeight: 600 }}
          gutterBottom
        >
          Image Analyzer Dashboard
        </Typography>
        <Typography
          variant="body1"
          sx={{ mb: 6, color: "text.secondary", maxWidth: "600px" }}
        >
          Welcome to the Image Analyzer module. Start analyzing images and
          get insights powered by artificial intelligence.
        </Typography>
        
        {/* Redux Store Integration Demo */}
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
              background: (theme) => theme.palette.mode === "light" ? "linear-gradient(135deg, #e0e7ff 0%, #fce7f3 100%)" : "linear-gradient(135deg, #1e293b 0%, #1e1b4b 100%)",
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              🔄 Redux Store Integration (From Host)
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
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Shared Counter Value:
              </Typography>
              <Typography
                variant="h5"
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
                <Button
                  variant="contained"
                  size="medium"
                  startIcon={<AddCircleIcon />}
                  onClick={handleIncrement}
                  sx={{
                    background: (theme) => theme.palette.mode === "light" ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" : "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
                    boxShadow: "0 4px 12px rgba(99, 102, 241, 0.4)",
                  }}
                >
                  Increment from Module
                </Button>
              </motion.div>
            </Box>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              This counter is shared across all modules via the host Redux store
            </Typography>
          </Paper>
        </motion.div>

        <Box sx={{ display: "flex", gap: 2, mb: 6 }}>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<PlayArrowIcon />}
              onClick={() => navigate("analyze")}
              sx={{
                background: (theme) => theme.palette.mode === "light" ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" : "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
                boxShadow: "0 4px 12px rgba(99, 102, 241, 0.4)",
                px: 4,
                py: 1.5,
                borderRadius: 2,
              }}
            >
              Start Analysis
            </Button>
          </motion.div>
        </Box>
      </motion.div>

      {/* Feature Cards */}
      <Grid container spacing={3} sx={{ mb: 8 }} alignItems="stretch">
        {features.map((feature, index) => (
          <Grid item xs={12} md={4} key={index} sx={{ display: "flex" }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -8 }}
              style={{ height: "100%", display: "flex", width: "100%" }}
            >
              <Card
                elevation={0}
                sx={{
                  height: "100%",
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  background: feature.gradient,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <CardContent sx={{ p: 3, flexGrow: 1 }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                    {feature.desc}
                  </Typography>
                </CardContent>
                <CardActions sx={{ px: 3, pb: 3 }}>
                  <Button
                    size="small"
                    onClick={() => navigate("analyze")}
                    sx={{ fontWeight: 600 }}
                  >
                    Launch
                  </Button>
                </CardActions>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Analysis History Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <HistoryIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Analysis History
          </Typography>
          <Chip label={history.length} size="small" variant="outlined" sx={{ ml: 1 }} />
        </Box>

        {history.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: "center", border: "2px dashed", borderColor: "divider", bgcolor: "transparent" }}>
            <Typography color="text.secondary">No analysis history found.</Typography>
          </Paper>
        ) : (
          <Grid container spacing={2}>
            {history.map((item) => (
              <Grid item xs={12} key={item.id}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    transition: "transform 0.2s",
                    "&:hover": { transform: "translateX(4px)", borderColor: "primary.main" }
                  }}
                >
                  <ImageIcon color="action" />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{item.imageName}</Typography>
                    <Typography variant="caption" color="text.secondary">{item.timestamp}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    {item.tags.slice(0, 2).map(tag => (
                      <Chip key={tag} label={tag} size="small" sx={{ fontSize: "0.65rem" }} />
                    ))}
                    <Chip 
                      label={`${item.score}%`} 
                      size="small" 
                      color={item.result as any} 
                      sx={{ fontWeight: 700 }}
                    />
                    <IconButton size="small" color="error" onClick={() => removeAnalysis(item.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
}

export default ImageAnalyzerDashboard;
