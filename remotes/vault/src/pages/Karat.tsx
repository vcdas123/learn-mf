import React, { useEffect, useState } from "react";
import { Container, Typography, Box, Card, CardContent, Skeleton, Button, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useVaultStore, fetchPrice, calculateKarat } from "../store/useVaultStore";

const KARAT_INFO = [
  { karat: 24, label: "24K", desc: "Pure gold (99.9%)", color: "#e8a55a" },
  { karat: 22, label: "22K", desc: "91.6% gold", color: "#d4a04e" },
  { karat: 21, label: "21K", desc: "87.5% gold", color: "#c49842" },
  { karat: 20, label: "20K", desc: "83.3% gold", color: "#b48f38" },
  { karat: 18, label: "18K", desc: "75.0% gold", color: "#a4862e" },
  { karat: 16, label: "16K", desc: "66.7% gold", color: "#947d24" },
  { karat: 14, label: "14K", desc: "58.3% gold", color: "#84741a" },
  { karat: 10, label: "10K", desc: "41.7% gold", color: "#747010" },
];

export const Karat: React.FC = () => {
  const theme = useTheme();
  const { loading, setLoading, error, setError } = useVaultStore();
  const [goldPrice, setGoldPrice] = useState<number | null>(null);

  useEffect(() => {
    loadGoldPrice();
  }, []);

  const loadGoldPrice = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPrice("XAU", "USD");
      setGoldPrice(data.price);
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
            Karat Pricing
          </Typography>
          <Typography sx={{ color: "text.secondary", lineHeight: 1.6, mb: 4 }}>
            Gold prices by purity level. Per-gram rates for all common karat standards.
          </Typography>

          <Box sx={{ display: "flex", gap: 1, mb: 4, flexWrap: "wrap" }}>
            <Button component={Link} to="/vault" variant="outlined" size="small" sx={{ textTransform: "none", fontWeight: 500 }}>Dashboard</Button>
            <Button component={Link} to="/vault/converter" variant="outlined" size="small" sx={{ textTransform: "none", fontWeight: 500 }}>Converter</Button>
            <Button component={Link} to="/vault/karat" variant="contained" size="small" sx={{ textTransform: "none", fontWeight: 500 }}>Karat</Button>
            <Button component={Link} to="/vault/history" variant="outlined" size="small" sx={{ textTransform: "none", fontWeight: 500 }}>History</Button>
          </Box>

          <Button variant="contained" onClick={loadGoldPrice} disabled={loading} sx={{ textTransform: "none", fontWeight: 500, mb: 4 }}>
            {loading ? "Loading..." : "Refresh"}
          </Button>

          {goldPrice && (
            <Typography sx={{ fontSize: "0.875rem", color: "text.secondary", mb: 2 }}>
              Base: 24K Gold = ${goldPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/oz
            </Typography>
          )}
        </Box>

        {error && (
          <Box sx={{ p: 3, bgcolor: "error.light", border: "1px solid", borderColor: "error.main", borderRadius: "8px", mb: 4 }}>
            <Typography sx={{ color: "error.main" }}>{error}</Typography>
          </Box>
        )}

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(4, 1fr)" }, gap: 2 }}>
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} variant="rectangular" height={120} sx={{ borderRadius: "12px" }} />
              ))
            : KARAT_INFO.map((info, index) => {
                const pricePerGram = goldPrice ? calculateKarat(goldPrice, info.karat) : null;
                return (
                  <motion.div key={info.karat} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                    <Card elevation={0} sx={{ borderRadius: "12px", border: "1px solid", borderColor: "divider", bgcolor: "background.paper", height: "100%" }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                          <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 500, fontSize: "1.25rem", color: "text.primary" }}>
                            {info.label}
                          </Typography>
                          <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: info.color }} />
                        </Box>
                        <Typography sx={{ fontSize: "0.75rem", color: "text.secondary", mb: 1 }}>
                          {info.desc}
                        </Typography>
                        <Typography sx={{ fontSize: "1rem", fontWeight: 500, color: "text.primary", fontFamily: '"JetBrains Mono", monospace' }}>
                          {pricePerGram !== null
                            ? `$${pricePerGram.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/g`
                            : "—"}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
        </Box>
      </Container>
    </Box>
  );
};
