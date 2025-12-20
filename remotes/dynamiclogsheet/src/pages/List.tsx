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

function LogSheetList(): React.ReactElement {
  const navigate = useNavigate();

  // Access Redux store (from host in production, standalone in dev)
  const counter = useSelector((state: any) => state.counter);
  const dispatch = useDispatch();

  const handleDecrement = () => {
    dispatch({ type: "counter/decrement" });
    dispatch({
      type: "app/addNotification",
      payload: {
        message: `Counter decremented from Log Sheet module! Current value: ${counter.value - 1}`,
        type: "info",
      },
    });
  };

  const logSheets = [
    { id: "1", title: "Daily Log Sheet", date: "2024-01-15", status: "active" },
    { id: "2", title: "Weekly Summary", date: "2024-01-14", status: "completed" },
    { id: "3", title: "Monthly Report", date: "2024-01-13", status: "draft" },
  ];

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
                onClick={handleDecrement}
                sx={{
                  background: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
                  boxShadow: "0 4px 12px rgba(236, 72, 153, 0.4)",
                }}
              >
                Decrement from Log Sheet
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
            Log Sheet List
          </Typography>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                boxShadow: "0 4px 12px rgba(99, 102, 241, 0.4)",
              }}
            >
              Add New Log Sheet
            </Button>
          </motion.div>
        </Box>

        <Grid container spacing={3}>
          {logSheets.map((sheet, index) => (
            <Grid item xs={12} md={6} lg={4} key={sheet.id}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                whileHover={{ y: -8 }}
                style={{ height: "100%" }}
              >
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
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
                  onClick={() => navigate(sheet.id)}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "start",
                        justifyContent: "space-between",
                        mb: 3,
                      }}
                    >
                      <DescriptionIcon
                        sx={{ fontSize: 40, color: "#6366f1" }}
                      />
                      <Chip
                        label={sheet.status}
                        color={getStatusColor(sheet.status) as any}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{ mb: 2, fontWeight: 600 }}
                    >
                      {sheet.title}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "text.secondary",
                        mb: 3,
                      }}
                    >
                      <CalendarIcon sx={{ fontSize: 16, mr: 1 }} />
                      <Typography variant="caption">
                        Date: {sheet.date}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "end" }}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(sheet.id);
                        }}
                        sx={{
                          color: "primary.main",
                          "&:hover": {
                            background: "rgba(99, 102, 241, 0.08)",
                          },
                        }}
                      >
                        <ArrowForwardIcon />
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

export default LogSheetList;
