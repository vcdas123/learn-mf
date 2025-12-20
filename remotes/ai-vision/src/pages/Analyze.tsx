import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Box,
  Button,
  Paper,
  Typography,
  LinearProgress,
  Chip,
  Card,
  CardContent,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { useSelector } from "../hooks/useReduxStore";

function AiVisionAnalyze(): React.ReactElement {
  const navigate = useNavigate();
  const [progress, setProgress] = React.useState(0);
  
  // Access Redux store (from host in production, standalone in dev)
  const counter = useSelector((state: any) => state.counter);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 100;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

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
          sx={{ mb: 4, fontWeight: 600 }}
        >
          AI Vision Analysis
        </Typography>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 6 },
            maxWidth: "800px",
            background: "linear-gradient(135deg, #fafafa 0%, #ffffff 100%)",
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box sx={{ mb: 4 }}>
            <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
              AI Vision analysis in progress...
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 10,
                borderRadius: 2,
                mb: 2,
                background: "#e5e7eb",
                "& .MuiLinearProgress-bar": {
                  background: "linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)",
                  borderRadius: 2,
                },
              }}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Processing image data...
              </Typography>
              <Chip
                label={`${Math.round(progress)}%`}
                size="small"
                sx={{
                  background:
                    progress === 100
                      ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                      : "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  color: "white",
                  fontWeight: 600,
                }}
              />
            </Box>
          </Box>
          {progress >= 100 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card
                elevation={0}
                sx={{
                  mb: 4,
                  background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
                  border: "1px solid",
                  borderColor: "#10b981",
                  borderRadius: 3,
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: 2,
                      color: "#065f46",
                    }}
                  >
                    ✅ Analysis Complete!
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 4, color: "#047857" }}>
                    The AI has successfully processed the image and identified key
                    patterns and insights. The analysis includes:
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 3 }}>
                    <Chip
                      label="Pattern Recognition"
                      size="small"
                      sx={{
                        background: "#10b981",
                        color: "white",
                        fontWeight: 600,
                      }}
                    />
                    <Chip
                      label="Object Detection"
                      size="small"
                      sx={{
                        background: "#10b981",
                        color: "white",
                        fontWeight: 600,
                      }}
                    />
                    <Chip
                      label="Feature Extraction"
                      size="small"
                      sx={{
                        background: "#10b981",
                        color: "white",
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                  
                  {/* Show Redux counter value */}
                  <Paper
                    elevation={0}
                    sx={{
                      mt: 3,
                      p: 3,
                      background: "white",
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        mb: 1,
                        color: "text.secondary",
                        fontWeight: 600,
                      }}
                    >
                      Current Counter Value (from shared Redux store):
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
                  </Paper>
                </CardContent>
              </Card>
            </motion.div>
          )}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="contained"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/")}
              sx={{
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                boxShadow: "0 4px 12px rgba(99, 102, 241, 0.4)",
                px: 4,
                py: 1.5,
                borderRadius: 2,
              }}
            >
              Back to Dashboard
            </Button>
          </motion.div>
        </Paper>
      </motion.div>
    </Box>
  );
}

export default AiVisionAnalyze;
