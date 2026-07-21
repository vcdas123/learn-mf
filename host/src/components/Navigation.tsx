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
  Explore as ExploreIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentModule, setTheme } from "../store/slices/appSlice";
import { remoteRoutes } from "../routes/remoteRoutes";
import type { RootState } from "../store";

const SpikeMark: React.FC<{ size?: number; color?: string }> = ({
  size = 20,
  color = "currentColor",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    style={{ display: "inline-block", verticalAlign: "middle" }}
  >
    <line x1="12" y1="2" x2="12" y2="22" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="2" y1="12" x2="22" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

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
      icon: <ExploreIcon />,
    })),
  ];

  const isItemActive = (itemPath: string) => {
    if (itemPath === "/") return location.pathname === "/";
    return (
      location.pathname === itemPath ||
      location.pathname.startsWith(`${itemPath}/`)
    );
  };

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleNavClick = (path: string, label: string) => {
    dispatch(setCurrentModule(label));
    if (isMobile) setMobileOpen(false);
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
        bgcolor: "background.default",
      }}
    >
      <Toolbar
        sx={{
          bgcolor: "background.default",
          color: "text.primary",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexGrow: 1 }}>
          <SpikeMark size={18} color={mode === "light" ? "#141413" : "#faf9f5"} />
          <Typography
            variant="h6"
            sx={{
              fontFamily: '"Cormorant Garamond", serif',
              fontWeight: 500,
              letterSpacing: "-0.02em",
            }}
          >
            Discovery Hub
          </Typography>
        </Box>
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
                    borderRadius: "8px",
                    "&.Mui-selected": {
                      background: "primary.main",
                      color: "primary.contrastText",
                      "&:hover": {
                        background: "primary.dark",
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{ color: active ? "primary.contrastText" : "inherit", minWidth: 40 }}
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
        <ListItemButton onClick={handleThemeToggle} sx={{ borderRadius: "8px" }}>
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
          bgcolor: "background.default",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Toolbar sx={{ px: { xs: 2, md: 4 }, height: 64, justifyContent: "space-between" }}>
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
          <Box
            component={Link}
            to="/"
            onClick={() => handleNavClick("/", "Home")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              textDecoration: "none",
              color: "inherit",
              mr: 4,
            }}
          >
            <SpikeMark size={18} color={mode === "light" ? "#141413" : "#faf9f5"} />
            <Typography
              sx={{
                fontFamily: '"Cormorant Garamond", serif',
                fontWeight: 500,
                fontSize: "1.25rem",
                letterSpacing: "-0.02em",
                color: "text.primary",
                lineHeight: 1,
              }}
            >
              Discovery Hub
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, md: 1 } }}>
            {!isMobile && (
              <Box sx={{ display: "flex", gap: 0.5, mr: 2 }}>
                {navItems.map((item) => {
                  const active = isItemActive(item.path);
                  return (
                    <Button
                      key={item.path}
                      component={Link}
                      to={item.path}
                      onClick={() => handleNavClick(item.path, item.label)}
                      sx={{
                        borderRadius: "8px",
                        px: 2.5,
                        py: 1,
                        textTransform: "none",
                        fontWeight: 500,
                        fontSize: "0.875rem",
                        color: active ? "primary.main" : "text.secondary",
                        bgcolor: active
                          ? "rgba(204, 120, 92, 0.08)"
                          : "transparent",
                        "&:hover": {
                          bgcolor: "rgba(204, 120, 92, 0.08)",
                        },
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
                size="small"
                sx={{
                  width: 36,
                  height: 36,
                  color: "text.secondary",
                  "&:hover": {
                    bgcolor: "rgba(204, 120, 92, 0.08)",
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
          ModalProps={{ keepMounted: true }}
        >
          {drawer}
        </Drawer>
      )}
    </>
  );
};
