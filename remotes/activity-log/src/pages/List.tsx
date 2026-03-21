import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  IconButton,
  Button,
  Paper,
} from "@mui/material";
import {
  Description as DescriptionIcon,
  CalendarToday as CalendarIcon,
  ArrowForward as ArrowForwardIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { useSelector, useDispatch } from "../hooks/useReduxStore";
import { useActivityStore } from "../store/useActivityStore";

function ActivityLogList(): React.ReactElement {
  const navigate = useNavigate();
  const logs = useActivityStore((state) => state.logs);

  // Debug log to verify state updates
  React.useEffect(() => {
    console.log("Activity Logs updated:", logs);
  }, [logs]);

  // Access Redux store (from host in production, standalone in dev)
  const counter = useSelector((state: any) => state.counter);
  const dispatch = useDispatch();

  const handleDecrement = () => {
    dispatch({ type: "counter/decrement" });
    dispatch({
      type: "app/addNotification",
      payload: {
        message: `Counter decremented from Activity Log module! Current value: ${counter.value - 1}`,
        type: "info",
      },
    });
  };

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
                onClick={handleDecrement}
                sx={{
                  background: (theme) => theme.palette.mode === "light" ? "linear-gradient(135deg, #ec4899 0%, #db2777 100%)" : "linear-gradient(135deg, #be185d 0%, #9d174d 100%)",
                  boxShadow: "0 4px 12px rgba(236, 72, 153, 0.4)",
                }}
              >
                Decrement from Activity Log
              </Button>
            </motion.div>
          </Box>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            This counter is shared across all modules via the host Redux store
          </Typography>
        </Paper>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
            Activity Log Records
          </Typography>
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
              Add New Log
            </Button>
          </motion.div>
        </Box>

        <Grid container spacing={3} alignItems="stretch">
          {logs.map((log, index) => (
            <Grid item xs={12} md={6} lg={4} key={log.id} sx={{ display: "flex" }}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
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
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
                      borderColor: "primary.main",
                    },
                  }}
                  onClick={() => navigate(log.id)}
                >
                  <CardContent sx={{ p: 3, flexGrow: 1, display: "flex", flexDirection: "column" }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "start",
                        justifyContent: "space-between",
                        mb: 3,
                      }}
                    >
                      <DescriptionIcon
                        sx={{ fontSize: 40, color: "primary.main" }}
                      />
                      <Chip
                        label={log.status}
                        color={getStatusColor(log.status) as any}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{ mb: 2, fontWeight: 600 }}
                    >
                      {log.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 3,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        flexGrow: 1,
                      }}
                    >
                      {log.description || "No description provided."}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "text.secondary",
                        mt: "auto",
                      }}
                    >
                      <CalendarIcon sx={{ fontSize: 16, mr: 1 }} />
                      <Typography variant="caption">
                        {log.date} • {log.entries || 0} entries
                      </Typography>
                      <Box sx={{ flexGrow: 1 }} />
                      <IconButton
                        size="small"
                        sx={{
                          color: "primary.main",
                          "&:hover": {
                            background: "rgba(99, 102, 241, 0.08)",
                          },
                        }}
                      >
                        <ArrowForwardIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>
    </Box>
  );
}

export default ActivityLogList;
