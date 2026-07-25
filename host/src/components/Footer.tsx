import React from "react";
import { Box, Link, Typography } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const CACHIVA_URL = "https://cachiva.vercel.app";

export function Footer(): React.ReactElement {
  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        px: { xs: 2, sm: 3 },
        py: 2.5,
        borderTop: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
        textAlign: "center",
      }}
    >
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: 0.75,
        }}
      >
        Explore the knowledge workspace in
        <Link
          href={CACHIVA_URL}
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
            fontWeight: 600,
          }}
        >
          Cachiva
          <OpenInNewIcon sx={{ fontSize: 15 }} aria-hidden="true" />
        </Link>
      </Typography>
    </Box>
  );
}
