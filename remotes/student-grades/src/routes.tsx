import React from "react";
import GradeList from "./pages/List";
import GradeCreate from "./pages/Create";
import GradeDetail from "./pages/Detail";
import GradeEdit from "./pages/Edit";
import GradeDashboard from "./pages/Dashboard";
import GradeStatistics from "./pages/Statistics";

// All paths are RELATIVE (no leading '/')
// These are nested under /student-grades/* (defined by host)
export const routes = [
  { path: "/", component: GradeList }, // Matches /student-grades/
  { path: "dashboard", component: GradeDashboard }, // Matches /student-grades/dashboard
  { path: "statistics", component: GradeStatistics }, // Matches /student-grades/statistics
  { path: "add", component: GradeCreate }, // Matches /student-grades/add
  { path: ":id/edit", component: GradeEdit }, // Matches /student-grades/:id/edit (must come before :id)
  { path: ":id", component: GradeDetail }, // Matches /student-grades/:id
];

export const defaultRoute = "/";
