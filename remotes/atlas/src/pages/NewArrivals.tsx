import React, { useEffect, useState } from "react";
import { Container, Typography, Box, Card, CardMedia, CardContent, Chip, Skeleton, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { useAtlasStore, BookResult, getBookCoverUrl } from "../store/useAtlasStore";

export const NewArrivals: React.FC = () => {
  const theme = useTheme();
  const { loadingBooks, setLoadingBooks, setError } = useAtlasStore();
  const [books, setBooks] = useState<BookResult[]>([]);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    setLoadingBooks(true);
    setError(null);
    try {
      const currentYear = new Date().getFullYear();
      const res = await fetch(
        `https://openlibrary.org/search.json?sort=new&publish_year=${currentYear}&limit=18`
      );
      if (!res.ok) throw new Error("Failed to fetch new arrivals");
      const data = await res.json();
      setBooks(data.docs || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoadingBooks(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        <Box sx={{ mb: 6 }}>
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
            New Arrivals
          </Typography>
          <Typography sx={{ color: "text.secondary", lineHeight: 1.6 }}>
            Recently added books to the Open Library collection.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
            gap: 3,
          }}
        >
          {loadingBooks
            ? Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} variant="rectangular" height={320} sx={{ borderRadius: "12px" }} />
              ))
            : books.map((book, index) => (
                <BookCard key={book.key} book={book} index={index} />
              ))}
        </Box>

        {!loadingBooks && books.length === 0 && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography sx={{ color: "text.secondary", fontSize: "1.125rem" }}>
              No new arrivals found.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

const BookCard: React.FC<{ book: BookResult; index: number }> = ({ book, index }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const coverUrl = book.cover_i ? getBookCoverUrl(book.cover_i, "M") : null;

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
        {coverUrl ? (
          <CardMedia
            component="img"
            height="180"
            image={coverUrl}
            alt={book.title}
            sx={{ objectFit: "cover" }}
          />
        ) : (
          <Box sx={{ height: 180, bgcolor: "background.default", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Typography sx={{ color: "text.secondary", fontSize: "0.875rem" }}>No Cover</Typography>
          </Box>
        )}
        <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", flexGrow: 1 }}>
          <Chip
            label={`${book.edition_count || 1} edition${(book.edition_count || 1) > 1 ? "s" : ""}`}
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
              flexGrow: 1,
            }}
          >
            {book.title}
          </Typography>
          <Typography sx={{ color: "text.secondary", fontSize: "0.8125rem" }}>
            {book.author_name?.[0] || "Unknown Author"}
            {book.first_publish_year && ` — ${book.first_publish_year}`}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
};
