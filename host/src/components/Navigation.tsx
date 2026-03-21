import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Home as HomeIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentModule, setTheme } from "../store/slices/appSlice";
import { remoteRoutes } from "../routes/remoteRoutes";
import type { RootState } from "../store";

/**
 * Navigation component for the host application
 *
 * Provides responsive navigation with desktop and mobile drawer support.
 * Updates the current module in Redux store when navigating.
 * Includes a theme toggle for light/dark mode.
 */
export const Navigation: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const theme = useTheme();
  const mode = useSelector((state: RootState) => state.app.theme);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Home", icon: <HomeIcon /> },
    ...remoteRoutes.map((route) => ({
      path: route.path,
      label: route.label,
      icon: <DashboardIcon />,
    })),
  ];

  const isItemActive = (itemPath: string) => {
    if (itemPath === "/") {
      return location.pathname === "/";
    }
    return (
      location.pathname === itemPath ||
      location.pathname.startsWith(`${itemPath}/`)
    );
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavClick = (path: string, label: string) => {
    dispatch(setCurrentModule(label));
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleThemeToggle = () => {
    const newMode = mode === "light" ? "dark" : "light";
    dispatch(setTheme(newMode));
    localStorage.setItem("app-theme", newMode);
  };

  const drawer = (
    <Box
      sx={{
        width: 280,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Toolbar
        sx={{
          background: (theme) =>
            theme.palette.mode === "light"
              ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
              : "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
          color: "white",
        }}
      >
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
          Navigation
        </Typography>
        {isMobile && (
          <IconButton color="inherit" onClick={handleDrawerToggle}>
            <CloseIcon />
          </IconButton>
        )}
      </Toolbar>
      <List sx={{ py: 2, flexGrow: 1 }}>
        {navItems.map((item, index) => {
          const active = isItemActive(item.path);
          return (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={active}
                  onClick={() => handleNavClick(item.path, item.label)}
                  sx={{
                    mx: 2,
                    mb: 1,
                    borderRadius: 2,
                    "&.Mui-selected": {
                      background: (theme) =>
                        theme.palette.mode === "light"
                          ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
                          : "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
                      color: "white",
                      "&:hover": {
                        background: (theme) =>
                          theme.palette.mode === "light"
                            ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
                            : "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: active ? "white" : "inherit",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            </motion.div>
          );
        })}
      </List>

      <Box sx={{ p: 2, borderTop: "1px solid", borderColor: "divider" }}>
        <ListItemButton onClick={handleThemeToggle} sx={{ borderRadius: 2 }}>
          <ListItemIcon>
            {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
          </ListItemIcon>
          <ListItemText
            primary={mode === "light" ? "Dark Mode" : "Light Mode"}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: theme.palette.background.paper,
          borderBottom: "1px solid",
          borderColor: "divider",
          backdropFilter: "blur(10px)",
          color: theme.palette.text.primary,
        }}
      >
        <Toolbar sx={{ px: { xs: 2, md: 4 } }}>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            onClick={() => handleNavClick("/", "Home")}
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              background: (theme) =>
                theme.palette.mode === "light"
                  ? "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)"
                  : "linear-gradient(135deg, #4f46e5 0%, #9d174d 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            🚀 Micro-Frontend Demo
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, md: 1 } }}>
            {!isMobile && (
              <Box sx={{ display: "flex", gap: 1, mr: 2 }}>
                {navItems.map((item) => {
                  const active = isItemActive(item.path);
                  return (
                    <Button
                      key={item.path}
                      component={Link}
                      to={item.path}
                      variant={active ? "contained" : "text"}
                      onClick={() => handleNavClick(item.path, item.label)}
                      sx={{
                        borderRadius: 2,
                        px: 3,
                        textTransform: "none",
                        fontWeight: 600,
                        color: active ? "white" : "inherit",
                        ...(active && {
                          background: (theme) => theme.palette.mode === "light" ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" : "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
                          boxShadow: "0 4px 12px rgba(99, 102, 241, 0.4)",
                        }),
                      }}
                    >
                      {item.label}
                    </Button>
                  );
                })}
              </Box>
            )}

            <Tooltip
              title={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
            >
              <IconButton
                onClick={handleThemeToggle}
                color="inherit"
                sx={{
                  background:
                    mode === "light"
                      ? "rgba(0,0,0,0.04)"
                      : "rgba(255,255,255,0.08)",
                  "&:hover": {
                    background:
                      mode === "light"
                        ? "rgba(0,0,0,0.08)"
                        : "rgba(255,255,255,0.12)",
                  },
                }}
              >
                {mode === "light" ? (
                  <DarkModeIcon fontSize="small" />
                ) : (
                  <LightModeIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
        >
          {drawer}
        </Drawer>
      )}
    </>
  );
};
