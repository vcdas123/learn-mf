import React from "react";
import GradeList from "./pages/List";
import GradeCreate from "./pages/Create";
import GradeDetail from "./pages/Detail";
import GradeEdit from "./pages/Edit";
import GradeDashboard from "./pages/Dashboard";
import GradeStatistics from "./pages/Statistics";

// All paths are RELATIVE (no leading '/')
// These are nested under /grades/* (defined by host)
export const routes = [
  { path: "/", component: GradeList }, // Matches /grades/
  { path: "dashboard", component: GradeDashboard }, // Matches /grades/dashboard
  { path: "statistics", component: GradeStatistics }, // Matches /grades/statistics
  { path: "add", component: GradeCreate }, // Matches /grades/add
  { path: ":id/edit", component: GradeEdit }, // Matches /grades/:id/edit (must come before :id)
  { path: ":id", component: GradeDetail }, // Matches /grades/:id
];

export const defaultRoute = "/";
