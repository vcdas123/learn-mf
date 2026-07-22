import React from "react";
import { Box, Link, Typography } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const PROJECT_DETAILS_URL =
  "https://learning-hub-frontend-gamma.vercel.app/discovery-hub-39-6c0c8e0b/discovery-hub-742-d5b8a147-1784707949";

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
        Learn more about the architecture, implementation, and deployment in the
        <Link
          href={PROJECT_DETAILS_URL}
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
          project details
          <OpenInNewIcon sx={{ fontSize: 15 }} aria-hidden="true" />
        </Link>
      </Typography>
    </Box>
  );
}
