import React, { useState } from "react";
import { Container, Typography, Box, TextField, Card, CardMedia, CardContent, Button, InputAdornment, Skeleton, useTheme } from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAtlasStore, searchBooks, getBookCoverUrl, BookResult } from "../store/useAtlasStore";

const SUBJECTS = ["Fiction", "Science", "History", "Philosophy", "Technology", "Poetry", "Biography", "Adventure"];

export const Books: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { books, loadingBooks, setBooks, setLoadingBooks, error, setError } = useAtlasStore();
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = async (q: string) => {
    if (!q.trim()) return;
    setLoadingBooks(true);
    setError(null);
    setSearched(true);
    try {
      const results = await searchBooks(q);
      setBooks(results);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoadingBooks(false);
    }
  };

  const handleSubjectClick = (subject: string) => {
    setQuery(subject);
    handleSearch(subject);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch(query);
  };

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        <Typography
          sx={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 500, fontSize: { xs: "1.75rem", md: "2.25rem" }, letterSpacing: "-0.02em", color: "text.primary", mb: 1 }}
        >
          Open Library
        </Typography>
        <Typography sx={{ color: "text.secondary", mb: 3, lineHeight: 1.6 }}>
          Search millions of books from the world's largest open catalog.
        </Typography>

        <Box sx={{ display: "flex", gap: 1, mb: 4, flexWrap: "wrap" }}>
          <Button component="a" href="/atlas" variant="outlined" size="small" sx={{ textTransform: "none", fontWeight: 500 }}>Dashboard</Button>
          <Button component="a" href="/atlas/books" variant="contained" size="small" sx={{ textTransform: "none", fontWeight: 500 }}>Search Books</Button>
          <Button component="a" href="/atlas/subjects" variant="outlined" size="small" sx={{ textTransform: "none", fontWeight: 500 }}>Subjects</Button>
          <Button component="a" href="/atlas/new" variant="outlined" size="small" sx={{ textTransform: "none", fontWeight: 500 }}>New Arrivals</Button>
          <Button component="a" href="/atlas/earthquakes" variant="outlined" size="small" sx={{ textTransform: "none", fontWeight: 500 }}>Earthquakes</Button>
        </Box>

        <Box sx={{ display: "flex", gap: 1.5, mb: 3, flexWrap: "wrap" }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search for books..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{
              maxWidth: 500,
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                bgcolor: "background.paper",
                "&.Mui-focused fieldset": { borderColor: "primary.main" },
              },
            }}
          />
          <Button variant="contained" onClick={() => handleSearch(query)} disabled={!query.trim() || loadingBooks}>
            Search
          </Button>
        </Box>

        {!searched && (
          <Box sx={{ mb: 4 }}>
            <Typography sx={{ color: "text.secondary", fontSize: "0.8125rem", mb: 1.5, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Browse by Subject
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {SUBJECTS.map((s) => (
                <Button key={s} variant="outlined" size="small" onClick={() => handleSubjectClick(s)}
                  sx={{ borderRadius: "9999px", textTransform: "none", fontWeight: 500, fontSize: "0.8125rem" }}
                >
                  {s}
                </Button>
              ))}
            </Box>
          </Box>
        )}

        {error && <Typography sx={{ color: "error.main", mb: 3 }}>{error}</Typography>}

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(3, 1fr)", md: "repeat(4, 1fr)" }, gap: 2.5 }}>
          {loadingBooks
            ? Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} height={280} sx={{ borderRadius: "12px" }} />
              ))
            : books.map((book, index) => (
                <BookCard key={book.key} book={book} index={index} />
              ))}
        </Box>

        {!loadingBooks && searched && books.length === 0 && !error && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography sx={{ color: "text.secondary" }}>No books found. Try a different search.</Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

const SearchIcon = ({ sx }: any) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={sx}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const BookCard: React.FC<{ book: BookResult; index: number }> = ({ book, index }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
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
          overflow: "hidden",
          transition: "all 0.3s ease",
          "&:hover": { borderColor: "primary.main", boxShadow: isDark ? "0 2px 8px rgba(0,0,0,0.4)" : "0 1px 3px rgba(20,20,19,0.08)" },
        }}
      >
        {book.cover_i ? (
          <CardMedia component="img" height="180" image={getBookCoverUrl(book.cover_i, "M")} alt={book.title} sx={{ objectFit: "cover" }} />
        ) : (
          <Box sx={{ height: 180, bgcolor: "action.hover", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Typography sx={{ color: "text.secondary", fontSize: "0.75rem" }}>No Cover</Typography>
          </Box>
        )}
        <CardContent sx={{ p: 2.5, display: "flex", flexDirection: "column", flexGrow: 1 }}>
          <Typography sx={{ fontWeight: 500, fontSize: "0.875rem", color: "text.primary", mb: 0.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {book.title}
          </Typography>
          <Typography sx={{ fontSize: "0.75rem", color: "text.secondary", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", mb: 1 }}>
            {book.author_name?.[0] || "Unknown author"}
          </Typography>
          <Box sx={{ mt: "auto", display: "flex", gap: 1, flexWrap: "wrap" }}>
            {book.first_publish_year && (
              <Typography sx={{ fontSize: "0.6875rem", color: "text.secondary" }}>{book.first_publish_year}</Typography>
            )}
            {book.edition_count && (
              <Typography sx={{ fontSize: "0.6875rem", color: "text.secondary" }}>{book.edition_count} editions</Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};
