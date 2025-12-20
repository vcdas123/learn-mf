import React from "react";
import AiVisionDashboard from "./pages/Dashboard";
import AiVisionAnalyze from "./pages/Analyze";

export const routes = [
  { path: "/", component: AiVisionDashboard },
  { path: "analyze", component: AiVisionAnalyze },
];

export const defaultRoute = "/";
