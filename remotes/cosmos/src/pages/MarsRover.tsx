import React, { useEffect, useState } from "react";
import { Container, Typography, Box, Card, CardMedia, CardContent, Chip, Skeleton, TextField, MenuItem, useTheme, IconButton, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Refresh as RefreshIcon, OpenInNew as OpenInNewIcon } from "@mui/icons-material";
import { useMarsStore, fetchMarsPhotos, MARS_ROVERS, MarsPhoto } from "../store/useMarsStore";

export const MarsRover: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { photos, loading, error, setPhotos, setLoading, setError } = useMarsStore();
  const [selectedRover, setSelectedRover] = useState("Curiosity");
  const [sol, setSol] = useState(3718);

  useEffect(() => {
    loadPhotos();
  }, [selectedRover, sol]);

  const loadPhotos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMarsPhotos(selectedRover, sol);
      setPhotos(data.slice(0, 24));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2, mb: 3 }}>
            <Box>
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
                Mars Rover Photos
              </Typography>
              <Typography sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                Images captured by NASA's Mars rovers — Curiosity and Perseverance.
              </Typography>
            </Box>
            <IconButton onClick={loadPhotos} disabled={loading} sx={{ color: "primary.main" }}>
              <RefreshIcon />
            </IconButton>
          </Box>

          <Box sx={{ display: "flex", gap: 1, mb: 3, flexWrap: "wrap" }}>
            <Button component={Link} to="/cosmos" variant="outlined" size="small" sx={{ textTransform: "none", fontWeight: 500 }}>APOD</Button>
            <Button component={Link} to="/cosmos/mars" variant="contained" size="small" sx={{ textTransform: "none", fontWeight: 500 }}>Mars Rover</Button>
            <Button component={Link} to="/cosmos/epic" variant="outlined" size="small" sx={{ textTransform: "none", fontWeight: 500 }}>EPIC Earth</Button>
          </Box>

          <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
            <TextField
              select
              size="small"
              label="Rover"
              value={selectedRover}
              onChange={(e) => setSelectedRover(e.target.value)}
              sx={{ minWidth: 180 }}
            >
              {MARS_ROVERS.map((rover) => (
                <MenuItem key={rover} value={rover}>{rover}</MenuItem>
              ))}
            </TextField>
            <TextField
              size="small"
              type="number"
              label="Sol (Martian Day)"
              value={sol}
              onChange={(e) => setSol(Number(e.target.value))}
              inputProps={{ min: 1, max: 4000 }}
              sx={{ minWidth: 160 }}
            />
          </Box>
        </Box>

        {error && (
          <Box sx={{ p: 3, bgcolor: "error.light", border: "1px solid", borderColor: "error.main", borderRadius: "8px", mb: 4 }}>
            <Typography sx={{ color: "error.main" }}>{error}</Typography>
          </Box>
        )}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
            gap: 3,
          }}
        >
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} variant="rectangular" height={320} sx={{ borderRadius: "12px" }} />
              ))
            : photos.map((photo, index) => (
                <MarsPhotoCard key={photo.id} photo={photo} index={index} />
              ))}
        </Box>

        {!loading && photos.length === 0 && !error && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography sx={{ color: "text.secondary", fontSize: "1.125rem" }}>
              No photos found for this sol. Try a different number.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

const MarsPhotoCard: React.FC<{ photo: MarsPhoto; index: number }> = ({ photo, index }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -4 }}
      style={{ height: "100%", display: "flex" }}
    >
      <Card
        elevation={0}
        sx={{
          height: "100%",
          width: "100%",
          borderRadius: "12px",
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          display: "flex",
          flexDirection: "column",
          transition: "all 0.3s ease",
          overflow: "hidden",
          "&:hover": {
            boxShadow: isDark ? "0 2px 8px rgba(0,0,0,0.4)" : "0 1px 3px rgba(20,20,19,0.08)",
            borderColor: "primary.main",
          },
        }}
      >
        <CardMedia
          component="img"
          height="200"
          image={photo.img_src}
          alt={photo.camera?.full_name || "Mars photo"}
          sx={{ objectFit: "cover" }}
        />
        <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", flexGrow: 1 }}>
          <Box sx={{ display: "flex", gap: 1, mb: 1.5, flexWrap: "wrap" }}>
            <Chip
              label={photo.rover?.name || "Rover"}
              size="small"
              sx={{ bgcolor: "primary.main", color: "primary.contrastText", fontWeight: 500, fontSize: "0.6875rem", height: "22px" }}
            />
            {photo.camera && (
              <Chip
                label={photo.camera.name}
                size="small"
                variant="outlined"
                sx={{ fontWeight: 500, fontSize: "0.6875rem", height: "22px" }}
              />
            )}
          </Box>
          <Typography
            sx={{
              fontFamily: '"Cormorant Garamond", serif',
              fontWeight: 500,
              fontSize: "1.125rem",
              color: "text.primary",
              mb: 1,
              lineHeight: 1.3,
            }}
          >
            {photo.camera?.full_name || "Mars Surface"}
          </Typography>
          <Typography sx={{ color: "text.secondary", fontSize: "0.8125rem", mb: 2, flexGrow: 1 }}>
            Sol {photo.sol} — {photo.earth_date}
          </Typography>
          <Box
            component="a"
            href={photo.img_src}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
              color: "primary.main",
              fontWeight: 500,
              fontSize: "0.8125rem",
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            View Full Size <OpenInNewIcon sx={{ fontSize: "0.875rem" }} />
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};
