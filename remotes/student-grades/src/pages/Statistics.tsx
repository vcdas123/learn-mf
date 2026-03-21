import React from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
} from "@mui/material";
import {
  BarChart as BarChartIcon,
  TrendingUp as TrendingUpIcon,
  School as SchoolIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useGradeStore } from "../store/useGradeStore";

function StudentGradesStatistics(): React.ReactElement {
  const grades = useGradeStore((state) => state.grades);
  const averageScore = useGradeStore((state) => state.averageScore());
  const highGrades = useGradeStore((state) => state.highGrades());
  const mediumGrades = useGradeStore((state) => state.mediumGrades());
  const lowGrades = useGradeStore((state) => state.lowGrades());
  const totalGrades = useGradeStore((state) => state.totalGrades());

  // Calculate statistics by subject
  const subjectStats = grades.reduce((acc, grade) => {
    const subject = grade.subject || "Other";
    if (!acc[subject]) {
      acc[subject] = { count: 0, total: 0, grades: [] };
    }
    acc[subject].count += 1;
    acc[subject].total += grade.score;
    acc[subject].grades.push(grade);
    return acc;
  }, {} as Record<string, { count: number; total: number; grades: any[] }>);

  const subjectAverages = Object.entries(subjectStats).map(([subject, stats]) => ({
    subject,
    average: Math.round((stats.total / stats.count) * 100) / 100,
    count: stats.count,
  }));

  // Find highest and lowest scores
  const highestGrade = grades.reduce((max, g) => (g.score > max.score ? g : max), grades[0]);
  const lowestGrade = grades.reduce((min, g) => (min.score < g.score ? g : min), grades[0]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return "success";
    if (score >= 70) return "warning";
    return "error";
  };

  return (
    <Box>
      <Typography
        variant="h5"
        component="h2"
        sx={{ mb: 4, fontWeight: 700 }}
      >
        📈 Performance Analytics
      </Typography>

      {/* Overall Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Paper elevation={2} sx={{ p: 3, textAlign: "center" }}>
              <BarChartIcon sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {averageScore}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Average Success Rate
              </Typography>
            </Paper>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Paper elevation={2} sx={{ p: 3, textAlign: "center" }}>
              <TrendingUpIcon sx={{ fontSize: 48, color: "success.main", mb: 2 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {highestGrade?.score || 0}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Top Performance
              </Typography>
              {highestGrade && (
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  {highestGrade.name}
                </Typography>
              )}
            </Paper>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Paper elevation={2} sx={{ p: 3, textAlign: "center" }}>
              <SchoolIcon sx={{ fontSize: 48, color: "error.main", mb: 2 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {lowestGrade?.score || 0}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Needs Review
              </Typography>
              {lowestGrade && (
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  {lowestGrade.name}
                </Typography>
              )}
            </Paper>
          </motion.div>
        </Grid>
      </Grid>

      {/* Grade Distribution */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Performance Tiers
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Chip label="Excellent" color="success" size="small" />
                  <Typography variant="body2">≥90%</Typography>
                </Box>
                <Typography variant="body2" fontWeight={600}>
                  {highGrades.length} ({totalGrades > 0 ? Math.round((highGrades.length / totalGrades) * 100) : 0}%)
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={totalGrades > 0 ? (highGrades.length / totalGrades) * 100 : 0}
                color="success"
                sx={{ height: 10, borderRadius: 5 }}
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Chip label="Average" color="warning" size="small" />
                  <Typography variant="body2">70-89%</Typography>
                </Box>
                <Typography variant="body2" fontWeight={600}>
                  {mediumGrades.length} ({totalGrades > 0 ? Math.round((mediumGrades.length / totalGrades) * 100) : 0}%)
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={totalGrades > 0 ? (mediumGrades.length / totalGrades) * 100 : 0}
                color="warning"
                sx={{ height: 10, borderRadius: 5 }}
              />
            </Box>
            <Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Chip label="Below" color="error" size="small" />
                  <Typography variant="body2">Less than 70%</Typography>
                </Box>
                <Typography variant="body2" fontWeight={600}>
                  {lowGrades.length} ({totalGrades > 0 ? Math.round((lowGrades.length / totalGrades) * 100) : 0}%)
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={totalGrades > 0 ? (lowGrades.length / totalGrades) * 100 : 0}
                color="error"
                sx={{ height: 10, borderRadius: 5 }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Subject Averages */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Performance by Category
            </Typography>
            {subjectAverages.length > 0 ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {subjectAverages.map(({ subject, average, count }) => (
                  <Box key={subject}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography variant="body2" fontWeight={600}>
                        {subject}
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {average}% ({count} entries)
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={average}
                      color={getScoreColor(average) as "success" | "warning" | "error"}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No categorical data available
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default StudentGradesStatistics;
