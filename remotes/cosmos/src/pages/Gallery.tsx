import React, { useEffect, useState } from "react";
import { Container, Typography, Box, Button, Card, CardMedia, CardContent, Chip, Skeleton, TextField, IconButton, useTheme } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search as SearchIcon, ArrowForward as ArrowForwardIcon, Refresh as RefreshIcon } from "@mui/icons-material";
import { useCosmosStore, fetchInitialPhotos, ApodData } from "../store/useCosmosStore";

export const Gallery: React.FC = () => {
  const theme = useTheme();
  const { photos, loading, error, setPhotos, setLoading, setError } = useCosmosStore();
  const [searchDate, setSearchDate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (photos.length === 0) loadInitial();
  }, []);

  const loadInitial = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchInitialPhotos();
      setPhotos(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchDate) navigate(`/cosmos/apod/${searchDate}`);
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
                Astronomy Picture of the Day
              </Typography>
              <Typography sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                NASA's daily featured space imagery with scientific explanations.
              </Typography>
            </Box>
            <IconButton onClick={loadInitial} disabled={loading} sx={{ color: "primary.main" }}>
              <RefreshIcon />
            </IconButton>
          </Box>

          <Box sx={{ display: "flex", gap: 1, mb: 3, flexWrap: "wrap" }}>
            <Button
              component={Link}
              to="/cosmos"
              variant="contained"
              size="small"
              sx={{ textTransform: "none", fontWeight: 500 }}
            >
              APOD
            </Button>
            <Button
              component={Link}
              to="/cosmos/mars"
              variant="outlined"
              size="small"
              sx={{ textTransform: "none", fontWeight: 500 }}
            >
              Mars Rover
            </Button>
            <Button
              component={Link}
              to="/cosmos/epic"
              variant="outlined"
              size="small"
              sx={{ textTransform: "none", fontWeight: 500 }}
            >
              EPIC Earth
            </Button>
          </Box>

          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              type="date"
              size="small"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{
                max: new Date(Date.now() - 86400000).toISOString().split("T")[0],
                min: "1995-06-16",
              }}
              sx={{
                flex: 1,
                maxWidth: 280,
                "& input[type='date']::-webkit-calendar-picker-indicator": {
                  filter: theme.palette.mode === "dark" ? "invert(0.7)" : "none",
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              disabled={!searchDate}
              sx={{ minWidth: 44 }}
            >
              <SearchIcon sx={{ fontSize: "1.125rem" }} />
            </Button>
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
                <Skeleton key={i} variant="rectangular" height={360} sx={{ borderRadius: "12px" }} />
              ))
            : photos.map((photo, index) => (
                <GalleryCard key={photo.date} photo={photo} index={index} />
              ))}
        </Box>

        {!loading && photos.length === 0 && !error && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography sx={{ color: "text.secondary", fontSize: "1.125rem" }}>
              No pictures available. Try refreshing.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

const GalleryCard: React.FC<{ photo: ApodData; index: number }> = ({ photo, index }) => {
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
        component={Link}
        to={`/cosmos/apod/${photo.date}`}
        elevation={0}
        sx={{
          height: "100%",
          width: "100%",
          textDecoration: "none",
          color: "inherit",
          borderRadius: "12px",
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          display: "flex",
          flexDirection: "column",
          transition: "all 0.3s ease",
          overflow: "hidden",
          "&:hover": {
            boxShadow: isDark
              ? "0 2px 8px rgba(0,0,0,0.4)"
              : "0 1px 3px rgba(20,20,19,0.08)",
            borderColor: "primary.main",
          },
        }}
      >
        {photo.media_type === "image" ? (
          <CardMedia
            component="img"
            height="200"
            image={photo.thumbnail_url || photo.url}
            alt={photo.title}
            sx={{ objectFit: "cover" }}
          />
        ) : (
          <Box sx={{ height: 200, bgcolor: "background.default", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Typography sx={{ color: "text.secondary", fontFamily: '"JetBrains Mono", monospace', fontSize: "0.875rem" }}>
              Video Content
            </Typography>
          </Box>
        )}
        <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", flexGrow: 1 }}>
          <Chip
            label={photo.date}
            size="small"
            sx={{ alignSelf: "flex-start", mb: 1.5, bgcolor: "primary.main", color: "primary.contrastText", fontWeight: 500, fontSize: "0.6875rem", height: "22px" }}
          />
          <Typography
            sx={{
              fontFamily: '"Cormorant Garamond", serif',
              fontWeight: 500,
              fontSize: "1.125rem",
              color: "text.primary",
              mb: 1,
              lineHeight: 1.3,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {photo.title}
          </Typography>
          <Typography
            sx={{
              color: "text.secondary",
              fontSize: "0.8125rem",
              lineHeight: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              mb: 2,
              flexGrow: 1,
            }}
          >
            {photo.explanation}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", color: "primary.main", fontWeight: 500, fontSize: "0.8125rem" }}>
            <span>View Details</span>
            <ArrowForwardIcon sx={{ fontSize: "0.875rem", ml: 0.5 }} />
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};
