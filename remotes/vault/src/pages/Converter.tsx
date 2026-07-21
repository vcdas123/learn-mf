import React, { useState } from "react";
import { Container, Typography, Box, TextField, MenuItem, Card, CardContent, Button, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useVaultStore, fetchPrice } from "../store/useVaultStore";

const METALS = [
  { symbol: "XAU", name: "Gold" },
  { symbol: "XAG", name: "Silver" },
  { symbol: "XPT", name: "Platinum" },
  { symbol: "XPD", name: "Palladium" },
  { symbol: "HG", name: "Copper" },
];

const CURRENCIES = ["USD", "EUR", "GBP", "JPY", "INR", "AUD", "CHF", "CAD", "SGD", "HKD"];

export const Converter: React.FC = () => {
  const theme = useTheme();
  const { loading, setLoading, error, setError } = useVaultStore();
  const [from, setFrom] = useState("XAU");
  const [to, setTo] = useState("USD");
  const [amount, setAmount] = useState("1");
  const [result, setResult] = useState<{ fromPrice: number; toPrice: number; rate: number } | null>(null);

  const handleConvert = async () => {
    setLoading(true);
    setError(null);
    try {
      const fromData = await fetchPrice(from, "USD");
      const toData = to === "USD"
        ? { price: 1, currencySymbol: "$" }
        : await fetchPrice("USD", to);

      const fromPriceUSD = fromData.price;
      const amountNum = parseFloat(amount) || 1;

      let rate: number;
      let convertedAmount: number;

      if (to === "USD") {
        rate = fromPriceUSD;
        convertedAmount = amountNum * fromPriceUSD;
      } else {
        rate = fromPriceUSD * toData.price;
        convertedAmount = amountNum * fromPriceUSD * toData.price;
      }

      setResult({
        fromPrice: amountNum * fromPriceUSD,
        toPrice: convertedAmount,
        rate,
      });
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
            Metal Converter
          </Typography>
          <Typography sx={{ color: "text.secondary", lineHeight: 1.6, mb: 4 }}>
            Convert between precious metals and currencies. Real-time exchange rates.
          </Typography>

          <Box sx={{ display: "flex", gap: 1, mb: 4, flexWrap: "wrap" }}>
            <Button component={Link} to="/vault" variant="outlined" size="small" sx={{ textTransform: "none", fontWeight: 500 }}>Dashboard</Button>
            <Button component={Link} to="/vault/converter" variant="contained" size="small" sx={{ textTransform: "none", fontWeight: 500 }}>Converter</Button>
            <Button component={Link} to="/vault/karat" variant="outlined" size="small" sx={{ textTransform: "none", fontWeight: 500 }}>Karat</Button>
            <Button component={Link} to="/vault/history" variant="outlined" size="small" sx={{ textTransform: "none", fontWeight: 500 }}>History</Button>
          </Box>
        </Box>

        <Card elevation={0} sx={{ borderRadius: "12px", border: "1px solid", borderColor: "divider", bgcolor: "background.paper", mb: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(4, 1fr)" }, gap: 3, mb: 3 }}>
              <TextField
                select
                label="From"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                size="small"
              >
                {METALS.map((m) => (
                  <MenuItem key={m.symbol} value={m.symbol}>{m.name} ({m.symbol})</MenuItem>
                ))}
              </TextField>

              <TextField
                label="Amount (troy oz)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
                size="small"
                inputProps={{ min: 0, step: "any" }}
              />

              <TextField
                select
                label="To"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                size="small"
              >
                {CURRENCIES.map((c) => (
                  <MenuItem key={c} value={c}>{c}</MenuItem>
                ))}
              </TextField>

              <Button
                variant="contained"
                onClick={handleConvert}
                disabled={loading}
                sx={{ textTransform: "none", fontWeight: 500, height: "40px" }}
              >
                {loading ? "Converting..." : "Convert"}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {error && (
          <Box sx={{ p: 3, bgcolor: "error.light", border: "1px solid", borderColor: "error.main", borderRadius: "8px", mb: 4 }}>
            <Typography sx={{ color: "error.main" }}>{error}</Typography>
          </Box>
        )}

        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card elevation={0} sx={{ borderRadius: "12px", border: "1px solid", borderColor: "primary.main", bgcolor: "background.paper" }}>
              <CardContent sx={{ p: 4, textAlign: "center" }}>
                <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 500, fontSize: "2.5rem", color: "text.primary", mb: 1 }}>
                  {result.toPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {to}
                </Typography>
                <Typography sx={{ fontSize: "0.875rem", color: "text.secondary", mb: 1 }}>
                  {amount} {from} = {result.fromPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                </Typography>
                <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
                  1 {from} = {result.rate.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })} {to}
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </Container>
    </Box>
  );
};
