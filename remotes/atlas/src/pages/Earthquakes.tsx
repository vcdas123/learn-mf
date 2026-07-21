import React, { useEffect } from "react";
import { Container, Typography, Box, Button, Skeleton, IconButton, useTheme } from "@mui/material";
import { ArrowBack as ArrowBackIcon, Refresh as RefreshIcon } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAtlasStore, fetchRecentEarthquakes, formatTimeAgo, getMagnitudeColor, EarthquakeFeature } from "../store/useAtlasStore";

export const Earthquakes: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { earthquakes, loadingEarthquakes, setEarthquakes, setLoadingEarthquakes } = useAtlasStore();

  useEffect(() => {
    if (earthquakes.length === 0) loadEarthquakes();
  }, []);

  const loadEarthquakes = async () => {
    setLoadingEarthquakes(true);
    try {
      const data = await fetchRecentEarthquakes();
      setEarthquakes(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingEarthquakes(false);
    }
  };

  const magCounts = earthquakes.reduce(
    (acc, eq) => {
      const mag = eq.properties.mag || 0;
      if (mag >= 5) acc.major++;
      else if (mag >= 3) acc.moderate++;
      else if (mag >= 1) acc.minor++;
      else acc.micro++;
      return acc;
    },
    { major: 0, moderate: 0, minor: 0, micro: 0 }
  );

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
          <IconButton onClick={loadEarthquakes} disabled={loadingEarthquakes} sx={{ color: "primary.main" }}>
            <RefreshIcon />
          </IconButton>
        </Box>

        <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 500, fontSize: { xs: "1.75rem", md: "2.25rem" }, letterSpacing: "-0.02em", color: "text.primary", mb: 1 }}>
          Earthquake Tracker
        </Typography>
        <Typography sx={{ color: "text.secondary", mb: 3, lineHeight: 1.6 }}>
          Real-time seismic data from the United States Geological Survey.
        </Typography>

        <Box sx={{ display: "flex", gap: 1, mb: 5, flexWrap: "wrap" }}>
          <Button component="a" href="/atlas" variant="outlined" size="small" sx={{ textTransform: "none", fontWeight: 500 }}>Dashboard</Button>
          <Button component="a" href="/atlas/books" variant="outlined" size="small" sx={{ textTransform: "none", fontWeight: 500 }}>Search Books</Button>
          <Button component="a" href="/atlas/subjects" variant="outlined" size="small" sx={{ textTransform: "none", fontWeight: 500 }}>Subjects</Button>
          <Button component="a" href="/atlas/new" variant="outlined" size="small" sx={{ textTransform: "none", fontWeight: 500 }}>New Arrivals</Button>
          <Button component="a" href="/atlas/earthquakes" variant="contained" size="small" sx={{ textTransform: "none", fontWeight: 500 }}>Earthquakes</Button>
        </Box>

        {/* Stats Bar */}
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(4, 1fr)" }, gap: 2, mb: 5 }}>
          {[
            { label: "Major (5+)", count: magCounts.major, color: "#c64545" },
            { label: "Moderate (3-4)", count: magCounts.moderate, color: "#e8a55a" },
            { label: "Minor (1-2)", count: magCounts.minor, color: "#5db872" },
            { label: "Micro (<1)", count: magCounts.micro, color: theme.palette.text.secondary },
          ].map((stat) => (
            <Box key={stat.label} sx={{ p: 2.5, borderRadius: "8px", border: "1px solid", borderColor: "divider", bgcolor: "background.paper", textAlign: "center" }}>
              <Typography sx={{ fontSize: "1.5rem", fontWeight: 600, color: stat.color, fontFamily: '"JetBrains Mono", monospace', mb: 0.5 }}>
                {stat.count}
              </Typography>
              <Typography sx={{ fontSize: "0.6875rem", color: "text.secondary", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {stat.label}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Earthquake List */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {loadingEarthquakes
            ? Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} height={80} sx={{ borderRadius: "8px" }} />
              ))
            : earthquakes.map((eq, index) => (
                <EarthquakeRow key={eq.id} eq={eq} index={index} />
              ))}
        </Box>

        {!loadingEarthquakes && earthquakes.length === 0 && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography sx={{ color: "text.secondary" }}>No earthquake data available.</Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

const EarthquakeRow: React.FC<{ eq: EarthquakeFeature; index: number }> = ({ eq, index }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const mag = eq.properties.mag || 0;
  const depth = eq.geometry.coordinates[2];

  return (
    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.03 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2.5,
          p: 2.5,
          borderRadius: "8px",
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          transition: "all 0.2s ease",
          "&:hover": { borderColor: "primary.main" },
        }}
      >
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: "8px",
            bgcolor: getMagnitudeColor(mag),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            fontWeight: 600,
            fontSize: "0.875rem",
            fontFamily: '"JetBrains Mono", monospace',
            flexShrink: 0,
          }}
        >
          {mag.toFixed(1)}
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: "0.9375rem", fontWeight: 500, color: "text.primary" }}>
            {eq.properties.place || "Unknown location"}
          </Typography>
          <Box sx={{ display: "flex", gap: 2, mt: 0.5 }}>
            <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
              {formatTimeAgo(eq.properties.time)}
            </Typography>
            <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
              Depth: {depth.toFixed(1)} km
            </Typography>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};
