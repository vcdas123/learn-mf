import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Typography, Box, Button, Chip, Skeleton, useTheme } from "@mui/material";
import { ArrowBack as ArrowBackIcon, OpenInNew as OpenInNewIcon } from "@mui/icons-material";
import { motion } from "framer-motion";
import { fetchApodByDate, ApodData } from "../store/useCosmosStore";

export const Detail: React.FC = () => {
  const theme = useTheme();
  const { date } = useParams<{ date: string }>();
  const [photo, setPhoto] = useState<ApodData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (date) loadPhoto(date);
  }, [date]);

  const loadPhoto = async (d: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchApodByDate(d);
      setPhoto(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
        <Button
          component={Link}
          to="/cosmos"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 4, color: "primary.main", textTransform: "none", fontWeight: 500 }}
        >
          Back to Gallery
        </Button>

        {loading ? (
          <Box>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: "12px", mb: 3 }} />
            <Skeleton width="40%" height={40} sx={{ mb: 1 }} />
            <Skeleton width="60%" height={24} sx={{ mb: 3 }} />
            <Skeleton height={100} />
          </Box>
        ) : error ? (
          <Typography sx={{ color: "error.main" }}>{error}</Typography>
        ) : photo ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {photo.media_type === "image" ? (
              <Box
                component="img"
                src={photo.hdurl || photo.url}
                alt={photo.title}
                sx={{
                  width: "100%",
                  maxHeight: "60vh",
                  objectFit: "contain",
                  borderRadius: "12px",
                  mb: 4,
                  bgcolor: "background.default",
                }}
              />
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: 400,
                  bgcolor: "background.default",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 4,
                }}
              >
                <iframe
                  src={photo.url}
                  title={photo.title}
                  style={{ width: "100%", height: "100%", border: "none", borderRadius: "12px" }}
                  allowFullScreen
                />
              </Box>
            )}

            <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
              <Chip label={photo.date} sx={{ bgcolor: "primary.main", color: "primary.contrastText", fontWeight: 500 }} />
              {photo.copyright && (
                <Chip label={`\u00A9 ${photo.copyright}`} sx={{ bgcolor: "background.paper", color: "text.secondary" }} />
              )}
            </Box>

            <Typography
              sx={{
                fontFamily: '"Cormorant Garamond", serif',
                fontWeight: 500,
                fontSize: { xs: "1.5rem", md: "2rem" },
                letterSpacing: "-0.02em",
                color: "text.primary",
                mb: 3,
                lineHeight: 1.2,
              }}
            >
              {photo.title}
            </Typography>

            <Typography sx={{ color: "text.secondary", fontSize: "1rem", lineHeight: 1.75, mb: 4 }}>
              {photo.explanation}
            </Typography>

            {photo.hdurl && (
              <Button
                variant="outlined"
                endIcon={<OpenInNewIcon />}
                href={photo.hdurl}
                target="_blank"
              >
                View HD Image
              </Button>
            )}
          </motion.div>
        ) : null}
      </Container>
    </Box>
  );
};
