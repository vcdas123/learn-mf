import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  LinearProgress,
} from "@mui/material";
import {
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  School as SchoolIcon,
  BarChart as BarChartIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useGradeStore } from "../store/useGradeStore";

function StudentGradesDashboard(): React.ReactElement {
  const navigate = useNavigate();
  const totalGrades = useGradeStore((state) => state.totalGrades());
  const averageScore = useGradeStore((state) => state.averageScore());
  const highGrades = useGradeStore((state) => state.highGrades());
  const mediumGrades = useGradeStore((state) => state.mediumGrades());
  const lowGrades = useGradeStore((state) => state.lowGrades());

  const stats = [
    {
      title: "Total Records",
      value: totalGrades,
      icon: <AssessmentIcon sx={{ fontSize: 40 }} />,
      color: "#6366f1",
      gradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
      action: () => navigate(".."),
    },
    {
      title: "Average Score",
      value: `${averageScore}%`,
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      color: "#10b981",
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      action: () => navigate("../statistics"),
    },
    {
      title: "High Performance",
      value: highGrades.length,
      icon: <SchoolIcon sx={{ fontSize: 40 }} />,
      color: "#3b82f6",
      gradient: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
      action: () => navigate("..?filter=high"),
    },
    {
      title: "Needs Attention",
      value: lowGrades.length,
      icon: <BarChartIcon sx={{ fontSize: 40 }} />,
      color: "#3b82f6",
      gradient: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
      action: () => navigate("..?filter=low"),
    },
  ];

  return (
    <Box>
      <Typography
        variant="h5"
        component="h2"
        sx={{ mb: 4, fontWeight: 700 }}
      >
        📊 Student Grades Dashboard
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }} alignItems="stretch">
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title} sx={{ display: "flex" }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              style={{ height: "100%", display: "flex", width: "100%" }}
            >
              <Card
                sx={{
                  height: "100%",
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  background: stat.gradient,
                  color: "white",
                  cursor: "pointer",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                  },
                }}
                onClick={stat.action}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    {stat.icon}
                    <Typography
                      variant="h4"
                      sx={{
                        ml: "auto",
                        fontWeight: 700,
                      }}
                    >
                      {stat.value}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    {stat.title}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Grade Distribution */}
      <Grid container spacing={3} alignItems="stretch">
        <Grid item xs={12} md={6} sx={{ display: "flex" }}>
          <Paper elevation={2} sx={{ p: 3, flexGrow: 1, display: "flex", flexDirection: "column" }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Performance Distribution
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body2">Excellent (≥90)</Typography>
                <Typography variant="body2" fontWeight={600}>
                  {highGrades.length} ({totalGrades > 0 ? Math.round((highGrades.length / totalGrades) * 100) : 0}%)
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={totalGrades > 0 ? (highGrades.length / totalGrades) * 100 : 0}
                color="success"
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body2">Average (70-89)</Typography>
                <Typography variant="body2" fontWeight={600}>
                  {mediumGrades.length} ({totalGrades > 0 ? Math.round((mediumGrades.length / totalGrades) * 100) : 0}%)
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={totalGrades > 0 ? (mediumGrades.length / totalGrades) * 100 : 0}
                color="warning"
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body2">Below Average (&lt;70)</Typography>
                <Typography variant="body2" fontWeight={600}>
                  {lowGrades.length} ({totalGrades > 0 ? Math.round((lowGrades.length / totalGrades) * 100) : 0}%)
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={totalGrades > 0 ? (lowGrades.length / totalGrades) * 100 : 0}
                color="error"
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} sx={{ display: "flex" }}>
          <Paper elevation={2} sx={{ p: 3, flexGrow: 1, display: "flex", flexDirection: "column" }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Quick Actions
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, flexGrow: 1 }}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => navigate("../add")}
                sx={{
                  background: (theme) => theme.palette.mode === "light" ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" : "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
                }}
              >
                Add New Record
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate("..")}
              >
                View All Records
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate("../statistics")}
              >
                View Detailed Analytics
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default StudentGradesDashboard;

