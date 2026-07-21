import React, { useEffect, useState } from "react";
import { Container, Typography, Box, Card, CardMedia, CardContent, Chip, Skeleton, ToggleButton, ToggleButtonGroup, useTheme, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEpicStore, fetchEpicImages, getEpicImageUrl, EpicImage } from "../store/useEpicStore";

export const EpicImagery: React.FC = () => {
  const theme = useTheme();
  const { images, collection, loading, error, setImages, setCollection, setLoading, setError } = useEpicStore();

  useEffect(() => {
    loadImages();
  }, [collection]);

  const loadImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEpicImages(collection);
      setImages(data.slice(0, 18));
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
          <Box sx={{ mb: 4 }}>
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
              EPIC Earth Imagery
            </Typography>
            <Typography sx={{ color: "text.secondary", lineHeight: 1.6, maxWidth: 600, mb: 3 }}>
              Earth Polychromatic Imaging Camera — daily imagery of Earth from the DSCOVR satellite at the L1 Lagrange point.
            </Typography>

            <Box sx={{ display: "flex", gap: 1, mb: 3, flexWrap: "wrap" }}>
              <Button component={Link} to="/cosmos" variant="outlined" size="small" sx={{ textTransform: "none", fontWeight: 500 }}>APOD</Button>
              <Button component={Link} to="/cosmos/mars" variant="outlined" size="small" sx={{ textTransform: "none", fontWeight: 500 }}>Mars Rover</Button>
              <Button component={Link} to="/cosmos/epic" variant="contained" size="small" sx={{ textTransform: "none", fontWeight: 500 }}>EPIC Earth</Button>
            </Box>

          </Box>

          <ToggleButtonGroup
            value={collection}
            exclusive
            onChange={(_, value) => value && setCollection(value)}
            size="small"
            sx={{
              "& .MuiToggleButton-root": {
                textTransform: "none",
                fontWeight: 500,
                px: 3,
                "&.Mui-selected": {
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  "&:hover": { bgcolor: "primary.dark" },
                },
              },
            }}
          >
            <ToggleButton value="natural">Natural Color</ToggleButton>
            <ToggleButton value="enhanced">Enhanced Color</ToggleButton>
          </ToggleButtonGroup>
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
            : images.map((img, index) => (
                <EpicCard key={img.identifier} image={img} collection={collection} index={index} />
              ))}
        </Box>

        {!loading && images.length === 0 && !error && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography sx={{ color: "text.secondary", fontSize: "1.125rem" }}>
              No EPIC images available. Try switching collection type.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

const EpicCard: React.FC<{ image: EpicImage; collection: string; index: number }> = ({ image, collection, index }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const imgUrl = getEpicImageUrl(collection, image.date, image.image);
  const [imgLoaded, setImgLoaded] = useState(false);

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
        {!imgLoaded && (
          <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 0 }} animation="wave" />
        )}
        <CardMedia
          component="img"
          height="220"
          image={imgUrl}
          alt={image.caption}
          onLoad={() => setImgLoaded(true)}
          sx={{ objectFit: "cover", display: imgLoaded ? "block" : "none" }}
        />
        <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", flexGrow: 1 }}>
          <Chip
            label={collection === "natural" ? "Natural" : "Enhanced"}
            size="small"
            sx={{ alignSelf: "flex-start", mb: 1.5, bgcolor: "primary.main", color: "primary.contrastText", fontWeight: 500, fontSize: "0.6875rem", height: "22px" }}
          />
          <Typography
            sx={{
              fontFamily: '"Cormorant Garamond", serif',
              fontWeight: 500,
              fontSize: "1rem",
              color: "text.primary",
              mb: 1,
              lineHeight: 1.3,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              flexGrow: 1,
            }}
          >
            {image.caption}
          </Typography>
          <Typography sx={{ color: "text.secondary", fontSize: "0.8125rem" }}>
            {image.date.split(" ")[0]}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
};
