import React, { useEffect } from "react";
import { Container, Typography, Box, Card, CardContent, Skeleton, useTheme, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Book as BookIcon, Public as GlobeIcon } from "@mui/icons-material";
import { useAtlasStore, fetchRecentEarthquakes, formatTimeAgo, getMagnitudeColor } from "../store/useAtlasStore";

export const Dashboard: React.FC = () => {
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

  const recentQuakes = earthquakes.slice(0, 5);

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        <Typography
          sx={{
            fontFamily: '"Cormorant Garamond", serif',
            fontWeight: 500,
            fontSize: { xs: "1.75rem", md: "2.25rem" },
            letterSpacing: "-0.02em",
            color: "text.primary",
            mb: 1,
          }}
        >
          World Knowledge
        </Typography>
        <Typography sx={{ color: "text.secondary", mb: 3, lineHeight: 1.6 }}>
          Explore books from the world's largest open library and track real-time seismic activity.
        </Typography>

        <Box sx={{ display: "flex", gap: 1, mb: 6, flexWrap: "wrap" }}>
          <Button component={Link} to="/atlas" variant="contained" size="small" sx={{ textTransform: "none", fontWeight: 500 }}>Dashboard</Button>
          <Button component={Link} to="/atlas/books" variant="outlined" size="small" sx={{ textTransform: "none", fontWeight: 500 }}>Search Books</Button>
          <Button component={Link} to="/atlas/subjects" variant="outlined" size="small" sx={{ textTransform: "none", fontWeight: 500 }}>Subjects</Button>
          <Button component={Link} to="/atlas/new" variant="outlined" size="small" sx={{ textTransform: "none", fontWeight: 500 }}>New Arrivals</Button>
          <Button component={Link} to="/atlas/earthquakes" variant="outlined" size="small" sx={{ textTransform: "none", fontWeight: 500 }}>Earthquakes</Button>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" }, gap: 3, mb: 6 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} whileHover={{ y: -4 }}>
            <Card
              component={Link}
              to="/atlas/books"
              elevation={0}
              sx={{
                textDecoration: "none",
                color: "inherit",
                borderRadius: "12px",
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
                transition: "all 0.3s ease",
                "&:hover": { borderColor: "primary.main", boxShadow: isDark ? "0 2px 8px rgba(0,0,0,0.4)" : "0 1px 3px rgba(20,20,19,0.08)" },
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ color: "primary.main", mb: 2 }}>
                  <BookIcon sx={{ fontSize: 40 }} />
                </Box>
                <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 500, fontSize: "1.5rem", color: "text.primary", mb: 1 }}>
                  Open Library
                </Typography>
                <Typography sx={{ color: "text.secondary", fontSize: "0.9375rem", lineHeight: 1.6 }}>
                  Search millions of books. Browse by subject, author, or keyword. Access the world's largest open catalog.
                </Typography>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} whileHover={{ y: -4 }}>
            <Card
              component={Link}
              to="/atlas/earthquakes"
              elevation={0}
              sx={{
                textDecoration: "none",
                color: "inherit",
                borderRadius: "12px",
                border: "1px solid #a9583e",
                bgcolor: "#cc785c",
                transition: "all 0.3s ease",
                "&:hover": { opacity: 0.9, boxShadow: isDark ? "0 2px 8px rgba(0,0,0,0.4)" : "0 1px 3px rgba(20,20,19,0.08)" },
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ color: "#ffffff", mb: 2, opacity: 0.9 }}>
                  <GlobeIcon sx={{ fontSize: 40 }} />
                </Box>
                <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 500, fontSize: "1.5rem", color: "#ffffff", mb: 1 }}>
                  Earthquake Tracker
                </Typography>
                <Typography sx={{ color: "#ffffff", fontSize: "0.9375rem", lineHeight: 1.6, opacity: 0.85 }}>
                  Real-time seismic data from USGS. View magnitude, location, and depth of recent earthquakes worldwide.
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Box>

        {/* Recent Earthquakes Preview */}
        <Box>
          <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 500, fontSize: "1.25rem", color: "text.primary", mb: 3 }}>
            Recent Seismic Activity
          </Typography>
          {loadingEarthquakes ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} height={64} sx={{ borderRadius: "8px" }} />
              ))}
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {recentQuakes.map((eq, index) => (
                <motion.div key={eq.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      p: 2,
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
                        width: 40,
                        height: 40,
                        borderRadius: "8px",
                        bgcolor: getMagnitudeColor(eq.properties.mag),
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
                      {eq.properties.mag?.toFixed(1)}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontSize: "0.875rem", fontWeight: 500, color: "text.primary", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {eq.properties.place || "Unknown location"}
                      </Typography>
                      <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
                        {formatTimeAgo(eq.properties.time)}
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>
              ))}
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};
