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
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";

function LogSheetDetail(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Simulate log sheet data
  const logSheet = {
    id: id || "unknown",
    title: `Log Sheet ${id}`,
    content: `Details and content for log sheet ${id}`,
    status: "active",
    created: "2024-01-15",
    entries: 42,
  };

  return (
    <Box>
      <Typography variant="h5" component="h2" className="mb-4">
        Log Sheet Detail
      </Typography>
      <Paper elevation={2} className="p-6 max-w-2xl">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box className="flex justify-between items-center mb-2">
              <Typography variant="h6">{logSheet.title}</Typography>
              <Chip label={logSheet.status} color="success" size="small" />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="caption" className="text-gray-500">
              ID
            </Typography>
            <Typography variant="body1" className="font-semibold">
              {logSheet.id}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="caption" className="text-gray-500">
              Content
            </Typography>
            <Typography variant="body1" className="font-semibold mt-1">
              {logSheet.content}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="caption" className="text-gray-500">
              Entries
            </Typography>
            <Typography variant="h6" className="font-semibold">
              {logSheet.entries}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="caption" className="text-gray-500">
              Created
            </Typography>
            <Typography variant="body2">{logSheet.created}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/")}
            >
              Back to List
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default LogSheetDetail;
