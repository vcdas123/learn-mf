import React from "react";
import ImageAnalyzerDashboard from "./pages/Dashboard";
import ImageAnalyzerAnalyze from "./pages/Analyze";

export const routes = [
  { path: "/", component: ImageAnalyzerDashboard },
  { path: "analyze", component: ImageAnalyzerAnalyze },
];

export const defaultRoute = "/";
