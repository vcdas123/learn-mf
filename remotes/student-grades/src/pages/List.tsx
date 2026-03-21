import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Dashboard as DashboardIcon,
  BarChart as BarChartIcon,
} from "@mui/icons-material";
import { useGradeStore } from "../store/useGradeStore";
import { useSelector, useDispatch } from "../hooks/useReduxStore";

function StudentGradesList(): React.ReactElement {
  const navigate = useNavigate();

  // Using Zustand for module-specific state
  const filteredGrades = useGradeStore((state) => state.filteredGrades());
  const setSearchQuery = useGradeStore((state) => state.setSearchQuery);
  const setFilterBy = useGradeStore((state) => state.setFilterBy);
  const searchQuery = useGradeStore((state) => state.searchQuery);
  const filterBy = useGradeStore((state) => state.filterBy);
  const removeGrade = useGradeStore((state) => state.removeGrade);

  // Access Redux store (from host in production, standalone in dev)
  const counter = useSelector((state: any) => state.counter);
  const dispatch = useDispatch();

  const handleIncrement = () => {
    dispatch({ type: "counter/increment" });
    dispatch({
      type: "app/addNotification",
      payload: {
        message: `Counter incremented from Student Grades module! Current value: ${counter.value + 1}`,
        type: "success",
      },
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "success";
    if (score >= 70) return "warning";
    return "error";
  };

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Redux Store Integration Demo */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
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
              mb: 2,
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
                onClick={handleIncrement}
                sx={{
                  background: (theme) => theme.palette.mode === "light" ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" : "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
                  boxShadow: "0 4px 12px rgba(99, 102, 241, 0.4)",
                }}
              >
                Increment from Student Grades
              </Button>
            </motion.div>
          </Box>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            This counter is shared across all modules via the host Redux store
          </Typography>
        </Paper>

        {/* Header with Actions */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
            Student Grades
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Button
              variant="outlined"
              startIcon={<DashboardIcon />}
              onClick={() => navigate("dashboard")}
            >
              Dashboard
            </Button>
            <Button
              variant="outlined"
              startIcon={<BarChartIcon />}
              onClick={() => navigate("statistics")}
            >
              Statistics
            </Button>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate("add")}
                sx={{
                  background: (theme) => theme.palette.mode === "light" ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" : "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
                  boxShadow: "0 4px 12px rgba(99, 102, 241, 0.4)",
                }}
              >
                Add New Record
              </Button>
            </motion.div>
          </Box>
        </Box>

        {/* Search and Filter */}
        <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
          <TextField
            placeholder="Search records..."
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ flexGrow: 1, minWidth: 200 }}
          />
          <Tabs
            value={filterBy}
            onChange={(_, value) => setFilterBy(value)}
            sx={{ minHeight: "auto" }}
          >
            <Tab label="All" value="all" />
            <Tab label="High (≥90)" value="high" />
            <Tab label="Medium (70-89)" value="medium" />
            <Tab label="Low (&lt;70)" value="low" />
          </Tabs>
        </Box>

        {filteredGrades.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 6,
              textAlign: "center",
              border: "2px dashed",
              borderColor: "divider",
              borderRadius: 3,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, color: "text.secondary" }}>
              No grades yet
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
              Get started by adding your first grade entry
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("add")}
              sx={{
                background: (theme) => theme.palette.mode === "light" ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" : "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
                boxShadow: "0 4px 12px rgba(99, 102, 241, 0.4)",
              }}
            >
              Add Grade
            </Button>
          </Paper>
        ) : (
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              overflow: "hidden",
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ background: (theme) => theme.palette.mode === "light" ? "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)" : "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)" }}>
                  <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Student</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Subject</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Score</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredGrades.map((grade, index) => (
                  <TableRow
                    key={grade.id}
                    sx={{
                      opacity: 0,
                      animation: `fadeIn 0.3s ease ${index * 0.05}s forwards`,
                      "@keyframes fadeIn": {
                        from: { opacity: 0, transform: "translateX(-20px)" },
                        to: { opacity: 1, transform: "translateX(0)" },
                      },
                      "&:hover": {
                        background: "rgba(99, 102, 241, 0.04)",
                      },
                    }}
                  >
                    <TableCell sx={{ fontWeight: 500 }}>{grade.name}</TableCell>
                    <TableCell>{grade.studentName || "-"}</TableCell>
                    <TableCell>
                      {grade.subject ? (
                        <Chip label={grade.subject} size="small" variant="outlined" />
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${grade.score}%`}
                        color={getScoreColor(grade.score) as "success" | "warning" | "error"}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>
                      {grade.date ? new Date(grade.date).toLocaleDateString() : "-"}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => navigate(`${grade.id}`)}
                            color="primary"
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => navigate(`${grade.id}/edit`)}
                            color="primary"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => {
                              if (window.confirm(`Delete "${grade.name}"?`)) {
                                removeGrade(grade.id);
                              }
                            }}
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </motion.div>
    </Box>
  );
}

export default StudentGradesList;
