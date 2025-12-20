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
} from "@mui/material";
import {
  PlayArrow as PlayArrowIcon,
  Image as ImageIcon,
  Analytics as AnalyticsIcon,
  Insights as InsightsIcon,
  AddCircle as AddCircleIcon,
} from "@mui/icons-material";
// Use safe hooks that work in both host and standalone modes
import { useSelector, useDispatch } from "../hooks/useReduxStore";

function AiVisionDashboard(): React.ReactElement {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Access Redux store (from host in production, standalone in dev)
  const counter = useSelector((state: any) => state.counter);
  const app = useSelector((state: any) => state.app);

  const handleIncrement = () => {
    dispatch({ type: "counter/increment" });
    dispatch({
      type: "app/addNotification",
      payload: {
        message: "Counter incremented from AI Vision module!",
        type: "success",
      },
    });
  };

  const features = [
    {
      icon: <ImageIcon sx={{ fontSize: 40, color: "#6366f1" }} />,
      title: "Image Recognition",
      desc: "Advanced image analysis and pattern detection",
      gradient: "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)",
    },
    {
      icon: <AnalyticsIcon sx={{ fontSize: 40, color: "#10b981" }} />,
      title: "Pattern Detection",
      desc: "Identify patterns automatically with AI",
      gradient: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
    },
    {
      icon: <InsightsIcon sx={{ fontSize: 40, color: "#8b5cf6" }} />,
      title: "Automated Insights",
      desc: "Get instant AI-powered insights and recommendations",
      gradient: "linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)",
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
          AI Vision Dashboard
        </Typography>
        <Typography
          variant="body1"
          sx={{ mb: 6, color: "text.secondary", maxWidth: "600px" }}
        >
          Welcome to the AI Vision module dashboard. Start analyzing images and
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
              background: "linear-gradient(135deg, #e0e7ff 0%, #fce7f3 100%)",
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
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
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
                    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                    boxShadow: "0 4px 12px rgba(99, 102, 241, 0.4)",
                  }}
                >
                  Increment from AI Vision
                </Button>
              </motion.div>
            </Box>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              This counter is shared across all modules via the host Redux store
            </Typography>
          </Paper>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            variant="contained"
            size="large"
            startIcon={<PlayArrowIcon />}
            onClick={() => navigate("analyze")}
            sx={{
              mb: 6,
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              boxShadow: "0 4px 12px rgba(99, 102, 241, 0.4)",
              px: 4,
              py: 1.5,
              borderRadius: 2,
            }}
          >
            Start Analysis
          </Button>
        </motion.div>
      </motion.div>

      <Grid container spacing={3}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={4} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <Card
                elevation={0}
                sx={{
                  height: "100%",
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
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {feature.desc}
                  </Typography>
                </CardContent>
                <CardActions sx={{ px: 3, pb: 3 }}>
                  <Button
                    size="small"
                    onClick={() => navigate("analyze")}
                    sx={{ fontWeight: 600 }}
                  >
                    Learn More
                  </Button>
                </CardActions>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default AiVisionDashboard;
