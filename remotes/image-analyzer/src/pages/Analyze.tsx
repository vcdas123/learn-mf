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
import { useImageStore } from "../store/useImageStore";

function ImageAnalyzerAnalyze(): React.ReactElement {
  const navigate = useNavigate();
  const [progress, setProgress] = React.useState(0);
  const [isSaved, setIsSaved] = React.useState(false);
  const addAnalysis = useImageStore((state) => state.addAnalysis);
  
  // Access Redux store (from host in production, standalone in dev)
  const counter = useSelector((state: any) => state.counter);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(timer);
          return 100;
        }
        const diff = Math.random() * 15;
        return Math.min(oldProgress + diff, 100);
      });
    }, 400);

    return () => {
      clearInterval(timer);
    };
  }, []);

  React.useEffect(() => {
    if (progress === 100 && !isSaved) {
      // Automatically save to local history when complete
      const results: Array<"success" | "warning"> = ["success", "warning"];
      const randomResult = results[Math.floor(Math.random() * results.length)];
      
      addAnalysis({
        imageName: `analysis_${Date.now().toString().slice(-4)}.png`,
        result: randomResult,
        score: Math.round(70 + Math.random() * 30),
        tags: ["AI-Generated", "Neural-Scan", "Analyzed"],
      });
      setIsSaved(true);
    }
  }, [progress, isSaved, addAnalysis]);

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
          Image Analyzer Analysis
        </Typography>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 6 },
            maxWidth: "800px",
            background: (theme) => theme.palette.mode === "light" ? "linear-gradient(135deg, #fafafa 0%, #ffffff 100%)" : "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box sx={{ mb: 4 }}>
            <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
              {progress < 100 ? "Image Analyzer analysis in progress..." : "Analysis complete! Results saved to history."}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 10,
                borderRadius: 2,
                mb: 2,
                background: (theme) => theme.palette.mode === "light" ? "#e5e7eb" : "rgba(255,255,255,0.1)",
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
                {progress < 100 ? "Processing neural networks..." : "Saved to local storage"}
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
                  background: (theme) => theme.palette.mode === "light" ? "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)" : "linear-gradient(135deg, #064e3b 0%, #065f46 100%)",
                  border: "1px solid",
                  borderColor: "success.main",
                  borderRadius: 3,
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: 2,
                      color: (theme) => theme.palette.mode === "light" ? "#065f46" : "#ecfdf5",
                    }}
                  >
                    ✅ Scan Finished
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 4, color: (theme) => theme.palette.mode === "light" ? "#047857" : "#a7f3d0" }}>
                    The Image Analyzer has processed your request and synchronized the results with your local module store.
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 3 }}>
                    <Chip label="Neural-Scan" size="small" />
                    <Chip label="Pattern-Match" size="small" />
                    <Chip label="Stored" size="small" />
                  </Box>
                  
                  {/* Show Redux counter value */}
                  <Paper
                    elevation={0}
                    sx={{
                      mt: 3,
                      p: 3,
                      background: (theme) => theme.palette.mode === "light" ? "white" : "rgba(0,0,0,0.2)",
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
                      Global Shared State (Redux):
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
                      Value: {counter.value}
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
              onClick={() => navigate("..")}
              sx={{
                background: (theme) => theme.palette.mode === "light" ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" : "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
                boxShadow: "0 4px 12px rgba(99, 102, 241, 0.4)",
                px: 4,
                py: 1.5,
                borderRadius: 2,
              }}
            >
              Return to Dashboard
            </Button>
          </motion.div>
        </Paper>
      </motion.div>
    </Box>
  );
}

export default ImageAnalyzerAnalyze;
